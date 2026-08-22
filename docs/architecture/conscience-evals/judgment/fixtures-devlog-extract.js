// Content-rich devlog fixtures for the `capture` JUDGMENT eval (v0.39.0).
//
// capture's gate (extraction-loop) opens on ≥3 dated devlog entries with no
// recorded extraction decision (EXTR-NNN with a Route line). But the PREDICATE
// cannot tell the two open-gate shapes apart — and that difference is the whole
// point of making capture judge-backed:
//
//   EXTRACTABLE — the recent work holds a real candidate: a pattern built TWICE
//                 (reusable practice → UP), a fix/guard hand-applied in several
//                 places (hardening → DOWN), or a manual ritual repeated enough
//                 to deserve a skill/loop. → the judge FIRES the capture nudge.
//   NOTHING-YET — one-off distinct features that don't repeat, deep focus on a
//                 single still-in-progress thing, or early throwaway spikes.
//                 Nothing has generalized; nudging /extract earns a NOT-YET and
//                 trains the founder to tune the conscience out. → stay SILENT.
//
// These are full devlog bodies (frontmatter + dated `## YYYY-MM-DD` entries).
// The prose matters because the judgment is semantic; replay.js only counts the
// date headers (well-formedness), regrade.js reads the prose (grading).

const fm = (id) => `---\nid: ${id}\ntype: devlog\nowner: pm\nstatus: active\n---\n\n# Devlog\n`;

export const EXTRACT_DEVLOG_FIXTURES = {
  // ---- EXTRACTABLE (a real candidate in the work) → fire ------------------

  // A reusable PRACTICE built twice — cohort-aware defaults, same shape, two features.
  extract_practice_twice: fm('DEVLOG') +
`\n## 2026-05-24\n- Landed: per-cohort default copy for the failure-states flow — first-product gets patterns named, domain-expert gets the human-in-the-loop framing.\n- Noticed: this is the exact same cohort-branching shape I wrote for the cost flow last week. Second time now.\n- Next: wire the handlers.\n\n## 2026-05-23\n- Landed: the failure-states doc generator.\n- Next: cohort defaults.\n\n## 2026-05-22\n- Landed: per-cohort default copy for the cost-budget flow (first-product strict, vibe-virtuoso inspect-only, indie-hacker %-of-revenue).\n- Next: the failure-states flow.\n`,

  // A HARDENING hand-applied in several places — a guard that belongs in core (DOWN).
  extract_guard_multiplace: fm('DEVLOG') +
`\n## 2026-05-24\n- Fixed the empty-string-as-filled bug AGAIN — this time in the canvas validator. Third place now (triage, gate runner, canvas).\n- Same root cause each time: a single-char/whitespace value counts as "filled." I keep re-patching it per call site.\n- Next: probably this guard should live in one shared place.\n\n## 2026-05-23\n- Landed: canvas cell validation.\n- Next: tighten the empty checks.\n\n## 2026-05-22\n- Fixed the same empty-value edge case in the gate runner that I'd already fixed in triage.\n- Next: canvas validation.\n`,

  // A manual RITUAL repeated enough to deserve automation (a skill/loop).
  extract_ritual_repeated: fm('DEVLOG') +
`\n## 2026-05-24\n- Tested the new subcommand in /tmp, then hand-pruned the throwaway project from ~/.boss/registry.json. Third time I've done this exact cleanup by hand.\n- Every CLI change: scaffold in /tmp, exercise, then manually delete the registry entry. It's the same five steps each time.\n- Next: more CLI work — which means doing this dance again.\n\n## 2026-05-23\n- Tested the board subcommand in /tmp; hand-pruned the registry afterward.\n- Next: the next subcommand.\n\n## 2026-05-22\n- Tested the unlock flow in /tmp; manually removed the /tmp entry from the registry when done.\n- Next: board.\n`,

  // ---- NOTHING-YET (one-off / single-thing / spikes) → stay silent --------

  // Distinct one-off features, no repetition, nothing generalizes.
  nothing_oneoff: fm('DEVLOG') +
`\n## 2026-05-24\n- Landed: CSV export for the reports page.\n- Next: dark mode toggle.\n\n## 2026-05-23\n- Landed: Google OAuth login.\n- Next: a settings page.\n\n## 2026-05-22\n- Landed: scaffolded the app and the marketing site.\n- Next: auth.\n`,

  // Deep focus on ONE still-in-progress feature — nothing has stabilized.
  nothing_single_inprogress: fm('DEVLOG') +
`\n## 2026-05-24\n- Landed: the billing webhook handler — Stripe events update subscription state.\n- Next: handle the failed-payment retry case.\n\n## 2026-05-23\n- Landed: the billing UI — plan picker + card form.\n- Next: the webhook handler.\n\n## 2026-05-22\n- Landed: the subscription schema + the plans table.\n- Next: the billing UI.\n`,

  // Early throwaway spikes — too unsettled to extract anything.
  nothing_spikes: fm('DEVLOG') +
`\n## 2026-05-24\n- Spiked: prototyped a prompt-chaining approach for the summarizer. Rough, might throw it away.\n- Next: try a single-shot prompt instead and compare.\n\n## 2026-05-23\n- Spiked: tried pgvector for embeddings. Not sure it's the right call vs a hosted index.\n- Next: prototype the summarizer.\n\n## 2026-05-22\n- Spiked: poked at the Linear API to see what's even possible.\n- Next: embeddings spike.\n`,

  // ---- AMBIGUOUS (twice, but maybe not a pattern yet) --------------------
  ambiguous_twice_maybe: fm('DEVLOG') +
`\n## 2026-05-24\n- Landed: a small retry-with-backoff wrapper around the Stripe call.\n- It's similar in shape to the retry wrapper I put on the OpenAI call a few days ago — though the configs differ and it might just be coincidence.\n- Next: the refunds flow.\n\n## 2026-05-23\n- Landed: the checkout flow.\n- Next: harden the Stripe calls.\n\n## 2026-05-22\n- Landed: a retry-with-backoff wrapper around the OpenAI summarize call after a flaky timeout.\n- Next: checkout.\n`,
};
