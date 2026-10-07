# `/design-library` — when a designer joins (bundled resource)

> Loaded **on demand** from `SKILL.md` when a designer joins the work, or the founder asks how the
> library hands off to one or to a design tool. A typical generate or `--check` run never opens it.

## When a real designer shows up

The library is the handoff artifact, and it's already built. A designer gets a **URL, not a repo
checkout** — foundations, rules, and every component with its states, all in a form they can react to
without installing anything.

Two seams worth naming, in order of how real they are:

- **Tokens are two-way — on the token layer, and by a path that depends on the plan.** Tokens are
  structured data with stable names, which is why this is the one layer where design-tool sync
  actually works. `docs/design/tokens.json` is DTCG (`/design-tokens-init` writes it always); a
  designer imports it with a tokens plugin on any plan, or through the tool's own API on an
  enterprise plan — don't promise a native import. Their DTCG export comes back through `--check`,
  diffed per token.
- **Components are one-way, each direction, by a different mechanism.** Design→code mapping is
  mature. Code→editable-design-file round-trip is **not** well established — treat any claim that it
  is as unproven until you've watched it work on your own components.

**If the host offers a design-system sync, know what it actually wants before promising anything.**
The `@dsCard` first-line marker this skill writes is the right convention and matches. **The rest is
not the same artifact**, and saying otherwise would be the overclaim this practice keeps making:

- A host sync runs **its own converters** over a **component-explorer or package layout** — the real component
  library — and emits a bundle (`_ds_bundle.js`, a `styles.css` `@import` closure, a per-component
  directory of preview/source/types/prompt files, and a content-hash anchor for incremental re-syncs).
- This skill emits a **human-readable gallery**. One page, no build step, opens from the filesystem.

So they are **complementary, not interchangeable**: the gallery is what a person looks at; the sync
bundle is what a design tool consumes. Don't present one as the other, and **don't build a sync
engine, a hosting surface or a card index** — that's the host's job, and building a second one is how
this skill becomes the thing it exists to prevent.

> The useful convergence: a host sync reads your **real components**, and so does this. Both work for
> exactly the same reason — element-shaped components in a conventional layout. That's the
> *component boundaries* row of the seed-that-scales test, paying off twice. A codebase of
> page-shaped components has nothing for either one to read.

## Handing it to a designer

The library **is** the handoff artifact, so the brief is mostly assembly. When a designer joins —
contract, fractional, or a friend doing you a favor — generate `docs/design/HANDOFF.md` alongside it:

1. **What this product is** — one line from the canvas Promises cell. The brand anchor, not a pitch.
2. **What's decided and why** — the 3–5 principles with their tradeoffs. A designer who doesn't know
   *"calm over engaging"* was a decision will helpfully propose engaging.
3. **What's fixed vs. open** — the accessibility floor and the five-state requirement are **not**
   negotiable; type, color and spatial composition mostly are. Say which is which up front, or you'll
   relitigate it in review.
4. **Where the system already is** — the library URL, `DESIGN_TOKENS.md`, and **DTCG export** if the
   stack emits it. Tokens are structured data with stable IDs, which makes them the one layer that
   round-trips to a design tool cleanly. That's the seam; offer it first.
5. **What's actually wrong** — the open findings. Off-token values, missing states, near-duplicates.
   **This is the most useful page in the brief** and the one founders skip out of embarrassment. A
   designer who can see the mess can fix it; one who can't will build on top of it.
6. **What you need from them** — scoped. *"Empty and error states for these four components"* beats
   *"make it look better."* The five-state table is a ready-made work order.

**The thing to get right: a designer is not an outside professional you brief and wait on.** They
join the work *and* bring their own tool that has to interoperate with your repo — which is why this
lives here, next to the system, rather than in a generic engagement brief. Hand them a URL, not a
repo checkout, and name the token seam on day one.
