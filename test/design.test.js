// design — the design space render (FEAT-030, slice 1). What's locked here: the page is a pure
// projection of the files (the swatch hex IS the tokens.json hex), contrast is computed correctly
// for the declared pairs and only those, a principle is grounded by a REFERENCE not a word, holes
// are holes, and `boss design` writes exactly one file under .boss/ and nothing under docs/.

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { project, cleanup } from './helpers.js';
import { contrast, grade, contrastPairs, readTokens, readStyleGuide, readBrandShape, readPersonasFull, readJourney, readResearch, collectDesign, renderDesignHtml, designHtml } from '../src/design.js';

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
  assert.match(html, /<b class="tab">1 of 9<\/b> slots/, 'the ledger counts the brand as the one filled slot');
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

// --- slice 2 (FEAT-031): people, the journey, research ---------------------------------------------

const DEE = `---
name: Dee
role: primary
created: 2026-08-19
---
# Persona — Dee

who — an owner-operator of a small home-care agency, 50s, nine caregivers
context — Sunday evening, kitchen table, a caregiver just texted "can't do tomorrow"
jobs —
- every visit covered, every day
- the regulator satisfied without a week of prep
pains —
- the Sunday phone tree: forty minutes, three calls
- a sheet that is wrong until Monday
values — trusts people who have done the job; abandons anything that treats her caregivers as numbers
what we DON'T know yet —
- would she pay £36 a month?
- who does the rota when she is away?

Evidence ledger:  synthetic 60% · real 40%
`;
const PRIYA = `# Persona — Priya

who — a caregiver, 34, two bus rides from most clients

Evidence ledger:  synthetic 100% · real 0%
`;
const JOURNEY = `---
id: journey
updated: 2026-09-13
---
# The journey — Tidewell

| # | Stage | What they're trying to do | What they meet | Serving flow | Where they leave | Source |
|---|---|---|---|---|---|---|
| 1 | Hear about it | work out if this is for them | the landing page | — | it reads like agency software | assumed |
| 2 | Try it | get the week in | the empty state | Monday import | retyping nine weeks | said · EVID-003 |
| 3 | First value | cover one shift | the week view | Cover a shift | nobody free at 9:30 | observed |
| 4 | Come back | next Sunday | re-entry | — | the sheet is wrong by Wednesday | |

## The gaps

- stage 1 → 2 has no flow at all
- stage 4 is the one nobody owns
`;
const evid = (id, grade, method, date) => `---
id: ${id}
type: evidence
date: ${date}
method: ${method}
grade: ${grade}
assumption: owners will pay for cover-finding
---
# ${id} — a signal

"A quote that must never reach the page."
`;
function withStory(extra = {}) {
  return tidewell({ 'docs/personas/dee.md': DEE, 'docs/personas/priya.md': PRIYA, 'docs/product/JOURNEY.md': JOURNEY,
    'docs/evidence/EVID-001-x.md': evid('EVID-001', 'stated-pain', 'interview', '2026-08-12'), 'docs/evidence/EVID-002-y.md': evid('EVID-002', 'stated-pain', 'interview', '2026-08-19'), 'docs/evidence/EVID-003-z.md': evid('EVID-003', 'observed-behavior', 'observation', '2026-08-30'),
    'docs/competition/README.md': '# Rivals\n', ...extra });
}

test('a persona reads as /persona writes it — list fields as lists, a missing field as null, the ledger as numbers, primary first', () => {
  const ps = readPersonasFull(withStory());
  assert.equal(ps[0].name, 'Dee'); assert.equal(ps[0].primary, true);
  assert.match(ps[0].who, /owner-operator/);
  assert.deepEqual(ps[0].jobs, ['every visit covered, every day', 'the regulator satisfied without a week of prep']);
  assert.deepEqual(ps[0].unknowns, ['would she pay £36 a month?', 'who does the rota when she is away?']);
  assert.equal(ps[0].synthetic, 60); assert.equal(ps[0].real, 40);
  assert.equal(ps[1].name, 'Priya'); assert.equal(ps[1].context, null, 'not written is null, never borrowed from who'); assert.equal(ps[1].synthetic, 100);
});

test('the people chapter renders the cards with stable ids and holes for what is not written', () => {
  const dir = withStory();
  const html = renderDesignHtml({ ...collectDesign(dir, 'Tidewell'), projectDir: dir }, 'x');
  assert.match(html, /id="persona-dee"[\s\S]*?synthetic 60% · real 40%/);
  assert.match(html, /id="persona-priya"[\s\S]*?the day \(context\) — not written/i, 'a missing field is a hole on the card');
  assert.match(html, /What we don't know yet:<\/strong> would she pay/);
});

test('the journey reads the stage table, labels the source, and flags the unlabelled row', () => {
  const j = readJourney(withStory());
  assert.equal(j.stages.length, 4);
  assert.deepEqual(j.stages.map((s) => s.source), ['assumed', 'said', 'observed', null]);
  assert.deepEqual(j.gaps, ['stage 1 → 2 has no flow at all', 'stage 4 is the one nobody owns']);
  const dir = withStory();
  const html = renderDesignHtml({ ...collectDesign(dir, 'Tidewell'), projectDir: dir }, 'x');
  assert.match(html, /<span class="chip find">unlabelled<\/span>/);
  assert.match(html, /1 stage without a source label/);
  assert.match(html, /id="journey-gaps"[\s\S]*?stage 4 is the one nobody owns/);
});

test('research is cut by rung from grade: and by method from method: — and never quotes', () => {
  const r = readResearch(withStory());
  assert.equal(r.byRung.observed.length, 1); assert.equal(r.byRung.stated.length, 2); assert.equal(r.newest, '2026-08-30');
  const m = Object.fromEntries(r.byMethod.map((x) => [x.key, x.used]));
  assert.equal(m.interview, 2); assert.equal(m.observation, 1); assert.equal(m.metric, 0); assert.equal(m.desk, 1, 'docs/competition/README.md exists'); assert.equal(m.heuristic, 0);
  const dir = withStory();
  const html = renderDesignHtml({ ...collectDesign(dir, 'Tidewell'), projectDir: dir }, 'x');
  assert.ok(!html.includes('A quote that must never reach the page'), 'grades and dates only');
  assert.match(html, /Product events · drop-off<\/strong><\/td><td class="mono">observed<\/td><td class="q">never/);
  assert.match(html, /<b class="tab">8 of 9<\/b> slots/, 'everything but layout, whose section is a placeholder');
});

test('with no personas, no journey and no evidence the three chapters are holes with their verbs', () => {
  const dir = tidewell();
  const html = renderDesignHtml({ ...collectDesign(dir, 'Tidewell'), projectDir: dir }, 'x');
  assert.match(html, /id="persona-none"[\s\S]*?\/persona derive/);
  assert.match(html, /id="journey-none"[\s\S]*?\/spec writes docs\/product\/JOURNEY\.md/);
  assert.match(html, /nobody has been watched using anything/);
  assert.match(html, /id="research-methods"/, 'the methods table renders even at n=0 — every row a never');
});
