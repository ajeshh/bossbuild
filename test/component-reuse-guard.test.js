// component-reuse-guard — the boundary under "reuse first, extend second, create last."
//
// The load-bearing behavior, as with every guard BOSS ships, is the SILENCE. This one fires once
// per NEW component name, never on an edit to a known one, and never at all without an index —
// because a hook that speaks on every write is a hook that gets turned off, and a guard that is off
// is worth less than no guard since the founder believes it is on.

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { project, cleanup } from './helpers.js';

after(cleanup);

const HOOK = join(process.cwd(), 'stages', 'L1-mvp', 'template', '.claude', 'hooks', 'component-reuse-guard.js');

function run(dir, toolInput, toolName = 'Write') {
  const stdout = execFileSync('node', [HOOK], {
    input: JSON.stringify({ cwd: dir, tool_name: toolName, tool_input: toolInput }),
    encoding: 'utf8',
  });
  if (!stdout.trim()) return '';
  return JSON.parse(stdout).hookSpecificOutput.additionalContext;
}

function withIndex() {
  const dir = project({});
  mkdirSync(join(dir, 'docs', 'design'), { recursive: true });
  writeFileSync(join(dir, 'docs', 'design', 'COMPONENTS.md'), [
    '# Component index',
    '',
    '| Component | What it\'s for | Import | Variants | Missing states |',
    '|---|---|---|---|---|',
    '| `Button` | primary and secondary actions | `import { Button }` | primary · ghost | — |',
    '| `EmptyState` | what a list shows before there is data | `import { EmptyState }` | — | loading |',
    '',
  ].join('\n'));
  return dir;
}

const NEW = { file_path: 'src/components/CTAButton.tsx', content: 'export function CTAButton(){}' };

test('stays SILENT when the project has no component index (the JIT gate)', () => {
  assert.equal(run(project({}), NEW), '', 'no index means no opinion — never nag an un-opted-in founder');
});

test('asks the three-way question when an unindexed component is written', () => {
  const out = run(withIndex(), NEW);
  assert.match(out, /reuse, adjust, or new/i, 'the question is the point, not the warning');
  assert.match(out, /CTAButton/);
});

test('names the near-name it should have been compared against', () => {
  const out = run(withIndex(), NEW);
  assert.match(out, /`Button`/, 'CTAButton shares a word with Button — the canonical forked-variant tell');
  assert.match(out, /JOB, not the look/, 'the decision rule travels with the question');
});

// The silence that keeps it usable: editing a component you already have must never speak.
test('stays SILENT for a component already in the index', () => {
  const dir = withIndex();
  assert.equal(run(dir, { file_path: 'src/components/Button.tsx', content: 'x' }), '', 'known component');
  assert.equal(
    run(dir, { file_path: 'src/components/Button.tsx', new_string: 'x' }, 'Edit'), '',
    'an edit to a known component is not a reuse decision',
  );
});

test('ignores what is not a component', () => {
  const dir = withIndex();
  for (const [label, file_path] of [
    ['a barrel', 'src/components/index.tsx'],
    ['a page', 'src/components/page.tsx'],
    ['a test', 'src/components/Card.test.tsx'],
    ['vendored code', 'node_modules/pkg/Thing.tsx'],
    ['a stylesheet', 'src/components/Card.css'],
    ['a lowercase module outside a components dir', 'src/lib/helpers.ts'],
  ]) {
    assert.equal(run(dir, { file_path, content: 'x' }), '', `must ignore ${label}`);
  }
});

// Word-boundary matching: `Button` in the index must not mask a genuinely new `ButtonGroup`.
test('a longer name containing an indexed one still asks', () => {
  const out = run(withIndex(), { file_path: 'src/components/ButtonGroup.tsx', content: 'x' });
  assert.match(out, /ButtonGroup/, 'Button in the index must not mask ButtonGroup');
});

test('says nothing useful-less when the index is still a skeleton', () => {
  const dir = project({});
  mkdirSync(join(dir, 'docs', 'design'), { recursive: true });
  writeFileSync(join(dir, 'docs', 'design', 'COMPONENTS.md'), '# Component index\n\nnothing yet\n');
  assert.equal(run(dir, NEW), '', 'an index with no rows has nothing to compare against');
});

test('fails open — a broken guard must never break a session', () => {
  const stdout = execFileSync('node', [HOOK], { input: 'not json at all', encoding: 'utf8' });
  assert.equal(stdout.trim(), '', 'unparseable input exits 0 and silent');
});
