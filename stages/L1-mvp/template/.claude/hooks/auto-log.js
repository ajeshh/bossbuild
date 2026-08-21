#!/usr/bin/env node
// BOSS auto-log — a SubagentStop hook (OPT-IN; the trace substrate for IDEA-025).
//
// Ported UP from the dhun dogfood (Principle #1), Node-ported for BOSS's zero-dep
// rule. WHAT IT DOES: after a writer subagent finishes, append one honest line to
// `.boss/trace.jsonl` recording what that agent actually touched — session, agent,
// changed files, timestamp. This is the *trace substrate*: the within-session
// counterpart to `boss insights` (which reads the cross-project registry). It is
// the raw material a trace-native judge (IDEA-025 Phase 2, `/judge-traces`) and the
// sleep-time learn loop (Phase 3) read later. It does NOT judge, score, or send
// anything anywhere.
//
// HUMANE CONTRACT (inherits IDEA-021 / IDEA-013, non-negotiable):
//   - LOCAL-ONLY. Writes one file in this repo. Never transmits. Never shares up.
//   - APPEND-ONLY, facts not estimates. Records what the git tree shows changed.
//   - MEASURE, DON'T INSTRUMENT THE HUMAN. It reads the work's own trace, not you.
//   - READ ON DEMAND. Nothing consumes this file unless you run a skill that does.
//
// WHY OPT-IN: a SubagentStop hook fires a process after every subagent — real
// latency on multi-agent sessions. Ship it dormant; turn it on when you want the
// trace (regulated/high-stakes cohorts, or BOSS's own repo eating its dogfood).
//
// TO TURN IT ON — add to .claude/settings.json (registration IS the on-switch):
//   "hooks": {
//     "SubagentStop": [
//       { "matcher": "",
//         "hooks": [ { "type": "command",
//                      "command": "node \"$CLAUDE_PROJECT_DIR/.claude/hooks/auto-log.js\"",
//                      "timeout": 10 } ] }
//     ]
//   }
//
// Fail-open: any surprise exits 0. A trace line missed is fine; a broken session is not.

import process from 'node:process';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, appendFileSync } from 'node:fs';
import { join } from 'node:path';

// Read-only agent types never write files — skip them (no trace to record).
const READ_ONLY = new Set([
  'Explore', 'Plan', 'claude-code-guide', 'general-purpose-readonly',
  'mentor-founder', 'mentor-architect', 'mentor-customers', 'mentor-capital',
  'mentor-fundraising', 'mentor-hiring', 'mentor-humane', 'mentor-pitch',
]);

function readStdin() {
  return new Promise((resolve) => {
    let data = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (c) => (data += c));
    process.stdin.on('end', () => resolve(data));
    setTimeout(() => resolve(data), 1500);
  });
}

const git = (repo, args) => {
  try {
    // Trailing-only trim: porcelain's leading status columns are significant
    // (line 1 is " M path" — a full .trim() would eat that leading space and
    // shift the column parse by one).
    return execFileSync('git', args, { cwd: repo, encoding: 'utf8' }).replace(/\n+$/, '');
  } catch {
    return '';
  }
};

const main = async () => {
  const repo = process.env.CLAUDE_PROJECT_DIR || process.cwd();

  let agent = 'unknown';
  let session = 'unknown';
  try {
    const json = JSON.parse(await readStdin());
    agent = json.subagent_type || json.tool_input?.subagent_type || json.agent_type || 'unknown';
    session = json.session_id || 'unknown';
  } catch {
    process.exit(0); // fail-open
  }
  if (READ_ONLY.has(agent)) process.exit(0);

  // Facts not estimates: read what the working tree actually shows changed —
  // both tracked modifications AND new untracked files (coders create files,
  // which a plain `git diff HEAD` would miss). `git status --porcelain` carries
  // both; columns 0-1 are the status code, the path starts at column 3.
  const changed = [
    ...new Set(
      git(repo, ['status', '--porcelain', '--untracked-files=all'])
        .split('\n')
        .filter(Boolean)
        .map((l) => l.slice(3).replace(/^"|"$/g, '').split(' -> ').pop())
        .filter(Boolean)
    ),
  ];
  if (changed.length === 0) process.exit(0); // nothing written → nothing to trace

  const files = changed.slice(0, 25); // cap the line; a 200-file diff doesn't need every path
  const record = {
    ts: new Date().toISOString(),
    session,
    agent,
    files,
    file_count: changed.length,
  };

  const dir = join(repo, '.boss');
  const out = join(dir, 'trace.jsonl');
  try {
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    // Dedup: SubagentStop can fire several times for one change set. Skip if the
    // last line has the same (session, agent, files) signature.
    if (existsSync(out)) {
      const lines = readFileSync(out, 'utf8').trim().split('\n');
      const last = lines[lines.length - 1];
      if (last) {
        try {
          const p = JSON.parse(last);
          const same =
            p.session === session &&
            p.agent === agent &&
            JSON.stringify(p.files) === JSON.stringify(files);
          if (same) process.exit(0);
        } catch { /* fall through and write */ }
      }
    }
    appendFileSync(out, JSON.stringify(record) + '\n');
  } catch {
    process.exit(0); // fail-open: a write surprise must not break the session
  }
  process.exit(0);
};

main();
