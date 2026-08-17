// Scaffolding, sync and the stage ladder — the machinery that writes into a founder's
// repo. The non-destructive guarantees here are the ones that cost trust if they break.

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { resolveStageId, STAGE_ORDER, STAGES_DIR } from '../src/paths.js';
import { loadModes, modeWord, skillGloss } from '../src/modes.js';
import { readStageManifest, appendMarkedBlock, applyStageSafe } from '../src/scaffold.js';
import { canonicalLayer, computeSettingsMerge, planSync } from '../src/sync.js';
import { detectStage } from '../src/detect.js';
import { project, cleanup } from './helpers.js';

after(cleanup);

// --- the ladder -----------------------------------------------------------

test('resolveStageId accepts the full id, the level, and the mode word', () => {
  for (const input of ['L1-mvp', 'l1', 'mvp', 'MVP']) {
    assert.equal(resolveStageId(input), 'L1-mvp', `failed on ${input}`);
  }
  assert.equal(resolveStageId('v9'), undefined);
  assert.equal(resolveStageId(''), undefined);
  assert.equal(resolveStageId(undefined), undefined);
});

test('modeWord strips the level prefix — the vocabulary users actually type', () => {
  assert.deepEqual(STAGE_ORDER.map(modeWord), ['quickstart', 'mvp', 'v1', 'scale']);
});

test('canonicalLayer maps a stale pin forward by level', () => {
  assert.equal(canonicalLayer('L0-sketch'), 'L0-quickstart');
  assert.equal(canonicalLayer('L1-mvp'), 'L1-mvp');
  assert.equal(canonicalLayer('nonsense'), undefined);
});

test('every authored stage has the fields the CLI and docs read', () => {
  for (const m of loadModes().filter((x) => x.authored)) {
    assert.ok(m.name, `${m.id} has no name`);
    assert.ok(m.summary, `${m.id} has no summary`);
    assert.ok(Array.isArray(m.skills), `${m.id} skills not an array`);
    assert.ok(Array.isArray(m.headline), `${m.id} headline not an array`);
  }
});

test('REGRESSION §A2: every manifest entry resolves to a real template file', () => {
  // L3 declared `operate-loop` with no spec for four releases; `boss unlock scale` stamped
  // it into every project and both sync and the conscience skipped it silently.
  for (const stageId of STAGE_ORDER) {
    let m;
    try { m = readStageManifest(stageId); } catch { continue; }
    const base = join(process.cwd(), 'stages', stageId, 'template');
    for (const s of m.skills || []) {
      assert.ok(existsSync(join(base, '.claude', 'skills', s, 'SKILL.md')), `${stageId}: skill ${s} has no SKILL.md`);
    }
    for (const a of m.agents || []) {
      assert.ok(existsSync(join(base, '.claude', 'agents', `${a}.md`)), `${stageId}: agent ${a} has no file`);
    }
    for (const l of m.loops || []) {
      assert.ok(existsSync(join(base, 'docs', 'loops', `${l}.md`)), `${stageId}: loop ${l} has no spec`);
    }
  }
});

test('a headline never names a skill the rung does not have', () => {
  // A stale headline would silently shrink `boss map`'s preview to nothing.
  for (const m of loadModes().filter((x) => x.authored)) {
    for (const h of m.headline) {
      assert.ok(m.skills.includes(h), `${m.id}: headline '${h}' is not in skills`);
    }
  }
});

test('skillGloss splits the house description format', () => {
  assert.deepEqual(skillGloss('/does/not/exist'), { gloss: '', usage: '' });
});

// --- non-destructive adopt ------------------------------------------------

