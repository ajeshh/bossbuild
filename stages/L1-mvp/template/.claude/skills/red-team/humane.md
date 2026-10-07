## `--humane` — test the built product for deceptive patterns

`/red-team --humane` turns the conscience's humane lens into evidence. **It is a conditional
battery, not a fixed list** — read the catalog, run the probes for the surfaces this product
actually has, and say which ones you skipped.

### 1. Read the surfaces before you probe

```
boss craft deceptive-patterns --shape <the tags from .boss/config.json>
```

**Read `shape` from `.boss/config.json` first** — `/canvas` writes it there, and using it is what
stops this skill asking a founder the same question every run. Shapes are tags, not buckets — an
edtech mobile app with a chatbot is all three. Only if the key is absent, infer from the repo and
**say what you inferred** (and offer to write it back, so the next run is cheaper). Then for each
surface that shape gives you:

```
boss craft deceptive-patterns --surface <surface>
```

Each row carries what it looks like, the honest version, and its teeth. **Probe the rows; do not
re-type them here.** The catalog is the single source — it grows, and this skill grows with it
for free.

> **If the founder's answer is that the rule behind a row is outdated, don't wave it through and
> don't overrule them.** A rule can be a safety floor or a moat, and a `teeth` citation cannot tell
> you which. Run the three-question test in `boss craft deceptive-patterns --prose` (§ *The other
> limit*) — who benefits from the rule as written, who bears the cost if they're wrong, and would
> that person agree. **Question two is the tell: reform absorbs its own downside, rationalisation
> exports it.** Three good answers and the row is inert — offer to record it as a `DEC-NNN` with the
> answers in it. This is a test, not a permission slip, and it is not a gate either way.

### 2. Split the battery by what you can actually observe

**Split by surface, never by tag.** `[model-written]` means *nobody decided to build this — the
model did*. It says nothing about **where** the pattern lives, and it sits on rows in every lane
below, including seven of the nine `ai-voice` rows. Routing on it skips the behavioural battery.

- **Behavioural — prompt it.** The `ai-voice` and `agent-actions` surfaces, **every row, tagged or
  not.** These are yours alone: no walk of shipped markup can see sycophancy. Does it cave when
  pushed? Resist ending? Lean on rapport near the upgrade? Claim to be a therapist or to never
  hallucinate? Act without consent?
- **Markup — read it.** The `generated-markup` surface, plus the *visible* rows on `consent-ui`,
  `signup-and-identity` and `checkout-and-pricing` — default state, button weight, decline copy.
  `/design-review after` §8 owns the routine walk; cover them here only if it hasn't run.
- **Invisible — instrument it.** `tracking-and-telemetry` has almost no UI. You cannot see a pixel
  by looking at a page. Open the network tab, read the outbound requests, and check what the
  third-party tag actually sends on a sensitive route. `/trust` §3.5 owns this surface — verify it
  was done, and **if it wasn't, run it here.** "Deferred to `/trust`" is not a result.
- **Everything else — just probe the row.** `cancel-and-delete`, `notifications-and-engagement`,
  `social-proof-and-claims`, `device-permissions`, `install-and-update`, `metering-and-credits`,
  `scoring-and-pay`, `bystanders`, `content-and-moderation`. No special method and no other owner:
  read the row, look at the product, answer honestly.

### 3. Rules

- **Name what you did not test, every time** — the standard `--paths` already holds. If a surface
  didn't apply, say which and why. A clean report that silently skipped six surfaces is the
  failure this section exists to prevent.
- **Suggestive surface.** It names the cost and points at the honest version; it never blocks the
  founder's choice (conscience-not-censor). If they keep the pattern, offer to write the `DEC-NNN`
  — one line, written *for* them.

**Cohort note.** Never "skip this skill." The correct reduction for a founder with no AI in the
product is *skip the behavioural half; run the account, checkout, consent and data surfaces
regardless* — those are the ones that exist in every product that has users, and they are where a
first-time founder ships a pattern they never designed.
