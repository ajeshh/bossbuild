---
id: RVW-086
type: verdict
owner: product-lead
status: recorded
created: 2026-08-24
verdict: ADAPT
route: DOWN stages/L0-quickstart/template/.claude/skills/prototype (lines 21, 24-29, 110-114)
sources:
  - https://www.svpg.com/build-to-learn-vs-build-to-earn/
  - https://ptgmedia.pearsoncmg.com/images/9780201835953/samplepages/0201835959.pdf
  - https://www.veracode.com/wp-content/uploads/2025_GenAI_Code_Security_Report_Final.pdf
  - https://simonwillison.net/2025/Mar/19/vibe-coding/
  - https://pablo.rauzy.name/dev/naur1985programming.pdf
---

# RVW-086 — replace `/prototype`'s "restart it, don't grow the sketch" mandate

## The claim
- **Source:** session record §4.3, already 3-vote-narrowed.
- **Core assertion:** the mandatory-restart remedy is unsupported; replace it with a comprehension
  question + a security question, keeping the sketch as the spec.

## 🔴 Two lineage findings that reframe the whole verdict

1. **The restart mandate PREDATES its supposed authority.** It shipped at **v0.55.0** (`0fc129d`,
   "/prototype refinements") — *before* [[RVW-016]] was applied at v0.67.0 (`a4b9fda`).
   **No verdict ever authorized it.** It is unvetted text that the later drifted blockquote then
   appeared to corroborate. *(This corrects the session record's read that the rule was built on the
   fabricated clause — it was already there, and got retroactively dressed in a misattributed
   authority. Worse, not better.)*
2. **RVW-016's approved change was ONE LINE** — *"this is build-to-learn — a sketch to think with;
   building it for real is build-to-earn, the `/spec` path."* What shipped at v0.67.0 is a five-line
   blockquote that swapped *"a sketch to think with"* → *"a throwaway"* (importing Brooks-1975 framing
   the verdict never contained), stamped **"(Marty Cagan, 2026)"** on Jeff Patton's phrase, and added
   causal claims never approved. **Shipped text asserting an authority its authorizing record never
   contained** — the [[checkers-state-intents-they-dont-enforce]] pattern, in a new flavour.

## Rubric
| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | **The CURRENT text does — #5** (a blanket rebuild mandate forecloses the founder's choice on zero evidence) and **#2** (unconditional ceremony regardless of what the sketch earned). The proposal's *security question* contradicts **#2**. The ADAPT form contradicts none. |
| 2 | Evidence grade | **Comprehension:** thought-leadership (Willison's personal rule) + foundational essay (Naur) — coherent, zero outcome evidence. **Security:** the *risk* is [EVIDENCE] (Veracode 45%, flat across 150+ models), but there is no evidence *this question at this seam* is the mechanism. And no controlled study exists in **either** direction on rewrite-vs-harden — so BOSS may not mandate *keep* any more than *rebuild*. The call stays the founder's (#5). |
| 3 | Duplicate or sharpen? | 🔴 **Security half: DUPLICATE ×4** — `/spec`'s negative path as a required security property (spec/SKILL.md:159–164), `/red-team --paths`, `/ship`'s pre-flight (ship/SKILL.md:69–74), and the `schema-guard` hook. **Sunk.** **Comprehension half: not duplicated anywhere** in `stages/` or `library/` — genuinely new. **"Sketch as the spec" would weaken `/spec`**, whose FEAT/acceptance-criteria/smoke machinery is what graduation buys. |
| 4 | Serves / harms? | Removing the mandate serves everyone — the `vibe-coder-newbie` whose sketch got 4 real users is currently told to discard a working thing on a retracted 1975 citation. But *"can you explain what this does?"* asked of `first-product`/`vibe-coder-newbie` is a **shame-gate they definitionally cannot pass honestly** — it blocks graduation or teaches them to answer untruthfully, the exact self-fooling BOSS exists to stop. Survives only reframed as an **offer**. |
| 5 | Cost / ceremony | Deleting the mandate is **subtraction** (EVID-001 honoured). The two-question replacement as specified is **net addition**. Honest fix: subtract the mandate, keep the diagnosis, add one reframed clause, add nothing else. |

## Verdict: ADAPT
The diagnosis is right and now primary-verified — the restart mandate is unvetted v0.55.0 text resting
on a misattributed frame and a retracted citation, contradicting Principle #5 — so the status quo
cannot stand and REJECT is unavailable. But the proposed remedy fails its own rubric: the security
question duplicates four downstream surfaces the founder is about to walk into, and the comprehension
question as phrased shames the two beginner cohorts at their proudest moment.

## If ADOPT / ADAPT — exact replacement wording

**SKILL.md:24–29** (attribution repair, restoring RVW-016's approved framing):
> **The frame, plainly (Jeff Patton's phrase, via Marty Cagan, 2026):** this is *building to **learn***
> — a sketch to think with, to discover whether the idea's worth it. Building it *for real* is
> *building to **earn*** — the `/spec` path, a build you'll stand behind. `/prototype` is
> build-to-learn; `boss unlock mvp` → `/spec` is build-to-earn.

**SKILL.md:110–114** (the remedy):
> - **Don't quietly become the MVP.** The real failure isn't abstract — it's the sketch that picked up
>   4 real users and is now getting auth and a database bolted onto throwaway code nobody meant to
>   keep. When the sketch earns a real build, graduate it deliberately — `boss unlock mvp` → `/spec` —
>   with the sketch in hand as the tangible reference for what to build. Keep or rebuild is your call,
>   piece by piece; the honest test for any piece is whether someone can say what it does — and *"walk
>   me through it"* is a one-minute ask, not a failing grade. The sketch's shortcuts around auth and
>   other people's data are exactly what the deliberate path exists to catch. Fast to *see*;
>   deliberate to *keep*.

**Required sibling sweep (same file):** SKILL.md:21's magic-circle wall *"it gets thrown away when it
earns a real build"* repeats the mandate → *"it graduates deliberately when it earns a real build."*

## Attribution
- **Patton credit: VERIFIED** against the primary — *"product coach Jeff Patton… coined the phrase."*
  The `(Marty Cagan, 2026)` tag is a misattribution as charged.
- **Brooks retraction: VERIFIED** via the publisher's own TOC (ch. 19 headings). ⚠️ The sentence
  *"This I now perceive to be wrong"* is **secondhand only** — do not ship it in quotes.
- 🔴 **"Prototype as spec": DOES NOT VERIFY in the cited primary.** Not found in
  `build-to-learn-vs-build-to-earn` or `product-discovery`. It may exist elsewhere in Cagan's corpus,
  but **the "keep the sketch as the spec" clause may not ride on it** — which is why the shipped
  wording above says *"tangible reference"*, not *"the spec"*. The exact failure class `/vet` exists
  to catch, caught on its own input.

## Notes
- **Falsifier:** if a founder session shows a kept sketch whose unexplained parts survived `/spec` +
  `/red-team` into production harm, the keep-or-rebuild default gets re-vetted. That is the
  observed-behavior evidence neither side currently has.
- [[RVW-016]] needs an addendum recording the v0.67.0 drift.
- BOSS version when recorded: 0.222.0 (in flight, peer-held).
