// FEAT-007's call site against a stubbed provider: the failure handlers, the retry, the caps.
// Needs the installed `ai` package (npm ci); with nothing installed these are skipped, not failed.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const mocks = await import('ai/test').catch(() => null);
const { draftAsk } = mocks ? await import('../src/ask/draft.ts') : {};
const skip = mocks ? false : 'the ai package is not installed (npm ci)';

const dir = mkdtempSync(join(tmpdir(), 'kw-draft-'));
process.env.AI_COST_LEDGER = join(dir, 'cost-log.jsonl');
process.on('exit', () => rmSync(dir, { recursive: true, force: true }));
console.warn = console.error = () => {}; // the handlers' app-log lines

const carers = [{ id: 'priya', firstName: 'Priya' }, { id: 'sam', firstName: 'Sam' }, { id: 'dee', firstName: 'Dee' }];
const visit = { id: 'v-0900', day: '2026-09-21', start: '09:00', area: 'Church End' };
const ctx = { agencyId: 'ag_01', owner: 'Marta', baseUrl: 'https://k.test', now: new Date(2026, 8, 20, 18, 50) };
const good = JSON.stringify({ asks: carers.map((c) => ({ carer: c.firstName, text: `Evening ${c.firstName}, could you take a visit tomorrow at 9 in Church End?` })) });

function stub(replies, finishReason = 'stop') {
  const calls = [];
  const model = new mocks.MockLanguageModelV2({
    doGenerate: async (options) => {
      calls.push(options);
      const text = replies[Math.min(calls.length - 1, replies.length - 1)];
      return { content: [{ type: 'text', text }], finishReason, usage: { inputTokens: 450, outputTokens: 85, totalTokens: 535 }, warnings: [] };
    },
  });
  return { model, calls };
}

test('no model set: the template, with the usual-wording line', { skip }, async () => {
  const d = await draftAsk(visit, carers, ctx, undefined);
  assert.equal(d.source, 'template');
  assert.equal(d.notice, 'The usual wording this time.');
  assert.match(d.asks[0].text, /^Priya, can you take a visit tomorrow at 9 in Church End\?/);
});

test('a good draft: one per carer, the link and sign-off added by code', { skip }, async () => {
  const { model, calls } = stub([good]);
  const d = await draftAsk(visit, carers, ctx, model);
  assert.equal(d.source, 'model');
  assert.equal(calls.length, 1);
  assert.equal(d.asks[1].text, 'Evening Sam, could you take a visit tomorrow at 9 in Church End? Yes or no here: https://k.test/#/ask/v-0900/sam — Marta');
});

test('feat-007-fail-001: garbage is retried once, then the template', { skip }, async () => {
  const { model, calls } = stub(['Sure! Here are three friendly messages...']);
  const d = await draftAsk(visit, carers, ctx, model);
  assert.equal(calls.length, 2);
  assert.equal(d.source, 'template');
});

test('garbage then a good reply: the retry is used', { skip }, async () => {
  const { model, calls } = stub(['not json', good]);
  assert.equal((await draftAsk(visit, carers, ctx, model)).source, 'model');
  assert.equal(calls.length, 2);
});

test('feat-007-fail-003: a refusal is not retried', { skip }, async () => {
  const { model, calls } = stub(["I can't help with that request."], 'content-filter');
  const d = await draftAsk(visit, carers, ctx, model);
  assert.deepEqual([d.source, d.reason, calls.length], ['template', 'refusal', 1]);
});

test('feat-007-fail-004: a made-up detail is not retried', { skip }, async () => {
  const bad = JSON.stringify({ asks: carers.map((c) => ({ carer: c.firstName, text: `${c.firstName}, a quick 30-minute one tomorrow at 9 in Church End?` })) });
  const { model, calls } = stub([bad]);
  const d = await draftAsk(visit, carers, ctx, model);
  assert.deepEqual([d.source, d.reason, calls.length], ['template', 'hallucination:number', 1]);
});

test('feat-007-fail-006: a hung provider gives the template at 4 seconds', { skip }, async () => {
  const model = new mocks.MockLanguageModelV2({
    doGenerate: ({ abortSignal }) => new Promise((_, reject) => abortSignal.addEventListener('abort', () => reject(abortSignal.reason))),
  });
  const started = Date.now();
  const d = await draftAsk(visit, carers, ctx, model);
  assert.deepEqual([d.source, d.reason], ['template', 'timeout']);
  assert.ok(Date.now() - started < 4500);
});

test('feat-007-fail-007: forty carers means no call at all', { skip }, async () => {
  const { model, calls } = stub([good]);
  const forty = Array.from({ length: 40 }, (_, i) => ({ id: `c${i}`, firstName: `Carer${i}` }));
  const d = await draftAsk(visit, forty, ctx, model);
  assert.deepEqual([d.reason, calls.length], ['cost:input-cap', 0]);
});

test('feat-007-fail-008: a reply cut off at the output cap', { skip }, async () => {
  const { model } = stub([good.slice(0, 80)], 'length');
  assert.equal((await draftAsk(visit, carers, ctx, model)).reason, 'cost:output-cap');
});

test('the prompt the provider gets is the four fields', { skip }, async () => {
  const { model, calls } = stub([good]);
  await draftAsk({ ...visit, client: 'Mrs Halloran', address: '14 Orchard Way', note: 'hoist' }, carers, ctx, model);
  const sent = JSON.stringify(calls[0].prompt);
  for (const secret of ['Halloran', 'Orchard', 'hoist']) assert.ok(!sent.includes(secret), secret);
});
