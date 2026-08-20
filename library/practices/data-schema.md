---
id: PRACTICE-data-schema
type: practice
owner: db-architect
status: active
host: stack-neutral
provenance: written 2026-08-11 (v0.142.0) to close the coverage gap named in the 2026-07-30 craft-staleness audit — the knowledge lived ONLY inside the `db-architect` agent prompt (V1) and the migrations section of `scalable-architecture.md`, so nothing could sweep it and no mode below V1 could see it. Sources - CVE-2025-48757 (Lovable/Supabase RLS class), the MoltBook 1.5M-credential exposure, OX Security 2026 (62% of AI-built apps ship a critical vuln), Postgres RLS docs, Kleppmann (DDIA) on schema evolution. Sibling of `agent-security.md` (same adversary) and `testing-with-agents.md` (the negative path is where this gets caught).
provenance_public: Written to close a gap where the knowledge lived only inside one V1 agent's prompt and a migrations section — so nothing could sweep it and no earlier mode could see it. Sources: CVE-2025-48757 (the Lovable/Supabase RLS class), the MoltBook 1.5M-credential exposure, OX Security 2026 (62% of AI-built apps ship a critical vulnerability), the Postgres RLS documentation, and Kleppmann (DDIA) on schema evolution.
last_reviewed: 2026-08-11
review_by: 2026-11-09
curve: threat
---

# Practice — Data & schema (the layer an agent gets functionally right and dangerously wrong)

> **Why this is a `threat` practice, not a craft one.** Almost everything about schema design is
> durable engineering. **One thing isn't:** the single most common way a vibe-coded app leaks its
> users' data is a schema an AI generated correctly and secured not at all. That has an adversary,
> so this doc moves on the threat curve.

## The headline failure: RLS the AI never configured

The shape, precisely, because the precision is the useful part:

1. The founder asks for a table. The agent writes `CREATE TABLE` and it works.
2. The agent **does not** write `ALTER TABLE … ENABLE ROW LEVEL SECURITY`, and does not write the
   policy that would go with it.
3. The platform (Supabase, Neon, PostgREST, a generated GraphQL layer) exposes that table over an
   auto-generated API — which is the feature you chose it for.
4. **Any authenticated user can now read every row of every other user's data** by asking for it.
   Change a user ID in a request and the data comes back.

This is CVE-2025-48757 and the class behind the 2025–26 exposures (~25k secrets found across
vibe-coded sites; a 1.5M-credential incident). OX Security put **62% of AI-built applications
shipping a critical vulnerability** in 2026.

> **Why it survives every test you'd think to write:** the app *works*. Logged in as yourself, every
> screen is correct. RLS-off is not a functional defect — it is a **missing security property**, and
> no happy-path test, no amount of clicking, and no screenshot will ever show it. The bug is
> invisible from inside the product.

**The agent knows what RLS is.** Ask and it will explain it correctly. It simply doesn't *apply* it
unprompted, because nothing in "build me a table for user notes" asks for it. **Knowledge in the
model is not a control in your app.**

### The three things that actually fix it

- **Enable RLS at table creation, in the same migration.** Not later, not "before launch." A table
  that exists without a policy for one afternoon is a table that can be exposed for one afternoon —
  and "before launch" is exactly the deadline that gets skipped. **Deny by default, then add
  policies**, so a table you forget to think about is closed rather than open.
- **Write the negative test.** Log in as user A, request user B's row, **assert you get nothing**.
  This is the single highest-value test in a multi-tenant app and it takes ten minutes. See
  [`testing-with-agents`](testing-with-agents.md) — it is step 4 there for this reason.
- **Verify from outside the app.** Hit the auto-generated API directly with a normal user's token, not
  through your UI. Your UI filters by user because you told it to; the API doesn't unless the
  *database* says so. **Test the layer the attacker uses, not the layer you built.**

## Schema decisions are one-way doors

Most code an agent writes is cheap to change. **Schema is not** — once there is production data, a
schema decision is a migration, a backfill, and a window where both shapes must work. That makes it
one of the few places a solo founder should slow down deliberately.

