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
      // Whatever follows the dash was taken as the DATE, unvalidated — so a heading written
      // `## 0.255.0 — the watchlist rots too` rendered its title in the date column, straight-faced.
      // One entry in 257 was shaped that way, and nothing could have told you. Anything that is not
      // a date IS a title, which is both true and more useful: it gives the entry a headline.
      const rest = (m[2] || '').trim();
      const isDate = /^\d{4}-\d{2}-\d{2}$/.test(rest);
      cur = { version: m[1], date: isDate ? rest : '', title: isDate ? '' : rest, body: [] };
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
// Third fallback added v0.256.0: a **bolded lead-in PARAGRAPH**, which is how most entries actually
// open — `**The fourth silent failure in the freshness system.**` is the release's point, and the
// bullets beneath it are the detail. Reading only bullets left **25 of 257 entries rendering as a
// blank row**: a version, a date, and nothing at all, in the one view a founder scans.
// 🔴 AND THE SAME WRAPPING BUG, IN THE SIBLING FUNCTION (v0.256.0). This matched line by line, so a
// bolded lead-in whose `**` closes on the NEXT line never matched at all — and entries open with
// long bold spans, which wrap. That is exactly the bug `gen-site.js` records paying for on the
// For-you block: *"The block is MULTI-LINE. `(.+)$` captured only the first line."* The fix landed
// there and never crossed to here, and the two functions read the same file four lines apart.
// **23 of 257 entries rendered as a blank row** because of it — a version, a date, and nothing.
// Match against the JOINED body so a wrapped span closes.
export function headline(entry) {
  const text = entry.body.join('\n');
  for (const re of [/^-\s+\*\*([\s\S]+?)\*\*/m, /^\s*-\s+\*\*([\s\S]+?)\*\*/m, /^\*\*([\s\S]+?)\*\*/m]) {
    const m = text.match(re);
    if (m) return m[1].replace(/\s+/g, ' ').trim();
  }
  return '';
}

// 🔴 THE RULE THE CHANGELOG STATES ABOUT ITSELF, AND THE SURFACE THAT NEVER APPLIED IT (v0.256.0).
//
// The file's own header: *"The `> **For you:**` line is opt-in, and the bar is high on purpose…
// Everything else (audits, refactors, doc sweeps, internal tooling) gets no line and never reaches
// oyeboss.build/whats-new.html."* `gen-site.js` implements that, with two recorded bug-fixes behind
// it. **This file implemented none of it** — `headline()` returns the first bolded top-level bullet,
// which is an internal engineering finding, and the full-body branch fired whenever exactly one
// entry matched. So a founder ONE RELEASE BEHIND — the commonest case, and the exact person
// `boss whatsnew` is for — got the raw entry: `check:freshness`, `taps_reviewed:`, a watchlist
// filename. **One rule, two surfaces, one of them unread**, which is the same sentence `src/craft.js`
// carries about the provenance leak, on a third surface.
//
// Exported so `gen-site.js` reads THIS instead of its own copy: one implementation, two readers,
// the shape v0.244.0 used for `lib/reentry.js`. The regex is gen-site's, including both fixes it
// paid for — the block is MULTI-LINE (prose wraps) and there can be MORE THAN ONE per release.
export function forYou(entry) {
  const text = Array.isArray(entry.body) ? entry.body.join('\n') : String(entry || '');
  return [...text.matchAll(/^>\s*\*\*For you:\*\*\s*(.+(?:\n>.*)*)/gm)]
    .map((b) => b[1].split('\n').map((l) => l.replace(/^>\s?/, '').trim()).join(' ').trim())
    .filter(Boolean);
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

  // `full` is now the ONLY way to the raw body. It used to also fire on `shown.length === 1`, which
  // meant being one release behind — the commonest reason to run this — dumped the internal entry.
  if (full) {
    for (const e of shown) {
      console.log(`  ${bold(e.version)}${e.date ? dim(`  — ${e.date}`) : ''}`);
      for (const line of e.body) console.log(line ? `  ${line}` : '');
      console.log('');
    }
  } else if (shown.length === 1) {
    // One entry still earns more than a truncated row — but it earns the FOUNDER-FACING half.
    const [e] = shown;
    console.log(`  ${bold(e.version)}${e.date ? dim(`  — ${e.date}`) : ''}\n`);
    const lines = forYou(e);
    if (lines.length) for (const l of lines) console.log(`  ${l}\n`);
    else console.log(`  ${dim('Internal release — nothing here changes what you do.')}\n`);
    console.log(`  ${dim('--full for the engineering detail')}`);
  } else {
    const list = shown.slice(0, all ? shown.length : 25);
    for (const e of list) {
      // Prefer what the release said TO A FOUNDER; fall back to the first finding only when the
      // release never spoke to one. Truncating an internal bullet was never the right summary.
      const h = forYou(e)[0] || e.title || headline(e);
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
