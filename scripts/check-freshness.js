#!/usr/bin/env node
// Practice freshness check — which parts of the shelf have gone stale, and who owns the sweep.
//
//   npm run check:freshness              the report (exit 0 unless a doc is unreadable)
//   npm run check:freshness -- --all     include the ones that are fine
//   npm run check:freshness -- --json    machine-readable, for a skill to read
//
// WHY THIS EXISTS: BOSS already ships staleness-awareness to founders — `/practice` writes a
// `review_by:` onto a PRAC record and tells them AI moves fast enough that a practice quietly
// goes out of date. BOSS's own shelf carried no such field, so the only way to know whether
// `mcp.md` or `skill-authoring.md` still described the world was for a human to remember to
// look. Two practices didn't even have frontmatter. A shelf nothing can see is a shelf that
// rots silently, and that is the one failure a "keep it current" tool cannot have.
//
// THE MODEL: a doc doesn't rot because time passed — it rots because the ground under it moved.
// So cadence is set by WHICH ground (`curve:`), and the curve also names which of the three
// standing refresh disciplines owns the sweep. The output is a command, not a research project.
//
// HONEST LIMIT: cadence catches slow rot. It cannot catch an EVENT — a spec revision that lands
// on a Tuesday, a new frontier model, a breach, a ruling. Those fire the disciplines directly
// (`--event`), and the watchlist is where the trigger list lives. This check is half the system.

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { BOSS_ROOT } from '../src/paths.js';
import { parseFrontmatter } from '../stages/L0-quickstart/template/.claude/hooks/lib/yaml.js';

const PRACTICES_DIR = join(BOSS_ROOT, 'library', 'practices');
const DAY = 86400000;

// curve -> how fast that ground moves, and who sweeps it. The cadence is a CLAIM, revisable:
// if a sweep keeps finding a backlog the cadence is too slow; if it keeps finding nothing,
// too fast. Change it here and re-stamp, don't quietly let docs drift past their date.
const CURVES = {
  host:     { days: 90,  owner: '/practice-refresh', ground: 'the agent host ships changes continuously' },
  protocol: { days: 90,  owner: '/practice-refresh', ground: 'tool/agent standards are still revising' },
  threat:   { days: 90,  owner: '/practice-refresh', ground: 'the attack surface is adversarial' },
  model:    { days: 90,  owner: '/recalibrate',      ground: 'the frontier-model curve moves under it' },
  humane:   { days: 90,  owner: '/humane-refresh',   ground: 'research + regulation keep naming patterns' },
  market:   { days: 180, owner: '/practice-refresh', ground: 'go-to-market patterns move with the cycle' },
  // Added 2026-08-11. The gap the first two sweeps kept hitting: a practice can be *craft* in
  // substance (durable engineering judgment) while the half that describes WHAT AI TOOLS DO BY
  // DEFAULT rots on the tool curve. `craft` at 365d is too slow for those; `model` is the right
  // speed but routes to /recalibrate, which doesn't own design or testing. Hence a third tier.
  'craft-ai': { days: 180, owner: '/practice-refresh', ground: 'durable craft whose AI-default half moves with the tools' },
  craft:    { days: 365, owner: '/practice-refresh', ground: 'durable engineering + human craft' },
};

const ORDER = ['UNREADABLE', 'OVERDUE', 'DUE SOON', 'FRESH', 'RETIRED'];

const isDate = (s) => typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(Date.parse(`${s}T00:00:00Z`));
const daysBetween = (from, to) => Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / DAY);

function argValue(flag) {
  const i = process.argv.indexOf(flag);
  return i !== -1 ? process.argv[i + 1] : undefined;
}

