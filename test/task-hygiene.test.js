// task-hygiene — the keeper for the EMERGENT task list (IDEA-094 Part 0).
//
// The failure this guards against is NOT "the signal doesn't fire." It is the opposite: a per-turn
// hook that speaks when it shouldn't gets muted, and a muted conscience is worse than none because
// the founder believes it is on. So most of what follows asserts SILENCE.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, utimesSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { detectTaskHygiene } from '../stages/L0-quickstart/template/.claude/hooks/lib/task-hygiene.js';

const OPEN_4 = [
  { content: 'wire the keeper into the hook', status: 'pending' },
  { content: 'add the moment frame', status: 'in_progress' },
  { content: 'adopt the working-context file', status: 'pending' },
  { content: 'dogfood it at the repo root', status: 'pending' },
  { content: 'read the transcript shape', status: 'completed' },
];

function fixture(todos, { partialFirstLine = true } = {}) {
  const dir = mkdtempSync(join(tmpdir(), 'boss-task-hygiene-'));
  const proj = join(dir, 'proj');
  mkdirSync(join(proj, 'docs'), { recursive: true });
  // The list is stamped well in the past so a fixture can place a durable write on either side
  // of it without fighting filesystem timestamp resolution.
  const ts = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const lines = [];
  // A tail read almost always starts mid-object. Every fixture reproduces that by default.
  if (partialFirstLine) lines.push('{"cut": "this object is sliced in half by the tail read');
  lines.push(JSON.stringify({ type: 'user', timestamp: ts, message: { content: [] } }));
  lines.push(JSON.stringify({
    type: 'assistant',
    timestamp: ts,
    message: { content: [{ type: 'tool_use', name: 'TodoWrite', input: { todos } }] },
  }));
  const transcript = join(dir, 'transcript.jsonl');
  writeFileSync(transcript, lines.join('\n') + '\n');

  const devlog = join(proj, 'docs', 'devlog.md');
  writeFileSync(devlog, '# devlog\n');
  const old = new Date(Date.now() - 3 * 3600 * 1000);
  utimesSync(devlog, old, old);
  return { proj, transcript, devlog };
}

test('fires when open items outran the last durable write', () => {
  const { proj, transcript } = fixture(OPEN_4);
  const s = detectTaskHygiene(proj, transcript);
  assert.ok(s, 'expected a signal');
  assert.equal(s.moment, 'task-hygiene');
  assert.equal(s.evidence.open, 4);
  assert.equal(s.evidence.in_progress, 1);
  assert.equal(s.evidence.total, 5);
  // Never 'high': this is a timestamp proxy for a content question, read out of a format BOSS
  // does not own. The confidence has to say so.
  assert.equal(s.confidence, 'medium');
});

test('silent once something durable is written AFTER the list moved', () => {
  const { proj, transcript, devlog } = fixture(OPEN_4);
  const now = new Date();
  utimesSync(devlog, now, now);
  assert.equal(detectTaskHygiene(proj, transcript), null,
    'writing things down is the behaviour this encourages — it must never be nudged at');
});

test('silent below the floor — one or two open items is ordinary working state', () => {
  const { proj, transcript } = fixture([
    { content: 'a', status: 'pending' },
    { content: 'b', status: 'pending' },
    { content: 'c', status: 'completed' },
  ]);
  assert.equal(detectTaskHygiene(proj, transcript), null);
});

test('silent when every item is completed', () => {
  const { proj, transcript } = fixture(OPEN_4.map((t) => ({ ...t, status: 'completed' })));
  assert.equal(detectTaskHygiene(proj, transcript), null);
});

test('silent when the session never identified a task', () => {
  const { proj } = fixture(OPEN_4);
  const dir = mkdtempSync(join(tmpdir(), 'boss-task-hygiene-empty-'));
  const transcript = join(dir, 'transcript.jsonl');
  writeFileSync(transcript, JSON.stringify({
    type: 'user', timestamp: new Date().toISOString(), message: { content: [] },
  }) + '\n');
  assert.equal(detectTaskHygiene(proj, transcript), null,
    'a session with no list has no list to lose');
});

test('silent when no durable file exists at all', () => {
  const { transcript } = fixture(OPEN_4);
  const bare = mkdtempSync(join(tmpdir(), 'boss-task-hygiene-bare-'));
  assert.equal(detectTaskHygiene(bare, transcript), null,
    'a project with no devlog has not lost its notes — it has not started');
});

test('fails silent and open on every unreadable input', () => {
  const { proj } = fixture(OPEN_4);
  assert.equal(detectTaskHygiene(proj, null), null);
  assert.equal(detectTaskHygiene(proj, ''), null);
  assert.equal(detectTaskHygiene(proj, '/definitely/not/here.jsonl'), null);

  const dir = mkdtempSync(join(tmpdir(), 'boss-task-hygiene-junk-'));
  const junk = join(dir, 'transcript.jsonl');
  writeFileSync(junk, 'not json at all\n{"half":\n\n');
  assert.equal(detectTaskHygiene(proj, junk), null,
    'a host whose transcript format moved must produce silence, never an error');
});

test('a TodoWrite whose input has no todos array is ignored, not crashed on', () => {
  const { proj } = fixture(OPEN_4);
  const dir = mkdtempSync(join(tmpdir(), 'boss-task-hygiene-shape-'));
  const t = join(dir, 'transcript.jsonl');
  writeFileSync(t, JSON.stringify({
    type: 'assistant',
    timestamp: new Date().toISOString(),
    message: { content: [{ type: 'tool_use', name: 'TodoWrite', input: { todos: 'not an array' } }] },
  }) + '\n');
  assert.equal(detectTaskHygiene(proj, t), null);
});

test('silent when the durable write is only moments behind the list', () => {
  // The two times come from different clocks and `utimes` can truncate. A file written in the same
  // minute as the list is someone working in both, not someone losing track.
  const { proj, transcript, devlog } = fixture(OPEN_4);
  const justBefore = new Date(Date.now() - 60 * 60 * 1000 - 30 * 1000);
  utimesSync(devlog, justBefore, justBefore);
  assert.equal(detectTaskHygiene(proj, transcript), null);
});

test('the newest TodoWrite wins, not the first one found', () => {
  const dir = mkdtempSync(join(tmpdir(), 'boss-task-hygiene-order-'));
  const proj = join(dir, 'proj');
  mkdirSync(join(proj, 'docs'), { recursive: true });
  const devlog = join(proj, 'docs', 'devlog.md');
  writeFileSync(devlog, '# devlog\n');
  const old = new Date(Date.now() - 3 * 3600 * 1000);
  utimesSync(devlog, old, old);

  const ts = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const call = (todos) => JSON.stringify({
    type: 'assistant',
    timestamp: ts,
    message: { content: [{ type: 'tool_use', name: 'TodoWrite', input: { todos } }] },
  });
  const transcript = join(dir, 'transcript.jsonl');
  // An early list of four open, then the later list where those four are done.
  const later = OPEN_4.map((t, i) => (i < 4 ? { ...t, status: 'completed' } : t));
  writeFileSync(transcript, call(OPEN_4) + '\n' + call(later) + '\n');
  assert.equal(detectTaskHygiene(proj, transcript), null,
    'reading a stale list would nag about work already finished — the fastest way to get muted');
});
