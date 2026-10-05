---
id: RVW-125
type: verdict
owner: pm
status: recorded
created: 2026-10-05
verdict: REJECT
route: n/a
sources:
  - a vendor advocate's setup guide, 2026-05 (docs/research/sessions/SESSION-2026-10-05-design-system-reading.md, gitignored)
---

# RVW-125 — give the agent the package (what), the docs server (why/when) and skills (workflow)

## The claim
- **Source:** a vendor advocate's setup guide, 2026-05.
- **Core assertion:** AI tools invent your design system unless they get three things: the installed package (real props and tokens: the vocabulary), a documentation server (usage, do/don't, patterns: the grammar), and skills/rules that encode the workflow (*"if a component you need doesn't exist, flag it rather than invent it"*). Includes per-tool setup notes and two routing skills for the vendor's own server.
- **Inbox file:** `~/Projects/inbox/bossbuild/Setting your AI coding tool up to use your design system…pdf`

## Rubric
| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | No. |
| 2 | Evidence grade | Practitioner setup advice, partly a product walkthrough. |
| 3 | Duplicate or sharpen? | **Duplicate.** BOSS's three layers are the same three: the code and `manifest.json` (what exists: name · import · variants · tokens), the usage pages and PATTERNS (when and why), and the guards plus skills (workflow, enforced at the write). *"Flag it rather than invent it"* is `component-reuse-guard`'s *reuse, adjust, or new?*. The docs-server half is RVW-081/082: the host's job, seam not vendor. |
| 4 | Who serves / harms? | n/a |
| 5 | Cost / ceremony | n/a |

## Verdict: REJECT
BOSS made the same three-part split and enforces the third part with hooks instead of asking in prose. The per-tool notes are vendor-specific and would rot in shipped text.

## If REJECT / NOT-YET
- **Why not:** duplicate of manifest + usage pages + guards; the docs server is the host's seam (RVW-081).

## Attribution
The author's own setup; tool claims not re-checked.

## Notes
- BOSS version when recorded: 0.329.0