Worth a `/decide` → `DEC-NNN` before the agent writes the migration:

- **The tenancy model.** `tenant_id` on every table + RLS, or schema-per-tenant, or database-per-tenant.
  This is the hardest thing to change later and the easiest to get wrong early. Default to
  **`tenant_id` + RLS** until you have a reason not to.
- **Identity of a row.** UUID vs. sequential integer — sequential IDs in a URL are enumerable, which
  is how the RLS hole above gets *found*.
- **Soft vs. hard delete.** Ties directly to what you promised users about deletion, and to
  regulation. `harm-taxonomy` has the humane half.
- **What you store at all.** The cheapest way to not leak something is to not have it. An agent will
  happily add columns you never asked for; every one is a liability with no offsetting value unless
  a feature needs it.
- **Whether a row remembers *when* it happened.** A `created_at` on user rows and core object rows is the
  one-way door nobody notices closing — it's not a leak or a migration risk, it's *lost history*. Add the
  column in month six and you can query forward from month six; the first five months are gone, and with them
  every cohort, activation rate, and retention curve you might later want. Two lines of schema now buys the
  entire measurement past ([`analytics-for-ai-products`](analytics-for-ai-products.md) — "leave the seam").
  Note this is the **opposite** direction from the bullet above: store *less* of the user, but do store *when
  their own rows happened.* Timestamping a record the user asked you to create is not surveillance.

## Migrations are the reviewable history

Never let an agent mutate a live schema directly. **Every change is a migration file** — ordered,
reviewable, revertible, in the repo. That's the same artifact-over-action argument as
[`git-workflow`](git-workflow.md), and it's what makes a schema change something a second person can
check. Expand-migrate-contract for anything with live traffic: add the new shape, move the data,
remove the old — three deploys, never one. Fuller treatment in
[`scalable-architecture`](scalable-architecture.md).

## Reviewing a schema an agent wrote

A short read, not a ceremony:

- **Is RLS on, with a policy, for every table holding user data?** (Ask this first. Every time.)
- **Would a wrong `WHERE` clause leak or destroy?** Those queries need a test, not a code review.
- **Are there columns nobody asked for?** Agents pad schemas with plausible fields — `notes`,
  `metadata`, `is_admin`. Delete what no feature reads.
- **Do the constraints exist in the database, or only in the app?** An agent will validate in
  application code and leave the column nullable. The database is the only layer that can't be
  bypassed by the next endpoint the agent writes.
- **Indexes on what you actually query** — and only those. An agent will index generously; every
  index is a write cost.
- **Are secrets in the schema?** API keys or tokens in a table is a different exposure from a
  `.env` leak, and `secrets-guard` does not see it. See [`agent-security`](agent-security.md).

## Altitude / JIT

**Quickstart:** none of this. A prototype with no users and no real data doesn't have a data layer
worth governing — and demanding one is the ceremony that makes founders quit.
**MVP, the moment real user data exists:** RLS on + the negative test. That's it — two things,
non-negotiable, and they're 90% of the risk. (Plus `created_at` on user + core rows — listed under the
one-way doors above, but it belongs *here* in effort: it costs one line, needs no decision, and is the only
item on this page that gets strictly more expensive every day you don't do it.)
**V1:** the tenancy `DEC`, migrations discipline, the review list, `db-architect`.
**Scale:** retention, PII classification, access review.

## The test
*If someone changed a user ID in a request right now, what would come back?*
If you don't know the answer with certainty, that's the next thing to find out.

## Related
[`agent-security`](agent-security.md) (the same adversary, the app-you-ship surface) ·
[`testing-with-agents`](testing-with-agents.md) (the negative path) ·
[`scalable-architecture`](scalable-architecture.md) (migrations at scale) ·
[`ship-it-live`](ship-it-live.md) (the pre-flight where this gets caught last) ·
[`analytics-for-ai-products`](analytics-for-ai-products.md) (why `created_at` is the seam you cannot backfill).
