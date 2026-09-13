// design — the design space render (FEAT-030, slice 1). What's locked here: the page is a pure
// projection of the files (the swatch hex IS the tokens.json hex), contrast is computed correctly
// for the declared pairs and only those, a principle is grounded by a REFERENCE not a word, holes
// are holes, and `boss design` writes exactly one file under .boss/ and nothing under docs/.

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { project, cleanup } from './helpers.js';
import { contrast, grade, contrastPairs, readTokens, readStyleGuide, readBrandShape, collectDesign, renderDesignHtml, designHtml } from '../src/design.js';

after(cleanup);

const TOKENS = JSON.stringify({
  color: {
    surface: { ground: { $type: 'color', $value: '#F4F6F5', $description: 'page ground — cool neutral' }, paper: { $type: 'color', $value: '#FFFFFF' } },
    text: { body: { $type: 'color', $value: '#17211E' }, muted: { $type: 'color', $value: '#7D8985' }, placeholder: { $type: 'color', $value: '#9AA5A1', $deprecated: 'color.text.muted' } },
    action: { primary: { $type: 'color', $value: '#1B7F79', $description: 'tide — the one accent' }, 'on-primary': { $type: 'color', $value: '#FFFFFF' } },
    gray: { 500: { $type: 'color', $value: '#888888' } },
  },
  font: { display: { $type: 'fontFamily', $value: ['Newsreader', 'Georgia', 'serif'] }, body: { $type: 'fontFamily', $value: ['Public Sans', 'Arial', 'sans-serif'] } },
  space: { 1: { $type: 'dimension', $value: { value: 4, unit: 'px' } }, 2: { $type: 'dimension', $value: { value: 8, unit: 'px' } } },
  radius: { control: { $type: 'dimension', $value: { value: 6, unit: 'px' } } },
});
const GUIDE = `# Style guide

## Design principles (3–5, no more)

### 1. Calm over urgent
- **Why:** the owner's evening gets shorter, not louder — EVID-001 and EVID-002 both described the 9pm cascade.
- **Guideline:** one accent, on the one thing you can act on.
- **Rules:** no unread counts; no badges; no red.
- **Wrong if:** a missed visit that a badge would have caught.

### 2. Plain over clever
- **Why:** people on both ends are tired and in a hurry.
- **Rules:** the label is the verb.

## Layout

<fill in>
`;
const BRAND = `---
id: brand
status: nascent
accent: "#1B7F79"
wordmark: Tidewell
tagline: Calm on Sunday.
---
# Brand

- **Who it's for:** "I run a small care agency"
- **What it promises:** every shift filled without the Sunday-night phone tree
- **What it refuses:** unknown
`;
const DEC = `---
id: DEC-001
type: decision
status: decided
revisit_by: 2026-12-01
---
# DEC-001 — Brand anchor: cool neutral, radius 6/8, one accent

The one owned accent is \`color.action.primary\`; the neutral is \`color.text.body\` (green-black, not black).
`;
function tidewell(extra = {}) {
  return project({ 'docs/design/tokens.json': TOKENS, 'docs/design/STYLE_GUIDE.md': GUIDE, 'docs/BRAND.md': BRAND, 'docs/decisions/DEC-001-brand-anchor.md': DEC, ...extra });
}

test('contrast is the published formula — the three ratios the prototype computed by hand', () => {
  assert.equal(contrast('#17211E', '#FFFFFF'), 16.5);
  assert.equal(contrast('#7D8985', '#FFFFFF'), 3.63);
  assert.equal(contrast('#9AA5A1', '#FFFFFF'), 2.54);
  assert.equal(grade(16.5), 'AA'); assert.equal(grade(3.63), 'AA-large'); assert.equal(grade(2.54), 'fails');
  assert.equal(contrast('#FFFFFF', '#17211E'), 16.5, 'order does not matter');
});

test('pairs are the DECLARED ones: text-like against surface-like, on-x against x — never every colour against every colour', () => {
  const { tokens } = readTokens(tidewell());
  const pairs = contrastPairs(tokens);
  const names = pairs.map((p) => `${p.text.name}/${p.on.name}`);
  assert.ok(names.includes('color.text.body/color.surface.paper'));
  assert.ok(names.includes('color.action.on-primary/color.action.primary'), 'on-primary pairs with primary');
  assert.ok(!names.some((n) => n.includes('gray.500')), 'a primitive is not a pair');
  assert.ok(!names.some((n) => n.startsWith('color.action.primary/')), 'the accent is not text');
  assert.equal(pairs.length, 7, '3 text tokens × 2 surfaces + 1 on-pair');
});

