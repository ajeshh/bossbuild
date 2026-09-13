// design — the design space: a founder's design system, drawn as one page under .boss/ (FEAT-030).
//
// Slice 1 renders the language and the frame: Start here (the brand), Principles (the style guide's
// slot, with the grounding marked), Colour (every semantic token as a swatch, the DEC that chose
// it, and the contrast COMPUTED for every declared text-on-surface pair), Type, Space & shape, and
// Layout as the hole it is. A sibling of `boss playbook` over the same shell (page-shell.js).
//
// The same contract as the playbook: a pure projection of the files, regenerated never edited,
// nothing written under docs/, every hole a hole. The one thing this page does that a gallery
// doesn't: contrast is arithmetic over two numbers, so it is computed here — once, where the
// tokens are defined — and the page says once that it checks the declared pairs, not what renders.
//
// Every value copies. A swatch offers hex · token name · var(--…); a type role its stack or token;
// a spacing step px or token. The copy sheet shows the payload (page-shell.js).
//
// Slice 2 (FEAT-031) opens with the people: personas as full cards, the journey with its source
// labels, research by rung and by method — never a quote. Slice 3 (FEAT-032) adds the parts:
// components (the index as written or generated, a definition-of-done row, Code and SVG on the
// card — the SVG is a spec frame in the project's tokens, never a render), patterns with the
// anti-pattern beside the rule, flows with the cut test, content as the real strings, and an
// accessibility chapter that computes the one thing that is arithmetic and says *not checked*
// once for everything that needs a person.

