#!/usr/bin/env node
// BOSS · website freshness — "does the public site still describe the product?"
//
//   npm run check:site
//
// The site is generated from the manifests, so the ROSTER can't drift. What CAN
// drift is everything a human wrote around it: a page that names a skill we
// removed, a practice added to the library that no page mentions, prose past its
// review date. The product ships `review_by:` staleness-awareness to founders;
// this is the same discipline pointed at BOSS's own front door.
//
// Soft by default (reports and exits 0) — HARD on a broken claim, because a site
// promising a command that doesn't exist is worse than a site that's a bit stale.
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadModes, STANDING_COMMANDS } from '../src/modes.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const WEB = join(ROOT, 'web');
const SITE = join(ROOT, 'site');
const strict = process.argv.includes('--strict');
const today = process.env.BOSS_TODAY || new Date().toISOString().slice(0, 10);

const problems = [];
const notes = [];

// ---- 1. does every page still describe a product that exists? -------------
const modes = loadModes().filter((m) => m.authored);
const skills = new Set(modes.flatMap((m) => m.skills));
const agents = new Set(modes.flatMap((m) => m.agents));
const verbs = new Set(STANDING_COMMANDS.map(([c]) => c.split(' ')[1]).filter(Boolean));

// Skills legitimately named on the site that are not stage skills (host built-ins
// or CLI-side verbs) — listed so a genuine typo still gets caught.
const ALLOW = new Set(['boss', 'boss-sync', 'boss-learn', 'welcome', 'comprehend', 'vet',
  'practice', 'feedback', 'retention', 'canvas', 'red-team']);

for (const f of readdirSync(WEB).filter((f) => f.endsWith('.html') && !f.startsWith('_'))) {
  const raw = readFileSync(join(WEB, f), 'utf8');
  const page = f.replace(/\.html$/, '');
  // A page may deliberately name something that does NOT ship — /team explains why
  // there is no humane mentor. That intent has to be declared in the fragment's own
  // header, so the check stays strict and the exception stays visible.
  const fmHead = (raw.match(/^<!--\n([\s\S]*?)\n-->/) || [, ''])[1];
  const absent = new Set(((fmHead.match(/^mentions-absent:\s*(.*)$/m) || [, ''])[1])
    .split(',').map((x) => x.trim()).filter(Boolean));
  // Skill references written as /verb in prose (skip generated blocks entirely).
  const body = raw.replace(/\{\{[A-Z_]+\}\}/g, '');
  for (const m of body.matchAll(/<code>\/([a-z][a-z0-9-]*)(?:\s[^<]*)?<\/code>/g)) {
    const name = m[1];
    if (!skills.has(name) && !ALLOW.has(name) && !absent.has(name)) {
      problems.push(`${page}.html names /${name} — no such skill in any stage manifest`);
    }
  }
  // Agent references.
  for (const m of body.matchAll(/<code>((?:mentor-|db-|ui-|ux-)[a-z-]+|coder-generalist|tester|program-manager|pm)<\/code>/g)) {
    if (!agents.has(m[1]) && !absent.has(m[1])) problems.push(`${page}.html names agent ${m[1]} — not in any stage manifest`);
  }
  // `boss <verb>` references.
  for (const m of body.matchAll(/<code>boss ([a-z-]+)/g)) {
    if (!verbs.has(m[1]) && !['craft', 'update', 'insights', 'sync', 'learn'].includes(m[1])) {
      notes.push(`${page}.html mentions \`boss ${m[1]}\` — not in the standing list (may still be valid)`);
    }
  }
}

// ---- 2. is anything in the product missing from the site? -----------------
const practices = existsSync(join(ROOT, 'library/practices'))
  ? readdirSync(join(ROOT, 'library/practices')).filter((f) => f.endsWith('.md')).map((f) => f.replace(/\.md$/, ''))
  : [];
const siteText = readdirSync(SITE).filter((f) => f.endsWith('.html'))
  .map((f) => readFileSync(join(SITE, f), 'utf8')).join('\n');
const unmentioned = practices.filter((p) => !siteText.includes(p));
if (unmentioned.length) {
  problems.push(`${unmentioned.length} practice(s) exist but appear nowhere on the site: ${unmentioned.join(', ')}`);
}

// ---- 2b. citation debt -----------------------------------------------------
// Every named source should carry the URL of the primary document someone actually
// opened. `/vet` verifies attributions before grading them, so the work is already
// done — losing the URL throws it away. Reported, never fatal.
let debt = 0, sourceTotal = 0;
{
  const f = join(ROOT, 'library', 'sources.json');
  if (existsSync(f)) {
    const reg = JSON.parse(readFileSync(f, 'utf8'));
    const all = Object.values(reg.sources || {});
    sourceTotal = all.length;
    debt = all.filter((x) => !x.url).length;
  }
}

// ---- 3. prose past its review date ----------------------------------------
const overdue = [];
for (const f of readdirSync(WEB).filter((f) => f.endsWith('.html') && !f.startsWith('_'))) {
  const head = (readFileSync(join(WEB, f), 'utf8').match(/^<!--\n([\s\S]*?)\n-->/) || [, ''])[1];
  const by = (head.match(/^review_by:\s*(\S+)/m) || [])[1];
  const what = (head.match(/^describes:\s*(.*)$/m) || [, ''])[1];
  if (!by) { problems.push(`${f} has no review_by — nothing can report it stale`); continue; }
  if (by < today) overdue.push(`${f.replace(/\.html$/, '')} — due ${by} · ${what}`);
}

// ---- report ---------------------------------------------------------------
console.log(`\n  BOSS · website freshness — ${practices.length} practices, ${skills.size} skills, ${agents.size} agents, as of ${today}\n`);
for (const p of problems) console.log(`  ✗ ${p}`);
for (const o of overdue) console.log(`  · overdue: ${o}`);
for (const n of notes) console.log(`  · ${n}`);
if (!problems.length && !overdue.length) console.log('  Everything the site claims exists, and nothing is past review.');
if (debt) {
  console.log(`\n  · citation debt: ${debt} of ${sourceTotal} named sources have no URL.`);
  console.log('    /vet now requires recording the primary-source URL; these predate that rule.');
  console.log('    Fill a `url` in library/sources.json and the credits page links it automatically.');
}
console.log(`\n  ${problems.length} broken claim(s) · ${overdue.length} page(s) overdue\n`);
console.log('  The roster and the counts are GENERATED and cannot drift. This checks the half a');
console.log('  human wrote: claims about commands, coverage of new practices, and review dates.\n');

if (strict && problems.length) process.exitCode = 1;
