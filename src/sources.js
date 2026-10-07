// src/sources.js — source standing: who to read first, counted from what has held up (PROG-005 B5).
//
// The ask that started PROG-005: rank expertise, including emerging expertise — don't just depend on
// old experts. The engine's rule (library/practices/research.md, Standing) is that standing is
// COUNTED from claim rows, never typed in, never a score: how many of a source's claims survived,
// how many were killed, when one last held. A source enters the list the first time a claim of theirs
// is recorded; it reads as *new* when its first claim held recently, and *fading* when nothing of
// theirs has held for a while. Rank decides where to look first — it never makes a claim true.
//
// The input is the claim-row table `/scout` writes (`| # | Claim | Source | Read | Survived | Checked |`),
// in any markdown file under the folders given. Older BOSS records named the column `Result`; both are
// read. Rows whose source can't be named — or that nobody tried to break — count, but never as held.
//
// Measured before building (IDEA-155): ~30 claims in BOSS's whole history tie to a source in a form a
// script can read. So this counts FORWARD; there is nothing worth backfilling by fuzzy matching.

import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';

export const SOURCE_DIRS = [join('docs', 'research'), join('docs', 'competition')];
const DAY = 86400000;
export const NEW_DAYS = 90;      // first held within this → new
export const FADE_DAYS = 365;    // nothing held within this → fading

function walk(dir, out = []) {
  let names;
  try { names = readdirSync(dir); } catch { return out; }
  for (const n of names) {
    if (n.startsWith('.')) continue;
    const p = join(dir, n);
    let st;
    try { st = statSync(p); } catch { continue; }
    if (st.isDirectory()) walk(p, out);
    else if (n.endsWith('.md')) out.push(p);
  }
  return out;
}

const cells = (line) => line.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim());

// The source cell names a person or publisher, often with a link. The name is the key; the link is not
// (one person, many URLs). `[Name](url)` → Name; a bare URL alone → its host, marked as such.
export function sourceKey(cell) {
  let s = String(cell || '').trim();
  const link = /^\[([^\]]+)\]\([^)]*\)/.exec(s);
  if (link) s = link[1];
  s = s.replace(/https?:\/\/\S+/g, '').replace(/[—–-]\s*$/, '').replace(/[*_`]/g, '').trim();
  if (!s) {
    const url = /https?:\/\/([^/\s)]+)/.exec(cell || '');
    return url ? `${url[1].replace(/^www\./, '')} (site — no author named)` : null;
  }
  return s.replace(/\s+/g, ' ');
}

export function survivedOf(cell) {
  const c = String(cell || '').toLowerCase();
  if (/killed|refuted|0-3|1-2/.test(c)) return 'killed';
  if (/confirmed|3-0/.test(c)) return 'confirmed';
  if (/held|2-1/.test(c)) return 'held';
  return 'unverified';
}

export function readClaims(dirs) {
  const claims = [];
  for (const dir of dirs) {
    for (const file of walk(dir)) {
      const lines = readFileSync(file, 'utf8').split(/\r?\n/);
      let cols = null;
      for (const line of lines) {
        if (!line.trim().startsWith('|')) { cols = null; continue; }
        const row = cells(line);
        const lower = row.map((c) => c.toLowerCase());
        if (lower.includes('claim') && lower.includes('source') && (lower.includes('survived') || lower.includes('result'))) {
          cols = {
            claim: lower.indexOf('claim'), source: lower.indexOf('source'),
            survived: lower.includes('survived') ? lower.indexOf('survived') : lower.indexOf('result'),
            read: lower.indexOf('read'), checked: lower.indexOf('checked'),
          };
          continue;
        }
        if (!cols || /^:?-{3,}/.test(row[0] || '')) continue;
        const source = sourceKey(row[cols.source]);
        if (!source) continue;
        const date = (/\d{4}-\d{2}-\d{2}/.exec(cols.checked >= 0 ? row[cols.checked] : line) || [null])[0];
        claims.push({ source, claim: row[cols.claim], survived: survivedOf(row[cols.survived]), read: cols.read >= 0 ? row[cols.read] : '', date, file });
      }
    }
  }
  return claims;
}

export function standing(claims, today = new Date()) {
  const by = new Map();
  for (const c of claims) {
    const s = by.get(c.source) || { source: c.source, held: 0, killed: 0, unverified: 0, first: null, lastHeld: null, firstHeld: null };
    if (c.survived === 'killed') s.killed += 1;
    else if (c.survived === 'unverified') s.unverified += 1;
    else {
      s.held += 1;
      if (c.date && (!s.lastHeld || c.date > s.lastHeld)) s.lastHeld = c.date;
      if (c.date && (!s.firstHeld || c.date < s.firstHeld)) s.firstHeld = c.date;
    }
    if (c.date && (!s.first || c.date < s.first)) s.first = c.date;
    by.set(c.source, s);
  }
  const age = (d) => (d ? (today - new Date(`${d}T00:00:00Z`)) / DAY : Infinity);
  const rows = [...by.values()].map((s) => {
    let label = 'no record yet';                       // nothing of theirs has been tested
    if (s.held) {
      if (age(s.lastHeld) > FADE_DAYS) label = 'fading';
      else if (age(s.firstHeld) <= NEW_DAYS) label = 'new';
      else label = 'held up';
    } else if (s.killed) label = 'not held up';
    return { ...s, label };
  });
  // Where to look first: what has held, most recently — then the untested, then what didn't hold.
  // An order with its reason, never a score; a name's fame plays no part.
  const rank = { new: 0, 'held up': 0, fading: 1, 'no record yet': 2, 'not held up': 3 };
  rows.sort((a, b) => (rank[a.label] - rank[b.label]) || (b.held - a.held) || String(b.lastHeld || '').localeCompare(String(a.lastHeld || '')) || a.source.localeCompare(b.source));
  const year = new Date(today - 365 * DAY).toISOString().slice(0, 10);
  const tilt = { total: rows.length, newThisYear: rows.filter((r) => r.first && r.first >= year).length };
  return { rows, tilt };
}

export function existingDirs(projectDir, dirs) {
  return dirs.map((d) => join(projectDir, d)).filter((d) => existsSync(d));
}
