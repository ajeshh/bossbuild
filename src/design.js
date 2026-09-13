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

import { readFileSync, readdirSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { frontmatter } from './frontmatter.js';
import { readBrand } from './playbook.js';
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
  const slots = [
    ['brand', shape.present], ['people', personas.length > 0], ['journey', journey.stages.length > 0], ['principles', guide.principles.length > 0], ['colour', color.length > 0], ['type', type.length > 0], ['space', space.length + radius.length + elevation.length > 0], ['layout', guide.layout], ['research', research.evid.length > 0],
  ];
  return { projectName, brand, shape, tokens: tok, decs, anchor, guide, color, type, space, radius, elevation, motion, pairs, slots, personas, journey, research, findings: pairs.filter((p) => p.grade !== 'AA').length };
}

// --- render -------------------------------------------------------------------------------------------

const hole = (id, title, body, verb, src) => `<article class="block hole" id="${id}" data-title="${esc(title)}"><div class="head"><h3>${esc(title)}</h3></div><div class="body">${body}<span class="verb">${esc(verb)}</span></div><div class="foot"><span class="src">${esc(src)}</span></div><div class="actions"></div></article>`;
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
  const { brand, shape, tokens, decs, anchor, guide, color, type, space, radius, elevation, motion, pairs, slots, findings, projectName, personas, journey, research } = data;
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
  const layout = chapter('layout', 8, 'Layout', guide.layout ? 'A layout section exists.' : 'Nobody has decided how a page is built yet.', '',
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
  const researchCh = chapter('research', 9, 'Research', r.evid.length ? `${r.byRung.observed.length} observed · ${r.byRung.stated.length} stated${synth != null ? ` · the personas are ${synth}% inferred` : ''}.` : 'Nothing from outside the room yet.',
    'Research is everything that tells you whether the design is right — what people did, what they said, what the field does, what a reviewer can see. The same records the playbook keeps by date, cut here by the rung they reach and by the method that produced them. Grades, dates and methods only; never a quote. Coverage is a fact; readiness is a verdict.',
    `      <div class="blocks one">
        <article class="block" id="research-rungs" data-title="Research — by rung"><div class="head"><h3>By rung <span class="sub">— observed beats stated beats inferred</span></h3></div><div class="body"><div class="tscroll"><table class="t"><thead><tr><th>Rung</th><th>n</th><th>Records</th></tr></thead><tbody>${rungRow('observed', 'Observed — someone was watched, or paid, or showed up', r.byRung.observed, 'nobody has been watched using anything — the cheapest test is to sit beside one person')}${rungRow('stated', 'Stated — someone said something that bears on a design choice', r.byRung.stated, 'no conversation recorded — /interview preps one, /evidence grades it')}<tr><td><strong>Inferred — the founder\'s assumptions, marked as such</strong></td><td class="mono tab">${personas.length}</td><td>${personas.length ? esc(personas.map((p) => `${p.name} · synthetic ${p.synthetic ?? '?'}%`).join(' · ')) : '<span class="unk">no persona to mark</span>'}</td></tr>${r.byRung.ungraded.length ? `<tr><td><strong>Ungraded</strong></td><td class="mono tab">${r.byRung.ungraded.length}</td><td class="warn">${esc(r.byRung.ungraded.map((e) => e.id).join(' · '))} — a record with no <code>grade:</code> counts for nothing</td></tr>` : ''}</tbody></table></div></div><div class="foot"><span class="chip ${r.byRung.observed.length ? 'ev' : 'asserted'}">${r.evid.length} record${r.evid.length === 1 ? '' : 's'}${r.newest ? ` · newest ${esc(r.newest)}` : ''}</span><span class="src">docs/evidence/ · grades and dates only</span></div><div class="actions"></div></article>
        <article class="block" id="research-methods" data-title="Research — by method"><div class="head"><h3>By method <span class="sub">— what has been used, and what never has</span></h3></div><div class="body"><div class="tscroll"><table class="t"><thead><tr><th>Method</th><th>Rung it reaches</th><th>Used</th><th>Verb</th></tr></thead><tbody>${methodRows}</tbody></table></div><p class="t-small" style="margin-top:10px">Read it by rung: every <em>observed</em> method that says <em>never</em> is a design decision resting on a guess. The EVID record\'s <code>method:</code> field is what this reads.</p></div><div class="foot"><span class="chip asserted">${r.byMethod.filter((m) => m.used).length} of ${r.byMethod.length} methods used</span><span class="src">docs/evidence/*.md · method: · docs/competition/README.md · docs/design/ux-check-*.md</span></div><div class="actions"></div></article>
      </div>`);

  const rail = [
    { group: 'Why it looks like this', items: [{ href: 'brand', n: 1, label: 'Start here', hole: !shape.present }, { href: 'people', n: 2, label: 'People', hole: !personas.length }, { href: 'journey', n: 3, label: 'The journey', hole: !journey.stages.length }, { href: 'principles', n: 4, label: 'Principles', hole: !guide.principles.length }] },
    { group: 'The language', items: [{ href: 'colour', n: 5, label: 'Colour', hole: !color.length }, { href: 'type', n: 6, label: 'Type', hole: !type.length }, { href: 'shape', n: 7, label: 'Space & shape', hole: !(space.length || radius.length || elevation.length) }, { href: 'layout', n: 8, label: 'Layout', hole: !guide.layout }] },
    { group: 'Kept honest', items: [{ href: 'research', n: 9, label: 'Research', hole: !research.evid.length }] },
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
  @media (max-width: 640px) { .scale .row { grid-template-columns: 1fr; gap: 4px; } }
`;
  const footer = [
    brand.present ? `brand: ${esc(brand.name)} · docs/BRAND.md${brand.accent ? '' : ' (accent unknown → default)'}${brand.nascent ? ' · nascent' : ''}` : 'brand: nascent — no docs/BRAND.md yet; rendered in the default. /landing seeds it.',
    `a read of your files — ${esc(src)} · docs/design/STYLE_GUIDE.md · docs/BRAND.md · docs/decisions · regenerated, never edited · <span class="tab">rendered ${esc(stampedAt)}</span>`,
    'slices 1–2: the language, the people and the story · components, patterns, icons and resources are later slices · contrast is computed, everything else visual is inferred',
  ];
  return shellPage({ title: `${brand.name} — Design`, brand, projectDir: data.projectDir, current: 'design', ledgerHtml: ledger, rail, mainHtml: [start, people, journeyCh, principles, colour, typeCh, shapeCh, layout, researchCh].join('\n'), footerLines: footer, extraCss });
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
