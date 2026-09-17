/* ------------------------------------------------------------------
   app.js — rendering + wiring.
   All persistence goes through Store (assets/store.js).
   ------------------------------------------------------------------ */

import {
  START, WEEKS, FLOOR, STRETCH, CAC_FLEET_CEIL, CAC_SUB_CEIL, FR_FLOOR,
  PHASES, CHANNELS, ASSOC_PRIORITY, ASSOC_WATCHLIST, VERTICALS, GF_VERTICALS,
  LENSES, RULES, TEAM, GAPS, LEADLINES, DISCOVERY, OBJECTIONS, MOAT_ROWS,
  FORM_IDS, FIELD_KINDS, TEXT_FIELDS,
  STATUS_SETS, TRACKER_GROUPS, statusLabel, statusClass
} from './data.js';
import { EDITORS } from './config.js';
import { Store } from './store.js';

/* ---------- formatting ---------- */
const fmt$ = n => '$' + Math.round(n).toLocaleString('en-US');
const pct  = n => Math.round(n*100) + '%';
const esc  = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

function fmtValue(id, v){
  const kind = FIELD_KINDS[id];
  if (kind === 'money') return fmt$(Number(v)||0);
  if (kind === 'pct')   return (Number(v)||0) + '%';
  if (kind === 'bool')  return String(v) === '1' ? 'Secured' : 'Not yet';
  if (kind === 'text')  return (v === '' || v == null) ? '(blank)' : String(v);
  return String(Number(v)||0);
}

function todayInfo(){
  const now = new Date();
  const dayNum = Math.floor((now - START)/86400000) + 1;
  let currentWeek = 0;
  for (const w of WEEKS){
    const mon = new Date(w.monday+'T00:00:00Z');
    const sun = new Date(mon.getTime() + 6*86400000);
    if (now >= mon && now <= sun){ currentWeek = w.n; break; }
    if (now > sun) currentWeek = w.n;
  }
  return { dayNum: Math.max(1, Math.min(91, dayNum)), currentWeek };
}

/* ---------- static shell ---------- */

function renderStaticShell(){
  document.getElementById('dayNum').textContent = todayInfo().dayNum;

  const today = new Date();
  const ranges = [
    [new Date('2026-09-10'), new Date('2026-10-09')],
    [new Date('2026-10-10'), new Date('2026-11-08')],
    [new Date('2026-11-09'), new Date('2026-12-08')]
  ];
  document.getElementById('phaseGrid').innerHTML = PHASES.map((p,i)=>{
    const isCurrent = today >= ranges[i][0] && today <= ranges[i][1];
    return `<div class="card phase${isCurrent?' current':''}">
      <div class="tag">${p.tag}${isCurrent?' &middot; NOW':''}</div>
      <div class="dates">${p.dates}</div>
      <h4>Grey fleet</h4><ul>${p.gf.map(it=>`<li>${it}</li>`).join('')}</ul>
      <h4>Fuel verification</h4><ul>${p.fv.map(it=>`<li>${it}</li>`).join('')}</ul>
      <h4>Fundraising</h4><ul>${p.fr.map(it=>`<li>${it}</li>`).join('')}</ul>
    </div>`;
  }).join('');

  document.getElementById('assocWatchlistBody').innerHTML = ASSOC_WATCHLIST.map(w=>
    `<tr><td style="white-space:normal; min-width:220px;">${w[0]}</td><td style="white-space:normal; min-width:300px;">${w[1]}</td></tr>`
  ).join('');

  document.getElementById('lensGrid').innerHTML = LENSES.map(l=>
    `<div class="card navy"><h3>${l[0]}</h3><div style="font-size:var(--fs-sm);">${l[1]}</div></div>`
  ).join('');

  document.getElementById('rulesGrid').innerHTML = RULES.map(r=>
    `<div class="rule"><span class="ico">&#8594;</span><span>${r}</span></div>`
  ).join('');

  document.getElementById('teamGrid').innerHTML = TEAM.map(t=>
    `<div class="person"><div class="avatar">${t[0]}</div><div><div class="name">${t[1]}</div><div class="role">${t[2]}</div>${t[3]?`<div class="gap">&#9888; ${t[3]}</div>`:''}</div></div>`
  ).join('');

  document.getElementById('gapList').innerHTML = GAPS.map(g=>
    `<div class="gapitem"><b>${g[0]}</b>${g[1]}</div>`
  ).join('');

  document.getElementById('leadlineBody').innerHTML = LEADLINES.map(l=>
    `<tr><td>${l[0]}</td><td style="white-space:normal;">${l[1]}</td></tr>`
  ).join('');

  document.getElementById('discoveryList').innerHTML = DISCOVERY.map(d=>`<li style="margin-bottom:6px;">${d}</li>`).join('');

  document.getElementById('objectionList').innerHTML = OBJECTIONS.map(o=>
    `<div style="margin-bottom:10px;"><b style="font-family:var(--display);">${o[0]}</b><div style="color:var(--muted); margin-top:2px;">${o[1]}</div></div>`
  ).join('');

  const cw = todayInfo().currentWeek || 1;
  const weekOpts = WEEKS.map(w=>{
    const d = new Date(w.monday+'T00:00:00Z');
    const label = d.toLocaleDateString('en-US',{month:'short',day:'numeric'});
    return `<option value="${w.n}" ${w.n===cw?'selected':''}>Week ${w.n} &mdash; ${label}</option>`;
  }).join('');
  document.getElementById('weekSelect').innerHTML = weekOpts;

  document.getElementById('histFilter').innerHTML =
    '<option value="">Everything</option>' +
    '<option value="scope:week">Weekly numbers only</option>' +
    '<option value="scope:tracker">Status changes only</option>' +
    WEEKS.map(w=>`<option value="week:${w.n}">Week ${w.n} only</option>`).join('');

  const savedEditor = localStorage.getItem('fuelshine.editor') || EDITORS[0];
  document.getElementById('editorSelect').innerHTML =
    EDITORS.map(e=>`<option value="${esc(e)}" ${e===savedEditor?'selected':''}>${esc(e)}</option>`).join('');

  document.getElementById('lastViewed').textContent =
    'Viewed ' + new Date().toLocaleString('en-US',{dateStyle:'medium', timeStyle:'short'});
}

