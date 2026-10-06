// BOSS · programs — the umbrella's own record, and the record that has grown into one (IDEA-145).
//
// Two bugs these guard. The first shipped: BOSS's first PROG record was printed as a bare id by
// every reader, its title, gist and backlog invisible. The second is the rule's own failure mode:
// a "grown" line that fires on length would flag shipped narrative (a 657-line record that was all
// history), and a checker that cries wolf gets switched off — so the threshold is tested both ways.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { workShape, isGrown, readPrograms, GROWN } from '../src/programs.js';
import { programs, grownRecords } from '../src/records.js';
import { collectBoard, renderProgramView } from '../src/board.js';

const tmp = () => mkdtempSync(join(tmpdir(), 'boss-programs-'));
const write = (dir, rel, text) => {
  mkdirSync(join(dir, rel.split('/').slice(0, -1).join('/')), { recursive: true });
  writeFileSync(join(dir, rel), text);
};
const tracks = (letters, open = true) =>
  letters.split('').map((l) => `- [${open ? ' ' : 'x'}] **${l}1** · a piece of ${l}`).join('\n');

test('workShape counts open and done, and a track per lettered id — in the three spellings BOSS uses', () => {
  const s = workShape([
    '- [ ] **N3 · Where a practice was proven**',
    '- [x] C0.1 · the reader lives in check-refs',
    '- [x] **R1** · permaculture at source',
    '- [ ] a plain to-do with no id',
  ].join('\n'));
  assert.deepEqual(s, { open: 2, done: 2, tracks: ['C', 'N', 'R'], openTracks: ['N'] });
});

test('grown: three tracks or twelve open — and not one short of either', () => {
  assert.equal(isGrown('building', workShape(tracks('AB'))), false, 'two tracks is two efforts, not a program');
  assert.equal(isGrown('building', workShape(tracks('ABC'))), true);
  const eleven = Array.from({ length: GROWN.open - 1 }, (_, i) => `- [ ] item ${i}`).join('\n');
  const twelve = `${eleven}\n- [ ] one more`;
  assert.equal(isGrown('exploring', workShape(eleven)), false);
  assert.equal(isGrown('exploring', workShape(twelve)), true);
});

test('REGRESSION: finished tracks do not count — an in-flight record whose tracks are all done is not grown', () => {
  const s = workShape(`${tracks('ABC', false)}\n- [ ] **D1** · the one thing left`);
  assert.equal(s.tracks.length, 4);
  assert.equal(isGrown('building', s), false);
});

test('a short program id is the padded one — PROG-1 is PROG-001', async () => {
  const { programId } = await import('../src/programs.js');
  for (const raw of ['PROG-1', 'prog-001', '1', ' PROG-01 ']) assert.equal(programId(raw), 'PROG-001', raw);
  assert.equal(programId('website'), 'WEBSITE');
});

test('grown never fires on finished or parked work — a long shipped record is history, not a program', () => {
  const big = workShape(tracks('ABCDEF'));
  for (const s of ['shipped (v1)', 'deferred (trigger)', 'dropped', 'done']) assert.equal(isGrown(s, big), false, s);
});

test('REGRESSION: a PROG record is read — title, gist, its own backlog — not printed as a bare id', () => {
  const d = tmp();
  write(d, 'docs/programs/PROG-001-the-website.md',
    '---\nid: PROG-001\ntype: program\nstatus: active\ngist: the site and its upkeep\n---\n\n# PROG-001 — The website\n\n- [ ] **D2** · crop the tiles\n- [x] **D1** · phone hero\n');
  write(d, 'docs/ideas/IDEA-001-a.md', '---\nid: IDEA-001\nstatus: shipped\nprogram: PROG-001\n---\n\n# A\n');
  const rec = readPrograms(d).get('PROG-001');
  assert.equal(rec.title, 'The website');
  assert.equal(rec.gist, 'the site and its upkeep');
  assert.deepEqual([rec.work.open, rec.work.done], [1, 1]);
  const p = programs(d).find((x) => x.name === 'PROG-001');
  assert.equal(p.record.title, 'The website');
  assert.equal(p.members.length, 1);
  rmSync(d, { recursive: true, force: true });
});

test('a PROG record nothing points at yet is still a program', () => {
  const d = tmp();
  write(d, 'docs/programs/PROG-002-x.md', '---\nid: PROG-002\nstatus: active\n---\n\n# PROG-002 — X\n');
  mkdirSync(join(d, 'docs/ideas'), { recursive: true });
  assert.ok(programs(d).some((p) => p.name === 'PROG-002' && p.members.length === 0));
  rmSync(d, { recursive: true, force: true });
});

test('grownRecords offers the in-flight record with three tracks, and nothing else', () => {
  const d = tmp();
  write(d, 'docs/ideas/IDEA-001-big.md', `---\nid: IDEA-001\nstatus: building\n---\n\n# Big\n\n${tracks('ABC')}\n`);
  write(d, 'docs/ideas/IDEA-002-small.md', `---\nid: IDEA-002\nstatus: building\n---\n\n# Small\n\n${tracks('A')}\n`);
  write(d, 'docs/ideas/IDEA-003-done.md', `---\nid: IDEA-003\nstatus: shipped\n---\n\n# Done\n\n${tracks('ABCD', false)}\n`);
  assert.deepEqual(grownRecords(d).map((r) => r.id), ['IDEA-001']);
  rmSync(d, { recursive: true, force: true });
});

test('the program view: members by column, the backlog counted not carded, a grown member named', () => {
  const d = tmp();
  write(d, 'docs/programs/PROG-001-w.md', '---\nid: PROG-001\nstatus: active\ngist: the site\n---\n\n# PROG-001 — The website\n\n- [ ] **D2** · tiles\n');
  write(d, 'docs/ideas/IDEA-001-a.md', `---\nid: IDEA-001\nstatus: building\nprogram: PROG-001\n---\n\n# Grown one\n\n${tracks('ABC')}\n`);
  write(d, 'docs/ideas/IDEA-002-b.md', '---\nid: IDEA-002\nstatus: seedling\nprogram: other\n---\n\n# Not a member\n');
  const out = renderProgramView('t', collectBoard(d), 'prog-001', d);
  assert.match(out, /PROG-001 · The website/);
  assert.match(out, /Building \(1\)[\s\S]*IDEA-001/);
  assert.doesNotMatch(out, /IDEA-002/);
  assert.match(out, /1 open · 0 done/);
  assert.match(out, /IDEA-001.*has grown/);
  rmSync(d, { recursive: true, force: true });
});

test('REGRESSION: boss id PROG works in a project whose IDS.md table predates PROG', async () => {
  const { nextId } = await import('../src/records.js');
  const d = tmp();
  write(d, 'docs/IDS.md', '| `IDEA-NNN` | an idea | `docs/ideas/` |\n| `DEC-NNN` | a decision | `docs/decisions/` |\n');
  assert.equal(nextId(d, 'PROG'), 'PROG-001', '/close and /idea tell a founder to run it');
  write(d, 'docs/programs/PROG-001-x.md', '---\nid: PROG-001\n---\n');
  assert.equal(nextId(d, 'PROG'), 'PROG-002');
  assert.equal(nextId(d, 'CVE'), null, 'still only declared types, plus PROG');
  rmSync(d, { recursive: true, force: true });
});
