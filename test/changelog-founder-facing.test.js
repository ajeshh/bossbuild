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
  assert.match(site, /import \{[^}]*\bfounderFacing\b[^}]*\bparseEntries\b[^}]*\} from '\.\.\/src\/changelog\.js'/,
    'gen-site.js must import founderFacing AND parseEntries — the entry splitter was its own copy too, and mis-filed a titled heading as a date');
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
  assert.match(stamped, /^## Unreleased\n\n### What you'll notice\n\n### Smaller improvements\n\n### Under the hood\n\n## 0\.326\.0 — 2026-09-13\n\n- \*\*A thing\.\*\*/m, 'a fresh Unreleased, seeded with the weight headings, sits above the stamped entry');
  assert.equal(unreleasedHasContent(stamped), false, 'and nothing is pending after the stamp');
  assert.equal(stampUnreleased(stamped, '0.327.0', '2026-09-14'), null, 'stamping nothing is a no-op, not an empty version');
});

test('a template comment under Unreleased is not content', () => {
  const text = '## Unreleased\n\n<!-- bullets land here -->\n\n## 0.1.0 — 2026-01-01\n';
  assert.equal(unreleasedHasContent(text), false);
});

// --- Weights (IDEA-151) — what a founder will notice, apart from the rest --------------------
// The bug that reached a user: 0.329.0 shipped 22 bullets and no `For you:` line, and `boss whatsnew`
// told a founder one release behind *"Internal release — nothing here changes what you do."* The
// site's What's new stopped at 0.327.0 for the same reason. The weight now lives on each bullet.
import { weighed, unweighed, addUnreleased, founderFacing, newsBetween, bulletParts } from '../src/changelog.js';
import { spawnSync } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { versionChange, versionChangeLine } from '../src/update.js';

const W = "## Unreleased\n\n### What you'll notice\n\n- **Big.** You will see it\n  on two lines.\n\n### Smaller improvements\n\n- **Small.** Quiet.\n\n### Under the hood\n\n- **Plumbing.** None of yours.\n\n## 0.1.0 — 2026-01-01\n\n- old\n";

test('bullets are read by the heading they sit under, wrapped lines and all', () => {
  const w = weighed(unreleased(W).body);
  assert.equal(w.sectioned, true);
  assert.deepEqual(w.notice, ['**Big.** You will see it on two lines.']);
  assert.deepEqual([w.improve.length, w.internal.length, w.loose.length], [1, 1, 0]);
  assert.deepEqual(bulletParts(w.notice[0]), { lead: 'Big.', rest: 'You will see it on two lines.' });
  assert.equal(weighed({ body: ['- **a** b'] }).sectioned, false, 'a release before the headings is not weighed');
});

test('the stamp refuses what has no weight, keeps what has one, and reseeds the headings', () => {
  assert.deepEqual(unweighed('## Unreleased\n\n- **Loose.** x\n\n### Smaller improvements\n\n- y\n'), ['**Loose.** x']);
  assert.deepEqual(unweighed(W), []);
  const stamped = stampUnreleased(W.replace('- **Plumbing.** None of yours.\n\n', ''), '0.2.0', '2026-10-05');
  const [e] = parseEntries(stamped);
  assert.equal(e.version, '0.2.0');
  assert.equal(/### Under the hood/.test(e.body.join('\n')), false, 'an empty weight heading is dropped from the stamped entry');
  assert.match(stamped, /^## Unreleased\n\n### What you'll notice\n\n### Smaller improvements\n\n### Under the hood\n\n## 0\.2\.0/m);
  assert.equal(unreleasedHasContent(stamped), false, 'three empty headings are not something to stamp');
});

test('addUnreleased writes under the named heading, opening it in order if missing', () => {
  const out = addUnreleased(W, ['**New.** z'], 'notice');
  assert.deepEqual(weighed(unreleased(out).body).notice.map((b) => bulletParts(b).lead), ['Big.', 'New.']);
  const bare = addUnreleased('# C\n\n## 0.1.0 — 2026-01-01\n\n- old\n', ['z'], 'internal');
  assert.deepEqual(weighed(unreleased(bare).body).internal, ['z']);
  assert.ok(bare.indexOf('## Unreleased') < bare.indexOf('## 0.1.0'));
  const missing = addUnreleased("## Unreleased\n\n### Under the hood\n\n- p\n\n## 0.1.0 — 2026-01-01\n", ['n'], 'notice');
  assert.ok(missing.indexOf("### What you'll notice") < missing.indexOf('### Under the hood'), missing);
});

test('every bullet under Unreleased in the real CHANGELOG carries a weight', () => {
  const loose = unweighed(readFileSync(join(BOSS_ROOT, 'registry', 'CHANGELOG.md'), 'utf8'));
  assert.deepEqual(loose.map((b) => b.slice(0, 80)), [],
    "put each under ### What you'll notice, ### Smaller improvements or ### Under the hood (the file's header says which)");
});

test('0.329.0 speaks to a founder again, and older releases keep their For-you line', () => {
  const v329 = entries.find((e) => e.version === '0.329.0');
  assert.ok(founderFacing(v329).length >= 3, '0.329.0 has notices');
  const old = entries.find((e) => forYou(e).length && !weighed(e).sectioned);
  assert.deepEqual(founderFacing(old), forYou(old));
  const n = newsBetween('0.327.0', '0.329.0', readFileSync(join(BOSS_ROOT, 'registry', 'CHANGELOG.md'), 'utf8'));
  assert.equal(n.releases, 2);
  assert.ok(n.notice >= 5 && n.improve >= 10, JSON.stringify(n));
});

test('`boss whatsnew` one release behind leads with what you will notice', () => {
  const r = spawnSync(process.execPath, [join(BOSS_ROOT, 'bin', 'boss'), 'whatsnew', '--since', '0.328.0'],
    { cwd: tmpdir(), env: { ...process.env, NO_COLOR: '1', BOSS_HOME: mkdtempSync(join(tmpdir(), 'bh-')) }, encoding: 'utf8' });
  assert.equal(r.status, 0, r.stderr);
  assert.match(r.stdout, /What you'll notice/);
  assert.doesNotMatch(r.stdout, /Internal release/);
});

test('the line after an update says it once, and a first run says nothing', () => {
  const file = join(mkdtempSync(join(tmpdir(), 'seen-')), 'seen-version.json');
  assert.equal(versionChange({ installed: '0.328.0', file }), null, 'first run: recorded, silent');
  const change = versionChange({ installed: '0.329.0', file });
  assert.deepEqual(change, { from: '0.328.0', to: '0.329.0' });
  assert.equal(versionChange({ installed: '0.329.0', file }), null, 'once');
  assert.equal(versionChange({ installed: '0.328.0', file }), null, 'a downgrade is silent');
  const line = versionChangeLine(change, { releases: 1, notice: 5, improve: 16 });
  assert.match(line, /0\.328\.0 → .*0\.329\.0.*5 things you'll notice, 16 smaller improvements.*boss whatsnew --since 0\.328\.0/);
});
