/* ------------------------------------------------------------------
   app.js — rendering + wiring.
   All persistence goes through Store (store.js).
   ------------------------------------------------------------------ */

import {
  START, WEEKS, SPRINT_DAYS, FLOOR, STRETCH, CAC_FLEET_CEIL, CAC_SUB_CEIL, FR_FLOOR,
  PLAN_WEEKS, PLAN_SOURCE, OPENING_MRR, planFor, planStatus,
  PLAN_LINES, PLAN_PRICE, PLAN_EXPECTATION, CLOSE_WEEKS, RUNWAY_NEEDED_UNTIL, RUNWAY_FIXES,
  AD_RULES, INVESTOR_CONSISTENCY, MONDAY_CHECK, SAFE_CAP,
  PHASES, CHANNELS, ASSOC_PRIORITY, ASSOC_WATCHLIST, VERTICALS, GF_VERTICALS,
  LENSES, RULES, TEAM, GAPS, LEADLINES, DISCOVERY, OBJECTIONS, MOAT_ROWS,
  FORM_IDS, FIELD_KINDS, TEXT_FIELDS,
  STATUS_SETS, TRACKER_GROUPS, statusLabel, statusClass, setForRow, defaultForRow,
  legacySetForRow, legacyDefaultForRow, inSet, foreignLabel, foreignClass
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

/* The sprint runs on Toronto business time: a new day/week starts at
   midnight in Toronto, for everyone, wherever they open the page. */
const BIZ_TZ = 'America/Toronto';
function bizToday(){          // 'YYYY-MM-DD' in Toronto
  return new Intl.DateTimeFormat('en-CA',{timeZone:BIZ_TZ, year:'numeric', month:'2-digit', day:'2-digit'}).format(new Date());
}
const dayMs = 86400000;
function daysBetween(a, b){   // whole days from ISO date a to ISO date b
  return Math.round((Date.parse(b+'T00:00:00Z') - Date.parse(a+'T00:00:00Z'))/dayMs);
}
function addDays(iso, n){ return new Date(Date.parse(iso+'T00:00:00Z') + n*dayMs).toISOString().slice(0,10); }
const START_ISO = START.toISOString().slice(0,10);

function todayInfo(){
  const t = bizToday();
  const dayNum = daysBetween(START_ISO, t) + 1;
  let currentWeek = 0;
  for (const w of WEEKS){ if (w.monday <= t) currentWeek = w.n; }
  return { today:t, dayNum: Math.max(1, Math.min(SPRINT_DAYS, dayNum)), currentWeek };
}

/* ---------- static shell ---------- */

function renderStaticShell(){
  document.getElementById('dayNum').textContent = todayInfo().dayNum;

  const today = bizToday();
  document.getElementById('phaseGrid').innerHTML = PHASES.map((p,i)=>{
    const isCurrent = today >= p.start && today <= p.end;
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

  document.getElementById('consistencyLine').textContent = INVESTOR_CONSISTENCY;
  document.getElementById('mondaySteps').innerHTML = MONDAY_CHECK.map(t=>`<li>${esc(t)}</li>`).join('');
  document.getElementById('planLines').innerHTML = `<table class="planlines"><thead><tr><th>Line</th><th class="num">Week-17 MRR</th><th>Made up of</th></tr></thead><tbody>` +
    PLAN_LINES.map((l,i)=>`<tr class="${i===PLAN_LINES.length-1?'tot':''}"><td>${esc(l[0])}</td><td class="num"><b>${esc(l[1])}</b></td><td>${esc(l[2])}</td></tr>`).join('') + `</tbody></table>`;
  document.getElementById('planPrice').textContent = PLAN_PRICE;
  document.getElementById('planExpectation').textContent = PLAN_EXPECTATION;
  document.getElementById('channelExpectation').textContent = PLAN_EXPECTATION;
  document.getElementById('adGateText').innerHTML = `<b>Tracking gate.</b> ${esc(AD_RULES.gate)}`;
  document.getElementById('adRulesBody').innerHTML = AD_RULES.rows.map(r=>
    `<tr><th scope="row">${esc(r[0])}</th><td>${esc(r[1])}</td><td>${esc(r[2])}</td></tr>`).join('') +
    `<tr class="adlive"><th scope="row">This sprint so far</th><td id="adAuditLive">—</td><td id="adDriverLive">—</td></tr>`;

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
    const label = d.toLocaleDateString('en-US',{month:'short',day:'numeric',timeZone:'UTC'});
    return `<option value="${w.n}" ${w.n===cw?'selected':''}>Week ${w.n} &mdash; ${label}</option>`;
  }).join('');
  document.getElementById('weekSelect').innerHTML = weekOpts;

  document.getElementById('histFilter').innerHTML =
    '<option value="">Everything</option>' +
    '<option value="scope:week">Weekly numbers only</option>' +
    '<option value="scope:tracker">Status changes only</option>' +
    WEEKS.map(w=>`<option value="week:${w.n}">Week ${w.n} numbers only</option>`).join('');

  /* A browser may remember a name that has since been removed from EDITORS.
     Fall back rather than leaving the dropdown showing nothing. */
  const remembered = localStorage.getItem('fuelshine.editor');
  const savedEditor = EDITORS.includes(remembered) ? remembered : EDITORS[0];
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

/** Shortens a label on a word boundary — a mid-word cut ("…are signe")
    looks like a bug in an exported log. */
function trim(text, max){
  const t = plainText(text);
  if (t.length <= max) return t;
  const cut = t.slice(0, max);
  const space = cut.lastIndexOf(' ');
  return (space > max * 0.6 ? cut.slice(0, space) : cut).replace(/[\s,;:—-]+$/,'') + '…';
}

/** "Last updated by Prity · Sep 30, 4:05 PM", or a plain not-yet line. */
function lastUpdatedText(by, at){
  if (!by) return 'Not updated yet';
  const when = at ? new Date(at).toLocaleString('en-US',
    {month:'short', day:'numeric', hour:'numeric', minute:'2-digit'}) : '';
  return `Last updated by <b>${esc(by)}</b>${when ? ' · ' + when : ''}`;
}

/** Grow a why box to fit its text, so the full reason is always visible. */
function fitWhy(el){
  el.style.height = 'auto';
  el.style.height = Math.max(44, el.scrollHeight + 2) + 'px';
}
document.addEventListener('input', ev=>{
  if (ev.target.classList && ev.target.classList.contains('whynote')) fitWhy(ev.target);
});

/** The <td> holding a status control + note for one tracked row. */
function statusCell(group, key, itemLabel, trackers){
  // A row may override its table's status set — see ROW_STATUS_OVERRIDES.
  const setName = setForRow(key, group);
  const cur = trackers[key] || { status:'', note:'' };
  const value = cur.status || defaultForRow(key, setName);
  let opts = STATUS_SETS[setName].map(([v,l]) =>
    `<option value="${v}" ${v===value?'selected':''}>${l}</option>`).join('');
  // A status saved under a row's earlier set is shown as it was, never
  // silently remapped, until someone picks a current one.
  if (!inSet(setName, value)){
    opts = `<option value="${esc(value)}" selected>${esc(foreignLabel(key, group, value))} (old status)</option>` + opts;
  }
  const meta = `<div class="statusmeta" data-meta="${esc(key)}">${lastUpdatedText(cur.updatedBy, cur.updatedAt)}</div>`;
  return `<td class="statuscell">
    <span class="statuschip ${inSet(setName, value) ? statusClass(setName, value) : foreignClass(key, group, value)}">
      <span class="sdot"></span>
      <select class="statussel" aria-label="Status — ${esc(itemLabel)}"
              data-key="${esc(key)}" data-group="${group}" data-label="${esc(itemLabel)}">${opts}</select>
    </span>
    ${group==='wk'
      ? `<textarea class="statusnote whynote${value==='variance' && !cur.note ? ' needwhy' : ''}" rows="2"
           placeholder="${value==='variance' ? 'Why? Volume, conversion or deal timing — and the fix' : 'Add a note'}"
           aria-label="Why / note — ${esc(itemLabel)}" data-key="${esc(key)}" data-group="${group}" data-label="${esc(itemLabel)}">${esc(cur.note||'')}</textarea><span class="whyhint" role="status">Add the why for this variance</span>`
      : `<input class="statusnote" type="text" placeholder="Add a note" value="${esc(cur.note||'')}"
           aria-label="Note — ${esc(itemLabel)}" data-key="${esc(key)}" data-group="${group}" data-label="${esc(itemLabel)}">`}
    ${meta}
    <span class="flash" data-flash="${esc(key)}"></span>
  </td>`;
}

function renderTrackedTables(loaded){
  // Save any note being typed before the tables are rebuilt (blur commits),
  // then keep in-flight edits over what was just loaded, so a reload that
  // races a save never shows stale text.
  const active = document.activeElement;
  if (active && active.classList && active.classList.contains('statusnote')) active.blur();
  trackerCache = Object.assign({}, loaded || {}, Object.fromEntries(pendingTrackers));
  const trackers = trackerCache;
  if (seriesCache){ renderVariance(seriesCache); renderGates(seriesCache); renderAdLive(seriesCache); }
  document.getElementById('channelBody').innerHTML = CHANNELS.map((c,i)=>{
    const key = 'plan:' + (i+1);
    return `<tr><td><span class="rank">${i+1}</span></td>
      <td style="white-space:normal; min-width:150px;">${c[0]}</td>
      ${statusCell('plan', key, 'Channel — ' + trim(c[0], 52), trackers)}
      <td>${c[1]}</td><td style="white-space:normal; min-width:120px; max-width:170px;">${c[2]}</td>
      <td style="white-space:normal; min-width:260px;">${c[3]}</td></tr>`;
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
    const key = 'assoc:' + a[a.length-1];   // stable id — display order follows the plan
    return `<tr><td><span class="rank">${a[0]}</span></td>
      <td style="white-space:normal; min-width:170px;">${a[1]}</td>
      ${statusCell('assoc', key, plainText(a[1]), trackers)}
      <td style="white-space:normal; min-width:140px;">${a[2]}</td>
      <td style="white-space:normal; min-width:170px;">${a[3]}</td><td style="white-space:normal; min-width:110px;">${a[4]}</td>
      <td style="white-space:normal; min-width:160px;">${a[5]}</td>
      <td style="white-space:normal; min-width:190px;">${a[6]}</td></tr>`;
  }).join('');

  const gate = document.getElementById('adGateStatus');
  if (gate) gate.innerHTML = `<table class="gatecell"><tr>${statusCell('gate', 'gate:tracking', 'Paid-ad tracking gate', trackers)}</tr></table>`;

  document.getElementById('moatBody').innerHTML = MOAT_ROWS.map(r=>{
    const key = 'ip:' + r[0];
    return `<tr><td><span class="rank">${r[0]}</span></td>
      <td style="white-space:normal; min-width:210px;">${r[1]}</td>
      ${statusCell('ip', key, 'IP — ' + trim(r[1], 52), trackers)}
      <td><span class="pill ${r[2]}"><span class="dot"></span>${r[3]}</span></td>
      <td>${r[4]}</td><td>${r[5]}</td>
      <td style="white-space:normal; min-width:240px;">${r[6]}</td></tr>`;
  }).join('');
}

/* ---------- derived series ---------- */

/* MRR already running when Sprint 01 starts: weeks saved before Sep 28
   (stored as week -1 and 0) plus any OPENING_MRR set in data.js. Kept in
   one place so every total — headline, chart, pace, variance — agrees. */
let openingCache = { total:0, fromWeeks:0 };
function seriesFrom(weeksData){
  const byNum = {}; weeksData.forEach(w=>{ byNum[w.weekNum]=w; });
  const pre = weeksData.filter(w => Number(w.weekNum) <= 0);
  const sum = k => pre.reduce((a,w)=> a + (Number(w[k])||0), 0);
  // Line values are NET of that line's churn — "Net MRR is what counts".
  let gfFleetGross = OPENING_MRR.gfFleets + sum('gfNewMRR') - sum('gfChurn');
  let gfDriverGross = OPENING_MRR.gfDrivers + sum('gfB2cMRR') - sum('gfChurnB2c');
  let gfChurnRun = sum('gfChurn') + sum('gfChurnB2c');
  let gfRunning = gfFleetGross + gfDriverGross;
  let fvRunning = OPENING_MRR.fv + sum('fvNewMRR') - sum('fvChurn');
  let running = gfRunning + fvRunning;
  // Committed and wired are tracked separately so a commitment that is later
  // wired isn't counted twice; "secured" = the larger of the two.
  let frCommitRun = sum('frCommitted'), frWiredRun = sum('frClosedCash');
  let frRunning = Math.max(frCommitRun, frWiredRun);
  let cumTouches=sum('frTouches'), cumResponses=sum('frResponses'), cumMeetHeld=sum('frMeetHeld'),
      cumDD=sum('frDD'), cumTermSheets=sum('frTermSheets'), cumCloses=sum('frCloses');
  openingCache = { total: running, fromWeeks: pre.length, gf: gfRunning, fv: fvRunning, fr: frRunning,
    cumTouches, cumResponses, cumMeetHeld, cumDD, cumTermSheets, cumCloses };
  const series = [];
  for (let n=1; n<=WEEKS.length; n++){
    const w = byNum[n];
    const logged = !!w;
    if (logged){
      const gfNet = (Number(w.gfNewMRR)||0) + (Number(w.gfB2cMRR)||0) - (Number(w.gfChurn)||0) - (Number(w.gfChurnB2c)||0);
      const fvNet = (Number(w.fvNewMRR)||0) - (Number(w.fvChurn)||0);
      gfRunning += gfNet; fvRunning += fvNet; running += gfNet + fvNet;
      gfFleetGross += (Number(w.gfNewMRR)||0) - (Number(w.gfChurn)||0);
      gfDriverGross += (Number(w.gfB2cMRR)||0) - (Number(w.gfChurnB2c)||0);
      gfChurnRun += (Number(w.gfChurn)||0) + (Number(w.gfChurnB2c)||0);
      frCommitRun += Number(w.frCommitted)||0; frWiredRun += Number(w.frClosedCash)||0;
      frRunning = Math.max(frCommitRun, frWiredRun);
      cumTouches += Number(w.frTouches)||0; cumResponses += Number(w.frResponses)||0;
      cumMeetHeld += Number(w.frMeetHeld)||0; cumDD += Number(w.frDD)||0;
      cumTermSheets += Number(w.frTermSheets)||0; cumCloses += Number(w.frCloses)||0;
    }
    series.push({ n, monday:WEEKS[n-1].monday, logged, cumulative:running,
      gfCum:gfRunning, fvCum:fvRunning, frCum:frRunning,
      gfFleetGross, gfDriverGross, gfChurnRun, frCommitRun, frWiredRun,
      cumTouches, cumResponses, cumMeetHeld, cumDD, cumTermSheets, cumCloses, raw:w });
  }
  return series;
}

function renderChart(series){
  const W=900,H=280,padL=54,padR=20,padT=16,padB=34;
  const plotW=W-padL-padR, plotH=H-padT-padB;
  const NW = WEEKS.length;
  const x = n => padL + (n/NW)*plotW;
  const yMax = Math.max(FLOOR*1.1, ...series.map(s=>s.cumulative*1.1), 1000);
  const y = v => padT + plotH - (v/yMax)*plotH;

  let grid='';
  [0, FLOOR/2, FLOOR].forEach(t=>{
    grid += `<line x1="${padL}" y1="${y(t)}" x2="${W-padR}" y2="${y(t)}" stroke="var(--border)" stroke-width="1"/>`;
    grid += `<text x="${padL-8}" y="${y(t)+4}" text-anchor="end" font-size="10.5">${fmt$(t)}</text>`;
  });


  // Sprint 01 plan target (end-of-week total MRR), placed on the dashboard
  // weeks whose Monday matches a plan week.
  let planPts = `${x(0)},${y(0)} `, planDots = '';
  WEEKS.forEach(w=>{ const pl = planFor(w.monday); if (pl){
    planPts += `${x(w.n)},${y(pl.total)} `;
    planDots += `<circle cx="${x(w.n)}" cy="${y(pl.total)}" r="2.6" fill="var(--navy)"/>`;
  }});

  let actualPts = `${x(0)},${y(openingCache.total)} `, dots='';
  series.forEach(s=>{ if(s.logged){
    actualPts += `${x(s.n)},${y(s.cumulative)} `;
    dots += `<circle cx="${x(s.n)}" cy="${y(s.cumulative)}" r="4" fill="var(--green)" stroke="#fff" stroke-width="1.5"/>`;
  }});

  const ti = todayInfo();
  const todayX = x(Math.min(NW, Math.max(0, (daysBetween(START_ISO, bizToday()) + 0.5)/7)));

  document.getElementById('chartSvg').innerHTML = `
    ${grid}
    <line x1="${x(0)}" y1="${padT}" x2="${x(0)}" y2="${H-padB}" stroke="var(--border)"/>
    <line x1="${padL}" y1="${H-padB}" x2="${W-padR}" y2="${H-padB}" stroke="var(--border)"/>
    <polyline points="${planPts}" fill="none" stroke="var(--navy)" stroke-width="1.6" stroke-dasharray="4 4" opacity=".8"/>
    ${planDots}
    <polyline points="${actualPts}" fill="none" stroke="var(--green)" stroke-width="2.5"/>
    ${dots}
    <line x1="${todayX}" y1="${padT}" x2="${todayX}" y2="${H-padB}" stroke="var(--navy)" stroke-width="1" stroke-dasharray="3 3" opacity=".35"/>
    ${WEEKS.map(w=>`<text x="${x(w.n)}" y="${H-padB+16}" text-anchor="middle" font-size="10.5">W${w.n}</text>`).join('')}
  `;
}

/** Total-MRR status against the Sprint 01 plan's target for week n
    (On pace ≥100% · Watch 75–99% · Behind <75%). */
function statusFor(cumulative, n){
  const plan = WEEKS[n-1] && planFor(WEEKS[n-1].monday);
  return plan ? planStatus(cumulative, plan.total) : 'ok';
}

function rateBadge(rate, benchmark){
  const ok = rate >= benchmark;
  return `${pct(rate)} <span style="color:${ok?'var(--ok)':'var(--risk)'};">${ok?'&#10003;':'&#9650;'}</span>`;
}

function renderNorthStar(series){
  const lastLogged = [...series].reverse().find(s=>s.logged);
  const cumulative = lastLogged ? lastLogged.cumulative : openingCache.total;
  const frCumulative = lastLogged ? lastLogged.frCum : (openingCache.fr || 0);
  const ti = todayInfo();
  const weeksRemaining = Math.max(1, WEEKS.length - (ti.currentWeek||0));

  document.getElementById('statCum').textContent = fmt$(cumulative);
  document.getElementById('statGfMRR').textContent = fmt$(lastLogged ? lastLogged.gfCum : (openingCache.gf || 0));
  document.getElementById('statFvMRR').textContent = fmt$(lastLogged ? lastLogged.fvCum : (openingCache.fv || 0));
  const gap = Math.max(0, FLOOR - cumulative);
  document.getElementById('statGap').innerHTML = gap===0 ? 'Goal met &mdash; pushing to $10K stretch' : fmt$(gap);
  // Plan is back-loaded: show what this week's plan target still needs.
  const curPlan = WEEKS[(ti.currentWeek||1)-1] && planFor(WEEKS[(ti.currentWeek||1)-1].monday);
  document.getElementById('statPace').textContent = curPlan
    ? fmt$(Math.max(0, curPlan.total - cumulative)) + ' (wk ' + curPlan.pw + ' target ' + fmt$(curPlan.total) + ')'
    : '—';

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
  const cw = lastLogged || { frCommitRun:0, frWiredRun:0 };
  const fs = document.getElementById('statFrSplit');
  if (fs) fs.textContent = `${fmt$(cw.frCommitRun||0)} committed · ${fmt$(cw.frWiredRun||0)} wired`;

  // Same rows, same rules as the Benchmark vs actual table.
  const vrows = varianceRows(series).filter(r => r.plan && r.lines.total);
  let paceStatus='none', paceLabel='No weeks logged yet';
  if (vrows.length){
    const last = vrows[vrows.length-1], L = last.lines.total;
    paceStatus = L.status;
    paceLabel = L.status==='ok' ? `On pace — week ${last.s.n} plan target ${fmt$(L.target)}`
              : L.status==='watch' ? `Watch — ${L.pct}% of the week ${last.s.n} plan target`
              : `Behind — ${L.pct}% of the week ${last.s.n} plan target (${fmt$(L.target)})`;
  }
  const pill = document.getElementById('pacePill');
  pill.className = 'pill ' + (paceStatus==='none'?'':paceStatus);
  document.getElementById('paceLabel').textContent = paceLabel;

  // "Line behind two weeks running → name the cause first."
  const LINE_NAMES = { total:'total MRR', gfFleets:'grey fleet (fleets)', gfDrivers:'grey fleet (drivers)', fv:'fuel verification' };
  let behindLines = [];
  if (vrows.length >= 2){
    const a = vrows[vrows.length-2], b = vrows[vrows.length-1];
    if (b.s.n === a.s.n + 1)
      behindLines = Object.keys(LINE_NAMES).filter(k => a.lines[k].status==='risk' && b.lines[k].status==='risk');
  }
  document.getElementById('escalationBanner').innerHTML = behindLines.length
    ? `<div class="banner risk"><span>&#9888;</span><div><b>Behind the Sprint 01 plan two weeks running:</b> ${behindLines.map(k=>LINE_NAMES[k]).join(', ')}. Name the cause first — volume, conversion, or deal timing. More volume rarely fixes a conversion problem.</div></div>`
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
}

/* ---------- week history tables ---------- */

/** "Updated by" cell for a logged week: who saved it last, and when. */
function whoCell(r){
  if (!r || !r.updatedBy) return `<td class="whocell"><span class="muted">—</span></td>`;
  const when = r.updatedAt ? new Date(r.updatedAt).toLocaleString('en-US',
    {month:'short', day:'numeric', hour:'numeric', minute:'2-digit'}) : '';
  return `<td class="whocell"><b>${esc(r.updatedBy)}</b>${when ? `<span class="whenline">${when}</span>` : ''}</td>`;
}

function historyRowsGf(series){
  const rows = series.filter(s=>s.logged);
  if (!rows.length) return `<tr class="empty-row"><td colspan="9">No weeks logged yet &mdash; week 1 starts Mon Sep 28, 2026.</td></tr>`;
  return rows.map(s=>{
    const r = s.raw;
    const churn = (Number(r.gfChurn)||0)+(Number(r.gfChurnB2c)||0);
    const net = (Number(r.gfNewMRR)||0)+(Number(r.gfB2cMRR)||0)-churn;
    const cf = Number(r.gfCacFleet), cs = Number(r.gfCacSub);
    const cacOver = (cf && cf>CAC_FLEET_CEIL) || (cs && cs>CAC_SUB_CEIL);
    return `<tr><td>Week ${s.n}</td>
      <td class="num">${fmt$(Number(r.gfNewMRR)||0)}</td><td class="num">${fmt$(Number(r.gfB2cMRR)||0)}</td>
      <td class="num">${fmt$(churn)}</td><td class="num">${fmt$(net)}</td>
      <td class="num"><b>${fmt$(s.gfCum)}</b></td><td>${esc(r.gfFocus||'—')}</td>
      <td>${cacOver?'<span class="pill risk"><span class="dot"></span>over</span>':'<span class="pill ok"><span class="dot"></span>ok</span>'}</td>${whoCell(r)}</tr>`;
  }).join('');
}

function historyRowsFv(series){
  const rows = series.filter(s=>s.logged);
  if (!rows.length) return `<tr class="empty-row"><td colspan="8">No weeks logged yet.</td></tr>`;
  return rows.map(s=>{
    const r = s.raw;
    const cacOver = Number(r.fvCac) && Number(r.fvCac)>CAC_FLEET_CEIL;
    return `<tr><td>Week ${s.n}</td>
      <td class="num">${fmt$(Number(r.fvNewMRR)||0)}</td><td class="num">${fmt$(Number(r.fvChurn)||0)}</td>
      <td class="num"><b>${fmt$(s.fvCum)}</b></td><td>${esc(r.fvFocus||'—')}</td>
      <td>${String(r.fvTestimonial)==='1'?'<span class="pill ok"><span class="dot"></span>secured</span>':'<span class="pill watch"><span class="dot"></span>not yet</span>'}</td>
      <td>${cacOver?'<span class="pill risk"><span class="dot"></span>over</span>':'<span class="pill ok"><span class="dot"></span>ok</span>'}</td>${whoCell(r)}</tr>`;
  }).join('');
}

function historyRowsFr(series){
  const rows = series.filter(s=>s.logged);
  if (!rows.length) return `<tr class="empty-row"><td colspan="9">No weeks logged yet.</td></tr>`;
  return rows.map(s=>{
    const r = s.raw;
    return `<tr><td>Week ${s.n}</td>
      <td class="num">${Number(r.frTouches)||0}</td><td class="num">${Number(r.frResponses)||0}</td>
      <td class="num">${Number(r.frMeetHeld)||0}</td><td class="num">${Number(r.frTermSheets)||0}</td>
      <td class="num">${fmt$(Number(r.frCommitted)||0)}</td><td class="num">${fmt$(Number(r.frClosedCash)||0)}</td>
      <td>${esc(r.frFocus||'—')}</td>${whoCell(r)}</tr>`;
  }).join('');
}

/* ---------- Sprint 01 benchmark & variance ---------- */

const STATUS_WORD = { ok:'On pace', watch:'Watch', risk:'Behind' };

/** Actual end-of-week MRR by plan line for one series point (opening MRR included). */
function actualsFor(s){
  // Opening MRR (pre-sprint weeks + OPENING_MRR) is already in the series.
  return { gfFleets:s.gfFleetGross, gfDrivers:s.gfDriverGross, fv:s.fvCum, total:s.cumulative };
}

/** Plan rows with actuals, variance and status (doc rules), one per dashboard week. */
function varianceRows(series){
  const today = bizToday();
  const prevRaw = {};   // previous logged plan week's status before the two-week rule
  return series.map(s=>{
    const plan = planFor(s.monday);
    const sunday = addDays(s.monday, 6);
    const reviewDay = addDays(sunday, 1);   // the following Monday's 7-step check
    const state = !plan ? 'pre' : s.logged ? 'logged'
                : today > reviewDay ? 'missing' : today > sunday ? 'due'
                : today >= s.monday ? 'current' : 'upcoming';
    const lines = {};
    if (plan && s.logged){
      const act = actualsFor(s);
      for (const k of ['gfFleets','gfDrivers','fv','total']){
        const raw = planStatus(act[k], plan[k]);
        // "Behind = under 75%, or Watch two weeks in a row."
        const st = (raw === 'watch' && prevRaw[k] === 'watch') ? 'risk' : raw;
        lines[k] = { actual:act[k], target:plan[k], diff:act[k]-plan[k],
                     pct: plan[k] ? Math.floor(act[k]/plan[k]*100) : null, status:st };
        prevRaw[k] = raw;
      }
    } else if (plan && state === 'missing'){
      for (const k of Object.keys(prevRaw)) delete prevRaw[k];
    }
    return { s, plan, state, lines };
  });
}

function varCell(line, target){
  if (!line) return `<td class="varcell"><span class="vtarget">${fmt$(target)}</span></td>`;
  const sign = line.diff > 0 ? '+' : line.diff < 0 ? '−' : '±';
  return `<td class="varcell ${line.status}">
    <span class="vactual">${fmt$(line.actual)}</span>
    <span class="vtarget">of ${fmt$(line.target)}</span>
    <span class="vdiff">${sign}${fmt$(Math.abs(line.diff))}${line.pct!=null?` · ${line.pct}%`:''}</span>
    <span class="vstatus">${STATUS_WORD[line.status]}</span>
  </td>`;
}

function renderVariance(series){
  // A re-render would drop a note being typed: save it first (blur commits).
  const active = document.activeElement;
  if (active && active.classList && active.classList.contains('statusnote') &&
      document.getElementById('varianceBody').contains(active)) active.blur();
  const rows = varianceRows(series);
  const body = rows.map(({s, plan, state, lines})=>{
    const wkDate = new Date(s.monday+'T00:00:00Z').toLocaleDateString('en-US',{month:'short',day:'numeric',timeZone:'UTC'});
    if (!plan){
      const wk = `<td class="vweek"><b>Week ${s.n}</b><span>${wkDate}</span></td>`;
      return `<tr class="vpre">${wk}<td colspan="6" class="vnote">Before Sprint 01 starts (Sep 28) — no plan target for this week.</td></tr>`;
    }
    const overall = lines.total ? lines.total.status : null;
    const stateCell = overall
      ? `<span class="pill ${overall}"><span class="dot"></span>${STATUS_WORD[overall]}</span>`
      : state === 'missing' ? `<span class="pill risk"><span class="dot"></span>Not reported</span>`
      : state === 'due' ? `<span class="pill watch"><span class="dot"></span>Due today</span>`
      : state === 'current' ? `<span class="pill"><span class="dot"></span>This week</span>`
      : `<span class="pill"><span class="dot"></span>Upcoming</span>`;
    const wk = `<td class="vweek"><b>Week ${s.n}</b><span>${wkDate}</span>${stateCell}</td>`;
    const miles = [plan.rev && `<div><b>Revenue:</b> ${esc(plan.rev)}</div>`,
                   plan.raise && `<div><b>Raise:</b> ${esc(plan.raise)}</div>`,
                   plan.actions && `<div><b>Top 3 actions:</b> ${plan.actions.map((x,i)=>`${i+1}. ${esc(x[0])} — ${esc(x[1])}`).join('; ')}</div>`,
                   plan.also && `<div><b>Also:</b> ${esc(plan.also)}</div>`,
                   plan.note && `<div class="vrule">${esc(plan.note)}</div>`,
                   plan.rule && `<div class="vrule">${esc(plan.rule)}</div>`].filter(Boolean).join('');
    return `<tr class="${plan.checkpoint?'vcheck':''}${state==='current'?' vcurrent':''}">${wk}
      ${varCell(lines.gfFleets, plan.gfFleets)}${varCell(lines.gfDrivers, plan.gfDrivers)}
      ${varCell(lines.fv, plan.fv)}${varCell(lines.total, plan.total)}
      ${state === 'upcoming'
        ? `<td class="vreview"><span class="muted">Opens ${new Date(s.monday+'T00:00:00Z').toLocaleDateString('en-US',{month:'short',day:'numeric',timeZone:'UTC'})}</span></td>`
        : statusCell('wk', 'wk:' + s.n, 'Week ' + s.n + ' review (' + new Date(s.monday+'T00:00:00Z').toLocaleDateString('en-US',{month:'short',day:'numeric',timeZone:'UTC'}) + ')', trackerCache).replace('class="statuscell"','class="statuscell vreview"')}
      <td class="vmiles">${miles}</td></tr>`;
  }).join('');
  document.getElementById('varianceBody').innerHTML = body;
  document.querySelectorAll('#varianceBody .whynote').forEach(fitWhy);
  const foot = document.getElementById('varOpening');
  if (foot) foot.textContent = openingCache.total
    ? `Totals include ${fmt$(openingCache.total)} MRR already running before Sprint 01` +
      (openingCache.fromWeeks ? ' (weeks saved for Sep 14 and Sep 21).' : ' (opening MRR set in data.js).')
    : '';

  // One-line summary of the latest logged plan week, leading with overall status.
  const last = [...rows].reverse().find(r => r.plan && r.lines.total);
  const sum = document.getElementById('varianceSummary');
  if (!last){
    sum.innerHTML = 'No Sprint 01 week logged yet. Week 1 (Sep 28) targets <b>$170</b> total MRR.';
  } else {
    const L = last.lines, word = k => `${STATUS_WORD[L[k].status]}`;
    const behind = ['gfFleets','gfDrivers','fv'].filter(k => L[k].status !== 'ok')
      .map(k => ({gfFleets:'grey fleet (fleets)', gfDrivers:'grey fleet (drivers)', fv:'fuel verification'})[k]);
    sum.innerHTML = `<span class="pill ${L.total.status}"><span class="dot"></span>${word('total')}</span>
      Week ${last.s.n}: total MRR <b>${fmt$(L.total.actual)}</b> vs <b>${fmt$(L.total.target)}</b> target
      (${L.total.diff>=0?'+':'−'}${fmt$(Math.abs(L.total.diff))}, ${L.total.pct}%).
      ${behind.length ? 'Below target: ' + behind.join(', ') + '. Name the cause first — volume, conversion, or deal timing.' : 'Every line at or above target.'}`;
  }
}

/** "This week's plan" card beside the weekly entry form. */
function renderWeekPlan(n){
  const w = WEEKS.find(x => x.n === Number(n));
  const el = document.getElementById('weekPlan');
  if (!w || !el) return;
  const plan = planFor(w.monday);
  if (!plan){
    el.innerHTML = `<div class="plancard pre"><b>Week ${w.n} is before Sprint 01.</b> This week has no reference target in the Sprint 01 plan.</div>`;
    return;
  }
  el.innerHTML = `<div class="plancard${plan.checkpoint?' check':''}">
    <div class="planhead"><span class="eyebrow">Plan benchmark · Sprint 01 week ${plan.pw} of ${WEEKS.length}</span>
      <span class="plansrc">${esc(PLAN_SOURCE)}</span></div>
    <div class="plangrid">
      <div><span>Grey fleet — fleets</span><b>${fmt$(plan.gfFleets)}</b></div>
      <div><span>Grey fleet — drivers</span><b>${fmt$(plan.gfDrivers)}</b></div>
      <div><span>Fuel verification</span><b>${fmt$(plan.fv)}</b></div>
      <div class="tot"><span>Total MRR, end of week</span><b>${fmt$(plan.total)}</b></div>
    </div>
    ${plan.rev?`<div class="planmile"><b>Revenue milestone:</b> ${esc(plan.rev)}</div>`:''}
    ${plan.raise?`<div class="planmile"><b>Raise milestone:</b> ${esc(plan.raise)}</div>`:''}
    ${plan.actions?`<div class="planmile"><b>Top 3 actions:</b><ol class="planacts">${plan.actions.map(x=>`<li>${esc(x[0])} — <b>${esc(x[1])}</b></li>`).join('')}</ol></div>`:''}
    ${plan.also?`<div class="planmile"><b>Also:</b> ${esc(plan.also)}</div>`:''}
    ${plan.note?`<div class="planmile rule">${esc(plan.note)}</div>`:''}
    ${plan.rule?`<div class="planmile rule">${esc(plan.rule)}</div>`:''}
  </div>`;
}

/* ---------- runway, flags, gates, paid-ad numbers, ops table ---------- */

const MONTH_DAYS = 30.44;
function lastWith(series, pred){ return [...series].reverse().find(s => s.logged && pred(s.raw)); }
function fmtDate(iso){ return new Date(iso+'T00:00:00Z').toLocaleDateString('en-US',{month:'short', day:'numeric', year:'numeric', timeZone:'UTC'}); }

function renderRunway(series){
  const el = document.getElementById('statRunway'), ban = document.getElementById('runwayBanner');
  const w = [...series].reverse().find(s => s.logged);
  const spend = w ? Number(w.raw.opSpend)||0 : 0, cash = w ? Number(w.raw.opCash)||0 : 0;
  if (!w || !spend || !cash){
    el.textContent = w ? `not reported (wk ${w.n})` : 'not reported';
    ban.innerHTML = ''; return;
  }
  const months = cash / spend;
  const outIso = addDays(addDays(w.monday, 6), Math.floor(months * MONTH_DAYS));
  const red = outIso < RUNWAY_NEEDED_UNTIL;
  el.innerHTML = `<span style="color:var(--${red?'risk':'ok'});">${months.toFixed(1)} mo</span>`;
  ban.innerHTML = red
    ? `<div class="banner risk"><span class="ico">&#9888;</span><div><b>Runway red (week ${w.n}):</b> ${fmt$(cash)} cash ÷ ${fmt$(spend)}/month = ${months.toFixed(1)} months — cash runs out around ${fmtDate(outIso)}, before expected close (${esc(CLOSE_WEEKS)}) + 3 months (${fmtDate(RUNWAY_NEEDED_UNTIL)}). Fixes: ${esc(RUNWAY_FIXES)}.</div></div>`
    : '';
}

function renderFlags(series){
  const out = [], today = bizToday();
  // Partner conversations — "at least one every week; flag if 7+ days pass".
  // Weekly data has no exact date, so count from the end of the last week
  // with a partner conversation (the most generous reading).
  const lastP = [...series].reverse().find(s => s.logged && ((Number(s.raw.gfPartner)||0) + (Number(s.raw.fvPartner)||0)) > 0);
  const pd = document.getElementById('statPartnerDays');
  const sprintDays = daysBetween(START_ISO, today);
  if (lastP){
    const days = daysBetween(addDays(lastP.monday, 6), today);
    pd.textContent = days <= 0 ? `this week (wk ${lastP.n})` : `${days} day${days===1?'':'s'} (wk ${lastP.n})`;
    if (days >= 7) out.push(`<div class="banner risk"><span>&#9888;</span><div><b>${days} days since the last logged partner conversation</b> (week ${lastP.n}). The plan needs at least one every week — flag at 7+ days.</div></div>`);
  } else {
    pd.textContent = 'none logged';
    if (sprintDays >= 7) out.push(`<div class="banner risk"><span>&#9888;</span><div><b>No partner conversation logged yet</b> — ${sprintDays} days into the sprint. The plan needs at least one every week.</div></div>`);
  }
  // Churn — "flag the same week it appears": the current or just-finished week.
  const ti = todayInfo();
  series.filter(s => s.logged && s.n >= ti.currentWeek - 1 && s.n <= ti.currentWeek).forEach(s=>{
    const r = s.raw, f = Number(r.gfChurn)||0, d = Number(r.gfChurnB2c)||0, v = Number(r.fvChurn)||0;
    if (f + d + v > 0) out.push(`<div class="banner watch"><span>&#9888;</span><div><b>Churn in week ${s.n}: ${fmt$(f+d+v)}</b> (grey-fleet fleets ${fmt$(f)}, drivers ${fmt$(d)}, fuel verification ${fmt$(v)}). Net MRR is what counts.</div></div>`);
  });
  // Cost limits — "any channel above its limit two weeks in a row → cut or change it".
  const over = [
    ['grey-fleet CAC per fleet', 'gfCacFleet', CAC_FLEET_CEIL],
    ['CAC per paying driver', 'gfCacSub', CAC_SUB_CEIL],
    ['fuel-verification CAC per fleet', 'fvCac', CAC_FLEET_CEIL]
  ].filter(([,k,lim])=>{
    const L = series.filter(s=>s.logged);
    for (let i=1;i<L.length;i++){
      const a = Number(L[i-1].raw[k])||0, b = Number(L[i].raw[k])||0;
      if (L[i].n === L[i-1].n + 1 && a > lim && b > lim && i === L.length-1) return true;
    }
    return false;
  }).map(x=>x[0]);
  if (over.length) out.push(`<div class="banner risk"><span>&#9888;</span><div><b>Over the cost limit two weeks in a row:</b> ${over.join(', ')}. Cut or change that channel (limits $850 per fleet, $20 per paying driver).</div></div>`);
  document.getElementById('flagBanner').innerHTML = out.join('');
}

function gateRow(ok, label, detail){
  const mark = ok === null ? '<span class="gmark">—</span>' : ok ? '<span class="gmark ok">&#10003;</span>' : '<span class="gmark risk">&#10007;</span>';
  return `<div class="grow">${mark}<div><b>${label}</b>${detail?`<span>${detail}</span>`:''}</div></div>`;
}
function renderGates(series){
  const el = document.getElementById('gateCards');
  if (!el) return;
  const t = bizToday();
  const logged = series.filter(s => s.logged);
  const last = logged[logged.length-1];
  // Week-8 checkpoint
  const w8 = series[7], w8plan = planFor(w8.monday);
  const alcoa = (trackerCache['plan:1'] || {}).status || 'ten';
  let cp;
  const w8Review = addDays(addDays(w8.monday, 6), 1);
  if (w8.logged){
    const okMRR = w8.cumulative >= 2000;
    cp = gateRow(okMRR, `Week 8 (Nov 16): total MRR ${fmt$(w8.cumulative)} vs $2,000`,
      okMRR ? 'Stay the course.' : 'Below $2,000: move Prity from Apollo to partner follow-up and partner-sourced leads (not more cold email), and reset expectations — $8K by week 17 is now unlikely.');
  } else if (t > w8Review){
    cp = gateRow(false, 'Week 8 (Nov 16): not reported', 'The checkpoint can’t be confirmed until week 8 is saved — never fill it with the target.');
  } else {
    cp = gateRow(null, 'Week 8 (Nov 16): total MRR ≥ $2,000 → stay the course',
      last ? `Latest: ${fmt$(last.cumulative)} at week ${last.n}.` : 'No week logged yet.');
  }
  const alcoaOk = alcoa === 'hundred';
  const pastW8 = t > addDays(w8.monday, 6);
  cp += gateRow(alcoaOk ? true : (pastW8 ? false : null), 'Alcoa at 100 trucks by week 8',
    alcoaOk ? 'Done.' : pastW8 ? 'Not at 100 — escalate directly.' : `Now: ${statusLabel('alcoa', alcoa)}.`);
  // Pitch gate (week 13), evaluated on the latest logged week
  let pg = '';
  if (!last){
    pg = gateRow(null, 'Pitch gate (week 13, Dec 21)', 'No week logged yet.');
  } else {
    const mrrOk = last.cumulative >= 5000;
    // MRR grew in 3 of the last 4 weeks (consecutive logged weeks)
    let grew = null, growDetail = 'Needs 4 logged weeks in a row.';
    const lastIdx = last.n - 1;
    if (lastIdx >= 4 && [0,1,2,3,4].every(k => series[lastIdx-k].logged)){
      let g = 0; for (let k=0;k<4;k++) if (series[lastIdx-k].cumulative > series[lastIdx-k-1].cumulative) g++;
      grew = g >= 3; growDetail = `Grew in ${g} of the last 4 weeks.`;
    } else if (lastIdx === 3 && [0,1,2,3].every(k => series[lastIdx-k].logged)){
      let g = 0; for (let k=0;k<3;k++) if (series[lastIdx-k].cumulative > series[lastIdx-k-1].cumulative) g++;
      if (series[0].cumulative > openingCache.total) g++;
      grew = g >= 3; growDetail = `Grew in ${g} of the last 4 weeks.`;
    }
    // Gate inputs come from the latest logged week only — never an older week.
    const fleets = Number(last.raw.opPayingFleets) > 0 ? Number(last.raw.opPayingFleets) : null;
    const top = Number(last.raw.opTopCustomer) > 0 ? Number(last.raw.opTopCustomer) : null;
    const share = top !== null && last.cumulative > 0 ? top / last.cumulative : null;
    pg = gateRow(mrrOk, `Total MRR ≥ $5,000`, `Now ${fmt$(last.cumulative)} (week ${last.n}).`)
       + gateRow(grew, 'MRR grew in 3 of the last 4 weeks', growDetail)
       + gateRow(fleets === null ? null : fleets >= 20, '20+ paying fleets', fleets === null ? `Not reported for week ${last.n} — enter in Ops & runway.` : `${fleets} paying fleets (week ${last.n}).`)
       + gateRow(share === null ? null : share <= 0.25, 'No customer over ~25% of MRR (Alcoa included)', share === null ? `Not reported for week ${last.n} — enter the largest customer’s MRR in Ops & runway.` : `Largest customer = ${Math.ceil(share*100)}% of MRR (week ${last.n}).`);
    const met = mrrOk && grew && fleets !== null && fleets >= 20 && share !== null && share <= 0.25;
    const gateDay = WEEKS[12].monday;   // Dec 21
    pg += `<div class="gverdict ${met?'ok':''}">${
      met && t >= gateDay ? 'Gate met — formal pitching can start.'
      : met ? 'All four conditions met today — formal pitching still starts only at the week-13 gate (Dec 21).'
      : t >= gateDay ? 'Not met — keep building relationships, send update #4, re-test weekly.'
      : 'Not met yet — keep building relationships; the gate is checked at week 13 (Dec 21).'}</div>`;
  }
  el.innerHTML = `<div class="gblock"><h4>Week-8 checkpoint</h4>${cp}</div><div class="gblock"><h4>Pitch gate · week 13 (Dec 21)</h4>${pg}</div>`;
}

// Referral reward goes live in week 1 (Sep 28); driver-ad money only after 30 days of referral data.
const DRIVER_ADS_EARLIEST = '2026-10-28';
function renderAdLive(series){
  const a = document.getElementById('adAuditLive'), d = document.getElementById('adDriverLive');
  if (!a || !d) return;
  const today = bizToday();
  const L = series.filter(s=>s.logged);
  const sum = k => L.reduce((t,s)=> t + (Number(s.raw[k])||0), 0);
  const gateT = trackerCache['gate:tracking'] || {};
  const gate = gateT.status || 'not-live';
  const dateOf = iso => iso ? new Date(iso).toISOString().slice(0,10) : null;
  // Spend before tracking was marked live breaches the gate (judged per week, not by today's status).
  const liveSince = (need) => (need === 'site' ? ['site-live','all-live'] : ['all-live']).includes(gate) ? dateOf(gateT.updatedAt) : null;
  const breach = (key, need) => {
    const since = liveSince(need);
    return L.filter(s => Number(s.raw[key]) > 0 && (!since || addDays(s.monday, 6) < since)).map(s => s.n);
  };
  const warn = msg => `<div class="adwarn">&#9888; ${msg}</div>`;

  // Gated audit: needs website tracking; decide at day 45.
  const aStart = L.find(s => Number(s.raw.opAuditSpend) > 0);
  const aSpend = sum('opAuditSpend'), aLeads = sum('opAuditLeads');
  if (!aStart) a.textContent = 'No spend logged.';
  else {
    const day = daysBetween(aStart.monday, today) + 1;
    const cpl = aLeads ? aSpend / aLeads : null;
    const verdict = day < 45 ? `day ${day} of 45 — too early to decide`
      : cpl === null || cpl > 250 ? 'day 45+: stop (over $250 per good-fit lead)'
      : cpl < 150 ? 'day 45+: increase (under $150)' : 'day 45+: hold ($150–250)';
    const zone = day < 45 ? 'watch' : (cpl === null || cpl > 250) ? 'risk' : cpl < 150 ? 'ok' : 'watch';
    a.innerHTML = `${fmt$(aSpend)} spent since week ${aStart.n} · ${aLeads} good-fit leads → ${cpl===null?'no leads yet':fmt$(cpl)+' per lead'} · <b class="z-${zone}">${verdict}</b>` +
      ((b => b.length ? warn(`Spend in week ${b.join(', ')} before website tracking was live — the plan allows no ad spend until it is.`) : '')(breach('opAuditSpend','site')));
  }

  // Driver ads: referral first; ad money only after 30 days of referral data; decide at day 30.
  const dStart = L.find(s => Number(s.raw.opDriverSpend) > 0);
  // Referral reward start: when the driver-ads row was set to "Referral reward live";
  // if it has moved past that, fall back to the plan (live in week 1).
  const dT = trackerCache['plan:6'] || {};
  const refStart = dT.status === 'referral-live' ? dateOf(dT.updatedAt) : dT.status && dT.status !== 'not-started' ? START_ISO : null;
  const earliest = refStart ? addDays(refStart, 30) : '9999-12-31';
  const dSpend = sum('opDriverSpend'), dUsers = sum('opDriverUsers'), intros = sum('opManagerIntros');
  if (!dStart) d.textContent = 'No ad spend logged — referral reward first ($0).';
  else {
    const day = daysBetween(dStart.monday, today) + 1;
    const cpu = dUsers ? dSpend / dUsers : null;
    const in60 = L.some(s => s.n >= dStart.n && daysBetween(dStart.monday, s.monday) <= 60 && (Number(s.raw.gfJohn)||0) > 0);
    const stop = cpu === null || cpu > 40 || intros === 0;
    const verdict = day < 30 ? `day ${day} of 30 — too early to decide`
      : stop ? `day 30+: stop (${cpu===null?'no users':cpu>40?'over $40 per active work-email user':'no manager intros'})`
      : in60 ? 'day 30+: increase (3+ colleagues at one company within 60 days)' : 'day 30+: hold';
    const zone = day < 30 ? 'watch' : stop ? 'risk' : in60 ? 'ok' : 'watch';
    d.innerHTML = `${fmt$(dSpend)} spent since week ${dStart.n} · ${dUsers} active work-email users · ${intros} manager intros → ${cpu===null?'no users yet':fmt$(cpu)+' per user'} · <b class="z-${zone}">${verdict}</b>` +
      (!refStart ? warn('Referral reward isn’t marked live yet — referral first; ad money only after 30 days of referral data.')
        : addDays(dStart.monday, 6) < earliest ? warn(`Ad money logged before 30 days of referral data (earliest ${fmtDate(earliest)}).`) : '') +
      ((b => b.length ? warn(`Spend in week ${b.join(', ')} before app events were live — the plan allows no ad spend until tracking is live.`) : '')(breach('opDriverSpend','app')));
  }
}

function historyRowsOp(series){
  const rows = series.filter(s=>s.logged);
  if (!rows.length) return `<tr class="empty-row"><td colspan="8">No weeks logged yet.</td></tr>`;
  return rows.map(s=>{
    const r = s.raw, cash = Number(r.opCash)||0, spend = Number(r.opSpend)||0;
    const months = cash && spend ? (cash/spend).toFixed(1) : '—';
    const acts = [1,2,3].map(i => r['opAct'+i] ? `${esc(r['opAct'+i])}${r['opOwn'+i]?` <span class="muted">(${esc(r['opOwn'+i])})</span>`:''}` : '').filter(Boolean);
    return `<tr><td>Week ${s.n}</td>
      <td class="num">${cash?fmt$(cash):'—'}</td><td class="num">${spend?fmt$(spend):'—'}</td><td class="num">${months}</td>
      <td class="num">${Number(r.opPayingFleets)||'—'}</td><td class="num">${Number(r.opTopCustomer)?fmt$(Number(r.opTopCustomer)):'—'}</td>
      <td style="white-space:normal; min-width:240px;">${acts.length ? acts.join('<br>') : '—'}</td>${whoCell(r)}</tr>`;
  }).join('');
}

function renderAll(weeksData){
  const series = seriesFrom(weeksData);
  renderChart(series);
  renderNorthStar(series);
  document.getElementById('gfHistoryBody').innerHTML = historyRowsGf(series);
  document.getElementById('fvHistoryBody').innerHTML = historyRowsFv(series);
  document.getElementById('frHistoryBody').innerHTML = historyRowsFr(series);
  document.getElementById('opHistoryBody').innerHTML = historyRowsOp(series);
  seriesCache = series;
  renderVariance(series);
  renderRunway(series);
  renderFlags(series);
  renderGates(series);
  renderAdLive(series);
}

/* ---------- change-history panel ---------- */

let versionCache = [];
let trackerCache = {};   // latest tracker rows, shared by every tracked table
const pendingTrackers = new Map();   // key → values of a save still in flight
let seriesCache = null;   // latest weekly series, for re-rendering the variance table

/** Formats one change value, handling both weekly fields and tracker statuses. */
function fmtChange(entry, c, which){
  const raw = c[which];
  if (entry.scope === 'tracker'){
    if (c.field === 'status'){
      const key = entry.ref_key;
      const group = String(key).split(':')[0];
      const setName = setForRow(key, group);
      // An entry saved under a row's earlier set reads in that set's words,
      // including what an untouched row showed back then.
      const saved = entry.data ? (entry.data.status || '') : '';
      const legacy = legacySetForRow(key, group);
      const isOld = legacy && saved !== '' && !inSet(setName, saved);
      // A row never touched has no stored status, but the chip has been
      // showing its default all along — so report that, not "(none)".
      const shown = raw === '' ? (isOld ? legacyDefaultForRow(key, legacy) : defaultForRow(key, setName)) : raw;
      return inSet(setName, shown) && !isOld ? statusLabel(setName, shown) : foreignLabel(key, group, shown);
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
          ${(r.scope==='week' && !(/^\d+$/.test(String(r.ref_key)) && Number(r.ref_key) >= 1)) ? '' : `<button class="btn ghost tiny" data-restore="${i}" style="margin-top:6px;">Restore this version</button>`}
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
const FIELD_TAB = id => id.startsWith('gf') ? 'gf' : id.startsWith('fv') ? 'fv' : id.startsWith('op') ? 'op' : 'fr';
const TABS = ['gf','fv','fr','op'];

/**
 * Tracks which fields differ from what is stored, so the user can see at a
 * glance what is unsaved — per field, per tab, and in the save bar. Also
 * flags a realized CAC above its ceiling as it is typed.
 */
function markDirtyTracking(baseline){
  const recount = () => {
    const counts = { gf:0, fv:0, fr:0, op:0 };
    FORM_IDS.forEach(id=>{
      const el = document.getElementById('f_'+id);
      if (el && el.classList.contains('dirty')) counts[FIELD_TAB(id)]++;
    });
    TABS.forEach(t=>{
      const b = document.getElementById('count-'+t);
      b.textContent = counts[t] || '';
      b.classList.toggle('on', counts[t] > 0);
    });
    const total = counts.gf + counts.fv + counts.fr + counts.op;
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
/** Start of the calendar period containing `now`. */
function periodStart(period, now){
  const d = new Date(now);
  d.setHours(0,0,0,0);
  if (period === 'week'){
    // Monday-based, matching the sprint's own Monday cadence.
    const dow = (d.getDay() + 6) % 7;
    d.setDate(d.getDate() - dow);
  } else if (period === 'month'){
    d.setDate(1);
  } else if (period === 'quarter'){
    d.setMonth(Math.floor(d.getMonth()/3)*3, 1);
  } else if (period === 'year'){
    d.setMonth(0, 1);
  } else {
    return null;
  }
  return d;
}

/** Builds the Store filter from the three history controls. */
function currentHistFilter(){
  const f = {};
  const type = document.getElementById('histFilter').value;
  if (type === 'scope:week')    f.scope = 'week';
  if (type === 'scope:tracker') f.scope = 'tracker';
  if (type.startsWith('week:')){ f.scope = 'week'; f.refKey = type.slice(5); }

  const period = document.getElementById('histPeriod').value;
  if (period === 'custom'){
    const from = document.getElementById('histFrom').value;
    const to   = document.getElementById('histTo').value;
    if (from) f.from = new Date(from + 'T00:00:00').toISOString();
    if (to)   f.to   = new Date(to   + 'T23:59:59').toISOString();
  } else if (period !== 'all'){
    const start = periodStart(period, new Date());
    if (start) f.from = start.toISOString();
  }

  if (viewingArchive) f.archived = true;
  return Object.keys(f).length ? f : (viewingArchive ? { archived:true } : undefined);
}

let viewingArchive = false;
/* Set during init. Every path that changes history goes through this so the
   entry counters and archive banner stay in sync with the list. */
let historyReloader = null;

async function refreshEverything(){
  /* The database can be unreachable — an outage, a paused project, or just
     bad wifi. When that happens the plan content must still render and stay
     readable; only the saved numbers are missing. So failures here are
     reported in the banner rather than thrown, which would blank the page. */
  let weeks = [], trackers = {};
  try{
    [weeks, trackers] = await Promise.all([Store.loadWeeks(), Store.loadTrackers()]);
    dataReachable = true;
  }catch(e){
    dataReachable = false;
    console.error('Could not load saved data:', e);
    showConnectionProblem(e.message);
  }
  renderAll(weeks);
  renderTrackedTables(trackers);
  try{
    if (historyReloader) await historyReloader();
    else renderHistory(await Store.loadHistory(currentHistFilter()));
  }catch(e){
    console.error('Could not load history:', e);
    renderHistory([]);
  }
}

let dataReachable = true;

/** Replaces the connection banner with a clear, actionable failure message. */
function showConnectionProblem(detail){
  document.getElementById('connBanner').innerHTML =
    `<div class="banner risk"><span class="ico">&#9888;</span><div>
      <b>Can't reach the database.</b> The plan below is still readable, but saved
      numbers and history can't load, and saving will fail until the connection is back.
      Check your internet, then use Refresh. If it persists, confirm the Supabase
      project is running.
      <div style="margin-top:6px; color:var(--muted); font-size:var(--fs-2xs);">${esc(detail||'')}</div>
    </div></div>`;
}

async function loadWeekIntoForm(n){
  renderWeekPlan(n);
  let w = null;
  try{ w = await Store.loadWeek(n); }
  catch(e){ console.error('Could not load week', n, e); }
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
      new Date(w.updatedAt).toLocaleString('en-US',{month:'short',day:'numeric',hour:'numeric',minute:'2-digit'}), kind:'' });
  }
}

/** Switches the weekly-entry tabs, and remembers which one. */
function showTab(which){
  TABS.forEach(t=>{
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
  const sprintReady = problem ? true : await Store.sprintReady();
  if (problem){
    const local = Store.mode !== 'supabase';
    banner.innerHTML = `<div class="banner ${local?'watch':'risk'}"><span>&#9888;</span><div>
      <b>${local ? 'Browser-only storage' : 'Database unreachable'}:</b> ${esc(problem)}</div></div>`;
  } else if (!sprintReady){
    banner.innerHTML = `<div class="banner risk"><span>&#9888;</span><div>
      <b>Database not yet on the Sprint 01 weeks.</b> Run <code>migrate_sprint01.sql</code> in Supabase → SQL Editor. Weekly saves are paused until then so numbers can't land in the wrong week; statuses still save.</div></div>`;
    saveBtn.disabled = true;
    saveBtn.dataset.blocked = '1';
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
  TABS.forEach(t=>{
    document.getElementById('tab-'+t).addEventListener('click', ()=> showTab(t));
  });

  histFilter.addEventListener('change', ()=>{
    saveUIState({ filter: histFilter.value });
    reloadHistory();
  });
  const refreshBtn = document.getElementById('refreshBtn');
  if (refreshBtn) refreshBtn.addEventListener('click', async ()=>{
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
    const prevCached = trackerCache[key];
    const vals = { status: sel.value, note: noteEl.value.trim() };
    trackerCache[key] = Object.assign({}, prevCached, vals,
      { updatedBy: editorSel.value, updatedAt: new Date().toISOString() });
    pendingTrackers.set(key, trackerCache[key]);
    try{
      const { changes } = await Store.saveTracker(
        key, label, vals, editorSel.value
      );
      pendingTrackers.delete(key);
      const chip = row.querySelector('.statuschip');
      if (chip){
        const sn = setForRow(key, group);
        chip.className = 'statuschip ' + (inSet(sn, sel.value) ? statusClass(sn, sel.value) : foreignClass(key, group, sel.value));
      }
      if (changes.length){
        trackerCache[key] = Object.assign({}, vals,
          { updatedBy: editorSel.value, updatedAt: new Date().toISOString() });
      } else {
        trackerCache[key] = prevCached;   // nothing changed: keep the real last-updated
      }
      // Gate checks read tracker values (e.g. Alcoa's truck count).
      if (seriesCache){ renderGates(seriesCache); renderAdLive(seriesCache); }
      // The tables were rebuilt while this saved: redraw from the fresh cache.
      if (!row.isConnected){ renderTrackedTables(trackerCache); return; }
      // A week marked Variance needs a why.
      if (group === 'wk'){
        const needWhy = sel.value === 'variance' && !noteEl.value.trim();
        noteEl.classList.toggle('needwhy', needWhy);
        noteEl.placeholder = sel.value === 'variance' ? 'Why? Volume, conversion or deal timing — and the fix' : 'Add a note';
        if (needWhy && el === sel) noteEl.focus();
      }
      if (changes.length){
        const meta = row.querySelector('.statusmeta');
        if (meta) meta.innerHTML = lastUpdatedText(editorSel.value, new Date().toISOString());
        flash.textContent = 'saved';
        flash.className = 'flash show';
        setTimeout(()=>{ flash.className = 'flash'; }, 1600);
        await reloadHistory();
      }
    }catch(e){
      trackerCache[key] = prevCached;
      pendingTrackers.delete(key);
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
    if (ev.key === 'Enter' && !ev.shiftKey && ev.target.classList && ev.target.classList.contains('statusnote')){
      ev.preventDefault();   // Enter saves; Shift+Enter adds a line in the why box
      ev.target.blur();
    }
  });

  noteInput.addEventListener('input', ()=> saveUIState({ note: noteInput.value }));

  /* ---- history period + archive controls ---- */
  const histPeriod = document.getElementById('histPeriod');
  const histFrom = document.getElementById('histFrom');
  const histTo = document.getElementById('histTo');

  function syncCustomRange(){
    const custom = histPeriod.value === 'custom';
    document.getElementById('customRange').hidden = !custom;
    document.getElementById('customRangeTo').hidden = !custom;
  }

  async function reloadHistory(){
    let rows = [], counts = { live:0, archived:0 };
    try{
      rows = await Store.loadHistory(currentHistFilter());
      counts = await Store.historyCounts();
    }catch(e){ console.error('Could not load history:', e); }
    renderHistory(rows);
    document.getElementById('histCount').textContent =
      viewingArchive
        ? counts.archived + ' archived'
        : counts.live + ' entr' + (counts.live===1?'y':'ies') +
          (counts.archived ? ' · ' + counts.archived + ' archived' : '');
    document.getElementById('archiveNotice').innerHTML = viewingArchive
      ? `<div class="banner watch"><span class="ico">📦</span><div><b>Viewing the archive.</b>
         These entries are hidden from the normal view but nothing has been deleted.
         <button class="btn tiny ghost" id="unarchiveBtn" style="margin-left:8px;">Restore all</button>
         <button class="btn tiny ghost" id="purgeBtn" style="margin-left:6px;">Delete permanently</button></div></div>`
      : '';
  }

  historyReloader = reloadHistory;

  /* Change history can be collapsed; the choice is remembered per browser. */
  const histToggle = document.getElementById('histToggle');
  const histBody = document.getElementById('histBody');
  function setHistCollapsed(collapsed){
    histBody.hidden = collapsed;
    histToggle.setAttribute('aria-expanded', String(!collapsed));
    histToggle.textContent = collapsed ? 'Expand' : 'Collapse';
    saveUIState({ histCollapsed: collapsed });
  }
  histToggle.addEventListener('click', ()=> setHistCollapsed(!histBody.hidden));
  setHistCollapsed(!!readUIState().histCollapsed);

  histPeriod.addEventListener('change', ()=>{
    syncCustomRange();
    saveUIState({ period: histPeriod.value });
    reloadHistory();
  });
  histFrom.addEventListener('change', ()=>{ saveUIState({ from: histFrom.value }); reloadHistory(); });
  histTo.addEventListener('change',   ()=>{ saveUIState({ to: histTo.value });   reloadHistory(); });

  document.getElementById('viewArchiveBtn').addEventListener('click', async (ev)=>{
    viewingArchive = !viewingArchive;
    ev.target.textContent = viewingArchive ? 'Back to live' : 'View archive';
    await reloadHistory();
  });

  /* Archiving is offered per period, and always exports first — the log is
     the audit trail, so nothing leaves the view without a copy on disk. */
  document.getElementById('archiveBtn').addEventListener('click', async ()=>{
    const choice = prompt(
      'Archive entries older than:\n\n' +
      '  1  — one week ago\n' +
      '  2  — one month ago\n' +
      '  3  — one quarter ago\n' +
      '  4  — one year ago\n\n' +
      'Type 1, 2, 3 or 4. Archived entries are hidden, not deleted — you can restore them.',
      '2'
    );
    if (!choice) return;
    const now = new Date();
    const cutoff = new Date(now);
    if (choice.trim() === '1')      cutoff.setDate(now.getDate() - 7);
    else if (choice.trim() === '2') cutoff.setMonth(now.getMonth() - 1);
    else if (choice.trim() === '3') cutoff.setMonth(now.getMonth() - 3);
    else if (choice.trim() === '4') cutoff.setFullYear(now.getFullYear() - 1);
    else { toast('Not archived', 'Please type 1, 2, 3 or 4.', 'err'); return; }

    try{
      const blob = new Blob([JSON.stringify(await Store.exportAll(), null, 2)], {type:'application/json'});
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'fuelshine-backup-before-archive-' + new Date().toISOString().slice(0,10) + '.json';
      a.click(); URL.revokeObjectURL(a.href);

      const n = await Store.archiveOlderThan(cutoff.toISOString());
      await reloadHistory();
      toast(n ? n + ' entr' + (n===1?'y':'ies') + ' archived' : 'Nothing to archive',
        n ? 'A full backup downloaded first. Use "View archive" to see or restore them.'
          : 'No entries are older than that cutoff.', n ? 'ok' : undefined);
    }catch(e){
      toast('Archive failed', e.message, 'err');
    }
  });

  /* Restore / permanent delete live inside the archive banner. */
  document.getElementById('archiveNotice').addEventListener('click', async (ev)=>{
    if (ev.target.id === 'unarchiveBtn'){
      await Store.unarchiveAll();
      await reloadHistory();
      toast('Restored', 'Archived entries are back in the main view.', 'ok');
    }
    if (ev.target.id === 'purgeBtn'){
      const counts = await Store.historyCounts();
      if (!counts.archived){ toast('Nothing to delete', 'The archive is empty.'); return; }
      const typed = prompt(
        'This permanently deletes ' + counts.archived + ' archived entr' +
        (counts.archived===1?'y':'ies') + '.\n\n' +
        'This cannot be undone and breaks the audit trail for that period.\n\n' +
        'Type DELETE to confirm.');
      if (typed !== 'DELETE'){ toast('Canceled', 'Nothing was deleted.'); return; }
      try{
        const n = await Store.purgeArchived();
        await reloadHistory();
        toast(n + ' entries deleted', 'Permanently removed from the archive.', 'ok');
      }catch(e){
        toast('Delete failed', e.message, 'err');
      }
    }
  });

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
    if (saveBtn.disabled || saveBtn.dataset.blocked) return;
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

  /* One time per browser: the saved "last week viewed" and unsaved drafts
     used the old calendar (week 1 = Sep 14). Move them onto Sprint 01
     weeks (week 1 = Sep 28) so nothing lands in the wrong week. */
  try{
    if (localStorage.getItem('fuelshine.calendar.ui') !== 'sprint01'){
      const u = readUIState();
      if (u.week) saveUIState({ week: Math.max(1, Number(u.week) - 2) });
      const drafts = lsGet(DRAFT_KEY, {}), moved = {};
      Object.keys(drafts).forEach(k=>{ const n = Number(k) - 2; if (n >= 1) moved[n] = drafts[k]; });
      lsSet(DRAFT_KEY, moved);
      localStorage.setItem('fuelshine.calendar.ui', 'sprint01');
    }
  }catch(e){ /* storage blocked */ }

  /* Put the person back where they were: same week, tab, filter and
     half-typed note as when they last had this page open. */
  const ui = readUIState();
  if (ui.week && WEEKS.some(w=>w.n===Number(ui.week))) weekSel.value = String(ui.week);
  if (ui.filter != null) histFilter.value = ui.filter;
  if (ui.period) histPeriod.value = ui.period;
  if (ui.from) histFrom.value = ui.from;
  if (ui.to) histTo.value = ui.to;
  syncCustomRange();
  if (ui.note) noteInput.value = ui.note;
  showTab(TABS.includes(ui.tab) ? ui.tab : 'gf');

  currentWeekShown = Number(weekSel.value);
  await loadWeekIntoForm(currentWeekShown);
  await refreshEverything();

  /* The Monday check reports the week that just ended. On Monday/Tuesday,
     if last week isn't saved yet, open it instead of the new week. */
  const ti = todayInfo();
  const prev = ti.currentWeek - 1;
  if (prev >= 1 && seriesCache && !seriesCache[prev-1].logged &&
      daysBetween(WEEKS[ti.currentWeek-1].monday, ti.today) <= 1 &&
      currentWeekShown === ti.currentWeek && !dirtyCount()){
    weekSel.value = String(prev);
    currentWeekShown = prev;
    await loadWeekIntoForm(prev);
    toast('Week ' + prev + ' opened', 'It ended yesterday and isn’t saved yet — this is the week the Monday check reports.');
  }
}

init().catch(e=>{
  console.error(e);
  document.getElementById('connBanner').innerHTML =
    `<div class="banner risk"><span class="ico">&#9888;</span><div><b>The dashboard failed to start:</b> ${esc(e.message)}</div></div>`;
});
