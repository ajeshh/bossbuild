// design-tokens-guard — the boundary `design-system.md` prescribes for "the 47 blues".
//
// The load-bearing behavior here is NOT the detection — it's the SILENCE. A hook that nags a
// founder who never opted into a token system is the unearned ceremony BOSS exists to refuse
// (Principle #2), and it's the failure mode that would get this hook turned off for good. So the
// JIT gate (no DESIGN_TOKENS.md -> no opinion) is locked first and hardest.

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { project, cleanup } from './helpers.js';

after(cleanup);

const HOOK = join(process.cwd(), 'library', 'hooks', 'design-tokens-guard.js');

// Run the hook against a project dir; return the additionalContext string, or '' if silent.
function run(dir, toolInput, toolName = 'Write') {
  const stdout = execFileSync('node', [HOOK], {
    input: JSON.stringify({ cwd: dir, tool_name: toolName, tool_input: toolInput }),
    encoding: 'utf8',
  });
  if (!stdout.trim()) return '';
  return JSON.parse(stdout).hookSpecificOutput.additionalContext;
}

function withTokens() {
  const dir = project({});
  mkdirSync(join(dir, 'docs', 'design'), { recursive: true });
  writeFileSync(
    join(dir, 'docs', 'design', 'DESIGN_TOKENS.md'),
    '# Tokens\n\n- `--color-action-primary` — the main CTA\n',
  );
  return dir;
}

const DRIFT = { file_path: 'src/Button.tsx', content: '<i className="bg-indigo-500" style={{color:"#3B82F6"}}/>' };

test('stays SILENT when the project has no token system (the JIT gate)', () => {
  assert.equal(run(project({}), DRIFT), '', 'no tokens file means no opinion — never nag an un-opted-in founder');
});

test('warns once a token system exists, and names the tokens to use instead', () => {
  const out = run(withTokens(), DRIFT);
  assert.match(out, /bg-indigo-500/, 'catches the palette class');
  assert.match(out, /#3B82F6/, 'catches the raw hex');
  assert.match(out, /--color-action-primary/, 'a warning that names no alternative just gets ignored');
});

test('ignores files where a hex is not design drift', () => {
  const dir = withTokens();
  for (const [label, file_path] of [
    ['the token system itself', 'docs/design/DESIGN_TOKENS.md'],
    ['vendored code', 'node_modules/pkg/a.css'],
    ['prose', 'README.md'],
    ['tests', 'src/a.test.tsx'],
  ]) {
    assert.equal(run(dir, { file_path, content: '#3B82F6 bg-blue-500' }), '', `must ignore ${label}`);
  }
  assert.equal(
    run(dir, { file_path: 'src/a.ts', content: '// see commit #abc1234' }), '',
    'a 7-char git sha is not a color — hex lengths are 3/4/6/8',
  );
});

test('reads what the call actually wrote, across Edit and MultiEdit shapes', () => {
  const dir = withTokens();
  assert.match(run(dir, { file_path: 'a.css', new_string: 'color:#ff0000;' }, 'Edit'), /#ff0000/);
  assert.match(
    run(dir, { file_path: 'a.css', edits: [{ new_string: 'color:#ff0000;' }] }, 'MultiEdit'), /#ff0000/,
  );
  // Only NEW content is drift — a pre-existing hex the founder already decided to keep is not
  // this hook's business, so a call that writes nothing must say nothing.
  assert.equal(run(dir, { file_path: 'a.css', content: '   ' }), '');
});

test('fails open — a broken guard must never break a session', () => {
  const stdout = execFileSync('node', [HOOK], { input: 'not json at all', encoding: 'utf8' });
  assert.equal(stdout.trim(), '', 'unparseable input exits 0 and silent');
});
