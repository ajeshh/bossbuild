// `boss craft deceptive-patterns --shape <x> --surface <y>` — the FILTERED render of the
// deceptive-pattern catalog.
//
// WHY THIS EXISTS: the catalog is a promise to keep growing. Kept as prose, that promise is
// self-defeating — every consumer reads the whole file, so every pattern added makes the
// founder likelier to skim past the four rows that were about their actual build. A real
// vibe-coder read it and said it plainly: "I don't read lists. I scan for the one example
// that looks like the thing on my screen. Doubling the list halves my odds of finding mine."
//
// So the catalog is DATA and this is the dose. Two filters, in the order a founder thinks:
//   --shape    what am I building (cli, mobile-app, edtech...) -> which surfaces exist for me
//   --surface  what am I building RIGHT NOW (checkout, consent-ui...) -> the rows, ~12 max
//
// The library may hold three hundred patterns and a CLI founder standing on their install
// path still sees four. Growth is safe because the dose is filtered, not because the catalog
// is small.

import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { BOSS_ROOT } from './paths.js';
import { dim, bold, ok, warn, err } from './ui.js';

export const CATALOG_PATH = join(BOSS_ROOT, 'library', 'deceptive-patterns.json');

export function loadCatalog() {
  if (!existsSync(CATALOG_PATH)) return null;
  try { return JSON.parse(readFileSync(CATALOG_PATH, 'utf8')); } catch { return null; }
}

// Same forgiving resolution as `resolvePractice` — a founder types `--shape mobile` and
// means `mobile-app`. Making them type the slug is the friction that stops a pointer.
function resolveKey(query, keys) {
  const q = String(query || '').toLowerCase();
  if (keys.includes(q)) return q;
  const m = keys.filter((k) => k.startsWith(q)).concat(keys.filter((k) => !k.startsWith(q) && k.includes(q)));
  return m.length === 1 ? m[0] : null;
}

function row(p, { minors = false } = {}) {
  const tags = [];
  if (p.emergent) tags.push('model-written');
  if (p.hard) tags.push('hard-named');
  if (p.status === 'candidate') tags.push('UNVETTED');
  const tag = tags.length ? dim(`  [${tags.join(' · ')}]`) : '';
  console.log(`  ${bold(p.name)}${tag}`);
  console.log(`    ${dim('looks like')}  ${p.looks_like}`);
  console.log(`    ${ok('honest')}      ${p.honest}`);
  if (p.teeth) console.log(`    ${dim('teeth')}       ${dim(p.teeth)}`);
  // The minors bar is a MODIFIER, not a separate surface — same pattern, higher bar. Shown inline
  // so the founder reads the rule and its stricter version together, instead of meeting the same
  // pattern twice in two places and having to work out that they are the same thing.
  if (p.stricter_when_minors && minors) console.log(`    ${warn('minors')}      ${p.stricter_when_minors}`);
  console.log('');
}

