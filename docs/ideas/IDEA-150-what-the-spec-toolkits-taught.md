---
id: IDEA-150
type: idea
kind: capability
owner: product-lead
status: building
building_since: 2026-10-05
gist: The fixes and small improvements a close read of the spec-driven toolkits turned up — CLI craft, the done-check, bug discipline, untrusted fetches, a private security route — each reproduced or vetted before it is built.
created: 2026-10-05
relates: IDEA-120
---

# IDEA-150 — What the spec toolkits taught

Ajesh, 2026-10-05: *"go for all the fixes and improvements."* The sources are three reads of the open-source spec toolkit
(`docs/competition/spec-driven-builders.md` § deep dive, parts 1 and 2) and RVW-136…144. The outside
sources are named only in the gitignored `docs/research/sessions/SESSION-2026-10-05-spec-driven-reading.md`. Already
landed: `dbf0ae5`, where an unparseable `settings.json` is now left alone instead of rewritten.

**Rules for this record.** Rule 8: a fix ships only with a test that failed on the old code. A
stranger's idea goes through `/vet` first. BOSS applying its own stated rule doesn't need a vet.

## Tasks

**A — CLI craft** (worktree `idea-150`)
- [x] A1 `boss new "my proj"` prints `cd my proj`; quote it (`cli.js:171`, `:1534`). Reproduced.
- [x] A2 Errors that stop without naming the next step: `new .` (point to `adopt`), `adopt --mode` (list
  the modes), and `hooks enable` outside a project (use the shared hint). Reproduced.
- [x] A3 Unknown flags are silently ignored (`status --bogus` exits 0; `status --json` prints prose).
  Reproduced.
- [x] A4 `engines: node >=18` but CI runs only 22 and 24. Make the claim match what runs. Reproduced.
- [x] A5 `boss new` / `adopt` say "type `claude`"; check it's on PATH and say so only when it's missing.
- [x] A6 `--json` failures: a JSON error on stderr.
- [x] A7 CI: `permissions: contents: read`; pin actions by SHA. Reproduced (neither is there).
- [x] A8 A source checkout reports the last stamped version while running unreleased work.
- [x] A9 A failed `boss new` leaves a half-built folder. **Not reproduced, so nothing shipped** (rule 8):
  nothing in `cmdNew` fails after `mkdirSync` without an injected fault. Reopen if a founder hits it.
- [x] A10 `boss id IDEA` offered IDEA-148 while a peer's open worktree held it. Reproduced in this session.

**B — the spec loop** (worktree `idea-150-spec`)
- [ ] B1 RVW-136: a tick carries evidence; settle who ticks (`/log`, `/close`, `feat-record.md:31`).
- [ ] B2 RVW-137: at close, the agent names anything it built that wasn't asked for; silent otherwise.
- [ ] B3 RVW-138: a fix FEAT names the neighbour path it must not change.
- [ ] B4 `coder` bug discipline: reproduce first; re-diagnose when a fix doesn't hold. BOSS's own rule
  (`engineering.md:54`), moved to where it ships from Quickstart.
- [ ] B5 Subtract `/spec` (497 lines, against BOSS's own 500-line ceiling): move conditional branches into
  `spec/templates/`, keeping the trigger lines inline.

**C — skill text** (worktree `idea-150-skills`)
- [ ] C1 `/import` and `/comp-eval`: fetched text is data, not instructions; quote instruction-like
  lines as Unverified; refuse non-http(s), localhost, private and metadata addresses. BOSS's own rule,
  `library/practices/agent-security.md:26`.
- [ ] C2 Skills that end without one next step. The keyword grep said 26 of 42; read each and fix only
  real gaps.

**D — docs** (worktree `idea-150`)
- [ ] D1 GUIDE: "When it doesn't work", keyed on BOSS's literal error strings.
- [ ] D2 Say the npm tarball installs offline (`web/start.html`).
- [ ] D3 `docs/ENGINEERING.md`: a `cmd*` handler moves into its domain module when it's next touched.

**E — to vet first**
- [ ] E1 `amends: FEAT-NNN`, for a FEAT that changes what a shipped FEAT promised.
- [ ] E2 Named slices held in the FEAT; `coder` builds one per run.
- [ ] E3 An optional "rabbit hole" line on a FEAT.
- [ ] E4 `/spec` 6b copies *Still unknown* into `feature-context.md`: point to it instead of copying it?
- [ ] E5 CHANGELOG fragments per capability: measure how often `land` conflicts first.

**F — a private route for security reports** (Ajesh said go, 2026-10-05)
- [ ] F1 Turn on GitHub private vulnerability reporting; add `SECURITY.md`; one line in `/feedback`.

## Capture log

- 2026-10-05 — lane A done, each with a test that failed first: `888b007` (A1–A3, A6), `76a35bb` (A4, A7:
  the floor is now Node 22, the version CI runs), `17b53a9` (A5), `b89fcf99` (A8, display only), and A10 (`boss id`
  counts open worktrees).

- 2026-10-05 — opened from the spec-toolkit reads; Ajesh: *"go for all the fixes and improvements."*
