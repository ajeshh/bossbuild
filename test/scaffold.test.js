// Scaffolding, sync and the stage ladder — the machinery that writes into a founder's
// repo. The non-destructive guarantees here are the ones that cost trust if they break.

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { resolveStageId, STAGE_ORDER, STAGES_DIR } from '../src/paths.js';
import { loadModes, modeWord, skillGloss } from '../src/modes.js';
import { readStageManifest, appendMarkedBlock, appendGitignoreBlock, applyStageSafe } from '../src/scaffold.js';
import { planRemove, applyRemove } from '../src/remove.js';
import { canonicalLayer, computeSettingsMerge, planSync, applySync, orphanEdited } from '../src/sync.js';
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

test('REGRESSION: adopt merges BOSS ignore rules into a .gitignore the founder already has', () => {
  // The bug: applyStageSafe copies only non-colliding files, every started repo has a
  // .gitignore, so BOSS's was skipped in full — and DEC-001's guarantee that per-person
  // conscience state never travels to a cofounder was enforced only by that file.
  const dir = project({ '.gitignore': 'node_modules/\n.env\n' });
  const r = appendGitignoreBlock(['L0-quickstart'], dir);
  const body = readFileSync(join(dir, '.gitignore'), 'utf8');

  assert.ok(r.applied, 'the merge must actually write');
  assert.ok(body.includes('.boss/brain/relationship.md'), 'DEC-001: per-person state left committable');
  assert.ok(r.added.includes('.boss/brain/relationship.md'));

  assert.ok(body.startsWith('node_modules/\n.env\n'), "the founder's own rules stay first, untouched");
  assert.equal(body.split('\n').filter((l) => l.trim() === 'node_modules/').length, 1, 'no duplicated rule');
  assert.ok(!r.added.includes('.env'), 'a rule they already had must not be re-added');

  // The comment travels WITH its rule — it is how a founder decides to drop one rather than obey it.
  assert.ok(body.slice(0, body.indexOf('.boss/brain/relationship.md')).includes('DEC-001'),
    'the rule arrived without the reason for it');

  // `<!--` is not a comment in .gitignore, it is a pattern. appendMarkedBlock cannot be reused here.
  assert.ok(!body.includes('<!--'), 'an HTML marker in a .gitignore is two literal patterns');
  for (const line of body.split('\n')) {
    if (line.trim() && !line.trim().startsWith('#')) {
      assert.ok(!line.includes(' #'), `inline comment is not a gitignore comment: ${line}`);
    }
  }

  const second = appendGitignoreBlock(['L0-quickstart'], dir);
  assert.equal(second.applied, false, 'adopting twice must be a no-op');
  assert.equal(readFileSync(join(dir, '.gitignore'), 'utf8'), body);
});

