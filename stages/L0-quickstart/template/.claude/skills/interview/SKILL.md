---
name: interview
description: The bridge from the conscience's best advice ("a 15-minute call with the right person beats another canvas pass") to captured evidence. PREP a customer conversation under hard Mom-Test discipline (past behavior, their life, no pitching) — one printable page in five minutes — then DEBRIEF it: paste your raw notes and BOSS extracts honestly-graded EVID records, flags the one moment you pitched instead of listened, and names the single follow-up commitment to ask for. BOSS never simulates the interview. Usage - /interview [prep | debrief | paste your notes]
---

# /interview — the Mom-Test bridge

The conscience's single best line is *"a 15-minute call with the right person beats `/canvas`."* And then
— until now — BOSS abandoned you at the exact moment you took the advice. No help preparing the call, no
discipline during it, nowhere to put what it returned. BOSS walked you to the edge of build-world and
waved goodbye.

`/interview` is the bridge into validation-world. Two movements, one skill: **prep** before the call,
**debrief** after. It's built on Rob Fitzpatrick's *The Mom Test* — cited by name, never impersonated.

## Two modes (detected from how you invoke it)

- **`/interview`** or **`/interview prep`** → **PREP** (before the call).
- **`/interview debrief`**, or you just paste raw notes → **DEBRIEF** (after the call).

If it's ambiguous, ask which one — one line, don't guess wrong.

---

## PREP — the page you take into the room

Goal: 5–7 questions and a plan, on one printable page, in about five minutes.

1. **Read the bet.** Open `docs/ideas/*-canvas.md` and read the **riskiest assumption**. Read any
   existing `docs/evidence/EVID-*.md` bearing on it (grades + one-liners) so you don't re-ask what's
   already answered. If there's no canvas, ask in one sentence: *"What's the riskiest thing you're
   hoping this call tells you?"* — then proceed. Don't block.

2. **Draft 5–7 questions under Mom-Test discipline.** The rules, applied hard:
   - **Ask about their past and their life, not your idea.** *"When did you last hit this problem? Walk
     me through what you did."* — never *"Would you use a tool that…"*
   - **No future hypotheticals.** People lie about the future to be nice. *"Would you pay?"* is worthless;
     *"What are you paying for something now?"* is gold.
   - **Don't describe the product.** The moment you pitch, the data stops being clean — they switch from
     informant to supporter. Keep the idea out of your mouth.
   - **Dig for specifics and emotion.** *"Last time that happened, what did it cost you? What did you try?
     Why did that not work?"*

3. **End with a commitment ask.** A good call ends by asking for something that costs them a little:
   an intro, a follow-up with the real data, time on their calendar, a small pre-order/deposit. Draft
   the *one* commitment ask that fits how far this relationship is — the closer, not a hard sell.

4. **Print the anti-pitch warning at the top of the page**, in your own words:
   > ⚠ The moment you describe your product, the data stops being clean. Ask about their life. Shut up
   > and listen. You're here to learn, not to sell.

Output it as one clean page the founder can literally print or keep open. No preamble.

---

## DEBRIEF — turn the conversation into evidence

The founder pastes raw notes or brain-dumps what happened. Do three things — in this order, briefly:

1. **Extract candidate evidence, honestly graded.** Pull out each real signal and grade it on the fixed
   ladder (definitions inline so the founder learns them):
   - **`stated-pain`** — they *said* it hurts. Weakest; talk is nearly free.
   - **`observed-behavior`** — you *watched* them do / struggle / work around it, or they described a
     real past action.
   - **`commitment`** — they gave up something real: time, money, reputation, a calendar slot.

   For each, **offer to write an `EVID-NNN`** via the `/evidence` schema — draft it, show it, save on
   the founder's OK (next-number logic and frontmatter exactly as `/evidence` does; if
   `docs/evidence/` doesn't exist yet, create it). If the `/evidence` skill isn't present in this
   project for some reason, output the draft `EVID` blocks inline for the founder to save by hand, and
   say so.

2. **Flag AT MOST ONE pitched-instead-of-listened moment.** Use Fitzpatrick's taxonomy — *compliments*
   ("sounds cool!" — usually right after you explained a feature = a compliment, not evidence),
   *fluff* (generic future/hypothetical talk: "I'd definitely…", "I always…"), *deflection*. Name the
   single clearest one, plainly: *"They said 'I'd totally use that' right after you described the
   feature — that's a compliment, not a signal. Next time, don't describe it; ask what they do today."*
   **Observe, don't scold** — one line, conscience-not-censor. Skip it entirely if the call was clean.

3. **Name the one follow-up commitment ask — only if the pain looked real.** If there's genuine pain,
   suggest the single next commitment that would raise the grade (*"she described the Monday scramble
   in detail — ask if she'll show you next Monday's actual spreadsheet. If she says yes, that's
   observed-behavior, not just stated pain."*). If the pain didn't show up, say so honestly — that's a
   useful result too, not a failure.

4. **Offer to fold it back into the persona.** You just talked to a real one. If `docs/personas/`
   holds a persona for this user, offer `/persona enrich <slug>` with what the call actually showed —
   this is the source that shrinks the synthetic share fastest, and it is the *whole point* of having
   gone. Note the direction: the persona may have **rehearsed your questions** beforehand, and this
   is the return leg. A persona that only ever feeds interviews and never learns from them is a guess
   that never gets corrected.

   Offer it, don't do it. The founder should see which parts of their assumed user just got contradicted.

---

## Guardrails

- **BOSS preps and debriefs; it never simulates the interview.** No synthetic transcripts, no
  role-played "customer answers." (The `/persona` agents may *rehearse your questions* beforehand —
  pre-filter framing only, under the standing "personas are not validation" caveat. Rehearsal ≠ data.)
- **No CRM ambitions.** No contact management, no pipelines, no scheduling. One call, one page, one
  debrief.
- **The pitch-detector flags, it doesn't scold.** One observation per debrief, at most.
- **Grade honestly.** The debrief is where BOSS's synthetic-vs-real honesty gets enforced mechanically:
  stated pain can't masquerade as validation because the grade says what it is.

## Why it matters

This is the rare feature that serves the founder *and* the maker on day one: it's the tool for real
customer conversations, and it closes the loop the conscience opens — advice → call → **captured,
graded evidence** the conscience then reads (via `EVID-NNN`, IDEA-045) and calibrates against.
