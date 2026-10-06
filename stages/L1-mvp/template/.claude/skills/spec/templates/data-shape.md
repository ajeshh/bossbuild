# `/spec` — shape the data before the migration (bundled resource)

> Loaded **on demand** from `SKILL.md`, for any FEAT that creates or changes stored data.

**Design schema before code.** Once real users have entered data, schema changes stop being edits
and start being migrations with a rollback plan. The cheapest moment to get the shape right is
while the FEAT is still prose.

It's a step rather than someone to consult, because a step fires and a door has to be opened. For
any FEAT that creates or changes stored data, **you** answer these in the record from what the FEAT
already says. Ask the founder only what you can't infer, usually *who can read a row*, and put it in
`/spec` step 3's one message rather than a new round:

- **What entities does this need, and why is each its own thing** rather than a field on an
  existing one?
- **Which columns are queried?** Index those. Don't index speculatively.
- **What's the narrowest type that holds the data?** A type is documentation. So is every
  NOT NULL / UNIQUE / CHECK / foreign key — they're cheaper in the database than in app code.
- **Who can read a row, who can write it, and which column proves it?** (usually an owner or
  tenant id). **A table whose answer is "the app checks" is unprotected the moment anything else —
  an agent, a script, a leaked key — talks to the database.** If this project reaches the database
  from the client with a publishable key, that rule is the only thing between your users and the
  internet, and the model does not write it unless asked. This is CVE-2025-48757 (303 endpoints,
  170+ apps) and MoltBook (1.5M tokens, 35K emails) — a **data-model** failure, not a deploy one.
- **Is the change additive or destructive?** Destructive needs a migration plan and a rollback,
  and deserves a `DEC` before the migration is written. Mark each call **reversible** / **costly to
  reverse** / **one-way door** so you know where to slow down.
- **AI-specific:** if an LLM's output drives a write, **schema the output** — free-form prose in a
  column is poison. Mark model-generated rows as model-generated. Keep eval data out of prod tables.

`schema-guard` (opt-in: `boss hooks enable schema-guard`) catches the RLS half at edit time; `/ship` and
`/red-team` catch it at deploy time. **Both can only catch it — this step is where it gets
prevented.** Full practice: `boss craft data-schema`. For the judgment calls — one table or two,
will this query scale, is this premature — ask `mentor-architect`.
