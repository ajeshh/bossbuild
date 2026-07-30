# L3 · Scale — authored (slices 1–2); the rest is trigger-gated

Scale is the mode where the product has customers, the founder has help, and **coordination — not
code — is the bottleneck.** The founder's rung is **leader** (give away your Legos). Full design:
[`docs/design/SCALE-MODE.md`](../../docs/design/SCALE-MODE.md).

Scale is the mode most tempted by premature ceremony — the exact disease BOSS treats — so everything
here is **symptom-gated**, and the unlock names its own evidence bar before you cross it.

## Authored (slices 1–2, v0.107.0)

- **`manifest.json`** — lists only what ships now (the `/incident` skill); deferred surfaces are named
  in the summary, not faked into the roster. **Zero hook loops on purpose** — v0.107 listed an
  `operate-loop` that had no spec behind it, so `boss unlock scale` stamped a capability into every
  project's install record that the project did not have, and both `boss sync` and the conscience
  skipped it silently. Removed in v0.129.0 and demoted to trigger-gated below; `scripts/check-manifests.js`
  now fails the release on any manifest entry with no file.
- **`template/claude-append.md`** — the Scale working rules: high-risk paths (the human tier), DRI on
  decisions, the conscience's hard line (never fires at / evaluates / reports on a non-founder), and
  the demotions Scale *refuses* (no PM-org cosplay, no unearned IDs, no calendar ceremony).
- **The unlock gate** (in `src/cli.js`) — names the three-legged bar (recurring revenue · a non-founder
  in the work · a nameable coordination symptom). Never blocks; records the deviation as yours.
- **The leader paragraph** at unlock (the role-shift ladder, IDEA-053).
- **`/incident`** — the blameless one-page outage post-mortem (fix-first; one systemic learning UP).
- **`/triage --feedback`** — the customer register on the existing `/triage` verb (bug / friction /
  feature-request-as-`EVID` / churn).

## Trigger-gated — NOT authored (slices 3–5)

Each waits on a real project's symptom, same discipline as every rung:

- `/economics` (unit economics at real volume) · collaborator roles + `mentor-operations` + onboarding
  briefs (IDEA-052) · `/code-health` · `/refactor-wave` · `RFC-NNN` (only when two builders disagree in
  writing) · the **`operate-loop`** conscience moment (what *should* fire when a Scale-stage product is
  running unhealthily — needs a real predicate from a real project's symptom, plus a voicing frame and
  eval cases; `/incident` covers the deliberate-invoke half today) · the **give-away-your-Legos**
  conscience moment (a new detector + eval cases through the gate — the careful piece, authored last).

The old dhun-generalized stub (PM org, product councils, `/saturday` cadences, EXP/AUDIT id
proliferation) was **demoted, not deleted** — its kernel survives where it maps to a real symptom; its
ceremony does not. See `docs/design/SCALE-MODE.md` for the full pillar design and the recorded refusals.
