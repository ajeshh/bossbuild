// check-boundary: a crossed artifact that `boss sync` installed back into the workspace is the END of
// crossing, not a stale row. The bug this guards reached every session in BOSS's own tree on
// 2026-10-06: a `boss sync --apply` recorded `boss-sync` in `.boss/managed.json`, the check filtered it
// out of the workspace as BOSS-installed, then called its ledger row "gone from the workspace" — and
// `npm run check` stayed red for everyone with nothing actually wrong.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { cpSync, mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

function tree({ installed, onDisk }) {
  const d = mkdtempSync(join(tmpdir(), 'boss-boundary-'));
  mkdirSync(join(d, 'scripts'), { recursive: true });
  cpSync(join(ROOT, 'scripts', 'check-boundary.js'), join(d, 'scripts', 'check-boundary.js'));
  cpSync(join(ROOT, 'src'), join(d, 'src'), { recursive: true });
  const put = (rel, body) => { mkdirSync(dirname(join(d, rel)), { recursive: true }); writeFileSync(join(d, rel), body); };
  put('registry/boundary.json', JSON.stringify({ artifacts: [
    { name: 'foo', kind: 'skill', verdict: 'crossed', why: 'ships at L0; the test fixture for the installed case' },
  ] }));
  put('stages/L0-quickstart/template/.claude/skills/foo/SKILL.md', '# foo\n');
  mkdirSync(join(d, '.claude', 'skills'), { recursive: true });
  if (onDisk) put('.claude/skills/foo/SKILL.md', '# foo\n');
  if (installed) put('.boss/managed.json', JSON.stringify({ '.claude/skills/foo/SKILL.md': { sha: 'x' } }));
  return d;
}
const run = (d) => spawnSync('node', [join(d, 'scripts', 'check-boundary.js')], { encoding: 'utf8', env: { ...process.env, NO_COLOR: '1' } });

test('a crossed artifact that sync installed back is not a stale row', () => {
  const r = run(tree({ installed: true, onDisk: true }));
  assert.equal(r.status, 0, r.stdout);
});

test('a crossed row whose artifact is genuinely gone is still stale', () => {
  const r = run(tree({ installed: false, onDisk: false }));
  assert.equal(r.status, 1);
  assert.match(r.stdout, /gone from the workspace/);
});
