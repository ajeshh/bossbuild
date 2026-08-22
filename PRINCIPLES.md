# BOSS — Operating Principles

## The why (the problem BOSS exists for)

Founders can now build faster than they can validate. AI makes a polished prototype cheap — which
creates a new trap: confusing a **pseudo app** (an impressive demo with no proven pain, workflow fit,
willingness to pay, distribution, or reliability) with a **real business value app** (solves a painful
problem for a specific customer, fits a real workflow, creates measurable value, has a path to
distribution). BOSS is the guidance layer between those two states.

> **BOSS helps founders build faster without fooling themselves** — compressing the loop from idea to
> evidence while continuously checking the work against real pain, real workflows, real buyers, real
> economics, and real distribution. The goal is not more pseudo apps; it's real business value apps.

What that buys is narrower — and stronger — than "discipline wins." Disciplined validation doesn't
guarantee a win; it makes you **decide faster, including quitting faster** (Camuffo et al., 759-firm
RCT [EVIDENCE]). Cheap AI lowers the cost of *building*, not the cost of *being wrong* — so the cheaper
building gets, the more the loop matters, not less. BOSS's conscience exists to stop self-fooling, and
that has to include BOSS not overclaiming its own promise.

The six rules below are how that promise is kept.

---

The few rules that define what BOSS *is*. Everything else (modes, skills, the CLI) is in service of these.

## 1. Always scaffolding — pause to extract patterns

BOSS is always scaffolding, but scaffolding is the *motion*, not the goal. At every natural
breakpoint — a mode transition, a shipped feature, the third time the same work repeats — **pause
and sort the pattern two ways:**

- **UP** → into BOSS as a reusable **superset practice**. Every future project inherits it.
- **DOWN** → into the app as **core functionality**. It's product, not scaffold.

This bidirectional extraction is what makes the system compound: every project makes BOSS smarter,
and every app's core stays clean. `/boss-learn` is therefore a **two-destination router**, not a
one-way "promote to BOSS."

## 2. Just-in-time support, never premature ceremony

BOSS is a startup incubator: the right level of support shows up exactly when a project earns it,
and not before. A throwaway Quickstart idea should not carry a PM org; a Scale-mode product should
not be missing one. Modes (Quickstart → MVP → V1 → Scale) exist to make this graduated. Rules turn
on **at the right time**, per mode.

## 3. Nothing valuable gets locked into code

Anything reusable — design tokens, prompts, workflows, conventions — should live as **decoupled,
nameable structure**, not buried in implementation. Style is the canonical case: extract it into
tokens + a style guide the moment there's UI, so it stays evolvable and **prototypes consume the
same system the app does**. Enforced JIT (strict at V1; seeded as soon as UI appears). The test:
*could a prototype or a sibling project reuse this without copy-pasting code?* If not, it's locked.

## 4. Stack-neutral; stacks are learned, not assumed

BOSS assumes no tech stack. The first build decision picks one. Proven stack tooling is captured
via Principle 1 (UP) so the next project of that kind starts from it — stack profiles are an
*output* of the learning loop, not a pre-baked input.

## 5. Optionality by default — and BOSS doesn't hold the option

Defaults preserve future choices rather than foreclosing them: reversible scaffolds, stack picked at
the first build decision, snapshot-not-blueprint canvases. Decide late, on evidence.

**Where a choice is asymmetric, BOSS asks rather than assumes** — and names the asymmetry in *both*
directions. A permissive licence, once published, cannot be revoked; a project that was never opened
quietly stays closed. Both are real losses. Preserving optionality means the founder makes that call
out loud, not that BOSS picks the enclosing side and calls it neutral ([[DEC-011]]).

## 6. Humane before viable

The Humane Product Canvas is the spine of how BOSS pressure-tests an idea — who's served, what
tension, what promise, who could be harmed — *then* commercial rigor (riskiest assumption, weekly
experiment, willingness to pay) folds in. Viability never overrides the humane lens.
