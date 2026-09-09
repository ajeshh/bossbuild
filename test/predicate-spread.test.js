// `min_files` — the SPREAD bar on count_at_least (IDEA-088, v0.268.0).
//
// Found by turning BOSS's own conscience on for the first time. design-tokens-loop fired at HIGH
// confidence on a zero-dep CLI, reporting "UI is accumulating in the code (several files styling by
// hand)". All 52 matches were in ONE file — `src/board.js`, a module that GENERATES an HTML board —
// and every other file in `src/` had zero. The predicate counted OCCURRENCES; the moment's claim was
// about FILES. Occurrences measure how chatty one file is; files measure whether a pattern has
// spread, and spread is the thing a design system exists to stop.

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { project, cleanup } from './helpers.js';
import { classifyLoop } from '../stages/L0-quickstart/template/.claude/hooks/lib/loop-runtime.js';

after(cleanup);

const loop = (min, minFiles) => ({
  id: 'probe-loop',
  entry: [{ count_at_least: { path_glob: 'src/**', pattern: 'class="', min, ...(minFiles === undefined ? {} : { min_files: minFiles }) } }],
  exit: [{ exists: { path: 'never.md' } }],
});

const generator = { 'src/gen.js': 'const a = \'<b class="x">\'; const c = \'<b class="y">\'; const d = \'<b class="z">\';\n' };
const spread = {
  'src/a.js': 'x = \'<b class="x">\';\n',
  'src/b.js': 'x = \'<b class="y">\';\n',
  'src/c.js': 'x = \'<b class="z">\';\n',
};

test('without min_files, one chatty file clears an occurrence bar — the old behaviour, unchanged', () => {
  const r = classifyLoop(loop(3), project(generator));
  assert.equal(r.entry.results[0].ok, true);
  assert.equal(r.entry.results[0].evidence.count, 3);
});

test('min_files refuses a single generator: 3 occurrences, 1 file, not a pattern', () => {
  const r = classifyLoop(loop(3, 3), project(generator));
  assert.equal(r.entry.results[0].ok, false, 'one file cannot be "several files"');
  assert.equal(r.entry.results[0].evidence.matchedFiles, 1);
});

test('min_files still fires when the styling has actually SPREAD', () => {
  const r = classifyLoop(loop(3, 3), project(spread));
  assert.equal(r.entry.results[0].ok, true);
  assert.equal(r.entry.results[0].evidence.matchedFiles, 3);
});

test('matchedFiles is reported distinctly from files READ — they are different facts', () => {
  const r = classifyLoop(loop(3, 3), project({ ...generator, 'src/quiet.js': 'no styling here\n' }));
  const ev = r.entry.results[0].evidence;
  assert.equal(ev.files, 2, 'two files were read');
  assert.equal(ev.matchedFiles, 1, 'only one of them matched');
});

test('the shipped design-tokens-loop carries the spread bar', () => {
  // The loop whose false positive found this. Guarded so the bar cannot be dropped silently.
  const spec = readFileSync(
    new URL('../stages/L1-mvp/template/docs/loops/design-tokens-loop.md', import.meta.url), 'utf8',
  );
  assert.match(spec, /min_files:\s*3/);
});
