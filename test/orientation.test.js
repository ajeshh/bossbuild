// The two orientation reads on `boss status` (EVID-001 facets 3 + 5) — see src/orientation.js.
//
// These shell out to `bin/boss` for the rendering contract, because that is what a founder
// actually reads, and call the parsers directly for the date arithmetic, which is where the
// off-by-one lives. Dates are computed from `now` rather than hard-coded so the suite does
// not quietly start passing for the wrong reason six months from now.

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { BOSS_ROOT } from '../src/paths.js';
import { readDevlogHead, awayDays, REENTRY_DAYS } from '../src/orientation.js';
import { project, cleanup } from './helpers.js';

after(cleanup);

const BIN = join(BOSS_ROOT, 'bin', 'boss');

function boss(args, cwd) {
  try {
    return execFileSync('node', [BIN, ...args], {
      cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'],
      env: { ...process.env, NO_COLOR: '1', HOME: cwd },
    });
  } catch (e) {
    return (e.stdout || '') + (e.stderr || '');
  }
}

const DAY = 86400000;
const daysAgo = (n) => new Date(Date.now() - n * DAY).toISOString().slice(0, 10);

const mvp = (extra = {}) => project({
  '.boss/manifest.json': JSON.stringify({
    name: 'p', bossVersion: '0.0.1', stage: 'L1-mvp', mode: 'MVP',
    installedLayers: ['L0-quickstart', 'L1-mvp'],
    agents: [], hooks: [], loops: [], skills: ['triage', 'spec', 'log', 'close', 'evidence'],
  }),
  '.boss/config.json': '{}',
  ...extra,
});

const devlog = (date, { landed = 'the callback round-trips a session', next = 'wire token refresh', feat = null } = {}) =>
  `# Devlog\n\n## ${date}\n${feat ? `- **FEAT:** ${feat}\n` : ''}${landed ? `- **Landed:** ${landed}\n` : ''}${next ? `- **Next:** ${next}\n` : ''}`;

const evid = (id, grade, { status = 'active' } = {}) =>
  `---\nid: ${id}\ntype: evidence\nowner: f\nstatus: ${status}\n${grade ? `grade: ${grade}\n` : ''}date: 2026-01-01\n---\n\n# ${id}\n`;

// --- re-entry -------------------------------------------------------------

test('the bridge back names the gap, what landed, and what you said was next', () => {
  const out = boss(['status'], mvp({ 'docs/devlog.md': devlog(daysAgo(8)) }));
  assert.match(out, /Back after 8 days/);
  assert.match(out, /the callback round-trips a session/);
  assert.match(out, /You said next:\s+wire token refresh/);
});

test('it stays silent for a founder who was here yesterday', () => {
  // The whole value is the gap. Printing "back after 1 day" to someone mid-flow is noise,
  // and noise is what spends the trust the moment needs when it matters.
  for (const n of [0, 1, REENTRY_DAYS - 1]) {
    const out = boss(['status'], mvp({ 'docs/devlog.md': devlog(daysAgo(n)) }));
    assert.ok(!/Back after/.test(out), `must be silent at ${n} days away`);
  }
});

test('it stays silent when there is no devlog at all', () => {
  // A project with no devlog has not gone quiet, it has not started. Same distinction the
  // `quiet_for` predicate draws, and for the same reason.
  const out = boss(['status'], mvp());
  assert.ok(!/Back after/.test(out));
  assert.match(out, /You are here/, 'the rest of status must still render');
});

test('a missing Next is named rather than papered over', () => {
  const out = boss(['status'], mvp({ 'docs/devlog.md': devlog(daysAgo(10), { next: null }) }));
  assert.match(out, /Back after 10 days/);
  assert.match(out, /No "next" was recorded/);
});

test('with no Landed it falls back to the FEAT, and never invents a summary', () => {
  const out = boss(['status'], mvp({ 'docs/devlog.md': devlog(daysAgo(10), { landed: null, feat: 'FEAT-002 billing' }) }));
  assert.match(out, /FEAT-002 billing/);
});

