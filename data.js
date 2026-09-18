/* ------------------------------------------------------------------
   data.js — all static plan content.
   Edit this file to change plan copy; no other file needs touching.
   ------------------------------------------------------------------ */

export const START = new Date('2026-09-10T00:00:00Z');

export const WEEKS = [
  {n:1, monday:'2026-09-14'},{n:2, monday:'2026-09-21'},{n:3, monday:'2026-09-28'},
  {n:4, monday:'2026-10-05'},{n:5, monday:'2026-10-12'},{n:6, monday:'2026-10-19'},
  {n:7, monday:'2026-10-26'},{n:8, monday:'2026-11-02'},{n:9, monday:'2026-11-09'},
  {n:10, monday:'2026-11-16'},{n:11, monday:'2026-11-23'},{n:12, monday:'2026-11-30'},
  {n:13, monday:'2026-12-07'}
];

export const FLOOR = 8000, STRETCH = 10000;
export const CAC_FLEET_CEIL = 850, CAC_SUB_CEIL = 20;
export const FR_FLOOR = 1650000, FR_STRETCH = 1840000;

export const PHASES = [
  {tag:'Phase 1 &middot; Foundation', dates:'Sep 10 &ndash; Oct 9, 2026 &middot; Days 1&ndash;30',
    gf:['Pilot health check on Alcoa and Satguru (Vikash + Prity) &mdash; confirm status and look for expansion room',
        'No canonically-confirmed named grey-fleet-only pilot exists in deck materials today &mdash; confirm the current trial roster this week rather than assuming one',
        'SDR builds the target list across the 5 named verticals; first outbound wave by day 10',
        'Ship the &ldquo;3+ Johns at one employer&rdquo; flag, even as a manual weekly check'],
    fv:['Open partner conversations across all 5 fuel-verification verticals in parallel (one light-touch Ontario Electrical League conversation only)',
        'Identify the warmest HVAC/trades prospect for the reserved testimonial slot',
        'Fold the fleet-card discovery question into every call to feed the Phase 2 card-API decision'],
    fr:['Stand up the investor-outreach workflow: confirm ICP filters, open the data-room shell, set the Monday update cadence',
        'Build/refresh the investor ICP and target list (Week 1 per the Strategy Guide) &mdash; work from the 70-firm CSV, do not re-research',
        'This dashboard is live by end of phase &mdash; do not wait until behind pace to start measuring']},
  {tag:'Phase 2 &middot; Pipeline &rarr; paid &amp; warm outreach', dates:'Oct 10 &ndash; Nov 8, 2026 &middot; Days 31&ndash;60',
    gf:['Push every Phase-1 lead through the funnel; weekly check against the MRR math',
        'Launch the lightweight in-app referral path for John &mdash; no driver should have to pitch Sarah alone'],
    fv:['SDR outbound live across Ranks 1&ndash;4; fraud preempt in every demo',
        'Convert trials to paid with the Week-1 flag-clearing check-in tracked on every account',
        'Hard gate: one real HVAC/trades quote for the reserved testimonial slot before this phase closes'],
    fr:['Warm outreach live across the 5 paths; forwardable intro template in the hands of every connector',
        'First pitch meetings &mdash; target 50% advance to DD, per the Strategy Guide\'s own goal',
        'Day-45 checkpoint: recompute both MRR and capital-secured pace; shift to partnership-sourced batches if behind']},
  {tag:'Phase 3 &middot; Close &amp; package', dates:'Nov 9 &ndash; Dec 8, 2026 &middot; Days 61&ndash;90',
    gf:['Push remaining qualified grey-fleet pipeline to close &mdash; founder/team time on live deals, not new prospecting'],
    fv:['Recompute the vertical ranking for next sprint based on actual conversion, not fit score alone'],
    fr:['Due diligence, data room, and term-sheet negotiation &mdash; target dilution &le;20%',
        'Compile the traction package: MRR by product line, logo names, churn observed, CAC actually collected',
        'Flag explicitly which numbers are actuals from this sprint vs. projections in any investor material']}
];

