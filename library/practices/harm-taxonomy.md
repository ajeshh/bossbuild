---
id: PRACTICE-harm-taxonomy
type: practice
owner: mentor-founder
status: active
host: stack-neutral
provenance: distilled via /vet RVW-045 from Anthropic's Unified Harm Framework (5 dimensions) + Ada Lovelace Institute's advanced-AI-assistant harms (4 relationship-harms). Re-homed from a BOSS-local agent edit into a shippable practice per the mentor-architect boundary verdict (2026-06-20) — the humane lens is cross-cutting, so it belongs in a practice every mentor + the conscience can cite, not inside one agent. BOSS v0.84.0.
last_reviewed: 2026-08-20
review_by: 2026-11-18
curve: humane
---

# Practice — Harm taxonomy (name the axis, don't improvise)

> **Where this sits.** The humane lens (Principle #6) is *cross-cutting* — it belongs inside every
> mentor, the conscience, and the canvas's Risks & Harms cell, not behind one agent's door. This is the
> shared vocabulary they all reason against, so "who could this harm?" gets a checklist instead of a
> vibe. Its product-design twin is the catalog in [`deceptive-patterns.md`](deceptive-patterns.md).

"Who could this harm?" is sharper reasoned against *named axes*. Three complementary lenses — run a
choice past all of them before you say "no harm":

## Five harm dimensions (Anthropic, Unified Harm Framework)

**physical · psychological · economic · societal · individual-autonomy** — each weighted by
*likelihood × scale*. "Individual autonomy" maps straight onto BOSS's attention/agency/dignity language.

**Keep `physical` reachable.** It is the dimension most likely to be listed and never used, because
most deceptive patterns land on autonomy or economics. It becomes live the moment a product can
affect where someone *is* or what enters their body: location sharing, family plans, "who viewed
you", meeting a stranger, a device in the home, dosing or health guidance. If your product has one
of those surfaces, assume an intimate-partner-violence threat model and check the account-recovery
and shared-account flows first — those are the abuse route, and they are usually built by someone
thinking only about lockouts.

## Four relationship-harms of personalized AI (Ada Lovelace)

**manipulation · emotional dependence · anthropomorphism · overreliance** — the diffuse,
relationship-level harms conventional product-safety thinking misses, and the ones most live for a
founder building a companion / affective AI product. The evidence has hardened: sycophancy — telling the
user what they want to hear — was shown to *causally* raise emotional dependence and reduce a user's
willingness to repair a real-world conflict, while the user trusts the model *more* (Cheng et al.,
*Science* 2026). So these are measured harms, not soft worries.

## The third axis — the person who is not a user

Both lists above ask what happens to **the user**. Neither has an axis for the person who never
signed up and never agreed to anything: the harvested contact, the face in an uploaded photo, the
second party on a recorded call, the name in someone's notes, the ex-partner findable through a
location feature, the candidate scored by a hiring tool.

That gap is not academic — it is the fastest-growing product shape going (meeting notetakers alone),
and it is the one harm a founder reasoning honestly about *their users* will still miss, because the
person is by definition not in the room. **Name them as their own axis:** who is in your data who
never chose to be, and what recourse do they have?

The paired pattern rows live at `boss craft deceptive-patterns --surface bystanders`.

## How to use it

- **mentor-founder / `/canvas`:** at the Risks & Harms cell, walk all three — name the *worst-served*
  person, not an abstraction. The canvas's six surface questions are the fast way in; question 1 is the
  bystander axis and question 2 is `physical`.
- **The conscience:** when a moment fires on a harm, name *which axis* it's on (specific beats "this
  seems bad").
- **The founder's product:** pair with `deceptive-patterns.md` (the catalog + `boss craft deceptive-patterns --shape <what they're building>`) and `/red-team --humane`.
- **Reflexively — BOSS's own voice:** anthropomorphism / overreliance discipline BOSS too. The "seasoned
  hand who doesn't need the credit" resists para-social pull, performed warmth, and being leaned on as an
  oracle.

## Altitude / JIT

Not a wall on a Quickstart. The conscience surfaces the relevant axis JIT; the full taxonomy is the
reasoning *behind* a humane nudge, not a checklist shoved at a day-one founder (Principle #2).
