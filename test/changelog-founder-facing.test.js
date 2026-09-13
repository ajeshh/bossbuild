// What a founder reads when they ask what changed — and the rule the changelog states about itself.
//
// `registry/CHANGELOG.md`'s own header: *"The `> **For you:**` line is opt-in, and the bar is high on
// purpose… Everything else (audits, refactors, doc sweeps, internal tooling) gets no line and never
// reaches oyeboss.build/whats-new.html."*
//
// `gen-site.js` implemented that. `src/changelog.js` — the surface a founder actually runs, and the
// one `/boss-sync` narrates from — implemented none of it until v0.256.0:
//
//   · `headline()` returned the first bolded BULLET, an internal engineering finding.
//   · the raw-body branch fired on `shown.length === 1`, so being ONE release behind — the commonest
//     reason to run `boss whatsnew` — dumped `check:freshness`, `taps_reviewed:` and a watchlist
//     filename into a founder's terminal.
//
// One rule, two surfaces, one of them unread — the same sentence `src/craft.js` carries about the
// provenance leak, on a third surface.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { BOSS_ROOT } from '../src/paths.js';
import { parseEntries, headline, forYou } from '../src/changelog.js';

const entries = parseEntries(readFileSync(join(BOSS_ROOT, 'registry', 'CHANGELOG.md'), 'utf8'));
const row = (e) => forYou(e)[0] || e.title || headline(e);

test('the changelog parses, and every entry has a version', () => {
  assert.ok(entries.length > 100, `expected the real changelog, got ${entries.length} entries`);
  for (const e of entries) assert.match(e.version, /^\d+\.\d+\.\d+$/);
});

// A heading's second field was taken as the DATE with no validation, so `## 0.255.0 — the watchlist
// rots too` rendered its title in the date column. Anything that is not a date IS a title.
test('no entry carries a non-date in its date field', () => {
  const bad = entries.filter((e) => e.date && !/^\d{4}-\d{2}-\d{2}$/.test(e.date));
  assert.deepEqual(bad.map((e) => e.version), [], 'a heading put something that is not a date in the date column');
});

// The bug that produced this: `headline()` matched line by line, so a bolded lead-in whose `**`
// closes on the NEXT line never matched — and entries open with long bold spans, which wrap. That is
// the SAME multi-line bug `gen-site.js` records paying for on the For-you block, in the sibling
// function four lines away. It left 25 of 257 entries rendering as a version, a date, and nothing.
test('the compact list is not blank — a wrapped bold lead-in still yields a headline', () => {
  const blank = entries.filter((e) => !row(e)).map((e) => e.version);
  assert.ok(
    blank.length <= 5,
    `${blank.length} of ${entries.length} entries render as a BLANK row in \`boss changelog\`: `
    + `${blank.slice(0, 10).join(', ')}. A version and a date and nothing else is not a summary.`,
  );
});

// The load-bearing one: when a release SPOKE to founders, that is what a founder sees — not the
// first internal bullet that happens to be bold.
test('a For-you line wins over the internal headline', () => {
  const spoke = entries.filter((e) => forYou(e).length);
  assert.ok(spoke.length > 20, `expected many For-you releases, found ${spoke.length}`);
  for (const e of spoke) {
    assert.equal(row(e), forYou(e)[0], `${e.version} shows its internal headline over its For-you line`);
  }
});

// ONE implementation, two readers. Giving the CLI its own copy of the rule would have made two, and
// two copies of a rule is how the rule drifts — which is the whole subject of this file.
test('the website reads the shared extractor rather than its own copy', () => {
  const site = readFileSync(join(BOSS_ROOT, 'scripts', 'gen-site.js'), 'utf8');
  assert.match(site, /import \{ forYou, parseEntries \} from '\.\.\/src\/changelog\.js'/,
    'gen-site.js must import forYou AND parseEntries — the entry splitter was its own copy too, and mis-filed a titled heading as a date');
  assert.equal(/split\(\/\^## \/m\)/.test(site), false, 'no private CHANGELOG splitter in gen-site.js');
  assert.equal(
    /For you:\\\*\\\*/.test(site), false,
    'gen-site.js still carries its own For-you regex — that is the second copy this test exists to prevent',
  );
});

// --- `## Unreleased` (DEC-019) — capabilities land here; a version is stamped at publish ------
import { unreleased, unreleasedHasContent, nextVersion, stampUnreleased } from '../src/changelog.js';

test('an Unreleased section is invisible to parseEntries and to the site, until it is stamped', () => {
  const text = '# BOSS Changelog\n\n## Unreleased\n\n- **A thing.** Landed, not published.\n\n## 0.325.0 — 2026-09-12\n\n**Old.**\n';
  assert.deepEqual(parseEntries(text).map((e) => e.version), ['0.325.0'], 'founders never see an unversioned heading');
  assert.equal(unreleasedHasContent(text), true);
  assert.equal(unreleased(text).body.filter((l) => l.trim()).length, 1);
  const stamped = stampUnreleased(text, nextVersion('0.325.0'), '2026-09-13');
  assert.deepEqual(parseEntries(stamped).map((e) => [e.version, e.date]), [['0.326.0', '2026-09-13'], ['0.325.0', '2026-09-12']]);
  assert.match(stamped, /^## Unreleased\n\n## 0\.326\.0 — 2026-09-13\n\n- \*\*A thing\.\*\*/m, 'a fresh empty Unreleased heading sits above the stamped entry');
  assert.equal(unreleasedHasContent(stamped), false, 'and nothing is pending after the stamp');
  assert.equal(stampUnreleased(stamped, '0.327.0', '2026-09-14'), null, 'stamping nothing is a no-op, not an empty version');
});

test('a template comment under Unreleased is not content', () => {
  const text = '## Unreleased\n\n<!-- bullets land here -->\n\n## 0.1.0 — 2026-01-01\n';
  assert.equal(unreleasedHasContent(text), false);
});
