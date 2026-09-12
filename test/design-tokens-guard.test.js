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

// The SHIPPED copy, which is now the only copy. Until v0.248.0 this pointed at
// `library/hooks/design-tokens-guard.js` — a mirror that reached no founder — so this suite was
// verifying the file nobody ran. That is how the v0.243.0 shape-range fix (SwiftUI / Compose /
// Flutter extensions, the packed-color-int pattern) could land on the shipped hook while the
// tested one stayed web-only, with every case still green. Test the artifact that ships.
const HOOK = join(process.cwd(), 'stages', 'L1-mvp', 'template', '.claude', 'hooks', 'design-tokens-guard.js');

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


// A tokens doc that defines vocabulary for every family. The per-family gate reads this: a family
// with no named tokens is not governed, so these cases need the names to exist.
function withFullTokens() {
  const dir = project({});
  mkdirSync(join(dir, 'docs', 'design'), { recursive: true });
  writeFileSync(
    join(dir, 'docs', 'design', 'DESIGN_TOKENS.md'),
    [
      '# Tokens',
      '',
      '- `--color-action-primary` — the main CTA',
      '- `radius.default` — 2px, chosen on purpose',
      '- `font.body` — the body face',
      '- `spacing.element` / `spacing.section`',
      '- `shadow.raised`',
      '',
    ].join('\n'),
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


// --- the other four families (v0.277.0) -----------------------------------------------------
// The guard enforced ONE of the five families a token system defines. The other four were prose.

test('catches radius, type, spacing and elevation once each family has vocabulary', () => {
  const dir = withFullTokens();
  assert.match(run(dir, { file_path: 'a.css', content: 'border-radius: 12px;' }), /border-radius/, 'radius');
  assert.match(run(dir, { file_path: 'a.css', content: 'font-size: 17px;' }), /font-size/, 'type');
  assert.match(run(dir, { file_path: 'a.css', content: 'padding: 13px;' }), /padding/, 'spacing');
  assert.match(run(dir, { file_path: 'a.css', content: 'box-shadow: 0 2px 8px #0001;' }), /box-shadow/, 'elevation');
  assert.match(run(dir, { file_path: 'a.tsx', content: '<div className="rounded-[13px]"/>' }), /rounded-\[13px\]/);
});

test('names the token vocabulary of the family it actually hit', () => {
  const out = run(withFullTokens(), { file_path: 'a.css', content: 'border-radius: 12px;' });
  assert.match(out, /radius\.default/, 'a warning that names no alternative just gets ignored');
  assert.doesNotMatch(out, /color-action-primary/, "don't dump the whole token file — name the family that was hit");
});

// THE GATE that keeps the four new families quiet: no named tokens for a family, no opinion about
// it. You cannot ask someone to use a token name that does not exist.
test('stays SILENT on a family the tokens file defines no vocabulary for', () => {
  const dir = withTokens(); // color vocabulary only
  assert.equal(run(dir, { file_path: 'a.css', content: 'border-radius: 12px;' }), '', 'no radius tokens, no opinion');
  assert.equal(run(dir, { file_path: 'a.css', content: 'padding: 13px;' }), '', 'no spacing tokens, no opinion');
  // ...and color stays unconditional, because it is the original boundary.
  assert.match(run(dir, { file_path: 'a.css', content: 'color:#3B82F6;' }), /#3B82F6/);
});

// THE NOISE RULE. A guard that cries wolf gets turned off, and a guard that is off is worth less
// than no guard because the founder believes it is on.
test('spacing ignores the scale references and the honest exceptions', () => {
  const dir = withFullTokens();
  for (const [label, content] of [
    ['a Tailwind scale class IS the scale, not drift', '<div className="p-4 gap-2"/>'],
    ['a hairline border is not a spacing decision', 'padding: 1px;'],
    ['zero is not a spacing decision', 'margin: 0;'],
    ['a var() defers to the system', 'padding: var(--spacing-element);'],
    ['calc() defers too', 'gap: calc(var(--s) * 2);'],
  ]) {
    assert.equal(run(dir, { file_path: 'a.tsx', content }), '', label);
  }
});

test('a value that defers to the system is never drift, in any family', () => {
  const dir = withFullTokens();
  for (const content of [
    'border-radius: var(--radius-default);',
    'font-size: inherit;',
    'box-shadow: none;',
    'border-radius: 0;',
  ]) {
    assert.equal(run(dir, { file_path: 'a.css', content }), '', content);
  }
});

test('fails open — a broken guard must never break a session', () => {
  const stdout = execFileSync('node', [HOOK], { input: 'not json at all', encoding: 'utf8' });
  assert.equal(stdout.trim(), '', 'unparseable input exits 0 and silent');
});

// --- v0.310.0: the Deprecated table --------------------------------------------------------

function withDeprecated() {
  const dir = project({});
  mkdirSync(join(dir, 'docs', 'design'), { recursive: true });
  writeFileSync(join(dir, 'docs', 'design', 'DESIGN_TOKENS.md'), [
    '# Design tokens',
    '',
    '## Semantic',
    '- `color.action.primary` — the one accent',
    '- `color.text.body`',
    '',
    '## Deprecated',
    '',
    '| Old | Use instead | Why |',
    '|---|---|---|',
    '| `color.brand` | `color.action.primary` | named by hue; renamed by purpose |',
    '',
    '## Notes',
    '- `space.gutter` is deprecated → `space.section` (line form, outside the table)',
    '',
  ].join('\n'));
  return dir;
}

test('names the successor when a write references a deprecated token — with no raw values at all', () => {
  const out = run(withDeprecated(), { file_path: 'src/Card.tsx', content: 'const c = tokens.color.brand;' });
  assert.match(out, /`color\.brand` → use `color\.action\.primary`/);
  assert.doesNotMatch(out, /hardcoded style values/, 'no hex here — only the deprecation speaks');
});

test('reads the line form too, and does not match a longer token that merely starts the same', () => {
  const out = run(withDeprecated(), { file_path: 'src/a.css', content: 'padding: var(--space-gutter); x: space.gutter;' });
  assert.match(out, /`space\.gutter` → use `space\.section`/);
  const quiet = run(withDeprecated(), { file_path: 'src/b.tsx', content: 'const x = tokens.color.brandmark;' });
  assert.equal(quiet, '', '`color.brandmark` is a different token');
});

test('combines with a raw-value finding in one message, deprecation first', () => {
  const out = run(withDeprecated(), { file_path: 'src/c.css', content: '.x{color:#ff0000; y: color.brand}' });
  assert.ok(out.indexOf('deprecated token') < out.indexOf('hardcoded style values'));
});
