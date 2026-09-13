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
  const slots = [
    ['brand', shape.present], ['principles', guide.principles.length > 0], ['colour', color.length > 0], ['type', type.length > 0], ['space', space.length + radius.length + elevation.length > 0], ['layout', guide.layout],
  ];
  return { projectName, brand, shape, tokens: tok, decs, anchor, guide, color, type, space, radius, elevation, motion, pairs, slots, findings: pairs.filter((p) => p.grade !== 'AA').length };
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
  const { brand, shape, tokens, decs, anchor, guide, color, type, space, radius, elevation, motion, pairs, slots, findings, projectName } = data;
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
  const principles = chapter('principles', 2, 'Principles', guide.principles.length ? `${guide.principles.length}, each a direction that contains a tradeoff.` : 'No principle written yet.',
    'A principle is grounded when something outside the room names it — an EVID, a persona, a stage of the journey. One that only asserts is still a principle; the chip says which is which so it can be tested instead of reaffirmed.',
    guide.principles.length ? `      <div class="blocks one">\n        ${guide.principles.map(principleHtml).join('\n        ')}\n      </div>`
      : `      <div class="blocks one">${hole('principle-none', 'Design principles', '<p>Three to five, each with what it buys and what it costs. If a reasonable person couldn\'t argue the opposite, it isn\'t a principle.</p>', guide.present ? 'docs/design/STYLE_GUIDE.md · Design principles — the slot is there, blank' : '/design-tokens-init writes the style guide with the slot', guide.present ? 'docs/design/STYLE_GUIDE.md · present, principles empty' : 'docs/design/STYLE_GUIDE.md · absent')}</div>`);

  // 3 · Colour
  const err = tokens.error ? `<article class="block hole" id="tokens-error"><div class="head"><h3>Couldn't read the tokens</h3></div><div class="body"><p>${esc(tokens.error)}</p></div><div class="actions"></div></article>` : '';
  const semantic = color.filter((t) => !/^colou?r\.(gray|grey|blue|red|green|teal|amber|yellow|orange|purple|violet|neutral|palette)\b/i.test(t.name) && !/\.\d{2,3}$/.test(t.name));
  const primitives = color.length - semantic.length;
  const pairsRows = pairs.map((p) => `<tr><td class="mono">${esc(p.text.name)}</td><td class="mono">${esc(p.on.name)}</td><td class="mono tab">${p.ratio.toFixed(2)}</td><td class="${p.grade === 'AA' ? 'ok' : p.grade === 'AA-large' ? 'warn' : 'fail'}">${p.grade === 'AA' ? 'AA' : p.grade === 'AA-large' ? 'large text only' : 'fails'}</td></tr>`).join('');
  const colour = chapter('colour', 3, 'Colour', color.length ? `${semantic.length} semantic name${semantic.length === 1 ? '' : 's'}${primitives ? ` over ${primitives} primitives` : ''}.` : 'No colour tokens yet.',
    'Every swatch is its semantic name — what it is for, never its hue. Click a swatch, a name or a value to copy it in the form you want. A swatch with a reason under it is an argument someone has to answer; a swatch alone is a value someone will quietly change.',
    color.length ? `      <div class="blocks one">
        ${err}
        <article class="block" id="colour-semantic" data-title="Colour — the semantic layer"><div class="head"><h3>Semantic tokens <span class="sub">· click any value to copy it</span></h3></div><div class="body"><div class="swatches">${semantic.map((t) => swatchHtml(t, decs)).join('')}</div>${primitives ? `<p class="t-small" style="margin-top:12px">${primitives} primitive${primitives === 1 ? '' : 's'} underneath (<code>color.&lt;hue&gt;.&lt;step&gt;</code>) — referenced by these names, never by a screen.</p>` : ''}</div><div class="foot"><span class="chip dec">${semantic.filter((t) => decFor(decs, t.name)).length} chosen</span><span class="chip asserted">${semantic.filter((t) => !decFor(decs, t.name)).length} derived</span><span class="src">${esc(src)}</span></div><div class="actions"></div></article>
        <article class="block" id="colour-contrast" data-title="Contrast — the declared pairs, computed"><div class="head"><h3>Contrast <span class="sub">— WCAG 2.x, computed for every declared text-on-surface pair</span></h3></div><div class="body">${pairs.length ? `<div class="tscroll"><table class="t"><thead><tr><th>Text</th><th>On</th><th>Ratio</th><th>Reads</th></tr></thead><tbody>${pairsRows}</tbody></table></div>` : '<p class="t-small"><em>No pair to compute: nothing is named like text (<code>color.text.*</code>, <code>*.on-*</code>) against something named like a surface (<code>color.surface.*</code>, <code>ground</code>, <code>paper</code>). Name by purpose and the arithmetic follows.</em></p>'}<p class="t-small" style="margin-top:10px">Checks the pairs the tokens declare, not what the page renders — text over an image, a gradient or a translucent overlay composites at runtime and stays <em>not checked</em>. A pair that fails is a token-system finding: fix it in ${esc(src)} and every screen moves.</p></div><div class="foot"><span class="chip ${findings ? 'find' : 'dec'}">${findings} finding${findings === 1 ? '' : 's'} · token-level</span><span class="src">${pairs.length} pairs · computed at render · relative luminance, WCAG 2.x</span></div><div class="actions"></div></article>
      </div>`
      : `      <div class="blocks one">${err}${hole('colour-none', 'Semantic colour', '<p>The nine-or-so names a screen is allowed to use — surface, text, action, signal — and the primitives under them. The 47 blues start on the second screen without this.</p>', '/design-tokens-init writes docs/design/tokens.json', `${esc(src)}`)}</div>`);

  // 4 · Type
  const typeRows = type.map((t) => { const v = Array.isArray(t.value) ? t.value.join(', ') : dim(t.value); return `<div class="row"><div class="meta"><b class="val" data-copy="${esc(`token=${t.name}|value=${v}|css=var(${cssVar(t.name)})`)}">${esc(t.name)}</b><span class="val" data-copy="${esc(`value=${v}|token=${t.name}`)}">${esc(v)}</span>${t.description ? `<span class="d">${esc(t.description)}</span>` : ''}</div><div class="spec"${Array.isArray(t.value) ? ` style="font-family:${esc(t.value.map((f) => (/\s/.test(f) ? `'${f}'` : f)).join(', '))}"` : ''}>${Array.isArray(t.value) ? 'The quick brown fox covers the Sunday shift.' : ''}</div></div>`; }).join('');
  const typeCh = chapter('type', 4, 'Type', type.length ? `${type.length} type token${type.length === 1 ? '' : 's'}.` : 'No type tokens yet.',
    'Roles, not sizes. A screen that needs a seventh role is asking a question the style guide should answer first.',
    type.length ? `      <div class="blocks one"><article class="block" id="type-roles" data-title="Type — the roles"><div class="head"><h3>Roles <span class="sub">· click a role to copy its token or value</span></h3></div><div class="body"><div class="scale">${typeRows}</div></div><div class="foot"><span class="src">${esc(src)} · font family</span></div><div class="actions"></div></article></div>`
      : `      <div class="blocks one">${hole('type-none', 'Type roles', '<p>A display face for the promise, a body face for the work, a data face for the numbers — and the six roles they play.</p>', '/design-tokens-init · the 5-token pass chooses the pairing', esc(src))}</div>`);

  // 5 · Space & shape
  const bars = space.map((t) => `<div class="row"><span class="val" data-copy="${esc(`px=${dim(t.value)}|token=${t.name}|css=var(${cssVar(t.name)})`)}">${esc(t.name)} · ${esc(dim(t.value))}</span><i style="width:${esc(dim(t.value))}"></i></div>`).join('');
  const radii = radius.map((t) => `<div class="val" style="border-radius:${esc(dim(t.value))}" data-copy="${esc(`px=${dim(t.value)}|token=${t.name}`)}">${esc(dim(t.value))} · ${esc(t.name.replace(/^radius\./, ''))}</div>`).join('');
  const elev = elevation.map((t) => `<div class="val" style="box-shadow:${esc(String(t.value))}" data-copy="${esc(`value=${String(t.value)}|token=${t.name}`)}">${esc(t.name.replace(/^(shadow|elevation)\./, ''))}</div>`).join('');
  const shapeCh = chapter('shape', 5, 'Space & shape', (space.length || radius.length || elevation.length) ? `${space.length} spacing step${space.length === 1 ? '' : 's'} · ${radius.length} radi${radius.length === 1 ? 'us' : 'i'} · ${elevation.length} elevation${elevation.length === 1 ? '' : 's'}.` : 'No spacing, radius or elevation tokens yet.', '',
    (space.length || radius.length || elevation.length) ? `      <div class="blocks">
        ${space.length ? `<article class="block" id="space-scale" data-title="Spacing scale"><div class="head"><h3>Spacing</h3></div><div class="body"><div class="bars">${bars}</div></div><div class="foot"><span class="src">${esc(src)} · space</span></div><div class="actions"></div></article>` : ''}
        ${radius.length ? `<article class="block" id="shape-radius" data-title="Radius"><div class="head"><h3>Radius</h3></div><div class="body"><div class="radii">${radii}</div></div><div class="foot"><span class="src">${esc(src)} · radius</span></div><div class="actions"></div></article>` : ''}
        ${elevation.length ? `<article class="block" id="shape-elevation" data-title="Elevation"><div class="head"><h3>Elevation</h3></div><div class="body"><div class="elev">${elev}</div></div><div class="foot"><span class="src">${esc(src)} · elevation</span></div><div class="actions"></div></article>` : ''}
        ${motion.length ? '' : `<article class="block dormant" id="shape-motion" data-title="Motion"><div class="head"><h3>Motion</h3></div><div class="body">No durations, no easings named. <code>prefers-reduced-motion</code> is honoured by default.<span class="cond">wakes when a transition is designed twice · seed-that-scales: cheap to add when earned</span></div><div class="foot"><span class="chip asserted">deferred by rule</span><span class="src">no motion tokens</span></div><div class="actions"></div></article>`}
      </div>`
      : `      <div class="blocks one">${hole('space-none', 'Spacing · radius · elevation', '<p>A 4-base scale, two radii, one shadow — the three families after colour that a screen reinvents by hand.</p>', '/design-tokens-init', esc(src))}</div>`);

  // 6 · Layout
  const layout = chapter('layout', 6, 'Layout', guide.layout ? 'A layout section exists.' : 'Nobody has decided how a page is built yet.', '',
    guide.layout ? `      <div class="blocks one"><article class="block" id="layout-guide" data-title="Layout"><div class="head"><h3>From the style guide</h3></div><div class="body"><p>The Layout section of <code>docs/design/STYLE_GUIDE.md</code> has content; slice 2 renders it. Until then, read it there.</p></div><div class="foot"><span class="src">docs/design/STYLE_GUIDE.md · Layout</span></div><div class="actions"></div></article></div>`
      : `      <div class="blocks one">${hole('layout-hole', 'The slot, and what fills it', '<p>No column grid, no breakpoint list, no container width. The slot has a shape so the decision has somewhere to land:</p><ul style="margin-top:8px;font-style:normal"><li><strong>base unit</strong></li><li><strong>the ramp</strong> — which spacing steps mean inside a control, between controls, between sections</li><li><strong>grid anatomy</strong> — columns · gutters · margins · regions</li><li><strong>breakpoints</strong> — as <code>breakpoint.*</code> tokens, so a media query is a name</li><li><strong>responsive techniques</strong> — reposition · resize · reflow · hide · re-architect, and which are allowed</li><li><strong>density</strong> — one, until a second is earned</li></ul>', 'docs/design/STYLE_GUIDE.md · Layout — six sub-slots, all blank · /design-review opens it at the next screen', guide.present ? 'docs/design/STYLE_GUIDE.md · Layout section empty or absent' : 'docs/design/STYLE_GUIDE.md · absent')}</div>`);

  const rail = [
    { group: 'Why it looks like this', items: [{ href: 'brand', n: 1, label: 'Start here', hole: !shape.present }, { href: 'principles', n: 2, label: 'Principles', hole: !guide.principles.length }] },
    { group: 'The language', items: [{ href: 'colour', n: 3, label: 'Colour', hole: !color.length }, { href: 'type', n: 4, label: 'Type', hole: !type.length }, { href: 'shape', n: 5, label: 'Space & shape', hole: !(space.length || radius.length || elevation.length) }, { href: 'layout', n: 6, label: 'Layout', hole: !guide.layout }] },
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
  .principle .statement { font-family: var(--display); font-size: 22px; line-height: 1.3; max-width: 34ch; margin-bottom: 12px; } .pgrid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 12px 24px; } .pgrid h4 { font-family: var(--mono); font-size: 10.5px; letter-spacing: .06em; text-transform: uppercase; color: var(--muted); margin: 0 0 6px; font-weight: 500; } .pgrid p { font-size: 14.5px; }
  @media (max-width: 640px) { .scale .row { grid-template-columns: 1fr; gap: 4px; } }
`;
  const footer = [
    brand.present ? `brand: ${esc(brand.name)} · docs/BRAND.md${brand.accent ? '' : ' (accent unknown → default)'}${brand.nascent ? ' · nascent' : ''}` : 'brand: nascent — no docs/BRAND.md yet; rendered in the default. /landing seeds it.',
    `a read of your files — ${esc(src)} · docs/design/STYLE_GUIDE.md · docs/BRAND.md · docs/decisions · regenerated, never edited · <span class="tab">rendered ${esc(stampedAt)}</span>`,
    'slice 1: the language and the frame · people, the journey, components, patterns, icons and research are later slices · contrast is computed, everything else visual is inferred',
  ];
  return shellPage({ title: `${brand.name} — Design`, brand, projectDir: data.projectDir, current: 'design', ledgerHtml: ledger, rail, mainHtml: [start, principles, colour, typeCh, shapeCh, layout].join('\n'), footerLines: footer, extraCss });
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