test('the newest entry wins even when the devlog is not in newest-first order', () => {
  // Newest-at-the-top is a convention the skill states, not a guarantee the file carries.
  const root = mvp({
    'docs/devlog.md': `# Devlog\n\n## ${daysAgo(30)}\n- **Landed:** the old one\n\n## ${daysAgo(9)}\n- **Landed:** the recent one\n`,
  });
  assert.equal(readDevlogHead(root).landed, 'the recent one');
  assert.equal(awayDays(root), 9);
});

test('awayDays is null with no devlog rather than zero', () => {
  // Zero would read as "you were here today", which is a claim about the founder BOSS
  // has no basis for. Absent and zero are different facts.
  assert.equal(awayDays(mvp()), null);
});

// --- evidence headway -----------------------------------------------------

test('every rung prints, zeros included', () => {
  const out = boss(['status'], mvp({ 'docs/evidence/EVID-001-a.md': evid('EVID-001', 'stated-pain') }));
  assert.match(out, /1 stated-pain/);
  assert.match(out, /0 observed/, 'an empty rung must be shown, not omitted');
  assert.match(out, /0 commitment/);
});

test('a bottom-heavy ladder says so instead of congratulating motion', () => {
  const out = boss(['status'], mvp({ 'docs/evidence/EVID-001-a.md': evid('EVID-001', 'stated-pain') }));
  assert.match(out, /a compliment is not a receipt/);
});

test('the nudge goes away once something has actually been observed', () => {
  const out = boss(['status'], mvp({ 'docs/evidence/EVID-002-b.md': evid('EVID-002', 'observed-behavior') }));
  assert.match(out, /1 observed/);
  assert.ok(!/a compliment is not a receipt/.test(out));
});

test('an ungraded EVID is counted, not silently dropped', () => {
  // The failure this guards is the one `check:site`'s citation gauge shipped: a metric that
  // improves when you forget a field, because the forgotten item never reaches the
  // denominator. An ungraded signal is uncounted, not absent.
  const out = boss(['status'], mvp({
    'docs/evidence/EVID-001-a.md': evid('EVID-001', 'stated-pain'),
    'docs/evidence/EVID-002-b.md': evid('EVID-002', null),
  }));
  assert.match(out, /1 stated-pain/);
  assert.match(out, /1 ungraded/);
});

test('a superseded EVID is not reported as ungraded', () => {
  const out = boss(['status'], mvp({
    'docs/evidence/EVID-001-a.md': evid('EVID-001', 'stated-pain'),
    'docs/evidence/EVID-002-b.md': evid('EVID-002', null, { status: 'superseded' }),
  }));
  assert.ok(!/ungraded/.test(out), 'superseded is deliberately excluded, not uncounted');
});

test('no ledger and an ungraded ledger read differently', () => {
  const none = boss(['status'], mvp());
  assert.match(none, /nothing captured yet/);

  const ungraded = boss(['status'], mvp({ 'docs/evidence/EVID-001-a.md': evid('EVID-001', null) }));
  assert.match(ungraded, /none graded/);
  assert.ok(!/nothing captured yet/.test(ungraded), 'an unweighed signal is not a missing one');
});

test('the evidence read never renders a percentage or a total-only score', () => {
  // Both shapes only go up, which makes them comfort devices rather than orientation.
  // Streaks are a live entry in BOSS's own dark-pattern catalog.
  const out = boss(['status'], mvp({
    'docs/evidence/EVID-001-a.md': evid('EVID-001', 'stated-pain'),
    'docs/evidence/EVID-002-b.md': evid('EVID-002', 'commitment'),
  }));
  const line = out.split('\n').find((l) => l.includes("What you've learned")) || '';
  assert.ok(!/%/.test(line), 'no percentage');
  assert.ok(!/\b(streak|day streak|in a row)\b/i.test(line), 'no streak');
  assert.match(line, /1 stated-pain · 0 observed · 1 commitment/, 'the ladder is the whole render');
});
