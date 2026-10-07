// `boss sources` (PROG-005 B5): who to read first, counted from claim rows — never typed, never a score.
//
// What must hold: a source's standing comes only from rows whose claim was tested; a new voice whose
// first claim held recently is marked new and sits with the established, not below them; nothing held
// in a year reads as fading; untested claims never count as held; and the source is the person or
// publisher, not the link (one person, many URLs).

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { BOSS_ROOT } from '../src/paths.js';
import { readClaims, standing, sourceKey } from '../src/sources.js';
import { project, cleanup } from './helpers.js';

after(cleanup);

const BIN = join(BOSS_ROOT, 'bin', 'boss');
const boss = (args, cwd) => execFileSync('node', [BIN, ...args], { cwd, encoding: 'utf8', env: { ...process.env, NO_COLOR: '1' } });
const TODAY = new Date('2026-10-07T00:00:00Z');

const TABLE = `# Market size

| # | Claim | Source | Read | Survived | Checked |
|---|---|---|---|---|---|
| C1 | 6,400 agencies in England | [Care register](https://example.org/reg) | fetched | confirmed 3-0 | 2026-09-20 |
| C2 | 1,900 run by the owner alone | Care register | fetched | held 2-1 | 2026-09-21 |
| C3 | the market is $40B | Big Analyst Co | not read | unverified | 2026-09-21 |
| C4 | owners churn after 6 months | A. Newvoice | fetched | confirmed 3-0 | 2026-09-30 |
| C5 | agencies all use spreadsheets | Old Pundit | snippet | killed | 2026-09-01 |
| C6 | rotas are done on paper | Old Pundit | fetched | confirmed 3-0 | 2025-06-01 |
`;
const LEGACY = `| # | Claim | Source | Scope | Result |
|---|---|---|---|---|
| K1 | a claim | https://www.example.com/post | x | KILLED 3-0 |
`;

test('the source is the person or publisher, not the link', () => {
  assert.equal(sourceKey('[Care register](https://example.org/reg)'), 'Care register');
  assert.equal(sourceKey('Care register https://example.org/x'), 'Care register');
  assert.equal(sourceKey('https://www.example.com/post'), 'example.com (site — no author named)');
});

test('standing is counted from tested claims; labels say why, the order says where to look first', () => {
  const dir = project({ 'docs/research/market/size.md': TABLE, 'docs/research/old.md': LEGACY });
  const { rows, tilt } = standing(readClaims([join(dir, 'docs', 'research')]), TODAY);
  const by = Object.fromEntries(rows.map((r) => [r.source, r]));
  assert.equal(by['Care register'].held, 2, 'a link and a bare name are the same source');
  assert.equal(by['A. Newvoice'].label, 'new', 'a new voice that held up gets in by being right');
  assert.equal(by['Care register'].label, 'new');
  assert.equal(by['Big Analyst Co'].label, 'no record yet', 'untested never counts as held');
  assert.equal(by['Big Analyst Co'].held, 0);
  assert.equal(by['Old Pundit'].label, 'fading', 'last held over a year ago');
  assert.equal(by['example.com (site — no author named)'].label, 'not held up', 'the older `Result` column is read');
  const order = rows.map((r) => r.label);
  assert.ok(order.indexOf('fading') > order.lastIndexOf('new'), 'held recently first');
  assert.ok(order.indexOf('not held up') > order.indexOf('no record yet'));
  assert.equal(tilt.total, 5);
});

test('the view prints the order with its reason; nothing yet is said; --json is machine-readable', () => {
  const dir = project({ 'docs/research/market/size.md': TABLE });
  const out = boss(['sources'], dir);
  assert.match(out, /Care register\s+(new|held up) — 2 held/);
  assert.match(out, /never makes a new claim true/);
  assert.equal(JSON.parse(boss(['sources', '--json'], dir)).rows.length, 4);
  assert.match(boss(['sources'], project({})), /No claim rows yet/);
});
