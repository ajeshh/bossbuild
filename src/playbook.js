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
  return {
    projectName,
    canvas: found ? { file: found.name, updated: parsed.updated, others: found.others } : null,
    error, boxes,
    ledger: { backed, live: live.length, signals: evidence.length, gradeCounts, topOverall, newestDays },
    brand: readBrand(projectDir, projectName),
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
  main { max-width: 1360px; margin: 0 auto; padding: 28px 20px 80px; }
  .chapter-head { max-width: 62ch; margin-bottom: 22px; } .chapter-head h2 { font-family: var(--display); font-size: 32px; line-height: 1.12; } .chapter-head p { margin-top: 8px; color: var(--ink-2); }
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
<main>
  <div class="chapter-head"><div class="label">Canvas</div><h2>One set of answers, read as boxes.</h2><p>Switch the frame and the boxes move; the words don't. A dashed box is a question nobody has answered. Two cells stay on the page in every frame.</p></div>
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
</main>
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
  function slide(b) { const sl = document.createElement('div'); sl.className = 'sl ' + (b.classList.contains('hole') ? 'hole' : b.classList.contains('dormant') ? 'dormant' : ''); const body = $('.body', b).cloneNode(true); body.className = 'sl-body'; sl.innerHTML = '<div class="eyebrow"><span class="wm">' + esc(${JSON.stringify(brand.name)}) + '</span>canvas</div><div class="sl-title">' + esc(b.dataset.title) + '</div>'; sl.appendChild(body); sl.insertAdjacentHTML('beforeend', '<div class="sl-foot">' + ($('.chip', b) ? $('.chip', b).outerHTML : '') + '<span>' + esc($('.src', b).innerText) + '</span></div>'); return sl; }
  function openDeck(i) {
    cur = i;
    if (!deckEl) { deckEl = document.createElement('div'); deckEl.className = 'deck'; deckEl.tabIndex = -1; deckEl.setAttribute('role', 'dialog'); deckEl.innerHTML = '<div class="chrome"><span class="where"></span><button type="button" class="close">Close · Esc</button></div><div class="stage"><div class="hit l"></div><div class="hit r"></div></div><div class="bottom"><span class="pos"></span><span class="lg">' + esc(LEDGER) + '</span></div>'; document.body.appendChild(deckEl); $('.close', deckEl).addEventListener('click', closeDeck); $('.hit.l', deckEl).addEventListener('click', () => step(-1)); $('.hit.r', deckEl).addEventListener('click', () => step(1)); }
    render(); deckEl.hidden = false; document.body.style.overflow = 'hidden'; deckEl.focus({ preventScroll: true });
  }
  function render() { const st = $('.stage', deckEl); $$('.sl', st).forEach((x) => x.remove()); st.appendChild(slide(blocks[cur])); $('.where', deckEl).textContent = 'canvas · ' + blocks[cur].dataset.title; $('.pos', deckEl).textContent = (cur + 1) + ' / ' + blocks.length; }
  function step(d) { cur = (cur + d + blocks.length) % blocks.length; render(); }
  function closeDeck() { if (deckEl) { deckEl.hidden = true; document.body.style.overflow = ''; } }
  document.addEventListener('keydown', (e) => { if (!deckEl || deckEl.hidden) return; if (e.target && e.target.tagName === 'BUTTON' && (e.key === ' ' || e.key === 'Enter')) return; if (e.key === 'Escape') closeDeck(); if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); step(1); } if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); } });
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
