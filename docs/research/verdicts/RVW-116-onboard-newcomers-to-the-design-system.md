---
id: RVW-116
type: verdict
owner: pm
status: recorded
created: 2026-10-05
verdict: ADAPT
route: DOWN src/design.js (the design playbook, `boss design`)
sources:
  - an enterprise design-systems designer's guide on a design-system vendor's blog, 2026-09 (docs/research/sessions/SESSION-2026-10-05-design-system-reading.md, gitignored)
---

# RVW-116 — onboard newcomers to the design system in five phases

> **Revised the same day.** First recorded as NOT-YET ("a solo founder has no newcomer"). Ajesh,
> with the second drop: *"our design playbook is part of the onboarding."* That changes who reads
> the claim. The newcomer is whoever opens `boss design` cold: a designer joining, a cofounder, the
> founder after three weeks away, the agent. The tour is the playbook. Re-read on that basis.

## The claim
- **Source:** a designer on a large insurer's design-system team.
- **Core assertion:** without structured onboarding, people misuse tokens and rebuild what exists.
  Five phases: (1) access and an overview; (2) a role-specific tour covering naming conventions,
  tokens (*"and explain if you have a tool in place to scan for token misuse"*), foundations *with
  their why*, a few simple components and one complex one, and where to get help; (3) a short
  exercise; (4) community; (5) a follow-up at 60–90 days. Give async readers *"a page with the most
  helpful quick links,"* keyword-findable.
- **Inbox file:** `~/Projects/inbox/bossbuild/How to onboard newcomers to your design system…pdf`

## Rubric
| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | Phases 3–5 (exercise, office hours, a survey) fail #2 for a founder's project. Phases 1–2 don't: they describe what a page should hold, not a ritual. |
| 2 | Evidence grade | Practitioner process from one enterprise; no outcome data. |
| 3 | Duplicate or sharpen? | Held against the playbook chapter by chapter (`src/design.js`): **overview** = *Start here* ✓; **foundations with their why** = the DEC under each swatch ✓; **naming conventions** = *Content* terms ✓ and semantic names ✓; **components** = usage pages ✓. **Two real gaps.** (a) **The tool that scans for misuse:** the playbook lists the guards with on/off, but only inside the Accessibility chapter. `GUARDS` (`src/design.js:522`) names four and **leaves out two that ship**, `design-decisions-guard` and `ui-boundary-guard`. A newcomer meets a hook message at their first write with nothing on the page that said it was coming. (b) **Quick links:** *Start here* is the brand and the anchor. A newcomer arriving with a job ("let someone delete a thing") has no way in except the chapter list. RVW-127 takes this half. |
| 4 | Who serves / harms? | Serves anyone opening the playbook cold, and the agent. It harms no one, because both are generated from files that already exist. |
| 5 | Cost / ceremony | Neutral. No new file and no new slot. |

## Verdict: ADAPT
Take the page-shaped half and leave the ritual half. What the playbook already does is most of this
guide. It is missing the bit that tells a newcomer *what will hold them to it*, and the list it has
of that is two guards short.

## If ADOPT / ADAPT
- **What to do (DOWN, `src/design.js`):**
  1. Add `design-decisions-guard` (*"a decision handed over at the write that touches it"*) and
     `ui-boundary-guard` (*"a system component reaching into a feature, caught at the import"*) to
     `GUARDS`. That fixes a list short of what ships. A test asserts every guard
     `/design-tokens-init` registers appears in `GUARDS`. **Rule 8:** it fails today.
  2. Lift the guard table from Accessibility into *Start here* as **"What checks the work"**: name ·
     what it catches · on/off. Accessibility keeps a pointer. `design-tokens-guard`'s line also says
     it names the successor for a deprecated token.
- **What's modified:** no exercise, office hours, community or survey (PRINCIPLE #2), and no
  "who owns it / where to get help" slot (on a founder project that's the founder). Re-open those
  with RVW-118's trigger, when a second person contributes UI.

## Attribution
The author's own process; nothing attributed.

## Notes
- Prior related verdicts: RVW-082 (designer handoff), RVW-127 (quick links → task index), RVW-118.
- Outcome (2026-10-05): landed. `GUARDS` gained `design-decisions-guard` and `ui-boundary-guard` (test asserts all six shipped guards). *Start here* carries **What checks the work**, and Accessibility points to it. Tests written failing first.
- BOSS version when recorded: 0.329.0
