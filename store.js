/* ------------------------------------------------------------------
   store.js — the persistence + change-history layer.

   This is what the original page was missing. It exposes one Store object
   with the same shape whether the data lives in Supabase (shared across the
   team, survives everything) or in localStorage (this browser only, used as
   a fallback so the page is never dead).

   Two kinds of record are tracked:
     • weeks    — the 38 weekly sprint numbers, saved as a batch
     • trackers — the per-row status on the IP / association / channel /
                  vertical tables, saved the moment it is changed

   Both write into ONE append-only `change_log`, so the history section reads
   as a single timeline of everything the team did. Every entry records who,
   when, and a field-by-field diff against the previous value. Nothing in
   `change_log` is ever updated or deleted — restoring writes a NEW entry
   whose diff shows the rollback.
   ------------------------------------------------------------------ */

import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js';
import { FORM_IDS, FIELD_LABELS, TEXT_FIELDS } from './data.js';

const LS_WEEKS    = 'fuelshine.weeks.v1';
const LS_TRACKERS = 'fuelshine.trackers.v1';
const LS_LOG      = 'fuelshine.changelog.v1';

export const MODE = (SUPABASE_URL && SUPABASE_ANON_KEY) ? 'supabase' : 'local';

/* ---------- diffing ---------- */

function normalize(v, id){
  if (v === undefined || v === null) return TEXT_FIELDS.has(id) ? '' : 0;
  return TEXT_FIELDS.has(id) ? String(v) : (Number(v) || 0);
}

/** Diff of the weekly form. Returns [{field, label, from, to}] for changed fields only. */
export function diffWeek(prev, next){
  const out = [];
  for (const id of FORM_IDS){
    const a = normalize(prev ? prev[id] : undefined, id);
    const b = normalize(next ? next[id] : undefined, id);
    if (String(a) !== String(b)) out.push({ field:id, label:FIELD_LABELS[id] || id, from:a, to:b });
  }
  return out;
}

/** Diff of a tracker row: status and free-text note. */
function diffTracker(prev, next){
  const out = [];
  const pairs = [['status','Status'], ['note','Note']];
  for (const [k, label] of pairs){
    const a = (prev && prev[k] != null) ? String(prev[k]) : '';
    const b = (next && next[k] != null) ? String(next[k]) : '';
    if (a !== b) out.push({ field:k, label, from:a, to:b, kind:'tracker' });
  }
  return out;
}

/* ---------- Supabase REST ---------- */

function sbHeaders(extra){
  return Object.assign({
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
    'Content-Type': 'application/json'
  }, extra || {});
}

async function sbFetch(path, opts){
  const res = await fetch(SUPABASE_URL.replace(/\/$/,'') + '/rest/v1/' + path, opts);
  if (!res.ok){
    const body = await res.text().catch(()=> '');
    throw new Error('Supabase ' + res.status + ': ' + body.slice(0, 300));
  }
  if (res.status === 204) return null;
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

/* ---------- localStorage helpers ---------- */

function lsRead(key, fallback){
  try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; }
  catch { return fallback; }
}
function lsWrite(key, val){
  try { localStorage.setItem(key, JSON.stringify(val)); return true; }
  catch { return false; }
}

/* ---------- shared log writer ---------- */

async function appendLog(entry){
  if (MODE === 'supabase'){
    await sbFetch('change_log', {
      method:'POST', headers: sbHeaders({ 'Prefer':'return=minimal' }), body: JSON.stringify(entry)
    });
    return;
  }
  const log = lsRead(LS_LOG, []);
  log.push(Object.assign({ id: entry.created_at + '-' + entry.ref_key }, entry));
  if (!lsWrite(LS_LOG, log)) throw new Error('Browser storage is full or blocked — nothing was saved.');
}

async function nextVersion(scope, refKey){
  if (MODE === 'supabase'){
    const rows = await sbFetch(
      'change_log?select=version_no&scope=eq.' + scope + '&ref_key=eq.' +
      encodeURIComponent(refKey) + '&order=version_no.desc&limit=1',
      { headers: sbHeaders() }
    );
    return (rows && rows.length ? Number(rows[0].version_no) : 0) + 1;
  }
  return lsRead(LS_LOG, [])
    .filter(r => r.scope === scope && r.ref_key === refKey).length + 1;
}

/* ---------- public API ---------- */

