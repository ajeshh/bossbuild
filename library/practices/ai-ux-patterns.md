---
id: PRACTICE-ai-ux-patterns
type: practice
owner: designer
status: active
host: stack-neutral
provenance: distilled from the 2026-06-20 AI-UX scan (Shape of AI, Microsoft HAX, Google PAIR, IBM Carbon, LangChain HITL, NN/g 2026, Apple HIG GenAI) — BOSS v0.49.0, IDEA-029 · dark-pattern checklist + humane alternatives added v0.82.0 (RVW-031, from CDT *Dark Patterns in AI Chatbots* 2026, CC-BY) · classic-web pattern families + regulatory teeth (effect-not-intent, symmetry-in-choice) added v0.95.0 (RVW-056/057, first /humane-refresh sweep, IDEA-042) · cohort & frontier patterns (accessibility, minors, agentic, algorithmic-management) + junk-fees teeth added v0.96.0 (RVW-059/060/061/062/063, sweep pass 2) · generated-code-injects-dark-patterns (Vaccaro CHI'26) + dev-tool metering surface + citation upgrades (sycophancy→*Science* 2026, DECEPTICON precise cite, EU AI Act/EDPB-3-2025/Amazon-Prime teeth) added v0.108.0 (2026-07-23 research sweep)
last_reviewed: 2026-07-23
review_by: 2026-10-21
curve: humane
---

# Practice — AI-native interface patterns (2026)

> **Where this sits.** [`design-system.md`](design-system.md) + the tokens discipline own how AI-built
> UI *looks*; this owns how an AI feature *behaves toward the person* — when it speaks, how it shows
> confidence, how it asks permission, how it recovers from being wrong. The 2024–25 rules (options-
> not-truth, undo/edit/regenerate, visible confidence, failure states) still hold; 2026 adds the
> patterns below for *plural, background, risk-tiered* agent work.

## 1. "Why this" — rationale grounded in the user's own inputs

When the AI makes a consequential choice, say *why*, in one line, **traceable to something the user
said or did**: *"Steering you to Quickstart because you said it's day one"* — not *"Quickstart is
best."* This is the cheapest trust surface and it doubles as teaching. Bound it (Google PAIR
*Partial Explanations*): explain when stakes are high or the result is surprising, not on every step.

## 2. Confidence is a register, not a number

Match how you express confidence to how reliable you actually are (HAX G2). Soft uncertainty → a
hedge phrase. Real precision → a number. Low confidence → *show more options* (the option count itself
is the signal — Google PAIR N-best). Don't paint one flat "confidence" everywhere.

## 3. Three interrupt registers: Notify / Question / Review

- **Notify** — FYI, no action needed (a fact surfaced; keep moving).
- **Question** — ask **one** sharp clarifying question instead of guessing.
- **Review** — propose a change and wait for a decision.

Name which one you're in. Most tools collapse everything into Review (approval fatigue) or Notify
(noise). (LangChain ambient agents.)

## 4. Risk-tier the gate; offer four decision verbs

Don't gate uniformly — gate by **loss type** (money / security-data / lost-work / irreversibility).
Low-stakes steps (a draft, a search, writing a new file) flow through; high-stakes get a stop. And
when you do stop, offer the full vocabulary, not just yes/no:

- **approve** · **edit-before-execute** · **reject-with-feedback** · **respond**

For a tool that writes files and configs, **edit-before-execute is the highest-value verb** — a
first-time founder wants to tweak, not just veto. (LangChain HITL; Shape of AI *Verification*.)

## 5. Progressive disclosure of the work

Show the verdict / result first; let the person expand to the reasoning, the plan, the tool calls
("Stream of Thought / Footprints" — Shape of AI). Default collapsed. A reviewable trail of *what the
agent changed* is part of this — don't act on someone's repo with no footprints.

## 6. Trust repair after a miss

