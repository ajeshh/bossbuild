// content-terminology-guard — the ONE checkable part of the design system's content half.
//
// WHY THIS FILE EXISTS: v0.168.0's CHANGELOG claimed the guard was "Verified across seven cases
// including the negatives." No test file was ever committed, so those seven cases were ephemeral —
// and that shipped in the same release arc as v0.170.0, whose entire subject is "does anything
// actually test the thing you shipped." Found 2026-08-24 by the independent re-vet of RVW-077, a
// debt docs/RESUME.md had carried as "an independent pass is still owed."
//
// WHAT MATTERS MOST HERE IS THE SILENCE, same as the sibling guard: the JIT gate (no filled-in
// Terminology table -> no opinion) and the scope boundary the hook's own header sets — copy only,
// never identifiers, "Do not extend this hook to tone."

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { project, cleanup } from './helpers.js';
import { STAGES_DIR } from '../src/paths.js';

after(cleanup);

const HOOK = join(STAGES_DIR, 'L1-mvp', 'template', '.claude', 'hooks',
  'content-terminology-guard.js');

function run(dir, toolInput, toolName = 'Write') {
  const stdout = execFileSync('node', [HOOK], {
    input: JSON.stringify({ cwd: dir, tool_name: toolName, tool_input: toolInput }),
    encoding: 'utf8',
  });
  if (!stdout.trim()) return '';
  return JSON.parse(stdout).hookSpecificOutput.additionalContext;
}

const TABLE = [
  '# Style guide', '', '## Terminology', '',
  '| Use | Never | Because |', '|---|---|---|',
  '| team | organization, org | the people say "team" |', '',
].join('\n');

function withGuide(md = TABLE) {
  const dir = project({});
  mkdirSync(join(dir, 'docs', 'design'), { recursive: true });
  writeFileSync(join(dir, 'docs', 'design', 'STYLE_GUIDE.md'), md);
  return dir;
}

// --- the JIT gate: silence is the load-bearing behaviour ---------------------

test('no style guide at all -> the guard says nothing', () => {
  assert.equal(run(project({}), { file_path: 'src/A.tsx', content: '<p>Your organization</p>' }), '');
});

test('a SKELETON terminology table is not a decision -> still silent', () => {
  const skeleton = TABLE.replace('| team | organization, org | the people say "team" |',
    '| <the word> | <the word you never use> | <why> |');
  assert.equal(run(withGuide(skeleton), { file_path: 'src/A.tsx', content: '<p>Your organization</p>' }), '',
    'an unfilled placeholder row must not produce an opinion — a skeleton is not a decision');
});

// --- the positive case ------------------------------------------------------

test('a banned word in real copy is caught, and the right word is handed back', () => {
  const ctx = run(withGuide(), { file_path: 'src/A.tsx', content: '<p>Invite your organization</p>' });
  assert.match(ctx, /organization/i, 'the banned word is not reported');
  assert.match(ctx, /team/i, 'the replacement the project chose is not offered');
});

test('the banned list splits on commas — every listed variant is caught, not just the head', () => {
  // "organization, org" is two words. Verifying the tail matters: a cited list whose head is checked
  // and whose tail is not is a recurring BOSS defect.
  const ctx = run(withGuide(), { file_path: 'src/A.tsx', content: '<p>Leave this org now</p>' });
  assert.match(ctx, /\borg\b/i, 'only the first banned variant is being checked');
});

// --- the scope boundary the hook's own header sets ---------------------------

test('identifiers, imports and paths are NOT copy — the hook never renames code', () => {
  const src = [
    'import { organization } from "../lib/organization";',
    'const organizationId = getOrganization();',
    'export default function Organization() { return null; }',
  ].join('\n');
  assert.equal(run(withGuide(), { file_path: 'src/org.ts', content: src }), '',
    'the guard reached into identifiers — its own header says code "can say whatever it likes"');
});

test('a file that cannot carry copy is skipped', () => {
  assert.equal(run(withGuide(), { file_path: 'src/a.css', content: '.organization { color: red }' }), '');
});

test('the style guide and test files are exempt — the rule may name the word it bans', () => {
  for (const f of ['docs/design/STYLE_GUIDE.md', 'src/A.test.tsx']) {
    assert.equal(run(withGuide(), { file_path: f, content: 'the word organization' }), '',
      `${f} must be exempt, or the guard fires on the document that defines the rule`);
  }
});

// --- fail-open: a broken session is worse than a missed warning --------------

test('garbage input exits silently rather than breaking the session', () => {
  const stdout = execFileSync('node', [HOOK], { input: 'not json at all', encoding: 'utf8' });
  assert.equal(stdout.trim(), '', 'the guard must fail open');
});