/* ---------- status-tracked tables ---------- */

/** Strips HTML entities/tags out of plan copy so it reads cleanly in the change log. */
function plainText(html){
  const d = document.createElement('div');
  d.innerHTML = String(html);
  return (d.textContent || '').replace(/\s+/g,' ').trim();
}

/** The <td> holding a status dropdown + short note for one tracked row. */
function statusCell(group, key, itemLabel, trackers){
  const setName = TRACKER_GROUPS[group].set;
  const cur = trackers[key] || { status:'', note:'' };
  const opts = STATUS_SETS[setName].map(([v,l]) =>
    `<option value="${v}" ${v===cur.status?'selected':''}>${l}</option>`).join('');
  const who = cur.updatedBy
    ? `<div class="statusmeta">${esc(cur.updatedBy)} &middot; ${new Date(cur.updatedAt).toLocaleDateString('en-US',{month:'short',day:'numeric'})}</div>`
    : '';
  return `<td class="statuscell">
    <select class="statussel ${statusClass(setName, cur.status)}"
            data-key="${esc(key)}" data-group="${group}" data-label="${esc(itemLabel)}">${opts}</select>
    <input class="statusnote" type="text" placeholder="note…" value="${esc(cur.note||'')}"
           data-key="${esc(key)}" data-group="${group}" data-label="${esc(itemLabel)}">
    ${who}
    <span class="flash" data-flash="${esc(key)}"></span>
  </td>`;
}

function renderTrackedTables(trackers){
  document.getElementById('channelBody').innerHTML = CHANNELS.map((c,i)=>{
    const key = 'chan:' + (i+1);
    return `<tr><td><span class="rank">${i+1}</span></td>
      <td style="white-space:normal; min-width:240px;">${c[0]}</td>
      ${statusCell('chan', key, 'Channel — ' + plainText(c[0]).slice(0,60), trackers)}
      <td>${c[1]}</td><td>${c[2]}</td>
      <td style="white-space:normal; min-width:240px;">${c[3]}</td></tr>`;
  }).join('');

  document.getElementById('verticalBody').innerHTML = VERTICALS.map(v=>{
    const key = 'fvvert:' + v[0];
    return `<tr><td><span class="rank">${v[0]}</span></td><td>${v[1]}</td>
      ${statusCell('fvvert', key, 'Fuel-verification vertical — ' + plainText(v[1]), trackers)}
      <td>${v[2]}</td><td style="white-space:normal;">${v[3]}</td>
      <td style="white-space:normal; min-width:200px;">${v[4]}</td></tr>`;
  }).join('');

  document.getElementById('gfVerticalBody').innerHTML = GF_VERTICALS.map(v=>{
    const key = 'gfvert:' + v[0];
    return `<tr><td><span class="rank">${v[0]}</span></td><td>${v[1]}</td>
      ${statusCell('gfvert', key, 'Grey-fleet vertical — ' + plainText(v[1]), trackers)}
      <td style="white-space:normal; min-width:200px;">${v[2]}</td>
      <td style="white-space:normal; min-width:200px;">${v[3]}</td></tr>`;
  }).join('');

  document.getElementById('assocPriorityBody').innerHTML = ASSOC_PRIORITY.map(a=>{
    const key = 'assoc:' + a[0];
    return `<tr><td><span class="rank">${a[0]}</span></td>
      <td style="white-space:normal; min-width:170px;">${a[1]}</td>
      ${statusCell('assoc', key, plainText(a[1]), trackers)}
      <td style="white-space:normal; min-width:140px;">${a[2]}</td>
      <td style="white-space:normal; min-width:190px;">${a[3]}</td><td>${a[4]}</td>
      <td style="white-space:normal; min-width:160px;">${a[5]}</td>
      <td style="white-space:normal; min-width:190px;">${a[6]}</td></tr>`;
  }).join('');

  document.getElementById('moatBody').innerHTML = MOAT_ROWS.map(r=>{
    const key = 'ip:' + r[0];
    return `<tr><td><span class="rank">${r[0]}</span></td>
      <td style="white-space:normal; min-width:210px;">${r[1]}</td>
      ${statusCell('ip', key, 'IP — ' + plainText(r[1]).slice(0,60), trackers)}
      <td><span class="pill ${r[2]}"><span class="dot"></span>${r[3]}</span></td>
      <td>${r[4]}</td><td>${r[5]}</td>
      <td style="white-space:normal; min-width:240px;">${r[6]}</td></tr>`;
  }).join('');
}

/* ---------- derived series ---------- */

