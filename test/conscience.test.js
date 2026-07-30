// The conscience runtime — predicates, loop classification, and the voicing contract.
//
// This is the part of BOSS that speaks unprompted, so the rules that matter most are the
// ones about staying SILENT. The eval gate (129 cases) covers moment-by-moment judgment;
// these lock the structural invariants underneath it.

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import {
  loadLoops, classifyLoop, detectSignals, signalAsContext, composeContext,
  GENERIC_FRAME_TAIL, JUDGE_MOMENTS, isMomentMuted, readEvidenceContext,
} from '../stages/L0-quickstart/template/.claude/hooks/lib/loop-runtime.js';
import { parseFrontmatter } from '../stages/L0-quickstart/template/.claude/hooks/lib/yaml.js';
import { STAGES_DIR, STAGE_ORDER } from '../src/paths.js';
import { project, cleanup, idea } from './helpers.js';

after(cleanup);

const loop = (id, fm) => `---\nid: ${id}\ntype: loop\nstage: L0-quickstart\nrunner_type: hook\n${fm}\n---\n\n# ${id}\n`;

// --- the voicing contract -------------------------------------------------

test('REGRESSION §A3: every drift_moment shipped in a loop spec has an authored frame', () => {
  // The bug this locks: `coherence` was declared by BOTH design loops, was runner_type
  // hook, and had no branch in signalAsContext — so a founder whose design drifted got
  // the literal string "signal warrants attention." injected into their session.
  const declared = new Map();
  for (const stageId of STAGE_ORDER) {
    const dir = join(STAGES_DIR, stageId, 'template', 'docs', 'loops');
    if (!existsSync(dir)) continue;
    for (const f of readdirSync(dir).filter((n) => n.endsWith('.md'))) {
      const fm = parseFrontmatter(readFileSync(join(dir, f), 'utf8'));
      if (fm?.type === 'loop' && fm.drift_moment) {
        declared.set(fm.drift_moment, [...(declared.get(fm.drift_moment) || []), fm.id || f]);
      }
    }
  }
  assert.ok(declared.size > 0, 'expected some loops to declare moments');
  for (const [moment, loops] of declared) {
    const frame = signalAsContext({ moment, loop_id: 'probe', confidence: 'low' });
    assert.ok(
      !frame.includes(GENERIC_FRAME_TAIL),
      `moment '${moment}' (declared by ${loops.join(', ')}) has no authored frame`,
    );
  }
});

test('JUDGE_MOMENTS does not name a moment no loop declares', () => {
  const declared = new Set();
  for (const stageId of STAGE_ORDER) {
    const dir = join(STAGES_DIR, stageId, 'template', 'docs', 'loops');
    if (!existsSync(dir)) continue;
    for (const f of readdirSync(dir).filter((n) => n.endsWith('.md'))) {
      const fm = parseFrontmatter(readFileSync(join(dir, f), 'utf8'));
      if (fm?.drift_moment) declared.add(fm.drift_moment);
    }
  }
  for (const m of JUDGE_MOMENTS) assert.ok(declared.has(m), `stale JUDGE_MOMENTS entry: ${m}`);
});

test('the coherence frame distinguishes the MVP and V1 loops', () => {
  const mvp = signalAsContext({ moment: 'coherence', loop_id: 'design-tokens-loop', confidence: 'low' });
  const v1 = signalAsContext({ moment: 'coherence', loop_id: 'design-drift-loop', confidence: 'low' });
  assert.notEqual(mvp, v1, 'the two stages of the same tension need different asks');
  assert.match(mvp, /no token system has been scaffolded yet/);
  assert.match(v1, /raw hex codes are back/);
});

test('an unknown moment degrades to the generic frame rather than throwing', () => {
  // The runtime must never blow up mid-session over an authoring mistake — the release
  // gate is where an unvoiced moment fails, not the founder's prompt.
  const out = signalAsContext({ moment: 'not-a-real-moment', loop_id: 'x', confidence: 'low' });
  assert.ok(out.includes(GENERIC_FRAME_TAIL));
});

test('the voice module imports nothing — it can never introduce a cycle', async () => {
  // moment-frames.js is prose only. If it ever grows an import of the runtime (or fs),
  // the "probe it in isolation" guarantee check-manifests.js relies on breaks.
  const src = readFileSync(
    join(STAGES_DIR, 'L0-quickstart', 'template', '.claude', 'hooks', 'lib', 'moment-frames.js'),
    'utf8',
  );
  assert.ok(!/^\s*import\s/m.test(src), 'moment-frames.js must not import anything');
});

test('the runtime still re-exports the voice, so every existing import site works', async () => {
  const rt = await import('../stages/L0-quickstart/template/.claude/hooks/lib/loop-runtime.js');
  for (const k of ['signalAsContext', 'composeContext', 'GENERIC_FRAME_TAIL', 'JUDGE_MOMENTS']) {
    assert.ok(k in rt, `loop-runtime must re-export ${k}`);
  }
});

// --- classification -------------------------------------------------------

