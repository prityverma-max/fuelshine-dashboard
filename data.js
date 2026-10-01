/* ------------------------------------------------------------------
   data.js — all static plan content.
   Edit this file to change plan copy; no other file needs touching.
   ------------------------------------------------------------------ */

/* Sprint 01 timeline — "Fuelshine Sprint 01 — Weekly Plan": 17 weeks,
   Monday Sep 28 2026 → Sunday Jan 24 2027, $8,000 MRR by week 17
   (stretch $10,000). Week n starts on the Monday listed. */
export const START = new Date('2026-09-28T00:00:00Z');
export const SPRINT_DAYS = 119;   // Sep 28 2026 → Jan 24 2027, inclusive
export const WEEKS = Array.from({length:17}, (_, i) => {
  const d = new Date(Date.UTC(2026, 8, 28 + i*7));
  return { n:i+1, monday:d.toISOString().slice(0,10) };
});

export const FLOOR = 8000, STRETCH = 10000;

/* ------------------------------------------------------------------
   Sprint 01 reference benchmark — week-by-week targets (end-of-week MRR
   by line) and milestones, copied from "Fuelshine Sprint 01 — Weekly
   Plan" (reference copy prepared Sep 26 2026). Plan week n = dashboard
   week n (both start Mon Sep 28 2026); weeks are matched by date.
   Edit here if the plan is re-issued.
   ------------------------------------------------------------------ */
export const PLAN_SOURCE = 'Sprint 01 Weekly Plan · reference copy Sep 26, 2026';
export const PLAN_WEEKS = [
  {pw:1,  monday:'2026-09-28', gfFleets:0,    gfDrivers:20,  fv:150,  total:170,
   rev:'Tracking set up; Alcoa ask made; referral reward live',
   raise:'Decide SAFE terms; confirm CAD $285K instrument/cap; fix dashboard',
   actions:[['Make the Alcoa full-fleet expansion ask','Founder'],
            ['Install PostHog on getfuelshine.com + app events and switch on the referral reward','Tech'],
            ['Lock SAFE terms ($12M post-money, range $10–14M) and fix the investor dashboard numbers','Founder']],
   also:'Prity starts the Apollo list (association members + 5 named industries only) so the first wave can go out in week 3.',
   note:'Week 1 fuel verification assumes Alcoa’s 10 trucks at $15 ($150) — replace with the real paid amount once confirmed.'},
  {pw:2,  monday:'2026-10-05', gfFleets:0,    gfDrivers:40,  fv:150,  total:190,
   rev:'First 3 partner meetings booked (CPA/HRPA)',
   raise:'Data room v1 (deck, unit economics, Alcoa proof); map Tier 1 warm-intro paths'},
  {pw:3,  monday:'2026-10-12', gfFleets:0,    gfDrivers:60,  fv:150,  total:210,
   rev:'Apollo list built, first wave out',
   raise:'Build investor update list (20–30: CIAI / CI Ventures angels, Tier 1–2, scouts)'},
  {pw:4,  monday:'2026-10-19', gfFleets:225,  gfDrivers:100, fv:150,  total:475,
   rev:'First new grey-fleet fleet paid',
   raise:'Investor update #1; ask existing angels about a runway top-up'},
  {pw:5,  monday:'2026-10-26', gfFleets:225,  gfDrivers:140, fv:600,  total:965,
   rev:'Alcoa step 1 (~40 trucks)',
   raise:'3–5 relationship conversations/week — no ask'},
  {pw:6,  monday:'2026-11-02', gfFleets:450,  gfDrivers:180, fv:900,  total:1530,
   rev:'Gated audit test decision',
   raise:'3–5 relationship conversations/week — no ask'},
  {pw:7,  monday:'2026-11-09', gfFleets:450,  gfDrivers:230, fv:1200, total:1880,
   rev:'At least 1 partner has sent a lead',
   raise:'3–5 relationship conversations/week — no ask'},
  {pw:8,  monday:'2026-11-16', gfFleets:675,  gfDrivers:280, fv:1500, total:2455,
   rev:'CHECKPOINT · Alcoa at 100 trucks',
   raise:'Investor update #2; set formal pitch start date', checkpoint:true,
   rule:'Week 8 checkpoint: total MRR ≥ $2,000 → stay the course. Below $2,000 → move Prity from Apollo to partner follow-up and partner-sourced leads (not more cold email), and reset expectations: $8K by week 17 is now unlikely.'},
  {pw:9,  monday:'2026-11-23', gfFleets:900,  gfDrivers:330, fv:1800, total:3030,
   rev:'2–3 partners actively referring',
   raise:'3–5 conversations/week; book 2+ portfolio-synergy intros'},
  {pw:10, monday:'2026-11-30', gfFleets:1125, gfDrivers:380, fv:2100, total:3605,
   rev:'', raise:'3–5 conversations/week; identify 1–2 possible leads'},
  {pw:11, monday:'2026-12-07', gfFleets:1350, gfDrivers:430, fv:2400, total:4180,
   rev:'', raise:'3–5 conversations/week'},
  {pw:12, monday:'2026-12-14', gfFleets:1575, gfDrivers:480, fv:2700, total:4755,
   rev:'Close all you can before holidays', raise:'Investor update #3'},
  {pw:13, monday:'2026-12-21', gfFleets:1800, gfDrivers:540, fv:3000, total:5340,
   rev:'PITCH GATE', raise:'PITCH GATE check', checkpoint:true,
   rule:'Pitch gate: start formal pitching only if total MRR ≥ $5,000 AND MRR grew in 3 of the last 4 weeks AND 20+ paying fleets with no customer over ~25% of MRR (Alcoa included). If not met: keep building relationships, send update #4, re-test weekly.'},
  {pw:14, monday:'2026-12-28', gfFleets:2025, gfDrivers:600, fv:3300, total:5925,
   rev:'Holiday week — expect slippage', raise:'Holidays — finalize deck with real sprint numbers'},
  {pw:15, monday:'2027-01-04', gfFleets:2250, gfDrivers:660, fv:3750, total:6660,
   rev:'', raise:'Formal pitching: 6–8 meetings/week, Tier 2 first'},
  {pw:16, monday:'2027-01-11', gfFleets:2475, gfDrivers:730, fv:4150, total:7355,
   rev:'', raise:'Formal pitching; Tier 1 from this week'},
  {pw:17, monday:'2027-01-18', gfFleets:2700, gfDrivers:800, fv:4500, total:8000,
   rev:'Sprint close; investor traction package', raise:'Goal: first commitment or lead investor'}
];

/* Week-17 MRR by line, what it is made of, and the plan's own expectation. */
export const PLAN_LINES = [
  ['Fuel verification (company-owned)','$4,500','Alcoa grows 10 → 100 trucks by week 8 ($1,500) + ~10 new fleets of ~20 vehicles ($300/mo each)'],
  ['Grey fleet — fleets','$2,700','~12 fleets of ~15 employees ($225/mo each)'],
  ['Grey fleet — drivers','$800','~80 paying drivers at $9.99/mo'],
  ['Total','$8,000','~22 new fleets + Alcoa expansion + ~80 drivers']
];
export const PLAN_PRICE = 'Price: $15 per vehicle or employee per month for fleets; $9.99/month per driver. Net new MRR needed ≈ $470/week on average, back-loaded because deals take 30–60 days to close.';
export const PLAN_EXPECTATION = 'Honest expectation at sprint start: ranks 1–4 likely land $5K–7K MRR by week 17. Reaching $8K+ needs 2–3 partners actively sending fleets by about week 9.';