test('the swatch hex IS the tokens.json hex, the DEC that named a token is on its swatch, deprecated is struck with its successor', () => {
  const dir = tidewell();
  const html = renderDesignHtml({ ...collectDesign(dir, 'Tidewell'), projectDir: dir }, '2026-09-13 20:00');
  assert.match(html, /color\.action\.primary<\/b><span class="val" data-copy="[^"]*">#1B7F79/);
  assert.match(html, /chosen · DEC-001/, 'DEC-001 names color.action.primary in backticks');
  assert.match(html, /class="sw retired"[\s\S]*?color\.text\.placeholder[\s\S]*?deprecated → color\.text\.muted/);
  assert.match(html, /data-copy="hex=#1B7F79\|token=color\.action\.primary\|css=var\(--color-action-primary\)"/, 'three copy forms on a swatch');
  assert.match(html, /<td class="mono tab">3\.63<\/td><td class="warn">large text only/);
  assert.match(html, /<td class="mono tab">2\.54<\/td><td class="fail">fails/);
  assert.match(html, /checks the pairs the tokens declare, not what the page renders/i, 'says its scope once');
});

test('a principle is grounded by a reference, not by a word; an unfilled part is not rendered as prose', () => {
  const g = readStyleGuide(tidewell());
  assert.equal(g.principles.length, 2);
  assert.equal(g.principles[0].grounded, true); assert.deepEqual(g.principles[0].refs, ['EVID-001', 'EVID-002']);
  assert.equal(g.principles[1].grounded, false, '"people on both ends" is a guess, however true');
  assert.equal(g.principles[1].wrongIf, '', 'no falsifier written');
  assert.equal(g.layout, false, 'a <fill in> placeholder is not a layout section');
  const dir = tidewell();
  const html = renderDesignHtml({ ...collectDesign(dir, 'Tidewell'), projectDir: dir }, 'x');
  assert.match(html, /grounded · EVID-001, EVID-002/);
  assert.match(html, /asserted · no EVID, persona or journey stage names it/);
  assert.match(html, /id="layout-hole"/, 'layout renders as the hole with the six sub-slots');
});

test('the brand shape renders what is written and holes what is not — never invents', () => {
  const s = readBrandShape(tidewell());
  assert.equal(s.lines.find((l) => l.label === "Who it's for").value, '"I run a small care agency"');
  assert.equal(s.lines.find((l) => l.label === 'What it refuses').value, null, '"unknown" is a hole, not a value');
  assert.equal(s.lines.find((l) => l.label === 'How it sounds').value, null);
});

test('with nothing under docs/design/ every language chapter is a hole with the verb, and the page still renders', () => {
  const dir = project({ 'docs/BRAND.md': BRAND });
  const html = renderDesignHtml({ ...collectDesign(dir, 'Bare'), projectDir: dir }, 'x');
  for (const id of ['principle-none', 'colour-none', 'type-none', 'space-none', 'layout-hole']) assert.match(html, new RegExp(`id="${id}"`), id);
  assert.match(html, /\/design-tokens-init/);
  assert.match(html, /<b class="tab">1 of 6<\/b> slots/, 'the ledger counts the brand as the one filled slot');
});

test('a tokens.json that is not JSON renders the error as a block and the rest of the page', () => {
  const dir = tidewell({ 'docs/design/tokens.json': '{ not json' });
  const html = renderDesignHtml({ ...collectDesign(dir, 'Tidewell'), projectDir: dir }, 'x');
  assert.match(html, /id="tokens-error"/);
  assert.match(html, /id="principle-1"/, 'principles still render');
});

test('the family bar links siblings by RELATIVE path and dims the ones not on disk', () => {
  const dir = tidewell({ '.boss/playbook.html': '<p>x</p>' });
  const html = renderDesignHtml({ ...collectDesign(dir, 'Tidewell'), projectDir: dir }, 'x');
  assert.match(html, /<a href="playbook\.html">Playbook<\/a>/);
  assert.match(html, /class="dim"[^>]*>Board<\/a>/);
  assert.match(html, /class="on" aria-current="page">Design<\/a>/);
  assert.ok(!/claude\.ai/.test(html), 'no artifact URL in generated output');
});

test('designHtml writes exactly .boss/design.html and nothing under docs/', () => {
  const dir = tidewell();
  const before = readdirSync(join(dir, 'docs', 'design')).sort();
  const { out } = designHtml(dir, 'Tidewell');
  assert.equal(out, join(dir, '.boss', 'design.html'));
  assert.ok(statSync(out).size > 10000);
  assert.deepEqual(readdirSync(join(dir, 'docs', 'design')).sort(), before);
  assert.deepEqual(readdirSync(join(dir, '.boss')), ['design.html']);
});