export const Store = {
  mode: MODE,

  /* ===== weekly numbers ===== */

  async loadWeeks(){
    if (MODE === 'supabase'){
      const rows = await sbFetch('weeks?select=week_num,data,updated_at,updated_by&order=week_num.asc',
        { headers: sbHeaders() });
      return (rows || []).map(r => Object.assign({}, r.data, {
        weekNum:r.week_num, updatedAt:r.updated_at, updatedBy:r.updated_by }));
    }
    const map = lsRead(LS_WEEKS, {});
    return Object.keys(map).map(k => map[k]).sort((a,b)=> a.weekNum - b.weekNum);
  },

  async loadWeek(n){
    const all = await this.loadWeeks();
    return all.find(w => Number(w.weekNum) === Number(n)) || null;
  },

  async saveWeek(n, values, editor, note){
    const prev = await this.loadWeek(n);
    const changes = diffWeek(prev, values);
    const payload = Object.assign({}, values, { weekNum: Number(n) });
    const now = new Date().toISOString();
    const versionNo = await nextVersion('week', String(n));

    await appendLog({
      scope:'week', ref_key:String(n), ref_label:'Week ' + n,
      version_no:versionNo, data:payload, changes,
      editor: editor || 'unknown', note: note || null, created_at: now
    });

    if (MODE === 'supabase'){
      await sbFetch('weeks', {
        method:'POST', headers: sbHeaders({ 'Prefer':'resolution=merge-duplicates,return=minimal' }),
        body: JSON.stringify({ week_num:Number(n), data:payload, updated_at:now, updated_by:editor||'unknown' })
      });
    } else {
      const weeks = lsRead(LS_WEEKS, {});
      weeks[n] = Object.assign({}, payload, { updatedAt:now, updatedBy:editor||'unknown' });
      if (!lsWrite(LS_WEEKS, weeks)) throw new Error('Browser storage is full or blocked.');
    }
    return { changes, versionNo };
  },

  /* ===== status trackers ===== */

  /** All tracker rows as { key: {status, note, updatedAt, updatedBy} }. */
  async loadTrackers(){
    if (MODE === 'supabase'){
      const rows = await sbFetch('trackers?select=item_key,status,note,updated_at,updated_by',
        { headers: sbHeaders() });
      const out = {};
      (rows||[]).forEach(r => { out[r.item_key] = {
        status:r.status || '', note:r.note || '', updatedAt:r.updated_at, updatedBy:r.updated_by }; });
      return out;
    }
    return lsRead(LS_TRACKERS, {});
  },

  /**
   * Save one tracker row. Only writes if something actually changed, so
   * clicking a dropdown back to its current value does not spam the log.
   * @returns {{changes:Array, versionNo:number|null}}
   */
  async saveTracker(key, label, values, editor){
    const all = await this.loadTrackers();
    const prev = all[key] || null;
    const next = { status: values.status || '', note: values.note || '' };
    const changes = diffTracker(prev, next);
    if (!changes.length) return { changes: [], versionNo: null };

    const now = new Date().toISOString();
    const versionNo = await nextVersion('tracker', key);

    await appendLog({
      scope:'tracker', ref_key:key, ref_label:label,
      version_no:versionNo, data:next, changes,
      editor: editor || 'unknown', note: null, created_at: now
    });

    if (MODE === 'supabase'){
      await sbFetch('trackers', {
        method:'POST', headers: sbHeaders({ 'Prefer':'resolution=merge-duplicates,return=minimal' }),
        body: JSON.stringify({ item_key:key, status:next.status, note:next.note,
          updated_at:now, updated_by:editor||'unknown' })
      });
    } else {
      all[key] = Object.assign({}, next, { updatedAt:now, updatedBy:editor||'unknown' });
      if (!lsWrite(LS_TRACKERS, all)) throw new Error('Browser storage is full or blocked.');
    }
    return { changes, versionNo };
  },

  /* ===== history ===== */

  /** Unified change log, newest first. filter: {scope, refKey, from, to, archived}. */
  async loadHistory(filter){
    const f = filter || {};
    if (MODE === 'supabase'){
      let q = 'change_log?select=id,scope,ref_key,ref_label,version_no,data,changes,editor,note,created_at,archived';
      if (f.scope)  q += '&scope=eq.' + f.scope;
      if (f.refKey) q += '&ref_key=eq.' + encodeURIComponent(f.refKey);
      if (f.from)   q += '&created_at=gte.' + encodeURIComponent(f.from);
      if (f.to)     q += '&created_at=lte.' + encodeURIComponent(f.to);
      q += '&archived=is.' + (f.archived ? 'true' : 'false');
      q += '&order=created_at.desc&limit=500';
      return (await sbFetch(q, { headers: sbHeaders() })) || [];
    }
    let rows = lsRead(LS_LOG, []);
    rows = rows.filter(r => Boolean(r.archived) === Boolean(f.archived));
    if (f.scope)  rows = rows.filter(r => r.scope === f.scope);
    if (f.refKey) rows = rows.filter(r => String(r.ref_key) === String(f.refKey));
    if (f.from)   rows = rows.filter(r => r.created_at >= f.from);
    if (f.to)     rows = rows.filter(r => r.created_at <= f.to);
    return rows.sort((a,b)=> (a.created_at < b.created_at ? 1 : -1)).slice(0, 500);
  },

  /** How many entries exist, split live vs archived — drives the counters. */
  async historyCounts(){
    if (MODE === 'supabase'){
      const head = async archived => {
        const res = await fetch(
          SUPABASE_URL.replace(/\/$/,'') + '/rest/v1/change_log?select=id&archived=is.' + archived,
          { headers: sbHeaders({ 'Prefer':'count=exact', 'Range':'0-0' }) }
        );
        const cr = res.headers.get('content-range') || '';
        return Number((cr.split('/')[1]) || 0);
      };
      return { live: await head('false'), archived: await head('true') };
    }
    const rows = lsRead(LS_LOG, []);
    return {
      live: rows.filter(r=>!r.archived).length,
      archived: rows.filter(r=>r.archived).length
    };
  },

  /**
   * Archive entries older than a cutoff. Archiving HIDES rows from the
   * default view; it never destroys them, so the audit trail stays whole
   * and can be brought back by viewing the archive.
   * @returns {number} how many were archived
   */
  async archiveOlderThan(cutoffISO){
    const doomed = await this.loadHistory({ to: cutoffISO });
    if (!doomed.length) return 0;

    if (MODE === 'supabase'){
      await sbFetch('change_log?created_at=lte.' + encodeURIComponent(cutoffISO) + '&archived=is.false', {
        method:'PATCH', headers: sbHeaders({ 'Prefer':'return=minimal' }),
        body: JSON.stringify({ archived: true })
      });
      return doomed.length;
    }
    const rows = lsRead(LS_LOG, []);
    let n = 0;
    rows.forEach(r => { if (!r.archived && r.created_at <= cutoffISO){ r.archived = true; n++; } });
    lsWrite(LS_LOG, rows);
    return n;
  },

  /** Bring archived entries back into the live view. */
  async unarchiveAll(){
    if (MODE === 'supabase'){
      await sbFetch('change_log?archived=is.true', {
        method:'PATCH', headers: sbHeaders({ 'Prefer':'return=minimal' }),
        body: JSON.stringify({ archived: false })
      });
      return;
    }
    const rows = lsRead(LS_LOG, []);
    rows.forEach(r => { r.archived = false; });
    lsWrite(LS_LOG, rows);
  },

  /**
   * Permanently delete archived entries. This is the only destructive
   * operation in the tool and cannot be undone — the UI exports first and
   * demands a typed confirmation before calling it.
   * @returns {number} how many were deleted
   */
  async purgeArchived(){
    const doomed = await this.loadHistory({ archived:true });
    if (!doomed.length) return 0;
    if (MODE === 'supabase'){
      await sbFetch('change_log?archived=is.true', {
        method:'DELETE', headers: sbHeaders({ 'Prefer':'return=minimal' })
      });
      return doomed.length;
    }
    const rows = lsRead(LS_LOG, []).filter(r => !r.archived);
    lsWrite(LS_LOG, rows);
    return doomed.length;
  },

  /** Re-save an old version's values as a new version. History is never destroyed. */
  async restoreVersion(entry, editor){
    if (entry.scope === 'week'){
      const vals = {};
      FORM_IDS.forEach(id => { vals[id] = entry.data ? entry.data[id] : undefined; });
      return this.saveWeek(Number(entry.ref_key), vals, editor,
        'Restored from version ' + entry.version_no);
    }
    return this.saveTracker(entry.ref_key, entry.ref_label, {
      status: entry.data ? entry.data.status : '',
      note:   entry.data ? entry.data.note   : ''
    }, editor);
  },

  async exportAll(){
    return {
      exportedAt: new Date().toISOString(),
      mode: MODE,
      weeks: await this.loadWeeks(),
      trackers: await this.loadTrackers(),
      history: await this.loadHistory()
    };
  },

  async healthCheck(){
    if (MODE !== 'supabase'){
      return 'Not connected to a database — data is saved in this browser only, on this device. ' +
             'Add your Supabase URL and anon key in assets/config.js to share it with the team.';
    }
    try { await sbFetch('weeks?select=week_num&limit=1', { headers: sbHeaders() }); return null; }
    catch (e){ return 'Cannot reach the database: ' + e.message; }
  }
};
