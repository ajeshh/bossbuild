import { test } from 'node:test';
import assert from 'node:assert/strict';
import { answer, askOrder, confirm, everyoneSaidNo, freeCarers, inQuietHours, openCover, planAsk, sendTime } from '../src/rota/cover.js';
import { rota, uncovered } from '../src/rota/sample.js';

const ids = (cs) => cs.map((c) => c.id);
const at = (h, m, date = 21) => new Date(2026, 8, date, h, m);

test('free means: not the one off sick, works Mondays, not already busy', () => {
  // jo is off; bo doesn't work Mondays; ruth is on an overlapping visit
  assert.deepEqual(ids(freeCarers(rota, uncovered)).sort(), ['dee', 'priya', 'sam', 'tomasz']);
});

test('the order is the area first, then the alphabet, and nothing else', () => {
  assert.deepEqual(ids(askOrder(rota, uncovered)), ['dee', 'priya', 'sam', 'tomasz']);
});

test('a round asks three, and the next round skips who was asked', () => {
  const first = planAsk(rota, uncovered, at(7, 40));
  assert.deepEqual(ids(first.to), ['dee', 'priya', 'sam']);
  assert.deepEqual(ids(planAsk(rota, uncovered, at(7, 50), ids(first.to)).to), ['tomasz']);
});

test('quiet hours run 20:00 to 06:30', () => {
  assert.equal(inQuietHours(at(19, 59)), false);
  assert.equal(inQuietHours(at(20, 0)), true);
  assert.equal(inQuietHours(at(6, 29)), true);
  assert.equal(inQuietHours(at(6, 30)), false);
});

test('an ask made in quiet hours queues until 06:30', () => {
  const evening = planAsk(rota, uncovered, at(21, 15, 20));
  assert.equal(evening.queued, true);
  assert.deepEqual([evening.sendAt.getDate(), evening.sendAt.getHours(), evening.sendAt.getMinutes()], [21, 6, 30]);
  assert.equal(sendTime(at(5, 0)).getDate(), 21);
  assert.equal(planAsk(rota, uncovered, at(18, 50, 20)).queued, false);
});

test('the ask row records whether it was drafted and whether it was edited', () => {
  const cover = openCover(planAsk(rota, uncovered, at(7, 40)), { drafted: true, edited: false });
  assert.equal(cover.drafted, true);
  assert.equal(cover.edited, false);
  assert.equal(openCover(planAsk(rota, uncovered, at(7, 40))).drafted, false);
});

test('the first yes takes it; a later yes is told it is taken', () => {
  let cover = openCover(planAsk(rota, uncovered, at(7, 40)));
  ({ cover } = answer(cover, 'sam', false));
  const first = answer(cover, 'priya', true);
  assert.equal(first.result, 'held');
  assert.equal(first.cover.heldBy, 'priya');
  assert.equal(answer(first.cover, 'dee', true).result, 'taken');
});

test('nothing is covered until the owner confirms', () => {
  const cover = openCover(planAsk(rota, uncovered, at(7, 40)));
  assert.throws(() => confirm(cover));
  const { cover: held } = answer(cover, 'priya', true);
  assert.equal(held.status, 'held');
  assert.equal(confirm(held).status, 'covered');
});

test('a carer who was not asked cannot answer', () => {
  const cover = openCover(planAsk(rota, uncovered, at(7, 40)));
  assert.throws(() => answer(cover, 'tomasz', true));
});

test('when all three say no, the owner is told', () => {
  let cover = openCover(planAsk(rota, uncovered, at(7, 40)));
  for (const id of cover.asked) ({ cover } = answer(cover, id, false));
  assert.equal(everyoneSaidNo(cover), true);
});