function seriesFrom(weeksData){
  const byNum = {}; weeksData.forEach(w=>{ byNum[w.weekNum]=w; });
  let running=0, gfRunning=0, fvRunning=0, frRunning=0;
  let cumTouches=0, cumResponses=0, cumMeetHeld=0, cumDD=0, cumTermSheets=0, cumCloses=0;
  const series = [];
  for (let n=1; n<=13; n++){
    const w = byNum[n];
    const logged = !!w;
    if (logged){
      const gfNet = (Number(w.gfNewMRR)||0) + (Number(w.gfB2cMRR)||0) - (Number(w.gfChurn)||0);
      const fvNet = (Number(w.fvNewMRR)||0) - (Number(w.fvChurn)||0);
      gfRunning += gfNet; fvRunning += fvNet; running += gfNet + fvNet;
      frRunning += (Number(w.frCommitted)||0) + (Number(w.frClosedCash)||0);
      cumTouches += Number(w.frTouches)||0; cumResponses += Number(w.frResponses)||0;
      cumMeetHeld += Number(w.frMeetHeld)||0; cumDD += Number(w.frDD)||0;
      cumTermSheets += Number(w.frTermSheets)||0; cumCloses += Number(w.frCloses)||0;
    }
    series.push({ n, monday:WEEKS[n-1].monday, logged, cumulative:running,
      gfCum:gfRunning, fvCum:fvRunning, frCum:frRunning,
      cumTouches, cumResponses, cumMeetHeld, cumDD, cumTermSheets, cumCloses, raw:w });
  }
  return series;
}

function renderChart(series){
  const W=900,H=280,padL=54,padR=20,padT=16,padB=34;
  const plotW=W-padL-padR, plotH=H-padT-padB;
  const x = n => padL + (n/13)*plotW;
  const yMax = Math.max(STRETCH*1.05, ...series.map(s=>s.cumulative*1.1), 1000);
  const y = v => padT + plotH - (v/yMax)*plotH;

  let grid='';
  [0, STRETCH/2, STRETCH].forEach(t=>{
    grid += `<line x1="${padL}" y1="${y(t)}" x2="${W-padR}" y2="${y(t)}" stroke="var(--border)" stroke-width="1"/>`;
    grid += `<text x="${padL-8}" y="${y(t)+4}" text-anchor="end" font-size="10.5">${fmt$(t)}</text>`;
  });

  let floorPts='', stretchPts='';
  for (let n=0;n<=13;n++){ floorPts += `${x(n)},${y(FLOOR*n/13)} `; stretchPts += `${x(n)},${y(STRETCH*n/13)} `; }

  let actualPts = `${x(0)},${y(0)} `, dots='';
  series.forEach(s=>{ if(s.logged){
    actualPts += `${x(s.n)},${y(s.cumulative)} `;
    dots += `<circle cx="${x(s.n)}" cy="${y(s.cumulative)}" r="4" fill="var(--green)" stroke="#fff" stroke-width="1.5"/>`;
  }});

  const ti = todayInfo();
  const todayX = x(Math.min(13, ti.currentWeek || 0) + ((new Date()-START)/86400000 % 7)/7);

  document.getElementById('chartSvg').innerHTML = `
    ${grid}
    <line x1="${x(0)}" y1="${padT}" x2="${x(0)}" y2="${H-padB}" stroke="var(--border)"/>
    <line x1="${padL}" y1="${H-padB}" x2="${W-padR}" y2="${H-padB}" stroke="var(--border)"/>
    <polyline points="${stretchPts}" fill="none" stroke="var(--muted-2)" stroke-width="1.5" stroke-dasharray="3 5"/>
    <polyline points="${floorPts}" fill="none" stroke="var(--watch)" stroke-width="1.5" stroke-dasharray="3 5"/>
    <polyline points="${actualPts}" fill="none" stroke="var(--green)" stroke-width="2.5"/>
    ${dots}
    <line x1="${todayX}" y1="${padT}" x2="${todayX}" y2="${H-padB}" stroke="var(--navy)" stroke-width="1" stroke-dasharray="3 3" opacity=".35"/>
    ${WEEKS.map(w=>`<text x="${x(w.n)}" y="${H-padB+16}" text-anchor="middle" font-size="10.5">W${w.n}</text>`).join('')}
  `;
}

function statusFor(cumulative, n, floor){
  const targetAtN = floor*n/13;
  if (cumulative >= targetAtN) return 'ok';
  if (cumulative >= targetAtN*0.7) return 'watch';
  return 'risk';
}

function rateBadge(rate, benchmark){
  const ok = rate >= benchmark;
  return `${pct(rate)} <span style="color:${ok?'var(--ok)':'var(--risk)'};">${ok?'&#10003;':'&#9650;'}</span>`;
}