export const CHANNELS = [
  ['Pilot health &amp; expansion &mdash; Alcoa, Satguru','Vikash + Prity','$0','Already-paying or already-engaged accounts &mdash; the fastest real MRR and the easiest upsell conversation.'],
  ['Fuel-card partnerships &mdash; Fleetcor/Corpay Canada (rank 1, dual-motion into leasing too), Comdata/Fuelman (rank 2), WEX (rank 3, warm-intro only this quarter)','Vikash','Time only','Lead with the fraud/verification layer, live and Alcoa-proven &mdash; never coaching/rewards, that&rsquo;s roadmap. Concede OEM data is commoditized, pivot to the four-dimension cross-check + cross-issuer fraud dataset. Ask sequenced: referral/co-marketing now, Level III data integration only once card-adoption share is confirmed in discovery.'],
  ['Insurance-broker partnerships &mdash; Zensurance (rank 1, Toronto SMB MGA), Mitch Insurance / Morison (rank 2, HVAC &amp; trades-adjacent), Acera (rank 3), BrokerLink (rank 4, long-shot, warm-intro only)','Vikash','Time only','Lead with verified exposure (odometer/location) &mdash; the only one of the three insurer pillars with a direct line to underwriting/claims/pricing. Fraud-control and EcoPoints are retention add-ons, not underwriting inputs &mdash; never blend them into the lead. Ask: a 30-minute conversation, not a demo; a small consented data-sharing pilot if it lands.'],
  ['Fleet leasing &amp; rental partnerships &mdash; Foss National Leasing (rank 1, Canadian-owned, CFLA-adjacent), Merchants Fleet (rank 2, explicit SMB tiers), Enterprise Fleet Management (rank 3, tightest ICP match), Element (rank 4, deepest existing stack, sequence last)','Vikash','Time only','Two motions, don&rsquo;t blend: lead with distribution (their lessees already run their own fuel cards/mileage reimbursement &mdash; live product, Alcoa-reused proof point) before the Mileage-Cap Trajectory tool, which is roadmap, next-in-build, not demoable yet. Ask sequenced: referral/revenue-share now; a discovery conversation only on the trajectory tool, not a pilot.'],
  ['Demo-led funnel &mdash; Inbound &rarr; SDR Qual &rarr; AE Demo (SLA: SDR &le;4h, Demo &le;7 days)','Prity','Time only','Prity covers qualify + demo + close solo &mdash; no dedicated SDR is the single biggest bottleneck in this funnel today.'],
  ['Outbound SDR &mdash; email + LinkedIn multi-touch','Divjot (list-build) + Prity (send/qualify)','Time only','Divjot builds the target list against the right persona per motion &mdash; HR/Office Manager for grey fleet, Owner/GM or Finance/Ops Manager for HVAC/company-owned &mdash; one blended list undersells both. Route every artifact through sarah-persona-evaluator before it sends.'],
  ['John community / Driver Championship flywheel','Divjot','$0&ndash;low','Real MRR at $9.99/sub now, plus compounding warm leads into Sarah &mdash; no BD support exists to close the resulting employer deals yet.'],
  ['Content / SEO &mdash; IRS/CRA audit guides, ROI calculators, case studies','Prity','$0','Cheap and compounding, but slow &mdash; credibility and inbound trickle, not a 90-day mover.'],
  ['LinkedIn ABM &mdash; targeted ads to Fleet Managers &amp; CFOs','Prity','Low','Medium priority per the Strategy Guide &mdash; layer on once the demo-led funnel has real conversion data.'],
  ['Industry events &amp; associations &mdash; see the priority ranking below','Vikash','Cost + time','Motion 6, access-only &mdash; member listings, sponsor/demo slots, never referral-fee language (that&rsquo;s the fuel-card/broker/leasing rows above). No dedicated events lead, so this stays a founder-led credibility play, capped at the weekly floor of one partner/association conversation, not a volume channel.'],
  ['Paid acquisition','&mdash;','&mdash;','Do not spend in this window &mdash; $850/fleet and $20/subscriber are post-raise targets, not proven numbers yet.']
];

