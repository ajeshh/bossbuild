// src/inbox.js — the inbox view: what came in, what has been sorted and where it went (PROG-005 T2).
//
// `/inbox` receives (a dated copy in docs/source/) and `/scout sort` files each part where it belongs.
// What was missing is the view — which items are still unsorted — and the reason it has to be a
// command rather than a habit is BOSS's own record: 41 of 43 items in its research inbox had been
// vetted and never moved, because the move was a step nobody did by hand. So nothing moves here.
// An item is sorted when something says so:
//
//   docs/source/.inbox.json   { "<file>": { "sorted": "YYYY-MM-DD", "to": "<where>", "kind": "<kind>" } }
//                             — written by /scout sort; works for a PDF or a deck as well as markdown
//   frontmatter               `sorted: YYYY-MM-DD → <where>` or BOSS's own `resolved: RVW-NNN`
//
// `kind: reference` is kept with no claim to file; `kind: legal` / `kind: hr` unsorted is HELD —
// labelled and kept on this machine until the project has a home for it. Everything else unsorted
// is new. The folder is gitignored (research about people stays local), so this ledger is too.

import { readdirSync, readFileSync, existsSync, statSync, lstatSync, readlinkSync } from 'node:fs';
import { join } from 'node:path';

export const INBOX_DIR = join('docs', 'source');
export const LEDGER = '.inbox.json';
const HELD = new Set(['legal', 'hr']);

// Fenced frontmatter, or — BOSS's own older inbox items — a bare `resolved: RVW-NNN` block at the top.
function frontmatter(text) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---/.exec(text);
  const out = {};
  const block = m ? m[1] : (text.split(/\r?\n\s*\r?\n/)[0] || '');
  for (const line of block.split(/\r?\n/)) {
    const kv = /^([a-z_]+):\s*(.*)$/.exec(line);
    if (kv) out[kv[1]] = kv[2].trim().replace(/^["']|["']$/g, '');
  }
  return out;
}

// `sorted: 2026-10-06 → docs/competition/` carries the destination after the arrow.
function splitSorted(value) {
  if (!value) return { date: null, to: null };
  const [date, ...rest] = String(value).split(/\s*(?:→|->)\s*/);
  return { date: date.trim() || null, to: rest.join(' → ').trim() || null };
}

// What can make the view wrong, said rather than swallowed: the folder is a link (`boss team share`)
// whose drive isn't there, or the ledger can't be read — every sorted item would then show as new.
export function inboxProblems(dir) {
  let brokenLink = null;
  try { if (lstatSync(dir).isSymbolicLink() && !existsSync(dir)) brokenLink = readlinkSync(dir); } catch { /* absent */ }
  let ledgerError = false;
  const lp = join(dir, LEDGER);
  if (existsSync(lp)) { try { JSON.parse(readFileSync(lp, 'utf8')); } catch { ledgerError = true; } }
  return { brokenLink, ledgerError };
}

export function readInbox(dir) {
  if (!existsSync(dir) || !statSync(dir).isDirectory()) return null;
  let ledger = {};
  try { const v = JSON.parse(readFileSync(join(dir, LEDGER), 'utf8')); if (v && typeof v === 'object') ledger = v; } catch { /* none yet, or unreadable — inboxProblems says which */ }
  const items = [];
  for (const name of readdirSync(dir).sort()) {
    if (name.startsWith('.') || name === 'README.md') continue;
    const p = join(dir, name);
    let st;
    try { st = statSync(p); } catch { continue; } // a dangling link inside the folder: nothing to read
    // A folder dropped in by hand is one item — the README invites it, and skipping it hid it.
    const fm = !st.isDirectory() && name.endsWith('.md') ? frontmatter(readFileSync(p, 'utf8')) : {};
    const l = ledger[name] || {};
    const fromFm = splitSorted(fm.sorted);
    const sorted = l.sorted || fromFm.date || (fm.resolved ? 'resolved' : null);
    const to = l.to || fromFm.to || fm.resolved || null;
    const kind = l.kind || fm.kind || null;
    let state = 'new';
    if (kind === 'reference') state = 'reference';
    else if (sorted) state = 'sorted';
    else if (HELD.has(kind)) state = 'held';
    items.push({ name: st.isDirectory() ? `${name}/` : name, state, kind, sorted, to });
  }
  return items;
}
