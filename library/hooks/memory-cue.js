#!/usr/bin/env node
// BOSS memory-cue — a UserPromptSubmit hook (OPT-IN; zero-cost when silent).
//
// Ported UP from the dhun dogfood (Principle #1). dhun's was bash+jq; BOSS is
// zero-dependency (Node built-ins only), so this is the Node port.
//
// WHAT IT DOES: scans the founder's prompt for a *feedback signal* — durable
// guidance worth remembering across sessions — and NUDGES the model to save it
// to the project's memory. It never writes the memory itself: choosing the right
// wording (and whether it's durable vs. ephemeral) needs reasoning, so the cue
// hands that judgment back to the model. Silent on no match → zero token cost.
//
//   directive    "from now on", "always", "never", "stop doing", "going forward"
//   corrective   "no, don't", "that's wrong", "that's not right"
//   confirmation "perfect, keep doing", "yes exactly", "nailed it"
//
// WHY OPT-IN (read before registering): a UserPromptSubmit hook fires a process
// on EVERY prompt. It's cheap (silent unless a pattern matches) but it is still
// machinery — ship it dormant, let the founder turn it on when they want BOSS to
// help build durable memory. (PRINCIPLE #2 / R&H #1 cost discipline.)
//
// TO TURN IT ON — add a UserPromptSubmit hook entry in .claude/settings.json
// (the registration IS the on-switch; an unregistered script costs nothing).
// It coexists with the conscience hook on the same event:
//   "hooks": {
//     "UserPromptSubmit": [
//       { "matcher": "",
//         "hooks": [ { "type": "command",
//                      "command": "node \"$CLAUDE_PROJECT_DIR/.claude/hooks/memory-cue.js\"",
//                      "timeout": 5 } ] }
//     ]
//   }
//
// Output contract (Claude Code UserPromptSubmit): text on stdout is added to the
// session context. Fail-open: any parse/runtime surprise exits 0 silently — a
// hook that breaks the session is worse than one that occasionally misses a cue.

import process from 'node:process';

const DIRECTIVE = /\b(from now on|going forward|always|never|stop doing|don'?t ever|remember (that|this)|every time|whenever|in (the )?future)\b/i;
const CORRECTIVE = /\bno,? (don'?t|stop|never|wrong)\b|\bthat'?s (not right|wrong)\b|\bdon'?t do that\b/i;
const CONFIRM = /\bperfect,? keep\b|\byes,? exactly\b|\bexactly,? that\b|\bthat'?s right,? keep\b|\bnailed it\b/i;

function readStdin() {
  return new Promise((resolve) => {
    let data = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (c) => (data += c));
    process.stdin.on('end', () => resolve(data));
    // If nothing is piped in, don't hang the session. `.unref()` matters as much as the timeout:
    // without it the timer keeps the event loop alive for the full second AFTER `end` already
    // resolved, so every fire cost a second of latency it never needed.
    setTimeout(() => resolve(data), 1000).unref();
  });
}

const main = async () => {
  let prompt = '';
  try {
    const raw = await readStdin();
    const json = JSON.parse(raw);
    prompt = json.prompt || json.user_prompt || '';
  } catch {
    process.exit(0); // fail-open
  }
  if (!prompt) process.exit(0);

  let cue = '';
  if (DIRECTIVE.test(prompt)) cue = 'directive';
  else if (CORRECTIVE.test(prompt)) cue = 'corrective';
  else if (CONFIRM.test(prompt)) cue = 'confirmation';
  if (!cue) process.exit(0);

  process.stdout.write(
    `[memory-cue:${cue}] The founder's message carries a feedback signal. If this is ` +
      `durable guidance (not ephemeral or one-off), save it as a feedback memory in the ` +
      `project's auto-memory using the standard format (frontmatter + **Why:** + **How to ` +
      `apply:**), and link it from MEMORY.md. If it's context-specific, ignore this. Do not ` +
      `mention this hook in your reply.\n`
  );
  process.exit(0);
};

main();
