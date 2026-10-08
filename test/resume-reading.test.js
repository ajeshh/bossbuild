// IDEA-162 — resume lives in the record, and a fraction is not how close a piece of work is.
//
// `n/m` misread all four in-flight records it was tried on: the bottom number is how much has been
// written down so far, and it grows as the work goes. These pin the reading that replaces it — said
// in words, from the record and its own git history — against the four shapes that fooled it:
// closing-but-uphill, stalled on the last item, a backlog that isn't a build, and a shipped record
// whose open lines were found after it shipped.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const LIB = join(ROOT, 'stages', 'L0-quickstart', 'template', '.claude', 'hooks', 'lib', 'resume-reading.js');
const { readRecord, direction, resumeReading, readingLines } = await import(pathToFileURL(LIB).href);

const NOW = Date.parse('2026-10-07T18:00:00Z');
const day = (d) => (d.length === 10 ? `${d}T12:00:00Z` : `2026-${d}T12:00:00Z`);

function repo() {
  const dir = mkdtempSync(join(tmpdir(), 'boss-resume-'));
  mkdirSync(join(dir, 'docs', 'ideas'), { recursive: true });
  mkdirSync(join(dir, 'docs', 'programs'), { recursive: true });
  const env = { ...process.env, GIT_AUTHOR_NAME: 't', GIT_AUTHOR_EMAIL: 't@t', GIT_COMMITTER_NAME: 't', GIT_COMMITTER_EMAIL: 't@t' };
  const git = (...a) => execFileSync('git', a, { cwd: dir, stdio: 'pipe', env });
  git('init', '-q', '-b', 'main');
  return {
    dir,
    // Write a record and commit it on a date, the message naming whatever ids it names.
    commit(rel, text, date, msg) {
      writeFileSync(join(dir, rel), text);
      git('add', '-A');
      execFileSync('git', ['commit', '-q', '-m', msg], { cwd: dir, stdio: 'pipe', env: { ...env, GIT_AUTHOR_DATE: day(date), GIT_COMMITTER_DATE: day(date) } });
    },
    done() { rmSync(dir, { recursive: true, force: true }); },
  };
}

const fm = (o) => `---\n${Object.entries(o).map(([k, v]) => `${k}: ${v}`).join('\n')}\n---\n`;
const boxes = (open, done, label = 'task') => [
  ...Array.from({ length: done }, (_, i) => `- [x] ${label} ${i + 1} done`),
  ...Array.from({ length: open }, (_, i) => `- [ ] ${label} ${done + i + 1} open`),
].join('\n');

test('readRecord: scope is every checkbox except findings and backlogs; answered questions are not open', () => {
  const r = readRecord(`${fm({ id: 'IDEA-001', status: 'building' })}
# x
## Tasks
${boxes(2, 3)}
## Tier 4 — later in the same build
- [ ] tier item
## Found while building
- [ ] found one
- [ ] found two
## Backlog — maybes
- [ ] saved
## Open questions
- Is this still open?
- ~~Was this answered?~~ **Answered:** yes.
- **Q2** · *(answered 2026-10-05: settled.)*
- **Q3** · ~~Name.~~ **Settled by Ajesh.**
`);
  assert.deepEqual(r.scope, { open: 3, done: 3 }, 'Tasks + Tier 4 are scope');
  assert.equal(r.found, 2);
  assert.equal(r.backlog, 1);
  assert.equal(r.questions, 1, 'only the unanswered question is open');
  assert.equal(r.firstOpen, 'task 4 open');
  assert.equal(r.firstQuestion, 'Is this still open?');
});

test('direction: a moving denominator still reads as closing, with what was found on the way', () => {
  const d = direction([
    { date: '2026-10-06', open: 8, done: 8 }, { date: '2026-10-06', open: 7, done: 10 },
    { date: '2026-10-07', open: 5, done: 15 }, { date: '2026-10-07', open: 4, done: 17 },
  ], { now: NOW });
  assert.equal(d.kind, 'closing');
  assert.equal(d.from, 8);
  assert.equal(d.to, 4);
  assert.equal(d.found, 5, '16 items became 21');
});

test('direction: a young record that grew then closed reads as closing from its peak, not growing from its start', () => {
  const d = direction([
    { date: '2026-10-06', open: 3, done: 0 }, { date: '2026-10-06', open: 11, done: 5 },
    { date: '2026-10-07', open: 7, done: 10 }, { date: '2026-10-07', open: 4, done: 17 },
  ], { now: NOW });
  assert.equal(d.kind, 'closing');
  assert.deepEqual([d.from, d.to, d.since], [11, 4, '2026-10-06']);
  assert.equal(d.found, 18, 'three items became twenty-one');
});

