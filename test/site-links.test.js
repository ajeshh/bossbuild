// Internal links on the website (check-site.js §2b, v0.273.0).
//
// This check exists because of how it was FOUND: `web/quick-guide.html` was absorbed into the
// in-project guide (`boss help --html`) and deleted, and it was linked from `index.html` and
// `guide.html`. Nothing in the repo validated a relative href, so removing the page would have
// shipped two dead links to a live site in silence — a 404 from your own front page, which is
// the cheapest possible credibility loss and mechanically trivial to prevent.
//
// As with the citation check, the load-bearing test is not "does it pass on a clean tree". It is
// **can it still be made to fail**. A gate that cannot fail is decorative, and this repo has
// shipped two of those already.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, rmSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { BOSS_ROOT } from '../src/paths.js';

const CHECK = join(BOSS_ROOT, 'scripts', 'check-site.js');
const run = () => {
  try {
    return { code: 0, out: execFileSync('node', [CHECK], { cwd: BOSS_ROOT, encoding: 'utf8' }) };
  } catch (e) { return { code: e.status, out: (e.stdout || '') + (e.stderr || '') }; }
};

test('every relative href on the site points at a page that exists', () => {
  const r = run();
  assert.doesNotMatch(r.out, /that ships a 404/, `dead internal link(s) on the site:\n${r.out}`);
});

test('REGRESSION: the link check can still be made to fail', () => {
  // A page name that is deliberately never going to exist. Not a real former page: pointing the
  // probe at something that might come back would make this test pass for the wrong reason.
  // Deliberately NOT underscore-prefixed: `_*.html` are partials and excluded from the page
  // list, so an underscore probe silently proves nothing. (It did, on the first run — and that
  // is how the unchecked `_shell.html` brand link turned up.)
  const probe = join(BOSS_ROOT, 'web', 'link-probe.html');
  writeFileSync(probe, [
    '<!--', 'title: probe', 'description: probe',
    'covers: VERSION', 'reviewed: 2026-01-01', 'review_by: 2099-01-01',
    'describes: a probe', 'nav: home', '-->',
    '<p><a href="no-such-page-ever.html">nowhere</a></p>', '',
  ].join('\n'));
  try {
    const r = run();
    assert.match(r.out, /no-such-page-ever\.html/, 'the dead target must be named in the output');
    assert.match(r.out, /that ships a 404/);
  } finally {
    rmSync(probe, { force: true });
  }
  // ...and the tree must be clean again once the probe is gone, so a leftover cannot mask a
  // real finding on the next run.
  assert.doesNotMatch(run().out, /that ships a 404/);
});

test('the absorbed quick-guide is gone from BOTH halves, not just the source', () => {
  // Deleting only web/ leaves the built page serving on the live site until the next deploy
  // overwrites the folder — and `site/` is what gets uploaded.
  assert.equal(existsSync(join(BOSS_ROOT, 'web', 'quick-guide.html')), false);
  assert.equal(existsSync(join(BOSS_ROOT, 'site', 'quick-guide.html')), false);
  const gen = readFileSync(join(BOSS_ROOT, 'scripts', 'gen-site.js'), 'utf8');
  assert.doesNotMatch(gen, /quick-guide/, 'the nav must not offer a page that no longer exists');
});

// `check-help.js` keeps its own list of the sections the renderer places (`PLACED`), rather than
// importing it. That is deliberate — it means deleting a section from the renderer's plan surfaces
// as a finding instead of silently orphaning its fragment — but a deliberate second copy is only
// a tripwire if something asserts the two still agree. Otherwise it is just a copy, which is the
// failure `library/practices/documentation.md` §1 names ("the second copy is the one that goes stale").
test('check-help PLACED agrees with the sections the renderer actually places', () => {
  const check = readFileSync(join(BOSS_ROOT, 'scripts', 'check-help.js'), 'utf8');
  const gen = readFileSync(join(BOSS_ROOT, 'src', 'help-html.js'), 'utf8');
  const placed = new Set(
    (check.match(/const PLACED = new Set\(\[([\s\S]*?)\]\)/) || [, ''])[1]
      .match(/'([^']+)'/g)?.map((s) => s.replace(/'/g, '')) || [],
  );
  // The renderer's plan: rows whose key has no `__` prefix are the hand-written fragments.
  const plan = new Set(
    ((gen.match(/const plan = \[([\s\S]*?)\n  \];/) || [, ''])[1].match(/\['([^']+)'/g) || [])
      .map((s) => s.replace(/\['|'/g, ''))
      .filter((k) => !k.startsWith('__')),
  );
  assert.ok(placed.size > 0, 'PLACED could not be parsed out of check-help.js');
  assert.ok(plan.size > 0, 'the renderer plan could not be parsed out of help-html.js');
  assert.deepEqual(
    [...placed].sort(), [...plan].sort(),
    'check-help.js PLACED and help-html.js plan disagree — one of them was edited alone, and the '
    + 'consequence is either a fragment that ships to nobody or a false "ships to nobody" finding.',
  );
});
