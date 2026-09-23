// The conscience says one thing (IDEA-121 tier 2).
//
// Two defects, measured on BOSS's own repo before the fix: the first prompt of a session carried
// 11.4KB and five full frames, and two of the five ("the code calls an LLM") fired because a copy
// of the detection regex sat in `src/earned.js` and matched itself. The detector matched WORDS —
// a README, a JSON fixture and a test comment all opened it — while a real Gemini call did not.

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { BOSS_ROOT } from '../src/paths.js';
import { llmInSource } from '../src/earned.js';
import { project, cleanup } from './helpers.js';
import { parseFrontmatter } from '../stages/L0-quickstart/template/.claude/hooks/lib/yaml.js';
import {
  classifyLoop, rankSignals, composeContext, MOMENT_PRIORITY,
} from '../stages/L0-quickstart/template/.claude/hooks/lib/loop-runtime.js';

after(cleanup);

const loopFile = (id) => join(BOSS_ROOT, 'stages', 'L1-mvp', 'template', '.boss', 'loops', `${id}.md`);
const entryOf = (id) => parseFrontmatter(readFileSync(loopFile(id), 'utf8')).entry;
const opens = (id, files) => classifyLoop({ entry: entryOf(id), exit: [] }, project(files)).entry.all_ok;

const sig = (moment, confidence = 'high', loop_id = `${moment}-loop`) => ({ loop_id, moment, confidence, evidence: {} });

test('signals rank by stakes, then confidence, and unknown moments go last', () => {
  const ranked = rankSignals([sig('task-hygiene'), sig('cost'), sig('drift', 'low'), sig('mystery'), sig('drift', 'high', 'd2'), sig('deception', 'low')]);
  assert.deepEqual(ranked.map((s) => s.loop_id), ['deception-loop', 'd2', 'drift-loop', 'cost-loop', 'task-hygiene-loop', 'mystery-loop']);
  assert.equal(MOMENT_PRIORITY[0], 'deception', 'harm to someone else outranks everything');
});

test('several open signals voice ONE frame and only name the rest', () => {
  const one = composeContext([sig('drift')]);
  const many = composeContext([sig('drift'), sig('cost'), sig('coherence')]);
  assert.ok(many.startsWith(one), 'the lead frame is exactly the single-signal frame');
  assert.match(many, /Also open, not voiced this time[^\n]*cost-loop \(cost\), coherence-loop \(coherence\)/);
  assert.ok(!/\[BOSS conscience — \d+ signals\]/.test(many), 'no enumeration of full frames');
  assert.ok(many.length < one.length + 300, `the extra signals cost a line, not a frame (${many.length - one.length} chars)`);
});

test('a single signal is byte-identical to before — no "also open" line', () => {
  assert.ok(!composeContext([sig('drift')]).includes('Also open'));
});

// The table from the review, one row each. `src/` is inside the default `$source` roots.
const CASES = [
  ['a README that names a vendor', { 'src/README.md': 'Unlike openai, we do it by hand.\n' }, false],
  ['a JSON fixture', { 'src/__fixtures__/resp.json': '{"provider": "anthropic"}\n' }, false],
  ['a test that mentions a call', { 'src/evals/judge.test.ts': '// uses generateText( under the hood\nimport OpenAI from "openai";\n' }, false],
  ['a plain word in source', { 'src/copy.ts': 'export const vendor = "openai";\n' }, false],
  ['a JS SDK import', { 'src/ai.ts': 'import Anthropic from "@anthropic-ai/sdk";\n' }, true],
  ['a JS client constructed', { 'src/ai.js': 'const client = new OpenAI({ apiKey });\n' }, true],
  ['a chat completion call', { 'src/a.ts': 'await client.chat.completions.create({});\n' }, true],
  ['the AI SDK', { 'app/route.ts': "import { streamText } from 'ai';\nconst r = streamText({ model });\n" }, true],
  ['a Python Gemini import', { 'src/api.py': 'import google.generativeai as genai\n' }, true],
  ['a Python Anthropic client', { 'src/api.py': 'from anthropic import Anthropic\nclient = Anthropic()\n' }, true],
  ['source under a dir whose name ends in "test"', { 'src/latest/ai.ts': 'import OpenAI from "openai";\n' }, true],
];

for (const loop of ['cost-budget-loop', 'ai-failure-state-loop']) {
  for (const [name, files, expected] of CASES) {
    test(`${loop}: ${name} → ${expected ? 'opens' : 'stays closed'}`, () => {
      assert.equal(opens(loop, files), expected);
    });
  }
}

test('the two LLM loops share one entry predicate, and the earned hold evaluates the same one', () => {
  assert.deepEqual(entryOf('ai-failure-state-loop'), entryOf('cost-budget-loop'));
  for (const [name, files, expected] of CASES) assert.equal(llmInSource(project(files)), expected, name);
});

test("BOSS's own source does not read as calling a model", () => {
  assert.equal(llmInSource(BOSS_ROOT), false, 'a detector that matches itself fires on every prompt');
});
