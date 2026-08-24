// sources-coverage — every practice on the shelf must appear in library/sources.json.
//
// WHY THIS FILE EXISTS: `library/sources.json` was built to close a specific hole — BOSS had "41
// named sources across its practice shelf and URLs for two of them." It closed it for 20 practices
// and then stopped, and nothing noticed for months, because the only thing measuring it was a
// citation-debt ratio computed over sources someone had already ENTERED.
//
// That made the metric lie in the flattering direction: 12 of 32 practices had no entry at all, so
// their un-linked sources were not counted as debt — they were not counted at all. The check read
// "1 of 20 KEY sources have no URL" (95% clean) when the honest number was 14 of 37 on a shelf that
// was 62% covered. **A metric that improves when you forget something is worse than no metric.**
//
// An empty array is a legitimate answer and is NOT the same as being absent: it says "mapped, and
// there is nothing external to credit" — true for the four practices whose provenance is an internal
// IDEA, a Fable pass, or Ajesh's own corpus. Absence is the thing this test makes impossible.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { BOSS_ROOT, PRACTICES_DIR } from '../src/paths.js';

const registry = JSON.parse(
  readFileSync(join(BOSS_ROOT, 'library', 'sources.json'), 'utf8'));

const practiceIds = readdirSync(PRACTICES_DIR)
  .filter((f) => f.endsWith('.md'))
  .map((f) => f.slice(0, -3));

test('every practice on disk is mapped in sources.json', () => {
  const mapped = new Set(Object.keys(registry.practices || {}));
  const missing = practiceIds.filter((id) => !mapped.has(id));
  assert.deepEqual(missing, [],
    `these practices have no sources.json entry, so their named sources reach no reader AND ` +
    `do not register as citation debt: ${missing.join(', ')}. ` +
    'Map them to their source keys, or to [] if there is genuinely nothing external to credit.');
});

test('sources.json maps no practice that does not exist', () => {
  const onDisk = new Set(practiceIds);
  const orphans = Object.keys(registry.practices || {}).filter((id) => !onDisk.has(id));
  assert.deepEqual(orphans, [],
    `sources.json maps practices with no file: ${orphans.join(', ')}`);
});

test('every source key a practice points at is defined', () => {
  const defined = new Set(Object.keys(registry.sources || {}));
  const dangling = [];
  for (const [practice, keys] of Object.entries(registry.practices || {})) {
    for (const k of keys) if (!defined.has(k)) dangling.push(`${practice} → ${k}`);
  }
  assert.deepEqual(dangling, [], `dangling source references: ${dangling.join(', ')}`);
});

test('a source that claims a URL must not claim a fabricated one', () => {
  // This file's own rule: "URLs are DELIBERATELY null until someone verifies them ... inventing a
  // plausible link here would be the exact failure that step exists to catch." A null is honest and
  // always allowed; what is not allowed is a non-URL string sitting in the slot as if it were one.
  for (const [k, v] of Object.entries(registry.sources || {})) {
    if (v.url === null || v.url === undefined) continue;
    assert.match(v.url, /^https:\/\/\S+$/,
      `source "${k}" has a url that is not an https URL: ${JSON.stringify(v.url)} — ` +
      'leave it null rather than putting something url-shaped in the slot');
  }
});
