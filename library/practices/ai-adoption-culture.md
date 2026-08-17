---
id: PRACTICE-ai-adoption-culture
type: practice
owner: mentor-humane (with mentor-talent)
status: active
provenance: distilled via /vet RVW-038 from Stanford WORKBank / Human Agency Scale (arXiv 2506.06576, 2025) · Amy Edmondson, psychological safety · Ethan Mollick, "secret cyborgs" (2024) · BetterUp Labs × Stanford "workslop" (HBR 2025). Numbers graded per docs/research/SOURCES.md two-lane rule. BOSS v0.80.0; feeds IDEA-037. Sharpened via /vet RVW-073 (2026-08-17) with the 2026 workslop follow-on (OSF preprint 10.31234/osf.io/5f78h_v1, n=962, 2026-02-05) — [EVIDENCE]-pending, associational; the restructure that claim proposed was REJECTED (the spine was already here).
last_reviewed: 2026-06-20
review_by: 2027-06-20
curve: craft
---

# Practice — AI adoption culture (bring AI to a team without breeding resentment)

> **The shape of the risk.** A founder who forces AI on a team top-down gets the opposite of what they
> wanted: people **hide** their AI use, **ship each other sloppy AI output**, and quietly **resent** the
> mandate. The failure isn't the tool — it's the rollout. *(That last line was asserted here for a year;
> the 2026 workslop follow-on is its first evidence — sending workslop was **more common among** workers
> with high trust in AI, low agency over their own AI use, an org mandate to use it, and low psychological
> safety. n=962, preprint, self-report: those are **associations, not causes** — the study cannot say the
> mandate produced the slop. Note what the four are, though: §1 and §2 of this practice, standing next to
> §4.)* The whole point of this practice: a small
> founding team adopts AI so people **opt in**, not comply. (This is the humane lens turned on the
> founder's *own* team — BOSS has to walk it, not just preach it.)

## 1. Automate what's *wanted* — name the Red Light (the Human Agency Scale)

Stanford's WORKBank survey (1,500 workers, 844 tasks) found a clean pattern: people welcome having
**drudgery** automated and **fiercely guard** creative and relational work. The dangerous zone is the
**"Red Light"** — tasks AI is *capable* of but workers *don't want* automated. Automating into the Red
Light is exactly how you breed resentment. *(Damning aside: ~41% of YC startups were building into the
Low-Priority + Red-Light zones — automating the capable-but-unwanted. [EVIDENCE], though the YC figure
is a mapping estimate.)*

The **Human Agency Scale** (H1 = AI alone → H5 = human essential throughout) is a shared vocabulary for
*how much* human stays in a task. Use it as a question, not a verdict:

> Before you automate a teammate's task: **is this Green Light (they'd be glad to lose it) or Red Light
> (capable-but-unwanted)?** If Red Light, the agency cost is the story — name it, don't just ship it.

## 2. Make it safe to not know AI (psychological safety)

Edmondson's work is gold-standard: psychological safety is the strongest predictor of team learning,
and high-performing teams admit **more** gaps, not fewer. AI adds a sharper edge — admitting "I don't
understand AI" can read as a **job-survival** risk, not just embarrassment, especially under a mandate.
*(The AI-specific extension is 2025 commentary, [THOUGHT-LEAD]; the underlying psych-safety research is
[EVIDENCE].)*

For a two-person team the load-bearing question is concrete: **can your non-technical cofounder say
"I'm lost on this" without losing face?** The moves:

- Model it from the top: "I don't know this either — let's figure it out." A founder who pretends
  fluency teaches everyone else to fake it.
- Pair safety with **high standards** — it's not niceness or lowered bar; it's the condition where
  people can tell the truth *and* be held to good work (the Edmondson correction, [[RVW-035]]).

## 3. Kill the secret-cyborg dynamic — reward honest use

Mollick named it: when the rules **punish**, organisations fill with **"secret cyborgs"** — people who
quietly automated their own work and won't tell anyone. The result is hidden gains and zero shared
learning. (Corroborating signal: roughly **half** of desk workers say they'd be uncomfortable telling
a manager they used AI — it "feels like cheating." [THOUGHT-LEAD/vendor], directionally consistent.)