// Read every practice and say, per doc, whether a refresh discipline can actually SEE it.
// Missing metadata is the real error here — everything else is information.
export function readPractices(asof) {
  if (!existsSync(PRACTICES_DIR)) return [];

  return readdirSync(PRACTICES_DIR)
    .filter((f) => f.endsWith('.md') && f !== 'README.md')
    .sort()
    .map((file) => {
      const name = file.replace(/\.md$/, '');
      const rec = { name, file: `library/practices/${file}`, problems: [] };
      const fm = parseFrontmatter(readFileSync(join(PRACTICES_DIR, file), 'utf8'));

      if (!fm) {
        rec.problems.push('no frontmatter block — no refresh discipline can see this doc');
        rec.state = 'UNREADABLE';
        return rec;
      }

      Object.assign(rec, {
        curve: fm.curve,
        status: fm.status || 'active',
        last_reviewed: fm.last_reviewed,
        review_by: fm.review_by,
      });

      if (!fm.curve) rec.problems.push('missing `curve:` — nothing knows which discipline owns it');
      else if (!CURVES[fm.curve]) rec.problems.push(`unknown curve \`${fm.curve}\` (expected one of: ${Object.keys(CURVES).join(', ')})`);
      if (!isDate(fm.last_reviewed)) rec.problems.push('missing or malformed `last_reviewed:` (YYYY-MM-DD)');
      if (!isDate(fm.review_by)) rec.problems.push('missing or malformed `review_by:` (YYYY-MM-DD)');

      // The dates have to agree with the curve, or the cadence is decorative — a doc could
      // carry `curve: threat` and a review date three years out and nothing would object.
      if (CURVES[fm.curve] && isDate(fm.last_reviewed) && isDate(fm.review_by)) {
        const span = daysBetween(fm.last_reviewed, fm.review_by);
        if (span !== CURVES[fm.curve].days) {
          rec.problems.push(`review_by is ${span}d after last_reviewed; curve \`${fm.curve}\` wants ${CURVES[fm.curve].days}d`);
        }
      }

      rec.age = isDate(fm.last_reviewed) ? daysBetween(fm.last_reviewed, asof) : null;
      rec.daysLeft = isDate(fm.review_by) ? daysBetween(asof, fm.review_by) : null;

      if (rec.problems.length) rec.state = 'UNREADABLE';
      else if (rec.status === 'retired') rec.state = 'RETIRED';
      else if (rec.daysLeft < 0) rec.state = 'OVERDUE';
      else if (rec.daysLeft <= 30) rec.state = 'DUE SOON';
      else rec.state = 'FRESH';

      return rec;
    });
}

function report() {
  const asof = argValue('--asof') || new Date().toISOString().slice(0, 10);
  const all = process.argv.includes('--all');
  const practices = readPractices(asof);
  const unreadable = practices.some((p) => p.state === 'UNREADABLE');

  if (process.argv.includes('--json')) {
    console.log(JSON.stringify({ asof, curves: CURVES, practices }, null, 2));
    return unreadable ? 1 : 0;
  }

  practices.sort((a, b) => ORDER.indexOf(a.state) - ORDER.indexOf(b.state) || (b.age ?? 0) - (a.age ?? 0));
  const shown = all ? practices : practices.filter((p) => p.state !== 'FRESH');
  const pad = Math.max(...practices.map((p) => p.name.length));

  console.log(`\nBOSS · practice freshness — ${practices.length} practices, as of ${asof}\n`);

  if (shown.length === 0) {
    console.log('  Nothing due. Every practice is inside its review window.');
  }

  for (const p of shown) {
    if (p.state === 'UNREADABLE') {
      console.log(`  ✗ ${p.name.padEnd(pad)}  ${p.file}`);
      for (const problem of p.problems) console.log(`    ${' '.repeat(pad)}  → ${problem}`);
      continue;
    }
    const mark = p.state === 'OVERDUE' ? '!' : p.state === 'DUE SOON' ? '·' : ' ';
    const when = p.daysLeft < 0 ? `${-p.daysLeft}d overdue` : `due in ${p.daysLeft}d`;
    console.log(`  ${mark} ${p.name.padEnd(pad)}  ${String(p.curve).padEnd(8)}  ${when.padEnd(13)}  last swept ${p.last_reviewed}  ${CURVES[p.curve].owner}`);
  }

  const counts = practices.reduce((acc, p) => ({ ...acc, [p.state]: (acc[p.state] || 0) + 1 }), {});
  const summary = ORDER.filter((k) => counts[k]).map((k) => `${counts[k]} ${k.toLowerCase()}`).join(' · ');
  console.log(`\n  ${summary}${all ? '' : '   (--all to list the fresh ones too)'}`);

  const due = practices.filter((p) => p.state === 'OVERDUE' || p.state === 'DUE SOON');
  if (due.length) {
    const byOwner = {};
    for (const p of due) (byOwner[CURVES[p.curve].owner] ||= []).push(p.name);
    console.log('\n  Run:');
    for (const [owner, names] of Object.entries(byOwner)) console.log(`    ${owner.padEnd(18)} → ${names.join(', ')}`);
  }

  console.log('\n  Cadence only catches SLOW rot. A practice also goes stale on an event — a spec');
  console.log('  revision, a new frontier model, a breach, a ruling. Those fire the disciplines');
  console.log('  directly: docs/research/watchlists/build-craft.md holds the trigger list.\n');

  return unreadable ? 1 : 0;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  process.exit(report());
}
