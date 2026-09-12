#!/usr/bin/env node
// BOSS smoke-guard — a Stop hook (OPT-IN; the enforcement half of `/smoke`).
//
// WHY IT EXISTS: `/smoke` is the one gate before a commit in MVP, and it is deliberate-invoke — it
// runs when someone remembers to run it. An agent that has just written code and says "done" is the
// moment it is least likely to be remembered, and the moment it matters most: whatever is red now is
// the base the next change builds on. BOSS ships six PostToolUse guards for design, data and copy
// and, until this one, none for the code's own gate. `scalable-architecture` says *documented
// conventions rot; enforced conventions compound* — this is the runner for the smoke half of that.
//
// THE GRAIN IS ONCE PER TURN, NOT ONCE PER WRITE. A smoke can take thirty seconds; running it after
// every Edit would make the hook the thing that gets turned off. `Stop` fires when Claude finishes a
// turn — the "before a commit" moment — and the guard runs only when the working tree has changed
// since the last run it recorded. Nothing changed, nothing runs, nothing said.
//
// WHAT IT DOES WITH RED: it hands the first failing chunk back to Claude as a reason to keep going,
// exactly once. If Claude stops again after that (whether it fixed the smoke or explained why red is
// expected), the guard reports and does not block — a hook that blocks twice on the same failure is
// a loop, and the founder's session is not the place to find that out. `stop_hook_active` is the
// host's own flag for "you are already continuing because a Stop hook said so."
//
// THE JIT RULE THAT KEEPS IT QUIET: no `.boss/smoke.json`, no opinion. `/smoke` writes that file the
// first time a founder names what proves the app is alive; until then there is nothing honest to run
// and the guard exits silently. Docs-only changes (`docs/`, `*.md`, `.boss/`) never trigger it.
//
// WHY OPT-IN: a Stop hook runs a process — and here, the smoke command — at the end of every turn
// that touched source. Ship it dormant; registration IS the on-switch.
//
// TO TURN IT ON — add to .claude/settings.json:
//   "hooks": {
//     "Stop": [
//       { "hooks": [ { "type": "command",
//                      "command": "node \"$CLAUDE_PROJECT_DIR/.claude/hooks/smoke-guard.js\"",
//                      "timeout": 90 } ] }
//     ]
//   }
//
// Fail-open: any surprise exits 0 silently. A missed check is fine; a broken session is not.

import { readFileSync, writeFileSync, existsSync, statSync, mkdirSync } from 'node:fs';
import { execFileSync, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { join } from 'node:path';

const SMOKE_TIMEOUT_MS = 75_000; // under the 90 s hook timeout, over the "~30 s" /smoke asks for
const MAX_CHUNK = 1500;
const DOCS_ONLY = /(^|[\\/])(docs|\.boss)[\\/]|\.md$/i;

let event = {};
try {
  event = JSON.parse(readFileSync(0, 'utf8') || '{}');
} catch {
  process.exit(0); // fail-open
}

try {
  const projectDir = process.env.CLAUDE_PROJECT_DIR || event.cwd || process.cwd();
  const smokeFile = join(projectDir, '.boss', 'smoke.json');
  if (!existsSync(smokeFile)) process.exit(0); // no smoke configured — /smoke is the opt-in

  let command = '';
  try { command = String(JSON.parse(readFileSync(smokeFile, 'utf8')).command || '').trim(); } catch { /* fall through */ }
  if (!command) process.exit(0);

  // What changed? A fingerprint of the working tree's SOURCE changes — path + size + mtime of every
  // modified or untracked non-doc file. Cheap (no content hashing), and stable enough that "nothing
  // changed since the last run" is a real answer. No git → null → run every time, which is honest
  // for a repo that has nothing else to compare against.
  let fingerprint = null;
  try {
    const status = execFileSync('git', ['status', '--porcelain=v1', '-z', '--untracked-files=all'], {
      cwd: projectDir, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], timeout: 5000,
    });
    const paths = status.split('\0').filter(Boolean).map((l) => l.slice(3)).filter((p) => p && !DOCS_ONLY.test(p));
    if (!paths.length) process.exit(0); // nothing but docs moved — nothing to smoke
    const h = createHash('sha1');
    for (const p of paths.sort()) {
      let s = '';
      try { const st = statSync(join(projectDir, p)); s = `${st.size}:${Math.floor(st.mtimeMs)}`; } catch { s = 'gone'; }
      h.update(`${p}\0${s}\n`);
    }
    fingerprint = h.digest('hex');
  } catch { fingerprint = null; }

  const stateFile = join(projectDir, '.boss', 'smoke-guard.json');
  let state = {};
  try { state = JSON.parse(readFileSync(stateFile, 'utf8')); } catch { state = {}; }
  if (fingerprint && state.fingerprint === fingerprint && state.command === command) process.exit(0); // already run on this exact tree

  const started = Date.now();
  const run = spawnSync(command, {
    cwd: projectDir, shell: true, encoding: 'utf8', timeout: SMOKE_TIMEOUT_MS,
    env: { ...process.env, CI: '1', FORCE_COLOR: '0' },
  });
  const ms = Date.now() - started;
  const timedOut = run.error && run.error.code === 'ETIMEDOUT';
  const green = !timedOut && run.status === 0;

  try {
    mkdirSync(join(projectDir, '.boss'), { recursive: true });
    writeFileSync(stateFile, JSON.stringify({
      fingerprint, command, result: green ? 'green' : 'red', at: new Date().toISOString(), ms,
    }, null, 2) + '\n');
  } catch { /* state is a convenience, not the check */ }

  if (green) {
    process.stdout.write(JSON.stringify({ systemMessage: `✓ smoke — ${command} (${(ms / 1000).toFixed(1)}s)` }));
    process.exit(0);
  }

  const raw = `${run.stdout || ''}\n${run.stderr || ''}`.trim();
  const chunk = timedOut
    ? `timed out after ${Math.round(SMOKE_TIMEOUT_MS / 1000)}s — a smoke should answer in ~30s; if this one can't, /smoke can pick a faster command`
    : (raw.split('\n').filter((l) => l.trim()).slice(0, 25).join('\n').slice(0, MAX_CHUNK) || `exit ${run.status}`);
  const head = `✗ smoke — ${command}`;

  if (event.stop_hook_active) {
    // Already continuing because this hook said so once. Report; never block twice on one failure.
    process.stdout.write(JSON.stringify({ systemMessage: `${head} — still red after the fix pass. Red is information: fix it or say why it's expected before the commit.` }));
    process.exit(0);
  }

  process.stdout.write(JSON.stringify({
    decision: 'block',
    reason: `${head}\n\n${chunk}\n\nThe smoke went red on this turn's changes. Fix it, or say plainly why red is expected right now, before stopping — a red base is what the next change builds on. (smoke-guard runs \`.boss/smoke.json\`'s command once per changed tree; it will not block again on this failure.)`,
  }));
  process.exit(0);
} catch {
  process.exit(0); // fail-open
}
