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
import { readDevlogHead, awayDays, REENTRY_DAYS, RESUME_WINDOW, resumeLines } from '../src/orientation.js';
import { project, cleanup } from './helpers.js';

after(cleanup);

const BIN = join(BOSS_ROOT, 'bin', 'boss');

function boss(args, cwd) {
  try {
    return execFileSync('node', [BIN, ...args], {
      cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'],
      env: { ...process.env, NO_COLOR: '1', HOME: cwd, USERPROFILE: cwd },
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
    agents: [], hooks: [], loops: [], skills: ['idea', 'spec', 'log', 'close', 'evidence'],
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

// --- the SessionStart runner (IDEA-077) -----------------------------------
//
// `boss status` answers "what was I doing" only for a founder who remembers to type it — in a
// product that lives inside Claude Code, where they just start typing, and (with Remote Control)
// may have no terminal at all. These cover the hook that asks the question where it is asked.

const HOOK = join(BOSS_ROOT, 'stages', 'L0-quickstart', 'template', '.claude', 'hooks', 'reentry.js');

// Runs the hook the way the host does: JSON on stdin, project dir in the env. HOME is redirected
// so the once-per-date marker (DEC-015 per-person state) never touches a real home.
function hook(dir, source = 'startup') {
  return execFileSync('node', [HOOK], {
    input: JSON.stringify({ hook_event_name: 'SessionStart', source }),
    encoding: 'utf8', cwd: dir,
    env: { ...process.env, CLAUDE_PROJECT_DIR: dir, HOME: dir, USERPROFILE: dir },
  });
}

test('the hook hands Claude the way back in when the founder returns', () => {
  const dir = mvp({ 'docs/devlog.md': devlog(daysAgo(9)) });
  const out = JSON.parse(hook(dir));
  assert.equal(out.hookSpecificOutput.hookEventName, 'SessionStart');
  const ctx = out.hookSpecificOutput.additionalContext;
  assert.match(ctx, /back after 9 days/i);
  assert.match(ctx, /the callback round-trips a session/);
  assert.match(ctx, /They said next: wire token refresh/);
});

test('the hook is silent for a founder who was here yesterday', () => {
  // Silence on the day after a session is the REQUIREMENT, not the fallback — this hook is
  // registered by default, so every byte it emits is paid for on every session.
  assert.equal(hook(mvp({ 'docs/devlog.md': devlog(daysAgo(1)) })).trim(), '');
});

test('the hook is silent in a project that has not started', () => {
  // No devlog is a Quickstart project, not a quiet one. This is why the hook can ship registered
  // at L0 at all: it is silent by construction until `/log` arrives with MVP.
  assert.equal(hook(mvp()).trim(), '');
});

test('the hook does not fire mid-session on /clear or a compaction', () => {
  // `clear` and `compact` are SessionStart sources, but the founder never left. Firing there is
  // the over-fire the conscience spends its whole design avoiding.
  const dir = mvp({ 'docs/devlog.md': devlog(daysAgo(9)) });
  for (const source of ['clear', 'compact']) {
    assert.equal(hook(dir, source).trim(), '', `fired on ${source}`);
  }
});

test('the hook says it once per devlog date, not once per session', () => {
  // Opening three sessions in an afternoon must not replay the same line three times.
  const dir = mvp({ 'docs/devlog.md': devlog(daysAgo(9)) });
  assert.notEqual(hook(dir).trim(), '', 'the first arrival should speak');
  assert.equal(hook(dir).trim(), '', 'the second must not');
});

test('boss status and the hook never disagree about how long you were away', () => {
  // The cross-surface invariant this whole extraction exists for: one implementation, two
  // surfaces. A second copy is how two surfaces end up individually correct and contradicting.
  const dir = mvp({ 'docs/devlog.md': devlog(daysAgo(11)) });
  const fromHook = JSON.parse(hook(dir)).hookSpecificOutput.additionalContext;
  const fromCli = boss(['status'], dir);
  assert.match(fromHook, /back after 11 days/i);
  assert.match(fromCli, /Back after 11 days/);
});

// --- toward what (IDEA-097) ------------------------------------------------

const idea = (id, fields = '') =>
  `---\nid: ${id}\ntype: idea\nowner: product-lead\nstatus: seedling\ngist: x\n${fields}created: 2026-09-01\n---\n\n# ${id} — x\n`;

test('status prints the founder\'s own "it worked" sentence once, when they gave one', () => {
  const out = boss(['status'], mvp({
    'docs/ideas/IDEA-001-a.md': idea('IDEA-001', 'motivation: community\nsuccess_looks_like: "ten strangers still posting in March"\n'),
  }));
  assert.match(out, /Toward:\s+“ten strangers still posting in March”\s+\(community\)/);
  assert.equal((out.match(/Toward:/g) || []).length, 1, 'once');
});

test('status says nothing about intent when it was never asked or was skipped', () => {
  // Silence, not a prompt to fill it in — an unset motivation is a founder who skipped, and
  // the one thing this line must never become is a nag.
  assert.doesNotMatch(boss(['status'], mvp({ 'docs/ideas/IDEA-001-a.md': idea('IDEA-001') })), /Toward:/);
  assert.doesNotMatch(boss(['status'], mvp({ 'docs/ideas/IDEA-001-a.md': idea('IDEA-001', 'motivation: unset\nsuccess_looks_like: ""\n') })), /Toward:/);
});

// --- the briefing's window (IDEA-102) --------------------------------------

const resumeOf = (n) => `# RESUME\n${Array.from({ length: n - 1 }, (_, i) => `- line ${i}`).join('\n')}`;

test('boss status says nothing about RESUME while it is inside its window', () => {
  const out = boss(['status'], mvp({ 'docs/RESUME.md': resumeOf(RESUME_WINDOW) }));
  assert.ok(!/past its .*-line window/.test(out), 'must be silent at exactly the window');
});

test('boss status prints one line, and says MOVE not trim, when RESUME is past its window', () => {
  const dir = mvp({ 'docs/RESUME.md': resumeOf(RESUME_WINDOW + 37) });
  assert.equal(resumeLines(dir), RESUME_WINDOW + 37);
  const out = boss(['status'], dir);
  assert.match(out, new RegExp(`docs/RESUME.md\\s+is ${RESUME_WINDOW + 37} lines — past its ${RESUME_WINDOW}-line window`));
  assert.match(out, /move what has shipped to the devlog/);
  assert.match(out, /don't trim it/, 'the fix is a move, and the line says so');
  assert.equal((out.match(/past its/g) || []).length, 1, 'one line, not a block');
});

test('a project with no RESUME yet is not told it is past a window', () => {
  const dir = mvp();
  assert.equal(resumeLines(dir), null);
  const out = boss(['status'], dir);
  assert.ok(!/RESUME\.md/.test(out));
});

// --- a titled entry is still a dated entry (IDEA-102) ------------------------

test('the re-entry read accepts a devlog heading with a title after the date', () => {
  const dir = mvp({ 'docs/devlog.md': `# Devlog\n\n## ${daysAgo(9)} (later — the vet sweep, v0.315.0)\n- **Landed:** the sweep\n- **Next:** publish\n\n## ${daysAgo(30)}\n- **Landed:** old\n- **Next:** older\n` });
  const head = readDevlogHead(dir);
  assert.equal(head.date, daysAgo(9), 'the titled entry is the newest, and must win');
  assert.equal(head.next, 'publish');
  assert.match(boss(['status'], dir), /Back after 9 days/);
});

test('a heading that merely starts with digits is not a date', () => {
  const dir = mvp({ 'docs/devlog.md': `# Devlog\n\n## 2026-09-1 not a date\n- **Next:** no\n\n## ${daysAgo(12)}\n- **Next:** yes\n` });
  assert.equal(readDevlogHead(dir).next, 'yes');
});
