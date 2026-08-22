// Content-rich capture-log fixtures for the `caution` JUDGMENT eval (v0.33.0).
//
// caution's gate (canvas-loop) opens on ≥3 dated capture-log entries with no
// filled riskiest assumption. The PREDICATE cannot tell the two open-gate
// shapes apart — and the difference is the whole `m1-snf-021` question the gate
// runner has had to SKIP since v0.16:
//
//   DEPTH    — one idea getting sharper. Each entry refines the same bet,
//              narrows the user, or wrestles the same hard question. Healthy
//              exploration converging toward a canvas. → the judge stays SILENT.
//   AVOIDANCE— capturing-lots / validating-nothing. Idea-hopping, feature-
//              piling, market-notes-without-commitment — breadth with no bet
//              forming. → the judge fires the caution nudge.
//
// These are the capture-log BODY (dated `- YYYY-MM-DD — …` bullets). The prose
// matters because the judgment is semantic; replay.js only counts entries
// (well-formedness), regrade.js reads the prose (grading).

export const CAPTURELOG_FIXTURES = {
  // ---- DEPTH (one idea sharpening) → stay silent --------------------------
  depth_narrowing:
`- 2026-05-20 — Rough idea: a tool that helps freelancers chase late invoices.
- 2026-05-21 — Narrowing: not all freelancers — design/dev contractors who invoice >$5k, where one late payment hurts.
- 2026-05-22 — The real pain isn't reminders, it's the awkwardness of chasing a client you want to keep.
- 2026-05-23 — Sharper promise: "get paid without being the bad guy" — we send the nudge so you don't have to.`,

  depth_wrestling:
`- 2026-05-20 — Idea: AI study-buddy for med students cramming for boards.
- 2026-05-21 — Hard question I keep circling: do they want answers, or do they want to be quizzed? Different products.
- 2026-05-22 — Talked it through — the value is active recall, so quizzing. But quizzing apps exist. What's different?
- 2026-05-23 — The wedge might be: it builds the quiz from THEIR lecture notes, not a generic bank. Same idea, sharper.`,

  depth_converging:
`- 2026-05-19 — Idea: help small Shopify stores write better product descriptions.
- 2026-05-20 — Refining the who: stores with 50-500 SKUs — too many to hand-write, too few for an agency.
- 2026-05-21 — The bet forming: they'll pay if it lifts conversion, not just saves time. Conversion is the thing to test.
- 2026-05-22 — Next: I think the riskiest assumption is "AI copy actually converts better than their current copy." Canvas time.`,

  // ---- AVOIDANCE (capturing-lots / validating-nothing) → fire -------------
  scatter_hopping:
`- 2026-05-20 — Idea: a habit tracker with AI coaching.
- 2026-05-21 — New idea: actually, a tool for podcasters to auto-generate show notes.
- 2026-05-22 — Or — a marketplace for local dog walkers. This one feels big.
- 2026-05-23 — Wait, what about an AI that drafts cold sales emails? That's the one.`,

  scatter_featurepiling:
`- 2026-05-20 — Building a "second brain" app. It'll have notes.
- 2026-05-21 — Add: AI summarization of everything you save.
- 2026-05-22 — Add: a graph view. And calendar integration. And a mobile widget.
- 2026-05-23 — Add: collaborative spaces and a public-sharing mode. This is going to be huge.`,

  scatter_marketnotes:
`- 2026-05-19 — Competitor A raised $2M, has a clean landing page.
- 2026-05-20 — The market for this is supposedly $4B by 2027 (per that report).
- 2026-05-21 — Competitor B has worse UX but more integrations. Gap there?
- 2026-05-22 — TAM looks good. Lots of inbound interest in the space on Twitter.
- 2026-05-23 — Another competitor launched. Crowded but validated, I think.`,

  // ---- AMBIGUOUS (depth-with-a-detour, or scatter?) ----------------------
  ambiguous_detour:
`- 2026-05-20 — Idea: a meal-planner that learns your family's tastes.
- 2026-05-21 — Refining: the pain is the nightly "what's for dinner" decision, not recipes.
- 2026-05-22 — Tangent: could the same engine do meal-planning for small cafes? Different customer though.
- 2026-05-23 — Back to families — but the cafe idea keeps nagging. Two bets, haven't picked.`,
};