test('direction: edited three times on the last item without a tick is stalled, not close', () => {
  const d = direction([
    { date: '2026-10-05', open: 5, done: 0 }, { date: '2026-10-06', open: 1, done: 4 },
    { date: '2026-10-06', open: 1, done: 4 }, { date: '2026-10-07', open: 1, done: 4 },
  ], { now: NOW });
  assert.equal(d.kind, 'stalled');
  assert.equal(d.since, '2026-10-06');
  assert.equal(d.edits, 2);
});

test('direction: more open than the window started with is growing; one point is just new', () => {
  assert.equal(direction([{ date: '2026-10-05', open: 8, done: 0 }, { date: '2026-10-07', open: 9, done: 0 }], { now: NOW }).kind, 'growing');
  assert.equal(direction([{ date: '2026-10-07', open: 3, done: 0 }], { now: NOW }).kind, 'new');
});

test('resumeReading: the four cases that fooled the fraction each read the way their history says', () => {
  const r = repo();
  try {
    // PROG-005's shape: closing fast, tasks found on the way, one question still open → uphill.
    const prog = (o, d) => `${fm({ id: 'PROG-005', type: 'program', status: 'active' })}# PROG-005 — engine\n## Phases\n${boxes(o, d)}\n## Open questions\n- Does the import fold into scout?\n`;
    r.commit('docs/programs/PROG-005-engine.md', prog(8, 8), '10-06', 'PROG-005: phases');
    r.commit('docs/programs/PROG-005-engine.md', prog(6, 11), '10-06', 'PROG-005: two land');
    r.commit('docs/programs/PROG-005-engine.md', prog(4, 17), '10-07', 'PROG-005: more land');
    // IDEA-154's shape: down to one, then edited twice without a tick.
    const stuck = (o, d, note) => `${fm({ id: 'IDEA-154', status: 'building', program: 'PROG-005' })}# IDEA-154 — spec practice\n## Tasks\n${boxes(o, d)}\n## Log\n- ${note}\n`;
    r.commit('docs/ideas/IDEA-154-spec.md', stuck(5, 0, 'a'), '10-05', 'IDEA-154 captured');
    r.commit('docs/ideas/IDEA-154-spec.md', stuck(1, 4, 'b'), '10-06', 'IDEA-154: four done');
    r.commit('docs/ideas/IDEA-154-spec.md', stuck(1, 4, 'c'), '10-06', 'IDEA-154: note');
    r.commit('docs/ideas/IDEA-154-spec.md', stuck(1, 4, 'd'), '10-07', 'IDEA-154: note');
    // PROG-004's shape: a backlog, nothing in scope.
    r.commit('docs/programs/PROG-004-door.md', `${fm({ id: 'PROG-004', type: 'program', status: 'active' })}# PROG-004 — the door\n## Backlog — saved for later passes\n${boxes(9, 0, 'B')}\n`, '10-07', 'PROG-004 backlog');
    // IDEA-153's shape: shipped, its open lines found afterwards.
    r.commit('docs/ideas/IDEA-153-context.md', `${fm({ id: 'IDEA-153', status: 'shipped' })}# IDEA-153 — context\n## Tasks\n${boxes(0, 12)}\n## Found while building\n${boxes(3, 0, 'found')}\n`, '10-06', 'IDEA-153 shipped');
    // IDEA-155's shape: everything ticked, status never moved.
    r.commit('docs/ideas/IDEA-155-engine.md', `${fm({ id: 'IDEA-155', status: 'building' })}# IDEA-155 — engine\n## Tasks\n${boxes(0, 5)}\n`, '10-07', 'IDEA-155 all done');
    // IDEA-107's shape: building, last commit naming it three weeks ago, touched since by a sweep.
    r.commit('docs/ideas/IDEA-107-design.md', `${fm({ id: 'IDEA-107', status: 'building' })}# IDEA-107 — design\n## Tasks\n${boxes(2, 1)}\n`, '09-14', 'IDEA-107: slice one');
    r.commit('docs/ideas/IDEA-107-design.md', `${fm({ id: 'IDEA-107', status: 'building', gist: 'swept' })}# IDEA-107 — design\n## Tasks\n${boxes(2, 1)}\n`, '10-04', 'sweep: gists on every record');
    // A ready record, and one with `next:` written by hand.
    r.commit('docs/ideas/IDEA-147-anatomy.md', `${fm({ id: 'IDEA-147', status: 'ready', next: 'start with C7 (2026-10-05)' })}# IDEA-147 — anatomy\n## Tasks\n${boxes(4, 0)}\n`, '10-05', 'IDEA-147 ready');

    const out = resumeReading(r.dir, { now: NOW, worktrees: [] });
    const by = (group, id) => out[group].find((e) => e.id === id);

    const p5 = by('pickup', 'PROG-005');
    assert.ok(p5, 'the program is in Pick up');
    assert.equal(p5.hill, 'uphill');
    assert.equal(p5.direction.kind, 'closing');
    assert.deepEqual([p5.direction.from, p5.direction.to], [8, 4]);
    assert.deepEqual(p5.members, ['IDEA-154'], 'a program names its members in flight');

    const i154 = by('pickup', 'IDEA-154');
    assert.equal(i154.hill, 'downhill');
    assert.equal(i154.direction.kind, 'stalled');
    assert.equal(out.pickup[0].id, 'IDEA-154', 'downhill and stalled on the last item is the cheapest finish, so it leads');

    assert.ok(by('backlogs', 'PROG-004') && !by('pickup', 'PROG-004'), 'a backlog is not a build');
    assert.equal(by('backlogs', 'PROG-004').backlog, 9);

    for (const g of ['pickup', 'stale', 'cold', 'ready', 'backlogs']) assert.ok(!by(g, 'IDEA-153'), `a shipped record with only findings open is done (not in ${g})`);

    assert.ok(by('stale', 'IDEA-155'), 'every task ticked and still building is a stale status');
    assert.ok(!by('pickup', 'IDEA-155'));

    const cold = by('cold', 'IDEA-107');
    assert.ok(cold && !by('pickup', 'IDEA-107'), 'gone cold by the last commit naming it, not the sweep that touched the file');
    assert.equal(cold.lastWorked, '2026-09-14');

    assert.equal(by('ready', 'IDEA-147').next, 'start with C7 (2026-10-05)', '`next:` wins over the first open task');
    assert.equal(i154.next, 'task 5 open', 'without `next:`, the first open task');
    assert.match(p5.next, /^answer: Does the import fold/, 'uphill, the next step is the open question');

    const text = readingLines(out).join('\n');
    assert.doesNotMatch(text, /\b\d+\s*\/\s*\d+\b|%/, 'no fraction, no percentage, anywhere in the reading');
    assert.match(text, /IDEA-154.*1 left.*no tick since 10-06/);
    assert.match(text, /PROG-005.*8 → 4 open since 10-06.*uphill: 1 question open/);
  } finally { r.done(); }
});

