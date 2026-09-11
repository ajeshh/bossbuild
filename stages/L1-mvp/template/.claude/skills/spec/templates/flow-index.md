# `/spec` — the flow index (bundled resource)

> Loaded **on demand**. Write this to `docs/design/FLOWS.md` the first time a FEAT with a
> user-facing surface names its flow.

## Why this layer exists, and why it is the one a checker cannot give you

Every other layer of a design system can be checked by something. Tokens have a guard. Components
have an index and a source hash. Patterns have a review that walks them. **Flows have nothing, and
they are the most expensive judgment in the whole system.**

That is not an accident of what BOSS built — it is a measured property of the tool. An AI design
review reliably improves **feedback and scannability**; it moves **flow efficiency** by almost
nothing. Whether the *sequence is wrong* — whether two screens should be one, whether the person
should have been asked this at all — survives the review intact. **No amount of checking produces a
flow nobody designed.**

So this layer is deliberately an **authored** artifact, and it is honest about the consequence:

> ⚠️ **There is no boundary here, at any rung, and there is not going to be one.** The flow is a
> filter — it works because a person decided something and wrote it down. Everything else in the
> design system got a mechanism; this got a cheap format and a hard question. Pretending otherwise
> would be the failure mode this practice keeps repeating.

## The cheap format

A flow is **entry → steps → exit**, plus what happens when it doesn't go well. That last part is the
five-state requirement raised one level: a component has five states, and **a flow has three paths.**

- **The happy path** — it works, the user has what they need.
- **The first-run path** — the same flow when the user has *nothing* yet. Almost always the one that
  ships broken, because it is the one the builder never sees after day one.
- **The failure path** — a step cannot complete. Where does the user land, what do they still have,
  and can they get back in?

## The cut test — the one question that earns this file

Each step names **what it asks the user for** and **why it is needed now**.

> **A step that cannot say why it is needed *now* is the step to cut.**

That is the whole mechanism. It is cheap — one column — and it makes the expensive judgment visible
at the moment it is still free to change. "We need their company size" is a reason to collect it
*eventually*; it is not a reason to ask before they have seen the product work. Asking is the most
expensive thing an interface does, and nobody notices the cost because each individual question looks
reasonable.

```markdown
---
id: flows
type: design
owner: designer
status: active
updated: {{DATE}}
---

# Flows — {{PROJECT_NAME}}

> **Open this before designing a screen that sits in a sequence.** A flow composes with the ones
> already here; it does not invent a new navigation model. One row per flow, the detail in its FEAT.

| Flow | Entry | Steps | Ends at | Owned by |
|---|---|---|---|---|
| Signup → first project | landing CTA | 3 | a project with something in it | `FEAT-004` |
| Invite a teammate | project settings | 2 | they accepted | `FEAT-011` |

---

## Signup → first project · `FEAT-004`

**Happy path**

| # | Step | Asks the user for | Why it's needed *now* |
|---|---|---|---|
| 1 | email + password | credentials | there is no account without it |
| 2 | name the project | a project name | it is the thing they came to make |
| 3 | first item | one real item | the product does nothing empty — this IS the value moment |

**Cut list** — asked for, then cut, and why. *Keep these rows.* They are what stops the same
question being re-proposed in three months by someone who thinks it was an oversight.

| Cut | Why |
|---|---|
| company size | needed for pricing tiers *eventually*, not before they have seen it work |
| how did you hear about us | our question, not theirs — move it to a later prompt or drop it |

**First-run path** — they have nothing. Step 3 has no data to show, so it *is* the empty state: one
action, pre-filled, one click to a real item.

**Failure path** — step 2 fails (name taken, network): they keep the account from step 1 and land
back on step 2 with what they typed still there. **Nothing they already gave us is lost.**
```

## Rules

- **One flow per sequence a user would name.** If you cannot name it in the words a user would use,
  it is not a flow — it is a screen.
- **The detail lives in the FEAT; this file is the index.** Two copies of a flow diverge, and the
  copy people read is never the one that got updated.
- **Keep the cut list.** A question you decided not to ask is a decision, and it is the one most
  likely to be silently reversed.
- **Three paths or it is not specced.** Happy alone is the AI-generated-UI failure mode with a
  bigger blast radius — the same reason the five-state requirement exists.
- **A flow composes existing patterns and components.** If it needs a new one, that is a finding
  worth saying out loud, not a thing to do quietly mid-flow.
