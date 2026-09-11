// contrast-guard — the one accessibility property that is arithmetic rather than a judgment.
//
// BOSS said two contradictory things about contrast in shipped text: `designer.md` called it "not
// checked, never a pass" (true only of a RENDERED page), while `/design-library` carried a
// `{{ratio}}` placeholder nothing computed. The style guide already prescribed the right method —
// "check the token pairs, not screenshots" — and the arithmetic was never shipped.
//
// These cases pin the two halves that matter: the numbers are right, and the scope is honest.

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { project, cleanup } from './helpers.js';

after(cleanup);

const HOOK = join(process.cwd(), 'stages', 'L1-mvp', 'template', '.claude', 'hooks', 'contrast-guard.js');

function run(file_path) {
  const stdout = execFileSync('node', [HOOK], {
    input: JSON.stringify({ tool_name: 'Write', tool_input: { file_path } }),
    encoding: 'utf8',
  });
  if (!stdout.trim()) return '';
  return JSON.parse(stdout).hookSpecificOutput.additionalContext;
}

function tokens(lines, name = 'DESIGN_TOKENS.md') {
  const dir = project({});
  mkdirSync(join(dir, 'docs', 'design'), { recursive: true });
  const p = join(dir, 'docs', 'design', name);
  writeFileSync(p, lines.join('\n') + '\n');
  return p;
}

// The numbers are the whole point — if they are wrong the hook is worse than nothing, because it
// would be authoritative and incorrect about an accessibility floor.
test('computes WCAG ratios correctly at the AA boundary', () => {
  // #767676 on white is the canonical just-passes grey: 4.54:1. It must NOT be flagged.
  assert.equal(
    run(tokens(['- `color.text.body` — #767676', '- `color.surface.background` — #ffffff'])), '',
    '#767676 on #ffffff is 4.54:1 and passes AA — flagging it would train the founder to ignore this',
  );
  // #777777 on white is 4.48:1 — just under. It must be flagged.
  const out = run(tokens(['- `color.text.body` — #777777', '- `color.surface.background` — #ffffff']));
  assert.match(out, /4\.48:1/, 'one shade darker is 4.48 and fails — the boundary is real, not approximate');
});

test('separates "fails outright" from "large text only"', () => {
  const mid = run(tokens(['- `color.text.muted` — #949494', '- `color.surface.background` — #ffffff']));
  assert.match(mid, /large text only/, '#949494 on white is ~3.1:1 — passes AA for large text, not body');
  const bad = run(tokens(['- `color.text.muted` — #aaaaaa', '- `color.surface.background` — #ffffff']));
  assert.match(bad, /2\.32:1/);
  assert.match(bad, /fails AA for any text size/);
});

// The scope note is load-bearing: a guard that implied it had verified the page would be worse than
// no guard, because the founder would stop looking.
test('states what it did NOT check, every time', () => {
  const out = run(tokens(['- `color.text.body` — #aaaaaa', '- `color.surface.background` — #ffffff']));
  assert.match(out, /not checked/, 'runtime compositing stays not-checked and must say so');
  assert.match(out, /image|gradient|overlay/i);
  assert.match(out, /\*\*in the tokens\*\*/, 'the fix belongs where the pair is declared, not on one screen');
});

test('stays SILENT on a file that is not a tokens file (the JIT gate)', () => {
  assert.equal(run(tokens(['- `color.text.body` — #aaaaaa', '- `color.surface.background` — #ffffff'], 'NOTES.md')), '');
});

test('stays SILENT when there is nothing pairable', () => {
  assert.equal(run(tokens(['- `color.text.body` — #000000'])), '', 'text with no surface is not a pair');
  assert.equal(run(tokens(['- `color.brand.accent` — #3B82F6'])), '', 'an accent alone is not a text pair');
});

test('handles 3- and 8-digit hex, ignoring alpha it cannot composite', () => {
  const out = run(tokens(['- `color.text.body` — #aaa', '- `color.surface.background` — #ffffffff']));
  assert.match(out, /2\.32:1/, '#aaa expands to #aaaaaa; the alpha byte is dropped, not guessed');
});

test('fails open — a broken guard must never break a session', () => {
  assert.equal(execFileSync('node', [HOOK], { input: 'not json', encoding: 'utf8' }).trim(), '');
});