test('entry unmet → unopenable; entry met + exit unmet → open; both met → closed', () => {
  const spec = loop('t', 'entry:\n  - exists: { path: a.md }\nexit:\n  - exists: { path: b.md }\ndrift_moment: caution');
  const none = project({ 'docs/loops/t.md': spec });
  const open = project({ 'docs/loops/t.md': spec, 'a.md': 'x' });
  const closed = project({ 'docs/loops/t.md': spec, 'a.md': 'x', 'b.md': 'y' });
  assert.equal(classifyLoop(loadLoops(none)[0], none).state, 'unopenable');
  assert.equal(classifyLoop(loadLoops(open)[0], open).state, 'open');
  assert.equal(classifyLoop(loadLoops(closed)[0], closed).state, 'closed');
});

test('a loop with no drift_moment is structural and never emits a signal', () => {
  // capture-loop's job is to be canvas-loop's upstream; it must not fire just because a
  // fresh project has no captures. This is the over-fires-on-a-fresh-project failure mode.
  const dir = project({
    'docs/loops/t.md': loop('t', 'entry:\n  - exists: { path: a.md }\nexit:\n  - exists: { path: b.md }'),
    'a.md': 'x',
  });
  assert.deepEqual(detectSignals(dir), []);
});

test('a non-hook runner_type never auto-fires', () => {
  const dir = project({
    'docs/loops/t.md': `---\nid: t\ntype: loop\nrunner_type: skill\nentry:\n  - exists: { path: a.md }\nexit:\n  - exists: { path: b.md }\ndrift_moment: caution\n---\n`,
    'a.md': 'x',
  });
  assert.deepEqual(detectSignals(dir), []);
});

test('an empty project is silent — the most important case', () => {
  assert.deepEqual(detectSignals(project({})), []);
});

test('count_at_least reports its evidence honestly', () => {
  const dir = project({
    'docs/loops/t.md': loop('t', "entry:\n  - count_at_least:\n      path_glob: 'docs/ideas/IDEA-*.md'\n      pattern: '^id:'\n      min: 2\nexit:\n  - exists: { path: nope.md }\ndrift_moment: caution"),
    'docs/ideas/IDEA-001.md': idea('IDEA-001'),
    'docs/ideas/IDEA-002.md': idea('IDEA-002'),
  });
  const { state, entry } = classifyLoop(loadLoops(dir)[0], dir);
  assert.equal(state, 'open');
  assert.equal(entry.results[0].evidence.count, 2);
  assert.equal(entry.results[0].evidence.min, 2);
});

test('a malformed predicate fails closed (no signal), never throws', () => {
  const dir = project({
    'docs/loops/t.md': loop('t', 'entry:\n  - not_a_predicate: { x: 1 }\nexit:\n  - exists: { path: b.md }\ndrift_moment: caution'),
  });
  assert.doesNotThrow(() => detectSignals(dir));
  assert.deepEqual(detectSignals(dir), []);
});

// --- mutes ----------------------------------------------------------------

test('a mute silences until it expires, then the moment speaks again on its own', () => {
  const future = new Date(Date.now() + 60000).toISOString();
  const past = new Date(Date.now() - 60000).toISOString();
  assert.equal(isMomentMuted({ drift: { until: future } }, 'drift'), true);
  assert.equal(isMomentMuted({ drift: { until: past } }, 'drift'), false, 'expired → speaks again');
  assert.equal(isMomentMuted({ drift: { until: null } }, 'drift'), true, 'no expiry → muted until unmuted');
  assert.equal(isMomentMuted({}, 'drift'), false);
});

// --- context composition --------------------------------------------------

test('composeContext is byte-identical when there is no brain/evidence/cohort', () => {
  // The rule every optional read is written to preserve: adding a signal source must not
  // change output for a project that has none of it (that is what keeps the evals stable).
  const s = [{ moment: 'caution', loop_id: 'canvas-loop', confidence: 'low' }];
  assert.equal(composeContext(s, {}), composeContext(s, { cohort: null, brain: null, relationship: null, evidence: null }));
});

test('a declared cohort adds a framing line; an unknown one does not', () => {
  const s = [{ moment: 'caution', loop_id: 'canvas-loop', confidence: 'low' }];
  assert.match(composeContext(s, { cohort: 'first-product' }), /ABSOLUTE BEGINNER/);
  assert.equal(composeContext(s, { cohort: 'nonsense-cohort' }), composeContext(s, {}));
});

test('evidence is read as a projection and absent evidence returns null', () => {
  assert.equal(readEvidenceContext(project({})), null);
  const dir = project({
    'docs/evidence/EVID-001-x.md': '---\nid: EVID-001\ntype: evidence\ngrade: commitment\ndate: 2026-05-01\n---\n\n# EVID-001 — Someone paid\n',
    'docs/evidence/EVID-002-y.md': '---\nid: EVID-002\ntype: evidence\ngrade: stated-pain\ndate: 2026-04-01\n---\n\n# EVID-002 — Someone complained\n',
  });
  const e = readEvidenceContext(dir);
  assert.equal(e.total, 2);
  assert.equal(e.counts.commitment, 1);
  assert.equal(e.recent.id, 'EVID-001', 'most recent by date');
});

test('superseded evidence is excluded from the ledger projection', () => {
  const dir = project({
    'docs/evidence/EVID-001-x.md': '---\nid: EVID-001\ntype: evidence\ngrade: commitment\nstatus: superseded\ndate: 2026-05-01\n---\n\n# EVID-001 — Old\n',
  });
  assert.equal(readEvidenceContext(dir), null);
});