The move: make surfacing AI use **safe and rewarded**, not merely permitted. Share what's working out
loud, both directions. *(In a BOSS team this is exactly what the shared craft commons — `/practice` /
`PRAC-NNN` — is for: a discovery one cofounder makes becomes one the other inherits, with attribution
as a pointer, never a scoreboard.)*

## 4. The stakes — workslop erodes trust *between cofounders*

BetterUp × Stanford ("workslop," HBR 2025, n=1,150): ~40% of workers received AI output that *looks*
done but isn't in the last month, costing ~2 hours of rework each — and, the part that bites, recipients
rated the **sender** less trustworthy (42%), less intelligent (37%). *([EVIDENCE], vendor-co-authored —
treat the dollar figures as illustrative, the trust-erosion as solid.)* Bad AI use doesn't just waste
time; **it costs you your team's respect.**

The 2026 follow-on adds the half that points *at you*. Everything above is written from the receiving
end; the sending end is where a founder actually stands. **52.7% admit sending** some — and **55% of
people who received it got it from a manager or supervisor**, with **85% saying it damaged their trust in
leadership.** *(n=962, preprint, self-report — directionally consistent with the 2025 figures above.)* On
a two-person team that arithmetic is unkind: the person with the most leverage to send workslop is the
founder, and they're the person least likely to be told. *(That last clause is BOSS's inference, not a
finding — but ask yourself who on your team would tell you.)* So the norm points **down**, not just
sideways:

> **"Would I be proud to hand this to my cofounder?"** AI output is a draft *you own*, not a thing you
> forward.

*(Why "high trust in AI" belongs on that list: it rhymes with the **competence gate** — AI advice
amplifies the judgment you already have, and helps least whoever can least grade it ([[RVW-039]],
[`conscience-voicing`](conscience-voicing.md)). Uncalibrated trust looks like the shared shape. The two
studies measure different things, so treat it as a rhyme worth noticing, not a mechanism worth citing.)*

## 5. How to run it — the cofounder AI consent + norms conversation

Not a policy doc. A short, explicit conversation, early, revisited as the craft changes:

1. **Map the zones together** — what AI genuinely helps with (Green Light) vs. what you keep human
   (Red Light). Disagreement here is the useful part.
2. **Agree it's safe to be lost** — "I don't know this AI thing" is a normal sentence on this team, and
   we share what we each learn.
3. **Set the no-workslop norm** — own your AI output before it reaches anyone else.
4. **Revisit on a cadence** — the frontier moves; last month's "AI can't do this" may be wrong now
   (the model-recalibration discipline, team-scoped — ties to `/practice` staleness and IDEA-014).

## Altitude / JIT (Principle #2)

- **Solo founder → dormant.** There's no team to adopt to; don't surface it.
- **Surfaces when a second person joins** — a cofounder, a first hire, a first contractor. That's the
  trigger, not a calendar.
- **Never a mandate.** Forcing humane AI-adoption would be its own irony. The conscience may surface a
  Red-Light tension; it never picks the answer for the team (the conscience-vs-censor line —
  [[conscience-voicing]]).

## Handoff — for the IDEA-037 founding-teams build

> **This is a reviewable starting draft, not the final word.** It carries the *inheritable knowledge*;
> the teams build (IDEA-037 / FEAT-021) owns the concrete wiring. Recommended, for that work to weigh:
>
> - A conscience **Red-Light moment** — when work suggests automating a teammate's task, name the agency
>   tension ("you *can* automate this — does your team *want* it?"). This is a *new hook moment* (new
>   detector + eval cases), deliberately left out of this routing to avoid touching the conscience gate
>   from a parallel session.
> - The **cofounder consent + norms conversation** (§5) as a step in team onboarding / the `boss team`
>   flow.
> - **mentor-the-team (slice 5)** cites this practice as its source for the AI-adoption coaching.
> - [[RVW-035]] (Edmondson psych-safety, NOT-YET) finds its home here — fold it in when slice 5 lands.
