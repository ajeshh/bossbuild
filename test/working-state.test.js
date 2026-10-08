// IDEA-153 — the work in flight survives a compaction.
//
// A compaction keeps the chat's summary and drops path-scoped rules and every task found mid-session
// that was never written down. BOSS's working-state file lived in `.claude/rules/` (dropped at
// compaction), its own copy here rotted for three weeks, and `reentry.js` returned early on the one
// source the host gives for re-loading state: `compact`. These cover the state moving into the
// records and the session start reading it back.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const HOOKS = join(ROOT, 'stages', 'L0-quickstart', 'template', '.claude', 'hooks');
const { workingState, STATE_CAP } = await import(pathToFileURL(join(HOOKS, 'lib', 'working-state.js')).href);
const { composeContext, MOMENT_PRIORITY } = await import(pathToFileURL(join(HOOKS, 'lib', 'loop-runtime.js')).href);

// The host's cap on a hook's injected string: past it, the text is swapped for a file path and a
// 2,000-character preview (hooks reference, checked 2026-10-06).
const HOST_CAP = 10_000;

function proj(files) {
  const d = mkdtempSync(join(tmpdir(), 'boss-ws-'));
  for (const [rel, body] of Object.entries(files)) {
    mkdirSync(dirname(join(d, rel)), { recursive: true });
    writeFileSync(join(d, rel), body);
  }
  return d;
}

const FEAT = `---
id: FEAT-001
type: feature
status: building
program: PROG-001
---

# Checkout

## Acceptance criteria

- [ ] pay with a card
- [x] see a total

## Found while building

- [ ] the refund path needs
  a rollback too
- [ ] (task — what, in the words you'd use to pick it up cold)

## Open questions

- (the question · why it is still open · what would settle it)
- behind a flag, or not?
`;

const PROG = `---
id: PROG-001
type: program
status: active
---

# PROG-001 — Payments

## Rules every change carries

- **Money paths get a test.** No exceptions.

## Tasks

- [ ] T1 · receipts by email
- [x] T0 · done already
`;

function hook(dir, source) {
  const out = execFileSync('node', [join(HOOKS, 'reentry.js')], {
    input: JSON.stringify({ hook_event_name: 'SessionStart', source }),
    encoding: 'utf8', cwd: dir,
    env: { ...process.env, CLAUDE_PROJECT_DIR: dir, HOME: dir, USERPROFILE: dir },
  });
  return out.trim() ? JSON.parse(out).hookSpecificOutput.additionalContext : '';
}

