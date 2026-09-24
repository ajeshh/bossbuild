---
id: IDEA-130
type: idea
kind: capability
owner: designer
status: seedling
proof: none
proof_note: read against BOSS's own `.boss/design.html` (a CLI + chat product whose design space is about its website), 2026-09-23; no founder building a non-screen product has opened one
gist: The design space assumes a screen. Its skeleton (people, journey, principles, flows, content, patterns, exceptions, research) fits any product; its foundations (colour, type, space, icons, layout, components) are one surface's materials. Read the product's surface and show the materials that surface has — conversation, command line, API, device — with "not your surface" instead of "empty".
created: 2026-09-23
spun_from: IDEA-107
relates: IDEA-107, IDEA-073, IDEA-091, IDEA-010, DEC-004
---

# IDEA-130 — The design playbook, beyond the screen

## Current shape

Ajesh (2026-09-23), on `.boss/design.html`: *"feels more focused on just UI projects, what about
non-ui projects. There is design in there as well… I could see like a chat related product, or AI
or hardware or other tech. I dont think our approach truly capture how to create design guidelines
for various products that may not have UI."*

**Not new: found before and left open.** IDEA-073 A5 (*"UX means a GUI"*) named it. 073 shipped
the enabler (A7: `shape` persisted, P2) but not A5; this idea carries A5 forward for the design
space. Kept separate from 073 on purpose: 073 is shipped with a verified table, and this is new work. What's new is the rendered page makes it visible:
BOSS is itself a non-screen product (a CLI and a voice in a chat), and its design space is about
its website. What BOSS actually designs (when the conscience speaks, how a signal reads, the
shape of a skill's output) has no chapter.

**The split.** Of the 17 chapters in `src/design.js`:

- **Any surface (keep):** Start, People, Journey, Principles, Flows (the three paths), Content,
  Patterns, Exceptions, Research, Accessibility (the heuristics change; the chapter doesn't).
- **Screen only:** Colour, Type, Space & shape, Icons & logo, Layout, Components. These are the
  *materials* of a screen, the way a conversation has its own materials.

**What each surface's materials are** (first draft, to be vetted against real guidelines:
conversation-design guides, CLI guidelines, API style guides, device HIGs):

| Surface | Its "foundations" | Its "components" | Its accessibility |
|---|---|---|---|
| Screen | colour, type, space, icons | the component index | contrast, focus, targets |
| Conversation / AI | persona and register, response length, formatting rules, what it never says | turn patterns: greeting, clarify, confirm, refuse, hand-off, repair | screen readers on streamed text, plain language, no reliance on formatting |
| Command line | output grammar, stdout vs stderr, exit codes, colour as meaning (`NO_COLOR`) | the command, the flag, the prompt, the progress line, the error | pipes, no colour, readable without a TTY |
| API / SDK | naming, error shape, versioning, pagination | the resource, the error object, the event | error messages a person can act on |
| Device / hardware | light, sound and haptic cues as tokens, physical controls | state indicators (on, pairing, error, low power), setup | non-visual and non-audio paths |

Tokens aren't only a screen idea: an LED's colour, a chime, a haptic pulse are named values with
one source of truth. The same discipline carries over; the vocabulary changes.

**The honest-render rule this adds.** A screen chapter on a CLI shows *empty*, which reads as
"you haven't done this yet". It should read *not your surface*. That's IDEA-073 A6 (`waiting`
conflating "not yet" with "never here") showing up again in the design space.

## The smallest move (compose, don't add)

1. **Read `shape`.** Already done: IDEA-073 P2 made `/canvas` write it to `.boss/config.json`, and
   `/ux-check`, `/trust` and `/red-team` read it. The design renderer (`src/design.js`) doesn't
   read it yet. That's the whole enabler.
2. **Chapters pick by surface.** The any-surface chapters stay; the foundations group renders
   the materials for the product's surface(s); a chapter that doesn't apply says *not your
   surface* instead of *empty*. A product can have several (a web app with a chat).
3. **Each surface's materials come from a file in `docs/design/`**, like today's
   tokens and style guide. The renderer shows what's written and holes what isn't. No new skill;
   `/design-tokens-init` and `/design-review` learn the surface they're on.
4. **BOSS goes first.** Its own design space should describe the conscience and the CLI,
   not only the site. If it can't, it's not ready to ship to a founder.

**Held by Ajesh (2026-09-23)** until they revisit this idea. First step when it re-opens: step 4, BOSS's own pages.

## Open questions

- Is the surface list above the right cut, or is "AI" a layer over any surface rather than its
  own surface? (A chat is a surface; an AI feature inside a screen is not.)
- Does "hardware" belong at all at n=0? IDEA-073's refusal (*no per-platform skills*) still
  holds; a table row and a file is not a skill.
- Where do the conversation materials live now: `docs/BRAND.md`'s voice lines, or a new
  `docs/design/conversation.md`?

## Refusals

- ⛔ No per-surface skill, no 23rd verb (IDEA-073's refusal, EVID-001's mandate).
- ⛔ No invented guidelines. Holes stay holes; the renderer never writes the founder's rules.
