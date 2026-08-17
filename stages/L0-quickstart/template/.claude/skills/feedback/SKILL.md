---
name: feedback
description: Send feedback about BOSS itself back to the people who build it — a bug, a confusion, a wish, a "this got in my way." User-initiated and transparent: it shows you exactly what it will send (and the small bit of context attached) before anything leaves your machine, then files it as a GitHub issue upstream (or gives you a prefilled link to paste). Never background telemetry. Usage - /feedback [what's on your mind]
---

# /feedback — tell BOSS's makers what's working and what isn't

BOSS is an alpha built in the open. The fastest way it gets better is you saying *"this confused me"*
or *"I wish it could…"* — in the moment, without leaving your work to go find a form.

**This skill is the one and only feedback path, and it is always your move.** BOSS does not watch you,
does not phone home, does not collect usage in the background. Nothing leaves this machine unless you
read it and say yes. (That's not a nicety — it's the principle: a tool that helps founders build well
must itself behave well. See `PRINCIPLES.md`.)

## 0. Orient (silent)

Read `.boss/manifest.json` for the BOSS version + current mode — that's the only context worth
attaching, and you'll show it to the founder before sending. Don't read anything else; this isn't a
diagnostics dump.

## 1. Get the feedback

- If the founder typed something after `/feedback`, that's it.
- If not, ask **one** open question: *"What's on your mind — a bug, something confusing, a wish, or
  something that got in your way? A sentence is plenty."*
- Don't interrogate. One round. Take what they give you.

## 2. Draft it — and show it before sending

Compose a short issue. Title = a tight one-liner. Body =
- **What they said** (their words, lightly cleaned up — don't editorialize).
- **Context** (the *only* thing attached, and you state it plainly): `BOSS <version> · <mode> mode ·
  <OS>`. Nothing else — no file contents, no paths, no transcript.

Then **show the founder the full title + body** and ask: *"Send this to BOSS's repo as a public GitHub
issue? It'll be visible at github.com/ajeshh/bossbuild. Yes / edit / keep it local."*

- **Yes** → step 3.
- **Edit** → take their changes, re-show, re-ask.
- **Keep it local** → write it to `.boss/feedback.log` in this project (append, dated) and stop. Tell
  them where it went. Their call is final.

## 3. Send it (only on an explicit yes)

Try the direct path first:

```bash
gh issue create --repo ajeshh/bossbuild --title "<title>" --body "<body>"
```

- **Success** → give them the issue URL. Done. Thank them in one line, no fawning.
- **`gh` missing or unauthed** → don't block. **Fall back:** print a ready-to-paste link —
  `https://github.com/ajeshh/bossbuild/issues/new?title=<urlencoded>&body=<urlencoded>` — and the
  plain body, so they can open it in a browser and submit with one click. Also append to
  `.boss/feedback.log` so they keep a copy either way.

## Rules

- **User-initiated only. Never automatic.** There is no hook, no loop, no background send. If you ever
  feel tempted to "just collect a bit of telemetry," that's the line BOSS exists not to cross:
  **nothing leaves this machine that the founder didn't read first.** Don't.
- **Show before send. Consent is the gate.** The founder sees the exact title + body + the one line of
  context before anything is filed. No silent attachment of paths, code, or transcript.
- **Public issue = say so.** Filing on a public repo means the text is public. State that plainly so
  the founder doesn't paste anything private by surprise.
- **Never block on tooling.** No `gh`, no auth, offline — the prefilled-link fallback always works.
- **Thank, don't grovel.** One sincere line. Then back to their work.