function renderNorthStar(series){
  const lastLogged = [...series].reverse().find(s=>s.logged);
  const cumulative = lastLogged ? lastLogged.cumulative : 0;
  const frCumulative = lastLogged ? lastLogged.frCum : 0;
  const ti = todayInfo();
  const weeksRemaining = Math.max(1, 13 - (ti.currentWeek||0));

  document.getElementById('statCum').textContent = fmt$(cumulative);
  document.getElementById('statGfMRR').textContent = fmt$(lastLogged ? lastLogged.gfCum : 0);
  document.getElementById('statFvMRR').textContent = fmt$(lastLogged ? lastLogged.fvCum : 0);
  const gap = Math.max(0, FLOOR - cumulative);
  document.getElementById('statGap').innerHTML = gap===0 ? 'Floor met &mdash; pushing to $10K' : fmt$(gap);
  document.getElementById('statPace').textContent = gap===0
    ? fmt$(Math.max(0,(STRETCH-cumulative))/weeksRemaining) : fmt$(gap/weeksRemaining);

  const circ = 2*Math.PI*45;
  const ringPct = Math.min(100, Math.round((cumulative/FLOOR)*100));
  document.getElementById('ringPct').textContent = ringPct + '%';
  const ring = document.getElementById('ringProgress');
  ring.setAttribute('stroke-dasharray', circ.toFixed(1));
  ring.setAttribute('stroke-dashoffset', (circ*(1-ringPct/100)).toFixed(1));

  const frRingPct = Math.min(100, Math.round((frCumulative/FR_FLOOR)*100));
  document.getElementById('frPct').textContent = frRingPct + '%';
  const ringFr = document.getElementById('ringFr');
  ringFr.setAttribute('stroke-dasharray', circ.toFixed(1));
  ringFr.setAttribute('stroke-dashoffset', (circ*(1-frRingPct/100)).toFixed(1));
  document.getElementById('statFrSecured').textContent = fmt$(frCumulative);

  const loggedWeeks = series.filter(s=>s.logged);
  let paceStatus='none', paceLabel='No weeks logged yet';
  if (loggedWeeks.length){
    const last = loggedWeeks[loggedWeeks.length-1];
    const st = statusFor(last.cumulative, last.n, FLOOR);
    paceStatus = st;
    paceLabel = st==='ok' ? 'On pace for the $8K floor'
              : st==='watch' ? 'Behind pace — watch closely'
              : 'Off pace vs. the $8K floor line';
  }
  const pill = document.getElementById('pacePill');
  pill.className = 'pill ' + (paceStatus==='none'?'':paceStatus);
  document.getElementById('paceLabel').textContent = paceLabel;

  const last2 = loggedWeeks.slice(-2);
  const bothBehind = last2.length===2 && last2.every(s => statusFor(s.cumulative, s.n, FLOOR)==='risk');
  document.getElementById('escalationBanner').innerHTML = bothBehind
    ? `<div class="banner risk"><span>&#9888;</span><div><b>Escalation trigger:</b> two straight weeks behind the $8K pace line. Shift to a partnership-led push rather than more outbound volume.</div></div>`
    : '';

  const reset = id => { document.getElementById(id).innerHTML = '&mdash;'; };
  ['statRespRate','statAdvRate','statDdRate','statCloseRate'].forEach(reset);
  if (lastLogged && lastLogged.raw){
    const { cumTouches:t, cumResponses:r, cumMeetHeld:m, cumDD:d, cumTermSheets:ts, cumCloses:c } = lastLogged;
    if (t) document.getElementById('statRespRate').innerHTML = rateBadge(r/t, 0.30);
    if (r) document.getElementById('statAdvRate').innerHTML  = rateBadge(m/r, 0.50);
    if (d) document.getElementById('statDdRate').innerHTML   = rateBadge(ts/d, 0.40);
    if (ts) document.getElementById('statCloseRate').innerHTML = rateBadge(c/ts, 0.60);
  }

  const lastPartnerWeek = [...series].reverse().find(s =>
    s.raw && ((Number(s.raw.gfPartner)||0)>0 || (Number(s.raw.fvPartner)||0)>0));
  const pd = document.getElementById('statPartnerDays');
  if (lastPartnerWeek){
    const days = Math.round((new Date() - new Date(lastPartnerWeek.monday+'T00:00:00Z'))/86400000);
    pd.textContent = days + (days===1?' day':' days');
  } else {
    pd.innerHTML = '&mdash;';
  }
}

/* ---------- week history tables ---------- */

function historyRowsGf(series){
  const rows = series.filter(s=>s.logged);
  if (!rows.length) return `<tr class="empty-row"><td colspan="8">No weeks logged yet &mdash; the first Monday review is Sep 14, 2026.</td></tr>`;
  return rows.map(s=>{
    const r = s.raw;
    const net = (Number(r.gfNewMRR)||0)+(Number(r.gfB2cMRR)||0)-(Number(r.gfChurn)||0);
    const cf = Number(r.gfCacFleet), cs = Number(r.gfCacSub);
    const cacOver = (cf && cf>CAC_FLEET_CEIL) || (cs && cs>CAC_SUB_CEIL);
    return `<tr><td>Week ${s.n}</td>
      <td class="num">${fmt$(Number(r.gfNewMRR)||0)}</td><td class="num">${fmt$(Number(r.gfB2cMRR)||0)}</td>
      <td class="num">${fmt$(Number(r.gfChurn)||0)}</td><td class="num">${fmt$(net)}</td>
      <td class="num"><b>${fmt$(s.gfCum)}</b></td><td>${esc(r.gfFocus||'—')}</td>
      <td>${cacOver?'<span class="pill risk"><span class="dot"></span>over</span>':'<span class="pill ok"><span class="dot"></span>ok</span>'}</td></tr>`;
  }).join('');
}

function historyRowsFv(series){
  const rows = series.filter(s=>s.logged);
  if (!rows.length) return `<tr class="empty-row"><td colspan="7">No weeks logged yet.</td></tr>`;
  return rows.map(s=>{
    const r = s.raw;
    const cacOver = Number(r.fvCac) && Number(r.fvCac)>CAC_FLEET_CEIL;
    return `<tr><td>Week ${s.n}</td>
      <td class="num">${fmt$(Number(r.fvNewMRR)||0)}</td><td class="num">${fmt$(Number(r.fvChurn)||0)}</td>
      <td class="num"><b>${fmt$(s.fvCum)}</b></td><td>${esc(r.fvFocus||'—')}</td>
      <td>${String(r.fvTestimonial)==='1'?'<span class="pill ok"><span class="dot"></span>secured</span>':'<span class="pill watch"><span class="dot"></span>not yet</span>'}</td>
      <td>${cacOver?'<span class="pill risk"><span class="dot"></span>over</span>':'<span class="pill ok"><span class="dot"></span>ok</span>'}</td></tr>`;
  }).join('');
}

