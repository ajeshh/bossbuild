---
id: RVW-077
type: verdict
owner: product-lead
status: recorded
created: 2026-08-20
verdict: ADAPT
route: UP library/practices/design-system.md (content half) + DOWN stages/L1-mvp (style-guide template, /design-tokens-init, content-terminology-guard)
---

# RVW-077 — BOSS ships a design system with no content half

## The claim
- **Source:** `docs/research/inbox/content-design-the-unshipped-half.md` (2026-08-20 design sweep,
  self-authored from a web research pass — see the conflict note below)
- **Core assertion:** BOSS's design layer governs how things *look* and says nothing about what they
  *say*; content has the same three-layer shape as tokens (voice → tone → string) which maps onto
  BOSS's existing principle → guideline → rule ladder; and in an AI product most user-facing copy is
  generated at runtime, which the content-design field does not cover.
- **Inbox file:** `docs/research/inbox/content-design-the-unshipped-half.md`

## ⚠️ Two process failures this verdict has to record about itself

**1. This vet is retrospective.** The content half **already shipped** — v0.167.0 (style-guide
sections, `CLAUDE.md` voice inlining) and v0.168.0 (`content-terminology-guard`, content passes in
`/design-review` / `/ux-check`, `ai-failure-states` runtime copy). BOSS's stated order is
capture → `/vet` → `/boss-learn`. That order was inverted: three releases were built on an unvetted
claim. A retrospective verdict is a **weaker check than a prospective one** — the work exists, which
biases toward approval, and the honest move is to name that rather than pretend the grade is clean.

**2. The claim is self-authored.** The same agent wrote the capture and is now vetting it. `/vet`'s
value is adversarial distance and there is none here. The mitigation applied: grade only what a
*primary* source or BOSS's own filesystem proves, and treat every secondary number as quarantined
until read. That is a partial mitigation, not a substitute — **a genuinely independent pass on this
claim is still owed.**

Both are recorded because the verdict log is BOSS's memory of how decisions were actually made, not
how they should have been.

## Attribution (step 3) — PARTLY VERIFIED, with one quarantine

