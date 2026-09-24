# `/design-tokens-init` — the later guard offers (bundled resource)

> Loaded **on demand** from `SKILL.md`, when a guard's condition first holds (index rows, a `features/` directory, a terminology row). Don't load it otherwise.

- **Offer `component-reuse-guard` when the index has real rows.** The index made *reuse first*
  checkable; this is what makes it a **boundary**, and it closes the one honest weakness of the index
  itself — nothing noticed a component written without consulting it.

  > *"Your index has components in it now. Want `component-reuse-guard` on? When a component gets
  > written that isn't in the index, it hands Claude the rows it should have compared against and
  > asks the actual question — reuse, adjust, or new? It fires once per new component, never on an
  > edit to one you already have, and it stays silent until this index exists."*

  **Why it earns a hook when a prompt rule doesn't:** writing a new file is easier for a generating
  model than reading an existing one and widening it, so *create* is the path of least resistance and
  the default silently lands there. The cost arrives later and one reasonable decision at a time —
  `Button`, `CTAButton`, `PrimaryButton`. Same JIT gate and same drop-it-if-declined rule as the
  others.

- **Offer `ui-boundary-guard` when the layout becomes layered** — the day a `features/` directory
  appears beside `ui/` or `components/`. The one-way import rule in CLAUDE.md is a filter until
  then; this is its boundary, and it reads paths rather than syntax so it needs no stack-specific
  linter:

  > *"You've got `features/` next to `ui/` now. Want `ui-boundary-guard` on? When a write adds an
  > import that points the wrong way — a system component reaching into a feature, a feature reaching
  > into another's internals — it names the crossing and the usual fix. Silent on every import that
  > flows down."*

- **Offer the terminology guard the same way — but only once a terminology table has real rows.**
  Voice and tone can't be checked by a regex and this hook doesn't try. **Terminology can**, because
  it's a word list:

  > *"You've got a terminology table now. Want `content-terminology-guard` on? It watches the
  > strings your UI actually shows and flags a word the table rules out — `org` when you decided on
  > `team`. Copy only; your variable names are your business."*

  Same JIT gate as the token guard: **a skeleton table is not a decision**, so the hook stays silent
  until at least one real row exists. Same rule if they decline — drop it, don't re-ask.
