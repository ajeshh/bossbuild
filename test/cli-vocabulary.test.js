// The typo suggester's vocabulary must be the CLI's actual vocabulary.
//
// WHY THIS FILE EXISTS: `KNOWN_COMMANDS` is hand-kept beside the `switch` in `run()` that dispatches
// for real, and by v0.252.0 it had drifted by SIX — `records`, `id`, `credit`, `uninstall`,
// `whatsnew`, `outdated`. Nearly a quarter of the surface, and two of them (`records`, `id`) are
// named 14 times in shipped founder text.
//
// THE HARM WAS A WRONG ANSWER, NOT A MISSING ONE, which is why this earns a test rather than a note:
//
//     $ boss idd
//       Error unknown command 'idd'. Did you mean boss new?
//
// `boss id` is one edit away and was invisible, so the suggester confidently named the nearest thing
// it COULD see — `boss new`, the command that creates a project, offered to someone who wanted a
// read-only number. Same shape for `boss outdate` → "did you mean update?" while `outdated` sat one
// edit away. **A suggester that cannot see a command does not fall silent; it misdirects.**
//
// The list stays hand-written (a `switch` is not enumerable at runtime without reading our own
// source), so this test is the thing that makes it a checked claim instead of a restated one —
// the same rule `check-refs` class 4 follows by building agent names off disk.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { BOSS_ROOT } from '../src/paths.js';

const src = readFileSync(join(BOSS_ROOT, 'src', 'cli.js'), 'utf8');

// Flags are deliberately out of scope: `--help` is not a plausible typo for a bare word, and
// suggesting it would be noise. Everything else in the dispatch switch is a command a founder types.
const IS_FLAG = (c) => c.startsWith('-');

function dispatchedCommands() {
  const run = src.slice(src.indexOf('export async function run(argv)'));
  assert.ok(run.length > 0, 'run(argv) not found — this test is parsing the wrong shape');
  const cases = [...run.matchAll(/case '([a-z-]+)':/g)].map((m) => m[1]);
  assert.ok(cases.length > 5, `expected a dispatch switch, found ${cases.length} cases`);
  return [...new Set(cases)].filter((c) => !IS_FLAG(c));
}

function knownCommands() {
  const m = src.match(/const KNOWN_COMMANDS = \[([\s\S]*?)\];/);
  assert.ok(m, 'KNOWN_COMMANDS not found');
  return [...m[1].matchAll(/'([a-z-]+)'/g)].map((x) => x[1]);
}

test('the typo suggester can see every command the CLI dispatches', () => {
  const known = new Set(knownCommands());
  const missing = dispatchedCommands().filter((c) => !known.has(c));
  assert.deepEqual(
    missing, [],
    `these commands dispatch but are invisible to nearestCommand(): ${missing.join(', ')}. `
    + 'A founder who typos one gets pointed at the nearest command the suggester CAN see, which is '
    + 'a confident wrong answer — `boss idd` once answered "did you mean boss new?".',
  );
});

test('the suggester names no command the CLI cannot run', () => {
  const dispatched = new Set(dispatchedCommands());
  const phantom = knownCommands().filter((c) => !dispatched.has(c));
  assert.deepEqual(
    phantom, [],
    `KNOWN_COMMANDS lists ${phantom.join(', ')}, which nothing dispatches — the suggester would `
    + 'send a founder to a command that does not exist. The inverse of the drift above, and the '
    + 'reason this is checked in both directions rather than one.',
  );
});