| Attributed claim | Status |
|---|---|
| DESIGN.md covers visual design only, no voice/tone/content | ⚠️ **SUBSTANCE VERIFIED — QUOTE FABRICATED (corrected 2026-08-24).** The sentence *"The specification covers only visual design"* **does not exist** in [spec.md](https://raw.githubusercontent.com/google-labs-code/design.md/main/docs/spec.md); re-fetched raw, and the file is unchanged since 2026-07-27, so it was never there. What the primary *does* say: *"DESIGN.md is a self-contained, plain-text representation of a design system. It **defines the visual identity** of a brand and product…"* — and `voice`, `tone`, `content design` appear **zero** times. The negative result stands on scope, not on the quote. 🔴 **A fabricated quotation, stamped "read directly", inside the attribution step that exists to prevent exactly this.** |
| BOSS's own content gap (one substantive hit; `voice-keeper` in the gitignored dev workspace, shipping to nobody) | ✅ **Verified against BOSS's filesystem** — the strongest grade available for a claim about BOSS itself. |
| zeroheight *Design Systems Report 2026*: tokens 56%→84%, 8% "very stable", 56% using AI / 15% living up to hype | ❌ **DOES NOT VERIFY — quarantined.** Taken from search-result summaries; **the report body was never read.** Vendor-run survey, self-selected respondents (~300), enterprise-skewed. Must not be cited in any shipped doc. |
| "Practitioner consensus" on voice-for-AI (Glean, WordStream, UX Content Collective, uxwritinghub, Eric Wong) | ❌ **No respected practitioner verified.** These are vendor blogs and course sellers — Glean sells enterprise search, uxwritinghub sells a workshop. This is an n=1-blog tier wearing the word "consensus." |

**Effect on the grade:** strip the borrowed authority and the *external* case is blog-grade. What
survives is (a) a primary-verified negative result and (b) BOSS's own dogfood asymmetry. **The claim
earns on internal evidence, not on the field.** The capture's framing implied otherwise; it shouldn't.

## Rubric

| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | **No outright contradiction**, but **#2 (JIT, never premature ceremony) is the live tension.** A six-row tone table and a terminology list at MVP is real authoring weight. Doesn't kill the claim; it constrains the shape. |
| 2 | Evidence grade | **Split.** Internal gap: filesystem-verified (highest available). External field: blog/vendor-grade with the headline numbers quarantined. Net: **earns on the dogfood signal, not the literature.** |
| 3 | Duplicate or sharpen? | **Sharpens — and the capture overstated the hole.** `ai-ux-patterns.md` §6 (trust repair) and §8 (degraded-state honesty) *already are* content rules; the style-guide template already carried a `Voice in the interface` section. The capture said "one line," which was wrong and was corrected mid-session. **Overstating a gap is how unearned building gets justified** — noted as a pattern to watch, not a one-off. |
| 4 | Who serves / harms? | **Serves:** `eng-builder`, `returning-founder`, `vibe-virtuoso` (will use a terminology table immediately), `domain-expert` (regulated language is load-bearing for them). **Harms:** `first-product` / `vibe-coder-newbie` — a tone-by-context matrix before they have shipped anything is ceremony they cannot yet evaluate, and the failure mode is a filled-in-because-asked table that steers nothing. |
| 5 | Cost / ceremony | **Heavier.** Style guide 8 → 10 sections plus an expanded voice section; one more hook. Mitigated (placeholders, JIT gate, skeleton-rows-are-silent) but **not eliminated**. |

## Verdict: ADAPT

The gap is real and the strongest evidence for it is BOSS's own — **it built `voice-keeper` for
itself and ships founders nothing**, which is PRINCIPLE #1's dogfood signal pointing straight at a
hole. The three-layer mapping onto the existing ladder is genuine composition rather than a new
framework, and the runtime-copy insight is a real edge the field is not covering.

But it does not earn ADOPT. The external evidence is blog-grade with its headline numbers
unverified; it **sharpens rather than fills** (the capture overstated the hole); and rubric Q4 lands
on a cohort split that the skill says caps a claim at *"ADAPT-with-scoping at best."*

Consistent with the two nearest design precedents — [[RVW-014]] (aesthetic ambition) and [[RVW-052]]
(the sameness/indigo problem) — **both ADAPT, both for the same reason: outside design advice is
sound in substance and wrong in dose for a green founder.**

## If ADAPT — what must change from what shipped

1. **🔴 Cohort-scope the content layer. This is the required modification and it is MISSING.**
   `/design-tokens-init` is meticulously cohort-aware for *tokens* (SHOW / OFFER / OVERRIDE-FRIENDLY
   / PLAIN-LANGUAGE COACH / RIGHT-SIZED) and **the content sections inherit none of it.** Per Q4 that
   is the difference between ADAPT and REJECT. Concretely: `first-product` / `vibe-coder-newbie` get
   **terminology only** — one table, the checkable one — and the voice/tone matrix is deferred, not
   presented-and-skipped. `eng-builder` / `vibe-virtuoso` get the full set offered tersely.
   `domain-expert` gets tone-for-high-stakes first.
2. **Quarantine the zeroheight numbers permanently.** They appear in no shipped doc today — verified.
   Keep it that way unless someone reads the report.
3. **Keep the honest bound already shipped** — *there is no regex for off-voice; terminology is the
   exception.* That line is what keeps this layer from overclaiming, and it's the reason the guard
   was built narrow. Do not widen it.

Route: **UP** the practice half (`design-system.md`), **DOWN** the runtime half (already in
`stages/L1-mvp`). Hand item 1 to `/boss-learn`.

## Notes
- Prior related verdicts: [[RVW-014]] (ADAPT), [[RVW-052]] (ADAPT) — the design-advice precedent.
  No prior verdict has ruled on content design; this is the first.
- **Owed:** an independent pass on this claim by someone who didn't write it.
- BOSS version when recorded: 0.170.0

---

## 🔴 INDEPENDENT PASS — 2026-08-24. The debt in `RESUME.md` is discharged.

`docs/RESUME.md` carried *"An independent pass on RVW-077 is still owed — self-authored, so `/vet`'s
adversarial distance was absent."* Run cold by a reviewer with no stake in the outcome.

**Verdict: ADAPT upheld — but this document did not stand as recorded.** The conclusion survives an
independent NO-biased pass, because the internal dogfood evidence re-verifies and the shipped shape is
genuinely cohort-scoped and JIT-gated. What did not survive is the **evidence table**:

1. 🔴 **The one external "verified from primary" receipt was a fabricated quotation** — corrected in
   the table above, and confirmed independently against the raw file.
2. ⚠️ **The filesystem-grep receipt is false.** Re-running the capture's own grep against the pre-arc
   tree (`7ead4b4^`) returns **one** hit — `ux-designer.md:65`, a *Steve Krug book citation*. The line
   the capture quotes as the hit (`:48`, empty-state copy) **matches none of the six pattern terms**;
   it was found by reading and attributed to the grep. **The direction is strengthened, not weakened**
   — the only regex hit is a book title, so pre-arc content discipline was even thinner than claimed.
3. ✅ **The zeroheight quarantine was right, and is now a refutation.** Read 2026-08-24: **147
   respondents, not ~300**; the 8%/34%/10% stability split matches exactly; the token and AI-hype
   figures do not match as captured. Correctly kept out of every shipped doc (grep clean).
4. 🔴 **`v0.168.0` claimed the guard was "Verified across seven cases including the negatives" — and
   no test existed.** Fixed 2026-08-24: `test/content-terminology-guard.test.js`, 8 cases, locking the
   JIT gate, the copy-only scope boundary, the comma-split banned list, and fail-open.
5. 🔴 **Structural, and larger than this verdict:** `.gitignore:41` ignores all of `docs/research/`,
   so **every RVW has no git history.** The RVW-016 lesson — *shipped text must match the record that
   authorized it* — is **currently unenforceable for every verdict BOSS holds**, and a
   `boss remove`-class accident would destroy the ledger unrecoverably (the 2026-08-21 mechanism).
   **Proposed, not done: un-gitignore `docs/research/verdicts/`.** Verdicts carry no secrets. Founder decision.
6. **Drift check (the RVW-016 lens):** nothing approved failed to ship. One unauthorized elaboration —
   cohort scoping shipped for **six** cohorts where the verdict named three — but it extends the same
   rule rather than adding a claim, so it is not the RVW-016 failure. The verdict is **partially
   ratifying** (its route line reads off the shipped diff) **with one genuine tooth**: it demanded
   v0.171.0's cohort scoping, which did not exist at verdict time and cost real work. A purely
   reverse-engineered verdict does not generate work.

**Also caught and fixed in the same pass:** the shipped style-guide template said *"personality in
themicrocopy"*, and three **shipped** practices told founders to hand copy to `voice-keeper` — an
agent that ships to nobody ([[dev-workspace-described-as-shipped]] leaking into new text). Both fixed.

