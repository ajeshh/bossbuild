// local-day-scripts — the scripts' "today" is the person's calendar, not UTC (IDEA-136 · F7).
//
// src/ moved every human-read day to src/clock.js (IDEA-118), and v0.324.0 fixed the same bug in two
// gates — but four scripts kept `new Date().toISOString().slice(0, 10)`. Seen live: at 20:21 Pacific on
// 2026-10-04, `npm run check` reported practice freshness "as of 2026-10-05".
//
// Two zones 25 hours apart always sit on different calendar days, so a UTC "today" prints the same
// date in both and fails here at any hour; a local one prints each zone's own day.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { BOSS_ROOT } from '../src/paths.js';

const ZONES = ['Pacific/Kiritimati', 'Pacific/Pago_Pago']; // UTC+14, UTC-11

const asOf = (tz) => {
  const r = spawnSync('node', [join(BOSS_ROOT, 'scripts', 'check-freshness.js')],
    { env: { ...process.env, TZ: tz, NO_COLOR: '1' }, encoding: 'utf8' });
  return (r.stdout.match(/as of (\d{4}-\d{2}-\d{2})/) || [])[1];
};
// A file URL, not a path: on Windows `import('C:/…')` is not a valid specifier (CI caught it).
const localToday = (tz) => spawnSync('node', ['-e',
  "import('" + pathToFileURL(join(BOSS_ROOT, 'src', 'clock.js')).href + "').then((m) => process.stdout.write(m.isoDay()))"],
  { env: { ...process.env, TZ: tz }, encoding: 'utf8' }).stdout;

test('REGRESSION: check-freshness reads "today" in local time', () => {
  const [a, b] = ZONES.map(asOf);
  assert.ok(a && b, 'check-freshness printed an "as of" date');
  assert.notEqual(a, b, 'two zones 25h apart are on different days — a UTC today prints one date for both');
  assert.equal(a, localToday(ZONES[0]));
});

test('no script computes a human-read day with toISOString().slice(0, 10)', async () => {
  const { readFileSync } = await import('node:fs');
  for (const f of ['check-freshness.js', 'check-reach.js', 'gen-demo.js', 'gen-surface-freshness.js']) {
    const src = readFileSync(join(BOSS_ROOT, 'scripts', f), 'utf8');
    assert.doesNotMatch(src, /new Date\(\)\.toISOString\(\)\.slice\(0, 10\)/, `${f} uses isoDay()`);
  }
});