import { readFileSync, readdirSync, existsSync, mkdirSync, writeFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { frontmatter } from './frontmatter.js';
import { isRegistered } from './hooks.js';
import { readBrand, verbLine } from './playbook.js';
import { esc, shellPage } from './page-shell.js';

// --- tokens: docs/design/tokens.json (DTCG) first; DESIGN_TOKENS.md names as the fallback --------

export function readTokens(projectDir) {
  const out = { source: null, tokens: [], error: null };
  const jsonPath = join(projectDir, 'docs', 'design', 'tokens.json');
  if (existsSync(jsonPath)) {
    out.source = 'docs/design/tokens.json';
    try {
      const tree = JSON.parse(readFileSync(jsonPath, 'utf8'));
      const walk = (node, path) => {
        if (!node || typeof node !== 'object' || Array.isArray(node)) return;
        if ('$value' in node) {
          out.tokens.push({ name: path.join('.'), family: path[0] || '', type: node.$type || inferType(node.$value), value: node.$value, description: node.$description || '', deprecated: node.$deprecated || null });
          return;
        }
        for (const k of Object.keys(node)) if (!k.startsWith('$')) walk(node[k], path.concat(k));
      };
      walk(tree, []);
    } catch (e) { out.error = `docs/design/tokens.json did not parse as JSON (${e.message}) — nothing under Colour, Type or Space can be trusted until it does.`; }
    return out;
  }
  const mdPath = join(projectDir, 'docs', 'design', 'DESIGN_TOKENS.md');
  if (existsSync(mdPath)) {
    out.source = 'docs/design/DESIGN_TOKENS.md';
    let text = '';
    try { text = readFileSync(mdPath, 'utf8'); } catch { return out; }
    // Names only — the markdown is the human spec, and a value read out of prose is a guess.
    // `/design-tokens-init` writes tokens.json always since the release after 0.325.0.
    for (const m of text.matchAll(/`((?:color|colour|font|type|space|spacing|radius|shadow|elevation|motion)\.[\w.-]+)`/g)) {
      if (!out.tokens.some((t) => t.name === m[1])) out.tokens.push({ name: m[1], family: m[1].split('.')[0], type: null, value: null, description: '', deprecated: null });
    }
  }
  return out;
}

function inferType(v) {
  if (typeof v === 'string' && /^#[0-9a-f]{3,8}$/i.test(v)) return 'color';
  if (v && typeof v === 'object' && 'unit' in v) return 'dimension';
  if (Array.isArray(v)) return 'fontFamily';
  return null;
}

export const dim = (v) => (v && typeof v === 'object' && 'value' in v) ? `${v.value}${v.unit || ''}` : (v == null ? '' : String(v));
export const cssVar = (name) => `--${name.replace(/\./g, '-')}`;

// --- contrast: WCAG 2.x relative luminance — a published formula over two numbers ----------------

export function luminance(hex) {
  const c = hex.replace('#', '');
  const full = c.length === 3 ? c.split('').map((x) => x + x).join('') : c.slice(0, 6);
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(full.substr(i, 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
export function contrast(a, b) { const x = luminance(a), y = luminance(b); return Math.round(((Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05)) * 100) / 100; }
export function grade(ratio) { return ratio >= 4.5 ? 'AA' : ratio >= 3 ? 'AA-large' : 'fails'; }

// Declared pairs only. A "text-like" token (text.*, *.on-<x>, ink) against every "surface-like"
// token (surface.*, ground, paper, background), and each `on-<x>` against its own `<x>`. Never
// every colour against every colour — that produces a wall of numbers nobody declared.
export function contrastPairs(tokens) {
  const colors = tokens.filter((t) => t.type === 'color' && typeof t.value === 'string' && /^#[0-9a-f]{6}$/i.test(t.value));
  const isText = (n) => /(^|\.)(text|ink|foreground|fg)(\.|$)/i.test(n) || /(^|\.)on-[\w-]+$/i.test(n);
  const isSurface = (n) => /(^|\.)(surface|ground|paper|background|bg|canvas)(\.|$)/i.test(n);
  const pairs = [];
  for (const t of colors) {
    if (!isText(t.name)) continue;
    const onMatch = t.name.match(/(.*)\.on-([\w-]+)$/i);
    if (onMatch) {
      const base = colors.find((c) => c.name === `${onMatch[1]}.${onMatch[2]}`);
      if (base) pairs.push({ text: t, on: base });
      continue;
    }
    for (const s of colors) if (isSurface(s.name)) pairs.push({ text: t, on: s });
  }
  return pairs.map((p) => ({ ...p, ratio: contrast(p.text.value, p.on.value) })).map((p) => ({ ...p, grade: grade(p.ratio) }));
}

// --- decisions: which DEC named which token ---------------------------------------------------------

export function readDecisions(projectDir) {
  const dir = join(projectDir, 'docs', 'decisions');
  const decs = [];
  if (!existsSync(dir)) return decs;
  for (const f of readdirSync(dir).filter((x) => /^DEC-\d+.*\.md$/.test(x)).sort()) {
    let text = '';
    try { text = readFileSync(join(dir, f), 'utf8'); } catch { continue; }
    const fm = frontmatter(text);
    decs.push({ id: (f.match(/^DEC-\d+/) || [f])[0], file: f, text, revisit: fm.revisit_by || null, title: (text.match(/^#\s+(.+)$/m) || [])[1] || f });
  }
  return decs;
}
export function decFor(decs, tokenName) {
  return decs.find((d) => d.text.includes(`\`${tokenName}\``) || d.text.includes(cssVar(tokenName))) || null;
}

// --- the style guide: principles (the slot) and the layout section (present or a hole) ------------

export function readStyleGuide(projectDir) {
  const out = { present: false, principles: [], layout: false, text: '' };
  const p = join(projectDir, 'docs', 'design', 'STYLE_GUIDE.md');
  if (!existsSync(p)) return out;
  let text = '';
  try { text = readFileSync(p, 'utf8'); } catch { return out; }
  out.present = true; out.text = text;
  const sec = section(text, /^##\s+design principles/i);
  if (sec) {
    for (const block of sec.split(/^###\s+/m).slice(1)) {
      const title = block.split('\n')[0].replace(/^\d+\.\s*/, '').trim();
      if (!title || /^<.*>$/.test(title)) continue; // the template's placeholder heading
      const part = (label) => { const m = block.match(new RegExp(`^-\\s*\\*\\*${label}:?\\*\\*\\s*([\\s\\S]*?)(?=^-\\s*\\*\\*|\\n\\n|$)`, 'im')); return m ? m[1].replace(/\s+/g, ' ').trim() : ''; };
      const why = part('Why'), guideline = part('Guideline'), rules = part('Rules'), wrongIf = part('Wrong if'), statement = part('Statement'), grounded = part('Grounded in');
      const filled = (s) => s && !/^<.*>$/.test(s);
      // Grounding is a REFERENCE — an EVID id, a persona file, a journey stage — not the word
      // "evidence". A principle can say "users told us" and still be a guess.
      const groundedIn = filled(grounded) ? grounded : '';
      const refs = block.match(/EVID-\d+|docs\/personas\/[\w-]+|docs\/product\/JOURNEY|journey stage \d+/gi) || [];
      out.principles.push({ title, statement: filled(statement) ? statement : '', why: filled(why) ? why : '', guideline: filled(guideline) ? guideline : '', rules: filled(rules) ? rules : '', wrongIf: filled(wrongIf) ? wrongIf : '', groundedIn, refs: [...new Set(refs)], grounded: Boolean(groundedIn || refs.length) });
    }
  }
  const lay = section(text, /^##\s+layout/i);
  out.layout = Boolean(lay && lay.replace(/<[^>]*>/g, '').trim().split('\n').slice(1).join(' ').replace(/[\s|_-]/g, '').length > 40);
  // The content half and the rule rung — tables the template seeds with <placeholders>, which read
  // as empty; a row counts only when its cells are the founder's own.
  out.doDont = []; out.terms = []; out.tone = []; out.fiveStates = {};
  for (const t of mdTables(text)) {
    if (t.col(/^do$/) >= 0 && t.col(/^don'?t$/) >= 0) { const iD = t.col(/^do$/), iN = t.col(/^don'?t$/), iB = t.col(/because/); for (const r of t.rows) { const d = clean(r[iD]); if (d) out.doDont.push({ do: d, dont: clean(r[iN]), because: iB >= 0 ? clean(r[iB]) : '' }); } }
    else if (t.col(/^use$/) >= 0 && t.col(/^never$/) >= 0) { const iU = t.col(/^use$/), iN = t.col(/^never$/), iB = t.col(/because/); for (const r of t.rows) { const u = clean(r[iU]); if (u) out.terms.push({ use: u, never: clean(r[iN]), because: iB >= 0 ? clean(r[iB]) : '' }); } }
    else if (t.col(/^context$/) >= 0 && t.col(/real string/) >= 0) { const iC = t.col(/^context$/), iH = t.col(/shifts|how/), iS = t.col(/real string/); for (const r of t.rows) { const c = clean(r[iC]); if (c) out.tone.push({ context: c, shift: iH >= 0 ? clean(r[iH]) : '', string: clean(r[iS]) }); } }
    else if (t.col(/^default$/) >= 0 && t.col(/^hover$/) >= 0) { const iC = t.col(/component/); for (const r of t.rows) { const name = clean(r[iC]); if (!name) continue; const st = {}; for (const k of ['default', 'hover', 'active', 'disabled', 'empty']) { const i = t.header.findIndex((h) => h.startsWith(k)); const v = i >= 0 ? String(r[i] || '').trim() : ''; st[k] = /n\/a/i.test(v) ? 'n/a' : /✓|yes|x/i.test(v) ? true : /^[—–-]+$/.test(v) ? false : null; } out.fiveStates[name] = st; } }
  }
  const voiceSec = section(text, /^##\s+voice in the interface/i) || '';
  const traitsPart = (voiceSec.split(/\*\*tone by context/i)[0] || '').split(/\*\*voice\s*[—-]/i)[1] || '';
  out.voiceTraits = traitsPart.split(/\r?\n/).filter((l) => /^\s*[-*]\s+/.test(l)).map((l) => l.replace(/^\s*[-*]\s+/, '').replace(/\*\*/g, '').trim()).filter((l) => l && !/<[^>]*>/.test(l));
  out.surfaces = (voiceSec.match(/^-\s*\*\*(Buttons|Errors|Empty states):\*\*\s*(.+)$/gim) || []).map((l) => { const m = l.match(/\*\*(.+?):\*\*\s*(.+)$/); return { surface: m[1], rule: clean(m[2]) }; }).filter((x) => x.rule);
  out.voiceDeferred = !out.voiceTraits.length && !out.tone.some((t) => t.string) && !out.surfaces.length;
  const floorSec = section(text, /^##\s+accessibility floor/i);
  out.floor = floorSec ? floorSec.split(/\r?\n/).slice(1).map((l) => l.replace(/^\s*[-*]\s+/, '').trim()).filter((l) => l && !/^<.*>$/.test(l) && !/^#/.test(l)) : [];
  return out;
}
function section(text, headingRe) {
  const lines = text.split(/\r?\n/);
  const i = lines.findIndex((l) => headingRe.test(l));
  if (i < 0) return null;
  const level = (lines[i].match(/^#+/) || ['##'])[0].length;
  let j = i + 1;
  while (j < lines.length && !(new RegExp(`^#{1,${level}}\\s`).test(lines[j]))) j++;
  return lines.slice(i, j).join('\n');
}

// --- the brand's current shape: the six lines /landing seeds, each present or its own hole ------

const BRAND_LINES = [['Who it\'s for', /who it'?s for/i], ['What it promises', /what it promises/i], ['What it refuses', /what it refuses/i], ['How it sounds', /how it sounds/i], ['What it is NOT', /what it is not/i], ['The name, and why', /the name(, and why)?/i]];
export function readBrandShape(projectDir) {
  const p = join(projectDir, 'docs', 'BRAND.md');
  const shape = { present: existsSync(p), lines: [], updated: null };
  if (!shape.present) return shape;
  let text = '';
  try { text = readFileSync(p, 'utf8'); } catch { return shape; }
  shape.updated = frontmatter(text).updated || null;
  for (const [label, re] of BRAND_LINES) {
    const m = text.match(new RegExp(`^(?:[-*]\\s*)?\\*\\*(${re.source})[:*]*\\*\\*:?\\s*(.+)$`, 'im')) || text.match(new RegExp(`^#{2,4}\\s+(${re.source})[^\\n]*\\n+([^\\n#]+)`, 'im'));
    const v = m ? m[2].trim() : '';
    shape.lines.push({ label, value: v && !/^unknown\b|^_?\(not yet\)_?|^<.*>$/i.test(v) ? v : null });
  }
  return shape;
}

// --- people: docs/personas/<slug>.md as /persona writes it — six labelled lines and a ledger ---------
// A field is a labelled line (`who — …`, `**who**: …`, `## Jobs`) and, where the value is a list,
// the bullets under it up to the next label. A field that isn't there is a hole on the card.

const PERSONA_FIELDS = [['who', /who/i], ['context', /context/i], ['jobs', /jobs/i], ['pains', /pains/i], ['values', /values/i], ['unknowns', /what we don'?t know( yet)?/i]];
export function readPersonasFull(projectDir) {
  const dir = join(projectDir, 'docs', 'personas');
  if (!existsSync(dir)) return [];
  const out = [];
  for (const n of readdirSync(dir).filter((x) => /\.md$/i.test(x) && !/^README/i.test(x)).sort()) {
    let text = '';
    try { text = readFileSync(join(dir, n), 'utf8'); } catch { continue; }
    const fm = frontmatter(text);
    const lines = text.split(/\r?\n/);
    // A label is the field word followed by a separator (— : ** or the end of the line) — never
    // prose: `- who does the rota when she is away?` is a bullet under "unknowns", not a `who`.
    const labelRe = (re) => new RegExp(`^(?:#{1,4}\\s*|[-*]\\s*)?(?:\\*\\*)?\\s*(${re.source})(?:\\*\\*)?\\s*(?:[—:–-]|\\*\\*|$)`, 'i');
    const isLabel = (l) => PERSONA_FIELDS.some(([, re]) => labelRe(re).test(l)) || /^evidence ledger/i.test(l) || /^#{1,3}\s/.test(l);
    const fields = {};
    for (const [key, re] of PERSONA_FIELDS) {
      const i = lines.findIndex((l) => labelRe(re).test(l));
      if (i < 0) { fields[key] = null; continue; }
      const head = lines[i].replace(new RegExp(`^(?:#{1,4}\\s*|[-*]\\s*)?(?:\\*\\*)?\\s*(${re.source})(?:\\*\\*)?[^\\w"(]*`, 'i'), '').trim();
      const items = [];
      for (let j = i + 1; j < lines.length && !isLabel(lines[j]); j++) { const m = lines[j].match(/^\s*[-*]\s+(.+)$/); if (m) items.push(m[1].trim()); else if (lines[j].trim() && !items.length && !head) items.push(lines[j].trim()); }
      const value = head ? (items.length ? [head, ...items] : head) : (items.length ? items : null);
      fields[key] = value && String(value).length && !/^<.*>$/.test(String(value)) ? value : null;
    }
    const ledger = text.match(/synthetic\s*<?(\d+)%?>?\s*[·,]\s*real\s*<?(\d+)%?>?/i);
    const title = (text.match(/^#\s+(.+)$/m) || [null, ''])[1].trim();
    out.push({ slug: n.replace(/\.md$/i, ''), name: String(fm.name || title || n.replace(/\.md$/i, '')).replace(/^persona\s*[—:-]\s*/i, '').trim(), primary: /primary/i.test(String(fm.role || fm.kind || fm.primary || '')), created: fm.created || null, updated: fm.updated || null, synthetic: ledger ? parseInt(ledger[1], 10) : null, real: ledger ? parseInt(ledger[2], 10) : null, ...fields });
  }
  out.sort((a, b) => (b.primary - a.primary) || (Date.parse(a.created || '') || 0) - (Date.parse(b.created || '') || 0));
  if (out.length && !out.some((p) => p.primary)) out[0].primary = true;
  return out;
}

// --- the journey: docs/product/JOURNEY.md — the stage table, the gaps, and every row's source label -
export function readJourney(projectDir) {
  const p = join(projectDir, 'docs', 'product', 'JOURNEY.md');
  const out = { present: existsSync(p), stages: [], gaps: [], updated: null };
  if (!out.present) return out;
  let text = '';
  try { text = readFileSync(p, 'utf8'); } catch { return out; }
  out.updated = frontmatter(text).updated || null;
  const rows = text.split(/\r?\n/).filter((l) => /^\|/.test(l));
  const header = rows.find((l) => /stage/i.test(l));
  if (header) {
    const cols = header.split('|').slice(1, -1).map((c) => c.trim().toLowerCase());
    const col = (re) => cols.findIndex((c) => re.test(c));
    const iStage = col(/^stage/), iDo = col(/trying/), iMeet = col(/meet/), iFlow = col(/flow/), iLeave = col(/leave/), iSrc = col(/source/);
    for (const r of rows.slice(rows.indexOf(header) + 1)) {
      if (/^\|\s*-{2,}/.test(r)) continue;
      const cells = r.split('|').slice(1, -1).map((c) => c.trim());
      if (!cells[iStage]) continue;
      const src = (cells[iSrc] || '').toLowerCase();
      out.stages.push({ stage: cells[iStage], doing: cells[iDo] || '', meets: cells[iMeet] || '', flow: cells[iFlow] || '', leaves: cells[iLeave] || '', source: /observ/.test(src) ? 'observed' : /said|interview|stated/.test(src) ? 'said' : /assum/.test(src) ? 'assumed' : null });
    }
  }
  const gaps = section(text, /^##\s+the gaps/i);
  if (gaps) out.gaps = gaps.split(/\r?\n/).slice(1).map((l) => l.replace(/^\s*[-*]\s+/, '').trim()).filter((l) => l && !/^<.*>$/.test(l));
  return out;
}

// --- research: the EVID ledger by rung and by method — grades, dates, methods; never a quote ----------
export const METHODS = [
  ['interview', 'Interviews', 'stated', '/interview · /evidence'],
  ['observation', 'Watching someone use it', 'observed', '/interview → the last question: "could I sit with you?"'],
  ['metric', 'Product events · drop-off', 'observed', '/measure — a few events, not ten'],
  ['pretotype', 'A pretotype (fake door · concierge)', 'observed', '/pretotype'],
  ['commitment-test', 'A commitment asked for', 'observed', '/money · the ask at the end of a call'],
  ['desk', 'Desk · competitive', 'inferred', '/comp-eval'],
  ['heuristic', 'Heuristic review', 'inferred', '/design-review · /ux-check'],
];
export function readResearch(projectDir) {
  const dir = join(projectDir, 'docs', 'evidence');
  const evid = [];
  if (existsSync(dir)) {
    for (const n of readdirSync(dir).filter((x) => /^EVID-\d+.*\.md$/i.test(x)).sort()) {
      try {
        const text = readFileSync(join(dir, n), 'utf8'); const fm = frontmatter(text);
        const dateIn = (v) => (String(v || '').match(/\d{4}-\d{2}-\d{2}/) || [null])[0];
        evid.push({ id: fm.id || n.replace(/\.md$/i, ''), grade: String(fm.grade || '').trim().toLowerCase() || null, method: String(fm.method || '').trim().toLowerCase() || null, date: dateIn(fm.date) || dateIn(fm.created) || null, assumption: String(fm.assumption || '').trim(), title: ((text.match(/^#\s+(?:EVID-\d+\s*[—-]\s*)?(.+)$/m) || [])[1] || '').trim() });
      } catch { /* unreadable is not a signal */ }
    }
  }
  const rung = (g) => (g === 'commitment' || g === 'observed-behavior') ? 'observed' : g === 'stated-pain' ? 'stated' : null;
  const byRung = { observed: evid.filter((e) => rung(e.grade) === 'observed'), stated: evid.filter((e) => rung(e.grade) === 'stated'), ungraded: evid.filter((e) => !rung(e.grade)) };
  const uxChecks = existsSync(join(projectDir, 'docs', 'design')) ? readdirSync(join(projectDir, 'docs', 'design')).filter((x) => /^ux-check-.*\.md$/i.test(x)).length : 0;
  const reviews = existsSync(join(projectDir, 'docs', 'design', 'reviews')) ? readdirSync(join(projectDir, 'docs', 'design', 'reviews')).filter((x) => /\.md$/i.test(x)).length : 0;
  const desk = existsSync(join(projectDir, 'docs', 'competition', 'README.md'));
  const byMethod = METHODS.map(([key, label, r, verb]) => {
    const used = key === 'desk' ? (desk ? 1 : 0) : key === 'heuristic' ? uxChecks + reviews : evid.filter((e) => e.method === key).length;
    return { key, label, rung: r, verb, used };
  });
  const newest = evid.map((e) => e.date).filter(Boolean).sort().pop() || null;
  return { evid, byRung, byMethod, newest };
}

// --- markdown tables, generically: header · rows · the heading they sit under ------------------------
// Every design file BOSS writes is tables under headings, so one reader serves the index, the
// pattern set, the flow index and the style guide's content half. A cell is text; `**`, backticks
// and the template's `<placeholder>` are stripped, and a placeholder cell reads as empty.

const cellsOf = (l) => l.split('|').slice(1, -1).map((c) => c.trim());
export const clean = (c) => { const s = String(c ?? '').replace(/\*\*/g, '').replace(/`/g, '').trim(); return /^<.*>$/.test(s) || /^\*\(.*\)\*$/.test(s) || /^\(.*lands here.*\)$/i.test(s) ? '' : s; };
export function mdTables(text) {
  const lines = text.split(/\r?\n/); const out = []; let heading = '', level = 0;
  for (let i = 0; i < lines.length; i++) {
    const h = lines[i].match(/^(#{1,4})\s+(.+)$/); if (h) { heading = h[2].trim(); level = h[1].length; continue; }
    if (/^\|/.test(lines[i]) && /^\|\s*:?-{2,}/.test(lines[i + 1] || '')) {
      const header = cellsOf(lines[i]).map((c) => c.toLowerCase()); const rows = []; let j = i + 2;
      while (j < lines.length && /^\|/.test(lines[j])) { rows.push(cellsOf(lines[j])); j++; }
      out.push({ heading, level, header, rows, col: (re) => header.findIndex((c) => re.test(c)) });
      i = j - 1;
    }
  }
  return out;
}

// --- components: the manifest at V1 (generated), COMPONENTS.md at MVP (authored) ---------------------
// The manifest supersedes the index — both on disk is the two-definitions-of-a-button trap the
// skill refuses, so it is reported, not silently resolved. A card copies what is on disk: the import
// line, and the source file when the manifest names it or the import line resolves to a real file.

const SRC_EXT = ['.tsx', '.ts', '.jsx', '.js', '.mjs', '.vue', '.svelte', '.astro'];
export function resolveImport(projectDir, importLine) {
  const m = String(importLine || '').match(/from\s+['"]([^'"]+)['"]|import\s+['"]([^'"]+)['"]|require\(\s*['"]([^'"]+)['"]\s*\)/);
  const spec = m && (m[1] || m[2] || m[3]);
  if (!spec) return null;
  // Aliases that mean the source root; a relative specifier is relative to a consumer we don't know.
  const base = spec.startsWith('@/') || spec.startsWith('~/') ? `src/${spec.slice(2)}` : /^\.\.?\//.test(spec) ? null : spec;
  if (!base) return null;
  const leaf = base.split('/').pop();
  const candidates = [base, ...SRC_EXT.map((e) => base + e), ...SRC_EXT.map((e) => `${base}/index${e}`), ...SRC_EXT.map((e) => `${base}/${leaf}${e}`)];
  for (const c of candidates) { const p = join(projectDir, c); if (existsSync(p) && statSync(p).isFile()) return c; }
  return null;
}
function parseStatus(s) {
  const t = clean(s);
  const dep = t.match(/deprecated\s*(?:→|->|:)?\s*([\w.-]+)?/i);
  if (dep) return { status: 'deprecated', replacedBy: dep[1] || null };
  const w = (t.match(/^[a-z-]+/i) || [''])[0].toLowerCase();
  return { status: w || 'unstated', replacedBy: null };
}
const SOURCE_CAP = 32 * 1024;
function sourceText(projectDir, rel) {
  if (!rel) return null;
  try { const t = readFileSync(join(projectDir, rel), 'utf8'); return t.length > SOURCE_CAP ? null : t; } catch { return null; }
}
export function readComponents(projectDir) {
  const out = { source: null, both: false, generated: null, updated: null, components: [], api: [], retired: [], error: null };
  const mPath = join(projectDir, 'docs', 'design', 'library', 'manifest.json');
  const cPath = join(projectDir, 'docs', 'design', 'COMPONENTS.md');
  out.both = existsSync(mPath) && existsSync(cPath);
  if (existsSync(mPath)) {
    out.source = 'docs/design/library/manifest.json';
    try {
      const m = JSON.parse(readFileSync(mPath, 'utf8'));
      out.generated = m.generated || null;
      for (const c of m.components || []) {
        if (!c || !c.name) continue;
        const states = c.states && typeof c.states === 'object' ? c.states : null;
        const missing = states ? Object.keys(states).filter((k) => states[k] === false) : null;
        const source = c.source && existsSync(join(projectDir, c.source)) ? c.source : null;
        let stale = null;
        if (source && c.sourceHash) stale = createHash('sha256').update(readFileSync(join(projectDir, c.source))).digest('hex').slice(0, String(c.sourceHash).length) !== String(c.sourceHash);
        const st = parseStatus(c.status || (c.usedIn === 0 ? 'unused' : 'stable'));
        out.components.push({ name: String(c.name), purpose: c.purpose || '', import: c.import || '', variants: Array.isArray(c.variants) ? c.variants.map(String) : [], states, missing, status: st.status, replacedBy: st.replacedBy, usedIn: typeof c.usedIn === 'number' ? c.usedIn : null, findings: (c.findings || []).map((f) => ({ severity: f.severity || '', kind: f.kind || '', detail: f.detail || '' })), source, sourceText: sourceText(projectDir, source), stale });
      }
      for (const r of m.retired || []) if (r && r.name) out.retired.push({ name: String(r.name), why: r.why || r.reason || '', on: r.on || '' });
    } catch (e) { out.error = `docs/design/library/manifest.json did not parse as JSON (${e.message}) — the component index cannot be trusted until it does.`; }
    return out;
  }
  if (!existsSync(cPath)) return out;
  out.source = 'docs/design/COMPONENTS.md';
  let text = '';
  try { text = readFileSync(cPath, 'utf8'); } catch { return out; }
  out.updated = frontmatter(text).updated || null;
  for (const t of mdTables(text)) {
    const iName = t.col(/^component/), iImport = t.col(/import/), iPurpose = t.col(/for|purpose/), iVar = t.col(/variant/), iMiss = t.col(/missing/), iStatus = t.col(/status/);
    if (iName >= 0 && iImport >= 0) {
      for (const r of t.rows) {
        const name = clean(r[iName]); if (!name) continue;
        const missCell = iMiss >= 0 ? String(r[iMiss] ?? '').trim() : '';
        // Blank is not a dash: a dash says none missing; blank says nobody checked (the template's rule).
        const missing = iMiss < 0 || missCell === '' ? null : /^[—–-]+$/.test(missCell) ? [] : missCell.split(/[·,]/).map(clean).filter(Boolean);
        const st = parseStatus(iStatus >= 0 ? r[iStatus] : '');
        const imp = clean(r[iImport]);
        const source = resolveImport(projectDir, imp);
        const varCell = iVar >= 0 ? clean(r[iVar]) : '';
        out.components.push({ name, purpose: iPurpose >= 0 ? clean(r[iPurpose]) : '', import: imp, variants: /^[—–-]*$/.test(varCell) ? [] : varCell.split(/[·,]/).map((v) => v.trim()).filter(Boolean), states: null, missing, status: st.status, replacedBy: st.replacedBy, usedIn: null, findings: [], source, sourceText: sourceText(projectDir, source), stale: null });
      }
    } else if (t.col(/concept/) >= 0) {
      const iC = t.col(/concept/), iW = t.col(/call it|use/), iN = t.col(/never/);
      for (const r of t.rows) { const concept = clean(r[iC]); if (concept) out.api.push({ concept, word: clean(r[iW]), never: clean(r[iN]) }); }
    } else if (t.col(/why retired/) >= 0) {
      const iN = t.col(/^component/), iW = t.col(/why retired/), iO = t.col(/^on/);
      for (const r of t.rows) { const name = clean(r[iN]); if (name) out.retired.push({ name, why: clean(r[iW]), on: clean(r[iO]) }); }
    }
  }
  return out;
}

// The spec frame: what SVG on a component card copies. A frame — name, purpose, variants, the five
// states as filled or missing boxes — drawn in the project's own tokens so a design tool pastes it as
// editable layers. Never a render of the component: nothing here runs the code, and the frame says so.
const FIVE = ['default', 'hover', 'active', 'disabled', 'empty'];
export function specFrameSvg(c, tokens) {
  const hexOf = (re, fallback) => { const t = tokens.find((x) => x.type === 'color' && re.test(x.name) && typeof x.value === 'string' && /^#[0-9a-f]{6}$/i.test(x.value)); return t ? t.value : fallback; };
  const paper = hexOf(/(^|\.)(paper|card|elevated)$/i, hexOf(/(^|\.)(surface|paper|background|bg|canvas)(\.|$)/i, '#FFFFFF'));
  const ink = hexOf(/(^|\.)(text|ink|foreground|fg)\.(primary|body|default|base)$|(^|\.)ink$/i, '#16181A');
  const muted = hexOf(/(^|\.)(text|ink)\.(muted|secondary|subtle)$/i, '#8A9096');
  const accent = hexOf(/(^|\.)(action|accent|brand|primary)(\.primary)?$|(^|\.)action\.primary$/i, '#16181A');
  const rule = hexOf(/(^|\.)(border|rule|line|stroke)(\.|$)/i, '#C4C8CC');
  const fams = tokens.filter((x) => x.type === 'fontFamily' && Array.isArray(x.value));
  const fam = fams.find((x) => /body|text|ui|sans/i.test(x.name)) || fams[0];
  const font = (fam ? fam.value : ['Helvetica Neue', 'Arial', 'sans-serif']).join(', ').replace(/"/g, "'");
  const W = 360, pad = 16;
  const vars = c.variants.length ? c.variants : [];
  const states = FIVE.map((k) => ({ k, v: c.states ? (c.states[k] === true ? 'yes' : c.states[k] === false ? 'no' : c.states[k] === 'n/a' ? 'na' : 'unknown') : c.missing === null ? 'unknown' : c.missing.some((m) => new RegExp(k, 'i').test(m)) ? 'no' : 'yes' }));
  let y = pad;
  const el = [];
  const t = (x, yy, s, size, weight, fill, extra = '') => el.push(`<text x="${x}" y="${yy}" font-family="${esc(font)}" font-size="${size}" font-weight="${weight}" fill="${fill}"${extra}>${esc(s)}</text>`);
  y += 18; t(pad, y, c.name, 16, 600, ink, ' id="name"');
  if (c.purpose) { y += 18; t(pad, y, c.purpose.length > 56 ? c.purpose.slice(0, 54) + '…' : c.purpose, 11, 400, muted, ' id="purpose"'); }
  if (vars.length) {
    y += 16; let x = pad;
    el.push(`<g id="variants">`);
    for (const v of vars) { const w = Math.round(v.length * 6.4) + 16; el.push(`<rect x="${x}" y="${y}" width="${w}" height="20" rx="10" fill="none" stroke="${accent}"/>`); t(x + w / 2, y + 13.5, v, 10.5, 500, accent, ' text-anchor="middle"'); x += w + 6; }
    el.push('</g>'); y += 20;
  }
  y += 16; t(pad, y, 'five states', 9.5, 500, muted, ' letter-spacing=".06em"');
  y += 8; const bw = (W - pad * 2 - 4 * 6) / 5;
  el.push('<g id="states">');
  states.forEach((s, i) => { const x = pad + i * (bw + 6);
    el.push(s.v === 'yes' ? `<rect x="${x}" y="${y}" width="${bw}" height="34" rx="4" fill="${accent}"/>` : s.v === 'na' ? `<rect x="${x}" y="${y}" width="${bw}" height="34" rx="4" fill="none" stroke="${rule}"/>` : `<rect x="${x}" y="${y}" width="${bw}" height="34" rx="4" fill="none" stroke="${s.v === 'no' ? accent : rule}" stroke-dasharray="3 3"/>`);
    if (s.v === 'yes' || s.v === 'na') t(x + bw / 2, y + 21, s.v === 'yes' ? s.k : 'n/a', 9, 500, s.v === 'yes' ? paper : muted, ' text-anchor="middle"');
    else { t(x + bw / 2, y + 15, s.k, 9, 500, s.v === 'no' ? accent : muted, ' text-anchor="middle"'); t(x + bw / 2, y + 27, s.v === 'no' ? 'missing' : 'not checked', 7.5, 400, s.v === 'no' ? accent : muted, ' text-anchor="middle"'); } });
  el.push('</g>'); y += 34;
  y += 18; t(pad, y, `spec frame · not a render · ${c.source || c.import || 'no source named'}`.slice(0, 64), 9, 400, muted, ' id="note"');
  const H = y + pad;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(c.name)} — spec frame"><rect id="frame" width="${W}" height="${H}" rx="8" fill="${paper}" stroke="${rule}"/>${el.join('')}</svg>`;
}

// --- patterns: PATTERNS.md as /design-review seeds it — Ours first, the inherited groups, the refused --
export function readPatterns(projectDir) {
  const p = join(projectDir, 'docs', 'design', 'PATTERNS.md');
  const out = { present: existsSync(p), ours: [], groups: [], refused: [], updated: null };
  if (!out.present) return out;
  let text = '';
  try { text = readFileSync(p, 'utf8'); } catch { return out; }
  out.updated = frontmatter(text).updated || null;
  for (const t of mdTables(text)) {
    const iP = t.col(/^pattern/), iS = t.col(/situation/), iR = t.col(/rule/), iA = t.col(/anti/), iId = t.col(/^id$/), iSeen = t.col(/first seen/);
    if (t.col(/why refused/) >= 0) {
      const iW = t.col(/why refused/), iO = t.col(/^on/);
      for (const r of t.rows) { const pattern = clean(r[iP]); if (pattern) out.refused.push({ pattern, why: clean(r[iW]), on: clean(r[iO]) }); }
    } else if (iP >= 0 && iS >= 0) {
      const rows = t.rows.map((r) => ({ id: iId >= 0 ? clean(r[iId]) : '', pattern: clean(r[iP]), situation: clean(r[iS]), rule: iR >= 0 ? clean(r[iR]) : '', anti: iA >= 0 ? clean(r[iA]) : '', firstSeen: iSeen >= 0 ? clean(r[iSeen]) : '' })).filter((r) => r.pattern);
      if (iId >= 0 || /^ours/i.test(t.heading)) out.ours.push(...rows);
      else if (rows.length) out.groups.push({ heading: t.heading, rows });
    }
  }
  return out;
}

// --- flows: FLOWS.md — the index, and per flow the three paths and the cut test ------------------------
export function readFlows(projectDir) {
  const p = join(projectDir, 'docs', 'design', 'FLOWS.md');
  const out = { present: existsSync(p), flows: [], updated: null };
  if (!out.present) return out;
  let text = '';
  try { text = readFileSync(p, 'utf8'); } catch { return out; }
  out.updated = frontmatter(text).updated || null;
  const tables = mdTables(text);
  const index = tables.find((t) => t.col(/^flow/) >= 0 && t.col(/entry/) >= 0);
  if (!index) return out;
  const iF = index.col(/^flow/), iE = index.col(/entry/), iS = index.col(/steps/), iEnd = index.col(/ends/), iO = index.col(/owned/);
  for (const r of index.rows) {
    const name = clean(r[iF]); if (!name) continue;
    const flow = { name, entry: clean(r[iE]), steps: iS >= 0 ? clean(r[iS]) : '', endsAt: iEnd >= 0 ? clean(r[iEnd]) : '', owner: iO >= 0 ? clean(r[iO]) : '', section: false, deferred: false, happy: [], cut: [], firstRun: false, failure: false };
    const escRe = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const sec = section(text, new RegExp(`^##\\s+${escRe}`, 'i'));
    if (sec) {
      flow.section = true;
      const st = mdTables(sec);
      const happy = st.find((t) => t.col(/^step/) >= 0 && t.col(/asks/) >= 0);
      if (happy) { const iN = happy.col(/^#/), iSt = happy.col(/^step/), iA = happy.col(/asks/), iW = happy.col(/why/); flow.happy = happy.rows.map((x, i) => ({ n: iN >= 0 ? clean(x[iN]) : String(i + 1), step: clean(x[iSt]), asks: clean(x[iA]), why: iW >= 0 ? clean(x[iW]) : '' })).filter((x) => x.step); }
      const cut = st.find((t) => t.col(/^cut/) >= 0);
      if (cut) { const iC = cut.col(/^cut/), iW = cut.col(/why/); flow.cut = cut.rows.map((x) => ({ cut: clean(x[iC]), why: clean(x[iW]) })).filter((x) => x.cut); }
      flow.firstRun = /first-run path/i.test(sec);
      flow.failure = /failure path/i.test(sec);
      flow.deferred = !flow.happy.length && /in the FEAT|in its FEAT|the FEAT'?s\s+\*?\*?flow/i.test(sec);
    }
    out.flows.push(flow);
  }
  return out;
}

// --- accessibility: the guards that are on. A registered hook is a fact in .claude/settings.json ------
export const GUARDS = [['contrast-guard', 'contrast, per declared pair, at every tokens change'], ['design-tokens-guard', 'a raw colour caught at the write'], ['component-reuse-guard', 'a second Button asked about before it exists'], ['content-terminology-guard', 'a refused word caught in a string']];
export function readGuards(projectDir) { return GUARDS.map(([name, does]) => ({ name, does, on: isRegistered(projectDir, name) })); }

// --- icons: docs/design/icons/*.svg, drawn from the file; the set copies as one sprite ---------------
// Nothing in BOSS writes the folder — a founder or a designer drops files in (IDEA-107's kicks-up
// row). The style guide's `1b. Icons` lines are the decision; the files are the set.
export function readIcons(projectDir) {
  const dir = join(projectDir, 'docs', 'design', 'icons');
  const out = { present: existsSync(dir), files: [], sprite: '' };
  if (!out.present) return out;
  for (const n of readdirSync(dir).filter((x) => /\.svg$/i.test(x)).sort()) {
    let svg = '';
    try { svg = readFileSync(join(dir, n), 'utf8'); } catch { continue; }
    const open = svg.match(/<svg\b[^>]*>/i); if (!open) continue;
    const viewBox = (open[0].match(/viewBox="([^"]+)"/i) || [])[1] || null;
    const w = (open[0].match(/\bwidth="([\d.]+)/i) || [])[1] || null;
    const inner = svg.slice(svg.indexOf(open[0]) + open[0].length, svg.lastIndexOf('</svg>')).trim();
    const name = n.replace(/\.svg$/i, '');
    out.files.push({ name, file: `docs/design/icons/${n}`, svg: svg.trim(), inner, viewBox, size: w ? Number(w) : viewBox ? Number(viewBox.split(/\s+/)[2]) : null, bytes: Buffer.byteLength(svg) });
  }
  if (out.files.length) out.sprite = `<svg xmlns="http://www.w3.org/2000/svg" style="display:none">${out.files.map((f) => `<symbol id="icon-${f.name}"${f.viewBox ? ` viewBox="${f.viewBox}"` : ''}>${f.inner}</symbol>`).join('')}</svg>`;
  return out;
}
export function readIconDecision(guideText) {
  const sec = section(guideText || '', /^###?\s+(1b\.\s*)?icons\b/i) || '';
  const line = (re) => { const m = sec.match(new RegExp(`^-\\s*\\*\\*${re}[^*]*\\*\\*:?\\s*(.+)$`, 'im')); const v = m ? clean(m[1]) : ''; return v && !/^<|<[^>]*>/.test(v) ? v : ''; };
  return { set: line('The set'), sizes: line('Sizes'), iconOnly: line('Icon-only'), never: line('What an icon never does') };
}

// --- the logo: a path in docs/BRAND.md's frontmatter (`logo:` the mark, `wordmark:` when it is a file);
// the lockups draw from those files or the slot stays a slot. No placeholder mark, ever.
export function readLogo(projectDir) {
  const p = join(projectDir, 'docs', 'BRAND.md');
  const out = { mark: null, markSvg: '', wordmarkFile: null, wordmarkSvg: '', minimum: '', clearSpace: '', colour: '', tagline: '', misuse: '' };
  if (!existsSync(p)) return out;
  let text = '';
  try { text = readFileSync(p, 'utf8'); } catch { return out; }
  const fm = frontmatter(text);
  const svgAt = (rel) => { if (!rel || !/\.svg$/i.test(String(rel))) return ''; try { const t = readFileSync(join(projectDir, String(rel)), 'utf8'); return /<svg\b/i.test(t) && t.length < 64 * 1024 ? t.trim() : ''; } catch { return ''; } };
  const mark = fm.logo || fm.mark || null;
  if (mark && existsSync(join(projectDir, String(mark)))) { out.mark = String(mark); out.markSvg = svgAt(mark); }
  const wm = fm.wordmark && /\.(svg|png)$/i.test(String(fm.wordmark)) ? String(fm.wordmark) : null;
  if (wm && existsSync(join(projectDir, wm))) { out.wordmarkFile = wm; out.wordmarkSvg = svgAt(wm); }
  const guidePath = join(projectDir, 'docs', 'design', 'STYLE_GUIDE.md');
  let guide = '';
  try { guide = existsSync(guidePath) ? readFileSync(guidePath, 'utf8') : ''; } catch { guide = ''; }
  const sec = section(guide, /^##\s+logo\b/i) || section(text, /^##\s+logo\b/i) || '';
  const line = (re) => { const m = sec.match(new RegExp(`^-\\s*\\*\\*${re}[^*]*\\*\\*:?\\s*(.+)$`, 'im')); const v = m ? clean(m[1]) : ''; return v && !/<[^>]*>/.test(v) ? v : ''; };
  out.clearSpace = line('Clear space'); out.minimum = line('Minimum'); out.colour = line('Colou?r'); out.tagline = line('Tagline'); out.misuse = line('Misuse');
  return out;
}

// --- exceptions: the style guide's table, grouped by the rule each departs from --------------------------
// The template's own threshold: one is an exception, two is worth noticing, three against the same
// rule means the rule is wrong — narrow it, split it, or retire it.
export function readExceptions(guideText) {
  const out = { rows: [], groups: [] };
  for (const t of mdTables(guideText || '')) {
    if (!/exception/i.test(t.heading) || t.col(/^date/) < 0) continue;
    const iD = t.col(/^date/), iW = t.col(/^where/), iWhat = t.col(/^what/), iY = t.col(/^why/), iR = t.col(/^rule|against/);
    for (const r of t.rows) {
      const what = clean(r[iWhat]), where = clean(r[iW]);
      if (!what && !where) continue;
      out.rows.push({ date: clean(r[iD]), where, what, why: iY >= 0 ? clean(r[iY]) : '', rule: iR >= 0 ? clean(r[iR]) : '' });
    }
  }
  const byRule = new Map();
  for (const r of out.rows) { const k = (r.rule || r.what).toLowerCase().replace(/\s+/g, ' ').trim(); if (!byRule.has(k)) byRule.set(k, { rule: r.rule || r.what, rows: [] }); byRule.get(k).rows.push(r); }
  out.groups = [...byRule.values()].sort((a, b) => b.rows.length - a.rows.length).map((g) => ({ ...g, verdict: g.rows.length >= 3 ? 'the rule is wrong — narrow it, split it, or retire it' : g.rows.length === 2 ? 'worth noticing' : 'an exception' }));
  return out;
}

// --- resources: the DTCG file verbatim, a variables block derived from it, the import lines, coverage -----
export function tokensCss(tokens) {
  const lines = tokens.filter((t) => t.value != null && !t.deprecated).map((t) => `  ${cssVar(t.name)}: ${Array.isArray(t.value) ? t.value.map((f) => (/\s/.test(f) ? `"${f}"` : f)).join(', ') : dim(t.value)};`);
  return lines.length ? `:root {\n${lines.join('\n')}\n}\n` : '';
}
export function readTokensFile(projectDir) {
  const p = join(projectDir, 'docs', 'design', 'tokens.json');
  try { return existsSync(p) ? readFileSync(p, 'utf8') : ''; } catch { return ''; }
}
// Kit coverage reads a `design` field (the manifest) or a `Design` column (COMPONENTS.md) — a URL
// into the founder's own file. Nothing writes it yet (IDEA-108 row 3, gated); when nobody has, the
// count is 0 of N and the page names the field rather than inventing a link.
export function readKitLinks(projectDir, components) {
  const links = new Map();
  const mPath = join(projectDir, 'docs', 'design', 'library', 'manifest.json');
  if (existsSync(mPath)) { try { for (const c of JSON.parse(readFileSync(mPath, 'utf8')).components || []) if (c && c.name && typeof c.design === 'string' && /^https?:\/\//.test(c.design)) links.set(String(c.name), c.design); } catch { /* reported elsewhere */ } }
  const cPath = join(projectDir, 'docs', 'design', 'COMPONENTS.md');
  if (existsSync(cPath)) { try { for (const t of mdTables(readFileSync(cPath, 'utf8'))) { const iN = t.col(/^component/), iD = t.col(/^design/); if (iN < 0 || iD < 0) continue; for (const r of t.rows) { const name = clean(r[iN]); const url = (String(r[iD] || '').match(/https?:\/\/\S+/) || [])[0]; if (name && url) links.set(name, url.replace(/[)>\]]+$/, '')); } } } catch { /* reported elsewhere */ } }
  return components.map((c) => ({ name: c.name, design: links.get(c.name) || null }));
}

// --- collect ----------------------------------------------------------------------------------------

export function collectDesign(projectDir, projectName) {
  const brand = readBrand(projectDir, projectName);
  const shape = readBrandShape(projectDir);
  const tok = readTokens(projectDir);
  const decs = readDecisions(projectDir);
  const guide = readStyleGuide(projectDir);
  const tokens = tok.tokens;
  const by = (fam) => tokens.filter((t) => new RegExp(`^(${fam})(\\.|$)`, 'i').test(t.name));
  const color = by('color|colour'), type = by('font|type|typography'), space = by('space|spacing'), radius = by('radius'), elevation = by('shadow|elevation'), motion = by('motion');
  const pairs = contrastPairs(tokens);
  const anchor = decs.find((d) => /brand.?anchor|anchor/i.test(d.title)) || null;
  const personas = readPersonasFull(projectDir);
  const journey = readJourney(projectDir);
  const research = readResearch(projectDir);
  const components = readComponents(projectDir);
  const patterns = readPatterns(projectDir);
  const flows = readFlows(projectDir);
  const guards = readGuards(projectDir);
  // The style guide's five-state table fills a component's states when nothing else says.
  for (const c of components.components) if (!c.states && c.missing === null && guide.fiveStates && guide.fiveStates[c.name]) { c.states = guide.fiveStates[c.name]; c.missing = Object.keys(c.states).filter((k) => c.states[k] === false); }
  for (const c of components.components) c.svg = specFrameSvg(c, tokens);
  const icons = readIcons(projectDir); icons.decision = readIconDecision(guide.text);
  const logo = readLogo(projectDir);
  const exceptions = readExceptions(guide.text);
  const resources = { tokensText: readTokensFile(projectDir), css: tokensCss(tokens), kit: readKitLinks(projectDir, components.components) };
  const content = { terms: guide.terms || [], voiceTraits: guide.voiceTraits || [], tone: (guide.tone || []).filter((t) => t.string), toneAll: guide.tone || [], surfaces: guide.surfaces || [], deferred: guide.voiceDeferred !== false, present: guide.present };
  const slots = [
    ['brand', shape.present], ['people', personas.length > 0], ['journey', journey.stages.length > 0], ['principles', guide.principles.length > 0], ['colour', color.length > 0], ['type', type.length > 0], ['space', space.length + radius.length + elevation.length > 0], ['layout', guide.layout],
    ['icons', icons.files.length > 0 || Boolean(icons.decision.set)], ['logo', Boolean(logo.mark)],
    ['components', components.components.length > 0], ['patterns', patterns.ours.length + patterns.groups.length > 0], ['flows', flows.flows.length > 0], ['content', content.terms.length + content.tone.length + content.voiceTraits.length > 0], ['a11y', (guide.floor || []).length > 0 || pairs.length > 0],
    ['research', research.evid.length > 0],
  ];
  return { projectName, brand, shape, tokens: tok, decs, anchor, guide, color, type, space, radius, elevation, motion, pairs, slots, personas, journey, research, components, patterns, flows, content, guards, icons, logo, exceptions, resources, findings: pairs.filter((p) => p.grade !== 'AA').length };
}

// --- render -------------------------------------------------------------------------------------------

const holeRaw = (id, title, body, verb, src) => `<article class="block hole" id="${id}" data-title="${esc(title)}"><div class="head"><h3>${esc(title)}</h3></div><div class="body">${body}<span class="verb">${esc(verb)}</span></div><div class="foot"><span class="src">${esc(src)}</span></div><div class="actions"></div></article>`;
const chapter = (id, n, name, h2, intro, inner) => `    <section class="chapter" id="${id}">
      <div class="chapter-head"><div class="label">${n} · ${esc(name)}</div><h2>${esc(h2)}</h2>${intro ? `<p>${intro}</p>` : ''}</div>
${inner}
    </section>`;

function swatchHtml(t, decs) {
  const d = decFor(decs, t.name);
  const hex = typeof t.value === 'string' ? t.value : '';
  const copy = `hex=${hex}|token=${t.name}|css=var(${cssVar(t.name)})`;
  return `<div class="sw${t.deprecated ? ' retired' : ''}"><i class="val" style="background:${esc(hex)}" data-copy="${esc(copy)}" title="Copy"></i><b class="val" data-copy="${esc(`token=${t.name}|hex=${hex}|css=var(${cssVar(t.name)})`)}">${esc(t.name)}</b><span class="val" data-copy="${esc(copy)}">${esc(hex)}</span>`
    + `<span class="dec">${d ? `chosen · ${esc(d.id)}` : (t.description ? `<em>${esc(t.description)}</em>` : '<em>derived · no reason recorded</em>')}${t.deprecated ? ` · <span class="ret">deprecated → ${esc(String(t.deprecated))}</span>` : ''}</span></div>`;
}

export function renderDesignHtml(data, stampedAt) {
  const { brand, shape, tokens, decs, anchor, guide, color, type, space, radius, elevation, motion, pairs, slots, findings, projectName, personas, journey, research, components, patterns, flows, content, guards, icons, logo, exceptions, resources } = data;
  // The verb on a hole is gated the way the playbook gates it (verbLine): a skill the mode hasn't
  // unlocked says so, and a droppable record points at /import — both spaces say the same thing.
  const hole = (id, title, body, verb, src) => holeRaw(id, title, body, verbLine(verb, data.projectDir), src);
  const filled = slots.filter(([, ok]) => ok).length;
  const ledger = `<b class="tab">${filled} of ${slots.length}</b> slots have something in them · <b class="tab">${pairs.length}</b> contrast pair${pairs.length === 1 ? '' : 's'} computed · <b class="tab">${findings}</b> finding${findings === 1 ? '' : 's'}`;
  const src = tokens.source || 'no tokens file';

  // 1 · Start here
  const shapeRows = shape.present
    ? shape.lines.map((l) => `<li><strong>${esc(l.label)}:</strong> ${l.value ? esc(l.value) : '<span class="unk">unknown — not written; nothing invented</span>'}</li>`).join('')
    : '';
  const start = chapter('brand', 1, 'Start here', brand.tagline || `${projectName} — the design system, as it is`,
    'Everything on this page is read from the files under <code>docs/design/</code> and <code>docs/BRAND.md</code>. Where a decision has been made it names the record; where none has, the slot is dashed. Nothing here is written by BOSS.',
    `      <div class="blocks two">
        ${shape.present ? `<article class="block" id="brand-shape" data-title="Brand — current shape"><div class="head"><h3>Current shape</h3></div><div class="body"><ul>${shapeRows}</ul></div><div class="foot"><span class="chip ${brand.nascent ? 'asserted' : 'dec'}">${brand.nascent ? 'nascent' : 'living'}</span><span class="src">docs/BRAND.md${shape.updated ? ` · rev. ${esc(String(shape.updated))}` : ''}</span></div><div class="actions"></div></article>`
          : hole('brand-shape', 'Current shape', '<p>Who it\'s for, what it promises, what it refuses, how it sounds, what it is NOT, the name and why — six lines, none written yet.</p>', '/landing seeds docs/BRAND.md · /boss asks the first two', 'docs/BRAND.md · absent')}
        ${anchor ? `<article class="block" id="brand-anchor" data-title="The anchor — ${esc(anchor.id)}"><div class="head"><h3>The anchor <span class="sub">— the choices that get expensive to reverse</span></h3></div><div class="body"><p>${esc(anchor.title.replace(/^DEC-\d+\s*[—-]\s*/, ''))}</p></div><div class="foot"><span class="chip dec">chosen · ${esc(anchor.id)}</span>${anchor.revisit ? `<span class="src">revisit ${esc(String(anchor.revisit))}</span>` : ''}<span class="src">docs/decisions/${esc(anchor.file)}</span></div><div class="actions"></div></article>`
          : hole('brand-anchor', 'The anchor', '<p>Neutral temperature · radius · type pairing · the one owned accent · the signature. Five choices that get expensive to reverse, and no record yet says which were chosen and which are defaults.</p>', '/decide writes the anchor as a DEC · the 5-token pass in /design-tokens-init proposes it', 'docs/decisions/ · no brand-anchor DEC')}
      </div>`);

  // 2 · Principles
  const principleHtml = (p, i) => {
    const parts = [['Why', p.why], ['Guideline', p.guideline], ['Rules', p.rules], ['Wrong if', p.wrongIf]].filter(([, v]) => v);
    return `<article class="block principle" id="principle-${i + 1}" data-title="Principle ${i + 1} — ${esc(p.title)}"><div class="head"><h3>${i + 1} · ${esc(p.title)}</h3></div><div class="body">${p.statement ? `<p class="statement">${esc(p.statement)}</p>` : ''}${p.groundedIn ? `<p class="t-small"><strong>Grounded in:</strong> ${esc(p.groundedIn)}</p>` : ''}<div class="pgrid">${parts.map(([k, v]) => `<div><h4>${k}</h4><p>${esc(v)}</p></div>`).join('')}${parts.length === 0 ? '<p class="t-small"><em>A name and nothing under it — the slot asks for Why, Guideline, Rules and Wrong if.</em></p>' : ''}</div></div><div class="foot"><span class="chip ${p.grounded ? 'ev' : 'asserted'}">${p.grounded ? `grounded · ${esc(p.refs.join(', ') || 'named')}` : 'asserted · no EVID, persona or journey stage names it'}</span>${p.wrongIf ? '' : '<span class="chip asserted">no falsifier</span>'}<span class="src">docs/design/STYLE_GUIDE.md · Design principles · ${i + 1}</span></div><div class="actions"></div></article>`;
  };
  const principles = chapter('principles', 4, 'Principles', guide.principles.length ? `${guide.principles.length}, each a direction that contains a tradeoff.` : 'No principle written yet.',
    'A principle is grounded when something outside the room names it — an EVID, a persona, a stage of the journey. One that only asserts is still a principle; the chip says which is which so it can be tested instead of reaffirmed.',
    guide.principles.length ? `      <div class="blocks one">\n        ${guide.principles.map(principleHtml).join('\n        ')}\n      </div>`
      : `      <div class="blocks one">${hole('principle-none', 'Design principles', '<p>Three to five, each with what it buys and what it costs. If a reasonable person couldn\'t argue the opposite, it isn\'t a principle.</p>', guide.present ? 'docs/design/STYLE_GUIDE.md · Design principles — the slot is there, blank' : '/design-tokens-init writes the style guide with the slot', guide.present ? 'docs/design/STYLE_GUIDE.md · present, principles empty' : 'docs/design/STYLE_GUIDE.md · absent')}</div>`);

  // 3 · Colour
  const err = tokens.error ? `<article class="block hole" id="tokens-error"><div class="head"><h3>Couldn't read the tokens</h3></div><div class="body"><p>${esc(tokens.error)}</p></div><div class="actions"></div></article>` : '';
  const semantic = color.filter((t) => !/^colou?r\.(gray|grey|blue|red|green|teal|amber|yellow|orange|purple|violet|neutral|palette)\b/i.test(t.name) && !/\.\d{2,3}$/.test(t.name));
  const primitives = color.length - semantic.length;
  const pairsRows = pairs.map((p) => `<tr><td class="mono">${esc(p.text.name)}</td><td class="mono">${esc(p.on.name)}</td><td class="mono tab">${p.ratio.toFixed(2)}</td><td class="${p.grade === 'AA' ? 'ok' : p.grade === 'AA-large' ? 'warn' : 'fail'}">${p.grade === 'AA' ? 'AA' : p.grade === 'AA-large' ? 'large text only' : 'fails'}</td></tr>`).join('');
  const colour = chapter('colour', 5, 'Colour', color.length ? `${semantic.length} semantic name${semantic.length === 1 ? '' : 's'}${primitives ? ` over ${primitives} primitives` : ''}.` : 'No colour tokens yet.',
    'Every swatch is its semantic name — what it is for, never its hue. Click a swatch, a name or a value to copy it in the form you want. A swatch with a reason under it is an argument someone has to answer; a swatch alone is a value someone will quietly change.',
    color.length ? `      <div class="blocks one">
        ${err}
        <article class="block" id="colour-semantic" data-title="Colour — the semantic layer"><div class="head"><h3>Semantic tokens <span class="sub">· click any value to copy it</span></h3></div><div class="body"><div class="swatches">${semantic.map((t) => swatchHtml(t, decs)).join('')}</div>${primitives ? `<p class="t-small" style="margin-top:12px">${primitives} primitive${primitives === 1 ? '' : 's'} underneath (<code>color.&lt;hue&gt;.&lt;step&gt;</code>) — referenced by these names, never by a screen.</p>` : ''}</div><div class="foot"><span class="chip dec">${semantic.filter((t) => decFor(decs, t.name)).length} chosen</span><span class="chip asserted">${semantic.filter((t) => !decFor(decs, t.name)).length} derived</span><span class="src">${esc(src)}</span></div><div class="actions"></div></article>
        <article class="block" id="colour-contrast" data-title="Contrast — the declared pairs, computed"><div class="head"><h3>Contrast <span class="sub">— WCAG 2.x, computed for every declared text-on-surface pair</span></h3></div><div class="body">${pairs.length ? `<div class="tscroll"><table class="t"><thead><tr><th>Text</th><th>On</th><th>Ratio</th><th>Reads</th></tr></thead><tbody>${pairsRows}</tbody></table></div>` : '<p class="t-small"><em>No pair to compute: nothing is named like text (<code>color.text.*</code>, <code>*.on-*</code>) against something named like a surface (<code>color.surface.*</code>, <code>ground</code>, <code>paper</code>). Name by purpose and the arithmetic follows.</em></p>'}<p class="t-small" style="margin-top:10px">Checks the pairs the tokens declare, not what the page renders — text over an image, a gradient or a translucent overlay composites at runtime and stays <em>not checked</em>. A pair that fails is a token-system finding: fix it in ${esc(src)} and every screen moves.</p></div><div class="foot"><span class="chip ${findings ? 'find' : 'dec'}">${findings} finding${findings === 1 ? '' : 's'} · token-level</span><span class="src">${pairs.length} pairs · computed at render · relative luminance, WCAG 2.x</span></div><div class="actions"></div></article>
      </div>`
      : `      <div class="blocks one">${err}${hole('colour-none', 'Semantic colour', '<p>The nine-or-so names a screen is allowed to use — surface, text, action, signal — and the primitives under them. The 47 blues start on the second screen without this.</p>', '/design-tokens-init writes docs/design/tokens.json', `${esc(src)}`)}</div>`);

  // 4 · Type
  const typeRows = type.map((t) => { const v = Array.isArray(t.value) ? t.value.join(', ') : dim(t.value); return `<div class="row"><div class="meta"><b class="val" data-copy="${esc(`token=${t.name}|value=${v}|css=var(${cssVar(t.name)})`)}">${esc(t.name)}</b><span class="val" data-copy="${esc(`value=${v}|token=${t.name}`)}">${esc(v)}</span>${t.description ? `<span class="d">${esc(t.description)}</span>` : ''}</div><div class="spec"${Array.isArray(t.value) ? ` style="font-family:${esc(t.value.map((f) => (/\s/.test(f) ? `'${f}'` : f)).join(', '))}"` : ''}>${Array.isArray(t.value) ? 'The quick brown fox covers the Sunday shift.' : ''}</div></div>`; }).join('');
  const typeCh = chapter('type', 6, 'Type', type.length ? `${type.length} type token${type.length === 1 ? '' : 's'}.` : 'No type tokens yet.',
    'Roles, not sizes. A screen that needs a seventh role is asking a question the style guide should answer first.',
    type.length ? `      <div class="blocks one"><article class="block" id="type-roles" data-title="Type — the roles"><div class="head"><h3>Roles <span class="sub">· click a role to copy its token or value</span></h3></div><div class="body"><div class="scale">${typeRows}</div></div><div class="foot"><span class="src">${esc(src)} · font family</span></div><div class="actions"></div></article></div>`
      : `      <div class="blocks one">${hole('type-none', 'Type roles', '<p>A display face for the promise, a body face for the work, a data face for the numbers — and the six roles they play.</p>', '/design-tokens-init · the 5-token pass chooses the pairing', esc(src))}</div>`);

  // 5 · Space & shape
  const bars = space.map((t) => `<div class="row"><span class="val" data-copy="${esc(`px=${dim(t.value)}|token=${t.name}|css=var(${cssVar(t.name)})`)}">${esc(t.name)} · ${esc(dim(t.value))}</span><i style="width:${esc(dim(t.value))}"></i></div>`).join('');
  const radii = radius.map((t) => `<div class="val" style="border-radius:${esc(dim(t.value))}" data-copy="${esc(`px=${dim(t.value)}|token=${t.name}`)}">${esc(dim(t.value))} · ${esc(t.name.replace(/^radius\./, ''))}</div>`).join('');
  const elev = elevation.map((t) => `<div class="val" style="box-shadow:${esc(String(t.value))}" data-copy="${esc(`value=${String(t.value)}|token=${t.name}`)}">${esc(t.name.replace(/^(shadow|elevation)\./, ''))}</div>`).join('');
  const shapeCh = chapter('shape', 7, 'Space & shape', (space.length || radius.length || elevation.length) ? `${space.length} spacing step${space.length === 1 ? '' : 's'} · ${radius.length} radi${radius.length === 1 ? 'us' : 'i'} · ${elevation.length} elevation${elevation.length === 1 ? '' : 's'}.` : 'No spacing, radius or elevation tokens yet.', '',
    (space.length || radius.length || elevation.length) ? `      <div class="blocks">
        ${space.length ? `<article class="block" id="space-scale" data-title="Spacing scale"><div class="head"><h3>Spacing</h3></div><div class="body"><div class="bars">${bars}</div></div><div class="foot"><span class="src">${esc(src)} · space</span></div><div class="actions"></div></article>` : ''}
        ${radius.length ? `<article class="block" id="shape-radius" data-title="Radius"><div class="head"><h3>Radius</h3></div><div class="body"><div class="radii">${radii}</div></div><div class="foot"><span class="src">${esc(src)} · radius</span></div><div class="actions"></div></article>` : ''}
        ${elevation.length ? `<article class="block" id="shape-elevation" data-title="Elevation"><div class="head"><h3>Elevation</h3></div><div class="body"><div class="elev">${elev}</div></div><div class="foot"><span class="src">${esc(src)} · elevation</span></div><div class="actions"></div></article>` : ''}
        ${motion.length ? '' : `<article class="block dormant" id="shape-motion" data-title="Motion"><div class="head"><h3>Motion</h3></div><div class="body">No durations, no easings named. <code>prefers-reduced-motion</code> is honoured by default.<span class="cond">wakes when a transition is designed twice · seed-that-scales: cheap to add when earned</span></div><div class="foot"><span class="chip asserted">deferred by rule</span><span class="src">no motion tokens</span></div><div class="actions"></div></article>`}
      </div>`
      : `      <div class="blocks one">${hole('space-none', 'Spacing · radius · elevation', '<p>A 4-base scale, two radii, one shadow — the three families after colour that a screen reinvents by hand.</p>', '/design-tokens-init', esc(src))}</div>`);

  // 6 · Layout
  const layout = chapter('layout', 9, 'Layout', guide.layout ? 'A layout section exists.' : 'Nobody has decided how a page is built yet.', '',
    guide.layout ? `      <div class="blocks one"><article class="block" id="layout-guide" data-title="Layout"><div class="head"><h3>From the style guide</h3></div><div class="body"><p>The Layout section of <code>docs/design/STYLE_GUIDE.md</code> has content; slice 2 renders it. Until then, read it there.</p></div><div class="foot"><span class="src">docs/design/STYLE_GUIDE.md · Layout</span></div><div class="actions"></div></article></div>`
      : `      <div class="blocks one">${hole('layout-hole', 'The slot, and what fills it', '<p>No column grid, no breakpoint list, no container width. The slot has a shape so the decision has somewhere to land:</p><ul style="margin-top:8px;font-style:normal"><li><strong>base unit</strong></li><li><strong>the ramp</strong> — which spacing steps mean inside a control, between controls, between sections</li><li><strong>grid anatomy</strong> — columns · gutters · margins · regions</li><li><strong>breakpoints</strong> — as <code>breakpoint.*</code> tokens, so a media query is a name</li><li><strong>responsive techniques</strong> — reposition · resize · reflow · hide · re-architect, and which are allowed</li><li><strong>density</strong> — one, until a second is earned</li></ul>', 'docs/design/STYLE_GUIDE.md · Layout — six sub-slots, all blank · /design-review opens it at the next screen', guide.present ? 'docs/design/STYLE_GUIDE.md · Layout section empty or absent' : 'docs/design/STYLE_GUIDE.md · absent')}</div>`);

  // 2 · People
  const list = (v) => Array.isArray(v) ? `<ul>${v.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>` : `<p>${esc(v)}</p>`;
  const holeLine = (label, verb) => `<p class="unk">${esc(label)} — not written${verb ? ` · ${esc(verb)}` : ''}</p>`;
  const personaHtml = (p) => `<article class="block persona" id="persona-${esc(p.slug)}" data-title="${esc(p.name)} — ${p.primary ? 'primary' : 'secondary'} persona"><div class="head"><h3>${esc(p.name)} <span class="sub">— ${p.primary ? 'primary' : 'secondary'} · docs/personas/${esc(p.slug)}.md</span></h3></div><div class="body">${p.who ? `<p class="who">${esc(String(Array.isArray(p.who) ? p.who[0] : p.who))}</p>` : holeLine('who', '/persona derive')}<div class="pgrid">${[['The day (context)', p.context], ['Jobs', p.jobs], ['Pains', p.pains], ['Values', p.values]].map(([k, v]) => `<div><h4>${esc(k)}</h4>${v ? list(v) : holeLine(k.toLowerCase(), '')}</div>`).join('')}</div>${p.unknowns ? `<div class="dontknow"><strong>What we don't know yet:</strong> ${Array.isArray(p.unknowns) ? esc(p.unknowns.join(' · ')) : esc(p.unknowns)}</div>` : `<div class="dontknow unk">What we don't know yet — not written. The persona's open questions are the interview guide; without them there is nothing to ask.</div>`}</div><div class="foot">${p.synthetic != null ? `<span class="chip ${p.real ? 'ev' : 'asserted'}">synthetic ${p.synthetic}% · real ${p.real}%</span>` : '<span class="chip asserted">no evidence ledger</span>'}<span class="src">docs/personas/${esc(p.slug)}.md${p.updated ? ` · rev. ${esc(String(p.updated))}` : p.created ? ` · ${esc(String(p.created))}` : ''}</span></div><div class="actions"></div></article>`;
  const people = chapter('people', 2, 'People', personas.length ? `${personas[0].name}${personas.length > 1 ? `, and ${personas.length - 1} more` : ''}.` : 'Nobody written down yet.',
    'The full persona lives here, in the design space, because this is where it gets used; the playbook carries a snippet and a link. Each card says how much of it came from a real person — a card that is 100% synthetic is a guess with a name.',
    personas.length ? `      <div class="blocks one">\n        ${personas.map(personaHtml).join('\n        ')}\n      </div>`
      : `      <div class="blocks one">${hole('persona-none', 'Who this is for', '<p>The person who pays, the person who uses it, and the person who notices when it fails — each as a card with a <em>who</em> line, their day, their jobs, pains and values, and what you don\'t know yet.</p>', '/persona derive — from the idea; /persona enrich — from a real conversation', 'docs/personas/ · empty')}</div>`);

  // 3 · The journey
  const srcChip = (s) => s ? `<span class="chip ${s === 'observed' ? 'ev' : s === 'said' ? 'dec' : 'asserted'}">${s}</span>` : '<span class="chip find">unlabelled</span>';
  const stageRows = journey.stages.map((st, i) => `<tr><td class="mono">${i + 1}</td><td><strong>${esc(st.stage)}</strong></td><td>${esc(st.doing)}</td><td>${esc(st.meets)}</td><td class="mono">${esc(st.flow || '—')}</td><td>${esc(st.leaves)}</td><td>${srcChip(st.source)}</td></tr>`).join('');
  const unlabelled = journey.stages.filter((st) => !st.source).length;
  const counts = ['observed', 'said', 'assumed'].map((k) => `${journey.stages.filter((st) => st.source === k).length} ${k}`).join(' · ');
  const journeyCh = chapter('journey', 3, 'The journey', journey.stages.length ? 'From hearing about it to relying on it — and the gaps between.' : 'The arc nobody has drawn yet.',
    'The tier above the flows: the stages a person travels, what they meet at each, and where they leave. Every row says where it came from — observed, said, or assumed — because a journey invented at a desk looks like research and isn\'t.',
    journey.stages.length ? `      <div class="blocks one">
        <article class="block" id="journey-arc" data-title="The journey — the stages"><div class="head"><h3>The stages <span class="sub">— the gaps between flows are the point</span></h3></div><div class="body"><div class="tscroll"><table class="t"><thead><tr><th>#</th><th>Stage</th><th>Trying to do</th><th>Meets</th><th>Serving flow</th><th>Where they leave</th><th>Source</th></tr></thead><tbody>${stageRows}</tbody></table></div>${unlabelled ? `<p class="t-small" style="margin-top:10px;color:var(--stale)"><strong>${unlabelled} stage${unlabelled === 1 ? '' : 's'} without a source label.</strong> An assumed row that stops being labelled becomes "research" in about six weeks. Label it.</p>` : ''}</div><div class="foot"><span class="chip asserted">${journey.stages.length} stages · ${counts}</span><span class="src">docs/product/JOURNEY.md${journey.updated ? ` · rev. ${esc(String(journey.updated))}` : ''}</span></div><div class="actions"></div></article>
        ${journey.gaps.length ? `<article class="block" id="journey-gaps" data-title="The journey — the gaps"><div class="head"><h3>The gaps <span class="sub">— stages with no flow and no FEAT that owns them</span></h3></div><div class="body"><ul>${journey.gaps.map((g) => `<li>${esc(g)}</li>`).join('')}</ul></div><div class="foot"><span class="src">docs/product/JOURNEY.md · The gaps</span></div><div class="actions"></div></article>` : hole('journey-gaps', 'The gaps', '<p>The stages with no serving flow and no FEAT — that list is the output of a journey map; a map where every stage is covered is either a finished product or one drawn to look tidy.</p>', 'docs/product/JOURNEY.md · ## The gaps — empty', 'docs/product/JOURNEY.md')}
      </div>`
      : `      <div class="blocks one">${hole('journey-none', 'From first hearing about it to relying on it', '<p>Hear about it · try it · first value · come back · rely on it — what they\'re trying to do, what they meet, where they leave, and the source of each row. One page, written once.</p>', '/spec writes docs/product/JOURNEY.md the first time a flow is named', 'docs/product/JOURNEY.md · absent')}</div>`);

  // 9 · Research
  const r = research;
  const rungRow = (k, label, items, note) => `<tr><td><strong>${label}</strong></td><td class="mono tab">${items.length}</td><td>${items.length ? esc(items.map((e) => `${e.id}${e.date ? ` · ${e.date}` : ''}`).join(' · ')) : `<span class="unk">${esc(note)}</span>`}</td></tr>`;
  const methodRows = r.byMethod.map((m) => `<tr><td><strong>${esc(m.label)}</strong></td><td class="mono">${m.rung}</td><td class="${m.used ? 'ok' : 'q'}">${m.used ? `used · ${m.used}` : 'never'}</td><td class="mono">${esc(m.verb)}</td></tr>`).join('');
  const synth = personas.length ? Math.round(personas.reduce((a, p) => a + (p.synthetic ?? 100), 0) / personas.length) : null;
  const researchCh = chapter('research', 17, 'Research', r.evid.length ? `${r.byRung.observed.length} observed · ${r.byRung.stated.length} stated${synth != null ? ` · the personas are ${synth}% inferred` : ''}.` : 'Nothing from outside the room yet.',
    'Research is everything that tells you whether the design is right — what people did, what they said, what the field does, what a reviewer can see. The same records the playbook keeps by date, cut here by the rung they reach and by the method that produced them. Grades, dates and methods only; never a quote. Coverage is a fact; readiness is a verdict.',
    `      <div class="blocks one">
        <article class="block" id="research-rungs" data-title="Research — by rung"><div class="head"><h3>By rung <span class="sub">— observed beats stated beats inferred</span></h3></div><div class="body"><div class="tscroll"><table class="t"><thead><tr><th>Rung</th><th>n</th><th>Records</th></tr></thead><tbody>${rungRow('observed', 'Observed — someone was watched, or paid, or showed up', r.byRung.observed, 'nobody has been watched using anything — the cheapest test is to sit beside one person')}${rungRow('stated', 'Stated — someone said something that bears on a design choice', r.byRung.stated, 'no conversation recorded — /interview preps one, /evidence grades it')}<tr><td><strong>Inferred — the founder\'s assumptions, marked as such</strong></td><td class="mono tab">${personas.length}</td><td>${personas.length ? esc(personas.map((p) => `${p.name} · synthetic ${p.synthetic ?? '?'}%`).join(' · ')) : '<span class="unk">no persona to mark</span>'}</td></tr>${r.byRung.ungraded.length ? `<tr><td><strong>Ungraded</strong></td><td class="mono tab">${r.byRung.ungraded.length}</td><td class="warn">${esc(r.byRung.ungraded.map((e) => e.id).join(' · '))} — a record with no <code>grade:</code> counts for nothing</td></tr>` : ''}</tbody></table></div></div><div class="foot"><span class="chip ${r.byRung.observed.length ? 'ev' : 'asserted'}">${r.evid.length} record${r.evid.length === 1 ? '' : 's'}${r.newest ? ` · newest ${esc(r.newest)}` : ''}</span><span class="src">docs/evidence/ · grades and dates only</span></div><div class="actions"></div></article>
        <article class="block" id="research-methods" data-title="Research — by method"><div class="head"><h3>By method <span class="sub">— what has been used, and what never has</span></h3></div><div class="body"><div class="tscroll"><table class="t"><thead><tr><th>Method</th><th>Rung it reaches</th><th>Used</th><th>Verb</th></tr></thead><tbody>${methodRows}</tbody></table></div><p class="t-small" style="margin-top:10px">Read it by rung: every <em>observed</em> method that says <em>never</em> is a design decision resting on a guess. The EVID record\'s <code>method:</code> field is what this reads.</p></div><div class="foot"><span class="chip asserted">${r.byMethod.filter((m) => m.used).length} of ${r.byMethod.length} methods used</span><span class="src">docs/evidence/*.md · method: · docs/competition/README.md · docs/design/ux-check-*.md</span></div><div class="actions"></div></article>
      </div>`);


  // 9 · Components
  const co = components;
  const statusChip = (c) => c.status === 'deprecated' ? `<span class="chip stale">deprecated${c.replacedBy ? ` → ${esc(c.replacedBy)}` : ''}</span>` : c.status === 'stable' ? '<span class="chip dec">stable</span>' : c.status === 'draft' ? '<span class="chip asserted">draft</span>' : c.status === 'unused' ? '<span class="chip find">unused</span>' : `<span class="chip asserted">${esc(c.status)}</span>`;
  const findingChips = (c) => { const f = c.findings.map((x) => `<span class="chip find">${esc(x.kind || x.severity || 'finding')}${x.detail ? ` · ${esc(x.detail.length > 48 ? x.detail.slice(0, 46) + '…' : x.detail)}` : ''}</span>`); if (c.stale) f.push('<span class="chip stale">stale · source moved since the manifest</span>'); if (c.missing && c.missing.length) f.push(`<span class="chip find">missing state · ${esc(c.missing.join(', '))}</span>`); return f.length ? f.join(' ') : '—'; };
  const indexRows = co.components.map((c) => `<tr><td class="mono">${esc(c.name)}</td><td>${c.purpose ? esc(c.purpose) : '<span class="unk">no purpose line</span>'}</td><td>${c.variants.length ? esc(c.variants.join(' · ')) : '—'}</td><td class="tab">${c.usedIn == null ? '<span class="unk" title="the authored index has no usage count; the V1 manifest does">?</span>' : c.usedIn}</td><td>${statusChip(c)}</td><td>${findingChips(c)}</td></tr>`).join('')
    + co.retired.map((r) => `<tr class="retired"><td class="mono"><s>${esc(r.name)}</s></td><td>${esc(r.why)}${r.on ? ` · ${esc(r.on)}` : ''}</td><td></td><td class="tab">0</td><td><span class="chip asserted">retired</span></td><td>—</td></tr>`).join('');
  const fiveCell = (c) => { if (c.states) { const ks = Object.keys(c.states); const have = ks.filter((k) => c.states[k] === true).length, na = ks.filter((k) => c.states[k] === 'n/a').length, miss = ks.filter((k) => c.states[k] === false); return miss.length ? `<td class="n">${have + na} of ${ks.length} · missing ${esc(miss.join(', '))}</td>` : `<td class="y">✓${na ? ` (${na} n/a)` : ''}</td>`; } if (c.missing === null) return '<td class="q">not checked — the Missing states cell is blank</td>'; return c.missing.length ? `<td class="n">missing ${esc(c.missing.join(', '))}</td>` : '<td class="y">✓</td>'; };
  const tokensCell = (c) => co.source === 'docs/design/library/manifest.json' ? (c.findings.some((f) => /raw|off-token|hex/i.test(f.kind + f.detail)) ? `<td class="n">✗ ${esc((c.findings.find((f) => /raw|off-token|hex/i.test(f.kind + f.detail)) || {}).detail || 'raw value')}</td>` : '<td class="y">✓ no raw value found</td>') : '<td class="q">not checked — the guard checks the write, the V1 manifest checks the tree</td>';
  const freshCell = (c) => c.stale === null ? (co.source === 'docs/design/library/manifest.json' ? '<td class="q">no source hash</td>' : '<td class="q">authored — no hash</td>') : c.stale ? '<td class="n">stale — re-run /design-library</td>' : '<td class="y">✓ hash matches</td>';
  const doneRows = co.components.map((c) => `<tr><td class="mono">${esc(c.name)}</td>${tokensCell(c)}${fiveCell(c)}${freshCell(c)}</tr>`).join('');
  const codeJson = (c) => { const o = {}; if (c.import) o['Import line'] = c.import; if (c.sourceText) o[`Source · ${c.source}`] = c.sourceText; else if (c.source) o['Source path'] = c.source; return Object.keys(o).length ? JSON.stringify(o) : ''; };
  const cardHtml = (c) => `<article class="block component${c.status === 'deprecated' ? ' retired' : ''}" id="component-${esc(c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'))}" data-title="${esc(c.name)} — component"${codeJson(c) ? ` data-code="${esc(codeJson(c))}"` : ''} data-svg="${esc(c.svg)}"><div class="head"><h3>${esc(c.name)} <span class="sub">${c.source ? `· ${esc(c.source)}` : c.import ? '· source not resolved from the import line' : '· no import line'}</span></h3></div><div class="body">${c.purpose ? `<p>${esc(c.purpose)}</p>` : '<p class="unk">No purpose line — the one field a generator cannot recover; write it in the index.</p>'}<div class="frame" aria-hidden="true">${c.svg}</div><div class="cmeta">${c.import ? `<div class="import val" data-copy="${esc(`import=${c.import}`)}" title="Copy the import line">${esc(c.import)}</div>` : ''}<p class="t-small">${c.variants.length ? `<strong>Variants:</strong> ${esc(c.variants.join(' · '))} · ` : ''}<strong>Status:</strong> ${esc(c.status)}${c.replacedBy ? ` → ${esc(c.replacedBy)}` : ''}${c.usedIn != null ? ` · <strong>used in</strong> ${c.usedIn}` : ''}</p><p class="t-small"><em>SVG</em> copies the frame above — the name, the variants, the five states — in your tokens, as editable layers. It is a spec frame, not a render; nothing here runs the code.${c.sourceText ? ' <em>Code</em> copies the import line or the source file.' : c.import ? ' <em>Code</em> copies the import line.' : ''}</p></div></div><div class="foot">${statusChip(c)}${c.findings.length || c.stale || (c.missing && c.missing.length) ? `<span class="chip find">${c.findings.length + (c.stale ? 1 : 0) + (c.missing && c.missing.length ? 1 : 0)} finding${c.findings.length + (c.stale ? 1 : 0) + (c.missing && c.missing.length ? 1 : 0) === 1 ? '' : 's'}</span>` : ''}<span class="src">${esc(co.source)}</span></div><div class="actions"></div></article>`;
  const apiLine = co.api.length ? `<p class="t-small" style="margin-top:10px"><strong>One word per concept, in props too:</strong> ${co.api.map((a) => `${esc(a.concept)} → <code>${esc(a.word)}</code>${a.never ? ` <span class="unk">(never ${esc(a.never)})</span>` : ''}`).join(' · ')}</p>` : '';
  const bothLine = co.both ? '<p class="t-small" style="margin-top:10px;color:var(--stale)"><strong>Both <code>COMPONENTS.md</code> and <code>library/manifest.json</code> are on disk.</strong> The manifest supersedes the index — two definitions of a button is the trap the index exists to refuse. Replace the file with a pointer at the library (the skill says how).</p>' : '';
  const nFind = co.components.reduce((a, c) => a + c.findings.length + (c.stale ? 1 : 0) + (c.missing && c.missing.length ? 1 : 0), 0);
  const componentsCh = chapter('components', 10, 'Components', co.components.length ? `${co.components.length} exist${co.retired.length ? `, ${co.retired.length} retired` : ''}. Every card carries its import line and a frame for your design tool.` : 'No component index yet.',
    'The index is the agent\'s reuse list — <em>does something like this already exist?</em> — and the founder\'s inventory. Reuse first, extend second, create last. Build the button, then use it on the page; don\'t build the page and leave the button inside it.',
    co.components.length ? `      <div class="blocks one">
        ${co.error ? `<article class="block hole" id="components-error"><div class="head"><h3>Couldn't read the manifest</h3></div><div class="body"><p>${esc(co.error)}</p></div><div class="actions"></div></article>` : ''}
        <article class="block" id="components-index" data-title="Component index"><div class="head"><h3>Index <span class="sub">— ${co.components.length} component${co.components.length === 1 ? '' : 's'} · ${nFind} finding${nFind === 1 ? '' : 's'} · ${co.source === 'docs/design/library/manifest.json' ? `generated${co.generated ? ` ${esc(String(co.generated).slice(0, 10))}` : ''}` : `authored${co.updated ? ` · rev. ${esc(String(co.updated))}` : ''}`}</span></h3></div><div class="body"><div class="tscroll"><table class="t"><thead><tr><th>Component</th><th>Purpose</th><th>Variants</th><th>Used in</th><th>Status</th><th>Findings</th></tr></thead><tbody>${indexRows}</tbody></table></div>${apiLine}${bothLine}
          <div class="sub-title"><h4>Definition of done</h4><span class="t-small">earned per component, never asserted — mechanical where something on disk can answer, <em>not checked</em> where it can't</span></div>
          <p class="t-small"><strong>Not checked, for every component:</strong> reads to 320px · a screen reader announces it · every string is in the copy layer · a person has used it. Nothing on disk answers those; a rendered page and a person do. <code>/ux-check</code> says the same <em>not checked</em> rather than pass.</p>
          <div class="tscroll"><table class="t done"><thead><tr><th>Component</th><th>on tokens</th><th>five states</th><th>source fresh</th></tr></thead><tbody>${doneRows}</tbody></table></div>
        </div><div class="foot"><span class="chip ${nFind ? 'find' : 'dec'}">${nFind} finding${nFind === 1 ? '' : 's'}</span><span class="src">${esc(co.source)}${co.source === 'docs/design/COMPONENTS.md' ? ' · the V1 manifest adds a source hash and a usage count' : ''}</span></div><div class="actions"></div></article>
      </div>
      <div class="blocks two" style="margin-top:14px">
        ${co.components.map(cardHtml).join('\n        ')}
      </div>`
      : `      <div class="blocks one">${co.error ? `<article class="block hole" id="components-error"><div class="head"><h3>Couldn't read the manifest</h3></div><div class="body"><p>${esc(co.error)}</p></div><div class="actions"></div></article>` : ''}${hole('components-none', 'The component index', '<p>Name · what it\'s for · the import line · variants · missing states · status. One row per component, written in the same change that creates it; the second component is where reinvention starts.</p>', co.source ? `${co.source} · present, no rows` : '/design-tokens-init writes docs/design/COMPONENTS.md at the first component · /design-library generates the manifest at V1', co.source || 'docs/design/COMPONENTS.md · absent')}</div>`);

  // 10 · Patterns
  const pa = patterns;
  const pairRow = (r) => `<tr>${r.id ? `<td class="mono">${esc(r.id)}</td>` : ''}<td><strong>${esc(r.pattern)}</strong>${r.situation ? `<div class="t-small">${esc(r.situation)}</div>` : ''}</td><td class="do">${r.rule ? esc(r.rule) : '<span class="unk">no rule</span>'}</td><td class="dont">${r.anti ? esc(r.anti) : '<span class="unk">no anti-pattern — the pair is the point</span>'}</td>${r.id ? `<td class="mono">${esc(r.firstSeen || '—')}</td>` : ''}</tr>`;
  const groupBlock = (g, i) => `<article class="block" id="patterns-${i}" data-title="Patterns — ${esc(g.heading)}"><div class="head"><h3>${esc(g.heading)} <span class="sub">· ${g.rows.length} · inherited</span></h3></div><div class="body"><div class="tscroll"><table class="t pairs"><thead><tr><th>Pattern</th><th>Do</th><th>Don't</th></tr></thead><tbody>${g.rows.map(pairRow).join('')}</tbody></table></div></div><div class="foot"><span class="chip asserted">seeded by /design-review</span><span class="src">docs/design/PATTERNS.md · ${esc(g.heading)}</span></div><div class="actions"></div></article>`;
  const oursBlock = pa.ours.length ? `<article class="block" id="patterns-ours" data-title="Patterns — ours"><div class="head"><h3>Ours <span class="sub">— the ones this product grew · ${pa.ours.length}</span></h3></div><div class="body"><div class="tscroll"><table class="t pairs"><thead><tr><th>ID</th><th>Pattern</th><th>Do</th><th>Don't</th><th>First seen</th></tr></thead><tbody>${pa.ours.map(pairRow).join('')}</tbody></table></div><p class="t-small" style="margin-top:10px">A review finding can say <em>violates PAT-n</em> instead of re-arguing the rule. These are the ones worth showing a designer.</p></div><div class="foot"><span class="chip dec">${pa.ours.length} of ours</span><span class="src">docs/design/PATTERNS.md · Ours</span></div><div class="actions"></div></article>`
    : hole('patterns-ours', 'Ours — the patterns this product grew', '<p>Empty on purpose until the same decision comes up twice in a review. Once is a choice; twice is a pattern, and it gets a <code>PAT-n</code> so a finding can name it.</p>', '/design-review names it · /extract promotes a repeated shape', pa.present ? 'docs/design/PATTERNS.md · Ours is empty' : 'docs/design/PATTERNS.md · absent');
  const refusedBlock = pa.refused.length ? `<article class="block" id="patterns-refused" data-title="Patterns — refused"><div class="head"><h3>Refused <span class="sub">— considered, rejected, kept so nobody proposes it again</span></h3></div><div class="body"><div class="tscroll"><table class="t"><thead><tr><th>Pattern</th><th>Why refused</th><th>On</th></tr></thead><tbody>${pa.refused.map((r) => `<tr><td><strong>${esc(r.pattern)}</strong></td><td>${esc(r.why)}</td><td class="mono">${esc(r.on || '—')}</td></tr>`).join('')}</tbody></table></div></div><div class="foot"><span class="chip dec">${pa.refused.length} refused</span><span class="src">docs/design/PATTERNS.md · Refused</span></div><div class="actions"></div></article>` : '';
  const doDontBlock = (guide.doDont || []).length ? `<article class="block" id="patterns-dodont" data-title="Do / Don't — from the style guide"><div class="head"><h3>Do / Don't <span class="sub">— the rule rung, from the style guide · ${guide.doDont.length}</span></h3></div><div class="body"><div class="tscroll"><table class="t pairs"><thead><tr><th>Do</th><th>Don't</th><th>Because</th></tr></thead><tbody>${guide.doDont.map((r) => `<tr><td class="do">${esc(r.do)}</td><td class="dont">${esc(r.dont)}</td><td>${esc(r.because)}</td></tr>`).join('')}</tbody></table></div><p class="t-small" style="margin-top:10px">The only rung an agent can act on. A principle above that never produced a row here isn't steering anything yet.</p></div><div class="foot"><span class="chip dec">${guide.doDont.length} pair${guide.doDont.length === 1 ? '' : 's'}</span><span class="src">docs/design/STYLE_GUIDE.md · Do / Don't</span></div><div class="actions"></div></article>` : '';
  const nPat = pa.ours.length + pa.groups.reduce((a, g) => a + g.rows.length, 0);
  const patternsCh = chapter('patterns', 11, 'Patterns', pa.present ? `${nPat} pattern${nPat === 1 ? '' : 's'}${pa.ours.length ? `, ${pa.ours.length} of them ours` : ', none of them ours yet'}${pa.refused.length ? ` · ${pa.refused.length} refused` : ''}.` : 'No pattern set yet.',
    'A pattern is a recurring decision with a rule attached — one level above a component, one below a flow. The rule and the anti-pattern sit side by side because a rule you can see is one you stop arguing about. Ours first; the inherited groups after.',
    pa.present || (guide.doDont || []).length ? `      <div class="blocks one">
        ${oursBlock}
        ${doDontBlock}
        ${pa.groups.map(groupBlock).join('\n        ')}
        ${refusedBlock}
      </div>`
      : `      <div class="blocks one">${hole('patterns-none', 'The pattern set', '<p>Five states · empty state · error copy · destructive confirm · terminology — the rules every product needs, seeded at the first review, then the ones this product grows with a <code>PAT-n</code> each.</p>', '/design-review writes docs/design/PATTERNS.md the first time it runs', 'docs/design/PATTERNS.md · absent')}</div>`);

  // 11 · Flows
  const fl = flows;
  const pathChip = (ok, label) => ok ? `<span class="chip dec">${label}</span>` : `<span class="chip find">${label} · missing</span>`;
  const flowBlock = (f, i) => { const noWhy = f.happy.filter((st) => !st.why); return `<article class="block" id="flow-${i + 1}" data-title="Flow — ${esc(f.name)}"><div class="head"><h3>${esc(f.name)} <span class="sub">· ${esc(f.entry || 'no entry')} → ${esc(f.endsAt || '?')}${f.owner ? ` · ${esc(f.owner)}` : ''}</span></h3></div><div class="body">${f.happy.length ? `<div class="tscroll"><table class="t"><thead><tr><th>#</th><th>Step</th><th>Asks the user for</th><th>Why it's needed <em>now</em></th></tr></thead><tbody>${f.happy.map((st) => `<tr><td class="mono">${esc(st.n)}</td><td>${esc(st.step)}</td><td>${esc(st.asks || '—')}</td><td class="${st.why ? '' : 'n'}">${st.why ? esc(st.why) : '<strong>cannot say — the step to cut</strong>'}</td></tr>`).join('')}</tbody></table></div>` : f.deferred ? '<p class="t-small">The happy path, cut list, first-run and failure paths live in the FEAT — the index holds the row, the FEAT holds the detail, and two copies diverge.</p>' : '<p class="unk">No step table — the cut test needs one: each step names what it asks for and why now.</p>'}${f.cut.length ? `<p class="t-small" style="margin-top:10px"><strong>Cut, and kept:</strong> ${f.cut.map((c) => `${esc(c.cut)}${c.why ? ` — <em>${esc(c.why)}</em>` : ''}`).join(' · ')}</p>` : ''}${noWhy.length ? `<p class="t-small" style="margin-top:10px;color:var(--stale)"><strong>${noWhy.length} step${noWhy.length === 1 ? '' : 's'} cannot say why now.</strong> Asking is the most expensive thing an interface does; a step that can't say why it's needed now is the step to cut.</p>` : ''}</div><div class="foot">${f.deferred ? '<span class="chip asserted">three paths · in the FEAT</span>' : `${pathChip(f.happy.length > 0, 'happy')}${pathChip(f.firstRun, 'first-run')}${pathChip(f.failure, 'failure')}`}<span class="src">docs/design/FLOWS.md${f.owner ? ` · ${esc(f.owner)}` : ''}</span></div><div class="actions"></div></article>`; };
  const flowsCh = chapter('flows', 12, 'Flows', fl.flows.length ? `${fl.flows.length} flow${fl.flows.length === 1 ? '' : 's'}, each with three paths or a hole where one is missing.` : 'No flow named yet.',
    'The one layer no checker can give you: the sequence is a judgment a person made and wrote down. A flow is entry → steps → exit, plus the first-run path (the one that ships broken) and the failure path (where they land, what they keep). Each step says why it is needed <em>now</em> — the step that can\'t is the step to cut.',
    fl.flows.length ? `      <div class="blocks one">
        <article class="block" id="flows-index" data-title="Flows — the index"><div class="head"><h3>Index</h3></div><div class="body"><div class="tscroll"><table class="t"><thead><tr><th>Flow</th><th>Entry</th><th>Steps</th><th>Ends at</th><th>Owned by</th><th>Paths</th></tr></thead><tbody>${fl.flows.map((f, i) => `<tr><td><a href="#flow-${i + 1}">${esc(f.name)}</a></td><td class="mono">${esc(f.entry)}</td><td class="tab">${esc(f.steps || '—')}</td><td>${esc(f.endsAt)}</td><td class="mono">${esc(f.owner || '—')}</td><td>${f.deferred ? '<span class="chip asserted">in the FEAT</span>' : f.section ? `${[f.happy.length > 0, f.firstRun, f.failure].filter(Boolean).length} of 3` : '<span class="chip find">no section</span>'}</td></tr>`).join('')}</tbody></table></div></div><div class="foot"><span class="src">docs/design/FLOWS.md${fl.updated ? ` · rev. ${esc(String(fl.updated))}` : ''}</span></div><div class="actions"></div></article>
        ${fl.flows.map(flowBlock).join('\n        ')}
      </div>`
      : `      <div class="blocks one">${hole('flows-none', 'The flow index', '<p>One row per sequence a user would name — entry, steps, where it ends, which FEAT owns it — and under each the three paths and the cut list.</p>', '/spec writes docs/design/FLOWS.md the first time a FEAT with a surface names its flow', fl.present ? 'docs/design/FLOWS.md · present, no rows' : 'docs/design/FLOWS.md · absent')}</div>`);

  // 12 · Content
  const ct = content;
  const termsBlock = ct.terms.length ? `<article class="block" id="content-terms" data-title="Terminology"><div class="head"><h3>Terminology <span class="sub">— one word per concept · ${ct.terms.length}</span></h3></div><div class="body"><div class="tscroll"><table class="t pairs"><thead><tr><th>Use</th><th>Never</th><th>Because</th></tr></thead><tbody>${ct.terms.map((t) => `<tr><td class="do"><span class="val" data-copy="${esc(`value=${t.use}`)}">${esc(t.use)}</span></td><td class="dont">${esc(t.never || '—')}</td><td>${esc(t.because)}</td></tr>`).join('')}</tbody></table></div><p class="t-small" style="margin-top:10px">The one content rule that is mechanically checkable. ${guards.find((g) => g.name === 'content-terminology-guard' && g.on) ? '<code>content-terminology-guard</code> is on — a refused word in a string is caught at the write.' : '<code>boss hooks enable content-terminology-guard</code> makes it hold — a refused word in a string, caught at the write.'}</p></div><div class="foot"><span class="chip dec">${ct.terms.length} term${ct.terms.length === 1 ? '' : 's'}</span><span class="src">docs/design/STYLE_GUIDE.md · Terminology</span></div><div class="actions"></div></article>`
    : hole('content-terms', 'Terminology', '<p>Use · never · because. The cheapest content rule to write and the most expensive to change late — renaming a core noun hits copy, routes, schema, tests and every prompt at once. Pick the user\'s word over the internal one.</p>', 'docs/design/STYLE_GUIDE.md · Terminology — the table is there, blank', guide.present ? 'docs/design/STYLE_GUIDE.md · Terminology empty' : 'docs/design/STYLE_GUIDE.md · absent');
  const voiceBlock = !ct.deferred ? `<article class="block" id="content-voice" data-title="Voice and tone"><div class="head"><h3>Voice, and how it shifts <span class="sub">— the real strings</span></h3></div><div class="body">${ct.voiceTraits.length ? `<ul>${ct.voiceTraits.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>` : holeLine('voice traits', 'three, each with what it gives up')}${ct.toneAll.length ? `<div class="tscroll" style="margin-top:10px"><table class="t"><thead><tr><th>Context</th><th>How the voice shifts</th><th>Real string</th></tr></thead><tbody>${ct.toneAll.map((t) => `<tr><td><strong>${esc(t.context)}</strong></td><td>${esc(t.shift || '—')}</td><td>${t.string ? `<span class="val" data-copy="${esc(`value=${t.string}`)}">“${esc(t.string)}”</span>` : '<span class="unk">no string yet — an agent can\'t act on an adjective</span>'}</td></tr>`).join('')}</tbody></table></div>` : ''}${ct.surfaces.length ? `<p class="t-small" style="margin-top:10px">${ct.surfaces.map((s) => `<strong>${esc(s.surface)}:</strong> ${esc(s.rule)}`).join(' · ')}</p>` : ''}</div><div class="foot"><span class="chip ${ct.tone.length ? 'dec' : 'asserted'}">${ct.tone.length} of ${ct.toneAll.length} contexts have a real string</span><span class="src">docs/design/STYLE_GUIDE.md · Voice in the interface</span></div><div class="actions"></div></article>`
    : `<article class="block dormant" id="content-voice" data-title="Voice and tone"><div class="head"><h3>Voice, and how it shifts</h3></div><div class="body">Deferred, and deferring it is a real choice: until people have been watched using the product, "plain over clever" cannot be told from "friendly over formal", and a table filled in because it was asked for steers nothing. Terminology first; come back when there is enough copy to be inconsistent about.<span class="cond">wakes when the Error and Warning rows get a real string · high-stakes domains fill those two on day one</span></div><div class="foot"><span class="chip asserted">deferred by rule</span><span class="src">docs/design/STYLE_GUIDE.md · Voice in the interface · placeholders</span></div><div class="actions"></div></article>`;
  const contentCh = chapter('content', 13, 'Content', ct.terms.length || ct.tone.length ? `${ct.terms.length} term${ct.terms.length === 1 ? '' : 's'} · ${ct.tone.length} real string${ct.tone.length === 1 ? '' : 's'}.` : 'The words are not written down yet.',
    'The words are half the interface. Voice is constant; tone shifts by context; both get down to real strings, because an agent can act on “Delete 14 records. This can\'t be undone.” and cannot act on “confident”. The brand\'s <em>how it sounds</em> line is the source; this is where it becomes rules.',
    `      <div class="blocks one">
        ${termsBlock}
        ${voiceBlock}
      </div>`);

  // 13 · Accessibility
  const floorList = (guide.floor || []).length ? `<ul>${guide.floor.map((f) => `<li>${esc(f)}</li>`).join('')}</ul>` : '<p class="unk">No floor written — the style guide template carries four lines: contrast by token pair, a visible focus state, reduced motion honoured, nothing by colour alone.</p>';
  const guardRows = guards.map((g) => `<tr><td class="mono">${esc(g.name)}</td><td>${esc(g.does)}</td><td class="${g.on ? 'ok' : 'q'}">${g.on ? 'on' : `off · <code>boss hooks enable ${esc(g.name)}</code>`}</td></tr>`).join('');
  const a11yCh = chapter('a11y', 14, 'Accessibility', pairs.length ? `${pairs.length} pair${pairs.length === 1 ? '' : 's'} computed, ${findings} finding${findings === 1 ? '' : 's'}; everything else needs a person.` : 'Nothing computed yet; everything needs a person.',
    'One check here is arithmetic — contrast over two declared numbers — and it is computed. Every other check is a judgment or needs a rendered page, and the honest word for those is <em>not checked</em>, said once, never mistaken for a pass.',
    `      <div class="blocks one">
        <article class="block" id="a11y-floor" data-title="Accessibility — the floor"><div class="head"><h3>The floor <span class="sub">— not negotiable, not a phase</span></h3></div><div class="body">${floorList}</div><div class="foot"><span class="src">docs/design/STYLE_GUIDE.md · Accessibility floor</span></div><div class="actions"></div></article>
        <article class="block" id="a11y-computed" data-title="Accessibility — what is computed"><div class="head"><h3>Computed <span class="sub">— contrast, once, where the tokens are</span></h3></div><div class="body"><p>${pairs.length ? `<strong>${pairs.length} declared text-on-surface pair${pairs.length === 1 ? '' : 's'}</strong>, <strong>${findings} under AA</strong> — the table is in <a href="#colour-contrast">Colour → Contrast</a>, once. A pair that fails is a token finding: fix it in ${esc(src)} and every screen moves.` : 'No pair to compute yet — name a colour like text and one like a surface and the arithmetic follows.'}</p><div class="tscroll" style="margin-top:10px"><table class="t"><thead><tr><th>Guard</th><th>What it holds</th><th>State</th></tr></thead><tbody>${guardRows}</tbody></table></div></div><div class="foot"><span class="chip ${findings ? 'find' : 'dec'}">${findings} finding${findings === 1 ? '' : 's'} · token-level</span><span class="chip asserted">${guards.filter((g) => g.on).length} of ${guards.length} guards on</span><span class="src">.claude/settings.json · ${esc(src)}</span></div><div class="actions"></div></article>
        <article class="block" id="a11y-notchecked" data-title="Accessibility — not checked"><div class="head"><h3>Not checked <span class="sub">— said once, for everything below</span></h3></div><div class="body"><ul><li><strong>Focus</strong> — every interactive element has a visible focus state</li><li><strong>Keyboard</strong> — every flow completes without a pointer</li><li><strong>Screen reader</strong> — names, roles, the order things are announced</li><li><strong>Colour alone</strong> — nothing is communicated only by hue</li><li><strong>Motion</strong> — <code>prefers-reduced-motion</code> honoured by every animation</li><li><strong>Text over an image, a gradient, a translucent overlay</strong> — composites at runtime; the token pairs cannot see it</li><li><strong>320px</strong> — reads and works at the narrowest width</li></ul><p class="t-small" style="margin-top:10px">Each needs a rendered page or a person. <code>/ux-check</code> walks them against shipped UI and writes <em>not checked</em> where it cannot see — the same word as here, never a pass by omission.</p></div><div class="foot"><span class="chip asserted">7 · not checked</span><span class="src">needs a render or a person · /ux-check</span></div><div class="actions"></div></article>
      </div>`);


  // 8 · Icons & logo
  const ic = icons, lg = logo;
  const iconTile = (f) => `<div class="icon val" data-copy="${esc(`svg=${f.svg}`)}" title="Copy as SVG"><span class="g" aria-hidden="true">${f.svg}</span><b>${esc(f.name)}</b><span class="m">${f.size ? `${f.size}px` : f.viewBox ? esc(f.viewBox) : ''} · ${f.bytes} B</span></div>`;
  const dec = ic.decision;
  const decisionRows = [['The set', dec.set, 'one, named — it is a dependency'], ['Sizes that exist', dec.sizes, 'two or three, not "whatever fits"'], ['Icon-only is allowed when', dec.iconOnly, 'and it still needs an accessible name'], ['What an icon never does', dec.never, 'carry meaning nothing else carries']];
  const decided = decisionRows.filter(([, v]) => v).length;
  const iconsBlock = ic.files.length ? `<article class="block" id="icons-set" data-title="Icons — the set" data-svg="${esc(ic.sprite)}"><div class="head"><h3>The set <span class="sub">· ${ic.files.length} icon${ic.files.length === 1 ? '' : 's'} · drawn from the files · click one to copy its SVG · <em>SVG</em> on this block copies the set as one sprite</span></h3></div><div class="body"><div class="icons">${ic.files.map(iconTile).join('')}</div><p class="t-small" style="margin-top:10px">The sprite is one <code>&lt;svg&gt;</code> of <code>&lt;symbol id="icon-&lt;name&gt;"&gt;</code> — the honest download: paste it once into a design tool or a page and reference each icon by id.</p></div><div class="foot"><span class="chip dec">${ic.files.length} files</span><span class="src">docs/design/icons/*.svg</span></div><div class="actions"></div></article>`
    : hole('icons-set', 'The set, as files', '<p>One SVG per icon under <code>docs/design/icons/</code>. The page draws each from its file, copies any one as SVG, and copies the set as a sprite — nothing is drawn that isn\'t a file.</p>', 'drop the files in docs/design/icons/ — a designer\'s export, or the set you chose', ic.present ? 'docs/design/icons/ · present, no .svg' : 'docs/design/icons/ · absent');
  const decisionBlock = `<article class="block${decided ? '' : ' hole'}" id="icons-decision" data-title="Icons — the decision"><div class="head"><h3>The decision <span class="sub">— the set is a dependency; decide it before the second icon</span></h3></div><div class="body">${decided ? `<ul>${decisionRows.map(([k, v, hint]) => `<li><strong>${k}:</strong> ${v ? esc(v) : `<span class="unk">not decided — ${esc(hint)}</span>`}</li>`).join('')}</ul>` : `<p>Which set, which sizes exist, when icon-only is allowed, what an icon never does. Swapping sets later touches every use site; mixing two is visible to anyone even if they can't say why.</p><span class="verb">docs/design/STYLE_GUIDE.md · 1b. Icons — four lines</span>`}</div><div class="foot"><span class="chip ${decided === decisionRows.length ? 'dec' : 'asserted'}">${decided} of ${decisionRows.length} decided</span><span class="src">docs/design/STYLE_GUIDE.md · Icons</span></div><div class="actions"></div></article>`;
  const name = brand.name;
  const displayFam = type.find((t) => Array.isArray(t.value) && /display|heading|brand/i.test(t.name)) || type.find((t) => Array.isArray(t.value));
  const wmStyle = displayFam ? ` style="font-family:${esc(displayFam.value.map((f) => (/\s/.test(f) ? `'${f}'` : f)).join(', '))}"` : '';
  const markHtml = lg.markSvg ? lg.markSvg : lg.mark ? `<img src="${esc(lg.mark.split('/').map(encodeURIComponent).join('/'))}" alt="${esc(name)} mark">` : '';
  const wordHtml = lg.wordmarkSvg ? lg.wordmarkSvg : `<span class="wm"${wmStyle}>${esc(name)}</span>`;
  const lockups = lg.mark ? `<div class="lockups"><div class="lk paper"><div class="a">${markHtml}${wordHtml}</div><span class="m">mark + wordmark · on paper</span></div><div class="lk accent"><div class="a">${markHtml}<span class="wm"${wmStyle}>${esc(name)}</span></div><span class="m">on the accent</span></div><div class="lk paper"><div class="a">${markHtml}</div><span class="m">the mark alone</span></div><div class="lk paper"><div class="a">${wordHtml}</div><span class="m">the wordmark alone${lg.wordmarkFile ? '' : ' · the name in the display face'}</span></div></div>` : '';
  const logoRules = [['Clear space', lg.clearSpace], ['Minimum size', lg.minimum], ['Colour', lg.colour], ['With the tagline', lg.tagline], ['Misuse', lg.misuse]];
  const rulesFilled = logoRules.filter(([, v]) => v).length;
  const logoBlock = lg.mark ? `<article class="block" id="logo" data-title="The logo"${lg.markSvg ? ` data-svg="${esc(lg.markSvg)}"` : ''}><div class="head"><h3>The logo <span class="sub">· ${esc(lg.mark)}${lg.wordmarkFile ? ` · ${esc(lg.wordmarkFile)}` : ''}${lg.markSvg ? ' · <em>SVG</em> copies the mark' : ''}</span></h3></div><div class="body">${lockups}<ul style="margin-top:12px">${logoRules.map(([k, v]) => `<li><strong>${k}:</strong> ${v ? esc(v) : '<span class="unk">not written</span>'}</li>`).join('')}</ul></div><div class="foot"><span class="chip ${rulesFilled ? 'dec' : 'asserted'}">${rulesFilled} of ${logoRules.length} rules written</span><span class="src">docs/BRAND.md · logo: · docs/design/STYLE_GUIDE.md · Logo</span></div><div class="actions"></div></article>`
    : hole('logo', 'The logo', `<p>The mark and the wordmark as lockups — on paper, on the accent, each alone — with clear space, minimum size, colour, the tagline rule and the misuse pair. Nothing is drawn until there is a file: a placeholder mark becomes the logo in about a week.</p>`, 'docs/BRAND.md · logo: <path to the mark .svg> — then a ## Logo section with the five rules', brand.present ? 'docs/BRAND.md · no logo: path' : 'docs/BRAND.md · absent');
  const iconsCh = chapter('icons', 8, 'Icons & logo', ic.files.length || lg.mark ? `${ic.files.length ? `${ic.files.length} icon${ic.files.length === 1 ? '' : 's'} from files` : 'no icon files'}${lg.mark ? ' · the mark from its file' : ' · no mark'}.` : 'No icon files, no mark — the slots, not placeholders.',
    'An icon set is a dependency and a logo is the one drawing everything else defers to. Both render from files or not at all: the page copies what exists as SVG and says what is missing, and never draws a stand-in that would quietly become the real thing.',
    `      <div class="blocks">
        ${iconsBlock}
        ${decisionBlock}
      </div>
      <div class="blocks one" style="margin-top:14px">
        ${logoBlock}
      </div>`);

  // 15 · Resources
  const rs = resources;
  const kitN = rs.kit.filter((k) => k.design).length;
  const importList = components.components.filter((c) => c.import).map((c) => c.import).join('\n');
  const dl = rs.tokensText ? `<a class="dl" href="data:application/json;charset=utf-8,${encodeURIComponent(rs.tokensText)}" download="tokens.json">Download tokens.json</a>` : '';
  const resourcesCh = chapter('resources', 15, 'Resources', rs.tokensText ? 'Take it with you — the one file, and what derives from it.' : 'Nothing to take yet.',
    'Everything here is a file on disk or derived from one at render. The tokens file is the seam between code and a design tool: on any plan a tokens plugin reads it; an enterprise API can read and write it; native import without a plugin is unverified. The page says which, and never promises a round trip.',
    `      <div class="blocks">
        ${rs.tokensText ? `<article class="block" id="res-tokens" data-title="Resources — the tokens file" data-code="${esc(JSON.stringify({ 'tokens.json (DTCG)': rs.tokensText, 'CSS variables — derived at render': rs.css }))}"><div class="head"><h3>The tokens file <span class="sub">· W3C DTCG · the source of every value on this page</span></h3></div><div class="body"><p>${tokens.tokens.length} token${tokens.tokens.length === 1 ? '' : 's'} · ${Buffer.byteLength(rs.tokensText)} bytes. <em>Code</em> copies the file, or the <code>:root { --… }</code> block derived from it. ${dl}</p><pre class="pre">${esc(rs.css.split('\n').slice(0, 8).join('\n'))}${rs.css.split('\n').length > 8 ? '\n  …' : ''}</pre><p class="t-small">Your design tool: a tokens plugin on any plan reads this file; the enterprise API reads and writes it; native import is unverified — check before planning around it. The return trip is the same file, exported back and diffed.</p></div><div class="foot"><span class="chip dec">DTCG 2025.10</span><span class="src">docs/design/tokens.json</span></div><div class="actions"></div></article>`
          : hole('res-tokens', 'The tokens file', '<p>One DTCG file, written always, whatever the stack — the portable half. The stack file (CSS variables, a theme object) is derived from it, never the other way round.</p>', '/design-tokens-init writes docs/design/tokens.json', 'docs/design/tokens.json · absent')}
        ${components.components.length ? `<article class="block" id="res-imports" data-title="Resources — the import lines" data-code="${esc(JSON.stringify({ 'Import lines — every component': importList }))}"><div class="head"><h3>The import lines <span class="sub">· ${components.components.filter((c) => c.import).length} · the reuse list, as one paste</span></h3></div><div class="body"><pre class="pre">${esc(importList)}</pre></div><div class="foot"><span class="src">${esc(components.source)}</span></div><div class="actions"></div></article>` : ''}
        ${ic.files.length ? `<article class="block" id="res-sprite" data-title="Resources — the icon sprite" data-svg="${esc(ic.sprite)}"><div class="head"><h3>The icon sprite <span class="sub">· ${ic.files.length} symbols · <em>SVG</em> copies it</span></h3></div><div class="body"><p class="t-small">One <code>&lt;svg&gt;</code> of <code>&lt;symbol&gt;</code>s. In a page: <code>&lt;svg&gt;&lt;use href="#icon-${esc(ic.files[0].name)}"/&gt;&lt;/svg&gt;</code>. In a design tool: paste, and each symbol is a layer.</p></div><div class="foot"><span class="src">docs/design/icons/*.svg</span></div><div class="actions"></div></article>` : ''}
        <article class="block${components.components.length ? '' : ' dormant'}" id="res-kit" data-title="Resources — kit coverage"><div class="head"><h3>Kit coverage <span class="sub">— which components have a counterpart in your design tool</span></h3></div><div class="body">${components.components.length ? `<p><strong>${kitN} of ${rs.kit.length}</strong> component${rs.kit.length === 1 ? ' carries' : 's carry'} a <code>design:</code> link.</p><ul style="margin-top:8px">${rs.kit.map((k) => `<li><code>${esc(k.name)}</code> — ${k.design ? `<a href="${esc(k.design)}" rel="noopener">Open in your design tool</a>` : '<span class="unk">no link</span>'}</li>`).join('')}</ul><p class="t-small" style="margin-top:10px">A link is a URL into your own file and node: a <code>design</code> field on the component in the manifest, or a <em>Design</em> column in <code>COMPONENTS.md</code>. Coverage is a fact about links, never about whether the two match — a component is stable when the code, the docs and the kit agree, and this page can only show which of the three exist.</p>` : 'No components, so nothing to cover.<span class="cond">wakes with the first component row</span>'}</div><div class="foot"><span class="chip ${kitN ? 'dec' : 'asserted'}">${kitN} of ${rs.kit.length} linked</span><span class="src">manifest.json · design: · COMPONENTS.md · Design column</span></div><div class="actions"></div></article>
      </div>`);

  // 16 · Exceptions
  const ex = exceptions;
  const exGroup = (g, i) => `<article class="block" id="exception-${i + 1}" data-title="Exceptions — ${esc(g.rule)}"><div class="head"><h3>${esc(g.rule)} <span class="sub">· ${g.rows.length} · ${esc(g.verdict)}</span></h3></div><div class="body"><div class="tscroll"><table class="t"><thead><tr><th>Date</th><th>Where</th><th>What</th><th>Why</th></tr></thead><tbody>${g.rows.map((r) => `<tr><td class="mono">${esc(r.date || '—')}</td><td>${esc(r.where)}</td><td>${esc(r.what)}</td><td>${esc(r.why)}</td></tr>`).join('')}</tbody></table></div></div><div class="foot"><span class="chip ${g.rows.length >= 3 ? 'find' : g.rows.length === 2 ? 'stale' : 'dec'}">${g.rows.length} · ${esc(g.verdict)}</span><span class="src">docs/design/STYLE_GUIDE.md · Exceptions</span></div><div class="actions"></div></article>`;
  const exceptionsCh = chapter('exceptions', 16, 'Exceptions', ex.rows.length ? `${ex.rows.length} recorded, against ${ex.groups.length} rule${ex.groups.length === 1 ? '' : 's'}.` : 'None recorded.',
    'A deliberate departure, dated, is a decision; an unrecorded one is drift that reads as precedent next time. Grouped by the rule each departs from, because three against one rule is not three exceptions — it is a rule being worked around, and the working-around is the real convention now.',
    ex.rows.length ? `      <div class="blocks one">\n        ${ex.groups.map(exGroup).join('\n        ')}\n      </div>`
      : `      <div class="blocks one"><article class="block dormant" id="exceptions-none" data-title="Exceptions"><div class="head"><h3>None recorded</h3></div><div class="body">Either every screen keeps every rule, or a departure went unrecorded. The first is rare and the second is the one to check: an exception written down here is what stops it reading as precedent.<span class="cond">docs/design/STYLE_GUIDE.md · Exceptions — Date · Where · What · Why, one row per departure</span></div><div class="foot"><span class="chip asserted">0 recorded</span><span class="src">${guide.present ? 'docs/design/STYLE_GUIDE.md · Exceptions empty' : 'docs/design/STYLE_GUIDE.md · absent'}</span></div><div class="actions"></div></article></div>`);

  const rail = [
    { group: 'Why it looks like this', items: [{ href: 'brand', n: 1, label: 'Start here', hole: !shape.present }, { href: 'people', n: 2, label: 'People', hole: !personas.length }, { href: 'journey', n: 3, label: 'The journey', hole: !journey.stages.length }, { href: 'principles', n: 4, label: 'Principles', hole: !guide.principles.length }] },
    { group: 'The language', items: [{ href: 'colour', n: 5, label: 'Colour', hole: !color.length }, { href: 'type', n: 6, label: 'Type', hole: !type.length }, { href: 'shape', n: 7, label: 'Space & shape', hole: !(space.length || radius.length || elevation.length) }, { href: 'icons', n: 8, label: 'Icons & logo', hole: !(icons.files.length || logo.mark) }, { href: 'layout', n: 9, label: 'Layout', hole: !guide.layout }] },
    { group: 'The parts', items: [{ href: 'components', n: 10, label: 'Components', hole: !components.components.length }, { href: 'patterns', n: 11, label: 'Patterns', hole: !(patterns.ours.length + patterns.groups.length) }, { href: 'flows', n: 12, label: 'Flows', hole: !flows.flows.length }] },
    { group: 'Every screen', items: [{ href: 'content', n: 13, label: 'Content', hole: !(content.terms.length + content.tone.length + content.voiceTraits.length) }, { href: 'a11y', n: 14, label: 'Accessibility', hole: !((guide.floor || []).length || pairs.length) }] },
    { group: 'Take it with you', items: [{ href: 'resources', n: 15, label: 'Resources', hole: !resources.tokensText }] },
    { group: 'Kept honest', items: [{ href: 'exceptions', n: 16, label: 'Exceptions', hole: false }, { href: 'research', n: 17, label: 'Research', hole: !research.evid.length }] },
  ];
  const extraCss = `
  .swatches { display: grid; grid-template-columns: repeat(auto-fill, minmax(128px, 1fr)); gap: 10px; } .sw i { display: block; height: 52px; border-radius: 6px; margin-bottom: 7px; border: 1px solid var(--rule-2); } .sw i.val { border-bottom: 1px solid var(--rule-2); } .sw i.val:hover { outline: 2px solid var(--accent); outline-offset: 2px; }
  .sw b { display: block; font-family: var(--mono); font-size: 11.5px; font-weight: 500; color: var(--ink); } .sw span { display: block; font-family: var(--mono); font-size: 10.5px; color: var(--muted); } .sw .dec { margin-top: 4px; font-family: var(--body); font-size: 11.5px; color: var(--ink-2); } .sw .dec em { color: var(--muted); } .sw.retired b { text-decoration: line-through; color: var(--muted); } .sw .ret { color: var(--stale); }
  .sw .val { display: inline; } .unk { color: var(--hole); font-style: italic; }
  .scale { display: grid; gap: 10px; } .scale .row { display: grid; grid-template-columns: 220px 1fr; gap: 14px; align-items: baseline; border-bottom: 1px solid var(--rule-2); padding-bottom: 8px; } .scale .row:last-child { border-bottom: 0; }
  .scale .meta { font-family: var(--mono); font-size: 11px; color: var(--muted); line-height: 1.5; } .scale .meta b { display: block; color: var(--ink); font-weight: 500; } .scale .meta .d { display: block; font-family: var(--body); color: var(--ink-2); } .scale .spec { font-size: 22px; line-height: 1.2; }
  .bars { display: grid; gap: 8px; } .bars .row { display: grid; grid-template-columns: 120px 1fr; gap: 12px; align-items: center; font-family: var(--mono); font-size: 11.5px; color: var(--muted); } .bars .row i { display: block; height: 14px; background: var(--accent-soft); border-left: 2px solid var(--accent); }
  .radii { display: flex; gap: 14px; flex-wrap: wrap; } .radii div { width: 84px; height: 56px; border: 1.5px solid var(--ink-2); display: grid; place-items: end; padding: 6px; font-family: var(--mono); font-size: 10.5px; color: var(--muted); }
  .elev { display: flex; gap: 16px; flex-wrap: wrap; } .elev div { width: 120px; height: 70px; background: var(--paper); border-radius: 8px; display: grid; place-items: center; font-family: var(--mono); font-size: 10.5px; color: var(--muted); }
  .persona .who { font-family: var(--display); font-size: 21px; line-height: 1.3; margin-bottom: 12px; } .persona .dontknow { margin-top: 12px; padding: 10px 12px; border: 1px dashed var(--rule); border-radius: 6px; color: var(--ink-2); font-size: 14px; } .persona .pgrid ul { margin: 0; padding-left: 18px; font-size: 14px; } .persona .pgrid li + li { margin-top: 3px; }
  .principle .statement { font-family: var(--display); font-size: 22px; line-height: 1.3; max-width: 34ch; margin-bottom: 12px; } .pgrid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 12px 24px; } .pgrid h4 { font-family: var(--mono); font-size: 10.5px; letter-spacing: .06em; text-transform: uppercase; color: var(--muted); margin: 0 0 6px; font-weight: 500; } .pgrid p { font-size: 14.5px; }
  .sub-title { display: flex; align-items: baseline; gap: 12px; flex-wrap: wrap; margin: 18px 0 6px; } .sub-title h4 { font-size: 15px; font-weight: 500; }
  .t.done td.y, .t td.ok { color: var(--chip-ev); } .t.done td.n, .t td.n { color: var(--bad); } .t.done td.q, .t td.q { color: var(--hole); font-style: italic; }
  .t.pairs td.do { border-left: 3px solid var(--chip-ev); padding-left: 10px; } .t.pairs td.dont { border-left: 3px solid var(--bad); padding-left: 10px; } tr.retired td { color: var(--muted); }
  .component .frame { margin: 10px 0; } .component .frame svg { max-width: 100%; height: auto; display: block; } .cmeta .import { font-family: var(--mono); font-size: 11.5px; padding: 6px 8px; border: 1px solid var(--rule-2); border-radius: 5px; background: var(--ground); cursor: pointer; word-break: break-all; } .cmeta .import:hover { outline: 2px solid var(--accent); outline-offset: 1px; } .cmeta .t-small { margin-top: 8px; }
  .icons { display: grid; grid-template-columns: repeat(auto-fill, minmax(104px, 1fr)); gap: 10px; } .icon { display: grid; justify-items: center; gap: 4px; padding: 12px 8px 10px; border: 1px solid var(--rule-2); border-radius: 6px; text-align: center; } .icon .g svg { width: 24px; height: 24px; display: block; } .icon b { font-family: var(--mono); font-size: 11px; font-weight: 500; } .icon .m { font-family: var(--mono); font-size: 10px; color: var(--muted); }
  .lockups { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; } .lk { display: grid; gap: 8px; padding: 18px 14px 10px; border: 1px solid var(--rule-2); border-radius: 6px; } .lk .a { display: flex; align-items: center; gap: 10px; min-height: 40px; } .lk .a svg, .lk .a img { height: 32px; width: auto; max-width: 120px; } .lk .wm { font-size: 22px; letter-spacing: -.01em; } .lk .m { font-family: var(--mono); font-size: 10px; color: var(--muted); } .lk.paper { background: var(--ground); } .lk.accent { background: var(--accent); color: var(--accent-ink); } .lk.accent .m { color: var(--accent-ink); opacity: .8; }
  .pre { margin: 10px 0; padding: 10px 12px; background: var(--ground); border: 1px solid var(--rule-2); border-radius: 5px; font-family: var(--mono); font-size: 11.5px; line-height: 1.5; overflow-x: auto; white-space: pre; } .dl { display: inline-block; margin-left: 6px; padding: 2px 8px; border: 1px solid var(--accent); border-radius: 5px; font-size: 12.5px; text-decoration: none; }
  @media (max-width: 640px) { .scale .row { grid-template-columns: 1fr; gap: 4px; } }
`;
  const footer = [
    brand.present ? `brand: ${esc(brand.name)} · docs/BRAND.md${brand.accent ? '' : ' (accent unknown → default)'}${brand.nascent ? ' · nascent' : ''}` : 'brand: nascent — no docs/BRAND.md yet; rendered in the default. /landing seeds it.',
    `a read of your files — ${esc(src)} · docs/design/STYLE_GUIDE.md · docs/BRAND.md · docs/decisions · regenerated, never edited · <span class="tab">rendered ${esc(stampedAt)}</span>`,
    'seventeen sections, every one a read of a file · contrast is computed, everything else visual is inferred · icons and the logo render from files or not at all',
  ];
  return shellPage({ title: `${brand.name} — Design`, brand, projectDir: data.projectDir, current: 'design', ledgerHtml: ledger, rail, mainHtml: [start, people, journeyCh, principles, colour, typeCh, shapeCh, iconsCh, layout, componentsCh, patternsCh, flowsCh, contentCh, a11yCh, resourcesCh, exceptionsCh, researchCh].join('\n'), footerLines: footer, extraCss });
}

export function designHtml(projectDir, projectName) {
  const data = collectDesign(projectDir, projectName);
  data.projectDir = projectDir;
  const stampedAt = new Date().toISOString().slice(0, 16).replace('T', ' ');
  const html = renderDesignHtml(data, stampedAt);
  const dir = join(projectDir, '.boss');
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  const out = join(dir, 'design.html');
  writeFileSync(out, html);
  return { out, data };
}