test('appendMarkedBlock is idempotent — re-applying is a no-op', () => {
  const dir = project({ 'CLAUDE.md': '# Mine\n\nmy rules\n' });
  const f = join(dir, 'CLAUDE.md');
  assert.equal(appendMarkedBlock(f, 'adopt', 'BOSS block'), true);
  assert.equal(appendMarkedBlock(f, 'adopt', 'BOSS block'), false, 'second apply must be a no-op');
  const body = readFileSync(f, 'utf8');
  assert.match(body, /# Mine/, "the founder's content survives");
  assert.equal((body.match(/boss:adopt start/g) || []).length, 1);
});

test('applyStageSafe never clobbers a file the founder already has', () => {
  const dir = project({ 'CLAUDE.md': 'MINE — DO NOT TOUCH\n' });
  const r = applyStageSafe('L0-quickstart', dir, {
    PROJECT_NAME: 'p', DATE: '2026-01-01', BOSS_VERSION: '0.0.0', STAGE: 'L0-quickstart', MODE: 'Quickstart',
  });
  assert.equal(readFileSync(join(dir, 'CLAUDE.md'), 'utf8'), 'MINE — DO NOT TOUCH\n');
  assert.ok(r.skipped.some((p) => p.endsWith('CLAUDE.md')), 'CLAUDE.md should be reported as skipped');
  assert.ok(r.copied.length > 0, 'other files should still land');
});

test('placeholders are substituted in copied files only', () => {
  const dir = project({});
  applyStageSafe('L0-quickstart', dir, {
    PROJECT_NAME: 'zebra', DATE: '2026-01-01', BOSS_VERSION: '9.9.9', STAGE: 'L0-quickstart', MODE: 'Quickstart',
  });
  const claude = readFileSync(join(dir, 'CLAUDE.md'), 'utf8');
  assert.match(claude, /zebra/);
  assert.ok(!claude.includes('{{PROJECT_NAME}}'), 'no unsubstituted placeholders may ship');
});

// --- settings merge -------------------------------------------------------

test('settings merge is additive and idempotent — a founder keeps their own config', () => {
  const dir = project({
    '.claude/settings.json': JSON.stringify({
      permissions: { allow: ['Bash(my-tool:*)'] },
      hooks: { UserPromptSubmit: [{ matcher: '', hooks: [{ type: 'command', command: 'my-own-hook.sh' }] }] },
    }, null, 2),
  });
  const first = computeSettingsMerge(dir, ['L0-quickstart']);
  assert.equal(first.changed, true);
  assert.deepEqual(first.merged.permissions.allow, ['Bash(my-tool:*)'], 'the allow list is never widened');
  const cmds = first.merged.hooks.UserPromptSubmit.flatMap((e) => e.hooks.map((h) => h.command));
  assert.ok(cmds.includes('my-own-hook.sh'), "the founder's hook survives");
  assert.ok(cmds.some((c) => c.includes('conscience.js')), "BOSS's hook is registered");

  writeFileSync(join(dir, '.claude', 'settings.json'), JSON.stringify(first.merged, null, 2));
  assert.equal(computeSettingsMerge(dir, ['L0-quickstart']).changed, false, 're-merging must be a no-op');
});

test('the v0.18 bash→node hook migration drops the stale command', () => {
  const dir = project({
    '.claude/settings.json': JSON.stringify({
      hooks: { UserPromptSubmit: [{ matcher: '', hooks: [{ type: 'command', command: 'bash .claude/hooks/conscience.sh' }] }] },
    }),
  });
  const cmds = computeSettingsMerge(dir, ['L0-quickstart']).merged.hooks.UserPromptSubmit
    .flatMap((e) => e.hooks.map((h) => h.command));
  assert.ok(!cmds.some((c) => c.includes('conscience.sh')), 'the stale bash entry must be removed');
  assert.ok(cmds.some((c) => c.includes('conscience.js')), 'the node entry must be present');
});

test('a corrupt settings.json does not crash the merge', () => {
  const dir = project({ '.claude/settings.json': '{ this is not json' });
  assert.doesNotThrow(() => computeSettingsMerge(dir, ['L0-quickstart']));
});

// v0.141.0 — the deny floor reaches projects already in the wild. A security floor that
// only ships via `boss new` is not a floor (CVE-2026-22708 / allowlist-is-not-a-boundary).
test('the deny floor merges into an existing project without touching allow or defaultMode', () => {
  const dir = project({
    '.claude/settings.json': JSON.stringify({
      permissions: {
        defaultMode: 'acceptEdits',
        allow: ['Read', 'MyCustomTool'],
        deny: ['Read(./.env)', 'Read(./my-private-notes/**)'],
      },
    }, null, 2),
  });
  const { merged, changed } = computeSettingsMerge(dir, ['L0-quickstart']);
  assert.equal(changed, true);
  assert.equal(merged.permissions.defaultMode, 'acceptEdits', "a founder's mode choice is theirs");
  assert.deepEqual(merged.permissions.allow, ['Read', 'MyCustomTool'], 'allow is never widened');
  assert.ok(merged.permissions.deny.includes('Read(./my-private-notes/**)'), "the founder's own deny survives");
  assert.ok(merged.permissions.deny.includes('Read(.env)'), 'the bare-path form is added, not just ./');
  assert.ok(merged.permissions.deny.includes('Bash(source *.env*)'), 'readers beyond cat are covered');
  assert.equal(
    merged.permissions.deny.length, new Set(merged.permissions.deny).size,
    'merging must not duplicate an entry already present',
  );

  writeFileSync(join(dir, '.claude', 'settings.json'), JSON.stringify(merged, null, 2));
  assert.equal(computeSettingsMerge(dir, ['L0-quickstart']).changed, false, 're-merging the floor is a no-op');
});

// --- sync planning --------------------------------------------------------

// v0.147.0 — nothing BOSS ships into a founder's project may point at a path only BOSS's own
// repo has. 25 agents/skills/hooks referenced `library/practices/*`; a scaffolded project has no
// `library/`, so every one was a dead end that LOOKED authoritative — the sharp edge in the
// agent, then a reference to nothing. The reachable form is `boss craft <name>`.
test('shipped files never point at a path only the BOSS repo has', () => {
  const offenders = [];
  const walk = (dir) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, e.name);
      if (e.isDirectory()) { walk(p); continue; }
      if (!/\.(md|js|json)$/.test(e.name)) continue;
      const text = readFileSync(p, 'utf8');
      for (const m of text.matchAll(/library\/practices\/([a-z0-9-]+)\.md/g)) {
        // `/extract` legitimately names library/ — it documents the UP direction, promoting
        // a pattern INTO BOSS's library. That's a description of BOSS's repo, not a pointer.
        if (p.includes(join('skills', 'extract'))) continue;
        offenders.push(`${p} -> ${m[0]}`);
      }
    }
  };
  walk(STAGES_DIR);
  assert.deepEqual(
    offenders, [],
    `these resolve only inside BOSS's repo; use \`boss craft <name>\` instead:\n  ${offenders.join('\n  ')}`,
  );
});