export const ASSOC_PRIORITY = [
  [1,'HRAI AGM &mdash; &ldquo;The Unconventional Advantage&rdquo;','Sep 19&ndash;23, Gatineau QC','HVAC/Field Service &mdash; the #1 anchor vertical for fuel-verification and #3 for grey fleet','None yet','Member-benefit listing; sponsor/demo slot','Imminent &mdash; 3 days out as of this update. Pre-book 1:1s now; a booth without them is wasted founder time.'],
  [2,'IBAOcon','Oct 21&ndash;22, Sheraton Centre Toronto','Trusted advisor + the clearest event-based path into the broker-upsell motion above','None yet','Sponsor/exhibit','120+ exhibitors, 3,000+ attendees &mdash; distinct from the Zensurance/Mitch/Morison commercial-broker row above; this is the association (access, not revenue).'],
  [3,'HRPA Summit','Oct 19, Toronto/Ottawa','Trusted advisor (HR) &mdash; reaches Sarah&rsquo;s own peer community directly','None yet','Session/content sponsorship','Dual-city event.'],
  [4,'MCAO S.M.A.R.T. Innovation','Nov 12, Hockey Hall of Fame, Toronto','Mechanical contractors, dual-flywheel &mdash; reinforces the HVAC/Field-Service overlap this sprint is already leaning on','None yet','Demo slot/sponsor table',''],
  [5,'CPA Ontario 2026 conference series','Multiple ON dates','Trusted advisor (accounting) &mdash; Finance is part of the broadened Sarah buyer title','None yet','Co-branded client briefing; PD-conference session','Directory flags this &ldquo;strong &mdash; start here.&rdquo;']
];

export const ASSOC_WATCHLIST = [
  ['TRREB REALTOR QUEST (Real Estate) &amp; Rx&amp;D/IMC (Pharma)','Both carry an existing testimonial &mdash; Urbanest Properties and Axis Diagnostics &mdash; but neither has a confirmed date inside this 90-day window (May TBD / 2026 TBD). Don&rsquo;t wait on the event: pursue the member-benefit listing or newsletter mention now, proof-in-hand.'],
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
  ['B2B SaaS','MRR (net, not gross), logo count and names, churn, trial&rarr;paid rate, and CAC checked against the $850/fleet benchmarked ceiling &mdash; not the deck&rsquo;s superseded $1,450. Report grey-fleet, fuel-verification, and B2C as separate sub-lines, not blended.'],
  ['Insurtech','Evidence the commission thesis is real pre-launch: broker conversations opened, behavior-pricing data being collected, named pilot interest from a carrier or MGA.'],
  ['Transportation','Vertical penetration across the 5 fuel-verification segments plus the grey-fleet named verticals, driver/trip volume, Smartcar integration status, and the Alcoa fuel-fraud cross-check as a live proof point.']
];

export const RULES = [
  'Charge from day one wherever possible &mdash; reserve free pilots for accounts with outsized distribution value only.',
  'Do not chase 500+ vehicle enterprise accounts this window &mdash; a long cycle risks the whole 90 days for one logo.',
  'When a deal stalls on price, reframe to her own ROI number first &mdash; discounting before that trains buyers to wait.',
  '3+ active John users at one employer &rarr; skip cold outbound, go straight to a warm conversation.',
  'Realized CAC above $850/fleet or $20/subscriber for two straight weeks &rarr; re-rank or cut that channel.',
  'MRR pace or trial&rarr;paid conversion behind target for two straight weeks &rarr; escalate to partnerships, not more outbound volume.',
  'Never blend Confirmed and Estimated dollar figures into one point number in outward-facing copy &mdash; lead with the Confirmed floor, let fraud/leakage be the upside.',
  'Never apply grey-fleet mileage-correction language to a company-owned pitch, or fuel-savings language to a grey-fleet vehicle.',
  'Any warm-intro message or dollar figure sent to an investor must carry the current $1.65M&ndash;$1.84M ask &mdash; a stale figure is what triggered the last full deck reconciliation pass.',
  'Data-partnership and association conversations are pipeline/credibility signals only &mdash; never count them toward the MRR number.',
  'Never present GPS/Smartcar tracking alone as &ldquo;the moat&rdquo; to an investor &mdash; it&rsquo;s commoditized; pair it with the compounding dataset, cross-team trust, or the flywheel. Never describe license/insurance verification or the named risk scores (Trip Trust, Safety, Trip Earning) in present tense &mdash; all roadmap, none built.',
  'Never pitch compliance-gating (auto-restricting claims to compliant vehicles/drivers) as differentiated IP &mdash; Prolius already ships it live. It&rsquo;s a real product gap worth closing, not a patentable one; lead any IP conversation with the Fuel Receipt Verification AI&rsquo;s triangulation logic instead.',
  'Never offer a referral fee or revenue-share to an association or trusted advisor (HRAI, TRREB, IBAO-as-association, HRPA, CPA Ontario/Canada, MCAO, CFA, FHCP, IMC, CFLA, NAFA) &mdash; the ask is access only. Commercial partners (fuel-card companies, insurance brokers/MGAs, leasing companies) are a different motion where referral/revenue-share is the right language &mdash; never blend the two.',
  'If a fuel-card, broker, or leasing partner asks for Fuelshine&rsquo;s own fleet/driver network instead of opening theirs, treat it as a pricing question, not a relationship gesture &mdash; trade it for reciprocal value (data access, a consented pilot, referral/revenue-share) or decline. Never hand over a bulk intro list for free to keep a conversation warm.'
];

