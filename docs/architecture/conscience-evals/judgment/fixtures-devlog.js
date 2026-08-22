// Content-rich devlog fixtures for the JUDGMENT eval surface (v0.32.0).
//
// Unlike the gate-eval fixtures (runner.js — content-neutral; only the date
// headers matter for the predicate), these carry real prose because the
// JUDGMENT the model makes is *semantic*: "is this recent work testing the
// named risk, or building around it?" The grader reads the entries.
//
// Each fixture is paired to a canvas risk in drift.judgment.yml. DRIFTED
// devlogs build things orthogonal to (or — worse — explicitly deferred by) the
// named risk; AIM devlogs engage the risk directly even when no formal
// "Experiment this week" line exists yet (the hard should-NOT-fire case).
//
// All have ≥3 `## YYYY-MM-DD` headers so the predicate gate opens — the gate is
// not what's under test here; the model's call past the open gate is.

const fm = (id) => `---\nid: ${id}\ntype: devlog\nowner: pm\nstatus: active\n---\n\n# Devlog\n`;

export const DEVLOG_FIXTURES = {
  // Risk: "teams will switch from spreadsheets to this for weekly planning"
  drift_spreadsheet: fm('DEVLOG') +
`\n## 2026-05-24\n- Landed: CSV export + a polished dashboard with three chart types.\n- Next: dark mode.\n\n## 2026-05-23\n- Landed: Google OAuth login and a settings page.\n- Next: export to PDF.\n\n## 2026-05-22\n- Landed: account roles (admin / member / viewer).\n- Next: billing scaffold.\n\n## 2026-05-21\n- Landed: scaffolded the app and the marketing site.\n- Next: auth.\n`,

  aim_spreadsheet: fm('DEVLOG') +
`\n## 2026-05-24\n- Landed: spreadsheet-import wizard — paste a Google Sheet URL, we map columns.\n- Ran 4 migration sessions with real planning teams; 3 of 4 finished the import unaided.\n- Next: instrument week-2 return for the teams that imported.\n\n## 2026-05-23\n- Landed: "what did you use before / why might you go back" exit prompt after import.\n- Surprise: 2 teams said the blocker to switching is shared edit history, not features.\n\n## 2026-05-22\n- Interviewed 3 target teams about what makes them abandon a new planning tool.\n- Next: build the import wizard they all asked for.\n\n## 2026-05-21\n- Landed: scaffolded the app.\n`,

  // Risk: "clinicians will trust an AI-drafted summary enough to sign it"
  drift_clinical: fm('DEVLOG') +
`\n## 2026-05-24\n- Landed: Stripe billing integration and the org admin console.\n- Next: patient-search filters.\n\n## 2026-05-23\n- Landed: EHR-themed UI skin + a configurable dashboard.\n- Next: role-based access.\n\n## 2026-05-22\n- Landed: patient list view with pagination.\n- Next: billing.\n\n## 2026-05-21\n- Landed: app scaffold + auth.\n`,

  aim_clinical: fm('DEVLOG') +
`\n## 2026-05-24\n- Landed: clinician review queue — every AI summary lands here for sign-off.\n- Wired an audit trail capturing edit-distance between draft and signed version.\n- Next: get 3 clinicians to sign 10 real summaries.\n\n## 2026-05-23\n- Ran 10 drafted summaries past Dr. Reyes; she signed 6 unedited, edited 4 lightly.\n- Surprise: refusals cluster on med-reconciliation, not the narrative.\n\n## 2026-05-22\n- Landed: the sign-off flow + a "why did you edit" one-tap reason.\n- Next: widen to two more clinicians.\n\n## 2026-05-21\n- Landed: scaffold + the draft-generation pipeline.\n`,

  // Risk: "users will return weekly without push notifications"
  drift_retention: fm('DEVLOG') +
`\n## 2026-05-24\n- Landed: onboarding animations and a profile-customization screen.\n- Next: referral system with reward tiers.\n\n## 2026-05-23\n- Landed: avatar uploads + theme picker.\n- Next: social share cards.\n\n## 2026-05-22\n- Landed: the referral invite flow.\n- Next: more onboarding polish.\n\n## 2026-05-21\n- Landed: scaffold + signup.\n`,

  aim_retention: fm('DEVLOG') +
`\n## 2026-05-24\n- Landed: D1/D7/D28 retention cohorts in the analytics pipeline.\n- Started a 2-week holdout: half the new users get zero notifications.\n- Next: read the week-1 return delta between arms.\n\n## 2026-05-23\n- Landed: the "reason you came back today" survey on the 2nd session.\n- Surprise: early returners cite the Monday digest, not the app itself.\n\n## 2026-05-22\n- Instrumented unprompted-return events (no notification in the prior 48h).\n- Next: the holdout experiment.\n\n## 2026-05-21\n- Landed: scaffold + signup.\n`,

  // Risk: "buyers will pay $30/mo before we build the integrations"
  // DRIFTED here is the sharpest kind: building the very thing the risk says to DEFER.
  drift_wtp: fm('DEVLOG') +
`\n## 2026-05-24\n- Landed: the integration framework — plugin loader + webhook dispatch.\n- Next: Salesforce and HubSpot connectors.\n\n## 2026-05-23\n- Landed: OAuth broker for third-party connectors + API docs site.\n- Next: the Slack connector.\n\n## 2026-05-22\n- Landed: connector SDK scaffolding.\n- Next: more connectors.\n\n## 2026-05-21\n- Landed: app scaffold.\n`,

  aim_wtp: fm('DEVLOG') +
`\n## 2026-05-24\n- Landed: a fake-door pricing page at $30/mo with a real checkout step (Stripe test mode).\n- Sent 25 outreach DMs to the ICP; 9 clicked, 4 reached the checkout button.\n- Next: turn on a $1 auth-hold to separate intent from idle clicks.\n\n## 2026-05-23\n- Landed: the pricing page + "what would make this a yes" capture on the checkout.\n- Surprise: the two who bailed both asked "does it do X" where X is NOT an integration.\n\n## 2026-05-22\n- Drafted the ICP list and the outreach script.\n- Next: ship the fake door before building anything else.\n\n## 2026-05-21\n- Landed: scaffold.\n`,

  // Risk: "the integration is the wedge, not the dashboard"
  // AMBIGUOUS: a thin integration slice — reasonably read as building-toward-the-wedge
  // (on-aim) OR as building-not-testing (drift). Labeled acceptable: [fires, silent].
  ambiguous_integration: fm('DEVLOG') +
`\n## 2026-05-24\n- Landed: a thin but real Linear integration — pulls issues, shows them inline.\n- Demoed it to one design-partner team; they said "oh, THIS is the reason to use it."\n- Next: unclear — harden the integration, or test whether others react the same way?\n\n## 2026-05-23\n- Landed: the OAuth handshake + issue-sync for Linear only.\n- Next: the inline view.\n\n## 2026-05-22\n- Landed: spike on the Linear API shape.\n- Next: build the slice.\n\n## 2026-05-21\n- Landed: scaffold.\n`,

  // Risk: "small teams adopt self-serve without a sales call"
  // ON-AIM BUT INFORMAL: clearly testing the risk; no "Experiment this week" line
  // formalized. The case the predicate gate can't tell from drift — silence is correct.
  aim_informal_selfserve: fm('DEVLOG') +
`\n## 2026-05-24\n- Landed: fully self-serve signup → workspace in under 2 minutes, zero human touch.\n- Watched 8 small teams onboard unattended via session replay; logged every drop-off.\n- 5 of 8 reached "first plan created" with no help; 3 stalled at invite-teammates.\n- Next: fix the invite step that stalled 3 teams.\n\n## 2026-05-23\n- Landed: removed the "book a demo" gate entirely; replaced with a guided empty-state.\n- Surprise: nobody emailed support — they either got it or left.\n\n## 2026-05-22\n- Landed: the empty-state walkthrough.\n- Next: turn off the demo gate and watch.\n\n## 2026-05-21\n- Landed: scaffold + signup.\n`,
};