export function printPatterns({ shape, surface, minors } = {}) {
  const cat = loadCatalog();
  if (!cat) {
    console.log(`\n  ${err('No deceptive-pattern catalog found')} — expected it at ${dim(CATALOG_PATH)}.\n`);
    return 1;
  }
  const shapeKeys = Object.keys(cat.shapes);
  const surfaceKeys = Object.keys(cat.surfaces);

  // --shape with no value, or an unrecognised one: show what's on offer rather than erroring.
  if (shape === true || (shape && !resolveKey(shape, shapeKeys))) {
    if (shape !== true) console.log(`\n  ${warn(`No product shape matches "${shape}".`)}`);
    console.log(`\n  ${bold('What are you building?')}  ${dim('— pick the ones that fit; most products are several')}\n`);
    for (const k of shapeKeys) console.log(`  ${bold(k.padEnd(21))} ${dim(cat.shapes[k].label)}`);
    console.log(`\n  ${dim('boss craft deceptive-patterns --shape mobile-app')}\n`);
    return shape === true ? 0 : 1;
  }
  if (surface === true || (surface && !resolveKey(surface, surfaceKeys))) {
    if (surface !== true) console.log(`\n  ${warn(`No surface matches "${surface}".`)}`);
    console.log(`\n  ${bold('Which surface are you on?')}\n`);
    for (const k of surfaceKeys) console.log(`  ${bold(k.padEnd(26))} ${dim(cat.surfaces[k].label)}`);
    console.log(`\n  ${dim('boss craft deceptive-patterns --surface checkout-and-pricing')}\n`);
    return surface === true ? 0 : 1;
  }

  const sf = surface ? resolveKey(surface, surfaceKeys) : null;
  const sh = shape ? resolveKey(shape, shapeKeys) : null;

  // `--minors` on its own: every row whose bar moves when a child may be present. This is what a
  // surface called "minors" was pretending to be — except the rows live where the product lives.
  if (minors && !sf && !sh) {
    const rows = cat.patterns.filter((p) => p.stricter_when_minors);
    console.log(`\n  ${bold('When a minor may be using it')}  ${dim(`— ${rows.length} rows whose bar moves`)}\n`);
    console.log(`  ${dim('Not a separate surface. The same patterns, held to a higher standard — so you read')}`);
    console.log(`  ${dim('each one where you actually build it, not in a second list you have to reconcile.')}\n`);
    for (const p of rows) {
      console.log(`  ${bold(p.name)}  ${dim(`· ${p.surface}`)}`);
      console.log(`    ${warn('minors')}      ${p.stricter_when_minors}`);
      console.log('');
    }
    console.log(`  ${dim('Age assurance itself is a row, not a rule about rows: --surface signup-and-identity')}\n`);
    return 0;
  }

  // One surface: the actual dose. This is the call a founder makes mid-build.
  if (sf) {
    const rows = cat.patterns.filter((p) => p.surface === sf);
    const meta = cat.surfaces[sf];
    console.log(`\n  ${bold(meta.label)}  ${dim(`— ${rows.length} pattern${rows.length === 1 ? '' : 's'}`)}\n`);
    if (meta.note) console.log(`  ${dim(meta.note)}\n`);
    for (const p of rows) row(p, { minors });
    console.log(`  ${dim('Effect, not intent — a deceptive pattern needs no malice. The one worth catching')}`);
    console.log(`  ${dim('is the one you did not mean to build. Judgment: boss craft deceptive-patterns')}\n`);
    return 0;
  }

  // A shape: the map, not the wall. Surfaces + counts, so they pick where they're standing.
  if (sh) {
    const s = cat.shapes[sh];
    console.log(`\n  ${bold(s.label)}  ${dim(`— ${s.surfaces.length} surfaces where deception shows up`)}\n`);
    for (const key of s.surfaces) {
      const n = cat.patterns.filter((p) => p.surface === key).length;
      console.log(`  ${bold(key.padEnd(26))} ${dim(String(n).padStart(2) + ' patterns')}  ${dim(cat.surfaces[key].detect)}`);
    }
    const strict = cat.patterns.filter((p) => p.stricter_when_minors).length;
    if (strict) console.log(`\n  ${dim(`Could a minor use this? ${strict} of these rows get stricter: --minors`)}`);
    console.log(`\n  ${dim('Pull one surface when you are standing on it — not all of them now:')}`);
    console.log(`  ${dim(`boss craft deceptive-patterns --surface ${s.surfaces[0]}`)}\n`);
    return 0;
  }

  // No filter: the shelf's own shape. Never the whole wall.
  console.log(`\n  ${bold('Deceptive patterns')}  ${dim(`— ${cat.patterns.length} patterns · ${surfaceKeys.length} surfaces · ${shapeKeys.length} product shapes`)}\n`);
  console.log(`  ${dim('This catalog grows. You never read it whole — you read the surface you are on.')}\n`);
  console.log(`  ${bold('--shape <what you are building>')}   ${dim('which surfaces you have at all')}`);
  console.log(`  ${bold('--surface <what you are on now>')}   ${dim('the rows, and the honest version of each')}`);
  console.log(`  ${bold('--minors')}                          ${dim('every row whose bar moves when a child may be present')}`);
  console.log(`\n  ${dim('boss craft deceptive-patterns --shape        list the shapes')}`);
  console.log(`  ${dim('boss craft deceptive-patterns --surface      list the surfaces')}`);
  console.log(`  ${dim('The judgment behind the rows lives in the practice: boss craft deceptive-patterns --prose')}\n`);
  return 0;
}
