# `/design-review` — the pattern set (bundled resource)

> Loaded **on demand**. Write this to `docs/design/PATTERNS.md` the **first time `/design-review`
> runs**, seeded with the rules below that actually apply to this project.

## What a pattern is, and why this layer exists

A design system is usually described as tokens plus components. That is its floor and its walls; it
is not the thing that makes two screens feel like one product. **The middle layer is patterns.**

| | Example | Lives in |
|---|---|---|
| Token | `color.action.primary` | `DESIGN_TOKENS.md` |
| Component | `Button` | `COMPONENTS.md` → the library manifest |
| **Pattern** | *a destructive action names the consequence, never "are you sure"* | **here** |
| Flow | signup → verify → first project | the FEAT spec |

A pattern is **a recurring decision with a rule attached**. It is what Material and HIG mostly *are* —
not a palette and not a component dump, but "here is the situation, here is what to do, here is what
not to do." Components without patterns give you a consistent-looking product that behaves
differently on every screen.

## Why it is born here and not in `/design-tokens-init`

A pattern set written before anything has been designed is a catalog nobody consults — the same
reason `/design-tokens-init` refuses to hand a `first-product` founder a voice-and-tone matrix. **A
pattern named while reviewing a real screen is grounded in a decision that actually came up.** So
this file is created by the first design review and grows one review at a time.

The rule for adding: **the same decision comes up twice.** Once is a choice; twice is a pattern.

## Seeding it honestly — what BOSS actually holds

Seed only rows that apply to this project. Two of the three groups below are BOSS's own rules,
already enforced or required elsewhere and merely **scattered as prose** — collecting them here is
the point, not new doctrine.

**1. State and content rules (always seed these — they apply to every product).** From the five-state
requirement and `STYLE_GUIDE.md`'s content half.

**2. AI-interaction patterns (seed only if the product is AI-mediated).** From
`boss craft ai-ux-patterns` — ten of them, with their sources. Take the ones whose situation this
product actually has; a pattern for a surface you do not ship is noise.

**3. The anti-patterns (always).** From `boss craft deceptive-patterns` — the deceptive shapes the
humane lens refuses. They belong in the *Anti-pattern* column, where they are useful, rather than in a
separate document nobody opens while designing.

> ⚠️ **Say the gap out loud rather than papering it.** BOSS holds interaction patterns for AI
> products, the five-state requirement, and the content rules. **It does not ship a general-UI pattern
> catalog** — forms, navigation, tables, onboarding — and it should not pretend to. For those, the
> `designer` agent's cited lens is the source (Nielsen's heuristics, Norman on affordances, Krug on
> clarity), and **your own product will grow better ones than a generic catalog would give you.**
> That growth is what `/extract` and `design-pattern-loop` are for.