/* Runway — months left = cash ÷ monthly spend. Red if cash runs out before
   expected close + 3 months (base-case close weeks 26–30, Mar–Apr 2027). */
export const CLOSE_WEEKS = 'weeks 26–30 (Mar–Apr 2027)';
export const RUNWAY_NEEDED_UNTIL = '2027-07-25';   // end of week 30 (Apr 25 2027) + 3 months
export const RUNWAY_FIXES = 'angel top-up, OVIN / IRAP, full-price Alcoa expansion';

/* Paid ad rules — the plan's table, verbatim. */
export const AD_RULES = {
  gate: 'No ad spend of any kind until tracking is live (PostHog on the website with audit/lead/demo events and UTM capture; app events for share, invite, subscription start/cancel). Neither ad test replaces partnerships.',
  rows: [
    ['Start',        '$1,000–1,500/month', '$0 — referral reward first (free month per colleague or manager intro)'],
    ['Add money',    '—',                  'Only after 30 days of referral data; then $500–1,000/month'],
    ['Check at',     'Day 45',             'Day 30'],
    ['Stop if',      'Cost per good-fit lead > $250', 'Cost per active work-email user > $40, or no manager intros'],
    ['Increase if',  'Cost per good-fit lead < $150', '3+ colleagues at one company within 60 days'],
    ['Base case (120-day sim, $6K spend)', '~$900 MRR', '~$800 MRR']
  ]
};

/* Investor-facing consistency — the plan's line, verbatim. */
export const INVESTOR_CONSISTENCY = '3 reps (never 4) · 10 Alcoa vehicles until more are confirmed · $850 CAC is a target, not an actual · insurance is out of this raise · always show sprint actuals separately from projections.';

/* Every Monday — the plan's 7-step check, verbatim. */
export const MONDAY_CHECK = [
  'Get actuals: MRR by line, new vs lost MRR, new fleets + source, hours/$ per channel, partner conversations, raise activity, cash and monthly spend. Never fill a missing number with the target — mark it “not reported”.',
  'Compare each line and the total to this week’s row; assign On pace / Watch / Behind.',
  'Apply the decision rules: checkpoint, cost limits, ad rules, churn.',
  'Check this week’s raise milestone and runway.',
  'Pull PostHog flywheel signals: signups, active trip users, companies with 3+ users on the same work-email domain (warm B2B lead), heavy work-email users (≥5 active days, ≥10 trips) to call.',
  'Write the short weekly review, leading with overall status and the one thing that matters most.',
  'End with the top 3 actions for the coming week, each with an owner.'
];

/* MRR already running before the first week logged on this dashboard.
   The plan's week-1 fuel-verification target ($150) is Alcoa's existing
   10 trucks at $15. Either enter that MRR as week 1 "new MRR", or set
   fv:150 here (or the real paid amount) — not both — so actuals are
   compared like-for-like. Left at 0 until confirmed. */
export const OPENING_MRR = { gfFleets:0, gfDrivers:0, fv:0 };

/** The plan week whose Monday matches a dashboard week's Monday. */
export function planFor(monday){
  return PLAN_WEEKS.find(p => p.monday === monday) || null;
}
/** Plan status per the doc: On pace ≥100% of target · Watch 75–99% ·
    Behind under 75%. (Watch two weeks running → Behind is applied by
    the caller, which knows the previous week.) */
export function planStatus(actual, target){
  if (!target) return actual >= 0 ? 'ok' : 'risk';
  const r = actual / target;
  return r >= 1 ? 'ok' : r >= 0.75 ? 'watch' : 'risk';
}

export const CAC_FLEET_CEIL = 850, CAC_SUB_CEIL = 20;
/* Raise — Sprint 01 plan: $1.6M USD pre-seed SAFE, $12M post-money cap
   (range $10–14M), formal pitching only after the week-13 pitch gate. */
export const FR_FLOOR = 1600000;
export const SAFE_CAP = '$12M post-money (range $10–14M)';

/* Three phases on the Sprint 01 timeline, split at the plan's own gates:
   the week-8 checkpoint (Nov 16) and the week-13 pitch gate (Dec 21).
   start/end drive the "NOW" badge. */
export const PHASES = [
  {tag:'Phase 1 &middot; Foundation &amp; first revenue', start:'2026-09-28', end:'2026-11-22',
   dates:'Sep 28 &ndash; Nov 22, 2026 &middot; Weeks 1&ndash;8 &middot; ends at the week-8 checkpoint',
    gf:['Week 1 (Tech): install PostHog on getfuelshine.com + app events, and switch on the driver referral reward (free month per colleague or manager intro)',
        'No canonically-confirmed named grey-fleet-only pilot exists in deck materials today &mdash; confirm the current trial roster this week rather than assuming one',
        'Prity starts the Apollo list in week 1 (association members + the 5 named industries only); first outbound wave in week 3 (Oct 12)',
        'Ship the &ldquo;3+ Johns at one employer&rdquo; flag, even as a manual weekly check'],
    fv:['Founder makes the Alcoa full-fleet expansion ask in week 1 (10 &rarr; ~40 trucks by week 5, 100 by week 8; escalate directly if not at 100 by week 8)',
        'Partner conversations follow the plan&rsquo;s order &mdash; CPAs + HRPA first, then HRAI / TRREB, then one insurance broker and one fuel-card or leasing company',
        'Identify the warmest HVAC/trades prospect for the reserved testimonial slot',
        'Fold the fleet-card discovery question into every call to feed the Phase 2 card-API decision'],
    fr:['Week 1: decide SAFE terms ($12M post-money, range $10&ndash;14M) and confirm the CAD $285K instrument/cap; week 2: data room v1; week 3: investor update list (20&ndash;30); week 4: investor update #1',
        'Build/refresh the investor ICP and target list &mdash; work from the 70-firm CSV, do not re-research',
        'Week 8 checkpoint (Nov 16): total MRR &ge; $2,000 &rarr; stay the course; below &rarr; move Prity to partner follow-up. Investor update #2 and set the formal pitch start date']},
  {tag:'Phase 2 &middot; Partner-led growth &rarr; pitch gate', start:'2026-11-23', end:'2026-12-27',
   dates:'Nov 23 &ndash; Dec 27, 2026 &middot; Weeks 9&ndash;13 &middot; ends at the week-13 pitch gate',
    gf:['Push every Phase-1 lead through the funnel; weekly check against the plan&rsquo;s week-by-week targets',
        'Driver ads: no ad money until 30 days of referral data; then the day-30 check decides (stop if cost per active work-email user &gt; $40 or no manager intros)'],
    fv:['2&ndash;3 partners actively referring by week 9; outreach live across fuel-verification vertical ranks 1&ndash;4; fraud preempt in every demo',
        'Convert trials to paid with the Week-1 flag-clearing check-in tracked on every account',
        'Hard gate: one real HVAC/trades quote for the reserved testimonial slot before this phase closes'],
    fr:['Warm outreach live across the 5 paths; forwardable intro template in the hands of every connector',
        'Relationship conversations only (3&ndash;5/week, no ask) &mdash; no formal pitching before the gate',
        'Pitch gate (week 13, Dec 21): start formal pitching only if total MRR &ge; $5,000 AND MRR grew in 3 of the last 4 weeks AND 20+ paying fleets with no customer over ~25% of MRR']},
  {tag:'Phase 3 &middot; Formal pitching &amp; close', start:'2026-12-28', end:'2027-01-24',
   dates:'Dec 28, 2026 &ndash; Jan 24, 2027 &middot; Weeks 14&ndash;17 &middot; sprint close',
    gf:['Push remaining qualified grey-fleet pipeline to close &mdash; founder/team time on live deals, not new prospecting'],
    fv:['Recompute the vertical ranking for next sprint based on actual conversion, not fit score alone'],
    fr:['Formal pitching from week 15 (6&ndash;8 meetings/week, Tier 2 first; Tier 1 from week 16); goal by week 17: first commitment or lead investor &mdash; close window Jan 25 &rarr; Apr 2027',
        'Compile the traction package: MRR by product line, logo names, churn observed, CAC actually collected',
        'Flag explicitly which numbers are actuals from this sprint vs. projections in any investor material']}
];

