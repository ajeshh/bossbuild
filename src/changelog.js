// `boss changelog` — read what changed in BOSS, from inside any project.
//
// WHY THIS EXISTS: `/boss-sync`'s step 0 told the model to "read `registry/CHANGELOG.md` from the
// BOSS source repo." A founder's project has no `registry/`. That step is the entire reason sync
// is *reviewed* rather than blind — it's where "14 files changed" becomes "here's what's new and
// why" — and it pointed at a directory only BOSS's own checkout has. Same dead end `boss craft`
// fixed for the practice shelf in v0.147.0, in the one place that most needed to resolve.
//
// The changelog already ships in the npm package (`files` includes `registry/CHANGELOG.md`), so
// it is already on the founder's disk. It just had no reachable form. This is that form.
//
// Default behaviour is the useful one: inside a BOSS project, "what changed since MY pin" — the
// exact question a founder has when `boss status` says newer practices are available.

import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { BOSS_ROOT, bossVersion } from './paths.js';
import { dim, bold, ok, warn, err } from './ui.js';

const CHANGELOG = join(BOSS_ROOT, 'registry', 'CHANGELOG.md');

// "0.151.0" -> [0,151,0]. Anything unparseable sorts oldest, which fails safe: an entry we can't
// grade shows up rather than being silently swallowed.
const parts = (v) => String(v || '').trim().split('.').map((n) => parseInt(n, 10) || 0);
export function cmpVersion(a, b) {
  const [x, y] = [parts(a), parts(b)];
  for (let i = 0; i < 3; i++) if ((x[i] || 0) !== (y[i] || 0)) return (x[i] || 0) - (y[i] || 0);
  return 0;
}

// Entries are `## X.Y.Z — YYYY-MM-DD` headings with everything up to the next `## ` beneath.
export function parseEntries(text) {
  const out = [];
  const lines = text.split(/\r?\n/);
  let cur = null;
  for (const line of lines) {
    const m = line.match(/^##\s+(\d+\.\d+\.\d+)\s*(?:[—-]\s*(.*))?$/);
    if (m) {
      if (cur) out.push(cur);
      cur = { version: m[1], date: (m[2] || '').trim(), body: [] };
    } else if (cur) cur.body.push(line);
  }
  if (cur) out.push(cur);
  return out;
}

// The first bolded lead-in of an entry, as a one-line gist for the compact list.
// TOP-LEVEL bullets only on the first pass: entries nest their sub-findings, and an indented
// bullet is a detail, not the release's point. (v0.150.0 otherwise reported itself as
// "[[RVW-073]] workslop antecedents — ADAPT (narrow)", which is one of its four sub-items.)
// Indented bullets are the fallback, so an entry that only nests still says something.
export function headline(entry) {
  for (const re of [/^-\s+\*\*(.+?)\*\*/, /^\s*-\s+\*\*(.+?)\*\*/]) {
    for (const raw of entry.body) {
      const m = raw.match(re);
      if (m) return m[1].replace(/\s+/g, ' ').trim();
    }
  }
  return '';
}

const truncate = (s, n) => (s.length > n ? `${s.slice(0, n - 1)}…` : s);

export function printChangelog({ since, all = false, full = false, pin = null } = {}) {
  if (!existsSync(CHANGELOG)) {
    console.log(`\n  ${err('✗')} no changelog in this BOSS install (${CHANGELOG}).\n`);
    return 1;
  }
  const entries = parseEntries(readFileSync(CHANGELOG, 'utf8'));
  if (!entries.length) {
    console.log(`\n  ${err('✗')} the changelog is present but has no parseable entries.\n`);
    return 1;
  }

  const installed = bossVersion();
  // Precedence: an explicit --since wins; otherwise the project's pin is the interesting cut.
  const floor = all ? null : (since || pin || null);
  const shown = floor ? entries.filter((e) => cmpVersion(e.version, floor) > 0) : entries;

  console.log(`\n  ${bold('BOSS changelog')}   ${dim(`installed: ${installed}`)}${pin ? dim(`   ·   this project: ${pin}`) : ''}\n`);

  if (floor && !shown.length) {
    // Two very different situations wear the same "nothing to show" face. Say which.
    if (cmpVersion(floor, installed) >= 0) {
      console.log(`  ${ok('✦')} Nothing new — this project is on the installed version (${installed}).\n`);
      console.log(`  ${dim('That only means your INSTALL and your PROJECT agree. To find out whether the')}`);
      console.log(`  ${dim('install itself is behind, update the tool:')}  ${bold('npm i -g oyeboss@latest')}`);
      console.log(`  ${dim('(or')} ${bold('brew upgrade boss')}${dim('), then run this again.')}\n`);
    } else {
      console.log(`  ${warn('⟳')} No entries after ${floor} in this install (${installed}).`);
      console.log(`  ${dim('Your project is pinned ahead of the BOSS you have installed — update the tool.')}\n`);
    }
    return 0;
  }

  if (full || shown.length === 1) {
    for (const e of shown) {
      console.log(`  ${bold(e.version)}${e.date ? dim(`  — ${e.date}`) : ''}`);
      for (const line of e.body) console.log(line ? `  ${line}` : '');
      console.log('');
    }
  } else {
    const list = shown.slice(0, all ? shown.length : 25);
    for (const e of list) {
      const h = headline(e);
      console.log(`  ${bold(e.version.padEnd(9))}${dim((e.date || '').padEnd(12))}${h ? truncate(h, 62) : ''}`);
    }
    if (shown.length > list.length) console.log(`  ${dim(`… +${shown.length - list.length} older`)}`);
    console.log('');
    console.log(`  ${dim('--full for the entries in detail · --all for the whole history')}`);
  }

  if (floor && shown.length) {
    console.log(`\n  ${shown.length} release(s) since ${floor}. Run ${bold('/boss-sync')} ${dim('inside Claude')} to review`);
    console.log(`  the diff and bring this project up — it narrates from these entries.\n`);
  }
  return 0;
}
