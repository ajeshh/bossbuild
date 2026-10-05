---
paths:
  - "src/**"
---

<!-- Written by /smoke the first time it ran here. It is YOURS: BOSS never overwrites it, and `boss sync`
     leaves it alone. It loads only when Claude opens a file under the paths above — rescope them to
     where your code lives. Delete anything that doesn't fit; add what you find yourself correcting
     twice. The full reasoning: `boss craft engineering-system`. -->

# Engineering — how this project's code is built

Every rule says what enforces it — **E** a check fails when it's broken · **P** something catches some
of it · **W** written only. The W lines are the ones that quietly stop being true; read them when
something breaks.

## Principles

_Three to five, each one a reasonable person could argue the opposite of. Blank until you've made the
same call twice — then write the call down here. Example of the shape: "Fewer moving parts over
convenience."_

-

## Rules

- **Imports point one way.** Shared code never imports a feature; a feature never reaches into another
  feature's internals — it goes through that feature's public entry. — W (P once the line below is
  filled and `boss hooks enable ui-boundary-guard` is on: it names an import that points up)
- **Layers, top to bottom:** _fill in once the folders exist — each path in backticks on this one line, highest first,
  e.g. src/app → src/features → src/lib. A higher layer may import a lower one, never the reverse._
- **Check input once, at the edge; fail loud inside.** Parse what comes in (requests, files, config,
  model output) where it enters; past that point, code trusts its types and throws on the impossible. — W
- **Adding a package is a decision.** Confirm a package an agent named actually exists and is the one you
  meant before installing it; commit the lockfile. — W
- **Strict types and the formatter stay on.** — (E if `/smoke` folded the typecheck into its command)

## Find this before you write one

_Add a row the second time you see the same helper written — the third time, it becomes the helper.
Point at a live file, never a pasted snippet. The last column is the tempting wrong thing._

| You need | Use | Not |
|---|---|---|
| | | |

When an agent reports "nothing like this exists," it has searched for some names. Try three or four
others, and search by what the code would do, before writing a new one.

## Testing

- Test command: `` — (fill in; `/smoke` runs the aliveness check, this runs the tests)
- **Reproduce before you fix:** the test fails on the current code first. If it passes, there was no bug. — W
- **A bug fix adds a test named for the bug. Only an intended behaviour change edits an existing test.**
  Never loosen an assertion to make it pass. — W
- **Structural change and behaviour change go in separate commits.** — W
- **Test what a person touches** — the route, the command, the screen — not the internals. — W
- Model output is judged by evals (`/evals`), never by `assert`.

## Data — when the first table arrives

- **A schema change is a migration file, reviewed like code** — never a change made by hand against the
  database. — (E if `schema-guard` is on)
- **One word per concept** — the same noun in the schema, the code and the copy. — W

## Left to the agent

_Breaks you'd rather the agent keep fixing than add a check for — one line each, file and kind. The
agent won't offer a check for these again; delete a line to hear the offer next time._

-

## Changing these

Change a rule here, in the open. Three exceptions to the same rule mean the rule is wrong — narrow it,
split it, or delete it rather than recording a fourth. When a row in the table above becomes a helper
everyone uses, the row can go.