/* Channel priority — most proven first (Sprint 01 plan). Keys are new
   ('plan:1'…'plan:6'); the previous 11-row channel stack (chan:*) is
   retired, its saved statuses stay in the change history. */
export const CHANNELS = [
  ['Alcoa full-fleet expansion','Founder','&mdash;','Single biggest step in the plan: 10 &rarr; ~40 trucks by week 5, 100 by week 8. Escalate directly if not at 100 by week 8.'],
  ['Partnerships','Founder','Time','CPAs + HRPA first, then HRAI / TRREB, then one insurance broker and one fuel-card or leasing company. At least one partner conversation every week &mdash; flag if 7+ days pass.<div class="subnote">Shortlists already researched &mdash; insurance broker: Zensurance, Mitch / Morison, Acera, BrokerLink · fuel-card: Corpay, Comdata / Fuelman, WEX · leasing: Foss National, Merchants Fleet, Enterprise, Element. The plan needs one broker and one fuel-card or leasing company this sprint.</div>'],
  ['Warm intros','Founder','Time','Mentor / accelerator / investor network, plus active drivers with an employer email (first example: a Burton Industries driver, Sept 2026).'],
  ['Targeted Apollo outreach','Prity','Time','Only association members and the 5 named industries &mdash; no generic spray. Run buyer-facing copy through the Sarah check before sending. List starts week 1; first wave out week 3.'],
  ['Gated audit inbound','&mdash;','$1,000&ndash;1,500/mo once tracking is live','Test only. Paid ad rules apply (below): check at day 45 &mdash; stop if cost per good-fit lead &gt; $250, increase if &lt; $150.'],
  ['Driver ads (B2C &rarr; B2B)','&mdash;','$0 now (referral reward); $500&ndash;1,000/mo after 30 days of referral data','Test only. Referral reward first; no ad money until 30 days of referral data. Check at day 30 &mdash; stop if cost per active work-email user &gt; $40 or no manager intros; increase if 3+ colleagues at one company within 60 days.']
];

export const ASSOC_PRIORITY = [
  [1,'CPA Ontario 2026 conference series','Multiple ON dates','Trusted advisor (accounting) &mdash; Finance is part of the broadened Sarah buyer title','None yet','Co-branded client briefing; PD-conference session','Directory flags this &ldquo;strong &mdash; start here.&rdquo;',5],
  [2,'HRPA Summit','Oct 19, Toronto/Ottawa','Trusted advisor (HR) &mdash; reaches Sarah&rsquo;s own peer community directly','None yet','Session/content sponsorship','Dual-city event.',3],
  [3,'HRAI AGM &mdash; &ldquo;The Unconventional Advantage&rdquo;','Sep 19&ndash;23, Gatineau QC','HVAC/Field Service &mdash; the #1 anchor vertical for fuel-verification and #3 for grey fleet','None yet','Member-benefit listing; sponsor/demo slot','The AGM ran Sep 19&ndash;23, before Sprint 01 &mdash; go to HRAI directly for the member-benefit listing. Plan order: after CPAs + HRPA.',1],
  [4,'TRREB (Toronto Regional Real Estate Board)','REALTOR QUEST &mdash; date TBD','Real Estate &mdash; grey-fleet vertical #2','Urbanest Properties testimonial','Member-benefit listing or newsletter mention','Plan order: HRAI / TRREB after CPAs + HRPA. Don&rsquo;t wait on the event &mdash; pursue the listing now, proof-in-hand.',6],
  [5,'IBAOcon','Oct 21&ndash;22, Sheraton Centre Toronto','Trusted advisor + the clearest event-based path into the broker-upsell motion above','None yet','Sponsor/exhibit','120+ exhibitors, 3,000+ attendees &mdash; distinct from the Zensurance/Mitch/Morison commercial-broker row above; this is the association (access, not revenue).',2],
  [6,'MCAO S.M.A.R.T. Innovation','Nov 12, Hockey Hall of Fame, Toronto','Mechanical contractors, dual-flywheel &mdash; reinforces the HVAC/Field-Service overlap this sprint is already leaning on','None yet','Demo slot/sponsor table','',4]
];

export const ASSOC_WATCHLIST = [
  ['Rx&amp;D/IMC (Pharma)','Carries an existing testimonial &mdash; Axis Diagnostics &mdash; but no confirmed date inside this sprint (2026 TBD). Don&rsquo;t wait on the event: pursue the member-benefit listing or newsletter mention now, proof-in-hand. (TRREB is now in the active sequence above.)'],
  ['CFLA Annual National Conference (fit 8, Guillermo Obregon testimonial)','Was Sep 14 &mdash; already passed as of this update. Approach the fleet leasing committee directly for a member-benefit bundle rather than waiting for next year&rsquo;s conference.'],
  ['NAFA 2026 Institute &amp; Expo (fit 9)','Was April &mdash; already passed for this year. Approach nationally via the Affiliate Partner program at nafa.org &mdash; NAFA restructured away from regional chapters in 2022, there is no &ldquo;NAFA Canada Chapter&rdquo; to join.'],
  ['&ldquo;FMAC&rdquo; (Fleet Management Association of Canada)','Could not be verified as a real organization in the source directory &mdash; do not book outreach against it. AFLA Canada Summit (afla.org) is the confirmed real substitute until FMAC is independently verified.']
];

