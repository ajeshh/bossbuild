# `/design-review` — the usage page (bundled resource)

> Loaded **on demand**. Write one to **`docs/design/components/<Name>.md`** at the review of that
> component — the moment its *when* gets decided — and never from its name alone.

## Why a usage page, and who it is for

The index row says a component exists and how to import it. The usage page says **when to use it,
when not to, and why it exists at all** — the half of a design system that the mature ones
(Carbon's *Usage* tab, Fluent's *Usage* page, GOV.UK's *Research on this component*) put first, and
the half an index cannot hold. It is written for four readers at once: the agent about to build
the next screen (*does something like this exist, and is it for this?*), the founder (*what did we
decide?*), a teammate (*how do I use it?*), and a designer (*what is it for, and what is it not?*).

**Why it exists is the line that keeps the library in check.** `component-reuse-guard` asks *reuse,
adjust, or new?* at the write and says *if it IS new, say why in one line* — this is where that
line lives. A component whose *Why it exists* cannot name a behaviour no other component has is a
variant that got forked into a file, and `boss design` says so.

**A usage page written before the code is a request.** A status of `proposed` and no file: a designer
or a teammate has asked for a part, said what it is for and why it is new, and the next
`/design-review` picks it up. That is the front door — nobody has to build a thing to ask for it.

```markdown
---
component: <Name>
status: proposed          # proposed · draft · stable · deprecated · retired — the index's Status column wins if they disagree
source: <src/components/<Name>.tsx — blank while proposed>
design: <optional — a URL into your design tool's file and node>
updated: YYYY-MM-DD
---

# <Name>

**Why it exists:** <reuse · adjust · new — and if new, the behaviour no other component has. "A
Button that says Ask" is a variant; "an act that needs a second person to accept" is new>

## When it applies
- <the situations, in the user's words — "the one act a screen exists for">

## When it doesn't
- <the nearest situation this is NOT for, and what is: "navigation — that is a link">

## Variants, and when
| Variant | Use it for | Never for |
|---|---|---|
| <primary> | <the act> | <a second act on the same view> |

## Content
- <the label rule — verb first · sentence case · the length · what it never says>

## Layout
- <where it sits, what it sits next to, how it reflows on the narrow surface>

## Accessibility
- <the name a screen reader gets · the focus order · the target size · what is *not checked*>

## Research
- <EVID-NNN — what a real person did or said that bears on this part; an EVID whose `about:` names this component shows here on its own>
```

## Rules

- **Every line is the founder's or the review's.** Fill what the review decided; leave the rest as
  the `<placeholder>` — `boss design` renders a placeholder as a hole, and a hole is honest.
- **One page per component, named for it.** `Button.md` for `Button`; a subpart (`Button.Group`)
  lives on its parent's page.
- **The index row stays the index.** Import line, variants, missing states and status are read from
  `COMPONENTS.md` / the manifest; this page does not repeat them. When the page's `status:` and the
  row's disagree, the row wins and the page says so.
- **Retire the page with the component.** A retired component keeps its page with the reason at the
  top — the next person who wants to build it again reads why it went.
