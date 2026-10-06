# `/spec` — the `docs/competition/` reads (bundled resource)

> Loaded **on demand** from `SKILL.md`, only when this FEAT is the differentiator, or a rival already ships the feature you've decided to build.

**Two reads, and the second is narrower than it looks.**

*When this FEAT is the differentiator:* the rival's **`why they might win`** line, held against the
acceptance criteria — *does what I'm about to build actually beat their reason?* *When a rival
simply also has this feature:* that rival's **`## Where it breaks`** section, read into **What
"wrong" looks like**. Their users' complaints about this exact thing are the cheapest failure
modes you will ever get, and they are the ones your first users will hit too.

*And, for a feature you have already decided to build:* the rival's **`## How they do it`** entry
for this feature, if `/comp-eval` captured one — the flow, the defaults, what they ask the user
for and what they do automatically, the limits. **This is design reference, not parity.** The
decision to build X was made upstream, in `/roadmap` or by you; what you are reading now is how
the people who already shipped X shaped it, and what their users therefore expect. Read it into
the **Flow** section and into the *Assumptions* you would otherwise have guessed.

**The line, and it is about timing, not content.** Reading how rivals implement a feature
*after* deciding to build it sharpens the spec. Reading their feature *list* to decide *what* to
build is the parity trap — and that read belongs to `/roadmap`, where the NO-list and the EVID
grade outrank *"a rival has it."* Their users' **praise** stays out of *what wrong looks like*,
which the template defines as failure modes, not missing features. For an ordinary FEAT — a
settings toggle, a fix, internal plumbing — **skip all of this and stay silent.** Opening a
competitor file to spec a copy change is the ceremony that gets the whole step ignored.

⚠️ **Carry the file's age with you.** Every cell in that table has a `checked` date, and
`field-stale-loop` fires when the field hasn't been touched in ~90 days. A pricing figure from
March is not a fact about today, and a FEAT argued against a stale rival is argued against a
memory. If the rows are old, say so in the FEAT's **Assumptions** rather than letting the number
pass as current.
