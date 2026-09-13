// task-hygiene — the keeper for the EMERGENT task list (IDEA-094 Part 0).
//
// The failure this guards against is NOT "the signal doesn't fire." It is the opposite: a per-turn
// hook that speaks when it shouldn't gets muted, and a muted conscience is worse than none because
// the founder believes it is on. So most of what follows asserts SILENCE.
//
// v0.315.0 (RVW-098): the hook no longer reads `TodoWrite` — the host stopped offering it on
// current models in 2.1.268, which made the old gate permanently silent. The gate is now the
// transcript's own times (created / last written) against the newest durable file. No transcript
// CONTENT is parsed, and these tests write none.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, utimesSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { detectTaskHygiene } from '../stages/L0-quickstart/template/.claude/hooks/lib/task-hygiene.js';

const MIN = 60 * 1000;

// A transcript whose creation time is `ageMin` ago and last write is `lastMin` ago. `utimes` can
// only move mtime/atime, never birthtime — so the fixture's "now" is pinned to the file's real
// birth plus the session length, and passed to the detector. That keeps every test independent of
// wall-clock drift and of whether the filesystem records birthtime at second resolution.
function fixture({ sessionMin = 90, idleMin = 5, durableBehindMin = 90, withDurable = true } = {}) {
  const dir = mkdtempSync(join(tmpdir(), 'boss-task-hygiene-'));
  const proj = join(dir, 'proj');
  mkdirSync(join(proj, 'docs'), { recursive: true });
  const transcript = join(dir, 'transcript.jsonl');
  writeFileSync(transcript, '');
  const birth = statSync(transcript).birthtimeMs;
  const last = birth + sessionMin * MIN;
  utimesSync(transcript, new Date(last), new Date(last));
  const now = last + idleMin * MIN;

  let devlog = null;
  if (withDurable) {
    devlog = join(proj, 'docs', 'devlog.md');
    writeFileSync(devlog, '# devlog\n');
    const at = new Date(last - durableBehindMin * MIN);
    utimesSync(devlog, at, at);
  }
  return { proj, transcript, devlog, now, last };
}

test('fires when a long session has written nothing durable for the whole stretch', () => {
  const { proj, transcript, now } = fixture();
  const s = detectTaskHygiene(proj, transcript, now);
  assert.ok(s, 'expected a signal');
  assert.equal(s.moment, 'task-hygiene');
  assert.equal(s.evidence.session_minutes, 90);
  assert.equal(s.evidence.durable_file, 'docs/devlog.md');
  assert.equal(s.evidence.durable_stale_minutes, 90);
  // Never 'high': this is a timestamp proxy for a content question, and it cannot see the list.
  assert.equal(s.confidence, 'medium');
  // Nothing about the list is claimed, because nothing about the list was read.
  assert.equal('open' in s.evidence, false);
  assert.equal('sample' in s.evidence, false);
});

test('silent once something durable is written during the session', () => {
  const { proj, transcript, now } = fixture({ durableBehindMin: 10 });
  assert.equal(detectTaskHygiene(proj, transcript, now), null,
    'writing things down is the behaviour this encourages — it must never be nudged at');
});

test('silent for a short session — the record cannot be trailing work that has barely started', () => {
  const { proj, transcript, now } = fixture({ sessionMin: 20, durableBehindMin: 20 });
  assert.equal(detectTaskHygiene(proj, transcript, now), null);
});

test('silent just under the floor, fires just over it', () => {
  // Not tested AT the floor: `utimes` takes whole milliseconds and birthtime carries fractions, so
  // "exactly 45 minutes" lands a sub-millisecond under. The hook's floor is a floor, not a line.
  const under = fixture({ sessionMin: 44, durableBehindMin: 44 });
  assert.equal(detectTaskHygiene(under.proj, under.transcript, under.now), null);
  const over = fixture({ sessionMin: 46, durableBehindMin: 46 });
  assert.ok(detectTaskHygiene(over.proj, over.transcript, over.now));
});

test('silent on a resumed session — a transcript idle for an hour is not a session that has been working', () => {
  const { proj, transcript, now } = fixture({ idleMin: 60 });
  assert.equal(detectTaskHygiene(proj, transcript, now), null,
    'a day-old devlog next to a just-resumed chat is not a trailing record, it is a gap');
});

test('silent when no durable file exists at all', () => {
  const { proj, transcript, now } = fixture({ withDurable: false });
  assert.equal(detectTaskHygiene(proj, transcript, now), null,
    'a project with no devlog has not lost its notes — it has not started');
});

test('feature-context.md counts as durable, and the newest durable file wins', () => {
  const { proj, transcript, now, last } = fixture();
  mkdirSync(join(proj, '.claude', 'rules'), { recursive: true });
  const fc = join(proj, '.claude', 'rules', 'feature-context.md');
  writeFileSync(fc, '# feature context\n');
  const fresh = new Date(last - 2 * MIN);
  utimesSync(fc, fresh, fresh);
  assert.equal(detectTaskHygiene(proj, transcript, now), null,
    'the designated home was written two minutes ago — silence, whichever file the devlog says');
});

test('fails silent and open on every unreadable input', () => {
  const { proj, now } = fixture();
  assert.equal(detectTaskHygiene(proj, null, now), null);
  assert.equal(detectTaskHygiene(proj, '', now), null);
  assert.equal(detectTaskHygiene(proj, '/definitely/not/here.jsonl', now), null);
});

test('never parses the transcript — junk content changes nothing', () => {
  // The whole point of v0.315.0: no format, no tool name, nothing in the file's CONTENT can make
  // this fire or fall silent. Only its times.
  const { proj, transcript, now, last } = fixture();
  writeFileSync(transcript, 'not json at all\n{"half":\n{"name":"TodoWrite","input":{"todos":[]}}\n');
  utimesSync(transcript, new Date(last), new Date(last));
  assert.ok(detectTaskHygiene(proj, transcript, now),
    'the signal is the same with garbage in the file as with an empty one');
});
