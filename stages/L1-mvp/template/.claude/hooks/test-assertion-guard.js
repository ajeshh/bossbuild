#!/usr/bin/env node
// BOSS test-assertion-guard — a PostToolUse hook (OPT-IN). The boundary under "a bug fix adds a test;
// only an intended behaviour change edits one."
//
// WHY IT EXISTS: an agent asked to make a failing test pass can do it two ways — fix the code, or loosen
// the test — and the second is the shorter path. Agents do take it: a 2025 benchmark of coding agents on
// tasks rigged so the only way to pass was to cheat found them editing tests, from deleting an assertion
// to overloading operators; making tests read-only stopped that one move without hurting honest work.
// (It measured the impossible case; how often this happens in ordinary work is unmeasured.) And in one
// practitioner's agent-built app, the threshold the agent kept quietly loosening was the one rule that
// carried no self-correction message — and the exceptions the agent created were the best place to
// start a review. So this guard is that message, at the moment the exception is made.
//
// WHAT IT DOES: when a test file is edited and the edit REMOVES assertions or ADDS a skip, AND non-test
// source in the repo also has uncommitted changes, it names what was loosened and what changed beside
// it, and asks for the reason. Advisory, never blocking: deleting a stale assertion during a real
// behaviour change is correct, and the founder (or the agent, in one line) says so.
//
// THE SILENCE: a test edit on its own says nothing — writing and fixing tests is normal work. No git,
// no opinion (it can't tell what else changed). A non-test file, nothing. An edit that adds assertions,
// nothing. Stack-neutral by text: JS/TS `expect(`/`assert`, Python `assert`/`self.assert*`, Go
// `t.Error/Fatal`, Rust `assert!`, Swift `XCTAssert`, JUnit `assertThat`; skips like `.skip(`, `xit(`,
// `@pytest.mark.skip`, `t.Skip(`, `#[ignore]`.
//
// TO TURN IT ON — add to .claude/settings.json:
//   "hooks": { "PostToolUse": [ { "matcher": "Edit|Write|MultiEdit",
//     "hooks": [ { "type": "command",
//                  "command": "node \"$CLAUDE_PROJECT_DIR/.claude/hooks/test-assertion-guard.js\"",
//                  "timeout": 5 } ] } ] }
//
// Fail-open: any surprise exits 0 silently. A missed warning is fine; a broken session is not.

import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const TEST_FILE = /(^|[\\/])(tests?|__tests__|spec)[\\/]|[._-](test|spec)\.[a-z]+$|(^|[\\/])test_[^\\/]+\.py$|_test\.(go|py|rb)$|Tests?\.(swift|kt|java|cs)$/i;
const DOCS = /(^|[\\/])(docs|\.boss|\.claude)[\\/]|\.(md|txt|json|ya?ml|lock)$/i;
const ASSERTION = /\bexpect\s*\(|\bassert(?:_\w+|\.\w+|!|Eq|That)?\s*[(!]|^\s*assert\s|\bself\.assert\w*\s*\(|\bt\.(?:Error|Errorf|Fatal|Fatalf)\s*\(|\bXCTAssert\w*\s*\(|\b(?:EXPECT|ASSERT)_\w+\s*\(|\.should\b/gm;
const SKIP = /\b(?:it|test|describe)\.(?:skip|todo)\s*\(|\bx(?:it|describe|test)\s*\(|@pytest\.mark\.(?:skip|xfail)|\bt\.Skip\w*\s*\(|#\[ignore\]|@(?:Disabled|Ignore)\b|\{\s*skip\s*:\s*true/g;

const count = (re, s) => (String(s || '').match(re) || []).length;
const out = (additionalContext) => {
  process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName: 'PostToolUse', additionalContext } }));
  process.exit(0);
};
const norm = (p) => String(p).replace(/\\/g, '/');

let event;
try {
  event = JSON.parse(readFileSync(0, 'utf8') || '{}');
} catch {
  process.exit(0); // fail-open
}

try {
  const projectDir = process.env.CLAUDE_PROJECT_DIR || event.cwd || process.cwd();
  const input = event.tool_input || {};
  const path = input.file_path ? norm(input.file_path) : '';
  if (!path || !TEST_FILE.test(path)) process.exit(0);
  const rel = path.startsWith(norm(projectDir) + '/') ? path.slice(norm(projectDir).length + 1) : path.replace(/^\//, '');

  const git = (...args) => execFileSync('git', args, { cwd: projectDir, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], timeout: 4000 });

  // What the edit replaced, and with what. A Write replaces the whole file: compare with HEAD's copy.
  let before = '', after = '';
  if (typeof input.old_string === 'string') { before = input.old_string; after = input.new_string || ''; }
  else if (Array.isArray(input.edits)) { before = input.edits.map((e) => e.old_string || '').join('\n'); after = input.edits.map((e) => e.new_string || '').join('\n'); }
  else if (typeof input.content === 'string') {
    after = input.content;
    try { before = git('show', `HEAD:${rel}`); } catch { process.exit(0); } // a new test file loosens nothing
  } else process.exit(0);

  const removed = count(ASSERTION, before) - count(ASSERTION, after);
  const skipped = count(SKIP, after) - count(SKIP, before);
  if (removed <= 0 && skipped <= 0) process.exit(0);

  // Did non-test source change too? Uncommitted, in this repo. No git → no opinion.
  let status;
  try { status = git('status', '--porcelain=v1', '--untracked-files=all'); } catch { process.exit(0); }
  const source = status.split('\n').map((l) => norm(l.slice(3).trim())).filter((p) => p && !TEST_FILE.test(p) && !DOCS.test(p));
  if (!source.length) process.exit(0);

  const what = [
    removed > 0 ? `removed ${removed} assertion${removed === 1 ? '' : 's'}` : '',
    skipped > 0 ? `added ${skipped} skip${skipped === 1 ? '' : 's'}` : '',
  ].filter(Boolean).join(' and ');
  const shown = source.slice(0, 3).map((p) => `\`${p}\``).join(', ') + (source.length > 3 ? ` and ${source.length - 3} more` : '');

  out(
    `test-assertion-guard: this edit to \`${rel}\` ${what}, while ${shown} also changed. ` +
    `Only an intended behaviour change edits an existing test; a bug fix adds one. ` +
    `If the behaviour was meant to change, say what changed in one line. If not, restore the ` +
    `assertion and fix the code — a test loosened to pass is how a broken thing goes green.`
  );
} catch {
  process.exit(0); // fail-open
}
