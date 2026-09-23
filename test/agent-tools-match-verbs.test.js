// An agent told to run a command its `tools:` line forbids fails silently: the host just doesn't
// offer the tool, and the agent improvises or skips the step. Five shipped agents had this until
// 2026-09-23. The runner is `checkAgentTools` in scripts/check-manifests.js (part of `npm run check`);
// this pins the heuristic's edges so a later tweak can't quietly widen or blind it.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { agentToolGaps } from '../scripts/check-manifests.js';

const agent = (tools, body) => `---\nname: x\ndescription: y\n${tools === null ? '' : `tools: ${tools}\n`}---\n\n${body}\n`;

test('a verb right before a backticked boss command needs Bash', () => {
  const g = agentToolGaps(agent('Read, Grep', '1. Read `boss team` (who is on the venture).'));
  assert.deepEqual(g.map((x) => [x.what, x.needs]), [['`boss team`', 'Bash']]);
  assert.equal(agentToolGaps(agent('Read, Bash', '1. Read `boss team`.')).length, 0);
});

test('a verb right before a backticked /skill needs Skill', () => {
  const g = agentToolGaps(agent('Read, Bash', '- you must run `/smoke` before claiming done'));
  assert.deepEqual(g.map((x) => [x.what, x.needs]), [['`/smoke`', 'Skill']]);
  assert.equal(agentToolGaps(agent('Read, Bash, Skill', 'run `/smoke`')).length, 0);
});

test('a pointer handed to the founder is not an instruction', () => {
  for (const body of [
    'Depth: `boss craft mcp`.',
    'Read the records `boss board --next` renders.',
    'hand the founder `boss craft accessibility` rather than reciting it',
  ]) assert.equal(agentToolGaps(agent('Read', body)).length, 0, body);
});

test('no tools line means every tool is inherited, so nothing is flagged', () => {
  assert.equal(agentToolGaps(agent(null, 'Read `boss team`, then run `/smoke`.')).length, 0);
});
