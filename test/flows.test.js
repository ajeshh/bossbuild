// The flow reader (IDEA-137 · C2) — scripts/flows.js, check-refs class 7.
// Each fixture is one of the six breaks IDEA-137's inventory found in BOSS's own repo, rebuilt small:
// a hand-off where one end changed and the other didn't notice. The reader must name each, and stay
// silent when both ends agree.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';
import { checkFlows, mentions } from '../scripts/flows.js';

const BOSS_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

function fixture(files) {
  const root = mkdtempSync(join(tmpdir(), 'boss-flows-'));
  for (const [rel, text] of Object.entries(files)) {
    mkdirSync(dirname(join(root, rel)), { recursive: true });
    writeFileSync(join(root, rel), text);
  }
  return root;
}
const skill = (name, stage = 'L1-mvp') => `stages/${stage}/template/.claude/skills/${name}/SKILL.md`;
const take = (reader, path, from) => ({ reader, path, from, why: 'test' });

test('both ends name the same path → silent', () => {
  const root = fixture({
    [skill('canvas', 'L0-quickstart')]: 'Open (or create) `docs/ideas/IDEA-NNN-canvas.md` from the template.\n',
    [skill('design-review')]: 'Read `docs/ideas/IDEA-NNN-canvas.md` — the Promises cell.\n',
  });
  try {
    assert.deepEqual(checkFlows(root, { takes: [take(skill('design-review'), 'docs/ideas/IDEA-*-canvas.md', 'canvas')] }), []);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('B1.2 — the giver moved, the reader still opens the old file → named', () => {
  // /canvas's own step 0 still names the old path while LOOKING — which is why "the giver mentions
  // it" is not enough and the giver must WRITE it.
  const root = fixture({
    [skill('canvas', 'L0-quickstart')]: '**Look for the venture canvas before you make one** — `docs/ideas/CANVAS.md`.\n\n2. Open (or create) `docs/ideas/IDEA-NNN-canvas.md` from the template below.\n',
    [skill('design-review')]: 'Read `docs/ideas/CANVAS.md` (Promises cell).\n',
  });
  try {
    const f = checkFlows(root, { takes: [take(skill('design-review'), 'docs/ideas/IDEA-*-canvas.md', 'canvas')] });
    assert.equal(f.length, 1);
    assert.match(f[0][1], /should read docs\/ideas\/IDEA-\*-canvas\.md .* never names it/);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('the reader is right and the giver stopped writing it → named on the giver side', () => {
  const root = fixture({
    [skill('spec')]: '5. Create `docs/specs/FEAT-NNN-<slug>.md` from the template below.\n',
    [skill('drift-deep')]: '- **Every FEAT spec** — read `docs/ideas/FEAT-*.md`.\n',
  });
  try {
    const f = checkFlows(root, { takes: [take(skill('drift-deep'), 'docs/ideas/FEAT-*.md', 'spec')] });
    assert.equal(f.length, 1);
    assert.match(f[0][1], /\/spec never writes it/);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('B1.5 — a skill whose step 0 looks where it never writes → named, even in its own file', () => {
  const root = fixture({
    [skill('spec')]: '**Look for feature specs before you make one** — `docs/features/FEAT-*.md`.\n\n5. Create `docs/ideas/FEAT-NNN-<slug>.md` from the template below.\n',
  });
  try {
    const f = checkFlows(root, { takes: [take(skill('spec'), 'docs/ideas/FEAT-*.md', 'spec')] });
    assert.equal(f.length, 1);
    assert.match(f[0][1], /never names it/);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('B1.1 — a succession the reader does not follow → named; following it → silent', () => {
  const files = {
    [skill('design-tokens-init')]: '**Create `docs/design/COMPONENTS.md` as soon as the first component exists.\n',
    [skill('design-library', 'L2-v1')]: '8. **Write `manifest.json`** with a source hash per component.\n',
    'stages/L1-mvp/template/.claude/hooks/component-reuse-guard.js': "const INDEX_REL = join('docs', 'design', 'COMPONENTS.md');\nconst index = readFileSync(INDEX_REL);\n",
  };
  const ledger = {
    takes: [take('stages/L1-mvp/template/.claude/hooks/component-reuse-guard.js', 'docs/design/COMPONENTS.md', 'design-tokens-init')],
    successions: [{ old: 'docs/design/COMPONENTS.md', new: 'docs/design/library/manifest.json', by: 'design-library', at: 'V1' }],
  };
  const root = fixture(files);
  try {
    const f = checkFlows(root, ledger);
    assert.equal(f.length, 1);
    assert.match(f[0][1], /doesn't follow, so it goes blind there/);
  } finally { rmSync(root, { recursive: true, force: true }); }

  const fixed = fixture({ ...files, 'stages/L1-mvp/template/.claude/hooks/component-reuse-guard.js': "const INDEX_REL = join('docs', 'design', 'COMPONENTS.md');\nconst MANIFEST_REL = join('docs', 'design', 'library', 'manifest.json');\n// read the manifest first\n" });
  try {
    const led = { ...ledger, takes: [...ledger.takes, take('stages/L1-mvp/template/.claude/hooks/component-reuse-guard.js', 'docs/design/library/manifest.json', 'design-library')] };
    assert.deepEqual(checkFlows(fixed, led), []);
  } finally { rmSync(fixed, { recursive: true, force: true }); }
});

test('B1.6 — the ladder declares an output the skill never writes → named; stack-bound → skipped by name', () => {
  const root = fixture({
    [skill('canvas', 'L0-quickstart')]: 'Open (or create) `docs/ideas/IDEA-NNN-canvas.md` from the template.\n',
    [skill('ship')]: 'Look for a deploy config before you make one — `vercel.json`, `fly.toml`.\n',
  });
  const ladder = {
    canvas: { produces: { files: ['docs/ideas/CANVAS.md'] } },
    ship: { produces: { files: ['vercel.json', 'fly.toml'] } },
  };
  try {
    const f = checkFlows(root, { takes: [], ladder_stack_bound: { ship: 'the host decides' } }, ladder);
    assert.equal(f.length, 1);
    assert.match(f[0][1], /^canvas: none of its "produces" patterns/);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('the sentence is the unit, not the line', () => {
  // "…that replaces it." ends one sentence; the path sits in the next, which only reads.
  const m = mentions('regenerate the page that replaces it. If `docs/onboarding.md` exists, that is the\nthing to edit, not redo.\n', 'docs/onboarding.md');
  assert.equal(m.length, 1);
  assert.equal(m[0].write, false);
  assert.equal(m[0].read, true);
  // A write verb after the path, in the same sentence, still writes it.
  const w = mentions('If `docs/BRAND.md` doesn\'t exist, seed it — don\'t just report the gap.\n', 'docs/BRAND.md');
  assert.equal(w[0].write, true);
});

test('a path under an `## Output` heading is a write — the heading is the declaration', () => {
  const m = mentions('## Output\n\nOne short `docs/money/MONEY-<date>.md`. Part A: what was done.\n\n## Next\n\nSee `docs/money/MONEY-<date>.md`.\n', 'docs/money/MONEY-*.md');
  assert.equal(m.length, 2);
  assert.equal(m[0].write, true);
  assert.equal(m[1].write, false);
});

test('a bare filename never matches a directory it does not name', () => {
  assert.equal(mentions('add a pointer: `> Building as [FEAT-NNN](FEAT-NNN-<slug>.md).`\n', 'docs/features/FEAT-*.md').length, 0);
  assert.equal(mentions('8. **Write `manifest.json`** with a source hash.\n', 'docs/design/library/manifest.json').length, 1);
});

test('BOSS\'s own repo: every declared flow agrees at both ends', () => {
  const ledger = JSON.parse(readFileSync(join(BOSS_ROOT, 'registry', 'flows.json'), 'utf8'));
  const raw = JSON.parse(readFileSync(join(BOSS_ROOT, 'registry', 'surface-ladder.json'), 'utf8'));
  const ladder = Object.fromEntries(Object.entries(raw).filter(([k]) => !k.startsWith('_')));
  const f = checkFlows(BOSS_ROOT, ledger, ladder);
  assert.deepEqual(f, [], f.map(([a, b]) => `${a} -> ${b}`).join('\n'));
});
