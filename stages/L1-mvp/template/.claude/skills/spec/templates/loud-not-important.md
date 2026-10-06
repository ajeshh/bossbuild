# `/spec` — the loud ≠ important check (bundled resource)

> Loaded **on demand** from `SKILL.md`, post-launch only, when this FEAT traces to a user request.

Restraint (`SKILL.md`, Moment #4) is the *pre-launch* question — *is this worth building at all?* This is its
**post-launch sibling**, and it fires on a different symptom: **the source of this FEAT is a user
request.** When the project has real users, the trap flips from "no evidence" to "the wrong evidence" —
building around **the loudest few** while the **silent majority** (who never wrote in) and the **quiet
churn** (who just left) go unheard. Loud is not the same as important; the users who complain the
articulately are rarely the users who pay.

**Gate — surface this only when BOTH hold** (otherwise skip it entirely; it's not a checklist):

1. **There are real users** — a `--feedback` register with entries (`docs/feedback/` or the register
   `/idea --feedback` writes), an EVID ledger, or a live analytics read (`/health`). Pre-launch there
   is no vocal minority yet, so this stays silent — restraint (`SKILL.md`) is the only check that fires.
2. **This FEAT traces to a request/complaint**, not to a founder-named bet — the source is a feature
   request, a friction complaint, or "a few users asked." (If the source is the canvas's *riskiest
   assumption* backed by broad or commitment-grade evidence, this isn't the loud-minority trap — stay
   silent; that's `drift`'s territory, not this.)

When it fits, **surface BOSS's nudge in your own voice** (cohort-aware; read `.boss/config.json`
`cohort`; lean Fitzpatrick-plain). Do the judgment before speaking — silently read the source request +
the `--feedback` register (or EVID ledger): is this a *pattern across your active core*, or **one loud
voice** the register itself says to treat as a `stated-pain` EVID, not a spec? Then say, in one spare
line, the specific version of:

> **How many users actually asked for this — and are they your active core, or a vocal few?** A request
> is evidence of *a* pain, not a mandate to build (it's a `stated-pain` EVID — the weakest grade; the
> quiet majority's *observed behavior* outranks a loud request). Before you spend the build on it, two
> cheaper reads: what does **the silent majority** — the users who *didn't* write in — actually *do*
> (`/health` — behavior over volume)? And what is your **quiet churn** telling you — the people who
> left without a word are the loudest evidence there is, and this feature probably isn't why (talk to
> them: `/interview`; the `--feedback` register's churn entries)? If those still point here, build it
> with conviction. If they point elsewhere, you were about to serve the few at the expense of the many.

Point at `/health` (what behavior says), `/interview` (talk to the silent / the churned), the
`--feedback` register (is the request a *pattern* or a one-off), and `mentor-founder` (is this the right
bet). Cohort decides framing — returning-founder gets the blunt "the loudest user isn't your median
user — who are you actually building for?"; first-product gets "one person asking loudly can feel like
everyone; here's how to check" taught plainly; indie-hacker gets the calm "serve the quiet ones who
stayed, not just the loud one who's leaving anyway"; domain-expert gets the who-is-actually-harmed lens
on over-serving an edge case. **Suggestive, once, never a gate** — the founder may have every reason to
build it (a strategic account, a load-bearing workflow); the nudge just makes the silent majority
*visible* before the build, and recording the reason is the honest close. **Humane note (PRINCIPLE #6):
protect the silent majority who actually drive the value** — the anti-pattern is a roadmap captured by
whoever shouts, which quietly degrades the product for everyone who doesn't.

_(This fires on a *single* request at decide-time. The fuller version — weighing *all* the signal, behavior
vs. requests, across the whole register into a small bet-list + a mandatory NO-list — is **`/roadmap`**. Run
that when you're choosing among many candidates, not just reacting to one.)_