// `land` rebases, which re-stamps every commit's COMMITTER date with the landing time: PROG-005's
// two days of work all read as the day it landed, and "8 → 4 since 10-06" came out "3 → 4 since 10-07".
test('resumeReading: dates are when the work was written (author), not when it landed (committer)', () => {
  const r = repo();
  try {
    const p = (o, d) => `${fm({ id: 'IDEA-170', status: 'building' })}# IDEA-170 — x\n## Tasks\n${boxes(o, d)}\n`;
    const landed = (rel, text, authored, msg) => {
      writeFileSync(join(r.dir, rel), text);
      execFileSync('git', ['add', '-A'], { cwd: r.dir, stdio: 'pipe' });
      execFileSync('git', ['commit', '-q', '-m', msg], { cwd: r.dir, stdio: 'pipe', env: { ...process.env, GIT_AUTHOR_NAME: 't', GIT_AUTHOR_EMAIL: 't@t', GIT_COMMITTER_NAME: 't', GIT_COMMITTER_EMAIL: 't@t', GIT_AUTHOR_DATE: day(authored), GIT_COMMITTER_DATE: day('10-07') } });
    };
    landed('docs/ideas/IDEA-170-x.md', p(8, 0), '10-01', 'IDEA-170 captured');
    landed('docs/ideas/IDEA-170-x.md', p(4, 4), '10-03', 'IDEA-170 half');
    const e = resumeReading(r.dir, { now: NOW, worktrees: [] }).pickup.find((x) => x.id === 'IDEA-170');
    assert.equal(e.direction.kind, 'closing');
    assert.equal(e.direction.since, '2026-10-01');
    assert.equal(e.lastWorked, '2026-10-03');
  } finally { r.done(); }
});

test('resumeReading: an open worktree always shows, whatever its record says', () => {
  const r = repo();
  try {
    r.commit('docs/ideas/IDEA-161-id.md', `${fm({ id: 'IDEA-161', status: 'seedling' })}# IDEA-161 — id\n## Tasks\n${boxes(2, 0)}\n`, '10-07', 'IDEA-161 captured');
    const out = resumeReading(r.dir, { now: NOW, worktrees: ['idea-161'] });
    const e = out.pickup.find((x) => x.id === 'IDEA-161');
    assert.ok(e && e.worktree);
  } finally { r.done(); }
});