function historyRowsFr(series){
  const rows = series.filter(s=>s.logged);
  if (!rows.length) return `<tr class="empty-row"><td colspan="8">No weeks logged yet.</td></tr>`;
  return rows.map(s=>{
    const r = s.raw;
    return `<tr><td>Week ${s.n}</td>
      <td class="num">${Number(r.frTouches)||0}</td><td class="num">${Number(r.frResponses)||0}</td>
      <td class="num">${Number(r.frMeetHeld)||0}</td><td class="num">${Number(r.frTermSheets)||0}</td>
      <td class="num">${fmt$(Number(r.frCommitted)||0)}</td><td class="num">${fmt$(Number(r.frClosedCash)||0)}</td>
      <td>${esc(r.frFocus||'—')}</td></tr>`;
  }).join('');
}

function renderAll(weeksData){
  const series = seriesFrom(weeksData);
  renderChart(series);
  renderNorthStar(series);
  document.getElementById('gfHistoryBody').innerHTML = historyRowsGf(series);
  document.getElementById('fvHistoryBody').innerHTML = historyRowsFv(series);
  document.getElementById('frHistoryBody').innerHTML = historyRowsFr(series);
}

/* ---------- change-history panel ---------- */

let versionCache = [];

/** Formats one change value, handling both weekly fields and tracker statuses. */
function fmtChange(entry, c, which){
  const raw = c[which];
  if (entry.scope === 'tracker'){
    if (c.field === 'status'){
      const group = String(entry.ref_key).split(':')[0];
      const setName = (TRACKER_GROUPS[group] || {}).set;
      // A row never touched has no stored status, but the dropdown has been
      // showing its first option all along — so report that, not "(none)".
      const shown = raw === '' ? (STATUS_SETS[setName] || [[]])[0][0] : raw;
      return statusLabel(setName, shown);
    }
    return raw === '' ? '(blank)' : String(raw);
  }
  return fmtValue(c.field, raw);
}

function renderHistory(rows){
  versionCache = rows;
  const list = document.getElementById('histList');
  if (!rows.length){
    list.innerHTML = `<div class="hist"><div class="hist-meta">Nothing recorded yet. Every weekly save and every status change appears here, with the exact fields that moved.</div></div>`;
    return;
  }
  list.innerHTML = rows.map((r, i) => {
    const when = new Date(r.created_at);
    const isRestore = !!(r.note && /^Restored from version/.test(r.note));
    const isTracker = r.scope === 'tracker';
    const changes = Array.isArray(r.changes) ? r.changes : [];
    const body = changes.length
      ? `<div class="changes">${changes.map(c=>{
          const from = fmtChange(r, c, 'from'), to = fmtChange(r, c, 'to');
          let dir = '';
          if (!isTracker && FIELD_KINDS[c.field] !== 'text' && FIELD_KINDS[c.field] !== 'bool'){
            if (Number(c.to) > Number(c.from)) dir = 'up';
            else if (Number(c.to) < Number(c.from)) dir = 'down';
          }
          return `<div class="chg">
            <span class="lbl">${esc(c.label)}</span>
            <span class="from">${esc(from)}</span>
            <span class="arr">&rarr;</span>
            <span class="to ${dir}">${esc(to)}</span>
          </div>`;
        }).join('')}</div>`
      : `<div class="hist-none">Saved with no change to any field.</div>`;

    const verb = isTracker ? 'updated' : 'saved';
    return `<div class="hist${isRestore?' restore':''}${isTracker?' tracker':''}">
      <div class="hist-top">
        <div>
          <div class="hist-who">${esc(r.editor || 'unknown')}
            <span style="font-weight:400; color:var(--muted);">${verb} ${esc(r.ref_label || '')}</span></div>
          <div class="hist-meta">${isTracker?'Status':'Weekly numbers'} &middot; version ${r.version_no} &middot; ${changes.length} field${changes.length===1?'':'s'} changed</div>
        </div>
        <div style="text-align:right;">
          <div class="hist-when">${when.toLocaleString('en-US',{dateStyle:'medium', timeStyle:'short'})}</div>
          <button class="btn ghost tiny" data-restore="${i}" style="margin-top:6px;">Restore this version</button>
        </div>
      </div>
      ${r.note ? `<div class="hist-note">${esc(r.note)}</div>` : ''}
      ${body}
    </div>`;
  }).join('');
}

/* ---------- form <-> store ---------- */

function setFormValues(values){
  FORM_IDS.forEach(id=>{
    const el = document.getElementById('f_'+id);
    if (!el) return;
    const v = values ? values[id] : undefined;
    if (id === 'fvTestimonial')      el.value = (v == null) ? '0' : String(v);
    else if (v == null)              el.value = '';
    else                             el.value = String(v);
    el.classList.remove('dirty');
  });
}

function readFormValues(){
  const data = {};
  FORM_IDS.forEach(id=>{
    const el = document.getElementById('f_'+id);
    if (!el) return;
    data[id] = TEXT_FIELDS.has(id) ? (el.value || '') : (Number(el.value) || 0);
  });
  return data;
}

