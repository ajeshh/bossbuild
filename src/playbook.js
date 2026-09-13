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

// --- the registry -----------------------------------------------------------------------------
// `lean` is the Lean Canvas box the humane answer reads as (DEC-004 mapping); `area` its grid slot.
// Cells with no `lean` are humane-only and hide in the Lean frame — except the two FLOOR cells,
// which render in EVERY frame as a band beneath the grid (DEC-004: humane is the floor).
export const CELLS = [
  { key: 'people',     name: 'People',                   band: 1, lean: 'Customer segments',        area: '1 / 5 / 3 / 6',
    prompt: 'Who are you designing for & what matters to them? Who exactly has the painful problem — how many, and how do you know?' },
  { key: 'problem',    name: 'Problem',                  band: 1, lean: 'Problem',                  area: '1 / 1 / 3 / 2',
    prompt: 'What real human tension are you solving? Is it urgent, frequent, expensive, or emotionally painful?' },
  { key: 'promises',   name: 'Promises',                 band: 1, lean: 'Unique value proposition', area: '1 / 3 / 3 / 4',
    prompt: 'What emotional / relational value will it deliver? The sharp promise: "We help X do Y without Z."' },
  { key: 'story',      name: 'Story',                    band: 2, lean: 'Solution',                 area: '1 / 2 / 2 / 3',
    prompt: 'How does your product show up in someone\'s life? What changed that makes this newly possible?' },
  { key: 'modes',      name: 'Modes of Engagement',      band: 2, lean: 'Unfair advantage',         area: '1 / 4 / 2 / 5',
    prompt: 'How do people interact with your product in a humane way? Does it respect time, attention, agency?' },
  { key: 'bizmodel',   name: 'Business Model',           band: 2, lean: 'Revenue streams',          area: '3 / 4 / 4 / 6',
    prompt: 'How will you sustain this without compromising your promise? Who pays, how much — and how do the first 100 find you?' },
  { key: 'cost',       name: 'Cost Structure',           band: 2, lean: 'Cost structure',           area: '3 / 1 / 4 / 4',
    prompt: 'What does it actually cost to serve one person for a month?' },
  { key: 'deliver',    name: 'What it takes to deliver', band: 2,
    prompt: 'What do you need to have and do to keep the promise?' },
  { key: 'partners',   name: 'Key Partnerships',         band: 2,
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
const LEAN_CHANNELS_AREA = '2 / 4 / 3 / 5';

const BANDS = {
  1: ['Human foundation', 'who you serve, the tension they carry, the value you promise'],
  2: ['Product expression', 'how it shows up in a life, how people engage, how it sustains itself'],
  3: ['Stewardship', 'impact, risks, and the values that guide decisions'],
};
const FLOOR_HEADING = 'Two questions this canvas asks that Lean doesn\'t';
const CREDITS = { humane: 'Humane Product Canvas · Ajesh Shah', lean: 'Lean Canvas · Ash Maurya, adapted — plus the two floor cells' };
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
      out.push({ id: fm.id || n.replace(/\.md$/i, ''), grade, date, names: norm(names) });
    } catch { /* an unreadable record is not a signal */ }
  }
  return out;
}