export const VERTICALS = [
  [1,'HVAC / Field Service','HRAI (10), MCAO (9)','Anchor &mdash; existing testimonial slot','Service-call routing, fuel per job, taxable-benefit tracking'],
  [2,'Last-mile delivery','LMDA (9)','Co-anchor &mdash; best driver-per-logo ratio','Delivery fleets under the ELD threshold &mdash; no hardware, no truck-fleet price tag'],
  [3,'Construction','CHBA (8)','Phase 1 push &mdash; strongest Smartcar signal (96.2% pickup fuel-level)','Pickup-heavy fleet, highest confirmed fuel-level signal coverage'],
  [4,'Mobile healthcare','OHCA (9)','Phase 1, scope-narrowed to fleet-owned only','Home health, mobile labs &mdash; PIPEDA-aligned data handling'],
  [5,'Utilities / Telecom','Ontario Electrical League (8), partial fit','Phase 2 test only &mdash; not resourced this sprint','Regulated industries where duty-of-care records must exist &mdash; validate before resourcing']
];

export const GF_VERTICALS = [
  [1,'Pharma &amp; Healthcare','Proof-in-hand &mdash; Axis Diagnostics testimonial (mileage disputes)','Reps drive personal vehicles between accounts daily; compliance-sensitive culture already'],
  [2,'Real Estate','Proof-in-hand &mdash; Urbanest Properties testimonial','Agents drive constantly, commission-based &mdash; finance trust in mileage numbers matters directly to payout'],
  [3,'Field Service / HVAC','No grey-fleet testimonial yet &mdash; but the same companies as the fuel-verification anchor vertical (see note below)','High trip volume, high grey-fleet liability exposure'],
  [4,'Delivery &amp; Logistics','No canonically-confirmed named pilot today &mdash; xpressBees/Derrapon were dropped from deck materials, confirm the current trial roster before citing a pilot here','High driver count per account &mdash; fewer logos needed to hit driver-count targets'],
  [5,'FMCG/CPG outside sales','Named vertical on the sales deck only &mdash; no testimonial yet','Distributed field force, mirrors the pharma grey-fleet profile']
];

export const LENSES = [
  ['B2B SaaS','MRR (net, not gross), logo count and names, churn, trial&rarr;paid rate, and CAC against the $850/fleet target &mdash; a target, not an actual. Report grey-fleet, fuel-verification, and B2C as separate sub-lines, not blended, and sprint actuals separately from projections.'],
  ['Not in this raise','Insurance is out of this raise (Sprint 01 plan). Don&rsquo;t pitch the broker-commission thesis or behaviour-pricing data to investors this round; an insurance broker is only one of the partnership asks.'],
  ['Transportation','Vertical penetration across the 5 fuel-verification segments plus the grey-fleet named verticals, driver/trip volume, Smartcar integration status, and the Alcoa fuel-fraud cross-check as a live proof point.']
];

export const RULES = [
  'Charge from day one wherever possible &mdash; reserve free pilots for accounts with outsized distribution value only.',
  'Do not chase 500+ vehicle enterprise accounts this window &mdash; a long cycle risks the whole sprint for one logo.',
  'When a deal stalls on price, reframe to her own ROI number first &mdash; discounting before that trains buyers to wait.',
  '3+ active John users at one employer &rarr; skip cold outbound, go straight to a warm conversation.',
  'Cost to win a customer: limit $850 per fleet and $20 per paying driver. Any channel above its limit two weeks in a row &rarr; cut or change it. Tag every deal with its source and hours spent.',
  'Line behind two weeks running &rarr; name the cause first &mdash; volume, conversion, or deal timing. More volume rarely fixes a conversion problem.',
  'Churn: flag the same week it appears. Net MRR is what counts.',
  'Week 8 checkpoint (Nov 16): total MRR &ge; $2,000 &rarr; stay the course. Below $2,000 &rarr; move Prity from Apollo to partner follow-up and partner-sourced leads (not more cold email), and reset expectations: $8K by week 17 is now unlikely.',
  'Pitch gate (week 13, Dec 21): start formal pitching only if total MRR &ge; $5,000 AND MRR grew in 3 of the last 4 weeks AND 20+ paying fleets with no customer over ~25% of MRR (Alcoa included). If not met: keep building relationships, send update #4, re-test weekly.',
  'Runway (weekly): months left = cash &divide; monthly spend. Flag red if cash runs out before expected close + 3 months (base-case close weeks 26&ndash;30, Mar&ndash;Apr 2027). Fixes: angel top-up, OVIN / IRAP, full-price Alcoa expansion.',
  'No ad spend of any kind until tracking is live. Neither ad test replaces partnerships.',
  'Never blend Confirmed and Estimated dollar figures into one point number in outward-facing copy &mdash; lead with the Confirmed floor, let fraud/leakage be the upside.',
  'Never apply grey-fleet mileage-correction language to a company-owned pitch, or fuel-savings language to a grey-fleet vehicle.',
  'Any warm-intro message or dollar figure sent to an investor must carry the current $1.6M USD ask ($12M post-money SAFE cap, range $10&ndash;14M) &mdash; a stale figure is what triggered the last full deck reconciliation pass.',
  'Data-partnership and association conversations are pipeline/credibility signals only &mdash; never count them toward the MRR number.',
  'Never present GPS/Smartcar tracking alone as &ldquo;the moat&rdquo; to an investor &mdash; it&rsquo;s commoditized; pair it with the compounding dataset, cross-team trust, or the flywheel. Never describe license/insurance verification or the named risk scores (Trip Trust, Safety, Trip Earning) in present tense &mdash; all roadmap, none built.',
  'Never pitch compliance-gating (auto-restricting claims to compliant vehicles/drivers) as differentiated IP &mdash; Prolius already ships it live. It&rsquo;s a real product gap worth closing, not a patentable one; lead any IP conversation with the Fuel Receipt Verification AI&rsquo;s triangulation logic instead.',
  'Never offer a referral fee or revenue-share to an association or trusted advisor (HRAI, TRREB, IBAO-as-association, HRPA, CPA Ontario/Canada, MCAO, CFA, FHCP, IMC, CFLA, NAFA) &mdash; the ask is access only. Commercial partners (fuel-card companies, insurance brokers/MGAs, leasing companies) are a different motion where referral/revenue-share is the right language &mdash; never blend the two.',
  'If a fuel-card, broker, or leasing partner asks for Fuelshine&rsquo;s own fleet/driver network instead of opening theirs, treat it as a pricing question, not a relationship gesture &mdash; trade it for reciprocal value (data access, a consented pilot, referral/revenue-share) or decline. Never hand over a bulk intro list for free to keep a conversation warm.'
];

export const TEAM = [
  ['V','Vikash','Product ownership, Retention &amp; Revenue, Investor workflow (sole owner)',null],
  ['P','Prity','Customer Growth &amp; Success, Retention &amp; Revenue; runs the Apollo list and targeted outreach (plan rank 4)','No dedicated SDR &mdash; also covers qualify, demo, and close solo'],
  ['D','Divjot','Customer Growth &amp; Success (community/flywheel)',null],
  ['Di','Dilli','PMF &amp; Product, full-stack engineering','Solo on Axle/SambaSafety integration and mileage-model calibration'],
  ['K','Khalid','PMF &amp; Product, Flutter app',null],
  ['N','Nancy','PMF &amp; Product, trainee product manager',null]
];