test('a building FEAT comes back with its program — open lines only, placeholders skipped, wraps joined', () => {
  const d = proj({ 'docs/ideas/FEAT-001-checkout.md': FEAT, 'docs/programs/PROG-001-payments.md': PROG });
  const { text, records } = workingState(d);
  assert.deepEqual(records, ['docs/ideas/FEAT-001-checkout.md', 'docs/programs/PROG-001-payments.md']);
  assert.match(text, /pay with a card/);
  assert.doesNotMatch(text, /see a total/, 'a ticked criterion is done, not in flight');
  assert.match(text, /the refund path needs a rollback too/, 'a wrapped item is one item');
  assert.doesNotMatch(text, /in the words you'd use/, "the template's example line is not work");
  assert.match(text, /behind a flag, or not\?/);
  assert.match(text, /Money paths get a test/, "the program's rules bind its features");
  assert.match(text, /receipts by email/);
  assert.doesNotMatch(text, /done already/);
});

test('after a compaction the session start re-loads it, and says the record beats the summary', () => {
  const d = proj({ 'docs/ideas/FEAT-001-checkout.md': FEAT, 'docs/programs/PROG-001-payments.md': PROG });
  const ctx = hook(d, 'compact');
  assert.match(ctx, /just compacted/);
  assert.match(ctx, /the record is right/);
  assert.match(ctx, /the refund path needs a rollback too/);
  assert.match(hook(d, 'clear'), /just cleared/);
  assert.match(hook(d, 'startup'), /work in flight/);
});

test('nothing in flight, nothing said — on every source', () => {
  const d = proj({ 'docs/ideas/FEAT-002-x.md': FEAT.replace('status: building', 'status: shipped') });
  for (const source of ['compact', 'clear', 'startup']) assert.equal(hook(d, source), '', source);
});

test("a worktree named for a record brings that record, not every building FEAT", () => {
  const d = proj({
    'docs/ideas/FEAT-001-checkout.md': FEAT,
    'docs/ideas/IDEA-007-search.md': '---\nid: IDEA-007\nstatus: building\n---\n# Search\n\n## Tasks\n\n- [ ] index the titles\n',
  });
  const { text, records } = workingState(d, { worktree: 'idea-007' });
  assert.deepEqual(records, ['docs/ideas/IDEA-007-search.md']);
  assert.match(text, /index the titles/);
  assert.doesNotMatch(text, /Checkout/);
});

test('a Quickstart project (no FEAT yet) gets its venture idea back', () => {
  const d = proj({ 'docs/ideas/IDEA-001-kettles.md': '---\nid: IDEA-001\nkind: venture\nstatus: seedling\n---\n# Kettles that tell you\n\n## Current shape\n\nA kettle that texts when it boils.\n\n## Capture log\n\n- 2026-10-01 first thought\n\n## Open questions\n\n- who pays?\n' });
  const { text } = workingState(d);
  assert.match(text, /no feature is being built yet/);
  assert.match(text, /texts when it boils/);
  assert.match(text, /who pays\?/);
  assert.doesNotMatch(text, /first thought/, 'the capture log is history, not state');
});

test("a founder's older feature-context.md is still read, never moved or deleted", () => {
  const legacy = '# Working context\n\n## Found while building\n\n- [ ] the old list item\n- [x] gone\n';
  const d = proj({ '.claude/rules/feature-context.md': legacy });
  assert.match(workingState(d).text, /the old list item/);
  assert.equal(readFileSync(join(d, '.claude/rules/feature-context.md'), 'utf8'), legacy);
});

test('a huge record stays far under the host cap', () => {
  const many = Array.from({ length: 400 }, (_, i) => `- [ ] task ${i} ${'x'.repeat(300)}`).join('\n');
  const d = proj({ 'docs/ideas/FEAT-001-big.md': `---\nid: FEAT-001\nstatus: building\n---\n# Big\n\n## Found while building\n\n${many}\n` });
  const ctx = hook(d, 'compact');
  assert.ok(workingState(d).text.length <= STATE_CAP);
  assert.ok(ctx.length < HOST_CAP, `${ctx.length} chars`);
  assert.match(ctx, /more in docs\/ideas\/FEAT-001-big\.md/, 'the rest is pointed at, not dropped silently');
});

// The bug this guards reached BOSS's own sessions: 17 of 80 logged conscience fires between
// 2026-09-09 and 2026-09-23 were 10,155–13,153 characters, so the host replaced each with a file path
// and a 2,000-character preview — the frame's judgment and calibration never reached the model.
// IDEA-121 (one voiced frame) fixed it; this keeps the worst case under the cap.
test('the conscience at its largest stays under the host cap', () => {
  const src = readFileSync(join(HOOKS, 'lib', 'moment-frames.js'), 'utf8');
  const block = src.slice(src.indexOf('const COHORT_FRAMING'), src.indexOf('};', src.indexOf('const COHORT_FRAMING')));
  const cohorts = [...block.matchAll(/^\s+'?([a-z-]+)'?:/gm)].map((m) => m[1]);
  assert.ok(cohorts.length >= 5, 'found the cohorts');
  const ev = { session_minutes: 999, durable_file: 'docs/ideas/FEAT-123-a-long-name.md', durable_stale_minutes: 999, names: ['a.js', 'b.js', 'c.js', 'd.js'], count: 99, min: 3 };
  const opts = {
    brain: 'b'.repeat(1400), relationship: 'r'.repeat(900),
    evidence: { counts: { 'stated-pain': 9, 'observed-behavior': 9, commitment: 9 }, total: 27, recent: { id: 'EVID-099', grade: 'commitment', title: 't'.repeat(200) } },
    intent: { id: 'IDEA-001', motivation: 'learning', success: 's'.repeat(300) },
    isInstalled: () => false,
  };
  let worst = { n: 0 };
  for (const moment of MOMENT_PRIORITY) {
    const signals = [moment, ...MOMENT_PRIORITY.filter((m) => m !== moment).slice(0, 6)]
      .map((m) => ({ loop_id: `${m}-loop`, moment: m, confidence: 'high', evidence: ev }));
    for (const cohort of cohorts) {
      const n = composeContext(signals, { ...opts, cohort }).length;
      if (n > worst.n) worst = { n, moment, cohort };
    }
  }
  assert.ok(worst.n < HOST_CAP, `${worst.moment} × ${worst.cohort}: ${worst.n} chars`);
});

// IDEA-158: the "no" is what a summary drops, and a session without it extends the work in good faith.
test('the no-list comes back first — out of scope, not adopted, a program\'s refusals', () => {
  const feat = FEAT.replace('## Found while building', '## Out of scope\n\n- …\n- refunds — a later FEAT\n\n## Found while building');
  const prog = PROG.replace('## Tasks', '## What this program refuses\n\n- a second payment provider\n\n## Tasks');
  const d = proj({ 'docs/ideas/FEAT-001-checkout.md': feat, 'docs/programs/PROG-001-payments.md': prog });
  const { text } = workingState(d);
  assert.match(text, /Decided not to do:\n\s+- refunds — a later FEAT/);
  assert.match(text, /a second payment provider/);
  assert.doesNotMatch(text, /- …/, 'the template placeholder is not a decision');
  assert.ok(text.indexOf('refunds') < text.indexOf('pay with a card'), 'the no comes before the open work');
});

test('a FEAT kept as a folder per record, in the project\'s own layout.records, is read at session start (IDEA-163)', () => {
  const dir = mkdtempSync(join(tmpdir(), 'ws-layout-'));
  mkdirSync(join(dir, 'docs', 'features', 'FEAT-001-login'), { recursive: true });
  mkdirSync(join(dir, '.boss'), { recursive: true });
  writeFileSync(join(dir, '.boss', 'config.json'), JSON.stringify({ layout: { records: ['docs/features'] } }));
  writeFileSync(join(dir, 'docs', 'features', 'FEAT-001-login', 'README.md'),
    '---\nid: FEAT-001\nstatus: building\n---\n# FEAT-001 — Login\n\n## Acceptance criteria\n- [ ] a user can sign in\n');
  const s = workingState(dir);
  assert.ok(s, 'a FEAT in build is said');
  assert.match(s.text, /docs\/features\/FEAT-001-login\/README\.md \(building\)/);
  assert.match(s.text, /a user can sign in/);
});
