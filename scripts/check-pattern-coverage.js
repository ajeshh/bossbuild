#!/usr/bin/env node
// Deceptive-pattern coverage check — what the catalog does NOT cover, and what dose each
// founder actually gets.
//
//   npm run check:patterns              the report
//   npm run check:patterns -- --matrix  the full shape x surface grid
//   npm run check:patterns -- --json    machine-readable, for /humane-refresh to read
//
// WHY THIS EXISTS: /humane-refresh sweeps for what is NEW since the last run. It has never
// asked what is MISSING outright — and that is exactly how three sweeps in a row shipped a
// dark-pattern catalog with no entry for cookie banners while its own standing query named
// "data storage & privacy/consent" as a lane. A what's-new sweep finds the edge; only a
// coverage sweep finds a hole in the middle.
//
// THE OTHER HALF — the dose. The catalog is allowed to grow without bound because nobody
// reads it whole. But SHAPE is not a tight enough filter: a mobile-app founder's shape spans
// seven surfaces and ~50 rows, which is the wall again with extra steps. The dose that
// actually reaches a person is ONE SURFACE — they are building a checkout, or a consent
// banner, or a delete flow, not all of them at once. So the ceiling lives on the surface;
// the shape total is reach, not dose. Growth is safe; surface creep is not.

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { BOSS_ROOT } from '../src/paths.js';
import { dim, bold, ok, warn, err } from '../src/ui.js';

const SURFACE_CEILING = 12; // rows handed over at ONE moment — the real dose
const REACH_NOTE = 60;      // a shape spanning more than this is a candidate to split

const cat = JSON.parse(readFileSync(join(BOSS_ROOT, 'library', 'deceptive-patterns.json'), 'utf8'));
const args = process.argv.slice(2);

const bySurface = new Map(Object.keys(cat.surfaces).map((s) => [s, []]));
for (const p of cat.patterns) bySurface.get(p.surface)?.push(p);

const shapes = Object.entries(cat.shapes).map(([id, s]) => ({
  id, label: s.label, surfaces: s.surfaces,
  dose: s.surfaces.reduce((n, sf) => n + (bySurface.get(sf)?.length || 0), 0),
}));

const emptySurfaces = [...bySurface].filter(([, v]) => !v.length).map(([k]) => k);
const thinSurfaces = [...bySurface].filter(([, v]) => v.length > 0 && v.length < 3).map(([k, v]) => [k, v.length]);
const claimed = new Set(shapes.flatMap((s) => s.surfaces));
const orphanSurfaces = Object.keys(cat.surfaces).filter((s) => !claimed.has(s));
const candidates = cat.patterns.filter((p) => p.status === 'candidate');
const noTeeth = cat.patterns.filter((p) => p.hard && !p.teeth);
const overDose = [...bySurface].filter(([, v]) => v.length > SURFACE_CEILING).map(([k, v]) => [k, v.length]);
const wideShapes = shapes.filter((s) => s.dose > REACH_NOTE);

if (args.includes('--json')) {
  console.log(JSON.stringify({
    patterns: cat.patterns.length, shapes: shapes.length, surfaces: Object.keys(cat.surfaces).length,
    emptySurfaces, thinSurfaces, orphanSurfaces, overDose, wideShapes: wideShapes.map((s) => [s.id, s.dose]),
    candidates: candidates.map((p) => p.id), dose: Object.fromEntries(shapes.map((s) => [s.id, s.dose])),
  }, null, 2));
  process.exit(0);
}

console.log(`\n  ${bold('BOSS · deceptive-pattern coverage')}  ${dim(`— ${cat.patterns.length} patterns across ${Object.keys(cat.surfaces).length} surfaces, ${shapes.length} product shapes`)}\n`);
console.log(`  ${dim('reach = every row this shape could ever see · max dose = the biggest single handover')}\n`);

// The dose table — the humane metric, printed first.
const w = Math.max(...shapes.map((s) => s.id.length));
for (const s of shapes.sort((a, b) => b.dose - a.dose)) {
  const flag = s.dose > REACH_NOTE ? warn(`${s.dose} reach`) : dim(`${s.dose} reach`);
  const max = Math.max(...s.surfaces.map((sf) => bySurface.get(sf)?.length || 0));
  const dose = max > SURFACE_CEILING ? warn(`max dose ${max}`) : ok(`max dose ${max}`);
  console.log(`  ${bold(s.id.padEnd(w))}  ${flag.padEnd(18)} ${dose.padEnd(20)} ${dim(s.surfaces.length + ' surfaces · ' + s.label)}`);
}

if (args.includes('--matrix')) {
  console.log(`\n  ${bold('Surfaces')}\n`);
  const sw = Math.max(...Object.keys(cat.surfaces).map((s) => s.length));
  for (const [id, v] of bySurface) {
    const n = v.length;
    const label = n === 0 ? err('0') : n < 3 ? warn(String(n)) : ok(String(n));
    const users = shapes.filter((s) => s.surfaces.includes(id)).map((s) => s.id);
    console.log(`  ${bold(id.padEnd(sw))}  ${label.padEnd(14)} ${dim(users.join(', ') || 'no shape claims this')}`);
  }
}

const findings = [];
if (emptySurfaces.length) findings.push([err('EMPTY'), `${emptySurfaces.length} surface(s) with no patterns at all: ${emptySurfaces.join(', ')}`]);
if (thinSurfaces.length) findings.push([warn('THIN'), `${thinSurfaces.length} surface(s) under 3 patterns: ${thinSurfaces.map(([k, n]) => `${k} (${n})`).join(', ')}`]);
if (orphanSurfaces.length) findings.push([warn('ORPHAN'), `${orphanSurfaces.length} surface(s) no shape routes to — nobody will ever be shown these: ${orphanSurfaces.join(', ')}`]);
if (overDose.length) findings.push([warn('DOSE'), `${overDose.length} surface(s) past the ${SURFACE_CEILING}-row ceiling — this is what a founder gets handed at one moment: ${overDose.map(([k, n]) => `${k} (${n})`).join(', ')}. Split the surface or subtract; don't ship the wall`]);
if (wideShapes.length) findings.push([dim('REACH'), `${wideShapes.length} shape(s) span more than ${REACH_NOTE} rows total: ${wideShapes.map((s) => `${s.id} (${s.dose})`).join(', ')} — fine if no single surface is over the ceiling, but a split candidate`]);
if (candidates.length) findings.push([dim('CANDIDATE'), `${candidates.length} pattern(s) shipping unvetted (status: candidate): ${candidates.map((p) => p.id).join(', ')} — hand to /vet or mark the status visibly`]);
if (noTeeth.length) findings.push([dim('NOTE'), `${noTeeth.length} hard-named pattern(s) carry no teeth reference — fine, but check they earn the hard-name`]);

console.log('');
if (!findings.length) {
  console.log(`  ${ok('No coverage holes.')} ${dim('Every surface carries patterns and stays inside the dose ceiling.')}`);
} else {
  for (const [tag, msg] of findings) console.log(`  ${tag}  ${msg}`);
}

console.log(`\n  ${dim('Coverage is the half a what\'s-new sweep cannot find. An empty cell is a research')}`);
console.log(`  ${dim('question for /humane-refresh --coverage, not a row to invent.')}\n`);