/* Which tab each field belongs to, so the tab strip can show unsaved counts. */
const FIELD_TAB = id => id.startsWith('gf') ? 'gf' : id.startsWith('fv') ? 'fv' : 'fr';

/**
 * Tracks which fields differ from what is stored, so the user can see at a
 * glance what is unsaved — per field, per tab, and in the save bar. Also
 * flags a realized CAC above its ceiling as it is typed.
 */
function markDirtyTracking(baseline){
  const recount = () => {
    const counts = { gf:0, fv:0, fr:0 };
    FORM_IDS.forEach(id=>{
      const el = document.getElementById('f_'+id);
      if (el && el.classList.contains('dirty')) counts[FIELD_TAB(id)]++;
    });
    ['gf','fv','fr'].forEach(t=>{
      const b = document.getElementById('count-'+t);
      b.textContent = counts[t] || '';
      b.classList.toggle('on', counts[t] > 0);
    });
    const total = counts.gf + counts.fv + counts.fr;
    setSaveState(total
      ? { text: total + ' unsaved change' + (total===1?'':'s'), kind:'dirty' }
      : { text:'', kind:'' });
    return total;
  };

  FORM_IDS.forEach(id=>{
    const el = document.getElementById('f_'+id);
    if (!el) return;
    const check = () => {
      const base = baseline ? baseline[id] : undefined;
      const now = TEXT_FIELDS.has(id) ? (el.value||'') : (Number(el.value)||0);
      // A never-saved week has no stored value. The blank default for a
      // dropdown like fvTestimonial is "0", not "" — without this the field
      // reports itself as changed the moment the page loads.
      const blank = FIELD_KINDS[id] === 'bool' ? '0' : '';
      const was = TEXT_FIELDS.has(id) ? (base==null ? blank : String(base)) : (Number(base)||0);
      el.classList.toggle('dirty', String(now) !== String(was));
      const ceil = Number(el.dataset.ceil||0);
      if (ceil) el.classList.toggle('over', Number(el.value) > ceil);
      recount();
      saveDraft(currentWeekShown);
    };
    el.oninput = check; el.onchange = check;
    // Run once now, so values restored from a draft are flagged as unsaved
    // immediately rather than only after the next keystroke.
    check();
  });
  recount();
}

function dirtyCount(){
  return FORM_IDS.filter(id=>{
    const el = document.getElementById('f_'+id);
    return el && el.classList.contains('dirty');
  }).length;
}

/* ---------- toasts + save state ---------- */

function toast(title, message, kind){
  const wrap = document.getElementById('toasts');
  const el = document.createElement('div');
  el.className = 'toast' + (kind ? ' ' + kind : '');
  el.innerHTML = `<div><span class="t">${esc(title)}</span>` +
                 (message ? `<span class="m">${esc(message)}</span>` : '') + `</div>`;
  wrap.appendChild(el);
  setTimeout(()=>{
    el.classList.add('out');
    setTimeout(()=> el.remove(), 220);
  }, kind === 'err' ? 6000 : 3600);
}

function setSaveState({text, kind}){
  const el = document.getElementById('saveState');
  el.className = 'savestate' + (kind ? ' ' + kind : '');
  el.innerHTML = text ? `<span class="d"></span>${esc(text)}` : '';
}

/* ---------- local UI state + unsaved-draft recovery ----------------
   Two things that are NOT server data but still must survive a refresh:

   1. Where you were — week, tab, history filter. Losing these on every
      reload makes the tool feel like it forgot you.
   2. What you had typed but not yet saved. Numbers entered and then lost
      to an accidental refresh is the exact failure this whole rebuild
      exists to fix, so drafts are mirrored to localStorage on every
      keystroke and offered back on return.

   Both are per-browser by nature (they are about this person's session,
   not shared team data), so localStorage is the right home for them —
   unlike the actual numbers, which go to the database.
-------------------------------------------------------------------- */
const UI_KEY = 'fuelshine.ui.v1';
const DRAFT_KEY = 'fuelshine.drafts.v1';

function lsGet(key, fallback){
  try{ const r = localStorage.getItem(key); return r ? JSON.parse(r) : fallback; }
  catch{ return fallback; }
}
function lsSet(key, val){
  try{ localStorage.setItem(key, JSON.stringify(val)); }catch{ /* private mode: ignore */ }
}

function saveUIState(patch){
  lsSet(UI_KEY, Object.assign(lsGet(UI_KEY, {}), patch));
}
function readUIState(){ return lsGet(UI_KEY, {}); }

/** Mirror the current form to localStorage so a refresh cannot lose it. */
function saveDraft(weekNum){
  const drafts = lsGet(DRAFT_KEY, {});
  if (dirtyCount() === 0){ delete drafts[weekNum]; }
  else { drafts[weekNum] = { values: readFormValues(), at: new Date().toISOString() }; }
  lsSet(DRAFT_KEY, drafts);
}
function getDraft(weekNum){ return lsGet(DRAFT_KEY, {})[weekNum] || null; }
function clearDraft(weekNum){
  const drafts = lsGet(DRAFT_KEY, {});
  delete drafts[weekNum];
  lsSet(DRAFT_KEY, drafts);
}

/* ---------- boot ---------- */

let currentBaseline = null;
let currentWeekShown = 1;

/** Reads the current value of the histFilter dropdown into a Store filter. */
function currentHistFilter(){
  const v = document.getElementById('histFilter').value;
  if (!v) return undefined;
  if (v === 'scope:week')    return { scope:'week' };
  if (v === 'scope:tracker') return { scope:'tracker' };
  if (v.startsWith('week:')) return { scope:'week', refKey: v.slice(5) };
  return undefined;
}

