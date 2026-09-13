---
id: RVW-100
type: verdict
owner: pm
status: recorded
created: 2026-09-12
verdict: REJECT
route: n/a
---

# RVW-100 — "coding agents make building twice cheaper than sharing one implementation" (Shopify, 2026-09-10)

## The claim
- **Source:** Mustafa Ali, Shopify Engineering, *Native is now the future of mobile at Shopify*, 2026-09-10 —
  https://shopify.engineering/back-to-native (fetched; quotes panel-verified). Companion:
  https://shopify.engineering/shop-app-migration (12 weeks, six engineers, internal agent "Pi" + subagents).
- **Core assertion (verbatim):** *"agents can now do enough of the implementation, translation, testing, and
  review work that it's no longer the deciding factor it was in 2020"* — so Shopify leaves React Native for
  Swift + Kotlin. The practice-shaped generalisation: *duplication cost fell, so prefer per-platform
  builds over shared abstractions.*
- **Inbox file:** `docs/research/inbox/shopify-back-to-native-agents-changed-the-math.md`

## Rubric
| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | No — but #4 (stack-neutral; stacks are learned, not assumed) means BOSS has no position for it to move. |
| 2 | Evidence grade | **n=1, self-published decision**, no counterfactual, no cost/headcount/defect comparison anywhere in either post (panel-confirmed). A timeline (12 weeks) is not a measurement. Corroborated only by press restating it. |
| 3 | Duplicate or sharpen? | **Nothing to sharpen.** Grep of `/boss`, `library/practices/*`, the shipped `/boss` skill: zero mentions of mobile, React Native, Flutter, cross-platform, or native (panel-confirmed). BOSS never recommended the thing Shopify is leaving. |
| 4 | Who serves / harms? | Serves a `returning-founder` weighing a mobile stack — as an *anecdote to read*, not a rule. Handed to `first-product` as a rule ("build it twice, agents make it cheap") it is harmful: it doubles surface for a founder whose stated risk is bloat ([[EVID-001]]). |
| 5 | Cost / ceremony | Adopting would mean giving BOSS a stack opinion it has deliberately refused. Heavier and off-thesis. |

## Verdict: REJECT
Recorded so the next "Shopify went native, should BOSS say something?" thread costs nothing. The article is
a real signal that agents are reaching *stack* decisions at a large org, and a founder may read it; it is
not a practice, and BOSS holds no recommendation it would revise. The one durable thing here is the
session's own catch: the first fetch summary **fabricated two quotes** from this article — recorded in the
inbox file and the session's K3.

## If REJECT / NOT-YET
- **Why not:** n=1 self-report with no measurement, against a principle that says BOSS does not pick stacks.
- **What would make it worth a second look (not a re-open condition — REJECT is final on this claim):** a
  second org with measured before/after, or a founder on BOSS asking the mobile-stack question, which would
  be an `/interview`-grade signal about BOSS, not about Shopify.

## Attribution
**Partly verified.** Author, date, timeline confirmed; the article's own causal sentence confirmed; the two
quotes this session first attributed to it **do not exist on the page**. Only the verbatim line above is
carried.

## Notes
- Prior related verdicts: none. Adjacent inbox item on spec-as-shared-artifact is the closest neighbour and
  is not the same claim.
- BOSS version when recorded: 0.314.0