export const TEAM = [
  ['V','Vikash','Product ownership, Retention &amp; Revenue, Investor workflow (sole owner)',null],
  ['P','Prity','Customer Growth &amp; Success, Retention &amp; Revenue','No dedicated SDR &mdash; covers qualify, demo, and close solo'],
  ['D','Divjot','Customer Growth &amp; Success (community/flywheel) + dedicated SDR &mdash; target-list build, persona-correct targeting',null],
  ['Di','Dilli','PMF &amp; Product, full-stack engineering','Solo on Axle/SambaSafety integration and mileage-model calibration'],
  ['K','Khalid','PMF &amp; Product, Flutter app',null],
  ['N','Nancy','PMF &amp; Product, trainee product manager',null]
];

export const GAPS = [
  ['Dedicated SDR &mdash; partially addressed','Divjot now owns target-list building with persona-correct buyer targeting; Prity still covers qualify + demo + close solo &mdash; the remaining bottleneck in the demo-led funnel.'],
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
  ['gfChurn','Grey fleet · Churned MRR','money'],
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
  ['frNotes','Fundraising · Notes','text']
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
  /* IP & legal — US legal-ops workflow. "Registered" is the correct term
     for a granted trademark or copyright registration. */
  ip: [
    ['not-started','Not Started',   ''],
    ['counsel','Under Review',      'watch'],
    ['in-progress','In Progress',   'watch'],
    ['filed','Filed',               'watch'],
    ['registered','Registered',     'ok'],
    ['no-action','Closed',          '']
  ],
  /* Associations & events — partnership BD pipeline. "Passed" is the
     standard US term for a mutual no, and carries no blame. */
  assoc: [
    ['not-started','Not Started',   ''],
    ['outreach','Outreach Sent',    'watch'],
    ['in-discussion','Engaged',     'watch'],
    ['confirmed','Committed',       'ok'],
    ['not-proceeding','Passed',     'risk'],
    ['deferred','On Hold',          '']
  ],
  /* Channels — growth-team lifecycle for an acquisition channel. */
  channel: [
    ['not-started','Not Started',   ''],
    ['piloting','Testing',          'watch'],
    ['active','Scaling',            'ok'],
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

/* Which status set each tracked table uses, and the label shown in the change log. */
export const TRACKER_GROUPS = {
  ip:      { set:'ip',       label:'IP action' },
  assoc:   { set:'assoc',    label:'Association / event' },
  chan:    { set:'channel',  label:'Channel' },
  fvvert:  { set:'vertical', label:'Fuel-verification vertical' },
  gfvert:  { set:'vertical', label:'Grey-fleet vertical' }
};

export function statusLabel(setName, value){
  const row = (STATUS_SETS[setName]||[]).find(s => s[0] === value);
  return row ? row[1] : (value || '—');
}
export function statusClass(setName, value){
  const row = (STATUS_SETS[setName]||[]).find(s => s[0] === value);
  return row ? row[2] : '';
}