async function refreshEverything(){
  const [weeks, trackers, history] = await Promise.all([
    Store.loadWeeks(),
    Store.loadTrackers(),
    Store.loadHistory(currentHistFilter())
  ]);
  renderAll(weeks);
  renderTrackedTables(trackers);
  renderHistory(history);
}

async function loadWeekIntoForm(n){
  const w = await Store.loadWeek(n);
  currentBaseline = w;
  setFormValues(w);

  /* If this week was left mid-edit, put the typing back rather than
     silently discarding it. The fields stay flagged as unsaved. */
  const draft = getDraft(n);
  let restored = 0;
  if (draft && draft.values){
    FORM_IDS.forEach(id=>{
      const el = document.getElementById('f_'+id);
      if (!el) return;
      const stored = w ? w[id] : undefined;
      const dv = draft.values[id];
      const same = String(TEXT_FIELDS.has(id) ? (stored==null?'':stored) : (Number(stored)||0))
                === String(TEXT_FIELDS.has(id) ? (dv==null?'':dv) : (Number(dv)||0));
      if (!same){ el.value = (dv == null) ? '' : String(dv); restored++; }
    });
  }

  markDirtyTracking(w);
  const prevBtn = document.getElementById('prevWeek');
  const nextBtn = document.getElementById('nextWeek');
  prevBtn.disabled = Number(n) <= 1;
  nextBtn.disabled = Number(n) >= WEEKS.length;

  if (restored){
    toast('Unsaved work restored',
      restored + ' field' + (restored===1?'':'s') + ' you had typed on Week ' + n +
      ' but not saved. Still unsaved — hit Save week to commit.');
  } else if (w && w.updatedBy){
    setSaveState({ text:'Last saved by ' + w.updatedBy + ' · ' +
      new Date(w.updatedAt).toLocaleDateString('en-US',{month:'short',day:'numeric'}), kind:'' });
  }
}

/** Switches the weekly-entry tabs, and remembers which one. */
function showTab(which){
  ['gf','fv','fr'].forEach(t=>{
    document.getElementById('tab-'+t).setAttribute('aria-selected', String(t===which));
    document.getElementById('panel-'+t).hidden = (t !== which);
  });
  saveUIState({ tab: which });
}