test('the gitignore merge adds nothing when the founder already has every rule', () => {
  const template = readFileSync(join(STAGES_DIR, 'L0-quickstart', 'template', '.gitignore'), 'utf8');
  const dir = project({ '.gitignore': template });
  const r = appendGitignoreBlock(['L0-quickstart'], dir);
  assert.equal(r.applied, false, 'a no-op merge must not append an empty marked block');
  assert.equal(readFileSync(join(dir, '.gitignore'), 'utf8'), template);
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

// v0.146.0 — the "read by three, written by nothing" bug. `/design-review` and the designers all
// read `docs/design/STYLE_GUIDE.md`; no skill ever wrote it, and `docs/design/` shipped as an
// empty directory. A doc that consumers depend on and no producer creates is a silent hole — the
// same class as the RLS-in-one-agent's-prompt and test-diff-in-tester holes.
// v0.189.0 (DEC-005) — the consumers moved DOWN to L1 and the two designers merged into one, so
// consumer and producer now sit at the SAME rung. That makes the hole cheaper to open, not harder:
// nothing about co-location produces a file. The test still asks the only question that matters.
test('every design doc a consumer reads is a design doc some skill writes', () => {
  const read = (p) => readFileSync(join(STAGES_DIR, p), 'utf8');
  const consumers = [
    'L1-mvp/template/.claude/skills/design-review/SKILL.md',
    'L1-mvp/template/.claude/skills/ux-check/SKILL.md',
    'L1-mvp/template/.claude/agents/designer.md',
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

// v0.154.0 — DEC-003 (position, not verdict). A decision recorded only in docs/ is a decision the
// next edit can quietly undo. `/comprehend` is the one skill that speaks to a founder about work
// they already built, and the pull toward a scorecard there is strong: it demos well. These pin the
// two guarantees that make it humane rather than clever — no grade, and no invented payoff.
test('REGRESSION: /comprehend reports POSITION and is forbidden from grading (DEC-003)', () => {
  const p = join(STAGES_DIR, 'L0-quickstart', 'template', '.claude', 'skills', 'comprehend', 'SKILL.md');
  const text = readFileSync(p, 'utf8');
  assert.match(text, /^## Position/m, 'the position read must be a named section, not a buried aside');
  assert.match(text, /Position, never a grade/, 'the no-grade rule must be stated where the model reads it');
  assert.match(text, /What BOSS can't see/, "the honest half — the unknowns — is what makes it a position rather than a verdict");
  // The other half of DEC-003: BOSS has n=1 stated-pain and no observed session, so a quantified
  // benefit claim would be BOSS committing the exact self-fooling it exists to prevent.
  assert.match(text, /[Nn]ever claim a\s+measured gain/, 'the no-quantified-gain rule must survive edits');
  // Naming a problem and leaving the founder with it is a critique; the migration is what makes it help.
  assert.match(text, /^## When an approach should probably be abandoned/m, 'the abandonment sequence must be present');
  assert.match(text, /it is the founder's call/i, 'abandonment is named, then decided by the founder — never auto-applied');
});

// --- sync: supersede + removal (v0.155.0) --------------------------------
//
// `boss sync` could add and modify; its policy was literally "nothing is removed." So a skill BOSS
// retired stayed in every project that ever synced, beside its replacement — meaning the
// subtraction pass EVID-001 mandates could never reach a founder, and syncing could only ever GROW
// their surface. It also made DEC-003's fourth step ("if yes, BOSS does the migration") a promise
// the sync layer couldn't keep.
//
// The removal path is the most dangerous code in BOSS: it deletes files in a repo it was invited
// into. These pin the guards, not the feature.

const stampedProject = (extra = {}, stampPatch = {}) => project({
  '.boss/manifest.json': JSON.stringify({
    name: 'p', bossVersion: '0.0.1', stage: 'L0-quickstart', mode: 'Quickstart',
    installedLayers: ['L0-quickstart'], agents: [], skills: [], hooks: [], loops: [],
    ...stampPatch,
  }),
  ...extra,
});

test('REGRESSION: sync never proposes removing a file BOSS did not install', () => {
  // THE safety boundary. `.boss/manifest.json` is the install ledger — a name that isn't in it was
  // put there by the founder. Walking `.claude/skills/` and diffing against the manifest is the
  // obvious implementation, and it would eventually propose deleting someone's own work.
  const dir = stampedProject({ '.claude/skills/my-own-thing/SKILL.md': '# mine\n' });
  const plan = planSync(dir, JSON.parse(readFileSync(join(dir, '.boss/manifest.json'), 'utf8')));
  assert.deepEqual(plan.orphans.filter((o) => o.name === 'my-own-thing'), [],
    "a founder's own skill must be invisible to sync");
});

test('an orphan BOSS stamped but no longer ships is reported, with its file path', () => {
  const dir = stampedProject(
    { '.claude/skills/legacy-verb/SKILL.md': '# legacy\n' },
    { skills: ['legacy-verb'] },
  );
  const plan = planSync(dir, JSON.parse(readFileSync(join(dir, '.boss/manifest.json'), 'utf8')));
  const o = plan.orphans.find((x) => x.name === 'legacy-verb');
  assert.ok(o, 'a stamped-but-unshipped skill must be reported');
  assert.equal(o.present, true);
  assert.equal(o.rel, join('.claude', 'skills', 'legacy-verb'));
});

test('an orphan the founder already deleted is resolved, not work', () => {
  const dir = stampedProject({}, { skills: ['legacy-verb'] });
  const plan = planSync(dir, JSON.parse(readFileSync(join(dir, '.boss/manifest.json'), 'utf8')));
  assert.equal(plan.orphans.find((x) => x.name === 'legacy-verb').present, false);
});

test('REGRESSION: --apply alone removes NOTHING; removal needs explicit consent', () => {
  // DEC-003 — BOSS names what changed, the founder decides. A sync that silently deleted a skill
  // would be the one place BOSS decided for them, in a repo it was invited into.
  const dir = stampedProject(
    { '.claude/skills/legacy-verb/SKILL.md': '# legacy\n' },
    { skills: ['legacy-verb'] },
  );
  const stamp = JSON.parse(readFileSync(join(dir, '.boss/manifest.json'), 'utf8'));
  const plan = planSync(dir, stamp);
  const res = applySync(dir, plan, stamp);
  assert.deepEqual(res.removed, [], '--apply must not remove');
  assert.ok(existsSync(join(dir, '.claude/skills/legacy-verb/SKILL.md')), 'the file must survive');
  // And it must STAY stamped — reconciling the stamp to the manifest union alone would drop it
  // while its files remain, so the next sync would have no record BOSS installed it and the
  // safety boundary above would refuse to touch it. Unexplained, forever.
  assert.ok(res.stamp.skills.includes('legacy-verb'), 'an un-removed orphan stays in the ledger');
});

test('REGRESSION: --remove deletes the orphan and unstamps it, leaving the rest alone', () => {
  const dir = stampedProject({
    '.claude/skills/legacy-verb/SKILL.md': '# legacy\n',
    '.claude/skills/my-own-thing/SKILL.md': '# mine\n',
  }, { skills: ['legacy-verb'] });
  const stamp = JSON.parse(readFileSync(join(dir, '.boss/manifest.json'), 'utf8'));
  const res = applySync(dir, planSync(dir, stamp), stamp, { remove: true });
  assert.equal(res.removed.length, 1);
  assert.ok(!existsSync(join(dir, '.claude/skills/legacy-verb')), 'the orphan is gone');
  assert.ok(!res.stamp.skills.includes('legacy-verb'), 'and unstamped');
  assert.ok(existsSync(join(dir, '.claude/skills/my-own-thing/SKILL.md')), "the founder's own survives");
});

test('REGRESSION: an edited orphan is never removed, even with --remove', () => {
  // Tested against orphanEdited directly. The true-branch needs a name that is stamped, absent
  // from every live manifest, and whose TEMPLATE still exists — the deprecate-then-delete
  // intermediate state, which planSync's layer logic can't be coaxed into producing from a
  // fixture. Comparing a real shipped template against a doctored copy exercises the same code.
  const dir = stampedProject({ '.claude/skills/welcome/SKILL.md': '# not what BOSS shipped\n' });
  assert.equal(orphanEdited(dir, 'skill', 'welcome', ['L0-quickstart']), true,
    'a changed file must read as edited');

  // And the guard that consumes it: an edited orphan survives --remove.
  const stamp = JSON.parse(readFileSync(join(dir, '.boss/manifest.json'), 'utf8'));
  const plan = planSync(dir, stamp);
  plan.orphans = [{ kind: 'skill', name: 'welcome', rel: join('.claude', 'skills', 'welcome'), present: true, edited: true, supersede: null }];
  const res = applySync(dir, plan, stamp, { remove: true });
  assert.deepEqual(res.removed, [], 'an edited orphan is never removed');
  assert.ok(existsSync(join(dir, '.claude/skills/welcome/SKILL.md')), 'the file survives');
});

test('an untouched file matches its template — the flag does not cry wolf', () => {
  // If a freshly-scaffolded file read as "edited", every orphan would carry the warning and the
  // warning would stop meaning anything. Placeholders and whitespace are normalised for exactly
  // this reason.
  const dir = project({});
  applyStageSafe('L0-quickstart', dir, {
    PROJECT_NAME: 'p', DATE: '2026-01-01', BOSS_VERSION: '0.0.0', STAGE: 'L0-quickstart', MODE: 'Quickstart',
  });
  assert.equal(orphanEdited(dir, 'skill', 'welcome', ['L0-quickstart']), false);
});

test('edited is null — not false — when BOSS can no longer compare', () => {
  // The NORMAL case for a real retirement: the release that stops shipping a skill also deletes
  // its template, so the comparison basis is gone by the time a founder syncs. Reporting `false`
  // there would assert "you didn't change this" at exactly the moment BOSS cannot know.
  const dir = stampedProject(
    { '.claude/skills/legacy-verb/SKILL.md': '# legacy\n' },
    { skills: ['legacy-verb'] },
  );
  const plan = planSync(dir, JSON.parse(readFileSync(join(dir, '.boss/manifest.json'), 'utf8')));
  assert.equal(plan.orphans.find((x) => x.name === 'legacy-verb').edited, null);
});

test('the supersede ledger ships, parses, and every entry can explain itself', () => {
  const raw = JSON.parse(readFileSync(join(process.cwd(), 'registry', 'supersedes.json'), 'utf8'));
  assert.ok(Array.isArray(raw.supersedes), 'the ledger must always expose an array');
  for (const e of raw.supersedes) {
    // A removal without a reason is just a deletion.
    for (const f of ['since', 'kind', 'removed', 'why', 'migrate']) {
      assert.ok(e[f], `supersede entry for '${e.removed}' is missing '${f}'`);
    }
    assert.match(e.since, /^\d+\.\d+\.\d+$/, `'${e.removed}' has an unparseable since`);
    assert.ok(['skill', 'agent', 'hook'].includes(e.kind), `'${e.removed}' has an unknown kind`);
  }
});

// --- boss remove: the exit (v0.161.0) -------------------------------------
//
// Adopting BOSS into an existing repo writes ~91 files and nothing took them back out. "Non-
// destructive" answered *will you break my stuff?*, never *can I get out?* — and PRINCIPLE #5 is
// optionality by default. A clean exit is what makes the entrance safe to try.
//
// This is the most destructive code in BOSS: it deletes files in a repo it was invited into,
// where the founder's own work sits in the SAME directories as BOSS's scaffold. These pin the
// guards, not the feature.

const adopted = () => {
  const dir = project({ 'package.json': '{"name":"myapp"}', 'src/a.js': 'export const a = 1\n' });
  const vars = {
    PROJECT_NAME: 'myapp', DATE: '2026-01-01', BOSS_VERSION: '0.0.0',
    STAGE: 'L0-quickstart', MODE: 'Quickstart',
  };
  applyStageSafe('L0-quickstart', dir, vars);
  mkdirSync(join(dir, '.boss'), { recursive: true });
  writeFileSync(join(dir, '.boss', 'manifest.json'), JSON.stringify({
    name: 'myapp', bossVersion: '0.0.0', stage: 'L0-quickstart', mode: 'Quickstart',
    installedLayers: ['L0-quickstart'], agents: [], skills: [], hooks: [], loops: [], adopted: true,
  }), { flag: 'w' });
  return dir;
};
const stampOf = (dir) => JSON.parse(readFileSync(join(dir, '.boss', 'manifest.json'), 'utf8'));

test('REGRESSION: remove never touches a file BOSS did not write', () => {
  // The founder's ideas and decisions live in docs/ — the SAME tree as BOSS's scaffold. A naive
  // `rm -rf docs` on the way out destroys the work BOSS was there to help produce.
  const dir = adopted();
  mkdirSync(join(dir, 'docs', 'ideas'), { recursive: true });
  writeFileSync(join(dir, 'docs', 'ideas', 'IDEA-001.md'), '# mine\n');
  mkdirSync(join(dir, '.claude', 'skills', 'my-own'), { recursive: true });
  writeFileSync(join(dir, '.claude', 'skills', 'my-own', 'SKILL.md'), '# mine\n');

  applyRemove(dir, planRemove(dir, stampOf(dir)));
  assert.ok(existsSync(join(dir, 'docs', 'ideas', 'IDEA-001.md')), "the founder's idea must survive");
  assert.ok(existsSync(join(dir, '.claude', 'skills', 'my-own', 'SKILL.md')), 'their own skill must survive');
  assert.ok(existsSync(join(dir, 'src', 'a.js')), 'their code must survive');
  assert.ok(!existsSync(join(dir, '.boss')), "BOSS's own state should be gone");
});

test('REGRESSION: a BOSS file the founder edited is theirs, and is never removed', () => {
  const dir = adopted();
  const mine = join(dir, '.claude', 'skills', 'triage', 'SKILL.md');
  writeFileSync(mine, readFileSync(mine, 'utf8') + '\n## My customisation\n');
  const plan = planRemove(dir, stampOf(dir));
  assert.ok(plan.edited.some((e) => e.rel.includes('triage')), 'the edited file must be detected');
  applyRemove(dir, plan);
  assert.ok(existsSync(mine), 'an edited BOSS file survives removal');
  assert.match(readFileSync(mine, 'utf8'), /My customisation/);
});

test('REGRESSION: substituted placeholders never make an untouched file read as edited', () => {
  // The bug this pins: a scaffolded file NEVER byte-matches its template, so normalising only the
  // template side reported 30 untouched agents as "you edited this" on the first run. A flag that
  // fires on everything is a flag nobody reads.
  const dir = adopted();
  const plan = planRemove(dir, stampOf(dir));
  assert.deepEqual(plan.edited, [], `nothing was edited, yet these were flagged: ${plan.edited.map((e) => e.rel).join(', ')}`);
  assert.ok(plan.files.length > 20, 'and the files should still be recognised as removable');
});

test("removing excises BOSS's block from CLAUDE.md and keeps the founder's own rules", () => {
  const dir = project({ 'CLAUDE.md': '# My App\n\nMY OWN RULES\n' });
  applyStageSafe('L0-quickstart', dir, {
    PROJECT_NAME: 'myapp', DATE: '2026-01-01', BOSS_VERSION: '0.0.0', STAGE: 'L0-quickstart', MODE: 'Quickstart',
  });
  appendMarkedBlock(join(dir, 'CLAUDE.md'), 'adopt', 'BOSS says things');
  mkdirSync(join(dir, '.boss'), { recursive: true });
  writeFileSync(join(dir, '.boss', 'manifest.json'), JSON.stringify({
    name: 'myapp', stage: 'L0-quickstart', installedLayers: ['L0-quickstart'], skills: [], agents: [], hooks: [],
  }));
  applyRemove(dir, planRemove(dir, stampOf(dir)));
  const body = readFileSync(join(dir, 'CLAUDE.md'), 'utf8');
  assert.match(body, /MY OWN RULES/, "the founder's rules survive");
  assert.ok(!body.includes('BOSS says things'), "BOSS's block is excised");
});

test('an UNTOUCHED settings.json goes with BOSS — leaving config from a removed tool is clutter', () => {
  const dir = adopted();
  applyRemove(dir, planRemove(dir, stampOf(dir)));
  assert.ok(!existsSync(join(dir, '.claude', 'settings.json')),
    "BOSS wrote it and the founder never changed it, so removal takes it back");
});

test('REGRESSION: an EDITED settings.json is kept — hooks un-merged, permissions and deny floor intact', () => {
  // Removing a deny entry on the way out would quietly WIDEN what an agent may do — a parting
  // gift nobody asked for. Denies are monotonically safe, so they stay.
  const dir = adopted();
  const sPath = join(dir, '.claude', 'settings.json');
  const before = JSON.parse(readFileSync(sPath, 'utf8'));
  before.permissions.allow.push('Bash(my-tool:*)');
  before.hooks.Stop = [{ matcher: '', hooks: [{ type: 'command', command: 'my-own.sh' }] }];
  writeFileSync(sPath, JSON.stringify(before, null, 2));

  applyRemove(dir, planRemove(dir, stampOf(dir)));
  assert.ok(existsSync(sPath), 'a settings.json the founder touched is theirs and survives');
  const after = JSON.parse(readFileSync(sPath, 'utf8'));
  assert.ok(!after.hooks?.UserPromptSubmit, "BOSS's hook registration is gone");
  assert.ok(after.hooks?.Stop, 'their own hook survives');
  assert.ok(after.permissions.allow.includes('Bash(my-tool:*)'), 'their allow entry survives');
  assert.ok(after.permissions.deny.length > 0, 'the deny floor stays — removing it would widen access');
});

test('REGRESSION: a one-letter project name does not corrupt the edited-check', () => {
  // `boss new a` used to flag three untouched agents as edited: the comparison erased the project
  // NAME by regex, so every letter "a" became a sentinel and the stage-id/mode-word rules that ran
  // afterwards stopped matching their own patterns. Any short or common name (app, api, test) has
  // the same shape of bug, silently. The fix renders the template with the real values instead.
  for (const name of ['a', 'app', 'test']) {
    const dir = project({});
    applyStageSafe('L0-quickstart', dir, {
      PROJECT_NAME: name, DATE: '2026-01-01', BOSS_VERSION: '0.0.0', STAGE: 'L0-quickstart', MODE: 'Quickstart',
    });
    mkdirSync(join(dir, '.boss'), { recursive: true });
    writeFileSync(join(dir, '.boss', 'manifest.json'), JSON.stringify({
      name, bossVersion: '0.0.0', stage: 'L0-quickstart', mode: 'Quickstart',
      installedLayers: ['L0-quickstart'], agents: [], skills: [], hooks: [], loops: [],
    }));
    const plan = planRemove(dir, stampOf(dir));
    assert.deepEqual(plan.edited, [],
      `project named "${name}" falsely flagged: ${plan.edited.map((e) => e.rel).join(', ')}`);
  }
});

test('REGRESSION: nothing of BOSS is left behind after a full remove', () => {
  // The leftovers that motivated this: a `boss new` project that later unlocked a mode kept its
  // CLAUDE.md (L0 wrote the whole file, L1 appended a marked block, and excising the block left
  // the template behind) plus a stray settings.json.
  const dir = adopted();
  applyRemove(dir, planRemove(dir, stampOf(dir)));
  for (const p of ['CLAUDE.md', 'AGENTS.md', '.boss', '.claude/agents', '.claude/hooks', 'docs/loops']) {
    assert.ok(!existsSync(join(dir, p)), `${p} should be gone`);
  }
  assert.ok(existsSync(join(dir, 'src', 'a.js')), "and the founder's code is still there");
});

test('REGRESSION: after unlock, files keep matching the layer that WROTE them', () => {
  // The stamp records the project's CURRENT stage. After `boss unlock mvp` that's L1-mvp/MVP — but
  // L0's agents were rendered with L0-quickstart/Quickstart. Comparing them against an L1-rendered
  // template can never match, so three untouched agents and CLAUDE.md survived every removal.
  // Per-file layer, not per-project.
  const dir = project({});
  applyStageSafe('L0-quickstart', dir, {
    PROJECT_NAME: 'p', DATE: '2026-01-01', BOSS_VERSION: '0.0.0', STAGE: 'L0-quickstart', MODE: 'Quickstart',
  });
  applyStageSafe('L1-mvp', dir, {
    PROJECT_NAME: 'p', DATE: '2026-01-01', BOSS_VERSION: '0.0.0', STAGE: 'L1-mvp', MODE: 'MVP',
  });
  mkdirSync(join(dir, '.boss'), { recursive: true });
  writeFileSync(join(dir, '.boss', 'manifest.json'), JSON.stringify({
    name: 'p', bossVersion: '0.0.0', stage: 'L1-mvp', mode: 'MVP',
    installedLayers: ['L0-quickstart', 'L1-mvp'], agents: [], skills: [], hooks: [], loops: [],
  }));
  const plan = planRemove(dir, stampOf(dir));
  const l0Agents = plan.edited.filter((e) => /agents\/(pm|coder|mentor-founder)\.md$/.test(e.rel));
  assert.deepEqual(l0Agents, [], `L0 agents falsely flagged after unlock: ${l0Agents.map((e) => e.rel).join(', ')}`);
  applyRemove(dir, plan);
  assert.ok(!existsSync(join(dir, 'CLAUDE.md')), 'CLAUDE.md must not survive a multi-layer removal');
  assert.ok(!existsSync(join(dir, '.claude', 'agents')), 'no agents may be left behind');
});

test('REGRESSION: a big repo still finds its root build manifest', () => {
  // The walk is file-capped, and subdirectories sort before `package.json` (`d0/` < `p…`). So a
  // large monorepo exhausted the cap before the root was ever read, reported "no build manifest",
  // and adopted at Quickstart — the half-built-app-gets-the-idea-capture-scaffold failure that
  // detection exists to prevent, reappearing for large repos only. Root files are read first now.
  const files = { 'package.json': '{"name":"big"}' };
  for (let i = 0; i < 4200; i++) files[`d${Math.floor(i / 100)}/f${i}.js`] = 'x\n';
  const d = detectStage(project(files));
  assert.equal(d.stage, 'L1-mvp', 'a manifest at the root must be seen even past the file cap');
  assert.match(d.why.join(' '), /package\.json/);
  assert.equal(d.scan.truncated, true, 'and the walk must still be bounded');
});

test('REGRESSION: a real edit is always detected — the false-negative direction', () => {
  // For a DESTRUCTIVE command the dangerous direction is the false negative: failing to notice an
  // edit means deleting someone's work. Whitespace-only is deliberately ignored (cosmetic), but
  // every content change must be caught.
  const vars = { PROJECT_NAME: 'p', DATE: '2026-01-01', BOSS_VERSION: '0.0.0', STAGE: 'L0-quickstart', MODE: 'Quickstart' };
  const cases = [
    ['append', (s) => `${s}\n## my note\n`, true],
    ['reword', (s) => s.replace('Capture an idea', 'Capture a THING'), true],
    ['delete a content line', (s) => s.split('\n').filter((l) => !l.startsWith('ceremony. Each idea')).join('\n'), true],
    ['one character', (s) => s.replace('# /triage', '# /triage!'), true],
    ['whitespace only', (s) => s.replace(/\n/g, '\n '), false],
    ['untouched', (s) => s, false],
  ];
  for (const [label, mutate, expected] of cases) {
    const dir = project({});
    applyStageSafe('L0-quickstart', dir, vars);
    mkdirSync(join(dir, '.boss'), { recursive: true });
    const stamp = {
      name: 'p', stage: 'L0-quickstart', mode: 'Quickstart',
      installedLayers: ['L0-quickstart'], skills: [], agents: [], hooks: [],
    };
    writeFileSync(join(dir, '.boss', 'manifest.json'), JSON.stringify(stamp));
    const f = join(dir, '.claude', 'skills', 'triage', 'SKILL.md');
    writeFileSync(f, mutate(readFileSync(f, 'utf8')));
    const flagged = planRemove(dir, stamp).edited.some((e) => e.rel.includes('triage'));
    assert.equal(flagged, expected, `"${label}" should ${expected ? '' : 'not '}read as edited`);
  }
});
