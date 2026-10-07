// `boss inbox` (PROG-005 T2): what came in, what is still unsorted, and where the rest went.
//
// The view exists because an inbox that depends on someone moving files by hand drifts: BOSS's own
// research inbox held a dozen items nobody had marked done. So nothing moves; an item is sorted when
// something stamps it — the ledger /scout sort writes, `sorted:` frontmatter, or BOSS's own
// `resolved: RVW-NNN` line — and legal or HR material with no home yet is HELD, not new.

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { BOSS_ROOT } from '../src/paths.js';
import { readInbox } from '../src/inbox.js';
import { project, cleanup } from './helpers.js';

after(cleanup);

const BIN = join(BOSS_ROOT, 'bin', 'boss');
const boss = (args, cwd) => execFileSync('node', [BIN, ...args], { cwd, encoding: 'utf8', env: { ...process.env, NO_COLOR: '1' } });

const tree = () => project({
  'docs/source/README.md': '# Source\n',
  'docs/source/2026-10-01-deck.pdf': '%PDF-1.4 binary-ish',
  'docs/source/2026-10-02-notes.md': '---\nsorted: 2026-10-03 → docs/ideas/IDEA-001\n---\nmy notes\n',
  'docs/source/2026-10-03-contract.pdf': '%PDF',
  'docs/source/2026-10-04-paper.md': '# a paper\n',
  'docs/source/2026-10-05-old-claim.md': 'resolved: RVW-027 (ADAPT — corroboration)\n\nhttps://example.org/post\n',
  'docs/source/.inbox.json': JSON.stringify({
    '2026-10-01-deck.pdf': { sorted: '2026-10-02', to: 'docs/competition/', kind: 'rivals' },
    '2026-10-03-contract.pdf': { kind: 'legal' },
    '2026-10-04-paper.md': { kind: 'reference' },
  }),
});

test('each item lands in exactly one state, from whichever stamp it carries', () => {
  const dir = tree();
  const state = Object.fromEntries(readInbox(join(dir, 'docs', 'source')).map((i) => [i.name, i.state]));
  assert.deepEqual(state, {
    '2026-10-01-deck.pdf': 'sorted',          // the ledger — works for a PDF
    '2026-10-02-notes.md': 'sorted',          // `sorted:` frontmatter
    '2026-10-03-contract.pdf': 'held',        // legal, no home yet — not "new", not "sorted"
    '2026-10-04-paper.md': 'reference',
    '2026-10-05-old-claim.md': 'sorted',      // BOSS's own bare `resolved:` line
  });
  assert.ok(!('README.md' in state) && !('.inbox.json' in state), 'the folder README and the ledger are not items');
});

test('an unstamped item is new, and the view says how to sort it', () => {
  const dir = project({ 'docs/source/2026-10-06-report.md': '# report\n' });
  const out = boss(['inbox'], dir);
  assert.match(out, /New \(1\).*\/scout sort <file>/s);
  assert.match(out, /2026-10-06-report\.md/);
});

test('the view groups and names where sorted items went; nothing moves', () => {
  const dir = tree();
  const before = readdirSync(join(dir, 'docs', 'source')).sort();
  const out = boss(['inbox'], dir);
  assert.match(out, /Held \(1\)[\s\S]*2026-10-03-contract\.pdf\s+legal/);
  assert.match(out, /Sorted \(3\)[\s\S]*2026-10-01-deck\.pdf\s+→ docs\/competition\//);
  assert.match(out, /→ RVW-027(?! \()/, 'a long resolved note is cut to its first clause');
  assert.match(out, /Reference \(1\)/);
  assert.deepEqual(readdirSync(join(dir, 'docs', 'source')).sort(), before);
});

test('--json is machine-readable; no inbox yet is said, not an error', () => {
  const dir = tree();
  const items = JSON.parse(boss(['inbox', '--json'], dir));
  assert.equal(items.length, 5);
  assert.match(boss(['inbox'], project({})), /No inbox here yet.*\/inbox <file, link or paste>/);
});