// v0.151.0 — the same class as the test above, for the reference type nothing checked: AGENT
// NAMES. The release-readiness pass found seven shipped files routing founders to agents that
// live only in BOSS's gitignored `/.claude/` dev workspace. The worst was `/consult`, whose
// step-4 "humane override" — Principle #6's one enforcement point in the mentor board — told the
// model to consult `mentor-humane`, which ships in no mode. A founder running `/consult` got the
// override silently skipped or hallucinated. `check:refs` gates this repo-wide; this pins the
// shipped surface specifically, because that's the half that lands in someone else's project.
test('REGRESSION: shipped files never name an agent the founder will not have', () => {
  const agentsIn = (dir) => (existsSync(dir)
    ? readdirSync(dir).filter((f) => f.endsWith('.md')).map((f) => f.replace(/\.md$/, ''))
    : []);
  const shipped = new Set(
    STAGE_ORDER.flatMap((id) => agentsIn(join(STAGES_DIR, id, 'template', '.claude', 'agents'))),
  );
  const bossOnly = new Set(
    agentsIn(join(process.cwd(), '.claude', 'agents')).filter((n) => !shipped.has(n)),
  );
  assert.ok(shipped.size > 0, 'no shipped agents found — the test would pass vacuously');

  const offenders = [];
  const walk = (dir) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, e.name);
      if (e.isDirectory()) { walk(p); continue; }
      if (!/\.(md|js|json)$/.test(e.name)) continue;
      // Backticks only: `mentor-humane` is a name the model will try to route to; the same word
      // in prose is the concept. Matching prose would flag `persona-cohort` in /board and
      // `persona-reaction` in /ux-check, and a check that cries wolf is a check nobody runs.
      for (const m of readFileSync(p, 'utf8').matchAll(/`([a-z][a-z0-9-]*)`/g)) {
        const n = m[1];
        if (shipped.has(n)) continue;
        if (bossOnly.has(n) || /^mentor-/.test(n)) offenders.push(`${p} -> ${n}`);
      }
    }
  };
  walk(STAGES_DIR);
  assert.deepEqual(
    offenders, [],
    `these route a founder to an agent their install has no file for:\n  ${[...new Set(offenders)].join('\n  ')}`,
  );
});