// docs/BRAND.md — three fields, each falling back on its own. `unknown` is a real answer and
// means "the default", never an invented colour.
export function readBrand(projectDir, projectName) {
  const brand = { name: projectName, accent: null, tagline: null, present: false, nascent: false };
  const p = join(projectDir, 'docs', 'BRAND.md');
  if (!existsSync(p)) return brand;
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

// The IDEA doc the canvas belongs to (`IDEA-NNN-canvas` → `IDEA-NNN-*.md`), else the newest idea.
export function readIdea(projectDir, canvasId) {
  const dir = join(projectDir, 'docs', 'ideas');
  if (!existsSync(dir)) return null;
  const m = String(canvasId || '').match(/^(IDEA-\d+)/i);
  let names = readdirSync(dir).filter((n) => /^IDEA-\d+.*\.md$/i.test(n) && !/-canvas\.md$/i.test(n));
  if (m) { const mine = names.filter((n) => n.toUpperCase().startsWith(m[1].toUpperCase() + '-') || n.toUpperCase() === m[1].toUpperCase() + '.md'); if (mine.length) names = mine; }
  if (!names.length) return null;
  const pick = names.map((n) => { const p = join(dir, n); let fm = {}; try { fm = frontmatter(readFileSync(p, 'utf8')); } catch { /* keep going */ } return { n, p, when: Date.parse(fm.created || '') || statSync(p).mtimeMs }; })
    .sort((a, b) => b.when - a.when)[0];
  try {
    const text = readFileSync(pick.p, 'utf8');
    const fm = frontmatter(text);
    const title = (text.match(/^#\s+(.+)$/m) || [null, ''])[1].trim();
    const skip = (v) => { const s = String(v ?? '').trim().replace(/^"|"$/g, ''); return !s || /^(unset|none|tbd)$/i.test(s) ? '' : s; };
    return { file: pick.n, id: fm.id || null, title, gist: skip(fm.gist), motivation: skip(fm.motivation), success: skip(fm.success_looks_like), vision: skip(fm.vision), shape: section(text, 'Current shape'), created: fm.created || null };
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
      out.push({ slug: n.replace(/\.md$/i, ''), name: String(fm.name || title || n.replace(/\.md$/i, '')).replace(/^persona\s*[—:-]\s*/i, '').trim(), who: fieldLine('who'), context: fieldLine('context'), primary: /primary/i.test(String(fm.role || fm.kind || fm.primary || '')), created: fm.created || null, synthetic: ledger ? parseInt(ledger[1], 10) : null, real: ledger ? parseInt(ledger[2], 10) : null });
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
  return readdirSync(dir).filter((n) => !n.startsWith('.')).map((n) => {
    const p = join(dir, n); let st = null; try { st = statSync(p); } catch { return null; }
    const d = (n.match(/\d{4}-\d{2}-\d{2}/) || [null])[0] || (st ? st.mtime.toISOString().slice(0, 10) : null);
    return { name: n, dir: st && st.isDirectory(), date: d };
  }).filter(Boolean).sort((a, b) => String(b.date).localeCompare(String(a.date)));
}

// docs/dossier/mentor-capital.md — the first paragraph of the body, if the file exists.
export function readAsk(projectDir) {
  const p = join(projectDir, 'docs', 'dossier', 'mentor-capital.md');
  if (!existsSync(p)) return null;
  try {
    const text = readFileSync(p, 'utf8').replace(/\r\n?/g, '\n').replace(/^---\n[\s\S]*?\n---\n?/, '');
    const para = text.split(/\n\s*\n/).map((s) => s.trim()).find((s) => s && !/^#/.test(s) && !/^>/.test(s));
    return para ? { text: para, updated: frontmatter(readFileSync(p, 'utf8')).updated || null } : null;
  } catch { return null; }
}

// One line of docs/BRAND.md's current shape, by its bold label ("What it is NOT", "What it refuses").
export function readBrandLine(projectDir, label) {
  const p = join(projectDir, 'docs', 'BRAND.md');
  if (!existsSync(p)) return '';
  try {
    const m = readFileSync(p, 'utf8').match(new RegExp(`^[-*]\\s*\\*\\*${label}:?\\*\\*\\s*(.+)$`, 'im'));
    const v = m ? m[1].trim() : '';
    return !v || /^<.*>$/.test(v) || /^unknown\b/i.test(v) ? '' : v;
  } catch { return ''; }
}

// --- the projection -------------------------------------------------------------------------------

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
    projectName,
    canvas: found ? { file: found.name, updated: parsed.updated, others: found.others } : null,
    error, boxes, cell,
    ledger: { backed, live: live.length, signals: evidence.length, gradeCounts, topOverall, newestDays },
    brand: readBrand(projectDir, projectName),
    // slice 2 (FEAT-027) — each null/empty renders as a hole, never invented
    idea, feats: readFeats(projectDir), personas: readPersonas(projectDir),
    competition: readCompetition(projectDir), sources: readSources(projectDir), ask: readAsk(projectDir),
    brandNot: readBrandLine(projectDir, 'What it is NOT'),
    designExists: existsSync(join(projectDir, '.boss', 'design.html')),
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
  const title = `<h3><span class="t-humane">${esc(b.name)}</span>${b.lean ? `<span class="t-lean">${esc(b.lean)}</span>` : ''}</h3>`;
  const area = b.area ? ` style="--area:${b.area}"` : '';
  const cls = `block ${b.state}${b.floor ? ' floor' : ''}${b.lean ? '' : ' humane-only'}${b.known ? '' : ' extra'}`;
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
const hole = (id, title, prompt, verb, src, sub = '') => block({ id, title, sub, state: 'hole', body: `<p class="prompt">${esc(prompt)}</p><span class="verb">not yet · ${esc(verb)}</span>`, src: esc(src) });
const cellBlock = (b, canvas, id, title, sub = '') => {
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
  const out = [];
  const line = (b) => (b && b.state === 'filled' ? firstSentence(b.answer) : '');

  // 1 · Vision — the Promise is the line; the founder's why; principles; two holes the records can't fill.
  const ideaSrc = idea ? `docs/ideas/${esc(idea.file)}` : 'docs/ideas — no IDEA doc';
  out.push(chapter('vision', chapterHead(1, 'Vision', line(cell('promises'))),
    '<div class="blocks">'
    + (idea && (idea.motivation || idea.success)
      ? block({ id: 'vision-why', title: 'Why this, and what "it worked" looks like', body: (idea.motivation ? `<p><strong>Motivation:</strong> ${inline(idea.motivation)}</p>` : '') + (idea.success ? `<p><strong>Success looks like:</strong> ${inline(idea.success)}</p>` : ''), chip: '<span class="chip asserted">asserted</span>', src: `${ideaSrc} · motivation · success_looks_like` })
      : hole('vision-why', 'Why this, and what "it worked" looks like', 'Why are you building this, and what does success look like in three months? Two lines on the IDEA doc.', '/idea', ideaSrc))
    + cellBlock(cell('principles'), canvas, 'vision-principles', 'Principles', 'what we\'ll hold when it\'s costly')
    + hole('vision-team', 'Who is building it', 'Who is building it, and what makes that believable to a stranger — the specific thing seen, built, sold or lived, not a CV?', 'no person record yet (IDEA-106 · kicked up #11)', 'docs/team — not a BOSS record')
    + (idea && idea.vision ? block({ id: 'vision-five-years', title: 'In five years', body: `<p>${inline(idea.vision)}</p>`, chip: '<span class="chip asserted">asserted</span>', src: `${ideaSrc} · vision` })
      : hole('vision-five-years', 'In five years', 'If all goes well, what will you have built in five years? Nobody has asked; the answer is on no record.', 'a vision: line on the IDEA doc (IDEA-106 · kicked up #12)', `${ideaSrc} · no vision line`))
    + '</div>'));

  // 2 · Product — the IDEA doc's current shape, whole; the FEATs; what it is not.
  const shapeLine = idea && idea.shape ? firstSentence(idea.shape.split('\n').filter((l) => !/^_.*_$/.test(l.trim())).join('\n')) : '';
  const featList = feats.length
    ? block({ id: 'product-feats', title: 'What has shipped', sub: 'and what is being built', body: `<ul>${feats.map((f) => `<li><strong>${esc(f.id)}</strong> · ${inline(f.gist)} — <em>${esc(f.status || 'unknown')}</em>${f.shippedOn ? ` · ${esc(f.shippedOn)}` : ''}</li>`).join('')}</ul>`, chip: `<span class="chip ev">${feats.length} FEAT${feats.length === 1 ? '' : 's'} · ${feats.filter((f) => /^shipped/i.test(f.status)).length} shipped</span>`, src: 'docs/ideas/FEAT-*.md · boss board' })
    : hole('product-feats', 'What has shipped', 'Nothing has a build contract yet. The first FEAT is where "we should build this" becomes "here is how we\'ll know it\'s done."', '/spec', 'docs/ideas/FEAT-*.md — none');
  out.push(chapter('product', chapterHead(2, 'Product', shapeLine),
    '<div class="blocks">'
    + (idea && idea.shape ? block({ id: 'product-shape', title: 'What it is today', sub: 'the current shape, in the founder\'s words', body: blockMd(idea.shape), chip: '<span class="chip asserted">asserted</span>', src: `${ideaSrc} · ## Current shape${idea.created ? ` · since ${esc(idea.created)}` : ''}` })
      : hole('product-shape', 'What it is today', 'What is it, who is it for, and what is the smallest version that proves it? The IDEA doc\'s current shape.', '/idea', ideaSrc))
    + featList
    + (brandNot ? block({ id: 'product-not', title: 'What it is not', body: `<p>${inline(brandNot)}</p>`, chip: '<span class="chip asserted">asserted</span>', src: 'docs/BRAND.md · What it is NOT' })
      : hole('product-not', 'What it is not', 'The nearest thing people will mistake it for — and what it refuses to be.', '/landing seeds docs/BRAND.md', 'docs/BRAND.md · What it is NOT'))
    + '</div>'));

  // 3 · Customers — snippets; the full card is the Design space's (IDEA-107).
  const primary = personas[0] || null;
  const snippet = (p, i) => {
    const led = p.synthetic === null ? '<span class="chip asserted">no ledger line</span>' : `<span class="chip synthetic">synthetic ${p.synthetic}% · real ${p.real}%</span>`;
    const link = designExists ? `<a class="xlink" href="design.html#persona-${esc(p.slug)}">the full card, in Design →</a>` : '<span class="xlink dim">the full card lives in the Design space — not rendered yet</span>';
    return block({ id: `persona-${esc(p.slug)}`, title: p.name, sub: i === 0 ? 'primary' : 'secondary', cls: 'snippet', body: `<p class="who">${p.who ? inline(p.who) : '<em class="hole-text">no who line</em>'}</p>${p.context ? `<p>${inline(p.context)}</p>` : ''}<p>${link}</p>`, chip: led, src: `docs/personas/${esc(p.slug)}.md` });
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
    ? block({ id: 'model-ask', title: 'The ask', sub: 'the capital mentor\'s read', state: 'hole', body: `<p class="prompt">${inline(ask.text)}</p><span class="verb">docs/dossier/mentor-capital.md${ask.updated ? ` · ${esc(String(ask.updated).slice(0, 10))}` : ''}</span>`, src: 'docs/dossier/mentor-capital.md' })
    : hole('model-ask', 'The ask', 'Round, use of funds, the milestones the money buys — open only when the capital mentor says the raise question is live.', '/consult · mentor-capital', 'docs/dossier/mentor-capital.md — none');
  out.push(chapter('model', chapterHead(8, 'Business model', line(cell('bizmodel'))),
    '<div class="blocks">' + cellBlock(cell('bizmodel'), canvas, 'model-revenue', 'Who pays, how much') + cellBlock(cell('cost'), canvas, 'model-cost', 'What it costs to serve') + askBlock + '</div>'));

  return { before: out.slice(0, 6).join('\n'), after: out.slice(6).join('\n') };
}

export function renderPlaybookHtml(data, stampedAt) {
  const { boxes, ledger, brand, canvas, error, projectName } = data;
  const byBand = (n) => boxes.filter((b) => b.band === n && !b.floor);
  const floor = boxes.filter((b) => b.floor);
  const bandHtml = (n) => `<div class="band-title humane-only"><h3>${n} · ${esc(BANDS[n][0])}</h3><span>${esc(BANDS[n][1])}</span></div>\n` + byBand(n).map((b) => boxHtml(b, canvas)).join('\n');
  const extras = boxes.filter((b) => !b.known && ![1, 2, 3].includes(b.band));
  const ledgerLine = `<b class="tab">${ledger.backed} of ${ledger.live}</b> cells backed by graded evidence · <b>${ledger.signals}</b> signal${ledger.signals === 1 ? '' : 's'}`
    + (ledger.signals ? `, ${GRADES.every((g) => !ledger.gradeCounts[g] || g === ledger.topOverall) ? 'all' : 'top'} <b>${esc(ledger.topOverall)}</b>` : '')
    + (ledger.newestDays === null ? '' : ` · newest <b>${ledger.newestDays} day${ledger.newestDays === 1 ? '' : 's'}</b> ago`);
  const accent = brand.accent || '#16181A';
  const brandLine = brand.present
    ? `brand: ${esc(brand.name)} · docs/BRAND.md${brand.accent ? '' : ' (accent unknown → default)'}${brand.nascent ? ' · nascent' : ''}`
    : 'brand: nascent — no docs/BRAND.md yet; rendered in the default. /landing seeds it.';
  const canvasLine = canvas
    ? `docs/ideas/${esc(canvas.file)}${canvas.others.length ? ` · newest of ${canvas.others.length + 1} (${canvas.others.map(esc).join(', ')})` : ''}`
    : 'no canvas yet — this page fills itself as you answer · /canvas';
  const chapters = pitchChapters(data);
  const errorHtml = error ? `<article class="block hole" id="canvas-error"><div class="head"><h3>Couldn't read the canvas</h3></div><div class="body"><p class="prompt">${esc(error)}</p></div><div class="foot"><span class="src">the rest of the page renders from what it could read</span></div></article>` : '';

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(brand.name)} — Playbook</title>
<style>
  /* Neutral values are board.js's inlined tokens (site/styles/tokens.css is the source of truth and
     does not ship) — two generated pages in .boss/, one palette. The founder's accent is the only
     thing BRAND.md changes; with no brand the page is monochrome, and that is the design. */
  :root { --accent: ${accent}; --ground: #E4E6E8; --paper: #F0F2F3; --ink: #16181A; --ink-2: #565C62; --muted: #565C62; --hole: #8A9096; --rule: #C4C8CC; --rule-2: #D7DADD; --accent-ink: #F0F2F3; --accent-soft: color-mix(in srgb, var(--accent) 12%, var(--paper)); --chip-ev: #2F5D8A; --chip-ev-soft: #E3ECF5; --shadow: 0 1px 2px rgba(0,0,0,.06), 0 8px 24px rgba(0,0,0,.08); --display: "Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif; --body: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif; --mono: ui-monospace, "SF Mono", Menlo, Consolas, monospace; color-scheme: light; }
  @media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { --ground: #16181A; --paper: #1F2225; --ink: #E4E6E8; --ink-2: #A9B0B6; --muted: #A9B0B6; --hole: #6E767D; --rule: #3A3F44; --rule-2: #2A2E32; --accent-ink: #16181A; --chip-ev: #8FB6DD; --chip-ev-soft: #1F2E3D; --shadow: 0 1px 2px rgba(0,0,0,.4), 0 8px 24px rgba(0,0,0,.35); color-scheme: dark; } }
  :root[data-theme="dark"] { --ground: #16181A; --paper: #1F2225; --ink: #E4E6E8; --ink-2: #A9B0B6; --muted: #A9B0B6; --hole: #6E767D; --rule: #3A3F44; --rule-2: #2A2E32; --accent-ink: #16181A; --chip-ev: #8FB6DD; --chip-ev-soft: #1F2E3D; --shadow: 0 1px 2px rgba(0,0,0,.4), 0 8px 24px rgba(0,0,0,.35); color-scheme: dark; }
  * { box-sizing: border-box; } body { margin: 0; background: var(--ground); color: var(--ink); font-family: var(--body); font-size: 15.5px; line-height: 1.55; -webkit-font-smoothing: antialiased; }
  a { color: var(--accent); } h1, h2, h3 { margin: 0; font-weight: 500; text-wrap: balance; } p { margin: 0; } code { font-family: var(--mono); font-size: .9em; }
  button { font: inherit; color: inherit; background: none; border: 0; padding: 0; cursor: pointer; } button:focus-visible, a:focus-visible, [tabindex]:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; border-radius: 3px; }
  .label { font-family: var(--mono); font-size: 11px; letter-spacing: .06em; text-transform: uppercase; color: var(--muted); } .tab { font-variant-numeric: tabular-nums; }
  .topbar { position: sticky; top: 0; z-index: 20; display: flex; align-items: center; gap: 18px; padding: 10px 20px; background: color-mix(in srgb, var(--ground) 88%, transparent); backdrop-filter: blur(8px); border-bottom: 1px solid var(--rule); }
  .wordmark { font-family: var(--display); font-size: 21px; font-weight: 500; white-space: nowrap; } .wordmark .tag { font-family: var(--body); font-size: 12.5px; color: var(--muted); margin-left: 8px; }
  .ledger { margin-left: auto; font-family: var(--mono); font-size: 11.5px; color: var(--ink-2); min-width: 0; } .ledger b { color: var(--ink); font-weight: 500; }
  .seg { display: inline-flex; border: 1px solid var(--rule); border-radius: 6px; overflow: hidden; background: var(--paper); flex: none; } .seg button { padding: 5px 10px; font-size: 12px; color: var(--muted); } .seg button[aria-pressed="true"] { background: var(--accent); color: var(--accent-ink); } .seg button + button { border-left: 1px solid var(--rule); }
  .shell { display: grid; grid-template-columns: 200px minmax(0, 1fr); max-width: 1360px; margin: 0 auto; padding-inline: 20px; }
  .rail { position: sticky; top: 56px; align-self: start; height: calc(100vh - 56px); overflow: auto; padding: 28px 20px 40px 0; border-right: 1px solid var(--rule); }
  .rail .grp { font-family: var(--mono); font-size: 10px; letter-spacing: .08em; text-transform: uppercase; color: var(--accent); margin: 14px 8px 4px; }
  .rail ol { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 2px; } .rail a { display: flex; align-items: baseline; gap: 8px; padding: 6px 8px; border-radius: 5px; text-decoration: none; font-size: 14px; color: var(--ink-2); } .rail a:hover { background: var(--paper); color: var(--ink); } .rail a.on { background: var(--accent-soft); color: var(--ink); } .rail a .n { font-family: var(--mono); font-size: 11px; color: var(--muted); width: 16px; flex: none; }
  main { min-width: 0; padding: 28px 0 80px 32px; }
  .chapter { padding-block: 20px 48px; border-bottom: 1px solid var(--rule); scroll-margin-top: 70px; } .chapter:last-of-type { border-bottom: 0; }
  .blocks { display: grid; gap: 14px; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); } .blocks.one { grid-template-columns: 1fr; }
  .block .sub { font-weight: 400; color: var(--muted); } .block .helper { color: var(--muted); font-size: 13px; } .block .body ul { margin: 0; padding-left: 18px; } .block .body li + li { margin-top: 4px; } .block .body p + p, .block .body ul + p, .block .body p + ul { margin-top: 8px; }
  .block.snippet .who { font-family: var(--display); font-size: 19px; line-height: 1.3; } .xlink { font-family: var(--mono); font-size: 11.5px; } .xlink.dim { color: var(--muted); } .hole-text { color: var(--hole); }
  .tier-title { display: flex; align-items: baseline; gap: 10px; margin: 22px 0 12px; } .tier-title h3 { font-family: var(--display); font-size: 20px; } .tier-title span { font-size: 13px; color: var(--muted); }
  .tscroll { overflow-x: auto; } table.rivals { width: 100%; border-collapse: collapse; font-size: 13.5px; } table.rivals th { text-align: left; font-family: var(--mono); font-size: 10.5px; letter-spacing: .06em; text-transform: uppercase; color: var(--muted); font-weight: 500; padding: 0 10px 8px 0; border-bottom: 1px solid var(--rule); } table.rivals td { padding: 10px 10px 10px 0; border-bottom: 1px solid var(--rule-2); vertical-align: top; } table.rivals tr:last-child td { border-bottom: 0; }
  .chip.stale { background: color-mix(in srgb, #A8681A 14%, var(--paper)); color: #A8681A; } .chip.synthetic { background: var(--accent-soft); color: var(--ink-2); } .date { font-family: var(--mono); font-size: 11px; color: var(--muted); }
  .rival .win-line { font-family: var(--display); font-size: 20px; line-height: 1.25; margin-bottom: 8px; }
  @media (max-width: 980px) { .shell { grid-template-columns: 1fr; } .rail { position: static; height: auto; border-right: 0; border-bottom: 1px solid var(--rule); padding: 16px 0 12px; } .rail ol { flex-direction: row; flex-wrap: wrap; gap: 4px 6px; } main { padding-left: 0; } }

  .chapter-head { max-width: 62ch; margin-bottom: 22px; } .chapter-head .label { margin-bottom: 6px; } .chapter-head h2 { font-family: var(--display); font-size: 32px; line-height: 1.12; } .chapter-head p { margin-top: 8px; color: var(--ink-2); }
  .frame-bar { display: flex; flex-wrap: wrap; align-items: center; gap: 14px; margin-bottom: 16px; } .credit { font-family: var(--mono); font-size: 11px; color: var(--muted); }
  .canvas { display: grid; gap: 12px; grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .band-title { grid-column: 1 / -1; display: flex; align-items: baseline; gap: 10px; margin-top: 8px; } .band-title h3 { font-family: var(--display); font-size: 20px; } .band-title span { font-size: 13px; color: var(--muted); }
  .block { position: relative; display: flex; flex-direction: column; min-height: 150px; background: var(--paper); border: 1px solid var(--rule); border-radius: 8px; padding: 18px 20px 14px; scroll-margin-top: 80px; min-width: 0; }
  .block h3 { font-size: 13px; font-weight: 600; margin-bottom: 8px; } .block .body { flex: 1; font-size: 15px; line-height: 1.5; } .block .prompt { font-size: 12.5px; color: var(--muted); margin-bottom: 8px; }
  .block .answer p + p { margin-top: 8px; } .block .foot { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 12px; margin-top: 14px; padding-top: 10px; border-top: 1px solid var(--rule-2); font-family: var(--mono); font-size: 11px; color: var(--muted); } .block .src { min-width: 0; overflow-wrap: anywhere; }
  .chip { display: inline-flex; align-items: center; gap: 6px; padding: 2px 8px; border-radius: 99px; font-family: var(--mono); font-size: 10.5px; white-space: nowrap; } .chip::before { content: ""; width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
  .chip.ev { background: var(--chip-ev-soft); color: var(--chip-ev); } .chip.asserted { color: var(--muted); border: 1px solid var(--rule); } .chip.asserted::before { background: transparent; border: 1.5px solid currentColor; width: 5px; height: 5px; }
  .block.hole { border-style: dashed; background: transparent; } .block.hole .prompt { color: var(--hole); font-style: italic; font-size: 14px; } .block .verb, .block .cond { display: block; margin-top: 10px; font-family: var(--mono); font-size: 11.5px; color: var(--ink-2); }
  .block.dormant { background: transparent; } .block.dormant .prompt { color: var(--hole); font-size: 14px; }
  .block.extra h3::after { content: " · your cell"; font-weight: 400; color: var(--muted); }
  .actions { position: absolute; top: 10px; right: 10px; display: flex; gap: 2px; opacity: 0; transition: opacity .12s; background: var(--paper); border: 1px solid var(--rule); border-radius: 6px; padding: 2px; }
  .block:hover .actions, .block:focus-within .actions { opacity: 1; } @media (hover: none) { .actions { opacity: 1; } } @media (prefers-reduced-motion: reduce) { .actions { transition: none; } }
  .actions button { display: inline-flex; align-items: center; gap: 5px; padding: 4px 8px; border-radius: 4px; font-size: 11.5px; color: var(--ink-2); } .actions button:hover { background: var(--accent-soft); color: var(--ink); }
  .block.hole .actions .copy, .block.dormant .actions .copy { display: none; }
  .t-lean { display: none; }
  .canvas[data-frame="lean"] { grid-template-columns: repeat(5, minmax(0, 1fr)); grid-auto-rows: minmax(150px, auto); }
  .canvas[data-frame="lean"] .humane-only { display: none; } .canvas[data-frame="lean"] .block.floor { display: flex; }
  .canvas[data-frame="lean"] .block { grid-area: var(--area, auto); } .canvas[data-frame="lean"] .block .prompt { display: none; } .canvas[data-frame="lean"] .block.hole .prompt, .canvas[data-frame="lean"] .block.dormant .prompt { display: block; }
  .canvas[data-frame="lean"] .t-lean { display: inline; } .canvas[data-frame="lean"] .t-humane { display: none; }
  .canvas[data-frame="lean"] .band-title.floor-title { grid-area: 4 / 1 / 5 / 6; margin-top: 18px; } .canvas[data-frame="lean"] #canvas-risks { grid-area: 5 / 1 / 6 / 4; } .canvas[data-frame="lean"] #canvas-principles { grid-area: 5 / 4 / 6 / 6; }
  .canvas[data-frame="lean"] .pointer { display: flex; grid-area: ${LEAN_CHANNELS_AREA}; } .pointer { display: none; }
  .pointer .body { color: var(--ink-2); font-size: 14px; }
  footer { max-width: 1360px; margin: 0 auto; padding: 0 20px 40px; font-family: var(--mono); font-size: 11px; color: var(--muted); line-height: 1.7; }
  .deck { position: fixed; inset: 0; z-index: 50; background: var(--ink); display: grid; grid-template-rows: auto 1fr auto; padding: 16px clamp(16px, 4vw, 48px); }
  .deck .chrome, .deck .bottom { display: flex; align-items: center; gap: 14px; font-family: var(--mono); font-size: 11.5px; color: var(--muted); } .deck .chrome button { margin-left: auto; padding: 6px 10px; border: 1px solid var(--rule); border-radius: 5px; font-family: var(--body); font-size: 12.5px; color: var(--ground); }
  .deck .stage { display: grid; place-items: center; min-height: 0; position: relative; } .deck .hit { position: absolute; top: 0; bottom: 0; width: 22%; cursor: pointer; } .deck .hit.l { left: 0; } .deck .hit.r { right: 0; }
  .deck .bottom .lg { margin-left: auto; }
  .sl { width: min(100%, 1180px); aspect-ratio: 16 / 9; max-height: 100%; background: var(--paper); color: var(--ink); border-radius: 10px; box-shadow: var(--shadow); padding: clamp(28px, 4.5vw, 64px) clamp(28px, 5vw, 72px); display: flex; flex-direction: column; overflow: hidden; min-height: 0; }
  .sl .eyebrow { font-family: var(--mono); font-size: 11.5px; letter-spacing: .06em; text-transform: uppercase; color: var(--muted); margin-bottom: 14px; } .sl .eyebrow .wm { font-family: var(--display); font-size: 16px; letter-spacing: 0; text-transform: none; color: var(--ink); margin-right: 10px; }
  .sl .sl-title { font-family: var(--display); font-size: clamp(24px, 2.6vw, 38px); color: var(--ink-2); font-weight: 500; }
  .sl .sl-body { margin-top: 20px; flex: 1; min-height: 0; overflow: auto; font-family: var(--display); font-size: clamp(19px, 2.2vw, 32px); line-height: 1.32; } .sl .sl-body .prompt { display: none; } .sl.hole .sl-body .prompt, .sl.dormant .sl-body .prompt { display: block; color: var(--hole); font-style: italic; }
  .sl .sl-foot { margin-top: 18px; padding-top: 12px; border-top: 1px solid var(--rule-2); display: flex; gap: 14px; font-family: var(--mono); font-size: 11px; color: var(--muted); } .sl.hole { border: 2px dashed var(--rule); }
  .toast { position: fixed; left: 50%; bottom: 26px; transform: translateX(-50%); z-index: 60; background: var(--ink); color: var(--ground); padding: 8px 14px; border-radius: 6px; font-size: 13px; opacity: 0; transition: opacity .15s; pointer-events: none; } .toast.show { opacity: 1; }
  @media (max-width: 900px) { .canvas, .canvas[data-frame="lean"] { grid-template-columns: repeat(2, minmax(0, 1fr)); } .canvas[data-frame="lean"] .block, .canvas[data-frame="lean"] .pointer, .canvas[data-frame="lean"] .band-title.floor-title { grid-area: auto !important; } .canvas[data-frame="lean"] .band-title.floor-title { grid-column: 1 / -1; } }
  @media (max-width: 600px) { .topbar { flex-wrap: wrap; } .ledger { order: 3; flex-basis: 100%; margin-left: 0; } .canvas, .canvas[data-frame="lean"] { grid-template-columns: 1fr; } }
</style>
</head>
<body>
<header class="topbar">
  <div class="wordmark">${esc(brand.name)}${brand.tagline ? `<span class="tag">${esc(brand.tagline)}</span>` : ''}</div>
  <div class="ledger">${ledgerLine}</div>
  <div class="seg" role="group" aria-label="Frame"><button type="button" data-frame="humane" aria-pressed="true">Humane</button><button type="button" data-frame="lean" aria-pressed="false">Lean</button></div>
</header>
<div class="shell">
<nav class="rail" aria-label="Chapters">
  <div class="label">Playbook</div>
  <div class="grp">Pitch</div>
  <ol>${[['vision', 'Vision'], ['product', 'Product'], ['customers', 'Customers'], ['problem', 'Problem'], ['market', 'Market'], ['competition', 'Competition'], ['canvas', 'Canvas'], ['model', 'Business model']].map(([id, name], i) => `<li><a href="#${id}"><span class="n">${i + 1}</span>${name}</a></li>`).join('')}</ol>
</nav>
<main>
${chapters.before}
  <section class="chapter" id="canvas">
  <div class="chapter-head"><div class="label">7 · Canvas</div><p>Switch the frame and the boxes move; the words don't. A dashed box is a question nobody has answered. Two cells stay on the page in every frame.</p></div>
  <div class="frame-bar"><span class="credit" id="credit">${esc(CREDITS.humane)}</span></div>
  ${errorHtml}
  <div class="canvas" id="canvas-grid" data-frame="humane">
${bandHtml(1)}
${bandHtml(2)}
    <article class="block pointer" id="canvas-channels" data-title="Channels"><div class="head"><h3>Channels</h3></div><div class="body">Lean has a box for this; the humane canvas answers it inside <a href="#canvas-bizmodel">Business Model</a> — <em>how the first 100 find you</em>. One answer, never rendered twice.</div><div class="foot"><span class="src">canvas · Business Model</span></div></article>
${bandHtml(3)}
${extras.map((b) => boxHtml(b, canvas)).join('\n')}
    <div class="band-title floor-title"><h3>${esc(FLOOR_HEADING)}</h3><span>they render in every frame — the floor, not a footnote</span></div>
${floor.map((b) => boxHtml(b, canvas)).join('\n')}
  </div>
  </section>
${chapters.after}
</main>
</div>
<footer>
  <div>${brandLine}</div>
  <div>a read of your files — ${canvasLine} · docs/evidence · regenerated, never edited · rendered ${esc(stampedAt)} · re-run <code>boss playbook</code> to refresh</div>
  <div>coverage is a fact · readiness is a verdict this page doesn't render</div>
</footer>
<div class="toast" id="toast" role="status" aria-live="polite"></div>
<script>
function start() {
  const $ = (s, r) => (r || document).querySelector(s), $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const toastEl = $('#toast'); let toastT;
  const toast = (m) => { toastEl.textContent = m; toastEl.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => toastEl.classList.remove('show'), 1600); };
  const esc = (s) => String(s).replace(/[&<>"]/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m]));
  const grid = $('#canvas-grid'), credits = ${JSON.stringify(CREDITS)};
  $$('[data-frame]').forEach((x) => x.addEventListener('click', () => { grid.dataset.frame = x.dataset.frame; $$('[data-frame]').forEach((y) => y.setAttribute('aria-pressed', String(y === x))); $('#credit').textContent = credits[x.dataset.frame]; }));
  const ICON = { link: '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/></svg>', copy: '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h9"/></svg>', slide: '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="12" rx="2"/><path d="M8 21h8M12 17v4"/></svg>' };
  const blocks = $$('.block:not(.pointer)');
  blocks.forEach((b) => {
    const a = $('.actions', b); if (!a || a.dataset.ready) return; a.dataset.ready = '1';
    a.innerHTML = '<button type="button" class="link" title="Copy a link to this box">' + ICON.link + 'Link</button><button type="button" class="copy" title="Copy this box for a slide or doc">' + ICON.copy + 'Copy</button><button type="button" class="slide" title="Show this box as a slide">' + ICON.slide + 'Slide</button>';
    $('.link', a).addEventListener('click', () => { history.replaceState(null, '', '#' + b.id); write(location.href.replace(/#.*$/, '') + '#' + b.id, null).then(() => toast('Link copied — #' + b.id)); });
    $('.copy', a).addEventListener('click', () => write(plain(b), rich(b)).then((k) => toast(k === 'rich' ? 'Copied — pastes as text, and as a table where supported' : 'Copied as text')));
    $('.slide', a).addEventListener('click', () => openDeck(blocks.indexOf(b)));
  });
  function plain(b) { const c = b.cloneNode(true); $$('.actions, .prompt', c).forEach((x) => x.remove()); return c.innerText.replace(/\\n{3,}/g, '\\n\\n').trim(); }
  function rich(b) { const body = $('.body', b).cloneNode(true); $$('.prompt', body).forEach((x) => x.remove()); const foot = $('.foot', b).innerText.replace(/\\s+/g, ' ').trim(); return '<div style="font-family:Helvetica,Arial,sans-serif;font-size:14px;line-height:1.45"><p style="margin:0 0 6px;font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:#7C868D">' + esc(${JSON.stringify(brand.name)} + ' · ' + b.dataset.title) + '</p>' + body.innerHTML.replace(/ class="[^"]*"/g, '') + '<p style="margin:10px 0 0;font-size:10px;color:#7C868D;font-family:Menlo,Consolas,monospace">' + esc(foot) + '</p></div>'; }
  function write(text, html) {
    const plainOnly = () => navigator.clipboard ? navigator.clipboard.writeText(text).then(() => 'plain') : Promise.resolve('none');
    if (html && navigator.clipboard && window.ClipboardItem) { try { return navigator.clipboard.write([new ClipboardItem({ 'text/html': new Blob([html], { type: 'text/html' }), 'text/plain': new Blob([text], { type: 'text/plain' }) })]).then(() => 'rich').catch(plainOnly); } catch (e) { return plainOnly(); } }
    return plainOnly();
  }
  let deckEl = null, cur = 0;
  const LEDGER = $('.ledger').innerText;
  function slide(b) { const sl = document.createElement('div'); sl.className = 'sl ' + (b.classList.contains('hole') ? 'hole' : b.classList.contains('dormant') ? 'dormant' : ''); const body = $('.body', b).cloneNode(true); body.className = 'sl-body'; sl.innerHTML = '<div class="eyebrow"><span class="wm">' + esc(${JSON.stringify(brand.name)}) + '</span>' + esc((b.closest('.chapter') && $('.label', b.closest('.chapter'))) ? $('.label', b.closest('.chapter')).innerText : '') + '</div><div class="sl-title">' + esc(b.dataset.title) + '</div>'; sl.appendChild(body); sl.insertAdjacentHTML('beforeend', '<div class="sl-foot">' + ($('.chip', b) ? $('.chip', b).outerHTML : '') + '<span>' + esc($('.src', b).innerText) + '</span></div>'); return sl; }
  function openDeck(i) {
    cur = i;
    if (!deckEl) { deckEl = document.createElement('div'); deckEl.className = 'deck'; deckEl.tabIndex = -1; deckEl.setAttribute('role', 'dialog'); deckEl.innerHTML = '<div class="chrome"><span class="where"></span><button type="button" class="close">Close · Esc</button></div><div class="stage"><div class="hit l"></div><div class="hit r"></div></div><div class="bottom"><span class="pos"></span><span class="lg">' + esc(LEDGER) + '</span></div>'; document.body.appendChild(deckEl); $('.close', deckEl).addEventListener('click', closeDeck); $('.hit.l', deckEl).addEventListener('click', () => step(-1)); $('.hit.r', deckEl).addEventListener('click', () => step(1)); }
    render(); deckEl.hidden = false; document.body.style.overflow = 'hidden'; deckEl.focus({ preventScroll: true });
  }
  function render() { const st = $('.stage', deckEl); $$('.sl', st).forEach((x) => x.remove()); st.appendChild(slide(blocks[cur])); const ch2 = blocks[cur].closest('.chapter'); $('.where', deckEl).textContent = (ch2 && $('.label', ch2) ? $('.label', ch2).innerText + ' · ' : '') + blocks[cur].dataset.title; $('.pos', deckEl).textContent = (cur + 1) + ' / ' + blocks.length; }
  function step(d) { cur = (cur + d + blocks.length) % blocks.length; render(); }
  function closeDeck() { if (deckEl) { deckEl.hidden = true; document.body.style.overflow = ''; } }
  document.addEventListener('keydown', (e) => { if (!deckEl || deckEl.hidden) return; if (e.target && e.target.tagName === 'BUTTON' && (e.key === ' ' || e.key === 'Enter')) return; if (e.key === 'Escape') closeDeck(); if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); step(1); } if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); } });
  const links = $$('.rail a'), sections = $$('.chapter');
  function highlight() { const y = window.scrollY + window.innerHeight * 0.35; let id = sections[0] && sections[0].id; sections.forEach((sec) => { if (sec.offsetTop <= y) id = sec.id; }); links.forEach((l) => l.classList.toggle('on', l.getAttribute('href') === '#' + id)); }
  window.addEventListener('scroll', highlight, { passive: true }); highlight();
  if (location.hash) { const t = $(location.hash); if (t) setTimeout(() => t.scrollIntoView({ block: 'start' }), 60); }
}
(window.claude && window.claude.hot && window.claude.hot.ready) ? window.claude.hot.ready(start) : start();
</script>
</body>
</html>
`;
}

// Write the playbook to .boss/playbook.html and return its path — the board.html contract.
export function playbookHtml(projectDir, projectName) {
  const data = collectPlaybook(projectDir, projectName);
  const stampedAt = new Date().toISOString().slice(0, 16).replace('T', ' ');
  const html = renderPlaybookHtml(data, stampedAt);
  const dir = join(projectDir, '.boss');
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  const out = join(dir, 'playbook.html');
  writeFileSync(out, html);
  return { out, data };
}