export const GAPS = [
  ['Dedicated SDR','Prity builds the Apollo list and runs targeted outreach (plan rank 4) while also covering qualify + demo + close solo &mdash; the main bandwidth bottleneck. At the week-8 checkpoint she may move to partner follow-up.'],
  ['Dedicated retention / CS specialist','Vikash and Prity split retention &amp; revenue on top of product and growth duties &mdash; directly tied to the 4.0% churn vs. 2.0% expansion gap.'],
  ['Second backend / data engineer','Dilli is solo on both partner integrations and mileage-model calibration &mdash; these compete for the same bandwidth.'],
  ['Fundraising ops / associate','Vikash owns the entire investor workflow solo &mdash; ICP, outreach, pitches, data room, and close.'],
  ['BD / partnerships hire','Rental discovery and flywheel employer conversion both stall without dedicated partnership bandwidth beyond the founder.'],
  ['In-house legal / general counsel','Both the sales-assist close and the fundraising close route through external counsel only.']
];

export const LEADLINES = [
  ['Grey fleet','&ldquo;The $500K&ndash;$7M question is not whether an accident happens &mdash; it is whether you have a defensible file when it does.&rdquo;'],
  ['Mixed fleet','&ldquo;One dashboard, one compliance layer, instead of two of everything.&rdquo;'],
  ['Company-owned (&lt;10,001 lb)','&ldquo;$11,700/yr in time savings alone, before fraud is even a factor.&rdquo;']
];

export const DISCOVERY = [
  'Walk me through how mileage/expense approval actually works today, start to finish.',
  'What is the hardest part of that for you personally?',
  'Why is that the hard part &mdash; what actually breaks down when it goes wrong?',
  'How often does this come up &mdash; every trip, weekly, per pay cycle?',
  'Why does getting this right matter for your company specifically?',
  'What are you using today &mdash; a spreadsheet, email approvals, a tool, or nothing formal?'
];

export const OBJECTIONS = [
  ['&ldquo;We don&rsquo;t really have a formal process.&rdquo;','This is the modal status quo for a 50&ndash;200 employee company, and the hardest sale here, not the easiest &mdash; anchor on the specific moment discovery surfaced, not a feature list.'],
  ['&ldquo;We already have GPS/dashcam hardware.&rdquo;','Hardware captures data; it does not classify trips, approve claims, or build an audit file. That gap is the product.'],
  ['&ldquo;Our fuel card already reconciles fuel spend.&rdquo;','The fuel card shows what was charged; it cannot verify the fuel went in the truck. That is the Smartcar cross-check.'],
  ['&ldquo;We already run Jobber/HCP/ServiceTitan.&rdquo;','Concede they handle jobs and invoicing well &mdash; none of them independently verify a purchase against the vehicle itself.']
];

/* The IP / moat table rows. */
export const MOAT_ROWS = [
  [1,'Trademark the &ldquo;Fuelshine&rdquo; wordmark + logo (CIPO in Canada first; US/Madrid extension once revenue supports it)','ok','file this sprint','Vikash + IP counsel','~$500&ndash;$2,500 CAD','Cheap, fast, no invention disclosure required &mdash; and the content/SEO push already underway puts the name in front of more people every week. Own the mark before distribution scales, not after.'],
  [2,'Confirm IP-assignment &amp; confidentiality agreements are signed by everyone with access to the mileage-behavior K-weight formula or the Fuel Receipt Verification AI&rsquo;s cross-check logic','ok','close this sprint','Vikash','$0&ndash;low (template review only)','These two are the only &ldquo;built, in use today&rdquo; proprietary IP Fuelshine has. A trade secret is only a trade secret if access is contractually locked down &mdash; free to fix now, expensive to discover missing during Series A diligence.'],
  [3,'Register copyright on the shipped codebase &mdash; the mileage-capture/classification app and the Fuel Receipt Verification AI engine specifically','ok','file this sprint','Vikash + IP counsel','$0 automatic; ~$65&ndash;95 USD/work to register (US), ~$50 CAD (Canada)','Copyright exists the moment code is written, but registration is cheap, needs no novelty test, and is the actual protection for the mileage-reimbursement and compliance-mapping software &mdash; the parts of the product that are process/compliance logic, not a patentable invention (see row 5).'],
  [4,'One scoping call with a patent/IP attorney &mdash; lead with Fuel Receipt Verification AI&rsquo;s triangulation logic (receipt + OEM telemetry + GPS sourced independently so no single party can spoof the check); ask about the mileage-behavior K-weight formula as a secondary candidate','watch','scope only &mdash; no filing yet','Vikash + IP counsel','~$1,500&ndash;$3,000 if filed','The fraud-detection triangulation is the more novel of the two &mdash; no named competitor independently cross-sources three data streams this way, vs. the K-weight formula which is a tunable weighting on public EPA/GPS data. A provisional buys 12 months&rsquo; priority without finished claims, but software patents are jurisdiction-dependent and not cheap to prosecute &mdash; this sprint&rsquo;s job is the decision, not the filing.'],
  [5,'Employee mileage reimbursement &mdash; GPS trip capture + one-tap classification + IRS/CRA compliance mapping','risk','not patentable &mdash; copyright/trade secret only','&mdash;','$0 (covered by row 3)','Crowded prior art (MileIQ, Everlance, TripLog, Motus, Cardata all do GPS trip capture) and meeting a public IRS/CRA rule isn&rsquo;t itself an invention. Don&rsquo;t spend patent-scoping time here &mdash; the code is already covered by row 3&rsquo;s copyright registration, and any unique internal logic is a trade-secret question, not a patent one.'],
  [6,'Company policy &amp; compliance gating &mdash; auto-restricting claims/reimbursement to vehicles or drivers that are policy-compliant','risk','blocked by prior art','&mdash;','$0','Prolius (UK grey-fleet-compliance competitor) already gates fuel claims to compliant vehicles, live, today &mdash; that&rsquo;s direct prior art, not a hypothetical risk. Building this closes a real product gap (Fuelshine doesn&rsquo;t have it yet), but it will not clear patent novelty once built. Don&rsquo;t scope IP spend here.'],
  [7,'Do not file on Trip Trust Score, Safety Score, Trip Earning Score, or any proprietary risk-scoring model','risk','defer &mdash; not built yet','&mdash;','$0','All three are roadmap, none built. Filing before an invention is finalized burns cash and starts the priority-date clock early &mdash; revisit once each actually ships.'],
  [8,'No IP scoping on payment-rail / card-issuing infrastructure (Marqeta or equivalent)','risk','excluded &mdash; not a Fuelshine product','&mdash;','$0','Explicitly out of scope per the 2026-09-15 roadmap decision &mdash; Car IQ Pay and Piston already occupy that space. Nothing to file, because nothing gets built here.']
];

