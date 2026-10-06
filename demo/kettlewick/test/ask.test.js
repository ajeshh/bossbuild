// FEAT-007's checks in code, no model needed. The case ids are docs/evals/FEAT-007.yml's.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { checkDraft, phraseWhen, templateAsks, toPromptFacts } from '../src/ask/facts.js';
import { logCall, spentThisMonth } from '../src/lib/ai-cost-logger.ts';

const sunday = new Date(2026, 8, 20, 18, 50);
const carers = [{ id: 'priya', firstName: 'Priya' }, { id: 'sam', firstName: 'Sam' }, { id: 'dee', firstName: 'Dee' }];
const visit = { id: 'v-0900', day: '2026-09-21', start: '09:00', end: '09:45', area: 'Church End' };
const facts = toPromptFacts(visit, carers, sunday);
const reply = (texts) => JSON.stringify({ asks: carers.map((c, i) => ({ carer: c.firstName, text: texts[i] })) });
const good = carers.map((c) => `Evening ${c.firstName}, could you take a visit tomorrow at 9 in Church End?`);

test('feat-007-fail-010: a full spreadsheet row reaches the prompt as four fields', () => {
  const row = { ...visit, client: 'Mrs Halloran', address: '14 Orchard Way', note: 'hoist, two carers; diabetic', phone: '07700 900111' };
  const built = toPromptFacts(row, carers, sunday);
  assert.deepEqual(Object.keys(built), ['day', 'time', 'area', 'carers']);
  assert.deepEqual(built, { day: 'Monday', time: 'tomorrow at 9', area: 'Church End', carers: ['Priya', 'Sam', 'Dee'] });
  const sent = JSON.stringify(built);
  for (const secret of ['Halloran', 'Orchard', '14', 'hoist', 'diabetic', '07700']) assert.ok(!sent.includes(secret), secret);
});

test('the time is phrased in the carer\'s words', () => {
  assert.equal(phraseWhen({ day: '2026-09-21', start: '09:00' }, sunday), 'tomorrow at 9');
  assert.equal(phraseWhen({ day: '2026-09-20', start: '14:30' }, sunday), 'today at 2:30');
  assert.equal(phraseWhen({ day: '2026-09-24', start: '08:00' }, sunday), 'Thursday at 8');
});

test('the template, per carer, carries the link and the owner', () => {
  const [priya] = templateAsks(facts, carers, (id) => `https://k.test/#/ask/v-0900/${id}`, 'Marta');
  assert.equal(priya.text, 'Priya, can you take a visit tomorrow at 9 in Church End? Yes or no here: https://k.test/#/ask/v-0900/priya — Marta');
});

test('feat-007-pass-001 shape: three good drafts pass', () => {
  assert.equal(checkDraft(reply(good), facts).ok, true);
});

test('feat-007-pass-004: an area with a name in it is not a stranger', () => {
  const f = { ...facts, area: "St Agnes' Row" };
  const texts = carers.map((c) => `Morning ${c.firstName}, could you take a visit tomorrow at 9 in St Agnes' Row?`);
  assert.equal(checkDraft(reply(texts), f).ok, true);
});

test('feat-007-fail-001/002: garbage — prose, wrong count, too long', () => {
  assert.equal(checkDraft('Sure! Here are three friendly messages...', facts).kind, 'garbage');
  assert.equal(checkDraft(JSON.stringify({ asks: [{ carer: 'Priya', text: good[0] }] }), facts).reason, 'count');
  assert.equal(checkDraft(reply([`${good[0]} ${'x'.repeat(640)}`, good[1], good[2]]), facts).reason, 'too-long');
});

test('feat-007-fail-003: a refusal', () => {
  assert.equal(checkDraft("I can't help with that request.", facts).kind, 'refusal');
});

test('feat-007-fail-004: an invented visit length', () => {
  const r = checkDraft(reply(['Morning Priya, could you take a quick 30-minute one tomorrow at 9 in Church End?', good[1], good[2]]), facts);
  assert.deepEqual([r.kind, r.reason], ['hallucination', 'number']);
});

test('feat-007-fail-005: a carer it was not given, and a reason', () => {
  const r = checkDraft(reply([good[0], "Hi Sam, Jo's off sick so could you take tomorrow at 9 in Church End?", good[2]]), facts);
  assert.deepEqual([r.kind, r.reason], ['hallucination', 'name']);
});

test('feat-007-pass-003: a text that names another carer is refused', () => {
  const r = checkDraft(reply(['Priya, could you or Sam take tomorrow at 9 in Church End?', good[1], good[2]]), facts);
  assert.equal(r.reason, 'other-carer');
});

test('feat-007-fail-009: pressure', () => {
  const r = checkDraft(reply(["Morning Priya! We're really stuck for tomorrow at 9 in Church End. Sorry to ask!", good[1], good[2]]), facts);
  assert.equal(r.reason, 'pressure');
});

test('each call is one ledger line, priced from the table', (t) => {
  const dir = mkdtempSync(join(tmpdir(), 'kw-cost-'));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  process.env.AI_COST_LEDGER = join(dir, 'cost-log.jsonl');

  const entry = logCall({ feat: 'FEAT-007', model: 'small-fast', inputTokens: 450, outputTokens: 85, userId: 'ag_01' });
  assert.equal(entry.estimated_usd, 0.0007);
  assert.equal(entry.priced, true);
  const line = JSON.parse(readFileSync(process.env.AI_COST_LEDGER, 'utf8').trim());
  assert.deepEqual(Object.keys(line), ['ts', 'feat', 'model', 'userId', 'input_tokens', 'output_tokens', 'estimated_usd', 'priced']);
  assert.equal(spentThisMonth(), 0.0007);
  assert.equal(logCall({ feat: 'FEAT-007', model: 'unknown', inputTokens: 1, outputTokens: 1, userId: 'ag_01' }).priced, false);
});
