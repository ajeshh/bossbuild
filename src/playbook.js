// The playbook — a founder's records, drawn as a page (FEAT-026, from IDEA-106).
//
// Slice 1: the canvas as boxes. Reads `docs/ideas/*-canvas.md` (the `| **Cell** | Answer |`
// table `/canvas` writes), `docs/evidence/EVID-*.md` (grades and dates only) and
// `docs/BRAND.md` (three fields), and writes ONE self-contained HTML file to
// `.boss/playbook.html` — no server, no deps, nothing fetched, exactly like `board.html`.
//
// Three rules the code enforces, because the render is only honest if it cannot be otherwise:
//   1. Every word on the page is the founder's (a cell's answer, rendered whole) or a prompt the
//      `/canvas` template already holds. The renderer composes no sentence.
//   2. A hole is a hole. `_(not yet)_` renders dashed with its prompt; a dormant cell renders at
//      full size with the condition that wakes it. Nothing is collapsed or omitted in any frame.
//   3. Numbers in the chrome are counted from the files, never typed.
//
// The cell registry below mirrors stages/L0-quickstart/template/.claude/skills/canvas/SKILL.md
// by hand (a test holds them in step). The parser bends to the template, never the reverse.

import { readFileSync, readdirSync, existsSync, mkdirSync, writeFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { frontmatter } from './frontmatter.js';
import { shellPage } from './page-shell.js';
// The venture's own tokens set the page when docs/design/tokens.json exists — ground, paper, ink,
// rules, faces, radius — so a founder's playbook looks like their product and BOSS's looks like
// BOSS (Ajesh, 2026-09-13). Light scheme only: no dark tokens means dark isn't designed. Neutral
// otherwise. A cycle with design.js (it imports verbLine) — function bindings used at call time only.
import { readTokens, themeFromTokens } from './design.js';
import { isoDay, isoMinute } from './clock.js';

// --- the registry -----------------------------------------------------------------------------
// `lean` is the Lean Canvas box the humane answer reads as (DEC-004 mapping); `area` its grid slot.
// Cells with no `lean` are humane-only and hide in the Lean frame — except the two FLOOR cells,
// which render in EVERY frame as a band beneath the grid (DEC-004: humane is the floor).
export const CELLS = [
  { key: 'people',     name: 'People',                   band: 1, lean: 'Customer segments',        area: '1 / 5 / 3 / 6', bmc: 'Customer segments', bmcArea: '1 / 5 / 3 / 6',
    prompt: 'Who are you designing for & what matters to them? Who exactly has the painful problem — how many, and how do you know?' },
  { key: 'problem',    name: 'Problem',                  band: 1, lean: 'Problem',                  area: '1 / 1 / 3 / 2',
    prompt: 'What real human tension are you solving? Is it urgent, frequent, expensive, or emotionally painful?' },
  { key: 'promises',   name: 'Promises',                 band: 1, lean: 'Unique value proposition', area: '1 / 3 / 3 / 4', bmc: 'Value propositions', bmcArea: '1 / 3 / 3 / 4',
    prompt: 'What emotional / relational value will it deliver? The sharp promise: "We help X do Y without Z."' },
  { key: 'story',      name: 'Story',                    band: 2, lean: 'Solution',                 area: '1 / 2 / 2 / 3',
    prompt: 'How does your product show up in someone\'s life? What changed that makes this newly possible?' },
  { key: 'modes',      name: 'Modes of Engagement',      band: 2, lean: 'Unfair advantage',         area: '1 / 4 / 2 / 5', bmc: 'Customer relationships', bmcArea: '1 / 4 / 2 / 5',
    prompt: 'How do people interact with your product in a humane way? Does it respect time, attention, agency?' },
  { key: 'bizmodel',   name: 'Business Model',           band: 2, lean: 'Revenue streams',          area: '3 / 4 / 4 / 6', bmc: 'Revenue streams', bmcArea: '3 / 4 / 4 / 6',
    prompt: 'How will you sustain this without compromising your promise? Who pays, how much — and how do the first 100 find you?' },
  { key: 'cost',       name: 'Cost Structure',           band: 2, lean: 'Cost structure',           area: '3 / 1 / 4 / 4', bmc: 'Cost structure', bmcArea: '3 / 1 / 4 / 4',
    prompt: 'What does it actually cost to serve one person for a month?' },
  { key: 'deliver',    name: 'What it takes to deliver', band: 2, bmc: 'Key activities · Key resources', bmcArea: '1 / 2 / 3 / 3',
    prompt: 'What do you need to have and do to keep the promise?' },
  { key: 'partners',   name: 'Key Partnerships',         band: 2, bmc: 'Key partnerships', bmcArea: '1 / 1 / 3 / 2',
    prompt: 'Is there anyone whose cooperation this can\'t work without?' },
  { key: 'metrics',    name: 'Metrics',                  band: 3, lean: 'Key metrics',              area: '2 / 2 / 3 / 3',
    prompt: 'What does meaningful success look like — for people and planet? Real pull: activation, retention.' },
  { key: 'risks',      name: 'Risks & Harms',            band: 3, floor: true,
    prompt: 'What could unintentionally go wrong? Who might be harmed or excluded?' },
  { key: 'buildbuy',   name: 'Build or buy?',            band: 3,
    prompt: 'Is the honest move to build this — or would using / buying something existing get the same outcome?' },
  { key: 'principles', name: 'Principles',               band: 3, floor: true,
    prompt: 'What values will guide your decisions? The non-negotiables you\'ll hold even when it\'s costly.' },
];
// Lean has a box the humane canvas answers inside Business Model. It renders as a POINTER, never a
// second copy — the frame layer's rule is that switching frames never asks (or shows) anything twice.
const LEAN_CHANNELS_AREA = '2 / 4 / 3 / 5';   // the same slot in BMC — Channels sits under Customer relationships in both

const BANDS = {
  1: ['Human foundation', 'who you serve, the tension they carry, the value you promise'],
  2: ['Product expression', 'how it shows up in a life, how people engage, how it sustains itself'],
  3: ['Stewardship', 'impact, risks, and the values that guide decisions'],
};
const FLOOR_HEADING = 'Two questions this canvas asks that Lean and BMC don\'t';
const CREDITS = { humane: 'Humane Product Canvas · Ajesh Shah', lean: 'Lean Canvas · Ash Maurya, adapted — plus the two floor cells', bmc: 'Business Model Canvas · Alexander Osterwalder, adapted — plus the two floor cells' };
const GRADES = ['stated-pain', 'observed-behavior', 'commitment'];

const norm = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// --- reading ------------------------------------------------------------------------------------

// The newest canvas by `updated:` frontmatter, else mtime. Several canvases → the newest, named in
// the footer; asking "which idea?" would block the value moment for the common single-canvas case.
export function findCanvas(projectDir) {
  const dir = join(projectDir, 'docs', 'ideas');
  if (!existsSync(dir)) return null;
  const files = readdirSync(dir).filter((n) => /-canvas\.md$/i.test(n) || /^CANVAS\.md$/i.test(n));
  if (!files.length) return null;
  const scored = files.map((n) => {
    const p = join(dir, n);
    let when = 0;
    try {
      const fm = frontmatter(readFileSync(p, 'utf8'));
      when = Date.parse(fm.updated || fm.created || '') || statSync(p).mtimeMs;
    } catch { when = 0; }
    return { name: n, path: p, when };
  }).sort((a, b) => b.when - a.when);
  return { ...scored[0], others: scored.slice(1).map((s) => s.name) };
}

// `| **Cell** _(condition)_ | answer |` rows, under whatever `## N · Band` heading they sit in.
// Unknown rows are kept (rendered in their band) — a cell the founder added is still their cell.
export function parseCanvas(text) {
  const lines = String(text).replace(/\r\n?/g, '\n').split('\n');
  const cells = [];
  let band = 0;
  let sectionTitle = '';
  for (const line of lines) {
    const h = line.match(/^##\s+(\d)\s*[·.\-–—]?\s*(.*)$/);
    if (h) { band = parseInt(h[1], 10); sectionTitle = h[2].trim(); continue; }
    const h2 = line.match(/^##\s+(.*)$/);
    if (h2) { band = 0; sectionTitle = h2[1].trim(); continue; }
    const row = line.match(/^\|\s*\*\*(.+?)\*\*\s*(_\((.*?)\)_)?\s*\|(.*)\|\s*$/);
    if (!row) continue;
    const name = row[1].trim();
    const condition = row[3] ? row[3].trim() : '';
    const answer = row[4].trim();
    cells.push({ name, condition, answer, band, section: sectionTitle });
  }
  const fm = frontmatter(text);
  return { cells, updated: fm.updated || fm.created || null, id: fm.id || null };
}

function cellState(answer) {
  const a = answer.trim();
  if (!a) return 'hole';
  if (/^_\((?:not yet|not yet[^)]*)\)_$/i.test(a) || /^_\(not yet\b/i.test(a)) return 'hole';
  if (/^_\(live (?:once|when|only if)\b/i.test(a)) return 'dormant';
  return 'filled';
}

// EVID records: grade + date + which cell (if any) they name. A record names a cell when its
// `assumption:` / `cell:` / `cells:` / `relates:` text contains the cell's name. No `cell:` field is
// added to `/evidence` here (IDEA-106 kicked-up #6) — the render reads what exists.
export function readEvidence(projectDir) {
  const dir = join(projectDir, 'docs', 'evidence');
  if (!existsSync(dir)) return [];
  const out = [];
  for (const n of readdirSync(dir)) {
    if (!/^EVID-\d+.*\.md$/i.test(n)) continue;
    try {
      const text = readFileSync(join(dir, n), 'utf8');
      const fm = frontmatter(text);
      const grade = String(fm.grade || '').trim().toLowerCase();
      const dateIn = (s) => (String(s || '').match(/\d{4}-\d{2}-\d{2}/) || [null])[0];
      const date = dateIn(fm.date) || dateIn(fm.created) || dateIn(fm.source) || dateIn(fm.updated) || null;
      const names = [fm.cell, fm.cells, fm.assumption, fm.relates].filter(Boolean).map(String).join(' ');
      // FEAT-028: the title line is the founder's own summary; the body and `source:` never leave the file
      const h1 = (text.match(/^#\s+(.+)$/m) || [null, ''])[1].replace(/^EVID-\d+\s*[—–-]\s*/i, '').trim();
      out.push({ id: fm.id || n.replace(/\.md$/i, ''), file: n, grade, date, names: norm(names), title: stripMd(h1), method: String(fm.method || '').trim().toLowerCase(), assumption: stripMd(String(fm.assumption || '')) });
    } catch { /* an unreadable record is not a signal */ }
  }
  return out;
}

// docs/BRAND.md — three fields, each falling back on its own. `unknown` is a real answer and
// means "the default", never an invented colour.
// The template writes docs/BRAND.md; BOSS's own brand bible predates it at docs/design/BRAND.md.
// ONE resolver for every reader of the file: until 2026-09-13 readBrand accepted both paths while
// readBrandLine and readBrandShape opened only the first, so BOSS's own six shape lines were
// written and invisible — the design space said "absent" about a file the same page's header
// had just read the tagline from. A reader whose input lives elsewhere fails open, silently.
export function brandPath(projectDir) {
  return [join(projectDir, 'docs', 'BRAND.md'), join(projectDir, 'docs', 'design', 'BRAND.md')].find((x) => existsSync(x)) || null;
}

export function readBrand(projectDir, projectName) {
  const brand = { name: projectName, accent: null, tagline: null, present: false, nascent: false };
  const p = brandPath(projectDir);
  if (!p) return brand;
  brand.present = true;
  let text = '';
  try { text = readFileSync(p, 'utf8'); } catch { return brand; }
  const fm = frontmatter(text);
  if (String(fm.status || '').toLowerCase().includes('nascent')) brand.nascent = true;
  const pick = (v) => { const s = String(v || '').trim(); return !s || /^unknown\b/i.test(s) ? null : s; };
  const hex = (v) => { const m = String(v || '').match(/#[0-9a-fA-F]{6}\b/); return m ? m[0] : null; };
  brand.accent = hex(fm.accent) || hex((text.match(/accent[^\n]*?(#[0-9a-fA-F]{6})/i) || [])[0]);
  brand.tagline = pick(fm.tagline) || pick((text.match(/^-\s*\*\*tagline:?\*\*\s*(.+)$/im) || [])[1]);
  brand.name = pick(fm.wordmark) || pick(fm.name) || projectName;
  return brand;
}


// --- slice 2 readers (FEAT-027) — each returns a plain shape or null; none throws ------------------

const stripMd = (s) => String(s).replace(/^\s*[-*]\s+/gm, '').replace(/\[\[([^\]]+)\]\]/g, '$1').replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
  .replace(/[*_`]/g, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

// The first sentence of a record's text — the chapter line (IDEA-106 §8). BOSS writes none of
// these: if the sentence is bad, the record wants a better first sentence, not the render.
export function firstSentence(md, max = 180) {
  const t = stripMd(md);
  if (!t) return '';
  const m = t.match(/^(.{12,}?[.!?])(\s|$)/);
  const s = (m ? m[1] : t).trim();
  return s.length > max ? s.slice(0, max - 1).replace(/\s+\S*$/, '') + '…' : s;
}

// The section body under `## <heading>` (to the next `## `), as markdown lines.
function section(text, heading) {
  const lines = String(text).replace(/\r\n?/g, '\n').split('\n');
  const start = lines.findIndex((l) => new RegExp(`^##\\s+${heading}\\s*$`, 'i').test(l));
  if (start < 0) return null;
  const out = [];
  for (let i = start + 1; i < lines.length; i++) { if (/^##\s/.test(lines[i])) break; out.push(lines[i]); }
  return out.join('\n').trim();
}

// Markdown block → HTML for the small set a record body uses: paragraphs, `- ` lists, `_italic_`
// helper lines. Every line goes through `inline` (escaped first).
export function blockMd(md) {
  const lines = String(md || '').replace(/\r\n?/g, '\n').split('\n');
  const out = [];
  let list = [];
  const flush = () => { if (list.length) { out.push(`<ul>${list.map((l) => `<li>${inline(l)}</li>`).join('')}</ul>`); list = []; } };
  for (const raw of lines) {
    const l = raw.trim();
    if (!l) { flush(); continue; }
    const li = l.match(/^[-*]\s+(.*)$/);
    if (li) { list.push(li[1]); continue; }
    flush();
    if (/^_.*_$/.test(l)) out.push(`<p class="helper">${inline(l.slice(1, -1))}</p>`);
    else out.push(`<p>${inline(l)}</p>`);
  }
  flush();
  return out.join('');
}

// The IDEA doc the canvas belongs to (`IDEA-NNN-canvas` → `IDEA-NNN-*.md`), else THE VENTURE idea —
// never simply the newest. An IDEA is one of two kinds (IDEA-114): the venture the founder walked in
// with (`kind: venture`, written by /boss, one per project) or a capability ("add X", `kind: capability`,
// written by /idea, many). The Vision chapter renders the venture; picking the newest file rendered
// whatever feature was captured last. Rank: `kind: venture` · then a record carrying `motivation:` at
// all (the pre-field /boss template always wrote it) · then newest, so nothing older regresses.
export function readIdea(projectDir, canvasId) {
  const dir = join(projectDir, 'docs', 'ideas');
  if (!existsSync(dir)) return null;
  const m = String(canvasId || '').match(/^(IDEA-\d+)/i);
  let names = readdirSync(dir).filter((n) => /^IDEA-\d+.*\.md$/i.test(n) && !/-canvas\.md$/i.test(n));
  if (m) { const mine = names.filter((n) => n.toUpperCase().startsWith(m[1].toUpperCase() + '-') || n.toUpperCase() === m[1].toUpperCase() + '.md'); if (mine.length) names = mine; }
  if (!names.length) return null;
  const rank = (fm) => (String(fm.kind || '').trim().toLowerCase() === 'venture' ? 2 : 'motivation' in fm ? 1 : 0);
  const pick = names.map((n) => { const p = join(dir, n); let fm = {}; try { fm = frontmatter(readFileSync(p, 'utf8')); } catch { /* keep going */ } return { n, p, rank: rank(fm), when: Date.parse(fm.created || '') || statSync(p).mtimeMs }; })
    .sort((a, b) => b.rank - a.rank || b.when - a.when)[0];
  try {
    const text = readFileSync(pick.p, 'utf8');
    const fm = frontmatter(text);
    const title = (text.match(/^#\s+(.+)$/m) || [null, ''])[1].trim();
    const skip = (v) => { const s = String(v ?? '').trim().replace(/^"|"$/g, ''); return !s || /^(unset|none|tbd)$/i.test(s) ? '' : s; };
    return { file: pick.n, id: fm.id || null, venture: pick.rank >= 1, title, gist: skip(fm.gist), motivation: skip(fm.motivation), success: skip(fm.success_looks_like), vision: skip(fm.in_a_few_years) || skip(fm.vision), priorCapital: (() => { const v = String(fm.prior_capital ?? '').trim().replace(/^"|"$/g, ''); return !v || /^unset$/i.test(v) ? '' : v; })(), shape: section(text, 'Current shape'), created: fm.created || null };
  } catch { return null; }
}

export function readFeats(projectDir) {
  const dir = join(projectDir, 'docs', 'ideas');
  if (!existsSync(dir)) return [];
  const out = [];
  for (const n of readdirSync(dir).filter((x) => /^FEAT-\d+.*\.md$/i.test(x)).sort()) {
    try {
      const text = readFileSync(join(dir, n), 'utf8'); const fm = frontmatter(text);
      out.push({ id: fm.id || n.replace(/\.md$/, ''), gist: String(fm.gist || (text.match(/^#\s+(.+)$/m) || [null, ''])[1] || '').trim(), status: String(fm.status || '').split(/\s*[(—-]/)[0].trim(), shippedOn: fm.shipped_on || null });
    } catch { /* skip */ }
  }
  return out;
}

// docs/personas/<slug>.md — the six fields the skill writes, in whichever markup the founder used
// (`who — …`, `**who** — …`, `- **who:** …`, `who: …`), and the ledger line.
export function readPersonas(projectDir) {
  const dir = join(projectDir, 'docs', 'personas');
  if (!existsSync(dir)) return [];
  const out = [];
  for (const n of readdirSync(dir).filter((x) => /\.md$/i.test(x) && !/^README/i.test(x))) {
    try {
      const text = readFileSync(join(dir, n), 'utf8'); const fm = frontmatter(text);
      const fieldLine = (key) => { const m = text.match(new RegExp(`^(?:[-*]\\s*)?(?:\\*\\*)?${key}(?:\\*\\*)?\\s*(?:[—:–-]|\\*\\*)\\s*(.+)$`, 'im')); return m ? m[1].replace(/\*\*$/, '').trim() : ''; };
      const ledger = text.match(/synthetic\s*<?(\d+)%?>?\s*[·,]\s*real\s*<?(\d+)%?>?/i);
      const title = (text.match(/^#\s+(.+)$/m) || [null, ''])[1].trim();
      out.push({ slug: n.replace(/\.md$/i, ''), name: String(fm.name || title || n.replace(/\.md$/i, '')).replace(/^persona\s*[—:-]\s*/i, '').trim(), who: fieldLine('who'), context: fieldLine('context'), photo: readPhoto(dir, fm.photo), primary: /primary/i.test(String(fm.role || fm.kind || fm.primary || '')), created: fm.created || null, synthetic: ledger ? parseInt(ledger[1], 10) : null, real: ledger ? parseInt(ledger[2], 10) : null });
    } catch { /* skip */ }
  }
  return out.sort((a, b) => (b.primary - a.primary) || (Date.parse(a.created || '') || 0) - (Date.parse(b.created || '') || 0));
}

// docs/competition/README.md — the table as it is (any columns) + the rival files' `## Where it breaks`.
export function readCompetition(projectDir, today = Date.now()) {
  const dir = join(projectDir, 'docs', 'competition');
  const readme = join(dir, 'README.md');
  if (!existsSync(readme)) return null;
  let text = '';
  try { text = readFileSync(readme, 'utf8'); } catch { return null; }
  const lines = text.replace(/\r\n?/g, '\n').split('\n');
  const hi = lines.findIndex((l) => /^\|.*\|\s*$/.test(l) && /rival/i.test(l));
  if (hi < 0) return { columns: [], rows: [], updated: frontmatter(text).updated || null };
  const cells = (l) => l.replace(/^\||\|\s*$/g, '').split('|').map((c) => c.trim());
  const columns = cells(lines[hi]);
  const rows = [];
  for (let i = hi + 2; i < lines.length && /^\|/.test(lines[i]); i++) {
    const c = cells(lines[i]); if (c.length < 2) continue;
    const row = Object.fromEntries(columns.map((k, j) => [k, c[j] || '']));
    const rivalCell = c[0];
    const link = (rivalCell.match(/\]\(([^)]+\.md)\)/) || [null, null])[1];
    const name = stripMd(rivalCell.replace(/\]\([^)]*\)/, ']')).replace(/[[\]]/g, '').split(/\s+—\s+/)[0].trim();
    const what = row[columns.find((k) => /what it is/i.test(k)) || ''] || '';
    const sort = row[columns.find((k) => /^sort$/i.test(k)) || ''] || '';
    const checkedRaw = row[columns.find((k) => /checked/i.test(k)) || ''] || '';
    const checked = (checkedRaw.match(/\d{4}-\d{2}-\d{2}/) || [null])[0];
    const ageDays = checked ? Math.round((today - Date.parse(checked)) / 86400000) : null;
    const key = /in evidence/i.test(sort) || /^\**direct\b/i.test(stripMd(what));
    let breaks = [];
    if (link) { try { const sec = section(readFileSync(join(dir, link), 'utf8'), 'Where it breaks'); if (sec) breaks = sec.split('\n').map((l) => l.replace(/^[-*]\s+/, '').trim()).filter(Boolean).slice(0, 3); } catch { /* no file */ } }
    rows.push({ name, file: link, cells: c, key, checked, ageDays, stale: ageDays !== null && ageDays > 90, breaks, why: row[columns.find((k) => /why they might win/i.test(k)) || ''] || '' });
  }
  return { columns, rows, updated: frontmatter(text).updated || null };
}

// docs/source/ — imported material, name and date (from the filename else mtime).
export function readSources(projectDir) {
  const dir = join(projectDir, 'docs', 'source');
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter((n) => !n.startsWith('.') && !/^readme\.md$/i.test(n)).map((n) => {
    const p = join(dir, n); let st = null; try { st = statSync(p); } catch { return null; }
    const d = (n.match(/\d{4}-\d{2}-\d{2}/) || [null])[0] || (st ? isoDay(st.mtime) : null);
    return { name: n, dir: st && st.isDirectory(), date: d };
  }).filter(Boolean).sort((a, b) => String(b.date).localeCompare(String(a.date)));
}

// docs/dossier/mentor-capital.md — the first paragraph of the body, if the file exists.
// The capital mentor writes `docs/dossier/business-<date>.md` (the shipped agent's own step);
// `mentor-capital.md` is the older name. Newest by name wins.
export function readAsk(projectDir) {
  const dir = join(projectDir, 'docs', 'dossier');
  if (!existsSync(dir)) return null;
  const n = readdirSync(dir).filter((x) => /^(business|mentor-capital).*\.md$/i.test(x)).sort().pop();
  if (!n) return null;
  const p = join(dir, n);
  try {
    const text = readFileSync(p, 'utf8').replace(/\r\n?/g, '\n').replace(/^---\n[\s\S]*?\n---\n?/, '');
    const para = text.split(/\n\s*\n/).map((s) => s.trim()).find((s) => s && !/^#/.test(s) && !/^>/.test(s));
    return para ? { text: para, file: `docs/dossier/${n}`, updated: frontmatter(readFileSync(p, 'utf8')).updated || dateOf(n) || null } : null;
  } catch { return null; }
}

// One line of docs/BRAND.md's current shape, by its bold label ("What it is NOT", "What it refuses").
export function readBrandLine(projectDir, label) {
  const p = brandPath(projectDir);
  if (!p) return '';
  try {
    const m = readFileSync(p, 'utf8').match(new RegExp(`^[-*]\\s*\\*\\*${label}:?\\*\\*\\s*(.+)$`, 'im'));
    const v = m ? m[1].trim() : '';
    return !v || /^<.*>$/.test(v) || /^unknown\b/i.test(v) ? '' : v;
  } catch { return ''; }
}

// --- the projection -------------------------------------------------------------------------------

// --- the Proof records (FEAT-028) ---------------------------------------------------------------
// The first paragraph of a record's body: after the frontmatter and the title line, up to the first
// blank line. The record's own opening, never a summary of it.
export function firstParagraph(text) {
  const body = String(text).replace(/\r\n?/g, '\n').replace(/^---\n[\s\S]*?\n---\n?/, '');
  const lines = body.split('\n');
  let i = 0;
  while (i < lines.length && (!lines[i].trim() || /^#\s/.test(lines[i]))) i++;
  const out = [];
  for (; i < lines.length && lines[i].trim() && !/^#{1,6}\s/.test(lines[i]); i++) out.push(lines[i].trim());
  return out.join(' ');
}
// The section whose `## ` heading starts with `prefix` (DEC's Falsifier heading carries a question).
function sectionStartingWith(text, prefix) {
  const lines = String(text).replace(/\r\n?/g, '\n').split('\n');
  const start = lines.findIndex((l) => new RegExp(`^##\\s+${prefix}`, 'i').test(l));
  if (start < 0) return null;
  const out = [];
  for (let i = start + 1; i < lines.length; i++) { if (/^##\s/.test(lines[i])) break; out.push(lines[i]); }
  return out.join('\n').trim();
}
const dateOf = (s) => (String(s || '').match(/\d{4}-\d{2}-\d{2}/) || [null])[0];

// docs/devlog.md — `/log`'s shape: `## <date …>` then `- **Landed:**`, `- **Next:**`,
// `- **Surprises / decisions:**`. Newest first as the file keeps them; a hand-written entry with
// only a heading still renders as an entry.
export function readDevlog(projectDir, max = 8) {
  const file = join(projectDir, 'docs', 'devlog.md');
  if (!existsSync(file)) return null;
  const lines = readFileSync(file, 'utf8').replace(/\r\n?/g, '\n').split('\n');
  const entries = [];
  let cur = null;
  for (const l of lines) {
    const h = l.match(/^##\s+(.+)$/);
    if (h) { cur = { heading: h[1].trim(), landed: '', surprises: '' }; entries.push(cur); continue; }
    if (!cur) continue;
    const landed = l.match(/^\s*[-*]?\s*\*\*Landed:?\*\*:?\s*(.*)$/i);
    const sur = l.match(/^\s*[-*]?\s*\*\*Surprises[^*]*\*\*:?\s*(.*)$/i);
    if (landed) cur.landed = landed[1].trim();
    else if (sur) cur.surprises = sur[1].trim();
  }
  return { file: 'docs/devlog.md', entries: entries.filter((e) => e.heading).slice(0, max), total: entries.length };
}

// The IDEA docs' `## Capture log` bullets — `- <date> — <the thought, in their words>` — each an
// entry with the idea's id as its source. Merged with the devlog by date (Ajesh, 2026-09-13).
export function readCaptureLogs(projectDir) {
  const dir = join(projectDir, 'docs', 'ideas');
  if (!existsSync(dir)) return [];
  const out = [];
  for (const n of readdirSync(dir).filter((x) => /^IDEA-\d+.*\.md$/i.test(x) && !/-canvas\.md$/i.test(x))) {
    try {
      const text = readFileSync(join(dir, n), 'utf8'); const fm = frontmatter(text);
      const id = String(fm.id || n.replace(/\.md$/i, '')).trim();
      const log = sectionStartingWith(text, 'Capture log') || '';
      for (const l of log.split('\n')) {
        const m = l.match(/^\s*[-*]\s+(\d{4}-\d{2}-\d{2})\s*[—–-]+\s*(.+)$/);
        if (m) out.push({ heading: `${m[1]} · ${id}`, date: m[1], landed: m[2].trim(), surprises: '', source: `docs/ideas/${n}` });
      }
    } catch { /* skip */ }
  }
  return out;
}

// The story so far: devlog entries and capture-log bullets as one list, newest first, up to `max`.
export function readLearnings(projectDir, max = 8) {
  const devlog = readDevlog(projectDir, Infinity);
  const fromLog = devlog ? devlog.entries.map((e) => ({ ...e, date: dateOf(e.heading) || '', source: 'docs/devlog.md' })) : [];
  const all = [...fromLog, ...readCaptureLogs(projectDir)];
  // the devlog is newest-first on disk; a stable sort by date keeps its order inside a day
  const sorted = all.map((e, i) => [e, i]).sort((a, b) => String(b[0].date).localeCompare(String(a[0].date)) || a[1] - b[1]).map(([e]) => e);
  return { entries: sorted.slice(0, max), total: sorted.length, files: [...new Set(sorted.map((e) => e.source))] };
}

// A photo, only from a file on disk, only inlined (a copied block carries the face). Bigger than
// the cap → the name renders alone with a note. No file, no face, never a placeholder.
const PHOTO_CAP = 600 * 1024;
export function readPhoto(baseDir, ref) {
  const r = String(ref || '').trim();
  if (!r || /^unknown\b/i.test(r) || /^</.test(r)) return null;
  const file = join(baseDir, r.replace(/^\.\//, ''));
  if (!existsSync(file)) return { file: r, missing: true };
  const ext = (file.match(/\.([a-z0-9]+)$/i) || [null, ''])[1].toLowerCase();
  const mime = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', gif: 'image/gif', svg: 'image/svg+xml' }[ext];
  if (!mime) return { file: r, unsupported: true };
  try {
    const st = statSync(file);
    if (st.size > PHOTO_CAP) return { file: r, tooBig: true, kb: Math.round(st.size / 1024) };
    return { file: r, dataUri: `data:${mime};base64,${readFileSync(file).toString('base64')}` };
  } catch { return null; }
}

// docs/team/<slug>.md — a person, in their own words: the three sections, a role, a photo by choice.
const ROLES = ['founder', 'cofounder', 'team', 'advisor', 'missing'];   // `missing` = a role you need and don't have, written plainly
export function readTeam(projectDir) {
  const dir = join(projectDir, 'docs', 'team');
  if (!existsSync(dir)) return null;
  const out = [];
  for (const n of readdirSync(dir).filter((x) => /\.md$/i.test(x) && !/^README/i.test(x))) {
    try {
      const text = readFileSync(join(dir, n), 'utf8'); const fm = frontmatter(text);
      const title = (text.match(/^#\s+(.+)$/m) || [null, ''])[1].trim();
      // a stub's `<placeholders>` are not the person's words — a line that is only a placeholder is dropped
      const sec = (h) => (sectionStartingWith(text, h) || '').split('\n').filter((l) => l.trim() && !/^(?:[-*]\s*)?(?:\*\*[^*]+\*\*\s*)?<[^>]*>\s*$/.test(l.trim())).join('\n').trim();
      const role = String(fm.role || '').trim().toLowerCase().split(/\s/)[0];
      out.push({ slug: n.replace(/\.md$/i, ''), name: String(fm.name || title.split(/\s+[—–-]\s+/)[0] || n.replace(/\.md$/i, '')).trim(), handle: String(fm.handle || '').replace(/^"|"$/g, ''),
        role: ROLES.includes(role) ? role : 'team', thing: sec('The specific thing'), brings: sec('What they bring'), bio: sec('Bio'), photo: readPhoto(dir, fm.photo) });
    } catch { /* skip */ }
  }
  return out.sort((a, b) => ROLES.indexOf(a.role) - ROLES.indexOf(b.role) || a.name.localeCompare(b.name));
}

// docs/BRAND.md as a record: the current-shape lines as they are (unknown stays unknown), the
// `## How we build` values, the learned table as a count and dates — never a row's words.
export function readBrandDoc(projectDir) {
  const p = join(projectDir, 'docs', 'BRAND.md');
  if (!existsSync(p)) return null;
  let text; try { text = readFileSync(p, 'utf8'); } catch { return null; }
  const fm = frontmatter(text);
  const shape = (section(text, 'Current shape') || '').split('\n').map((l) => l.match(/^[-*]\s*\*\*([^*]+?):?\*\*\s*(.*)$/)).filter(Boolean)
    .map((m) => ({ label: m[1].trim(), value: /^<.*>$/.test(m[2].trim()) || /^unknown\b/i.test(m[2].trim()) ? '' : m[2].trim() }));
  const values = (sectionStartingWith(text, 'How we build') || '').split('\n').map((l) => l.match(/^[-*]\s*\*\*([^*]+?)\*\*\s*[—–:-]\s*(.*)$/)).filter(Boolean)
    .map((m) => { const rest = m[2].trim(); const c = rest.match(/\*Costs?:\*\s*(.*)$/i); return { headline: m[1].trim(), meaning: (c ? rest.slice(0, c.index) : rest).trim(), cost: c ? c[1].replace(/\*$/, '').trim() : '' }; })
    .filter((v) => !/^<.*>$/.test(v.headline));
  const learned = (sectionStartingWith(text, "What we've learned") || '').split('\n').filter((l) => /^\|\s*\d{4}-\d{2}-\d{2}/.test(l)).map((l) => (l.match(/\d{4}-\d{2}-\d{2}/) || [''])[0]);
  const logo = readPhoto(join(projectDir, 'docs'), fm.logo);
  return { file: 'docs/BRAND.md', updated: dateOf(fm.updated), status: String(fm.status || '').trim(), shape, values, learned: { count: learned.length, newest: learned.sort().pop() || null }, logo };
}

// docs/decisions/DEC-*.md — `/decide`'s record: the title line, the frontmatter chips, the Decision
// paragraph, the Falsifier's first sentence. `supersedes:` on a later DEC marks the earlier one.
export function readDecisions(projectDir, today = Date.now()) {
  const dir = join(projectDir, 'docs', 'decisions');
  if (!existsSync(dir)) return [];
  const out = [];
  for (const n of readdirSync(dir).filter((x) => /^DEC-\d+.*\.md$/i.test(x)).sort()) {
    try {
      const text = readFileSync(join(dir, n), 'utf8'); const fm = frontmatter(text);
      const id = String(fm.id || n.replace(/\.md$/i, '')).trim();
      const h1 = (text.match(/^#\s+(.+)$/m) || [null, ''])[1].replace(/^DEC-\d+\s*[—–-]\s*/i, '').trim();
      const decision = firstParagraph('\n' + (section(text, 'Decision') || ''));
      const falsifier = firstSentence(sectionStartingWith(text, 'Falsifier') || '');
      const revisitBy = dateOf(fm.revisit_by);
      const overdue = !!revisitBy && !fm.outcome && Date.parse(revisitBy) < today;
      out.push({ id, file: n, title: stripMd(h1), created: dateOf(fm.created), reversibility: String(fm.reversibility || '').trim().split(/\s/)[0], decidedBy: String(fm.decided_by || '').trim(), status: String(fm.status || '').trim(),
        decision, falsifier, revisitBy, outcome: fm.outcome ? String(fm.outcome).trim() : '', overdue, supersedes: (String(fm.supersedes || '').match(/DEC-\d+/i) || [null])[0], supersededBy: null });
    } catch { /* skip */ }
  }
  for (const d of out) if (d.supersedes) { const t = out.find((x) => x.id.toLowerCase() === d.supersedes.toLowerCase()); if (t) t.supersededBy = d.id; }
  return out.sort((a, b) => String(b.created || '').localeCompare(String(a.created || '')));
}

// docs/trust/TRUST.md — the honest paragraph `/trust` stubs; its first paragraph, dated by mtime.
export function readTrust(projectDir) {
  const file = join(projectDir, 'docs', 'trust', 'TRUST.md');
  if (!existsSync(file)) return null;
  try { const text = readFileSync(file, 'utf8'); return { file: 'docs/trust/TRUST.md', text: firstParagraph(text), updated: isoDay(statSync(file).mtime) }; } catch { return null; }
}

// docs/health/HEALTH-<date>.md and docs/measure/MEASURE-<date>.md — the newest of each, its date
// from the filename, its first paragraph. Nothing is computed from either.
export function readHealth(projectDir) {
  const one = (sub, prefix) => {
    const dir = join(projectDir, 'docs', sub);
    if (!existsSync(dir)) return null;
    const n = readdirSync(dir).filter((x) => new RegExp(`^${prefix}-.*\\.md$`, 'i').test(x)).sort().pop();
    if (!n) return null;
    try { return { file: `docs/${sub}/${n}`, date: dateOf(n), text: firstParagraph(readFileSync(join(dir, n), 'utf8')) }; } catch { return null; }
  };
  return { health: one('health', 'HEALTH'), measure: one('measure', 'MEASURE') };
}

export function collectPlaybook(projectDir, projectName) {
  const found = findCanvas(projectDir);
  let parsed = { cells: [], updated: null, id: null };
  let error = null;
  if (found) {
    try {
      parsed = parseCanvas(readFileSync(found.path, 'utf8'));
      if (!parsed.cells.length) error = `${found.name}: no \`| **Cell** | Answer |\` rows found — is this the shape /canvas writes?`;
    } catch (e) { error = `${found.name}: ${e.message}`; }
  }
  const evidence = readEvidence(projectDir);
  const byName = new Map(parsed.cells.map((c) => [norm(c.name), c]));
  const boxes = [];
  for (const reg of CELLS) {
    const c = byName.get(norm(reg.name));
    byName.delete(norm(reg.name));
    const answer = c ? c.answer : '';
    const state = c ? (c.condition && cellState(answer) === 'hole' ? 'dormant' : cellState(answer)) : 'hole';
    const words = norm(reg.name).split(' ');
    const hits = evidence.filter((e) => e.names && words.some((w) => w.length > 3 && e.names.split(' ').includes(w)));
    const top = hits.map((e) => GRADES.indexOf(e.grade)).filter((i) => i >= 0).sort((a, b) => b - a)[0];
    boxes.push({
      ...reg, answer, state, condition: c ? c.condition : '',
      evidence: hits.length, topGrade: top === undefined ? null : GRADES[top], known: true,
    });
  }
  // Cells the founder added that the registry doesn't know: kept, in their band, marked so.
  for (const c of byName.values()) {
    boxes.push({ key: 'x-' + norm(c.name).replace(/ /g, '-'), name: c.name, band: c.band || 3, prompt: '', answer: c.answer,
      state: cellState(c.answer), condition: c.condition, evidence: 0, topGrade: null, known: false });
  }
  const live = boxes.filter((b) => b.state !== 'dormant');
  const backed = boxes.filter((b) => b.evidence > 0).length;
  const dates = evidence.map((e) => Date.parse(e.date || '')).filter((d) => !Number.isNaN(d));
  const newestDays = dates.length ? Math.max(0, Math.round((Date.now() - Math.max(...dates)) / 86400000)) : null;
  const gradeCounts = Object.fromEntries(GRADES.map((g) => [g, evidence.filter((e) => e.grade === g).length]));
  const topOverall = [...GRADES].reverse().find((g) => gradeCounts[g] > 0) || null;
  const idea = readIdea(projectDir, parsed.id);
  const cell = (key) => boxes.find((b) => b.key === key) || null;
  return {
    projectName, projectDir,
    canvas: found ? { file: found.name, updated: parsed.updated, others: found.others } : null,
    error, boxes, cell,
    ledger: { backed, live: live.length, signals: evidence.length, gradeCounts, topOverall, newestDays },
    brand: readBrand(projectDir, projectName),
    // slice 2 (FEAT-027) — each null/empty renders as a hole, never invented
    idea, feats: readFeats(projectDir), personas: readPersonas(projectDir),
    competition: readCompetition(projectDir), sources: readSources(projectDir), ask: readAsk(projectDir),
    brandNot: readBrandLine(projectDir, 'What it is NOT'),
    designExists: existsSync(join(projectDir, '.boss', 'design.html')),
    // slice 3 (FEAT-028) — the Proof records; `evidence` above already carries the rows
    evidenceRows: evidence, devlog: readLearnings(projectDir), decisions: readDecisions(projectDir),
    trust: readTrust(projectDir), health: readHealth(projectDir),
    // slice 4 (FEAT-036) — the Company records
    team: readTeam(projectDir), brandDoc: readBrandDoc(projectDir),
  };
}

// --- rendering ----------------------------------------------------------------------------------

// Inline markdown → HTML, the small subset a canvas cell uses. Everything is escaped first; the
// founder's words survive, the founder's markup renders, nothing else is interpreted.
export function inline(md) {
  let s = esc(md);
  s = s.replace(/\[\[([^\]]+)\]\]/g, '$1');
  s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, t, u) => /^https?:\/\//.test(u) ? `<a href="${u}">${t}</a>` : t);
  s = s.replace(/`([^`]+)`/g, '<code>$1</code>');
  s = s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g, '$1<em>$2</em>');
  s = s.replace(/(^|[^_])_([^_\n]+)_(?!_)/g, '$1<em>$2</em>');
  s = s.replace(/&lt;br\s*\/?&gt;/gi, '<br>');
  return s;
}

function chipFor(b) {
  if (b.state === 'hole' || b.state === 'dormant') return '';
  if (b.evidence > 0) return `<span class="chip ev">EVID ×${b.evidence} · ${esc(b.topGrade || 'graded')}</span>`;
  return '<span class="chip asserted">asserted</span>';
}

function boxHtml(b, canvas) {
  const src = canvas ? `canvas · ${esc(b.name)}${canvas.updated ? ` · rev. ${esc(canvas.updated)}` : ''}` : `canvas · ${esc(b.name)} · no canvas yet`;
  const title = `<h3><span class="t-humane">${esc(b.name)}</span>${b.lean ? `<span class="t-lean">${esc(b.lean)}</span>` : ''}${b.bmc ? `<span class="t-bmc">${esc(b.bmc)}</span>` : ''}</h3>`;
  const area = (b.area || b.bmcArea) ? ` style="${b.area ? `--area:${b.area};` : ''}${b.bmcArea ? `--bmc-area:${b.bmcArea};` : ''}"` : '';
  const cls = `block ${b.state}${b.floor ? ' floor' : ''}${b.lean ? '' : ' humane-only'}${b.bmc ? '' : ' no-bmc'}${b.known ? '' : ' extra'}`;
  let body;
  if (b.state === 'hole') {
    body = `<p class="prompt">${esc(b.prompt || 'No prompt on file for this cell.')}</p><span class="verb">not yet · /canvas fills it</span>`;
  } else if (b.state === 'dormant') {
    body = `<p class="prompt">${esc(b.prompt)}</p><span class="cond">dormant — ${esc(b.condition || b.answer.replace(/^_\(|\)_$/g, ''))}</span>`;
  } else {
    body = (b.prompt ? `<p class="prompt">${esc(b.prompt)}</p>` : '') + `<div class="answer">${inline(b.answer)}</div>`;
  }
  return `<article class="${cls}" id="canvas-${esc(b.key)}" data-cell="${esc(b.key)}" data-title="${esc(b.name)}"${area}>
  <div class="head">${title}</div>
  <div class="body">${body}</div>
  <div class="foot">${chipFor(b)}<span class="src">${src}</span></div>
  <div class="actions"></div>
</article>`;
}

// --- chapters (FEAT-027) ------------------------------------------------------------------------
// A generic block. `state` filled | hole | dormant; a hole carries a prompt and a verb, never prose.
function block({ id, title, sub = '', body = '', chip = '', src = '', state = 'filled', cls = '' }) {
  return `<article class="block ${state}${cls ? ' ' + cls : ''}" id="${esc(id)}" data-title="${esc(title)}">
  <div class="head"><h3>${esc(title)}${sub ? ` <span class="sub">— ${esc(sub)}</span>` : ''}</h3></div>
  <div class="body">${body}</div>
  <div class="foot">${chip}<span class="src">${src}</span></div>
  <div class="actions"></div>
</article>`;
}
// Every chapter hole is also recorded, so the terminal can read the page's questions back (IDEA-111).
let holeLog = null, holeDir = null;
const hole = (id, title, prompt, verb, src, sub = '') => {
  if (holeLog) holeLog.push({ id, title, prompt, verb, src });
  return block({ id, title, sub, state: 'hole', body: `<p class="prompt">${esc(prompt)}</p><span class="verb">not yet · ${esc(verbLine(verb, holeDir))}</span>`, src: esc(src) });
};
const cellBlock = (b, canvas, id, title, sub = '') => {
  // a dormant cell is a condition, not a question — the chapter says so the way the canvas grid does
  if (b && b.state === 'dormant') return block({ id, title, sub, state: 'dormant', body: `<p class="prompt">${esc(b.prompt)}</p><span class="cond">dormant — ${esc(b.condition || b.answer.replace(/^_\(|\)_$/g, ''))}</span>`, src: `canvas · ${esc(b.name)}` });
  if (!b || b.state !== 'filled') return hole(id, title, (b && b.prompt) || '', '/canvas', `canvas · ${(b && b.name) || title}`, sub);
  const srcLine = `canvas · ${esc(b.name)}${canvas && canvas.updated ? ` · rev. ${esc(canvas.updated)}` : ''}`;
  return block({ id, title, sub, body: `<div class="answer">${inline(b.answer)}</div>`, chip: chipFor(b), src: srcLine });
};
const chapterHead = (n, label, line, lead = '') =>
  `<div class="chapter-head"><div class="label">${n} · ${esc(label)}</div>${line ? `<h2>${esc(line)}</h2>` : ''}${lead ? `<p>${lead}</p>` : ''}</div>`;
const chapter = (id, headHtml, inner) => `<section class="chapter" id="${id}">${headHtml}${inner}</section>`;
const slug = (s) => norm(s).replace(/ /g, '-');

function pitchChapters(data) {
  const { canvas, cell, idea, feats, personas, competition, sources, ask, brandNot, designExists } = data;
  const people = (data.team || []).filter((p) => p.role !== 'missing');
  const out = [];
  const line = (b) => (b && b.state === 'filled' ? firstSentence(b.answer) : '');

  // 1 · Vision — the Promise is the line; the founder's why; principles; two holes the records can't fill.
  const ideaSrc = idea ? `docs/ideas/${esc(idea.file)}` : 'docs/ideas — no IDEA doc';
  // The venture fields live on the `kind: venture` record, which /boss writes; /idea asks nothing by
  // its own rule. So a hole on those fields points at /boss until the venture record exists, and at
  // /idea (edit the record you have) only after — never at the verb that would not ask (IDEA-118).
  const venture = Boolean(idea && idea.venture);
  const ideaVerb = venture ? '/idea' : '/boss <your idea>';
  out.push(chapter('vision', chapterHead(1, 'Vision', line(cell('promises'))),
    '<div class="blocks">'
    + (idea && (idea.motivation || idea.success)
      ? block({ id: 'vision-why', title: 'Why this, and what "it worked" looks like', body: (idea.motivation ? `<p><strong>Motivation:</strong> ${inline(idea.motivation)}</p>` : '') + (idea.success ? `<p><strong>Success looks like:</strong> ${inline(idea.success)}</p>` : ''), chip: '<span class="chip asserted">asserted</span>', src: `${ideaSrc} · motivation · success_looks_like` })
      : hole('vision-why', 'Why this, and what "it worked" looks like', 'Why are you building this, and what does success look like in three months? Two lines on the IDEA doc.', ideaVerb, ideaSrc))
    + cellBlock(cell('principles'), canvas, 'vision-principles', 'Principles', 'what we\'ll hold when it\'s costly')
    + (people.length
      ? block({ id: 'vision-team', title: 'Who is building it', body: people.map((p) => `<p><strong>${esc(p.name)}</strong> <span class="sub">${esc(p.role)}</span>${p.thing ? ` — ${inline(firstSentence(p.thing))}` : ''}</p>`).join('') + '<p class="xlink"><a href="#team">the team, in full →</a></p>', chip: '<span class="chip asserted">asserted</span>', src: `docs/team · ${people.length} ${people.length === 1 ? 'person' : 'people'}` })
      : hole('vision-team', 'Who is building it', 'Who is building it, and what makes that believable to a stranger — the specific thing seen, built, sold or lived, not a CV?', 'write docs/team/<you>.md — the README there has the shape', 'docs/team — none'))
    + (idea && idea.vision ? block({ id: 'vision-few-years', title: 'In a few years', body: `<p>${inline(idea.vision)}</p>`, chip: '<span class="chip asserted">asserted</span>', src: `${ideaSrc} · in_a_few_years` })
      : hole('vision-few-years', 'In a few years', 'If this works, what\'s here in a few years? One line, yours — not a forecast.', venture ? 'add in_a_few_years: to the IDEA doc — /canvas asks it' : ideaVerb, `${ideaSrc} · no in_a_few_years line`))
    + '</div>'));

  // 2 · Product — the IDEA doc's current shape, whole; the FEATs; what it is not.
  const shapeLine = idea && idea.shape ? firstSentence(idea.shape.split('\n').filter((l) => !/^_.*_$/.test(l.trim())).join('\n')) : '';
  const featList = feats.length
    ? block({ id: 'product-feats', title: 'What has shipped', sub: 'and what is being built', body: `<ul>${feats.map((f) => `<li><strong>${esc(f.id)}</strong> · ${inline(f.gist)} — <em>${esc(f.status || 'unknown')}</em>${f.shippedOn ? ` · ${esc(f.shippedOn)}` : ''}</li>`).join('')}</ul>`, chip: `<span class="chip ev">${feats.length} FEAT${feats.length === 1 ? '' : 's'} · ${feats.filter((f) => /^shipped/i.test(f.status)).length} shipped</span>`, src: 'docs/ideas/FEAT-*.md · boss board' })
    : hole('product-feats', 'What has shipped', 'Nothing has a build contract yet. The first FEAT is where "we should build this" becomes "here is how we\'ll know it\'s done."', '/spec', 'docs/ideas/FEAT-*.md — none');
  out.push(chapter('product', chapterHead(2, 'Product', shapeLine),
    '<div class="blocks">'
    + (idea && idea.shape ? block({ id: 'product-shape', title: 'What it is today', sub: 'the current shape, in the founder\'s words', body: blockMd(idea.shape), chip: '<span class="chip asserted">asserted</span>', src: `${ideaSrc} · ## Current shape${idea.created ? ` · since ${esc(idea.created)}` : ''}` })
      : hole('product-shape', 'What it is today', 'What is it, who is it for, and what is the smallest version that proves it? The IDEA doc\'s current shape.', ideaVerb, ideaSrc))
    + featList
    + (brandNot ? block({ id: 'product-not', title: 'What it is not', body: `<p>${inline(brandNot)}</p>`, chip: '<span class="chip asserted">asserted</span>', src: 'docs/BRAND.md · What it is NOT' })
      : hole('product-not', 'What it is not', 'The nearest thing people will mistake it for — and what it refuses to be.', '/landing seeds docs/BRAND.md', 'docs/BRAND.md · What it is NOT'))
    + '</div>'));

  // 3 · Customers — snippets; the full card is the Design space's (IDEA-107).
  const primary = personas[0] || null;
  const snippet = (p, i) => {
    const led = p.synthetic === null ? '<span class="chip asserted">no ledger line</span>' : `<span class="chip synthetic">synthetic ${p.synthetic}% · real ${p.real}%</span>`;
    const link = designExists ? `<a class="xlink" href="design.html#persona-${esc(p.slug)}">the full card, in Design →</a>` : '<span class="xlink dim">the full card lives in the Design space — not rendered yet</span>';
    return block({ id: `persona-${esc(p.slug)}`, title: p.name, sub: i === 0 ? 'primary' : 'secondary', cls: 'snippet', body: `${face(p.photo, p.name)}<p class="who">${p.who ? inline(p.who) : '<em class="hole-text">no who line</em>'}</p>${p.context ? `<p>${inline(p.context)}</p>` : ''}<p>${link}</p>`, chip: led, src: `docs/personas/${esc(p.slug)}.md` });
  };
  out.push(chapter('customers', chapterHead(3, 'Customers', primary && primary.who ? firstSentence(primary.who) : line(cell('people'))),
    '<div class="blocks">'
    + (personas.length ? personas.map(snippet).join('') : hole('persona-none', 'Who, exactly', 'One primary target user — who, when they\'d reach for this, what they\'re trying to get done, what\'s hard today, what would make them trust or abandon it, and what you don\'t know yet.', '/persona derive', 'docs/personas — none'))
    + '</div>'));

  // 4 · Problem — the cell, and the Story cell (why-now is inside it; the render never splits a cell).
  out.push(chapter('problem', chapterHead(4, 'Problem', line(cell('problem'))),
    '<div class="blocks">' + cellBlock(cell('problem'), canvas, 'problem-cell', 'The problem') + cellBlock(cell('story'), canvas, 'problem-story', 'Story — and why now', 'what changed that makes this newly possible') + '</div>'));

  // 5 · Market — the count and how you know; what you imported. No arithmetic.
  const srcList = sources.length
    ? block({ id: 'market-sources', title: 'Research you\'ve imported', sub: `${sources.length} item${sources.length === 1 ? '' : 's'} in docs/source/`, body: `<ul>${sources.map((f) => `<li>${esc(f.name)}${f.dir ? '/' : ''}${f.date ? ` <span class="date">${esc(f.date)}</span>` : ''}</li>`).join('')}</ul>`, chip: '<span class="chip asserted">imported · not read here</span>', src: 'docs/source/ · /import' })
    : hole('market-sources', 'Research you\'ve imported', 'A market report, a regulator\'s figures, a survey — imported material lands here with its date.', '/import <file or url>', 'docs/source — empty');
  out.push(chapter('market', chapterHead(5, 'Market', line(cell('people'))),
    '<div class="blocks">' + cellBlock(cell('people'), canvas, 'market-people', 'How many, and how do you know', 'the People cell') + srcList + '</div>'));

  // 6 · Competition — the table as it is; key rivals with where they break; the watch list.
  let compInner;
  if (!competition) {
    compInner = `<div class="blocks">${hole('competition-none', 'Who else fixes it', 'Who else sells a fix — including the spreadsheet, the agency, the intern and doing nothing — and for each real one, why they might win?', '/comp-eval', 'docs/competition — none')}</div>`;
  } else {
    const rows = competition.rows;
    const table = `<div class="tscroll"><table class="rivals"><thead><tr>${competition.columns.map((c) => `<th>${esc(c)}</th>`).join('')}</tr></thead><tbody>${rows.map((r) => `<tr>${r.cells.map((c, j) => `<td>${inline(c)}${j === r.cells.length - 1 && r.stale ? ` <span class="chip stale">stale · ${r.ageDays} d</span>` : ''}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
    const keys = rows.filter((r) => r.key), watch = rows.filter((r) => !r.key);
    compInner = `<div class="blocks one">${block({ id: 'competition-table', title: 'Who else fixes it', sub: 'docs/competition/README.md', body: table, chip: `<span class="chip ev">${rows.length} on the field · ${keys.length} key · ${rows.filter((r) => r.stale).length} stale</span>`, src: `docs/competition/README.md${competition.updated ? ` · updated ${esc(String(competition.updated).slice(0, 10))}` : ''}` })}</div>`
      + (keys.length ? `<div class="tier-title"><h3>Key rivals</h3><span>direct, or named by a real person in evidence</span></div><div class="blocks">${keys.map((r) => block({ id: `rival-${esc(slug(r.name))}`, title: r.name, sub: 'key', cls: 'rival', body: (r.why ? `<p class="win-line">They might win because ${inline(r.why)}</p>` : '') + (r.breaks.length ? `<p><strong>Where it breaks:</strong></p><ul>${r.breaks.map((b) => `<li>${inline(b)}</li>`).join('')}</ul>` : `<p class="helper">no <code>## Where it breaks</code> in ${r.file ? esc(r.file) : 'its file'} yet</p>`), chip: r.stale ? `<span class="chip stale">stale · checked ${r.ageDays} days ago</span>` : `<span class="chip ev">checked ${esc(r.checked || '—')}</span>`, src: `docs/competition/${esc(r.file || 'README.md')}` })).join('')}</div>` : '')
      + (watch.length ? `<div class="tier-title"><h3>Also on the field</h3><span>watch — real, filed, not yet in anyone's mouth · one line each</span></div><div class="blocks one">${block({ id: 'competition-watch', title: 'Watch list', body: `<ul>${watch.map((r) => `<li><strong>${esc(r.name)}</strong>${r.why ? ` — ${inline(r.why)}` : ''}${r.stale ? ` <span class="chip stale">stale · ${r.ageDays} d</span>` : ''}</li>`).join('')}</ul>`, chip: `<span class="chip asserted">${watch.length} on watch</span>`, src: 'docs/competition/README.md · watch rows' })}</div>` : '');
  }
  const compLine = competition && competition.rows.length ? `${competition.rows.length} on the field; ${competition.rows.filter((r) => r.key).length} of them key.` : '';
  out.push(chapter('competition', chapterHead(6, 'Competition', compLine), compInner));

  // 7 · Canvas is assembled in renderPlaybookHtml (FEAT-026). 8 · Business model — two cells and the ask.
  const askBlock = ask
    ? block({ id: 'model-ask', title: 'The ask', sub: 'the capital mentor\'s read', state: 'hole', body: `<p class="prompt">${inline(ask.text)}</p><span class="verb">${esc(ask.file)}${ask.updated ? ` · ${esc(String(ask.updated).slice(0, 10))}` : ''}</span>`, src: 'docs/dossier/mentor-capital.md' })
    : hole('model-ask', 'The ask', 'Round, use of funds, the milestones the money buys — open only when the capital mentor says the raise question is live.', '/consult · mentor-capital', 'docs/dossier/business-<date>.md — none');
  const capitalBlock = idea && idea.priorCapital
    ? block({ id: 'model-capital', title: 'Prior capital and ownership', body: `<p>${inline(idea.priorCapital)}</p>`, chip: '<span class="chip asserted">asserted</span>', src: `${ideaSrc} · prior_capital` })
    : hole('model-capital', 'Prior capital and ownership', 'Has anyone put money in, and are you the sole owner? none, a sentence, or see lawyer — the first fact an investor asks, never a cap table.', 'add prior_capital: to the IDEA doc — /canvas asks it on the earning branch', `${ideaSrc} · no prior_capital line`);
  out.push(chapter('model', chapterHead(8, 'Business model', line(cell('bizmodel'))),
    '<div class="blocks">' + cellBlock(cell('bizmodel'), canvas, 'model-revenue', 'Who pays, how much') + cellBlock(cell('cost'), canvas, 'model-cost', 'What it costs to serve') + capitalBlock + askBlock + '</div>'));

  return { before: out.slice(0, 6).join('\n'), after: out.slice(6).join('\n') };
}

// --- the Proof chapters (FEAT-028) --------------------------------------------------------------
// What backs the pitch: the ladder, the story so far, the decisions, the harms, the health read.
// Every line is a record's own; the only numbers are counts.
const gradeChip = (g) => `<span class="chip ${g === 'commitment' ? 'ev' : g === 'observed-behavior' ? 'ev' : 'asserted'}">${esc(g || 'ungraded')}</span>`;
function proofChapters(data) {
  const { canvas, cell, evidenceRows, devlog, decisions, trust, health } = data;
  const out = [];
  const empty = {};

  // 9 · Evidence — the ladder. Rows, never bodies; the strip counts the grades.
  const rows = [...evidenceRows].sort((a, b) => (GRADES.indexOf(b.grade) - GRADES.indexOf(a.grade)) || String(b.date || '').localeCompare(String(a.date || '')));
  const newest = [...evidenceRows].sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')))[0];
  const counts = GRADES.map((g) => [g, evidenceRows.filter((e) => e.grade === g).length]);
  const maxC = Math.max(1, ...counts.map(([, n]) => n));
  const strip = `<div class="ladder" aria-label="Signals by grade">${[...counts].reverse().map(([g, n]) => `<div class="rung"><span class="g">${esc(g)}</span><span class="bar"><i style="width:${Math.round((n / maxC) * 100)}%"></i></span><b class="tab">${n}</b></div>`).join('')}</div>`;
  const evTable = rows.length ? `<div class="tscroll"><table class="t ev"><thead><tr><th>Grade</th><th>Date</th><th>Signal</th><th>Method</th><th>Bears on</th><th>Record</th></tr></thead><tbody>${rows.map((e) => `<tr id="${esc(slug(e.id))}"><td>${gradeChip(e.grade)}</td><td class="mono">${esc(e.date || 'undated')}</td><td>${esc(e.title || '—')}</td><td class="mono">${esc(e.method || '—')}</td><td class="t-small">${esc(e.assumption || '—')}</td><td class="mono">${esc(e.id)}</td></tr>`).join('')}</tbody></table></div>` : '';
  empty.evidence = !rows.length;
  out.push(chapter('evidence', chapterHead(9, 'Evidence', newest ? newest.title : ''),
    rows.length
      ? `<div class="blocks one">${block({ id: 'evidence-ladder', title: 'The ladder', sub: `${rows.length} signal${rows.length === 1 ? '' : 's'}, graded — the grade is the founder's, the count is the file's`, body: strip + evTable, src: `docs/evidence · ${rows.length} record${rows.length === 1 ? '' : 's'} · bodies stay in the files` })}</div>`
      : `<div class="blocks">${hole('evidence-none', 'What backs this', 'Nothing graded yet. The first signal is a conversation written down honestly — what they said, what they did, what they committed to — and graded on the ladder.', '/evidence', 'docs/evidence — none')}</div>`));

  // 10 · Learnings — the devlog's own lines, newest first.
  const entries = devlog ? devlog.entries : [];
  empty.learnings = !entries.length;
  const entryBlock = (e, i) => block({ id: `learn-${i + 1}`, title: e.heading, body: (e.landed ? `<p>${e.source === 'docs/devlog.md' ? '<strong>Landed:</strong> ' : ''}${inline(e.landed)}</p>` : '') + (e.surprises ? `<p><strong>Surprises / decisions:</strong> ${inline(e.surprises)}</p>` : '') || '<p class="helper">an entry with only a heading</p>', src: `${esc(e.source)} · ${esc(e.date || e.heading.slice(0, 10))}` });
  out.push(chapter('learnings', chapterHead(10, 'Learnings', entries[0] && entries[0].landed ? firstSentence(entries[0].landed) : ''),
    entries.length
      ? `<div class="blocks">${entries.map(entryBlock).join('')}</div>${devlog.total > entries.length ? `<p class="more">${devlog.total - entries.length} earlier entr${devlog.total - entries.length === 1 ? 'y' : 'ies'} in ${esc(devlog.files.join(' · '))}</p>` : ''}`
      : `<div class="blocks">${hole('learnings-none', 'The story so far', 'What landed, what surprised you, what you decided — one entry a session, in your words; the idea\'s capture log counts too. Nothing logged yet.', '/log', 'docs/devlog.md · docs/ideas capture logs — none')}</div>`));

  // 11 · Decisions — cards with their falsifiers; superseded ones dimmed, overdue ones said so.
  empty.decisions = !decisions.length;
  const decBlock = (d) => block({ id: slug(d.id), title: d.title || d.id, sub: d.id, cls: d.supersededBy ? 'superseded' : '',
    body: (d.decision ? `<p>${inline(d.decision)}</p>` : '<p class="helper">no ## Decision section</p>')
      + (d.falsifier ? `<p class="fals"><strong>Falsifier —</strong> ${inline(d.falsifier)}${d.revisitBy ? ` <span class="date">by ${esc(d.revisitBy)}</span>` : ''}</p>` : '')
      + (d.supersededBy ? `<p class="helper">superseded by ${esc(d.supersededBy)}</p>` : ''),
    chip: [d.reversibility ? `<span class="chip dec">${esc(d.reversibility)}</span>` : '', d.decidedBy ? `<span class="chip asserted">${esc(d.decidedBy)}</span>` : '', d.overdue ? `<span class="chip bad">overdue · revisit ${esc(d.revisitBy)}</span>` : '', d.outcome ? `<span class="chip ev">outcome recorded</span>` : ''].join(''),
    src: `docs/decisions/${esc(d.file)}${d.created ? ` · ${esc(d.created)}` : ''}` });
  const live = decisions.filter((d) => !d.supersededBy), old = decisions.filter((d) => d.supersededBy);
  out.push(chapter('decisions', chapterHead(11, 'Decisions', live[0] && live[0].decision ? firstSentence(live[0].decision) : ''),
    decisions.length
      ? `<div class="blocks">${live.map(decBlock).join('')}${old.map(decBlock).join('')}</div>`
      : `<div class="blocks">${hole('decisions-none', 'What you decided, and what would prove it wrong', 'A decision with its context, its reasoning, and the cheapest signal it was wrong — by when. None recorded yet.', '/decide', 'docs/decisions — none')}</div>`));

  // 12 · Risks & harms — the floor cell, and the trust page.
  const risks = cell('risks');
  const trustBlock = trust
    ? block({ id: 'risks-trust', title: 'Trust', sub: 'what you collect, in plain terms', body: `<p>${inline(trust.text)}</p>`, chip: '<span class="chip asserted">asserted</span>', src: `${esc(trust.file)} · ${esc(trust.updated)}` })
    : hole('risks-trust', 'Trust', 'What you collect, who processes it, how someone reaches you about their data — one honest paragraph a user or a buyer can read.', '/trust', 'docs/trust/TRUST.md — none');
  empty.risks = !(risks && risks.state === 'filled') && !trust;
  out.push(chapter('risks', chapterHead(12, 'Risks & harms', risks && risks.state === 'filled' ? firstSentence(risks.answer) : ''),
    `<div class="blocks">${cellBlock(risks, canvas, 'risks-harms', 'Who could this harm, and how')}${trustBlock}</div>`));

  // 13 · Health — dormant until there is something to read; then the files' own paragraphs.
  const h = health || {};
  const healthBlocks = [
    h.health ? block({ id: 'health-read', title: 'The health read', sub: h.health.date || '', body: `<p>${inline(h.health.text)}</p>`, chip: '<span class="chip asserted">a verdict, dated</span>', src: esc(h.health.file) }) : '',
    h.measure ? block({ id: 'health-measure', title: 'What is measured', sub: h.measure.date || '', body: `<p>${inline(h.measure.text)}</p>`, chip: '<span class="chip asserted">asserted</span>', src: esc(h.measure.file) }) : '',
  ].join('');
  out.push(chapter('health', chapterHead(13, 'Health', h.health && h.health.text ? firstSentence(h.health.text) : ''),
    healthBlocks
      ? `<div class="blocks">${healthBlocks}</div>`
      : `<div class="blocks">${block({ id: 'health-dormant', title: 'How it is going', state: 'dormant', body: '<p class="prompt">Acquisition, activation, retention — and the day each starts to mean something.</p><span class="cond">dormant — live once there are users to read: /measure picks the metric, /health reads the curve</span>', src: 'docs/health · docs/measure — none yet' })}</div>`));

  return { html: out.join('\n'), empty };
}

// --- the Company chapters (FEAT-036) ------------------------------------------------------------
// Who is building it and how they work. A face only from a file; a value only from the brand doc.
function face(photo, name) {
  if (!photo) return '';
  if (photo.dataUri) return `<img class="face" src="${photo.dataUri}" alt="${esc(name)}">`;
  const why = photo.missing ? `photo: ${esc(photo.file)} — not found` : photo.tooBig ? `photo: ${esc(photo.file)} — ${photo.kb} KB, over the ${PHOTO_CAP / 1024} KB inline cap` : `photo: ${esc(photo.file)} — not an image type the page inlines`;
  return `<p class="helper">${why}</p>`;
}
function companyChapters(data) {
  const { canvas, cell, team, brandDoc, designExists } = data;
  const out = [];
  const empty = {};

  // 14 · Team — a card per person, founders first; who is missing as a question.
  const people = (team || []).filter((p) => p.role !== 'missing');
  const gaps = (team || []).filter((p) => p.role === 'missing');
  const card = (p) => block({ id: `person-${esc(slug(p.slug))}`, title: p.name, sub: p.role + (p.handle ? ` · ${p.handle}` : ''), cls: 'person',
    body: face(p.photo, p.name)
      + (p.thing ? `<p class="thing">${inline(p.thing)}</p>` : '<p class="helper">the specific thing — not written yet</p>')
      + (p.brings ? blockMd(p.brings) : '')
      + (p.bio ? `<p class="bio">${inline(p.bio)}</p>` : ''),
    src: `docs/team/${esc(p.slug)}.md` });
  empty.team = !people.length;
  const missing = gaps.length
    ? block({ id: 'team-missing', title: 'Who is missing', sub: `${gaps.length} role${gaps.length === 1 ? '' : 's'}, named`, body: gaps.map((g) => `<p><strong>${esc(g.name)}</strong>${g.thing ? ` — ${inline(g.thing)}` : ''}</p>${g.brings ? blockMd(g.brings) : ''}`).join(''), chip: '<span class="chip asserted">asserted</span>', src: gaps.map((g) => `docs/team/${esc(g.slug)}.md`).join(' · ') })
    : hole('team-missing', 'Who is missing', 'The role you need and don\'t have — a cofounder, an advisor, the first hire — written plainly, or not at all. A person file with `role: missing` names one.', '/consult · mentor-hiring', 'docs/team — no file names a gap');
  out.push(chapter('team', chapterHead(14, 'Team', people[0] && people[0].thing ? firstSentence(people[0].thing) : ''),
    people.length
      ? `<div class="blocks">${people.map(card).join('')}${missing}</div>`
      : `<div class="blocks">${hole('team-none', 'Who is building it', 'One file per person — the specific thing seen, built, sold or lived; what they bring and don\'t; three lines of bio; a photo if you choose. Start with yourself.', 'write docs/team/<you>.md — the README there has the shape; boss team add writes a cofounder\'s', 'docs/team — none')}${missing}</div>`));

  // 15 · Brand — the brand doc as it is.
  const b = brandDoc;
  empty.brand = !b;
  let brandInner;
  if (b) {
    const known = b.shape.filter((l) => l.value);
    const shapeBlock = block({ id: 'brand-shape', title: 'Current shape', sub: b.status || '', body: b.shape.length ? `<dl class="kv">${b.shape.map((l) => `<dt>${esc(l.label)}</dt><dd>${l.value ? inline(l.value) : '<em class="hole-text">unknown</em>'}</dd>`).join('')}</dl>` : '<p class="helper">no ## Current shape section</p>',
      chip: `<span class="chip asserted">${known.length} of ${b.shape.length} known</span>`, src: `${esc(b.file)}${b.updated ? ` · ${esc(b.updated)}` : ''}` });
    const { brand } = data;
    const anchorBlock = (brand.accent || brand.tagline || (b.logo && b.logo.dataUri))
      ? block({ id: 'brand-anchor', title: 'The anchor', sub: 'what is decided', body: `${b.logo && b.logo.dataUri ? `<img class="logo" src="${b.logo.dataUri}" alt="${esc(brand.name)} mark">` : ''}${brand.accent ? `<p class="swatch"><i style="background:${esc(brand.accent)}"></i><code>${esc(brand.accent)}</code> accent</p>` : '<p class="helper">accent: unknown</p>'}${brand.tagline ? `<p class="specimen">${esc(brand.tagline)}</p>` : '<p class="helper">tagline: unknown</p>'}`, src: `${esc(b.file)} · frontmatter` + (designExists ? ` · <a class="xlink" href="design.html">tokens and type, in Design →</a>` : '') })
      : hole('brand-anchor', 'The anchor', 'The one owned colour, the tagline, the mark — each unknown until it is decided. /design-tokens-init chooses the anchor; a file beside BRAND.md is the mark.', '/design-tokens-init', `${b.file} · accent, tagline, logo all unknown`);
    const learnedBlock = b.learned.count
      ? block({ id: 'brand-learned', title: 'What the brand has learned', sub: 'rows, counted — the words stay in the file', body: `<p><b class="tab">${b.learned.count}</b> thing${b.learned.count === 1 ? '' : 's'} that actually happened${b.learned.newest ? `, newest ${esc(b.learned.newest)}` : ''}.</p>`, chip: '<span class="chip ev">from evidence</span>', src: `${esc(b.file)} · What we've learned` })
      : hole('brand-learned', 'What the brand has learned', 'Every row is something that actually happened — what a real person called it, the word that landed. None yet.', '/evidence', `${b.file} · What we've learned — no dated rows`);
    brandInner = `<div class="blocks">${shapeBlock}${anchorBlock}${learnedBlock}</div>`;
  } else {
    brandInner = `<div class="blocks">${hole('brand-none', 'The brand, as it is', 'Who it\'s for, what it promises, what it refuses, how it sounds, what it is not, the name and why — written when known, unknown when not.', '/landing seeds docs/BRAND.md', 'docs/BRAND.md — none')}</div>`;
  }
  const refuses = b && (b.shape.find((l) => /refuses/i.test(l.label)) || {}).value;
  out.push(chapter('brand', chapterHead(15, 'Brand', refuses ? firstSentence(refuses) : ''), brandInner));

  // 16 · Values — the Principles cell as the headlines; How we build as the page.
  const principles = cell('principles');
  const values = b ? b.values : [];
  empty.values = !(principles && principles.state === 'filled') && !values.length;
  const valueBlock = (v, i) => block({ id: `value-${i + 1}`, title: v.headline, cls: 'value', body: `<p class="meaning">${inline(v.meaning)}</p>${v.cost ? `<p class="cost"><span class="label">costs</span> ${inline(v.cost)}</p>` : '<p class="helper">no cost named — a value with no cost is a slogan</p>'}`, src: `docs/BRAND.md · How we build` });
  out.push(chapter('values', chapterHead(16, 'Values', values[0] ? values[0].headline : (principles && principles.state === 'filled' ? firstSentence(principles.answer) : '')),
    `<div class="blocks">${cellBlock(principles, canvas, 'values-principles', 'Principles', 'the short form')}${values.length ? values.map(valueBlock).join('') : hole('values-none', 'How we build', 'One headline per value, what it means in practice, what it costs you. Three is plenty.', b ? 'add ## How we build to docs/BRAND.md' : '/landing seeds docs/BRAND.md — then ## How we build', 'docs/BRAND.md · How we build — none')}</div>`));

  return { html: out.join('\n'), empty };
}

// --- the deck (FEAT-029) ------------------------------------------------------------------------
// Three cuts, each a list of block ids in page order, read off the rendered page so the list can
// never name a block that isn't there. Everything = every block. Internal = every filled block,
// minus the canvas cells a chapter already renders. VC = the pitch arc — and a 100% synthetic
// persona stays on the page and off this cut (Ajesh, 2026-09-13). The founder's removals live in
// the browser; these are the first draft.
const CHAPTER_CELLS = ['problem', 'story', 'people', 'risks', 'bizmodel', 'cost', 'principles'];
const VC_IDS = new Set(['vision-why', 'vision-few-years', 'vision-principles', 'product-shape', 'product-feats', 'product-not', 'problem-cell', 'problem-story', 'market-people', 'market-sources', 'competition-table', 'model-revenue', 'model-cost', 'model-capital', 'model-ask', 'evidence-ladder', 'risks-harms', 'risks-trust', 'health-read', 'health-measure', 'brand-anchor']);
const VC_PREFIXES = ['rival-', 'person-', 'value-'];
export function deckCuts(mainHtml, data) {
  const blocks = [...String(mainHtml).matchAll(/<article class="([^"]*)" id="([^"]+)"/g)].map((m) => ({ id: m[2], cls: m[1].split(/\s+/) }));
  const real = new Set((data.personas || []).filter((p) => p.real > 0).map((p) => `persona-${slug(p.slug)}`));
  const all = blocks.filter((b) => !b.cls.includes('pointer'));
  const filled = (b) => !b.cls.includes('hole') && !b.cls.includes('dormant');
  return {
    all: all.map((b) => b.id),
    internal: all.filter((b) => filled(b) && !CHAPTER_CELLS.some((k) => b.id === `canvas-${k}`)).map((b) => b.id),
    vc: all.filter((b) => VC_IDS.has(b.id) || VC_PREFIXES.some((p) => b.id.startsWith(p)) || real.has(b.id)).map((b) => b.id),
  };
}

export function renderPlaybookHtml(data, stampedAt) {
  const { boxes, ledger, brand, canvas, error, projectName } = data;
  const byBand = (n) => boxes.filter((b) => b.band === n && !b.floor);
  const floor = boxes.filter((b) => b.floor);
  const bandHtml = (n) => `<div class="band-title humane-only no-bmc"><h3>${n} · ${esc(BANDS[n][0])}</h3><span>${esc(BANDS[n][1])}</span></div>\n` + byBand(n).map((b) => boxHtml(b, canvas)).join('\n');
  const extras = boxes.filter((b) => !b.known && ![1, 2, 3].includes(b.band));
  const ledgerLine = `<b class="tab">${ledger.backed} of ${ledger.live}</b> cells backed by graded evidence · <b>${ledger.signals}</b> signal${ledger.signals === 1 ? '' : 's'}`
    + (ledger.signals ? `, ${GRADES.every((g) => !ledger.gradeCounts[g] || g === ledger.topOverall) ? 'all' : 'top'} <b>${esc(ledger.topOverall)}</b>` : '')
    + (ledger.newestDays === null ? '' : ` · newest <b>${ledger.newestDays} day${ledger.newestDays === 1 ? '' : 's'}</b> ago`);
  const brandLine = brand.present
    ? `brand: ${esc(brand.name)} · docs/BRAND.md${brand.accent ? '' : ' (accent unknown → default)'}${brand.nascent ? ' · nascent' : ''}`
    : 'brand: nascent — no docs/BRAND.md yet; rendered in the default. /landing seeds it.';
  const canvasLine = canvas
    ? `docs/ideas/${esc(canvas.file)}${canvas.others.length ? ` · newest of ${canvas.others.length + 1} (${canvas.others.map(esc).join(', ')})` : ''}`
    : 'no canvas yet — this page fills itself as you answer · /canvas';
  holeLog = []; holeDir = data.projectDir;
  const chapters = pitchChapters(data);
  const proof = proofChapters(data);
  const company = companyChapters(data);
  data.holes = holeLog; holeLog = null; holeDir = null;
  data.questions = openQuestions(data, data.projectDir);
  // the nudge on an empty page: how many questions are open and the cheapest verb to start with
  const openLine = data.questions.length
    ? `<b class="tab">${data.questions.length}</b> open · start: ${esc(data.questions[0].line)}`
    : 'nothing open';
  const errorHtml = error ? `<article class="block hole" id="canvas-error"><div class="head"><h3>Couldn't read the canvas</h3></div><div class="body"><p class="prompt">${esc(error)}</p></div><div class="foot"><span class="src">the rest of the page renders from what it could read</span></div></article>` : '';

  const ledgerHtml = `${ledgerLine} · ${openLine}`;
  const rail = [
    { group: 'Pitch', items: [['vision', 'Vision'], ['product', 'Product'], ['customers', 'Customers'], ['problem', 'Problem'], ['market', 'Market'], ['competition', 'Competition'], ['canvas', 'Canvas'], ['model', 'Business model']].map(([href, label], i) => ({ href, n: i + 1, label })) },
    { group: 'Proof', items: [['evidence', 'Evidence'], ['learnings', 'Learnings'], ['decisions', 'Decisions'], ['risks', 'Risks & harms'], ['health', 'Health']].map(([href, label], i) => ({ href, n: i + 9, label, hole: !!proof.empty[href] })) },
    { group: 'Company', items: [['team', 'Team'], ['brand', 'Brand'], ['values', 'Values']].map(([href, label], i) => ({ href, n: i + 14, label, hole: !!company.empty[href] })) },
  ];
  const chaptersHtml = `${chapters.before}
  <section class="chapter" id="canvas">
  <div class="chapter-head"><div class="label">7 · Canvas</div><p>Switch the frame — Humane, Lean, BMC — and the boxes move; the words don't. A dashed box is a question nobody has answered. Two cells stay on the page in every frame.</p></div>
  <div class="frame-bar"><div class="seg" role="group" aria-label="Frame"><button type="button" data-frame="humane" aria-pressed="true">Humane</button><button type="button" data-frame="lean" aria-pressed="false">Lean</button><button type="button" data-frame="bmc" aria-pressed="false">BMC</button></div><span class="credit" id="credit">${esc(CREDITS.humane)}</span></div>
  ${errorHtml}
  <div class="canvas" id="canvas-grid" data-frame="humane">
${bandHtml(1)}
${bandHtml(2)}
    <article class="block pointer" id="canvas-channels" data-title="Channels"><div class="head"><h3>Channels</h3></div><div class="body">Lean and BMC have a box for this; the humane canvas answers it inside <a href="#canvas-bizmodel">Business Model</a> — <em>how the first 100 find you</em>. One answer, never rendered twice.</div><div class="foot"><span class="src">canvas · Business Model</span></div></article>
${bandHtml(3)}
${extras.map((b) => boxHtml(b, canvas)).join('\n')}
    <div class="band-title floor-title"><h3>${esc(FLOOR_HEADING)}</h3><span>they render in every frame — the floor, not a footnote</span></div>
${floor.map((b) => boxHtml(b, canvas)).join('\n')}
  </div>
  </section>
${chapters.after}
${proof.html}
${company.html}`;
  const cuts = deckCuts(chaptersHtml, data);
  data.cuts = cuts;
  const presentBar = `<div class="present" id="present" data-cuts="${esc(JSON.stringify(cuts))}">
    <span class="label">Present</span>
    <div class="seg" role="group" aria-label="Cut"><button type="button" data-cut="vc" aria-pressed="true">VC cut <b class="tab n-vc">${cuts.vc.length}</b></button><button type="button" data-cut="internal" aria-pressed="false">Internal <b class="tab n-internal">${cuts.internal.length}</b></button><button type="button" data-cut="all" aria-pressed="false">All <b class="tab n-all">${cuts.all.length}</b></button></div>
    <button type="button" class="go" id="present-go">Present</button>
    <button type="button" class="pdf" id="present-pdf" title="Print the current cut, one slide per page">Export PDF</button>
    <span class="cut-note t-small"></span>
    <div class="removed" id="present-removed" hidden><span class="label">removed</span><span class="chips"></span><button type="button" class="restore-all">restore all</button></div>
  </div>`;
  const mainHtml = presentBar + chaptersHtml;
  const footerLines = [
    brandLine,
    `a read of your files — ${canvasLine} · docs/evidence · regenerated, never edited · rendered ${esc(stampedAt)} · re-run <code>boss playbook</code> to refresh`,
    'coverage is a fact · readiness is a verdict this page doesn\'t render',
  ];
  const theme = themeFromTokens(readTokens(data.projectDir).tokens);
  if (theme.used.length) footerLines.push(`set in the venture's own tokens — ${esc(theme.used.length)} taken from docs/design/tokens.json · light scheme only`);
  return shellPage({ title: `${brand.name} — Playbook`, brand, projectDir: data.projectDir, current: 'playbook', ledgerHtml, rail, mainHtml, footerLines, extraCss: PLAYBOOK_CSS + theme.css, extraJs: playbookJs(brand) });
}

// What the playbook adds to the shell: the frame toggle, the canvas grid in both frames, the deck.
// The chrome, the block, Link · Copy and the copy sheet are the shell's (src/page-shell.js).
const PLAYBOOK_CSS = `
  [hidden] { display: none !important; }
  .present { display: flex; flex-wrap: wrap; align-items: center; gap: 10px 14px; padding: 12px 14px; margin-bottom: 8px; border: 1px solid var(--rule); border-radius: 8px; background: var(--paper); } .present .seg button b { margin-left: 6px; color: var(--muted); font-weight: 500; } .present .seg button[aria-pressed="true"] b { color: inherit; }
  .chapter.cut-empty { display: none; } .rail a.cut-out { opacity: .45; } .present .cut-note { color: var(--muted); font-family: var(--mono); font-size: 11px; }
  .present .go, .present .pdf { padding: 6px 12px; border: 1px solid var(--rule); border-radius: 5px; font-size: 12.5px; } .present .go { background: var(--accent); color: var(--accent-ink); border-color: var(--accent); } .present .pdf:hover, .present .go:hover { filter: brightness(1.08); }
  .present .removed { flex-basis: 100%; display: flex; flex-wrap: wrap; align-items: center; gap: 6px 8px; padding-top: 8px; border-top: 1px solid var(--rule-2); } .present .removed .chips { display: contents; } .present .removed .rm { display: inline-flex; align-items: center; gap: 6px; padding: 2px 8px; border: 1px dashed var(--rule); border-radius: 99px; font-size: 12px; color: var(--ink-2); } .present .removed .rm button { font-family: var(--mono); font-size: 11px; color: var(--accent); } .present .removed .restore-all { margin-left: auto; font-family: var(--mono); font-size: 11px; color: var(--accent); }
  .deck .chrome .cut { color: var(--ground); } .deck .chrome .remove { margin-left: 0; color: var(--muted); border-color: color-mix(in srgb, var(--muted) 40%, transparent); } .deck .chrome .close { margin-left: auto; }
  .printdeck { display: none; }
  @media print {
    @page { size: landscape; margin: 0; }
    .topbar, .shell, footer.site, .deck, .sheet, .valmenu { display: none !important; }
    .printdeck { display: block; } .printdeck .sl { width: 100vw; height: 100vh; aspect-ratio: auto; max-height: none; border-radius: 0; box-shadow: none; page-break-after: always; break-after: page; padding: 6vh 7vw; } .printdeck .sl:last-child { page-break-after: auto; break-after: auto; } .printdeck .sl .sl-body { overflow: hidden; }
  }
  .face { display: block; width: 72px; height: 72px; object-fit: cover; border-radius: 50%; margin-bottom: 10px; border: 1px solid var(--rule); } .block.snippet .face { float: right; margin: 0 0 8px 12px; width: 56px; height: 56px; }
  .block.person .thing { font-family: var(--display); font-size: 18px; line-height: 1.3; margin-bottom: 8px; } .block.person .bio { color: var(--ink-2); font-size: 14px; margin-top: 8px; }
  .kv { display: grid; grid-template-columns: max-content 1fr; gap: 6px 14px; margin: 0; } .kv dt { font-family: var(--mono); font-size: 11px; text-transform: uppercase; letter-spacing: .05em; color: var(--muted); padding-top: 3px; } .kv dd { margin: 0; }
  .logo { display: block; max-height: 56px; max-width: 220px; margin-bottom: 10px; } .swatch { display: flex; align-items: center; gap: 8px; } .swatch i { width: 22px; height: 22px; border-radius: 5px; border: 1px solid var(--rule); } .specimen { font-family: var(--display); font-size: 22px; line-height: 1.25; margin-top: 8px; }
  .block.value .meaning { font-family: var(--display); font-size: 19px; line-height: 1.35; } .block.value .cost { margin-top: 10px; color: var(--ink-2); font-size: 14px; } .block.value .cost .label { margin-right: 6px; }
  .ladder { display: grid; gap: 6px; margin-bottom: 14px; } .rung { display: grid; grid-template-columns: 150px 1fr 32px; align-items: center; gap: 10px; font-family: var(--mono); font-size: 11px; color: var(--ink-2); } .rung .bar { height: 10px; background: var(--rule-2); border-radius: 3px; overflow: hidden; } .rung .bar i { display: block; height: 100%; background: var(--accent); border-radius: 3px; } .rung b { text-align: right; color: var(--ink); }
  table.t.ev td { font-size: 13.5px; } .block.superseded { opacity: .62; } .block .fals { margin-top: 8px; font-size: 14px; color: var(--ink-2); } .more { margin-top: 12px; font-family: var(--mono); font-size: 11px; color: var(--muted); }
  .seg { display: inline-flex; border: 1px solid var(--rule); border-radius: 6px; overflow: hidden; background: var(--paper); flex: none; } .seg button { padding: 5px 10px; font-size: 12px; color: var(--muted); } .seg button[aria-pressed="true"] { background: var(--accent); color: var(--accent-ink); } .seg button + button { border-left: 1px solid var(--rule); }
  .chapter-head { max-width: 62ch; margin-bottom: 22px; } .chapter-head .label { margin-bottom: 6px; } .chapter-head h2 { font-family: var(--display); font-size: 32px; line-height: 1.12; } .chapter-head p { margin-top: 8px; color: var(--ink-2); }
  .frame-bar { display: flex; flex-wrap: wrap; align-items: center; gap: 14px; margin-bottom: 16px; } .credit { font-family: var(--mono); font-size: 11px; color: var(--muted); }
  .canvas { display: grid; gap: 12px; grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .band-title { grid-column: 1 / -1; display: flex; align-items: baseline; gap: 10px; margin-top: 8px; } .band-title h3 { font-family: var(--display); font-size: 20px; } .band-title span { font-size: 13px; color: var(--muted); }
  .canvas .block { min-height: 150px; }
  .block .prompt { font-size: 12.5px; color: var(--muted); margin-bottom: 8px; } .block.hole .prompt, .block.dormant .prompt { font-size: 14px; }
  .block .answer p + p { margin-top: 8px; } .block .foot { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 12px; margin-top: 14px; padding-top: 10px; border-top: 1px solid var(--rule-2); font-family: var(--mono); font-size: 11px; color: var(--muted); } .block .src { min-width: 0; overflow-wrap: anywhere; }
  .block.extra h3::after { content: " · your cell"; font-weight: 400; color: var(--muted); }
  .t-lean, .t-bmc { display: none; }
  .canvas[data-frame="lean"] { grid-template-columns: repeat(5, minmax(0, 1fr)); grid-template-rows: repeat(3, minmax(150px, auto)) auto minmax(150px, auto); }
  .canvas[data-frame="lean"] .humane-only { display: none; } .canvas[data-frame="lean"] .block.floor { display: flex; }
  .canvas[data-frame="lean"] .block { grid-area: var(--area, auto); } .canvas[data-frame="lean"] .block .prompt { display: none; } .canvas[data-frame="lean"] .block.hole .prompt, .canvas[data-frame="lean"] .block.dormant .prompt { display: block; }
  .canvas[data-frame="lean"] .t-lean { display: inline; } .canvas[data-frame="lean"] .t-humane { display: none; }
  .canvas[data-frame="lean"] .band-title.floor-title { grid-area: 4 / 1 / 5 / 6; margin-top: 18px; } .canvas[data-frame="lean"] #canvas-risks { grid-area: 5 / 1 / 6 / 4; } .canvas[data-frame="lean"] #canvas-principles { grid-area: 5 / 4 / 6 / 6; }
  .canvas[data-frame="lean"] .pointer { display: flex; grid-area: ${LEAN_CHANNELS_AREA}; } .pointer { display: none; }
  .canvas[data-frame="bmc"] { grid-template-columns: repeat(5, minmax(0, 1fr)); grid-template-rows: repeat(3, minmax(150px, auto)) auto minmax(150px, auto); }
  .canvas[data-frame="bmc"] .no-bmc { display: none; } .canvas[data-frame="bmc"] .block.floor { display: flex; }
  .canvas[data-frame="bmc"] .block { grid-area: var(--bmc-area, auto); } .canvas[data-frame="bmc"] .block .prompt { display: none; } .canvas[data-frame="bmc"] .block.hole .prompt, .canvas[data-frame="bmc"] .block.dormant .prompt { display: block; }
  .canvas[data-frame="bmc"] .t-bmc { display: inline; } .canvas[data-frame="bmc"] .t-humane { display: none; }
  .canvas[data-frame="bmc"] .band-title.floor-title { grid-area: 4 / 1 / 5 / 6; margin-top: 18px; } .canvas[data-frame="bmc"] #canvas-risks { grid-area: 5 / 1 / 6 / 4; } .canvas[data-frame="bmc"] #canvas-principles { grid-area: 5 / 4 / 6 / 6; }
  .canvas[data-frame="bmc"] .pointer { display: flex; grid-area: ${LEAN_CHANNELS_AREA}; }
  .pointer .body { color: var(--ink-2); font-size: 14px; }
  .deck { position: fixed; inset: 0; z-index: 50; background: var(--ink); display: grid; grid-template-rows: auto 1fr auto; padding: 16px clamp(16px, 4vw, 48px); }
  .deck .chrome, .deck .bottom { display: flex; align-items: center; gap: 14px; font-family: var(--mono); font-size: 11.5px; color: var(--muted); } .deck .chrome button { margin-left: auto; padding: 6px 10px; border: 1px solid var(--rule); border-radius: 5px; font-family: var(--body); font-size: 12.5px; color: var(--ground); }
  .deck .stage { display: grid; place-items: center; min-height: 0; position: relative; } .deck .hit { position: absolute; top: 0; bottom: 0; width: 22%; cursor: pointer; } .deck .hit.l { left: 0; } .deck .hit.r { right: 0; }
  .deck .bottom .lg { margin-left: auto; }
  .sl { width: min(100%, 1180px); aspect-ratio: 16 / 9; max-height: 100%; background: var(--paper); color: var(--ink); border-radius: 10px; box-shadow: var(--shadow); padding: clamp(28px, 4.5vw, 64px) clamp(28px, 5vw, 72px); display: flex; flex-direction: column; overflow: hidden; min-height: 0; }
  .sl .eyebrow { font-family: var(--mono); font-size: 11.5px; letter-spacing: .06em; text-transform: uppercase; color: var(--muted); margin-bottom: 14px; } .sl .eyebrow .wm { font-family: var(--display); font-size: 16px; letter-spacing: 0; text-transform: none; color: var(--ink); margin-right: 10px; }
  .sl .sl-title { font-family: var(--display); font-size: clamp(24px, 2.6vw, 38px); color: var(--ink-2); font-weight: 500; }
  .sl .sl-body { margin-top: 20px; flex: 1; min-height: 0; overflow: auto; font-family: var(--display); font-size: clamp(19px, 2.2vw, 32px); line-height: 1.32; } .sl .sl-body .prompt { display: none; } .sl.hole .sl-body .prompt, .sl.dormant .sl-body .prompt { display: block; color: var(--hole); font-style: italic; }
  .sl .sl-foot { margin-top: 18px; padding-top: 12px; border-top: 1px solid var(--rule-2); display: flex; gap: 14px; font-family: var(--mono); font-size: 11px; color: var(--muted); } .sl.hole { border: 2px dashed var(--rule); }
  @media (max-width: 900px) { .canvas, .canvas[data-frame="lean"], .canvas[data-frame="bmc"] { grid-template-columns: repeat(2, minmax(0, 1fr)); } .canvas[data-frame="lean"] .block, .canvas[data-frame="lean"] .pointer, .canvas[data-frame="lean"] .band-title.floor-title, .canvas[data-frame="bmc"] .block, .canvas[data-frame="bmc"] .pointer, .canvas[data-frame="bmc"] .band-title.floor-title { grid-area: auto !important; } .canvas[data-frame="lean"] .band-title.floor-title, .canvas[data-frame="bmc"] .band-title.floor-title { grid-column: 1 / -1; } }
  @media (max-width: 640px) { .canvas, .canvas[data-frame="lean"], .canvas[data-frame="bmc"] { grid-template-columns: 1fr; } }
  .block .helper { color: var(--muted); font-size: 13px; } .block .body ul { margin: 0; padding-left: 18px; } .block .body li + li { margin-top: 4px; } .block .body p + p, .block .body ul + p, .block .body p + ul { margin-top: 8px; }
  .block.snippet .who { font-family: var(--display); font-size: 19px; line-height: 1.3; } .xlink { font-family: var(--mono); font-size: 11.5px; } .xlink.dim { color: var(--muted); } .hole-text { color: var(--hole); }
  .tier-title { display: flex; align-items: baseline; gap: 10px; margin: 22px 0 12px; } .tier-title h3 { font-family: var(--display); font-size: 20px; } .tier-title span { font-size: 13px; color: var(--muted); }
  table.rivals { width: 100%; border-collapse: collapse; font-size: 13.5px; } table.rivals th { text-align: left; font-family: var(--mono); font-size: 10.5px; letter-spacing: .06em; text-transform: uppercase; color: var(--muted); font-weight: 500; padding: 0 10px 8px 0; border-bottom: 1px solid var(--rule); } table.rivals td { padding: 10px 10px 10px 0; border-bottom: 1px solid var(--rule-2); vertical-align: top; } table.rivals tr:last-child td { border-bottom: 0; }
  .chip.synthetic { background: var(--accent-soft); color: var(--ink-2); } .date { font-family: var(--mono); font-size: 11px; color: var(--muted); }
  .rival .win-line { font-family: var(--display); font-size: 20px; line-height: 1.25; margin-bottom: 8px; }
`;

// Slide on every block (appended after the shell's Link · Copy), the frame toggle, the deck.
function playbookJs(brand) {
  return `
(function () {
  const SLIDE_ICON = '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="3" y="5" width="18" height="12" rx="1.5"/><path d="M12 17v3M8 20h8"/></svg>';
  const esc = (s) => String(s).replace(/[&<>"]/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m]));
  const $ = (s, r) => (r || document).querySelector(s), $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const grid = $('#canvas-grid'), credits = ${JSON.stringify(CREDITS)}, BRAND = ${JSON.stringify(brand.name)};
  $$('[data-frame]').forEach((x) => x.addEventListener('click', () => { grid.dataset.frame = x.dataset.frame; $$('[data-frame]').forEach((y) => y.setAttribute('aria-pressed', String(y === x))); $('#credit').textContent = credits[x.dataset.frame]; }));
  const blocks = $$('.block:not(.pointer)');
  blocks.forEach((b) => {
    const a = $('.actions', b); if (!a || a.dataset.ready) return; a.dataset.ready = '1';
    a.insertAdjacentHTML('beforeend', '<button type="button" class="slide" title="Open this box as a slide">' + SLIDE_ICON + 'Slide</button>');
    $('.slide', a).addEventListener('click', () => openDeck(0, b));
  });
  /* the deck (FEAT-029): a cut is a list of block ids; removals live in the browser, never in a record */
  const present = $('#present'); let cuts = {}; try { cuts = JSON.parse(present.dataset.cuts); } catch (e) {}
  /* keyed by project: every .boss/ page shares the file:// origin, so one browser sees many playbooks */
  const KEY = 'boss-playbook-' + BRAND.replace(/[^a-z0-9]+/gi, '-').toLowerCase() + '-';
  const store = { get(k) { try { return JSON.parse(localStorage.getItem(KEY + k) || 'null'); } catch (e) { return null; } }, set(k, v) { try { localStorage.setItem(KEY + k, JSON.stringify(v)); } catch (e) {} } };
  const NAMES = { vc: 'VC cut', internal: 'Internal', all: 'All' };
  let cut = ['vc', 'internal', 'all'].includes(store.get('cut')) ? store.get('cut') : 'vc';
  const byId = (id) => blocks.find((b) => b.id === id);
  const removed = () => (store.get('removed-' + cut) || []).filter((id) => byId(id));
  const list = () => (cuts[cut] || []).filter((id) => !removed().includes(id)).map(byId).filter(Boolean);
  function setCut(c) { cut = c; store.set('cut', c); $$('[data-cut]', present).forEach((y) => y.setAttribute('aria-pressed', String(y.dataset.cut === c))); renderBar(); filterPage(); }
  /* the cut is also a filter (Ajesh, 2026-09-13): the page below shows only what the cut carries;
     All shows the page whole. A removed slide stays on the page — removal is about the deck. */
  function filterPage() {
    const inCut = new Set(cut === 'all' ? blocks.map((b) => b.id) : (cuts[cut] || []));
    blocks.forEach((b) => { b.hidden = !inCut.has(b.id); });
    $$('.chapter').forEach((ch) => { const any = $$('.block:not(.pointer)', ch).some((b) => !b.hidden); ch.classList.toggle('cut-empty', !any); });
    $$('.rail a').forEach((a) => { const ch = $(a.getAttribute('href')); a.classList.toggle('cut-out', !!(ch && ch.classList.contains('cut-empty'))); });
    const note = $('.cut-note', present); if (note) note.textContent = cut === 'all' ? '' : 'showing the ' + NAMES[cut] + ' \u2014 ' + inCut.size + ' block' + (inCut.size === 1 ? '' : 's') + '; All shows the page whole';
  }
  function renderBar() {
    const rm = removed(); const box = $('#present-removed'); box.hidden = !rm.length;
    $('.chips', box).innerHTML = rm.map((id) => '<span class="rm">' + esc(byId(id).dataset.title || id) + '<button type="button" data-restore="' + esc(id) + '" title="Put this slide back">↺</button></span>').join('');
    $$('[data-restore]', box).forEach((x) => x.addEventListener('click', () => restore(x.dataset.restore)));
    ['vc', 'internal', 'all'].forEach((c) => { const n = $('.n-' + c, present); if (n) n.textContent = String((cuts[c] || []).filter((id) => byId(id) && !(store.get('removed-' + c) || []).includes(id)).length); });
  }
  function remove(id) { const r = removed(); if (!r.includes(id)) r.push(id); store.set('removed-' + cut, r); renderBar(); }
  function restore(id) { store.set('removed-' + cut, removed().filter((x) => x !== id)); renderBar(); if (deckEl && !deckEl.hidden) render(); }
  $$('[data-cut]', present).forEach((x) => x.addEventListener('click', () => setCut(x.dataset.cut)));
  $('.restore-all', present).addEventListener('click', () => { store.set('removed-' + cut, []); renderBar(); if (deckEl && !deckEl.hidden) render(); });
  $('#present-go').addEventListener('click', () => openDeck(0));
  $('#present-pdf').addEventListener('click', () => exportPdf());
  setCut(cut);

  let deckEl = null, cur = 0;
  const LEDGER = $('.ledger').innerText;
  function slide(b) { const sl = document.createElement('div'); sl.className = 'sl ' + (b.classList.contains('hole') ? 'hole' : b.classList.contains('dormant') ? 'dormant' : ''); const body = $('.body', b).cloneNode(true); $$('.actions', body).forEach((x) => x.remove()); body.className = 'sl-body'; sl.innerHTML = '<div class="eyebrow"><span class="wm">' + esc(BRAND) + '</span>' + esc((b.closest('.chapter') && $('.label', b.closest('.chapter'))) ? $('.label', b.closest('.chapter')).innerText : '') + '</div><div class="sl-title">' + esc(b.dataset.title) + '</div>'; sl.appendChild(body); sl.insertAdjacentHTML('beforeend', '<div class="sl-foot">' + ($('.chip', b) ? $('.chip', b).outerHTML : '') + '<span>' + esc($('.src', b) ? $('.src', b).innerText : '') + '</span></div>'); return sl; }
  function openDeck(i, block) {
    let l = list();
    if (block) { let j = l.indexOf(block); if (j < 0) { setCut('all'); l = list(); j = l.indexOf(block); } cur = Math.max(0, j); } else cur = i;
    if (!l.length) return;
    if (!deckEl) {
      deckEl = document.createElement('div'); deckEl.className = 'deck'; deckEl.tabIndex = -1; deckEl.setAttribute('role', 'dialog');
      deckEl.innerHTML = '<div class="chrome"><span class="cut"></span><span class="where"></span><button type="button" class="remove" title="Take this slide out of the current cut — restore it from the bar">Remove from this cut</button><button type="button" class="close">Close · Esc</button></div><div class="stage"><div class="hit l"></div><div class="hit r"></div></div><div class="bottom"><span class="pos"></span><span class="lg">' + esc(LEDGER) + '</span></div>';
      document.body.appendChild(deckEl);
      $('.close', deckEl).addEventListener('click', closeDeck); $('.hit.l', deckEl).addEventListener('click', () => step(-1)); $('.hit.r', deckEl).addEventListener('click', () => step(1));
      $('.remove', deckEl).addEventListener('click', () => { const l2 = list(); if (!l2.length) return; remove(l2[cur].id); const l3 = list(); if (!l3.length) { closeDeck(); return; } cur = Math.min(cur, l3.length - 1); render(); });
    }
    render(); deckEl.hidden = false; document.body.style.overflow = 'hidden'; deckEl.focus({ preventScroll: true });
  }
  function render() { const l = list(); if (!l.length) { closeDeck(); return; } cur = Math.min(cur, l.length - 1); const st = $('.stage', deckEl); $$('.sl', st).forEach((x) => x.remove()); st.appendChild(slide(l[cur])); const ch2 = l[cur].closest('.chapter'); $('.cut', deckEl).textContent = NAMES[cut]; $('.where', deckEl).textContent = (ch2 && $('.label', ch2) ? $('.label', ch2).innerText + ' · ' : '') + l[cur].dataset.title; $('.pos', deckEl).textContent = (cur + 1) + ' / ' + l.length; }
  function step(d) { const n = list().length; if (!n) return; cur = (cur + d + n) % n; render(); }
  function closeDeck() { if (deckEl) { deckEl.hidden = true; document.body.style.overflow = ''; } }
  function exportPdf() { let pd = $('.printdeck'); if (!pd) { pd = document.createElement('div'); pd.className = 'printdeck'; document.body.appendChild(pd); } pd.innerHTML = ''; list().forEach((b) => pd.appendChild(slide(b))); window.print(); }
  document.addEventListener('keydown', (e) => { if (!deckEl || deckEl.hidden) return; if (e.target && e.target.tagName === 'BUTTON' && (e.key === ' ' || e.key === 'Enter')) return; if (e.key === 'Escape') closeDeck(); if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); step(1); } if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); } });
})();
`;
}

// --- the pull (IDEA-111) ------------------------------------------------------------------------
// The page's holes read back as a list: one entry per open question, the verb that answers it,
// cheapest first. Canvas holes come from the boxes (a dormant cell is a condition, not a question);
// chapter holes are what hole() drew, minus the canvas cells the chapters repeat. Nothing is computed
// twice, so the terminal and the page can never disagree. A verb whose skill folder the project
// doesn't have yet is said so; when the hole is a record a document can fill (rivals, brand) it
// points at /import instead — the record is ungated, only the deeper verb is. A FEAT or a mentor's
// dossier is not something you drop in, so those just wait for the mode.
const VERB_ORDER = ['/boss', '/canvas', '/idea', '/log', '/decide', '/persona', '/evidence', '/import', '/spec', '/comp-eval', '/landing', '/trust', '/consult'];
// A gated verb with a door that exists: the record can still be filled the plain way.
const ALT = { 'comp-eval': ['or drop what you know', 'import'], landing: ['or drop what you know', 'import'], log: ['or add it to the idea', 'idea'] };
// Is the verb's skill installed here? No skills folder at all (a bare adopt, a test tree) → nothing
// can be said about gating, so yes. The readers that write a sentence rather than a list (recap,
// the board's footer, the re-entry line) use this to phrase the wait themselves (IDEA-118).
export function hasVerb(verb, projectDir) {
  const m = /^\/([a-z-]+)/.exec(verb);
  if (!m || !projectDir) return true;
  const skillsDir = join(projectDir, '.claude', 'skills');
  return !existsSync(skillsDir) || existsSync(join(skillsDir, m[1]));
}
// The verb as the founder should read it. No skills folder at all (a bare adopt, a test tree) →
// nothing can be said about gating and the verb prints as is.
export function verbLine(verb, projectDir) {
  const m = /^\/([a-z-]+)/.exec(verb);
  if (!m || !projectDir) return verb;
  const skillsDir = join(projectDir, '.claude', 'skills');
  const has = (v) => !existsSync(skillsDir) || existsSync(join(skillsDir, v));
  if (has(m[1])) return verb;
  const alt = ALT[m[1]];
  return alt && has(alt[1]) ? `${verb} — ${alt[0]}: /${alt[1]}` : `${verb} — arrives with the next mode (boss unlock)`;
}
export function openQuestions(data, projectDir) {
  const fromCanvas = data.boxes.filter((b) => b.state === 'hole').map((b) => ({ id: `canvas-${b.key}`, title: b.name, prompt: b.prompt, verb: '/canvas' }));
  // Two chapters may hole on one missing file (Vision repeats Team's "who is building it" the way
  // the chapters repeat canvas cells); the founder answers it once, so the list names it once — the
  // owning chapter's, which is drawn after the repeat.
  const byKey = new Map();
  for (const h of (data.holes || []).filter((h) => h.verb !== '/canvas')) byKey.set(`${h.title}\u0000${h.src}`, h);
  const fromChapters = [...byKey.values()];
  const rank = (v) => { const i = VERB_ORDER.findIndex((o) => v.startsWith(o)); return i < 0 ? VERB_ORDER.length : i; };
  return [...fromCanvas, ...fromChapters].sort((a, b) => rank(a.verb) - rank(b.verb)).map((q) => {
    const line = verbLine(q.verb, projectDir);
    return { ...q, gated: line !== q.verb, line };
  });
}

// One terminal line: `11 questions open · /canvas ×4 · /persona derive · …` — grouped by verb line.
export function questionsLine(questions) {
  if (!questions.length) return 'no questions open';
  const counts = new Map();
  for (const q of questions) counts.set(q.line, (counts.get(q.line) || 0) + 1);
  const parts = [...counts].map(([line, n]) => n > 1 ? `${line} ×${n}` : line);
  return `${questions.length} question${questions.length === 1 ? '' : 's'} open · ${parts.join(' · ')}`;
}

// Write the playbook to .boss/playbook.html and return its path — the board.html contract.
export function playbookHtml(projectDir, projectName) {
  const data = collectPlaybook(projectDir, projectName);
  const stampedAt = isoMinute();
  const html = renderPlaybookHtml(data, stampedAt);
  const dir = join(projectDir, '.boss');
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  const out = join(dir, 'playbook.html');
  writeFileSync(out, html);
  return { out, data };
}
