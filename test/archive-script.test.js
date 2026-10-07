// scripts/archive.js — archiving keeps the links working. The bug it replaces reached every session in
// BOSS's own tree: PROG-005 copied four retired skills and two watchlists into
// docs/research/retired-skills/2026-10-06/ by hand, all 37 relative links broke, and `npm run check`
// stayed red until they were re-resolved one by one (2026-10-07).

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT = join(dirname(fileURLToPath(import.meta.url)), '..', 'scripts', 'archive.js');

function tree(files) {
  const d = mkdtempSync(join(tmpdir(), 'boss-archive-'));
  for (const [rel, body] of Object.entries(files)) {
    mkdirSync(dirname(join(d, rel)), { recursive: true });
    writeFileSync(join(d, rel), body);
  }
  return d;
}
const run = (cwd, ...args) => spawnSync('node', [SCRIPT, ...args], { cwd, encoding: 'utf8' });

const FILES = {
  '.claude/skills/old/SKILL.md': [
    '# old',
    'See [the practice](../../../library/practices/x.md#why) and [its sibling](../sibling/SKILL.md).',
    'A [gone one](../../../nowhere.md), a [site](https://example.com), an [anchor](#top).',
    '[ref]: ../../../library/practices/x.md',
  ].join('\n'),
  '.claude/skills/sibling/SKILL.md': '# sibling\nBack to [old](../old/SKILL.md).\n',
  'docs/research/watchlists/list.md': '# list\nNext to [other](other.md).\n',
  'docs/research/watchlists/other.md': '# other\n',
  'library/practices/x.md': '# x\n',
};
const DEST = 'docs/research/retired-skills/2026-10-07';

test('a batch archives with every resolvable link still resolving', () => {
  const d = tree(FILES);
  const r = run(d, DEST, '.claude/skills/old/SKILL.md', '.claude/skills/sibling/SKILL.md', 'docs/research/watchlists/list.md');
  assert.equal(r.status, 0, r.stderr);
  const old = readFileSync(join(d, DEST, 'old.SKILL.md'), 'utf8');
  assert.match(old, /\]\(\.\.\/\.\.\/\.\.\/\.\.\/library\/practices\/x\.md#why\)/, 'a live target, reached from the archive, anchor kept');
  assert.match(old, /\]\(sibling\.SKILL\.md\)/, 'a file in the same batch → its archived copy');
  assert.match(old, /\]\(\.\.\/\.\.\/\.\.\/nowhere\.md\)/, 'an already-broken link is left as it was');
  assert.match(old, /\(https:\/\/example\.com\)/);
  assert.match(old, /\(#top\)/);
  assert.match(old, /^\[ref\]: \.\.\/\.\.\/\.\.\/\.\.\/library\/practices\/x\.md$/m, 'reference definitions too');
  assert.match(readFileSync(join(d, DEST, 'sibling.SKILL.md'), 'utf8'), /\]\(old\.SKILL\.md\)/);
  assert.match(readFileSync(join(d, DEST, 'list.md'), 'utf8'), /\]\(\.\.\/\.\.\/watchlists\/other\.md\)/);
  assert.match(r.stdout, /1 link\(s\) were already broken/);
  assert.ok(existsSync(join(d, '.claude/skills/old/SKILL.md')), 'copies; the original stays');
});

test('never overwrites an archived file', () => {
  const d = tree(FILES);
  assert.equal(run(d, DEST, 'docs/research/watchlists/list.md').status, 0);
  const again = run(d, DEST, 'docs/research/watchlists/list.md');
  assert.equal(again.status, 1);
  assert.match(again.stderr, /already exists/);
});
