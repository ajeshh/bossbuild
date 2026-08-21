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


// --- the TEMPLATE SURFACE (v0.160.0) ------------------------------------------------------
// The 46 skills / 15 agents / 6 hooks BOSS ships into every project. Metadata lives in a ledger
// (registry/surface-freshness.json), NOT inline: those files' frontmatter is host-consumed, and
// adding unknown keys to every founder's SKILL.md to solve BOSS's maintenance problem puts the
// risk on them and the benefit here. See scripts/gen-surface-freshness.js.
//
// The gap this closes: BOSS ships `review_by:` staleness-awareness to founders via `/practice`,
// applied it to its own 28-practice shelf in v0.135.0, and left the surface it actually SHIPS
// with nothing that could ever report it stale.
const SURFACE_LEDGER = join(BOSS_ROOT, 'registry', 'surface-freshness.json');

function readSurface(asof) {
  if (!existsSync(SURFACE_LEDGER)) return [];
  let entries;
  try { entries = JSON.parse(readFileSync(SURFACE_LEDGER, 'utf8')).surface || []; } catch { return []; }
  return entries.map((e) => {
    const rec = { ...e, name: e.rel.endsWith('SKILL.md')
      ? e.rel.split('/').slice(-2)[0]
      : e.rel.split('/').pop().replace(/\.(md|js)$/, ''), problems: [] };
    if (!CURVES[e.curve]) rec.problems.push(`unknown curve \`${e.curve}\``);
    if (!isDate(e.last_reviewed)) rec.problems.push('last_reviewed is not a YYYY-MM-DD date');
    if (rec.problems.length) { rec.state = 'UNREADABLE'; return rec; }
    // review_by is DERIVED here rather than stored — one clock, no chance of the two disagreeing,
    // which is the drift the practice shelf had to be corrected for in v0.150.0.
    rec.age = daysBetween(e.last_reviewed, asof);
    rec.daysLeft = CURVES[e.curve].days - rec.age;
    rec.state = rec.daysLeft < 0 ? 'OVERDUE' : rec.daysLeft <= 30 ? 'DUE SOON' : 'FRESH';
    return rec;
  });
}


// --- the REVERSE sweep (v0.160.0) ---------------------------------------------------------
// The forward question is "is this practice overdue?". The reverse one is "is any practice
// claimed by NOBODY?" — because a watchlist built from the practices that existed when it was
// written inherits their blind spots, and an unclaimed doc can never come due at all. It is the
// silent failure the cadence check cannot see: `check:freshness` said *28 fresh, 0 overdue* while
// two practices had no domain that would ever fire for them.
//
// Run by hand it found the RESUME note was already stale — the three practices recorded as
// unclaimed had since been claimed, and two different ones were the real orphans. That is exactly
// why it belongs in a script and not in a memory.
//
// Watchlists live under docs/research/, which is gitignored (BOSS's dev workspace), so absence is
// normal in a clone or the published package — report nothing rather than failing.
function readUnclaimed() {
  const wDir = join(BOSS_ROOT, 'docs', 'research', 'watchlists');
  if (!existsSync(wDir) || !existsSync(PRACTICES_DIR)) return null;
  const claims = readdirSync(wDir).filter((f) => f.endsWith('.md'))
    .map((f) => readFileSync(join(wDir, f), 'utf8')).join('\n');
  return readdirSync(PRACTICES_DIR)
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace(/\.md$/, ''))
    .filter((name) => !claims.includes(name));
}

// --- the MARKER sweep (v0.190.0) ----------------------------------------------------------
// The third silent failure, and the one that actually happened. `/humane-refresh` stamps a
// `last_refresh` on its watchlist; the practices it edits carry their own `last_reviewed`. Nothing
// compared the two. On 2026-07-23 a real sweep ran, edited `ai-ux-patterns.md`, bumped that
// practice to 2026-07-23 — and never stamped the watchlist, which kept reading 2026-06-21 for a
// month. Both checks above were green throughout: the practice was fresh, and it was claimed.
//
// So: a watchlist whose marker is OLDER than the newest practice it claims is a sweep that
// happened and was never recorded. That matters because the marker is what scopes the NEXT sweep
// ("published since {last_refresh}") — a stale marker silently re-asks for a month of research
// that was already done, and an over-advanced one silently skips a month that wasn't.
function readMarkers(asof) {
  const wDir = join(BOSS_ROOT, 'docs', 'research', 'watchlists');
  if (!existsSync(wDir) || !existsSync(PRACTICES_DIR)) return null;
  const practices = readdirSync(PRACTICES_DIR).filter((f) => f.endsWith('.md')).map((f) => {
    const fm = parseFrontmatter(readFileSync(join(PRACTICES_DIR, f), 'utf8')) || {};
    return { name: f.replace(/\.md$/, ''), reviewed: fm.last_reviewed || '', curve: fm.curve || '?' };
  });
  return readdirSync(wDir).filter((f) => f.endsWith('.md')).map((f) => {
    const text = readFileSync(join(wDir, f), 'utf8');
    const fm = parseFrontmatter(text) || {};
    const claimed = practices.filter((pr) => text.includes(pr.name) && pr.reviewed);
    const lr = fm.last_refresh || '';
    const ahead = claimed.filter((c) => lr && c.reviewed > lr).sort((a, b) => b.reviewed.localeCompare(a.reviewed));
    // Name the practice that caused the drift. The claim test is a substring match, so a watchlist
    // can over-claim a doc from another curve — showing WHICH practice is what lets a reader tell a
    // real unstamped sweep from a loose mention, instead of trusting a bare date.
    return {
      name: f.replace(/\.md$/, ''),
      lastRefresh: lr,
      nextReview: fm.next_review || '',
      behindBy: ahead.length ? ahead : null,
      overdue: fm.next_review ? fm.next_review < asof : false,
    };
  });
}