When the AI gets it wrong, run a deliberate repair: **own it specifically** ("I got X wrong — here's
what I'll do differently"), and recover **asymmetrically** — trust breaks fast and rebuilds slow, so
reduce autonomy / ask *more* for a while after a miss. A user who's been burned wants more
confirmation, not less, regardless of project stage. (NN/g 2026; trust-calibration.)

## 7. Discernment — knowing when NOT to speak

The 2026 macro shift (NN/g) is automation → **discernment**: the best AI recedes into the background;
human direction, curation, and verification stay essential. *Staying quiet at the right moment is a
feature*, not the absence of one. This is the interaction-level statement of BOSS's whole conscience-
JIT ethos — name it so it's designed, not accidental.

## 8. Degraded-state honesty

When running degraded — model uncertain, on a fallback path, low confidence — *say so*, so the person
recalibrates. Treat "I don't know" as a first-class, well-worded output, not a failure to hide.

## 9. Generative UI — decide who holds the controls

When an agent *renders the interface itself* (not just emits text), the load-bearing question is how
much control the frontend keeps. A spectrum: **static** (the model fills slots in UI you designed —
safest) → **declarative** (the model picks from an approved component set + props) → **open-ended** (the
model emits arbitrary UI/markup — most power, highest stakes). Open-ended belongs in §4's irreversibility
tier: an injected or confused prompt can now redraw what the user sees and clicks. Default to the
least-open rung that still proves the bet; earn open-ended with a real reason, not convenience.
(CopilotKit/AG-UI 2026 — keep the judgment, drop the protocol.)

## 10. Memory is a reviewable object, not a black box

If the product *remembers* the person across sessions, that memory needs a control surface — **view /
edit / correct / delete / scope** what the AI holds about them. It's the §5 footprints principle extended
from *what the agent did* to *what the system knows*: wrong-but-invisible memory silently degrades every
future response and the user can't tell why. This pattern is also dogfood — BOSS is itself a
memory-carrying tool (`.boss/`, `MEMORY.md`, the venture brain), so it should hold the pattern it is an
instance of.

## Dark patterns — the manipulative inverse (recognize as you build)

Patterns 1–8 are the *good* shape; this is the named *bad* shape, so a founder can catch one **while
building it** — including ones that **emerge from the model** (training / fine-tuning / RLHF / system
prompts), not only ones designed on purpose. Sycophancy is the canonical emergent case — and no longer a soft claim: a controlled study (Cheng et
al., *Science* 2026) found sycophantic models causally reduce a user's willingness to repair a conflict
and *raise* their conviction they're right, while the user trusts them *more* — so the incentive to ship
it is real, which is exactly why it needs naming. Source: CDT,
*Dark Patterns in AI Chatbots* (2026, CC-BY) — 37 patterns in five families:

- **Data & memory exploitation** — default-sharing, disguised collection, privacy-zuckering, "just
  between you and us," difficult-to-delete, *safety-blackmail* (extracting more data under pressure).
- **Informationally misleading** — misrepresenting (a bot implying it's a therapist / "never
  hallucinates"), impersonation, hallucinations-as-truth, selective framing, reduced-friction +
  bad-defaults steering.
- **Autonomy compromised for engagement** — infinite-scroll/teasers, variable rewards, gamification
  (streaks) that prolong past intent.
- **False social/emotional connection** — **sycophancy**, playacting (fake memories/feelings),
  emotional manipulation via hyper-personalization, guilt / confirm-shaming when the user tries to
  leave, *targeting users when vulnerable*.
- **Coercive monetization** — pressured selling, fake social proof, bait-and-switch, sneaky
  purchases / disguised ads, paywalling memory or persona ("pay to keep your history").

**The humane alternative (CDT's "better design" — name the cost *and* point at the fix):** default
conversations to *end* (don't artificially prolong); make the social/emotional layer **opt-in** (offer
a strip-it-out default); give genuine delete/export controls (not convoluted); use **no
emotionally-charged language near an upgrade/purchase**; label paid/sponsored content plainly.

**Two judgment calls.** (1) A few patterns are dark *in isolation* → hard-name them (targeting the
vulnerable, guilt-on-exit, sneaky purchases); most are context-dependent → surface the tension, let the
founder choose (conscience-not-censor). (2) Because these **emerge**, test the *built* product, not just
the intent — `/red-team --humane` (sycophancy especially).

### Your AI writes the dark pattern *for* you (the generated-code surface)

There is a second way the model — not the founder — authors the dark pattern, and it's the one BOSS is
built to catch. Ask an LLM to generate an ordinary ecommerce component or a signup flow and it
*frequently ships a manipulative one unprompted*: a fake countdown, a pre-ticked opt-in, confirmshaming
baked into the decline copy — patterns nobody asked for, pulled from the average of its training data
(Vaccaro et al., *Deception at Scale: Deceptive Designs in 1K LLM-Generated Ecommerce Components*,
CHI 2026). So a founder can ship a dark pattern they never designed and never *saw*, because the model
wrote it into the markup. This is the sharpest case of "effect, not intent" — the intent wasn't even the
founder's. The defense: **read the generated UI for injected patterns, not just the founder's intent**
— exactly what `/red-team --humane` scans for. A vibe-coder is *more* exposed here, not less, because
they're least able to spot the pattern the model slipped in.

### The classic-web patterns an AI product inherits (RVW-056)

The CDT list above is *AI-chatbot-shaped*. But the moment a product grows an **account, a paywall, or a
checkout**, it inherits the dark patterns the web has named for a decade — and that's exactly where a
first-time founder ships one without knowing it has a name. Four families the chatbot lens omits (canonical
sources: Brignull's deceptive.design, Mathur et al. *Dark Patterns at Scale*, Gray et al.'s CHI-2024
ontology — pinned below, don't re-enumerate):

- **Obstruction** — making the exit artificially hard. *Roach motel / immortal accounts* (sign-up is one
  click; deletion is a support-ticket maze), hard-to-cancel, forced continuity. **Humane:** exit as easy as
  entry — one-click delete/cancel that matches the ease of sign-up.
- **Sneaking** — slipping in what the user didn't choose. Sneak-into-basket, hidden costs, **drip /
  partitioned pricing** (advertise part of the price, reveal mandatory fees at the end — FTC-named; ~20%
  higher spend when fees are hidden), forced enrollment. **Humane:** the all-in total **shown most
  prominently, before any commitment step** (the FTC Junk Fees Rule bar, RVW-062); nothing on the cart or the
  bill the user didn't pick.
- **Manufactured urgency & scarcity** — fake pressure. Countdown timers that reset after they expire, false
  low-stock counts, fabricated "12 people viewing this." **Humane:** real deadlines and real inventory only —
  if the urgency isn't true, don't manufacture it.
- **Interface interference / misdirection** — the UI steering the eye and the click. Visual interference,
  trick questions, confirmshaming (generalized beyond the exit), pre-ticked **bad defaults**. **Humane:** the
  choice you'd make for yourself is the visually-equal default; neutral wording; no shame.

**Effect, not intent (RVW-057).** A dark pattern needs no malice — California law (CCPA § 1798.140(l)) judges
it by its *effect* on the user's choice, not the designer's intent, so you can ship one **by accident** (the
checkout you copied, the deletion flow you never built). That's where the conscience earns its keep: it's
worth most catching the dark pattern the founder *didn't mean to build*.

### The cohort & frontier patterns (who the checklist above misses)

The lists above are mostly *who's-looking-at-a-screen*. Three more surfaces — a cohort, a population, and a
new actor — carry their own patterns. These are **conditional**: they surface when the product touches that
surface, not on every Quickstart (Principle #2).

- **Accessibility / exclusion-by-design (RVW-059).** An inaccessible flow — an unlabeled element, an
  inaccessible CAPTCHA, an unsubscribe buried low in keyboard-nav order, a pre-ticked box invisible to a
  screen reader — is **"effectively deceptive" to anyone who can't perceive or escape it**, *even when
  unintentional* (the sharpest case of "effect, not intent"). It also *amplifies* every pattern above:
  blind/low-vision users via AT, and ADHD/neurodivergent users who recognize far fewer of them. **Humane:**
  **WCAG is the floor, not the ceiling** — label every interactive element, give cancel/unsubscribe
  equal-or-higher nav priority, offer non-visual auth, and test the flow's *deceptiveness under assistive
  tech*, not just its compliance. (CHI/CSCW '25.)
- **Minors & vulnerable-by-design (RVW-061)** — *when the product may reach minors.* Three enforced rules:
  **price in real currency and disclose odds** (multi-tier virtual currency that hides real-money cost is the
  loot-box dark pattern — FTC's $20M Genshin action); **ship addictive-design features OFF by default for
  minors** (streaks, autoplay, push — the EU's named list; a clean extension of Humane defaults below); and
  **age assurance, not age-gate theater** (a clickable "I am 18" is not age assurance). Pro-privacy nudges
  *toward* the safer default are explicitly fine. (FTC; EU DSA minor guidelines 2025; UK Children's Code.)
- **Agentic dark patterns (RVW-060)** — *when your product has an agent that acts for the user.* Two
  directions. (a) **Your agent as perpetrator:** commitment/purchase without explicit consent, over-broad
  permission grants, opaque autonomous decisions. **Humane:** scope permissions narrowly, surface what it's
  about to do, and confirm before money/irreversibility — this is §4's risk-tiered gate pointed at agent
  actions. (b) **Your agent as victim:** an agent browsing the web is manipulated by these same dark patterns
  *more* than a human (70%+ vs 31%), and *worse* as models scale — see
  [`agent-security.md`](agent-security.md) (recognition ≠ protection; don't rely on "tell the agent to watch
  out"). (Stanford DECEPTICON — Cuvin, Zhu & Yang, arXiv 2512.22894; OWASP Agentic 2026.)
- **Algorithmic management (RVW-063)** — *when the product scores, ranks, or pays people.* Opaque,
  unpredictable scoring/pay the person can't understand, plus gambling-style bonus/quest/surge incentives
  ("algorithmic gamblification"), is the worker-facing dark pattern. **Humane:** a transparent, predictable
  formula with disclosed factors and no gambling mechanics. (HRW *The Gig Trap* 2025 — documented harm; EU/UK
  platform-work rules are the maturing teeth.)
- **Your own tools' dark patterns, recreated in your product (RVW pending).** *When your product has
  usage-based pricing or ships a dev tool.* The AI-coding tools taught the anti-pattern by example: opaque
  token/credit metering (the June-2025 Cursor repricing that forced a public apology + refunds), credits
  that don't roll over, telemetry on by default with a buried opt-out. That's Obstruction + Sneaking +
  asymmetric-choice, aimed at a developer — and a founder who lived it as a *user* re-ships it as a
  *maker* without noticing. **Humane:** a visible live meter, a real spend cap, rollover, telemetry
  opt-in with a symmetric off (§ 7004 again). If you price by usage, show the usage. (Cursor pricing
  apology, 2025; developer-telemetry-default reporting, 2025–26.)

## Humane defaults — the build-time inverse (ship the fix, keep the door, record the crossing)

The checklist above is what to *catch*; this is what to *build by default* — friction-as-ethics, done
right. **Ship the humane choice as the default:** privacy on, consent opt-in, the metric hideable, the
escape hatch already wired, the action reversible. The humane path becomes the path of least resistance
because it's *already done for you* — not because anything else was blocked.

**The asymmetry is the whole discipline, and the easy way to get it wrong.** You *remove* friction from
the humane path; you **never add** friction to the harmful one. Deliberately slowing, burying, or
complicating a choice you disapprove of is a dark pattern aimed at a goal you happen to like — and
manipulation is manipulation regardless of whose side it's on. Means matter; you can't dark-pattern your
way to a humane product. Sovereignty is non-negotiable: **keep every door equally open.** The concrete,
testable bar is **symmetry in choice** (codified in California's 11 CCR § 7004): the privacy-protective path
must be no longer, harder, or slower than the less-protective one — opt-out in as few steps as opt-in, "Decline
All" as prominent as "Accept All." If the good door takes more clicks than the bad one, you've already failed.

**So what about when the founder chooses the dark pattern anyway?** Don't block it; don't sabotage it —
make it *accountable*. The conscience names the cost once, then offers to **record the crossing** as a
`DEC-NNN` (the *why* and the *when*). Not a penalty, not a gate — a memory. Later, future-them (or a
cofounder, a buyer, a regulator) can ask *"why did we do that, and when?"* and trace it back. That record
is the antidote to humanity eroding *invisibly*: the thousand small decisions stop accreting in the dark
the moment each crossing is defaulted-humane, kept-open, named, and logged.

The quiet bonus: a humane default *teaches*. The founder building on it absorbs the decent pattern without
a lecture — caught, not taught, baked into the scaffold instead of spoken by the conscience.

## Canonical references (pin the designer here; don't reinvent)

- **Shape of AI** (shapeof.ai) — the working pattern vocabulary; the "Governors" category maps ~1:1
  onto BOSS's conscience moments. Primary.
- **Microsoft HAX** — 18 evidence-based guidelines (G1/G2/G11/G15/G17 = when to speak vs. stay quiet).
- **IBM Carbon for AI** — disclosure primitives ("AI label" + explainability popover).
- **Google PAIR** — calibrated trust / explainability (frozen ~2023 but still the best on this).
- **Apple HIG Generative AI**, **OpenAI Apps SDK UX**, **Anthropic "building effective agents"** —
  vendor-current; show-the-plan / checkpoint-before-irreversible / refine-and-feedback.
- Community catalogs (e.g. agentic-design.ai) — route through `/vet` before adopting, not `/boss-learn`.

**Dark-pattern canon (the named-pattern superset — pinned, not enumerated here):**
- **deceptive.design** (Harry Brignull) — the canonical pattern library + the "deceptive patterns" taxonomy.
- **Mathur et al. (Princeton, 2019)** *Dark Patterns at Scale* — the empirical 7-category / 15-type scheme.
- **Gray et al. (CHI 2024)** *Ontology of Dark Patterns Knowledge* — 64 types harmonized from 10 taxonomies.
- The standing refresh of this canon lives in [`/humane-refresh`](../../.claude/skills/humane-refresh/SKILL.md)
  + its [watchlist](../../docs/research/watchlists/humane-lens.md) (IDEA-042), not in this list.

**Regulatory teeth (reference, not legal advice — BOSS doesn't give legal advice):** dark patterns are now
named and penalized — California **CCPA/CPRA** (effect-not-intent; symmetry rule § 7004), the **EU AI Act**
Art. 5(1)(a)/(b) (binding ban on manipulative/vulnerability-exploiting AI; prohibitions applicable Feb
2025, penalties enforceable Aug 2025; the EC's *Guidelines on Prohibited Practices* draw the line at
*subverting autonomy*, not personalization itself; fines to €35M / 7% turnover),
**EDPB** Guidelines 03/2022 (six-category consent taxonomy) **+ 3/2025** (the DSA×GDPR interplay —
consent obtained via a dark pattern is invalid *regardless of the formal click*), the **FTC** 2022
report (four harm-based categories) + the **FTC Junk Fees Rule** (2024, drip-pricing/total-price) + the
**$20M Genshin loot-box action** (2025) + the **$2.5B Amazon Prime settlement** (2025 — the modern
roach-motel/obstruction enforcement), the **EU DSA minor-protection guidelines** (2025) and **UK Children's Code** (statutory),
and **ADA / EU Accessibility Act** (accessibility as a floor). *Caveat: the FTC "click-to-cancel" Negative
Option Rule was vacated by the 8th Circuit in 2025 — verify status before relying on it (RVW-064).* A pointer
for "is this regulated?", never a compliance gate.

## Altitude / anti-rot

These are **runtime heuristics the conscience + designer apply**, not a static checklist to freeze
into one skill (the RVW-001 anti-pattern). Refresh them on the model/host curve (`IDEA-014`). On a
Quickstart, most of this is silent default; it surfaces as the project earns interaction complexity
(Principle #2). See `IDEA-029` (interaction layer) + `IDEA-010` (style/tokens layer).
