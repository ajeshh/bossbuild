// `boss craft` — the public/internal boundary at the CLI surface.
//
// WHY THIS FILE EXISTS: the boundary was already stated and already enforced — on the OTHER
// surface. `gen-site.js` renders `provenance_public` and nothing else, with a check that errors
// when the public field names internal things; `check-refs.js` documents the internal
// `provenance:` as "not published". Meanwhile `boss craft` printed the raw file, so every
// internal ledger line — IDEA-NNN, REVIEW-NNN, RVW-NNN records a founder's project does not
// contain — rendered straight into their terminal, on all 32 practices carrying one.
//
// One rule, two surfaces, one of them unread. These assertions are the second reader.

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { BOSS_ROOT, PRACTICES_DIR } from '../src/paths.js';
import { project, cleanup } from './helpers.js';

after(cleanup);

const BIN = join(BOSS_ROOT, 'bin', 'boss');

function craft(args, cwd) {
  try {
    return execFileSync('node', [BIN, 'craft', ...args], {
      cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'],
      env: { ...process.env, NO_COLOR: '1', HOME: cwd },
    });
  } catch (e) {
    return (e.stdout || '') + (e.stderr || '');
  }
}

// Any line that is `key: value` at column 0 is frontmatter escaping — practice BODIES are
// markdown prose, headings and tables, never bare top-level keys.
const FRONTMATTER_LINE = /^(id|type|owner|status|host|curve|provenance|provenance_public|last_reviewed|review_by|attributed_to):/m;

test('craft never prints the internal ledger — no practice leaks frontmatter', () => {
  const dir = project({});
  const names = readdirSync(PRACTICES_DIR).filter((f) => f.endsWith('.md')).map((f) => f.replace(/\.md$/, ''));
  assert.ok(names.length >= 20, `expected a real shelf, got ${names.length}`);

  const leaking = names.filter((n) => FRONTMATTER_LINE.test(craft([n], dir)));
  assert.deepEqual(leaking, [], `these practices leak frontmatter to a founder: ${leaking.join(', ')}`);
});

test('REGRESSION: the internal provenance field never reaches a founder, by name', () => {
  const dir = project({});
  // deceptive-patterns is the worst case: its internal provenance names five RVW sweeps and a
  // REVIEW record, none of which exist in a founder's project.
  const out = craft(['deceptive-patterns', '--prose'], dir);
  assert.ok(!/^provenance:/m.test(out), 'internal provenance: line reached the founder');
  assert.ok(!out.includes('RVW-031'), 'an internal RVW record name reached the founder');
});

test('provenance_public DOES cross — the half a reader can use', () => {
  const dir = project({});
  const out = craft(['deceptive-patterns', '--prose'], dir);
  assert.match(out, /sources/, 'no sources line rendered');
  assert.ok(out.includes('Brignull'), 'the public sources statement did not render');
});

test('the practice body still renders whole — stripping the ledger is not stripping content', () => {
  const dir = project({});
  const out = craft(['harm-taxonomy'], dir);
  const src = readFileSync(join(PRACTICES_DIR, 'harm-taxonomy.md'), 'utf8');
  const title = src.match(/^#\s+(.+)$/m)[1];
  assert.ok(out.includes(title), 'the practice title is missing from the output');
  // The last heading in the file must survive: a truncating bug would drop the tail silently.
  const heads = [...src.matchAll(/^##\s+(.+)$/gm)].map((m) => m[1]);
  assert.ok(out.includes(heads[heads.length - 1]), 'the practice tail was truncated');
});

test('the freshness stamp survives — it is the reader\'s only staleness signal', () => {
  const dir = project({});
  const out = craft(['harm-taxonomy'], dir);
  assert.match(out, /fresh until \d{4}-\d{2}-\d{2}|review overdue/, 'the review stamp vanished');
});
