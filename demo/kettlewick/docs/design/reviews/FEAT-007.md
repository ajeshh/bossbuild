---
id: review-FEAT-007
type: design
owner: designer
status: recorded
date: 2026-09-14
feat: FEAT-007
half: before
surface: the draft sheet — Ask on an uncovered row, three drafted texts, Ask again to send
---

# Design review — FEAT-007, draft the ask (before code)

Read: FEAT-007's Flow and *What "wrong" looks like*, DEC-005, `DESIGN_TOKENS.md`, `STYLE_GUIDE.md`,
`COMPONENTS.md`, `PATTERNS.md`, `FLOWS.md`, the canvas Promises cell, and the throwaway sketch
`prototype/draft-sheet.html` (on-system, `PROTOTYPES.md`). Two passes: the visual system, then flow,
states and content. Worst first.

## Accessibility
- **The draft is a text field, so it needs a label that stays.** Each of the three drafts gets a
  visible label, the carer's first name ("To Priya"), not a placeholder (PATTERNS, *Label, not
  placeholder*; WCAG 3.3.2). Proposed: `TextField variant="multiline"` with `label="To Priya"`.
- **Focus goes in and comes back.** Opening the sheet moves focus to the first draft; Ask or closing
  returns it to the row's Ask (PATTERNS, *Focus goes in and comes back*; WCAG 2.4.3).
- **"Drafting…" is announced once**, politely, and the fallback line ("The usual wording this time.")
  is announced when it replaces it, so a screen-reader user knows which text they are about to send
  (WCAG 4.1.3).
- **Not checked:** VoiceOver order on the phone with the keyboard open over the sheet; whether 44px
  targets survive the keyboard on the smallest phone the owners use.

## AI-UX
- **Nothing sends without a read.** Already in the flow, and the most important thing on this screen:
  the sheet's Ask is the human gate on a text in the owner's name. Keep it the only way out that
  sends. A "Send all" in the header would be a second, faster gate, and the slow one would stop
  being used.
- **Say where the words came from, once, plainly.** The drafts carry one muted line above them,
  "Drafted for you. Change anything.", and the template carries "The usual wording this time."
  No sparkle icon, no "AI" badge: the owner needs to know whether to read closely, not what made it.
- **No "write it again".** Agreed with the cut. A reroll costs a model call each time the draft is
  worse; an edit costs three seconds and nothing.
- **Fallback is the same sheet, not an error.** Garbage, refusal, timeout: the template fills the
  same three fields and Ask works the same (FEAT-007 failure path). Never an empty field, never a
  spinner past four seconds (PATTERNS, *Name the wait past ~10s* doesn't apply; the cap is four).

## Token violations
- None in the sketch. It imports `tokens.css`. The provenance line is `color.text.muted`; the draft
  fields are `color.surface.paper` on `color.surface.raised`; the only copper is the sheet's Ask.
- **Proposed, not needed:** no new token. The sheet floats, so it takes `shadow.raised`, the one
  shadow, and `radius.surface` (PAT-5, *Rows sit, the card floats*).

## Missing states
| Element | default | hover | active | disabled | empty / loading |
|---|---|---|---|---|---|
| Draft field | ✓ the draft | ✓ | ✓ focus ring | ✓ after 8pm: editable, and the Ask says when | **missing → proposed:** while drafting, three `RowSkeleton` lines in the field's shape, "Drafting…" (PAT-9) |
| Sheet's Ask | ✓ "Ask Priya, Sam and Jo" | ✓ | ✓ | **missing → proposed:** after 8pm, "Ask at 6:30" and the line "Goes out at 6:30." (PAT-4) | ✓ loading "Asking Priya, Sam and Jo…" |
| Error on send | **missing → proposed:** the sheet stays open, every edit kept, "Couldn't send — try again." (PATTERNS, *Never lose what they typed*) | — | — | — | — |

## Brand drift
- None. The sketch reads as the day view, not as a chat window, which was the risk: a model feature
  that arrives looking like a different product.

## Content
- **Terminology.** The system prompt says "a visit" and "carers"; keep it that way, and add the
  terms the style guide refuses: never *shift*, *slot* or *booking*; never *request*. The prompt is
  copy that ships to carers, and nobody reviews it at 7:40.
- **The no-guilt line is a word list, not a hope.** "we're really stuck", "sorry to ask again",
  "desperate", "please please": PROG-001 says no guilt, and a model is good at it. Proposed: the draft
  check discards a draft containing any of them; the list lives beside the check.
- **The sheet's Ask names who.** "Ask Priya, Sam and Jo", the same as the row's Ask (PAT-2). Not
  "Send", not "Send drafts": *ask* is the product's verb (Terminology).
- **The quiet-hours time disagrees with itself.** FEAT-005, `cover.js` and this FEAT say 6:30;
  PAT-4's example and the AskCard page say "goes out at 7am". The sheet uses 6:30. **Proposed:** every
  surface reads the time from `sendTime()` rather than typing it. Applied to the docs: PAT-4,
  `AskCard.md`, the style guide, `Toast.md` and `QuietNotice.md` now say 6:30.

## Pattern findings
- **Cited:** PAT-2 (the act on the row: the sheet opens from the row's Ask, and the row never opens
  a page), PAT-4 (say when), PAT-5 (the sheet floats), PAT-9 (the shape while it loads), PAT-6 (the
  sheet is not a ConfirmDialog; nothing here is destructive except the send, and its gate is Ask).
- **First overlay you work in.** PATTERNS says *a dialog is a question, not a place*, and a sheet
  with three text fields is a place. Two honest resolutions: expand the row in place, or name the rule
  *a dialog asks one question; a sheet holds one visit's short task, and the day stays visible above
  it*. Marta chose the sheet (a row with three text fields in it pushes the rest of Monday off the
  phone). Left as a finding, not a pattern: it has come up once.
- **Seeded:** the AI-interaction rows that apply (*Risk-tiered gate*, *Degraded-state honesty*) into
  `PATTERNS.md`, now that the product is AI-mediated. *Why this* and *Confidence as register* don't
  apply: the model chooses nothing and is never unsure in a way the owner can act on.
- **Not an exception.** One primary on the sheet (its Ask). The day view keeps its two standing
  exceptions; this would have been the third of a kind, which is the threshold for changing the rule
  rather than adding to it.

## Flow — the weakest finding here
The three steps hold (Ask, read, Ask), the first-run path is real (the model needs no history, so the
first draft is as good as the hundredth), and the cut list was attempted. But this review is evidence
about states and words; it is close to no evidence that a second Ask is right on a Monday morning.
That is for the owners to say, and the 2026-10-03 check-ins are where they'll say it.