/* Every logged field, in save order, with the label shown in the change log. */
export const FIELD_DEFS = [
  ['gfNewMRR','Grey fleet · New B2B MRR','money'],
  ['gfB2cMRR','Grey fleet · New B2C MRR','money'],
  ['gfChurn','Grey fleet · Churned MRR — fleets','money'],
  ['gfChurnB2c','Grey fleet · Churned MRR — drivers','money'],
  ['gfFleets','Grey fleet · New paying fleets','num'],
  ['gfSubs','Grey fleet · New paid B2C subs','num'],
  ['gfCacFleet','Grey fleet · CAC / fleet','money'],
  ['gfCacSub','Grey fleet · CAC / subscriber','money'],
  ['gfOutbound','Grey fleet · Outbound touches','num'],
  ['gfDemos','Grey fleet · Demos booked','num'],
  ['gfWarm','Grey fleet · Warm-intro convos','num'],
  ['gfPartner','Grey fleet · Strategic-partner convos','num'],
  ['gfJohn','Grey fleet · 3+ John accounts flagged','num'],
  ['gfTrialPaid','Grey fleet · Trial → paid rate','pct'],
  ['gfFocus','Grey fleet · Channel focus','text'],
  ['gfNotes','Grey fleet · Notes','text'],
  ['fvNewMRR','Fuel verification · New MRR','money'],
  ['fvChurn','Fuel verification · Churned MRR','money'],
  ['fvFleets','Fuel verification · New paying fleets','num'],
  ['fvCac','Fuel verification · CAC / fleet','money'],
  ['fvDiscovery','Fuel verification · Discovery calls','num'],
  ['fvDemos','Fuel verification · Demos booked','num'],
  ['fvTrialPaid','Fuel verification · Trial → paid rate','pct'],
  ['fvPartner','Fuel verification · Partner convos','num'],
  ['fvTestimonial','Fuel verification · Testimonial secured','bool'],
  ['fvFocus','Fuel verification · Vertical focus','text'],
  ['fvNotes','Fuel verification · Notes','text'],
  ['frTouches','Fundraising · Investor touches','num'],
  ['frTier1','Fundraising · Tier 1 touches','num'],
  ['frResponses','Fundraising · Responses','num'],
  ['frMeetBooked','Fundraising · Meetings booked','num'],
  ['frMeetHeld','Fundraising · Meetings held','num'],
  ['frDD','Fundraising · DD conversations','num'],
  ['frTermSheets','Fundraising · Term sheets','num'],
  ['frCloses','Fundraising · Investors closed','num'],
  ['frCommitted','Fundraising · Capital committed','money'],
  ['frClosedCash','Fundraising · Capital closed/wired','money'],
  ['frFocus','Fundraising · Warm-intro path','text'],
  ['frNotes','Fundraising · Notes','text'],
  ['opCash','Ops · Cash in bank','money'],
  ['opSpend','Ops · Monthly spend','money'],
  ['opPayingFleets','Ops · Total paying fleets','num'],
  ['opTopCustomer','Ops · Largest customer MRR','money'],
  ['opDeals','Ops · New deals — source & hours','text'],
  ['opSignups','Ops · Signups','num'],
  ['opActiveTrip','Ops · Active trip users','num'],
  ['opHeavyUsers','Ops · Heavy work-email users to call','num'],
  ['opAuditSpend','Ops · Gated audit spend','money'],
  ['opAuditLeads','Ops · Gated audit good-fit leads','num'],
  ['opDriverSpend','Ops · Driver ads spend','money'],
  ['opDriverUsers','Ops · New active work-email users','num'],
  ['opManagerIntros','Ops · Manager intros','num'],
  ['opOneThing','Ops · The one thing that matters most','text'],
  ['opAct1','Ops · Action 1','text'], ['opOwn1','Ops · Action 1 owner','text'],
  ['opAct2','Ops · Action 2','text'], ['opOwn2','Ops · Action 2 owner','text'],
  ['opAct3','Ops · Action 3','text'], ['opOwn3','Ops · Action 3 owner','text']
];

export const FORM_IDS = FIELD_DEFS.map(f => f[0]);
export const FIELD_LABELS = Object.fromEntries(FIELD_DEFS.map(f => [f[0], f[1]]));
export const FIELD_KINDS  = Object.fromEntries(FIELD_DEFS.map(f => [f[0], f[2]]));

export const TEXT_FIELDS = new Set(FIELD_DEFS.filter(f => f[2]==='text' || f[2]==='bool').map(f => f[0]));

/* ------------------------------------------------------------------
   Status trackers.

   Rows in the decision tables below carry a live status that changes as
   the sprint runs. Each row gets a stable key (e.g. "ip:1") so its status
   and its change history survive any reordering or rewording of the table
   text in this file. NEVER renumber an existing key — add new ones.

   Each status set: [value, label, pill class]. The pill class drives color:
   ok = green, watch = amber, risk = red, '' = neutral grey.
   ------------------------------------------------------------------ */

/* Status vocabularies.

   Standard US SaaS operating language — the words a Salesforce pipeline, a
   growth team's channel review, and a US legal-ops tracker actually use, in
   Title Case as status chips conventionally are. An American investor or
   partner reading an exported log should recognize every term without a
   glossary.

   Wording stays neutral: a partner who says no is "Passed" — the standard
   US business term — never anything that reads as a judgement on them.

   The stored value ids are deliberately unchanged from the previous
   version, so relabeling does not orphan anything already saved.

   [value, label, pill class]. Class drives color:
   ok = green, watch = amber, risk = red, '' = neutral gray. */

