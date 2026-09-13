// sync from an old vintage — the test a refactor of sync/managed/scaffold/board most needs.
//
// Every sync test builds its ledger by hand or maps a renamed stage; nothing scaffolds a project
// with an EARLIER BOSS and syncs it with THIS one. That is the path every real project takes and
// the one a mis-hashed pre-ledger file would ship green through. So: check out the v0.267.0 tree
// (the vintage BOSS's own tree sat pinned at for 52 versions) into a worktree, scaffold + unlock
// with THAT binary, edit one skill as the founder would, then run the CURRENT sync and assert what
// a founder would notice — their edit kept, BOSS's files current, the pin moved, the ledger
// stamped, and the re-entry read still fast.
//
// Needs the old commit in history; a shallow CI checkout skips with a note rather than pretends.

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { BOSS_ROOT } from '../src/paths.js';
import { planSync, applySync } from '../src/sync.js';
import { forgetGitDates } from '../src/gitdates.js';

const VINTAGE = 'v0.267.0';
const sh = (cmd, args, opts = {}) => execFileSync(cmd, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], ...opts }).trim();

let worktree = null;
let vintageSha = null;
try {
  vintageSha = sh('git', ['log', '--format=%h', '-1', `--grep=(${VINTAGE})`], { cwd: BOSS_ROOT });
} catch { /* no git, no history */ }

after(() => {
  if (worktree) {
    try { sh('git', ['worktree', 'remove', '--force', worktree], { cwd: BOSS_ROOT }); } catch { /* best effort */ }
    try { rmSync(worktree, { recursive: true, force: true }); } catch { /* gone */ }
  }
});

test(`a project scaffolded by ${VINTAGE} syncs cleanly with the current BOSS`, { skip: !vintageSha && `no ${VINTAGE} commit in history (shallow checkout?)` }, async () => {
  worktree = mkdtempSync(join(tmpdir(), 'boss-vintage-'));
  rmSync(worktree, { recursive: true, force: true });
  sh('git', ['worktree', 'add', '--detach', worktree, vintageSha], { cwd: BOSS_ROOT });
  const oldBoss = join(worktree, 'bin', 'boss');
  assert.ok(existsSync(oldBoss), 'the old binary is in the worktree');

  // A founder's project, made and unlocked by the OLD BOSS. HOME is sandboxed so the registry
  // this writes is a throwaway, never ~/.boss/registry.json.
  const home = mkdtempSync(join(tmpdir(), 'boss-vintage-home-'));
  const env = { ...process.env, HOME: home, USERPROFILE: home };
  const parent = mkdtempSync(join(tmpdir(), 'boss-vintage-proj-'));
  sh('node', [oldBoss, 'new', 'oldapp'], { cwd: parent, env });
  const proj = join(parent, 'oldapp');
  sh('node', [oldBoss, 'unlock', 'mvp'], { cwd: proj, env });
  const stampBefore = JSON.parse(readFileSync(join(proj, '.boss', 'manifest.json'), 'utf8'));
  assert.equal(stampBefore.bossVersion, '0.267.0', 'pinned at the vintage');
  assert.ok(stampBefore.installedLayers.includes('L1-mvp'));

  // The founder shapes one skill; BOSS must never overwrite that.
  const mine = join(proj, '.claude', 'skills', 'idea', 'SKILL.md');
  const edited = readFileSync(mine, 'utf8') + '\n\n## My house rule\n\nAlways name the customer.\n';
  writeFileSync(mine, edited);

  // Now the CURRENT BOSS syncs it (in-process: the same code `boss sync --apply --keep-mine` runs).
  forgetGitDates(proj);
  const plan = planSync(proj, stampBefore);
  const changed = plan.entries.filter((e) => e.status !== 'ok');
  assert.ok(changed.length > 20, `52 versions apart, many managed files must differ (saw ${changed.length})`);
  const ideaEntry = plan.entries.find((e) => e.kind === 'skill' && e.name === 'idea');
  assert.ok(ideaEntry, '/idea is in the plan');
  assert.equal(ideaEntry.status, 'changed');

  const { written, skipped, stamp: after_ } = applySync(proj, plan, stampBefore, { keepMine: true });
  assert.equal(readFileSync(mine, 'utf8'), edited, "the founder's edited skill is untouched");
  assert.ok(skipped.some((e) => e.name === 'idea'), 'and reported as skipped, not silently kept');
  assert.ok(written.length > 10, `unedited managed files were brought current (wrote ${written.length})`);
  const spec = join(proj, '.claude', 'skills', 'spec', 'SKILL.md');
  assert.equal(readFileSync(spec, 'utf8'), readFileSync(join(BOSS_ROOT, 'stages', 'L1-mvp', 'template', '.claude', 'skills', 'spec', 'SKILL.md'), 'utf8').replaceAll('{{PROJECT_NAME}}', 'oldapp'),
    'an unedited skill now matches the current template');
  assert.notEqual(after_.bossVersion, '0.267.0', 'the pin moved');
  assert.ok(existsSync(join(proj, '.boss', 'managed.json')), 'the provenance ledger exists after a sync');
  const ledger = JSON.parse(readFileSync(join(proj, '.boss', 'managed.json'), 'utf8'));
  assert.ok(Object.keys(ledger.files || ledger).length > 20, 'the ledger records the tree');

  // A vintage project has everything on disk already; `earned` must not hold anything back from it.
  assert.equal(after_.deferred, undefined, 'no deferred groups are invented for a pre-existing install');
  assert.ok(after_.skills.includes('money') && after_.skills.includes('ai-cost'), 'its post-launch and AI skills stay stamped');

  // The loops moved (docs/loops → .boss/loops) between the vintages: the new set is laid down, the
  // old copies are reported as moved orphans (never deleted without --remove), and the runtime
  // reads the new ones.
  assert.ok(existsSync(join(proj, '.boss', 'loops', 'focus-loop.md')), 'the new loop set is on disk');
  assert.ok(existsSync(join(proj, 'docs', 'loops', 'focus-loop.md')), 'the old copy is left where it was');
  const movedLoops = (plan.orphans || []).filter((o) => o.kind === 'loop' && o.moved);
  assert.ok(movedLoops.length >= 10, `the old loops are reported as moved (saw ${movedLoops.length})`);
  const { loadLoops } = await import('../stages/L0-quickstart/template/.claude/hooks/lib/loop-runtime.js');
  const live = loadLoops(proj);
  assert.ok(live.length >= 15, 'all loops still load');
  assert.ok(live.every((l) => /[\\/]\.boss[\\/]loops[\\/]/.test(l._file)), 'and every one is read from .boss/loops');

  // And the re-entry read is still fast on the synced project.
  const t0 = Date.now();
  sh('node', [join(BOSS_ROOT, 'bin', 'boss'), 'status'], { cwd: proj, env });
  assert.ok(Date.now() - t0 < 1500, `boss status took ${Date.now() - t0}ms`);

  rmSync(home, { recursive: true, force: true });
  rmSync(parent, { recursive: true, force: true });
});