function report() {
  const asof = argValue('--asof') || new Date().toISOString().slice(0, 10);
  const all = process.argv.includes('--all');
  const practices = readPractices(asof);
  const unreadable = practices.some((p) => p.state === 'UNREADABLE')
    || readSurface(asof).some((s) => s.state === 'UNREADABLE');

  if (process.argv.includes('--json')) {
    console.log(JSON.stringify({ asof, curves: CURVES, practices, surface: readSurface(asof) }, null, 2));
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

  // --- the shipped surface -----------------------------------------------------------------
  const surface = readSurface(asof);
  if (surface.length) {
    surface.sort((a, b) => ORDER.indexOf(a.state) - ORDER.indexOf(b.state) || (b.age ?? 0) - (a.age ?? 0));
    const sShown = all ? surface : surface.filter((s) => s.state !== 'FRESH');
    const sPad = Math.max(...surface.map((s) => s.name.length));
    console.log(`\nBOSS · shipped-surface freshness — ${surface.length} skills/agents/hooks, as of ${asof}\n`);
    if (!sShown.length) console.log('  Nothing due. Every shipped skill, agent and hook is inside its window.');
    for (const s of sShown) {
      if (s.state === 'UNREADABLE') {
        console.log(`  ✗ ${s.name.padEnd(sPad)}  ${s.rel}`);
        for (const problem of s.problems) console.log(`    ${' '.repeat(sPad)}  → ${problem}`);
        continue;
      }
      const mark = s.state === 'OVERDUE' ? '!' : s.state === 'DUE SOON' ? '·' : ' ';
      const when = s.daysLeft < 0 ? `${-s.daysLeft}d overdue` : `due in ${s.daysLeft}d`;
      console.log(`  ${mark} ${s.name.padEnd(sPad)}  ${String(s.curve).padEnd(8)}  ${when.padEnd(13)}  last swept ${s.last_reviewed}  ${CURVES[s.curve].owner}`);
    }
    const sCounts = surface.reduce((acc, s) => ({ ...acc, [s.state]: (acc[s.state] || 0) + 1 }), {});
    console.log(`\n  ${ORDER.filter((k) => sCounts[k]).map((k) => `${sCounts[k]} ${k.toLowerCase()}`).join(' · ')}${all ? '' : '   (--all to list the fresh ones too)'}`);
  }

  const unclaimed = readUnclaimed();
  if (unclaimed && unclaimed.length) {
    console.log(`\n  ${unclaimed.length} practice(s) claimed by NO watchlist domain — nothing will ever fire for these:`);
    for (const n of unclaimed) console.log(`    ✗ ${n}`);
    console.log('    Add each to a domain in docs/research/watchlists/, or say why it needs no tap.');
  }

  const due = practices.filter((p) => p.state === 'OVERDUE' || p.state === 'DUE SOON');
  if (due.length) {
    const byOwner = {};
    for (const p of due) (byOwner[CURVES[p.curve].owner] ||= []).push(p.name);
    console.log('\n  Run:');
    for (const [owner, names] of Object.entries(byOwner)) console.log(`    ${owner.padEnd(18)} → ${names.join(', ')}`);
  }

  const markers = readMarkers(asof);
  if (markers && markers.length) {
    const drifted = markers.filter((m) => m.behindBy);
    const due = markers.filter((m) => m.overdue);
    if (drifted.length || due.length) {
      console.log(`\nBOSS · watchlist markers — the marker that scopes the NEXT sweep, as of ${asof}\n`);
      for (const m of drifted) {
        console.log(`  ! ${m.name.padEnd(14)}  last_refresh ${m.lastRefresh} — ${m.behindBy.length} claimed practice(s) reviewed since:`);
        for (const c of m.behindBy.slice(0, 5)) console.log(`  ${' '.repeat(16)}    ${c.reviewed}  ${c.name.padEnd(22)} curve: ${c.curve}`);
        if (m.behindBy.length > 5) console.log(`  ${' '.repeat(16)}    … +${m.behindBy.length - 5} more`);
        console.log(`  ${' '.repeat(16)}  A sweep ran and never stamped the marker; the next one re-asks for research already done.`);
        console.log(`  ${' '.repeat(16)}  Check the curves — a practice from another curve is just a mention, not this watchlist's work.`);
      }
      for (const m of due) {
        console.log(`  ! ${m.name.padEnd(14)}  past next_review (${m.nextReview}) — a sweep is due`);
      }
      console.log(`\n  ${drifted.length} unstamped · ${due.length} due`);
    }
  }

  console.log('\n  Cadence only catches SLOW rot. A practice also goes stale on an event — a spec');
  console.log('  revision, a new frontier model, a breach, a ruling. Those fire the disciplines');
  console.log('  directly: docs/research/watchlists/build-craft.md holds the trigger list.\n');

  return unreadable ? 1 : 0;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  process.exit(report());
}