export const STATUS_SETS = {
  /* GTM Implementation stages, per Vikash (Sep 26, 2026). Used only on
     rows where the stages fit — see ROW_STATUS_OVERRIDES below.
     "Not set" is only what an untouched row shows; it claims no stage.
     Value ids are prefixed "stage-" so they can never collide with a
     legacy id such as "outreach" (Outreach Sent) already in the log. */
  gtm: [
    ['','Not set',                            ''],
    ['stage-icp','Stage 1: ICP definition',   'watch'],
    ['stage-messaging','Stage 2: Messaging',  'watch'],
    ['stage-outreach','Stage 3: Outreach',    'watch'],
    ['stage-analytics','Stage 4: Analytics',  'watch'],
    ['stage-outcome','Stage 5: Outcome',      'ok']
  ],
  /* Week review — Benchmark vs actual: did the week hit its plan target
     and milestones? A Variance needs a why (the plan's rule: name the
     cause first — volume, conversion, or deal timing). */
  weekreview: [
    ['','Not reviewed',   ''],
    ['achieved','Achieved', 'ok'],
    ['variance','Variance', 'risk']
  ],

  /* Plan channel 1 — Alcoa full-fleet expansion: 10 → ~40 (wk 5) → 100 (wk 8). */
  alcoa: [
    ['ten','10 trucks (current)',            ''],
    ['ask-made','Expansion ask made',        'watch'],
    ['forty','~40 trucks (step 1)',          'watch'],
    ['hundred','100 trucks',                 'ok'],
    ['escalate','Not at 100 by wk 8 — escalate','risk']
  ],
  /* Plan channel 5 — gated audit inbound test (paid ad rules). */
  auditTest: [
    ['not-started','Not started',               ''],
    ['waiting-tracking','Waiting on tracking',  ''],
    ['live','Live ($1,000–1,500/mo)',           'watch'],
    ['hold','Day 45: hold',                     'watch'],
    ['increase','Day 45: increase (< $150/lead)','ok'],
    ['stopped','Stopped (> $250/lead)',         'risk']
  ],
  /* Plan channel 6 — driver ads test: referral reward first. */
  driverTest: [
    ['not-started','Not started',                    ''],
    ['referral-live','Referral reward live ($0)',    'watch'],
    ['ads-live','Ads live ($500–1,000/mo)',          'watch'],
    ['increase','Day 30: increase',                  'ok'],
    ['stopped','Stopped (> $40/user or no intros)',  'risk']
  ],
  /* Paid-ad tracking gate: no ad spend until this is live. */
  tracking: [
    ['not-live','Not live',                     'risk'],
    ['site-live','Website events live',         'watch'],
    ['all-live','Website + app events live',    'ok']
  ],

  /* ---- Row-specific sets. Each one was written for what its row actually
     is, after reading the row. Where a meaning carries over (Not Started,
     Active, Paused…) the stored id is reused, so saved history stays
     readable. [value, label, pill class]. ---- */

  /* Channel 1 — Pilot health & expansion (Alcoa, Satguru): accounts that
     are already engaged or paying. Krish's list. */
  pilot: [
    ['not-started','Not Started',     ''],
    ['in-progress','In Progress',     'watch'],
    ['active','Active',               'ok'],
    ['feedback-loop','Feedback Loop', 'watch'],
    ['bought','Bought',               'ok'],
    ['dead','Dead',                   'risk']
  ],
  /* Channel 5 — Demo-led funnel (Inbound → SDR Qual → AE Demo) with a
     stated SLA (SDR ≤4h, demo ≤7 days): the question is whether it runs
     and whether it holds the SLA. */
  funnel: [
    ['not-started','Not Started',       ''],
    ['setting-up','Setting Up',         'watch'],
    ['live-on-sla','Live — On SLA',     'ok'],
    ['live-sla-missed','Live — SLA Missed','risk'],
    ['on-hold','Paused',                '']
  ],
  /* Channel 7 — John community / Driver Championship flywheel: B2C
     subscribers first, then warm employer leads into Sarah. */
  flywheel: [
    ['not-started','Not Started',             ''],
    ['launched','Launched',                   'watch'],
    ['subs-growing','Subscribers Growing',    'watch'],
    ['leads-flowing','Employer Leads Flowing','ok'],
    ['stalled','Stalled',                     'risk']
  ],
  /* Channel 8 — Content / SEO (audit guides, ROI calculators, case
     studies): a production pipeline that compounds. */
  content: [
    ['not-started','Not Started',       ''],
    ['planned','Planned',               ''],
    ['in-production','In Production',   'watch'],
    ['published','Published',           'watch'],
    ['driving-inbound','Driving Inbound','ok'],
    ['on-hold','Paused',                '']
  ],
  /* Channel 10 — Industry events & associations: a founder-led play
     capped at a weekly floor of one partner/association conversation. */
  cadence: [
    ['not-started','Not Started',         ''],
    ['on-track','On Track (1+/week)',     'ok'],
    ['below-floor','Below Weekly Floor',  'risk'],
    ['on-hold','Paused',                  '']
  ],
  /* Fuel-verification vertical 5 — Utilities / Telecom: "Phase 2 test
     only — validate before resourcing". */
  phase2: [
    ['not-resourced','Not Resourced',   ''],
    ['validating','Validating',         'watch'],
    ['ready','Ready for Phase 2',       'ok'],
    ['dropped','Dropped',               'risk']
  ],
  /* IP row 2 — confirm IP-assignment & confidentiality agreements are
     signed by everyone with access. A sign-off, not a filing. */
  signoff: [
    ['not-started','Not Started',           ''],
    ['collecting','Collecting Signatures',  'watch'],
    ['all-signed','All Signed',             'ok'],
    ['gap-found','Gap Found',               'risk']
  ],
  /* IP row 4 — one scoping call with a patent attorney: "this sprint's
     job is the decision, not the filing". */
  scoping: [
    ['not-started','Not Started',           ''],
    ['call-booked','Call Booked',           'watch'],
    ['call-done','Call Done — Deciding',    'watch'],
    ['decided-file','Decision: File Provisional','ok'],
    ['decided-no','Decision: Don’t File', '']
  ],

  /* IP & legal — US legal-ops workflow, for rows that are ACTIONS. */
  ip: [
    ['not-started','Not Started',   ''],
    ['counsel','Under Review',      'watch'],
    ['in-progress','In Progress',   'watch'],
    ['filed','Filed',               'watch'],
    ['registered','Registered',     'ok'],
    ['no-action','Closed',          '']
  ],
  /* Settled decisions — rows whose content is "do NOT do this, because X".
     Staging those through an action pipeline is nonsense: a row that reads
     "Do not file on Trip Trust Score" can never be "Filed". What actually
     needs tracking is whether the reasoning still holds. */
  decision: [
    ['settled','Decision Stands',   'ok'],
    ['revisit','Needs Revisit',     'watch'],
    ['reopened','Reopened',         'risk']
  ],
  /* `partner` below is no longer offered on any row (those three rows
     now use `gtm`), but stays so their earlier statuses and change-log
     entries still read in their original words. Do not delete. */
  /* Associations & events — access-ask BD pipeline, with a post-event state
     so a conference that has happened stops reading as still upcoming. */
  assoc: [
    ['not-started','Not Started',   ''],
    ['outreach','Outreach Sent',    'watch'],
    ['in-discussion','Engaged',     'watch'],
    ['confirmed','Committed',       'ok'],
    ['attended','Attended',         'ok'],
    ['followed-up','Follow-up Done','ok'],
    ['not-proceeding','Passed',     'risk'],
    ['deferred','On Hold',          '']
  ],
  /* Commercial partners — fuel-card issuers, brokers/MGAs, leasing companies.
     Deliberately NOT the same set as associations. The standing rule is that
     these are a different motion: the ask here is referral / revenue-share,
     so the terminal state is a signed agreement. Associations get access
     asks and end at Committed/Attended. Sharing one set would blur exactly
     the distinction the plan says never to blend. */
  partner: [
    ['not-started','Not Started',       ''],
    ['outreach','Outreach Sent',        'watch'],
    ['in-discussion','In Discussion',   'watch'],
    ['agreed','Agreement Signed',       'ok'],
    ['not-proceeding','Passed',         'risk'],
    ['deferred','On Hold',              '']
  ],
  /* Channels — growth-team lifecycle. "Active" rather than "Scaling":
     a channel can be running steadily without scaling, and the stronger
     word would overstate what the dashboard actually evidences. */
  channel: [
    ['not-started','Not Started',   ''],
    ['piloting','Testing',          'watch'],
    ['active','Active',             'ok'],
    ['on-hold','Paused',            'watch'],
    ['discontinued','Discontinued', 'risk']
  ],
  /* Verticals — standard CRM pipeline stages. */
  vertical: [
    ['not-started','Not Started',      ''],
    ['prospecting','Prospecting',      'watch'],
    ['in-pipeline','Active Pipeline',  'watch'],
    ['closed-won','Closed Won',        'ok'],
    ['on-hold','On Hold',              '']
  ]
};

