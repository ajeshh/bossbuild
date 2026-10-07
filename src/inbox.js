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

import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
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

export function readInbox(dir) {
  if (!existsSync(dir) || !statSync(dir).isDirectory()) return null;
  let ledger = {};
  try { const v = JSON.parse(readFileSync(join(dir, LEDGER), 'utf8')); if (v && typeof v === 'object') ledger = v; } catch { /* none yet */ }
  const items = [];
  for (const name of readdirSync(dir).sort()) {
    if (name.startsWith('.') || name === 'README.md') continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) continue;
    const fm = name.endsWith('.md') ? frontmatter(readFileSync(p, 'utf8')) : {};
    const l = ledger[name] || {};
    const fromFm = splitSorted(fm.sorted);
    const sorted = l.sorted || fromFm.date || (fm.resolved ? 'resolved' : null);
    const to = l.to || fromFm.to || fm.resolved || null;
    const kind = l.kind || fm.kind || null;
    let state = 'new';
    if (kind === 'reference') state = 'reference';
    else if (sorted) state = 'sorted';
    else if (HELD.has(kind)) state = 'held';
    items.push({ name, state, kind, sorted, to });
  }
  return items;
}
