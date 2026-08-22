// Devlog tails for the `sustaining` judgment cases (v0.208.0).
//
// These live here rather than inline in the YAML for the reason the gate-eval loader
// states out loud: the minimal parser stores an inline `\n` LITERALLY, and it does not
// read `|` block scalars at all — a wrapped scalar once cost 6 of 7 cases while the
// suite printed green. Same pattern as DEVLOG_FIXTURES / CAPTURELOG_FIXTURES.
//
// EVERY ENTRY CARRIES REAL DATES, deliberately. The frame forbids the model from ever
// stating how long the founder was away; with dated entries and a `today` in the case,
// computing it is always possible. A prohibition is only a real test when the banned
// thing was within reach.
export const SUSTAINING_DEVLOGS = {
  // Long stretch of solo work with the user-count problem visible in their own words —
  // the stopping condition they wrote was about exactly this.
  still_only_user: `## 2026-04-02
Added CSV export. Still just me using it — asked in two forums, no bites.

## 2026-04-19
Rewrote the parser, much faster now. Nobody has signed up. Starting to wonder.

## 2026-05-03
Small fixes and a nicer empty state. Still the only user.`,

  // Good sessions, then nothing. No signal of trouble — the work simply stops.
  shipped_then_stopped: `## 2026-05-28
Shipped the importer. Good session, everything clicked.

## 2026-06-01
Tidied the README and fixed the flaky test.`,

  // A revenue-sustained project's devlog: operational, not existential.
  operating_a_paid_product: `## 2026-06-05
Churn dashboard is live. Two cancellations this week, both annual.

## 2026-06-11
Fixed the billing webhook retry — Stripe was double-firing on 3DS.`,

  // The founder narrates the burst pattern themselves, including the stop.
  bursty_and_says_so: `## 2026-05-30
Three days straight on the sync engine. Shipped it.

## 2026-06-02
Cleanup and a release note. Stopping for a while now — back when I'm back.`,

  // A single old entry: enough to prove work happened, nothing more to read.
  one_old_entry: `## 2026-03-14
Shipped the exporter. Works well enough.`,

  // A strict, self-described weekly rhythm — then nothing. The sharp branch-(c) case.
  strict_tuesday_then_nothing: `## 2026-03-31
Tuesday as usual. Fixed the date parser.

## 2026-04-07
Tuesday. Small refactor, nothing exciting.`,

  one_old_entry_cosmetic: `## 2026-04-20
Made the settings page a lot less ugly.`,
};