/* Per-row status sets.

   Every tracked row was read and given the statuses that describe what it
   actually is. The table's set (TRACKER_GROUPS) covers rows not listed here.

   Channels
     1  Pilot health & expansion ...... pilot     (Not Started → Bought / Dead)
     2  Fuel-card partnerships ........ gtm       (5 GTM stages)
     3  Insurance-broker partnerships . gtm
     4  Fleet leasing & rental ........ gtm
     5  Demo-led funnel ............... funnel    (inbound, SLA-driven)
     6  Outbound SDR .................. gtm
     7  John community flywheel ....... flywheel
     8  Content / SEO ................. content
     9  LinkedIn ABM .................. gtm
     10 Industry events & associations  cadence   (weekly floor)
     11 Paid acquisition .............. decision  ("do not spend")
   Verticals
     Grey-fleet 1-5, fuel-verification 1-4 ... gtm
     Fuel-verification 5 Utilities/Telecom .... phase2 (not resourced)
   Associations & events 1-5 ................ assoc (event lifecycle)
   IP / moat
     1 Trademark, 3 Copyright ....... ip       (filing → registered)
     2 IP-assignment agreements ..... signoff
     4 Patent scoping call .......... scoping  (a decision, not a filing)
     5-8 Conclusions ................ decision

   The DEFAULTS below are only set where the plan text already states the
   state in words. Nothing here asserts a fact the plan does not. */
export const ROW_STATUS_OVERRIDES = {
  // Sprint 01 plan channel priority (rows plan:1..6).
  'plan:1':'alcoa', 'plan:2':'gtm', 'plan:3':'gtm', 'plan:4':'gtm',
  'plan:5':'auditTest', 'plan:6':'driverTest',
  // Retired 11-row channel stack — kept so its history still reads correctly.
  'chan:1':'pilot',
  'chan:2':'gtm', 'chan:3':'gtm', 'chan:4':'gtm',
  'chan:5':'funnel',
  'chan:6':'gtm',
  'chan:7':'flywheel',
  'chan:8':'content',
  'chan:9':'gtm',
  'chan:10':'cadence',
  'chan:11':'decision',
  'fvvert:5':'phase2',
  'ip:2':'signoff',
  'ip:4':'scoping',
  'ip:5':'decision', 'ip:6':'decision', 'ip:7':'decision', 'ip:8':'decision'
};

export const ROW_STATUS_DEFAULTS = {
  // "10 Alcoa vehicles until more are confirmed" — stated in the plan.
  'plan:1':'ten',
  'gate:tracking':'not-live',
  // "not patentable" / "blocked" / "defer" / "excluded" — stated in the rows.
  'ip:5':'settled', 'ip:6':'settled', 'ip:7':'settled', 'ip:8':'settled',
  // "Do not spend in this window" — stated.
  'chan:11':'settled',
  // "Already-paying or already-engaged accounts" — stated in the row.
  'chan:1':'active',
  // "Phase 2 test only — not resourced this sprint" — stated in the row.
  'fvvert:5':'not-resourced'
};

/* Which status set each tracked table uses, and the label shown in the change log. */
export const TRACKER_GROUPS = {
  ip:      { set:'ip',       label:'IP action' },
  assoc:   { set:'assoc',    label:'Association / event' },
  chan:    { set:'channel',  label:'Channel' },
  fvvert:  { set:'gtm',      label:'Fuel-verification vertical' },
  gfvert:  { set:'gtm',      label:'Grey-fleet vertical' },
  wk:      { set:'weekreview', label:'Week review' },
  plan:    { set:'gtm',      label:'Channel' },
  gate:    { set:'tracking', label:'Paid-ad tracking gate' }
};

/* What each row used in the previous live version (before per-row sets),
   so a status saved back then, and its history entries, still read in
   their original words instead of being silently remapped. */
const ORIGINAL_ROW_SETS = {
  'chan:2':'partner', 'chan:3':'partner', 'chan:4':'partner', 'chan:11':'decision',
  'ip:5':'decision', 'ip:6':'decision', 'ip:7':'decision', 'ip:8':'decision'
};
const ORIGINAL_GROUP_SETS = { ip:'ip', assoc:'assoc', chan:'channel', fvvert:'vertical', gfvert:'vertical' };
const ORIGINAL_DEFAULTS = {
  'ip:5':'settled', 'ip:6':'settled', 'ip:7':'settled', 'ip:8':'settled',
  'chan:11':'settled', 'chan:1':'active', 'fvvert:5':'on-hold'
};

/** The set a row used in the previous version, if different from today's. */
export function legacySetForRow(key, group){
  const orig = ORIGINAL_ROW_SETS[key] || ORIGINAL_GROUP_SETS[group] || null;
  return orig && orig !== setForRow(key, group) ? orig : null;
}
/** What an untouched row showed under its previous set. */
export function legacyDefaultForRow(key, setName){
  return ORIGINAL_DEFAULTS[key] || (STATUS_SETS[setName] || [['']])[0][0];
}
/** Pill colour for a value that isn't in the row's current set. */
export function foreignClass(key, group, value){
  const legacy = legacySetForRow(key, group);
  if (legacy && inSet(legacy, value)) return statusClass(legacy, value);
  for (const name of Object.keys(STATUS_SETS)){
    if (inSet(name, value)) return statusClass(name, value);
  }
  return '';
}
/** True if a value belongs to the given set. */
export function inSet(setName, value){
  return (STATUS_SETS[setName]||[]).some(s => s[0] === value);
}
/** Label for a value that isn't in the row's current set: its previous set
    first, then any set that knows it, else the raw value. */
export function foreignLabel(key, group, value){
  const legacy = legacySetForRow(key, group);
  if (legacy && inSet(legacy, value)) return statusLabel(legacy, value);
  for (const name of Object.keys(STATUS_SETS)){
    if (inSet(name, value)) return statusLabel(name, value);
  }
  return value;
}

/** The status set a given row uses — its override, else its table's set. */
export function setForRow(key, group){
  return ROW_STATUS_OVERRIDES[key] || (TRACKER_GROUPS[group] || {}).set;
}
/** The value a row shows before anyone has touched it. */
export function defaultForRow(key, setName){
  return ROW_STATUS_DEFAULTS[key] || (STATUS_SETS[setName] || [['']])[0][0];
}
export function statusLabel(setName, value){
  const row = (STATUS_SETS[setName]||[]).find(s => s[0] === value);
  return row ? row[1] : (value || '—');
}
export function statusClass(setName, value){
  const row = (STATUS_SETS[setName]||[]).find(s => s[0] === value);
  return row ? row[2] : '';
}
