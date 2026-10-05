---
id: RVW-124
type: verdict
owner: pm
status: recorded
created: 2026-10-05
verdict: ADAPT
route: DOWN stages/L1-mvp design-tokens-init (one line in the CLAUDE.md block)
sources:
  - a design-system vendor advocate's post on how agents read design docs through a docs server, 2026-02 (docs/research/sessions/SESSION-2026-10-05-design-system-reading.md, gitignored)
---

# RVW-124 — agents read patterns before components and rules before tips, so write (and prompt) for that

## The claim
- **Source:** a vendor's design advocate, from watching agents audit and build through the vendor's
  own docs server.
- **Core assertion:** agents fetch in an order: pattern pages, then component pages, then
  cross-cutting guidance, with foundations last and only when asked. They weigh language: *must /
  use when* = required, *should / consider* = advisory, tips = context. So write requirements as
  imperatives, kept apart from advice, and tell the agent the order and the strictness. **And:**
  *"If pages conflict, say which source you're following and why"* turns a silent error into a
  visible decision.
- **Inbox file:** `~/Projects/inbox/bossbuild/How LLMs use MCPs to read your design system…pdf`

## Rubric
| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | No. The conflict line is PRINCIPLE-shaped: a decision made visible instead of silent. |
| 2 | Evidence grade | **The read-order and weighting claims are asserted, not shown.** They come from one vendor watching its own server, with no transcript or count, and are presented as how "LLMs" behave in general. Not graded as fact. The prescriptions don't depend on them. |
| 3 | Duplicate or sharpen? | **Mostly duplicate.** Required vs advice is already the style-guide principle shape: *Guideline* (how to approach) is separate from *Rules* (checkable), with *"an agent can't act on a principle; it can only act on a rule."* Patterns first is the reuse guard reading PATTERNS at the write. **Not present:** anything telling the agent what to do when two design docs disagree. The playbook shows one disagreement (*"the page says X; the index says Y. The index wins"*), but the agent writing code never sees that page. |
| 4 | Who serves / harms? | Serves every UI cohort. A visible "I followed X over Y" is what lets a `first-product` founder notice a contradiction they'd never find. Harms no one. |
| 5 | Cost / ceremony | One line, in a block RVW-122 makes shorter. Net lighter. |

## Verdict: ADAPT
Take the one line that doesn't depend on the unverified behaviour claims: **when two design docs
disagree, say which one you followed and why.** It costs a sentence and turns BOSS's quietest
failure (two true-looking sources) into something the founder sees in the transcript. The read-order
prescription is refused: it's a vendor's observation of its own server, and BOSS's guards already
put the right doc in front of the write.

## If ADOPT / ADAPT
- **What to do:** add to the CLAUDE.md block `/design-tokens-init` writes (alongside RVW-122's
  subtraction): *"If two design docs disagree, say which you followed and why. The component
  index wins on status, `tokens.json` wins on a value, and anything else is a question for the
  founder."* The status rule is BOSS's own (`boss design` and the usage-page template already say
  *"the index wins"*); the value rule is the source-of-truth line the block already carries.
- **What's modified:** no read-order instruction, no strictness dial, no docs-server prompt advice.

## Attribution
Partly verified. The prescriptions are the author's. The behaviour model ("LLMs prioritise
patterns", "foundations last") is the author's inference from their own product and does not
verify as a general claim.

## Notes
- Prior related verdicts: RVW-078, RVW-122 (same block), RVW-125.
- Outcome (2026-10-05): landed as rule 6 of the CLAUDE.md block `/design-tokens-init` writes.
- BOSS version when recorded: 0.329.0
