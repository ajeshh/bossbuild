---
id: harvest-loop
type: loop
stage: L0-quickstart
runner_type: hook
attributed_to: [Ajesh Shah]
entry:
  - exists: { path: docs/personas }
  - outpaced_by:
      path_glob: docs/evidence/EVID-*.md
      behind: docs/personas/*.md
      min: 2
exit:
  - outpaced_by:
      path_glob: docs/personas/*.md
      behind: docs/evidence/EVID-*.md
      min: 1
drift_moment: harvest
---

# Loop: harvest (Quickstart)

**The first loop in BOSS that watches for something that stopped being true.**

Every other loop is an *absence* predicate — you made an idea and never made a canvas; you shipped a
FEAT and never recorded a smoke check. Those catch work that was never done. None of them can catch
work that *was* done and then quietly went out of date, because until v0.190.0 the runtime had no way
to say it: `exists`, `count_at_least` and `any_file_matches` all test content or existence, and none
compares two timestamps.

So BOSS watched for what was never made, and never for what stopped being true.

## What it watches

The founder derived a persona — a picture of who they are building for, honestly labelled as mostly
guesswork. Then they did the harder thing: they talked to someone, or dropped in a transcript, and
`EVID` records landed. **The persona was supposed to get smarter from that, and `/persona enrich`
exists precisely so it can.** If two or more pieces of evidence have arrived since the persona last
moved, the picture is running behind the facts.

## Entry / exit

**Entry** — there is a persona at all, *and* at least two `EVID` records are newer than it.
**Exit** — the persona is newer than the newest evidence: it caught up.

The exit uses the same predicate with the arguments swapped, which is why this needed no extra
machinery. It is also self-silencing: the moment the founder runs `/persona enrich`, the persona
becomes the newest file, entry stops holding, and the loop goes quiet without anyone recording
anything.

## Why the moment is judgment-gated

The predicate compares file times. **It cannot tell whether the new evidence is even about the
user** — a signal about pricing or a competitor's release is real evidence with nothing to say about
who the persona is. So `harvest` is in `JUDGE_MOMENTS`: the model reads the new `EVID` records and
the persona before deciding whether there is anything to say, and **silence is a common correct
output**. A conscience that fires on unrelated evidence gets muted, and a muted conscience protects
nobody.

## The line it holds

The moment **never offers to update the persona silently.** The synthetic/real ledger is worth
something only because a human watched it move; an artifact refreshed in the background is a
synthetic read laundered into a real one — the exact failure the ledger exists to prevent.

## Deliberately not watched (yet)

The canvas has the same problem and is not wired here. Personas were chosen first because the
relationship is unambiguous — evidence about a person bears on the picture of that person. Evidence
bearing on a *canvas cell* is a looser mapping, and a looser mapping means more false fires on the
one loop whose whole risk is crying wolf. Add it when this one has proven quiet.