test('every `boss craft <name>` pointer names a practice that exists', () => {
  const shelf = new Set(
    readdirSync(join(process.cwd(), 'library', 'practices'))
      .filter((f) => f.endsWith('.md')).map((f) => f.replace(/\.md$/, '')),
  );
  const missing = [];
  const walk = (dir) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, e.name);
      if (e.isDirectory()) { walk(p); continue; }
      if (!/\.(md|js|json)$/.test(e.name)) continue;
      for (const m of readFileSync(p, 'utf8').matchAll(/boss craft ([a-z0-9-]{3,})/g)) {
        if (!shelf.has(m[1])) missing.push(`${p} -> ${m[1]}`);
      }
    }
  };
  walk(STAGES_DIR);
  assert.deepEqual(missing, [], `pointers to practices that do not exist:\n  ${missing.join('\n  ')}`);
});

// v0.146.0 — the "read by three, written by nothing" bug. `/design-review`, `ui-designer` and
// `ux-designer` all read `docs/design/STYLE_GUIDE.md`; no skill ever wrote it, and `docs/design/`
// shipped as an empty directory. A doc that consumers depend on and no producer creates is a
// silent hole — the same class as RLS-in-db-architect and the test-diff-in-tester holes.
test('every design doc a consumer reads is a design doc some skill writes', () => {
  const read = (p) => readFileSync(join(STAGES_DIR, p), 'utf8');
  const consumers = [
    'L2-v1/template/.claude/skills/design-review/SKILL.md',
    'L2-v1/template/.claude/agents/ui-designer.md',
    'L2-v1/template/.claude/agents/ux-designer.md',
  ].map(read).join('\n');

  // Whatever docs/design/*.md the consumers name, something must produce.
  const wanted = new Set([...consumers.matchAll(/docs\/design\/\s*([A-Z_]+\.md)/g)].map((m) => m[1]));
  assert.ok(wanted.size >= 2, 'expected the design consumers to name at least tokens + style guide');

  const producerDir = join(STAGES_DIR, 'L1-mvp/template/.claude/skills/design-tokens-init');
  const producer = [
    readFileSync(join(producerDir, 'SKILL.md'), 'utf8'),
    ...readdirSync(join(producerDir, 'templates')).map((f) =>
      readFileSync(join(producerDir, 'templates', f), 'utf8')),
  ].join('\n');

  for (const doc of wanted) {
    assert.ok(
      producer.includes(doc),
      `${doc} is read by a design consumer but nothing in /design-tokens-init produces it`,
    );
  }
});

// v0.141.0 — progressive disclosure makes a skill a TREE, not one file. If sync only
// tracked SKILL.md, every bundled resource would ship once and then never update again —
// the same bug already fixed for dormant hooks.
test('a skill\'s bundled resources are managed, not just its SKILL.md', () => {
  const dir = project({});
  mkdirSync(join(dir, '.boss'), { recursive: true });
  const stamp = { name: 'p', bossVersion: '0.0.1', stage: 'L0-quickstart', installedLayers: ['L0-quickstart'] };
  const entries = planSync(dir, stamp).entries;

  const resource = entries.find((e) => e.rel.endsWith(join('welcome', 'reference', 'deeper.md')));
  assert.ok(resource, "welcome's bundled reference file must be a managed file");
  assert.equal(resource.kind, 'skill-resource');
  assert.ok(
    entries.some((e) => e.rel.endsWith(join('welcome', 'SKILL.md'))),
    'the skill body is still managed alongside its resources',
  );
});

test('planSync marks missing files new, edited files changed, identical files ok', () => {
  const dir = project({});
  mkdirSync(join(dir, '.boss'), { recursive: true });
  const stamp = { name: 'p', bossVersion: '0.0.1', stage: 'L0-quickstart', installedLayers: ['L0-quickstart'] };

  const fresh = planSync(dir, stamp);
  assert.ok(fresh.entries.length > 0);
  assert.ok(fresh.entries.every((e) => e.status === 'new'), 'an empty project is all-new');
  assert.equal(fresh.drift, true, 'a stale pin is drift');

  // Write one file exactly as planned → it becomes ok; then edit it → changed.
  const target = fresh.entries.find((e) => e.kind === 'skill');
  mkdirSync(join(dir, target.rel, '..'), { recursive: true });
  writeFileSync(join(dir, target.rel), target.next);
  assert.equal(planSync(dir, stamp).entries.find((e) => e.rel === target.rel).status, 'ok');

  writeFileSync(join(dir, target.rel), target.next + '\nlocal edit\n');
  const edited = planSync(dir, stamp).entries.find((e) => e.rel === target.rel);
  assert.equal(edited.status, 'changed');
  assert.ok(edited.delta > 0, 'a changed file reports a line delta');
});