test('resumeReading: not a git repo, or no records, reads as empty and never throws', () => {
  const dir = mkdtempSync(join(tmpdir(), 'boss-resume-empty-'));
  try {
    const out = resumeReading(dir, { now: NOW, worktrees: [] });
    assert.deepEqual(Object.values(out).map((g) => g.length), [0, 0, 0, 0, 0]);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

// The surface: `boss board --next` is where the reading shows. Its *Finish* list named a card and said
// "finish it"; it now says how close each piece is, in words, and what to do next.
test('boss board --next shows the reading — state in words, the next step, no fraction', async () => {
  const { board } = await import(pathToFileURL(join(ROOT, 'src', 'board.js')).href);
  const r = repo();
  try {
    const feat = (o, d) => `${fm({ id: 'FEAT-001', type: 'feature', status: 'building', from: 'none' })}# FEAT-001 — the swap\n## Acceptance criteria\n${boxes(o, d, 'criterion')}\n`;
    // board() reads the real clock, so the history is dated from today, not from NOW.
    const ago = (n) => new Date(Date.now() - n * 86400000).toISOString().slice(0, 10);
    r.commit('docs/ideas/FEAT-001-swap.md', feat(4, 0), ago(2), 'FEAT-001 specced');
    r.commit('docs/ideas/FEAT-001-swap.md', feat(1, 3), ago(1), 'FEAT-001: three criteria met');
    const logged = [];
    const orig = console.log;
    console.log = (...a) => logged.push(a.join(' '));
    try { board(r.dir, 'Swapper', { next: true }); } finally { console.log = orig; }
    const out = logged.join('\n').replace(/\x1b\[[0-9;]*m/g, '');
    assert.match(out, /Pick up — in flight \(1\)/);
    assert.match(out, new RegExp(`FEAT-001\\s+4 → 1 open since (${ago(2).slice(5)}|${ago(2)}) · downhill`));
    assert.match(out, /next: criterion 4 open/);
    assert.doesNotMatch(out, /\b\d+\s*\/\s*\d+\b/, 'no fraction');
  } finally { r.done(); }
});

test('the session start in a main checkout names the top work to pick up, in words', () => {
  const r = repo();
  try {
    r.commit('docs/ideas/FEAT-001-swap.md', `${fm({ id: 'FEAT-001', status: 'building' })}# FEAT-001 — swap\n## Acceptance criteria\n- [x] a\n- [ ] the second criterion\n`, new Date().toISOString().slice(0, 10), 'FEAT-001 start');
    const hook = join(ROOT, 'stages', 'L0-quickstart', 'template', '.claude', 'hooks', 'reentry.js');
    const home = mkdtempSync(join(tmpdir(), 'boss-home-'));
    try {
      const out = execFileSync('node', [hook], { input: '{"source":"startup"}', encoding: 'utf8', env: { ...process.env, CLAUDE_PROJECT_DIR: r.dir, BOSS_HOME: home } });
      const ctx = JSON.parse(out).hookSpecificOutput.additionalContext;
      assert.match(ctx, /Where the work in flight stands/);
      assert.match(ctx, /FEAT-001 {2}1 left · downhill/);
      assert.match(ctx, /next: the second criterion/);
    } finally { rmSync(home, { recursive: true, force: true }); }
  } finally { r.done(); }
});

// Found by the pre-land review (IDEA-158): three shapes a founder's tree has and BOSS's own didn't.
test('readRecord: a heading that says "founder" is scope, not findings; a ticked question is answered', () => {
  const r = readRecord(`# x\n## What the founder sees\n- [ ] the swap shows\n## Found while building\n- [ ] later\n## Open questions\n- [x] Is it done?\n- [ ] Who confirms it?\n`);
  assert.deepEqual(r.scope, { open: 1, done: 0 });
  assert.equal(r.found, 1);
  assert.equal(r.questions, 1);
  assert.equal(r.firstQuestion, 'Who confirms it?');
});

test('resumeReading: a project in a subfolder of its repo still reads its history', () => {
  const r = repo();
  try {
    mkdirSync(join(r.dir, 'app', 'docs', 'ideas'), { recursive: true });
    const f = (o, d) => `${fm({ id: 'FEAT-002', status: 'building' })}# FEAT-002 — x\n## Acceptance criteria\n${boxes(o, d)}\n`;
    r.commit('app/docs/ideas/FEAT-002-x.md', f(3, 0), '10-04', 'FEAT-002 specced');
    r.commit('app/docs/ideas/FEAT-002-x.md', f(1, 2), '10-05', 'FEAT-002: two met');
    const e = resumeReading(join(r.dir, 'app'), { now: NOW, worktrees: [] }).pickup.find((x) => x.id === 'FEAT-002');
    assert.equal(e.direction.kind, 'closing');
    assert.deepEqual([e.direction.from, e.direction.to], [3, 1]);
  } finally { r.done(); }
});