```markdown
---
id: patterns
type: design
owner: designer
status: active
updated: {{DATE}}
---

# Patterns — {{PROJECT_NAME}}

> **Open this before designing a screen.** A pattern is a recurring decision with a rule — one level
> above a component, one below a flow. Add one when the same decision comes up **twice**.

## Always

| Pattern | The situation | The rule | Anti-pattern |
|---|---|---|---|
| **Five states** | any interactive element | default / hover / active / disabled / empty+loading are named before code, not discovered after | shipping the happy path and meeting the rest in a bug report |
| **Empty state** | any list, table or feed before there is data | say what to do next, and make the action reachable from here | "Nothing here yet." · an illustration with no action |
| **Error copy** | any failure a user can see | say what to do next, not what failed | "Oops! Something went wrong." |
| **Destructive confirm** | delete, revoke, cancel, downgrade | name the consequence and whether it can be undone | "Are you sure?" |
| **Terminology** | every user-facing string | one word per concept, from the table in `STYLE_GUIDE.md` | `team` here, `org` there, `workspace` in the email |

## If the product is AI-mediated

| Pattern | The situation | The rule | Anti-pattern |
|---|---|---|---|
| **Why this** | the model made a choice for the user | ground the reason in the user's own input, not in model-speak | a confidence badge with no reason |
| **Confidence as register** | output the model is unsure about | change how it speaks — hedge, offer, ask — rather than printing a number | "87% confident" |
| **Risk-tiered gate** | the model is about to act | gate by what is lost if it is wrong; offer approve / edit / reject-with-feedback / respond | one uniform "Continue?" on everything |
| **Degraded-state honesty** | the model is slow, rate-limited, or failing | say which, and what still works | a spinner that never resolves |
| **Trust repair** | the model got something wrong and the user saw it | own it and reduce autonomy asymmetrically — faster to lose than to regain | a silent retry |

## Element families — seed only the ones this product has

Three families come up in almost every product, get decided by accident, and are expensive to
re-decide later. **These are not a catalog of elements** — BOSS does not ship one and shouldn't (see
the note above). They are the **decisions each family forces**, which is a different thing: a catalog
tells you what a dialog is, and these tell you what you have to settle before you build your third
one.

### Inputs — where most of the friction in a product lives

| Pattern | The situation | The rule | Anti-pattern |
|---|---|---|---|
| **Label, not placeholder** | any field | a visible label that stays visible | placeholder-as-label — it vanishes on focus, and a screen reader may never announce it |
| **Validate on leave, not on keystroke** | any field with a format | let them finish, then tell them | an error appearing on character three of an email address |
| **The error sits with the field** | a field that failed | next to the input, naming the fix | one summary at the top that doesn't say which field |
| **Mark what's optional** | a form with both | mark the *optional* ones, not the required ones | a form where everything has an asterisk |
| **Never lose what they typed** | a submit that fails | the values survive the round trip | a cleared form after a server error |

> Luke Wroblewski's forms work is the depth behind this; `designer` already carries him as a lens.
> **The one that costs the most and looks the smallest is the last row** — a founder rarely tests the
> failing submit, and a user who retypes a form once does not do it twice.

### Data display — the one AI-generated UI gets worst

| Pattern | The situation | The rule | Anti-pattern |
|---|---|---|---|
| **Zero / one / many / far too many** | any list, table or feed | all four are designed, not just "many" | a table that's beautiful at 12 rows and unusable at 4,000 |
| **Numbers align right, text aligns left** | any table with figures | so digits line up and you can compare down a column | centred numbers |
| **One sort by default, and say which** | any ordered list | the order is stated, not implied | an order the user has to reverse-engineer |
| **Truncate with a way back** | long values in a cell | show the truncation and let them get the whole thing | silent clipping |

> **The reason this family is the worst under AI generation:** a model composes a table from the shape
> of the data it was shown, which is almost always the happy middle. Zero rows and far-too-many rows
> are where real users live, and both are invisible in the example.

### Icons — decide the set before the second one

**An icon set is a dependency**, which makes this a seed-that-scales decision rather than a style
choice: swapping sets later means touching every use site, and mixing two sets is visible to anyone
even if they can't say why.

- **The set:** <one, named — and it's a dependency, so it belongs in the same conversation as any other>
- **Sizes:** <the two or three that exist. Not "whatever the component needs">
- **Icon alone or icon plus label:** <when each. An icon-only button needs an accessible name either way>
- **What an icon never does:** <e.g. carry meaning nothing else carries — see the accessibility floor>

## Ours — patterns this product grew

The most valuable section, and it starts empty on purpose. A row lands here when the same decision
has come up twice in a review, or when `/extract` names a shape the code kept repeating.

**These carry an id — `PAT-1`, `PAT-2` — and the seeded rows above do not.** Two reasons, and the
second is the real one: a review finding can then say *"violates `PAT-3`"* instead of re-arguing the
rule, and **a pattern this product invented is a different kind of thing from one it inherited.**
The seeded rows are BOSS's; these are yours, and they are the ones worth showing a designer.

| ID | Pattern | The situation | The rule | Anti-pattern | First seen |
|---|---|---|---|---|---|
| **PAT-1** | *(your first one lands here)* | | | | |

## Refused — and why

A pattern considered and rejected is a decision. Keeping the row is what stops you re-litigating it
in six weeks, and stops a well-meaning agent proposing it again.

| Pattern | Why refused | On |
|---|---|---|
| streak counter | engagement-shaped, not value-shaped — we measure graduation, not return visits | {{DATE}} |
```

## After seeding

- **`designer` reads this before proposing interaction**, the same way it reads `COMPONENTS.md`
  before proposing a component.
- **`/ux-check` checks shipped UI against it** — a pattern with no enforcement is a preference.
- **At V1 `/design-library` renders it** into the rules section, with the do/don't pairs shown side
  by side rather than described. A rule you can *see* is one you stop arguing about.
- **`/extract` promotes a repeated shape into the "Ours" table**, and a pattern that proves out
  beyond this project is a `/boss-learn` candidate for the shelf it came from.