async function init(){
  renderStaticShell();
  renderAll([]);
  renderTrackedTables({});
  renderHistory([]);

  const weekSel = document.getElementById('weekSelect');
  const editorSel = document.getElementById('editorSelect');
  const histFilter = document.getElementById('histFilter');
  const saveBtn = document.getElementById('saveBtn');
  const noteInput = document.getElementById('saveNote');

  const problem = await Store.healthCheck();
  const banner = document.getElementById('connBanner');
  if (problem){
    const local = Store.mode !== 'supabase';
    banner.innerHTML = `<div class="banner ${local?'watch':'risk'}"><span>&#9888;</span><div>
      <b>${local ? 'Browser-only storage' : 'Database unreachable'}:</b> ${esc(problem)}</div></div>`;
  } else {
    banner.innerHTML = `<div class="banner"><span>&#10003;</span><div>
      <b>Connected.</b> Saves are stored in the shared database and survive refresh, new devices and new browsers. Every save is versioned below.</div></div>`;
  }

  editorSel.addEventListener('change', ()=> localStorage.setItem('fuelshine.editor', editorSel.value));

  /* Week navigation. Switching week discards whatever is typed, so confirm first. */
  async function goToWeek(n){
    // Unsaved typing is kept as a per-week draft, so switching weeks no
    // longer destroys it — it is waiting when you come back.
    saveDraft(currentWeekShown);
    currentWeekShown = Number(n);
    weekSel.value = String(n);
    saveUIState({ week: Number(n) });
    await loadWeekIntoForm(Number(n));
  }
  weekSel.addEventListener('change', ()=> goToWeek(Number(weekSel.value)));
  document.getElementById('prevWeek').addEventListener('click', ()=> goToWeek(currentWeekShown - 1));
  document.getElementById('nextWeek').addEventListener('click', ()=> goToWeek(currentWeekShown + 1));

  /* Tabs */
  ['gf','fv','fr'].forEach(t=>{
    document.getElementById('tab-'+t).addEventListener('click', ()=> showTab(t));
  });

  histFilter.addEventListener('change', async ()=>{
    saveUIState({ filter: histFilter.value });
    renderHistory(await Store.loadHistory(currentHistFilter()));
  });
  document.getElementById('refreshBtn').addEventListener('click', async ()=>{
    await refreshEverything();
    toast('Refreshed', 'Pulled the latest saved data.');
  });

  /* Status dropdowns and their notes save the moment they change — no separate
     button, because a status you have to remember to save is a status that goes
     stale. Store.saveTracker no-ops when nothing actually changed, so re-picking
     the same value never writes a junk history entry. */
  async function commitTracker(el){
    const key = el.dataset.key, group = el.dataset.group, label = el.dataset.label;
    const row = el.closest('td');
    const sel = row.querySelector('.statussel');
    const noteEl = row.querySelector('.statusnote');
    const flash = row.querySelector('.flash');
    try{
      const { changes } = await Store.saveTracker(
        key, label, { status: sel.value, note: noteEl.value.trim() }, editorSel.value
      );
      sel.className = 'statussel ' + statusClass(TRACKER_GROUPS[group].set, sel.value);
      if (changes.length){
        flash.textContent = 'saved';
        flash.className = 'flash show';
        setTimeout(()=>{ flash.className = 'flash'; }, 1600);
        renderHistory(await Store.loadHistory(currentHistFilter()));
      }
    }catch(e){
      flash.textContent = 'save failed';
      flash.className = 'flash show err';
      toast('Status not saved', e.message, 'err');
      console.error(e);
    }
  }

  document.addEventListener('change', ev=>{
    if (ev.target.classList.contains('statussel')) commitTracker(ev.target);
  });
  document.addEventListener('blur', ev=>{
    if (ev.target.classList && ev.target.classList.contains('statusnote')) commitTracker(ev.target);
  }, true);
  document.addEventListener('keydown', ev=>{
    if (ev.key === 'Enter' && ev.target.classList && ev.target.classList.contains('statusnote')){
      ev.target.blur();
    }
  });

  noteInput.addEventListener('input', ()=> saveUIState({ note: noteInput.value }));

  document.getElementById('exportBtn').addEventListener('click', async ()=>{
    const blob = new Blob([JSON.stringify(await Store.exportAll(), null, 2)], {type:'application/json'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'fuelshine-sprint-' + new Date().toISOString().slice(0,10) + '.json';
    a.click(); URL.revokeObjectURL(a.href);
    toast('Exported', 'Every week, status and history entry, as JSON.');
  });

  document.getElementById('histList').addEventListener('click', async (ev)=>{
    const btn = ev.target.closest('[data-restore]');
    if (!btn) return;
    const v = versionCache[Number(btn.dataset.restore)];
    if (!v) return;
    const what = v.scope === 'week' ? ('Week ' + v.ref_key) : (v.ref_label || 'this item');
    if (!confirm(`Restore ${what} to version ${v.version_no}?\n\nThis writes a NEW entry recording the rollback. Nothing in the history is deleted.`)) return;
    btn.disabled = true;
    try{
      await Store.restoreVersion(v, editorSel.value);
      if (v.scope === 'week'){
        currentWeekShown = Number(v.ref_key);
        weekSel.value = String(v.ref_key);
        await loadWeekIntoForm(Number(v.ref_key));
      }
      await refreshEverything();
      toast('Restored', what + ' rolled back to version ' + v.version_no + '. The rollback is logged.', 'ok');
    }catch(e){
      toast('Restore failed', e.message, 'err');
    }finally{ btn.disabled = false; }
  });

  async function doSave(){
    if (saveBtn.disabled) return;
    const n = Number(weekSel.value);
    saveBtn.disabled = true;
    setSaveState({ text:'Saving…', kind:'' });
    try{
      const { changes, versionNo } = await Store.saveWeek(
        n, readFormValues(), editorSel.value, noteInput.value.trim() || null
      );
      noteInput.value = '';
      clearDraft(n);
      saveUIState({ note: '' });
      await loadWeekIntoForm(n);
      await refreshEverything();
      setSaveState({ text:'Saved just now', kind:'ok' });
      toast(
        changes.length ? `Week ${n} saved` : `Week ${n} saved — nothing changed`,
        changes.length
          ? `Version ${versionNo} · ${changes.length} field${changes.length===1?'':'s'} changed. See the change history.`
          : `Version ${versionNo}. No field differed from the stored values.`,
        'ok'
      );
    }catch(e){
      console.error(e);
      setSaveState({ text:'Not saved', kind:'dirty' });
      toast('Save failed — nothing was written', e.message, 'err');
    }finally{ saveBtn.disabled = false; }
  }
  saveBtn.addEventListener('click', doSave);

  /* Cmd/Ctrl+S saves, like any tool people already use. */
  const isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
  document.getElementById('saveKbd').textContent = isMac ? '⌘S' : 'Ctrl+S';
  window.addEventListener('keydown', ev=>{
    if ((ev.metaKey || ev.ctrlKey) && ev.key.toLowerCase() === 's'){
      ev.preventDefault(); doSave();
    }
  });

  /* Never lose typed numbers to an accidental tab close. */
  window.addEventListener('beforeunload', ev=>{
    if (dirtyCount()){ ev.preventDefault(); ev.returnValue = ''; }
  });

  /* Highlight the section currently in view in the top nav. */
  const links = [...document.querySelectorAll('#navlinks a')];
  const spy = new IntersectionObserver(entries=>{
    entries.forEach(en=>{
      if (!en.isIntersecting) return;
      links.forEach(a=> a.classList.toggle('active', a.getAttribute('href') === '#'+en.target.id));
    });
  }, { rootMargin:'-70px 0px -70% 0px' });
  document.querySelectorAll('section[id]').forEach(s=> spy.observe(s));

  /* Put the person back where they were: same week, tab, filter and
     half-typed note as when they last had this page open. */
  const ui = readUIState();
  if (ui.week && WEEKS.some(w=>w.n===Number(ui.week))) weekSel.value = String(ui.week);
  if (ui.filter != null) histFilter.value = ui.filter;
  if (ui.note) noteInput.value = ui.note;
  showTab(['gf','fv','fr'].includes(ui.tab) ? ui.tab : 'gf');

  currentWeekShown = Number(weekSel.value);
  await loadWeekIntoForm(currentWeekShown);
  await refreshEverything();
}

init().catch(e=>{
  console.error(e);
  document.getElementById('connBanner').innerHTML =
    `<div class="banner risk"><span class="ico">&#9888;</span><div><b>The dashboard failed to start:</b> ${esc(e.message)}</div></div>`;
});
