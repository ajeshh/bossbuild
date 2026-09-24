// The hook's YAML reader and the CLI's frontmatter reader must agree (IDEA-121 tier 2).
//
// They are two implementations on purpose — the hook's ships into a founder's repo and must stay
// self-contained (see the header of src/frontmatter.js) — and that is exactly why they drifted:
// the hook's stopped at the first multi-line value, so every key after a folded `gist: >` or a
// wrapped `proof_note:` vanished. 102 keys across 42 docs, read by `boss status`, the conscience
// hook, check-freshness and check-manifests. Nothing failed; the fields were just absent.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { parseFrontmatter } from '../stages/L0-quickstart/template/.claude/hooks/lib/yaml.js';
import { frontmatter } from '../src/frontmatter.js';
import { BOSS_ROOT } from '../src/paths.js';

const walk = (d, out = []) => {
  let names;
  try { names = readdirSync(d); } catch { return out; }
  for (const n of names) {
    const p = join(d, n);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (n.endsWith('.md')) out.push(p);
  }
  return out;
};

const docs = ['docs', 'library', 'stages'].flatMap((r) => walk(join(BOSS_ROOT, r)))
  .map((f) => ({ f, text: readFileSync(f, 'utf8').replace(/\r\n?/g, '\n') }))
  .filter(({ text }) => text.startsWith('---\n') && text.indexOf('\n---\n', 4) > 0);

const topKeys = (text) => text.slice(4, text.indexOf('\n---\n', 4)).split('\n')
  .map((l) => /^([A-Za-z_][\w-]*):/.exec(l)?.[1]).filter(Boolean);

test('every top-level frontmatter key in the repo survives the hook parser', () => {
  assert.ok(docs.length > 100, 'the walk found the docs');
  const lost = [];
  for (const { f, text } of docs) {
    const fm = parseFrontmatter(text) || {};
    for (const k of topKeys(text)) if (!(k in fm)) lost.push(`${f.slice(BOSS_ROOT.length + 1)}: ${k}`);
  }
  assert.deepEqual(lost, [], `keys the hook cannot see:\n${lost.slice(0, 20).join('\n')}`);
});

test('a block scalar reads the same through both parsers', () => {
  let compared = 0;
  const differ = [];
  for (const { f, text } of docs) {
    const head = text.slice(4, text.indexOf('\n---\n', 4));
    const blockKeys = head.split('\n').map((l) => /^([A-Za-z_][\w-]*):\s*[>|][-+]?\s*$/.exec(l)?.[1]).filter(Boolean);
    if (!blockKeys.length) continue;
    const a = parseFrontmatter(text) || {};
    const b = frontmatter(text);
    for (const k of blockKeys) {
      compared++;
      if (String(a[k]) !== String(b[k])) differ.push(`${f.slice(BOSS_ROOT.length + 1)}: ${k}`);
    }
  }
  assert.ok(compared > 0, 'the repo has block scalars to compare');
  assert.deepEqual(differ, []);
});

test('the shapes that used to end the mapping', () => {
  const fm = parseFrontmatter([
    '---',
    'id: X-1',
    'gist: >',
    '  one folded',
    '  paragraph',
    'kept: |',
    '  line one',
    '  # not a comment inside a block',
    'proof_note: a plain value that wraps',
    '  onto the next line',
    'quoted: "a quoted value that',
    '  runs past its line"',
    'list: [a, b]',
    'nested:',
    '  child: 1',
    'last: here',
    '---',
    'body',
  ].join('\n'));
  assert.equal(fm.gist, 'one folded paragraph');
  assert.equal(fm.kept, 'line one\n# not a comment inside a block');
  assert.equal(fm.proof_note, 'a plain value that wraps onto the next line');
  assert.equal(fm.quoted, 'a quoted value that runs past its line');
  assert.deepEqual(fm.list, ['a', 'b']);
  assert.deepEqual(fm.nested, { child: 1 });
  assert.equal(fm.last, 'here', 'the key after every multi-line value is still read');
});

test('loop specs still parse the same shape (sequence items with nested maps)', () => {
  const fm = parseFrontmatter([
    '---',
    'id: l',
    'entry:',
    '  - count_at_least:',
    '      path_glob: $source',
    "      pattern: '(a|b)'",
    '      # a comment between keys',
    '      min: 3',
    '  - exists: { path: docs/x.md }',
    'drift_moment: coherence',
    '---',
    '',
  ].join('\n'));
  assert.deepEqual(fm.entry, [
    { count_at_least: { path_glob: '$source', pattern: '(a|b)', min: 3 } },
    { exists: { path: 'docs/x.md' } },
  ]);
  assert.equal(fm.drift_moment, 'coherence');
});