test('dormant hooks are synced but never auto-registered', () => {
  // §C7: they shipped once at scaffold and were then never updated again, because no
  // manifest list claimed them — a security fix to secrets-guard.js would never have
  // reached an existing project. `optionalHooks` syncs the FILE; the registration stays
  // the founder's on-switch, so syncing must NOT turn anything on.
  const dir = project({});
  const plan = planSync(dir, {
    name: 'p', bossVersion: '0.0.1', stage: 'L0-quickstart', installedLayers: ['L0-quickstart'],
  });
  const optional = plan.entries.filter((e) => e.kind === 'optional-hook').map((e) => e.name);
  assert.ok(optional.includes('secrets-guard'), 'secrets-guard must be sync-managed');
  assert.ok(optional.includes('memory-cue'), 'memory-cue must be sync-managed');

  const registered = JSON.stringify(plan.settings.merged);
  for (const h of optional) {
    assert.ok(!registered.includes(`${h}.js`), `${h} must stay unregistered — dormant means dormant`);
  }
});

test('planSync canonicalises and dedupes installed layers', () => {
  const dir = project({});
  const plan = planSync(dir, {
    name: 'p', bossVersion: '0.0.1', stage: 'L0-quickstart',
    installedLayers: ['L0-sketch', 'L0-quickstart', 'L1-mvp'],
  });
  assert.deepEqual(plan.layers, ['L0-quickstart', 'L1-mvp']);
});

// --- adopt: reading how far along a repo already is -----------------------
//
// v0.153.0 — adopt always defaulted to Quickstart, so a half-built app with real users got the
// idea-capture scaffold and an arc it finished months ago. The detector is deliberately cheap and
// CONSERVATIVE: it caps at MVP and never auto-climbs to V1, because ceremony added is ceremony
// sync cannot yet remove (`planSync` has no removal concept), so over-shooting is the expensive
// direction and the tie goes to less.

test('a barely-started repo still adopts at Quickstart', () => {
  const p = project({ 'try.js': 'console.log(1)\n' });
  const d = detectStage(p);
  assert.equal(d.stage, 'L0-quickstart');
  assert.ok(d.why.length, 'must say WHAT it read — an inference you cannot audit is the thing BOSS warns about');
});

test('a real build (manifest + source) adopts at MVP', () => {
  const files = { 'package.json': '{"name":"x"}' };
  for (let i = 0; i < 7; i++) files[`src/mod${i}.js`] = `export const f${i} = ${i}\n`;
  const d = detectStage(project(files));
  assert.equal(d.stage, 'L1-mvp');
  assert.match(d.why.join(' '), /package\.json/);
  assert.equal(d.beyond, false, 'no tests and no deploy — nothing to report beyond MVP');
});

test('REGRESSION: a shipped, tested, CI-d repo REPORTS past-MVP but never auto-climbs to V1', () => {
  const files = {
    'package.json': '{"name":"x"}', 'Dockerfile': 'FROM node\n',
    'tests/a.test.js': "test('x',()=>{})\n", '.github/workflows/ci.yml': 'on: push\n',
  };
  for (let i = 0; i < 7; i++) files[`src/m${i}.js`] = `export const f${i} = ${i}\n`;
  const d = detectStage(project(files));
  // V1 means committing to a design system and a db discipline. BOSS does not get to decide that
  // from the presence of a Dockerfile — it reports, the founder climbs.
  assert.equal(d.stage, 'L1-mvp', 'must cap at MVP');
  assert.equal(d.beyond, true, 'but must SAY it looks further along');
});

test('a manifest with no real source is not a build', () => {
  const d = detectStage(project({ 'package.json': '{"name":"x"}', 'README.md': '# hi\n' }));
  assert.equal(d.stage, 'L0-quickstart');
});

test('node_modules never makes an empty repo look like a real build', () => {
  const files = { 'package.json': '{"name":"x"}' };
  for (let i = 0; i < 40; i++) files[`node_modules/dep${i}/index.js`] = 'module.exports = 1\n';
  const d = detectStage(project(files));
  assert.equal(d.stage, 'L0-quickstart', 'dependencies are not the founder\'s work');
});
