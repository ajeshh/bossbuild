// design — the design space render (FEAT-030 slice 1, FEAT-031 slice 2, FEAT-032 slice 3, FEAT-033 slice 4). What's locked here: the page is a pure
// projection of the files (the swatch hex IS the tokens.json hex), contrast is computed correctly
// for the declared pairs and only those, a principle is grounded by a REFERENCE not a word, holes
// are holes, and `boss design` writes exactly one file under .boss/ and nothing under docs/.

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, statSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { project, cleanup } from './helpers.js';
import { contrast, grade, contrastPairs, readTokens, readStyleGuide, readBrandShape, readPersonasFull, readJourney, readResearch, readComponents, resolveImport, specFrameSvg, readPatterns, readFlows, readGuards, readIcons, readIconDecision, readLogo, readExceptions, tokensCss, readKitLinks, researchOn, openSlots, readUsagePages, scanTree, readDivergence, themeFromTokens, collectDesign, renderDesignHtml, designHtml } from '../src/design.js';

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
- **The name, and why:** Tidewell — the tide comes in whether you like it or not
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
  assert.equal(pairs.length, 5, '2 live text tokens × 2 surfaces + 1 on-pair — the deprecated placeholder is out of the system, not a finding in it');
  assert.ok(!names.some((n) => n.includes('placeholder')), 'a deprecated token is not paired');
  const cross = contrastPairs([{ name: 'color.text.on-primary', type: 'color', value: '#FFFFFF' }, { name: 'color.action.primary', type: 'color', value: '#2F5D8A' }]);
  assert.deepEqual(cross.map((x) => `${x.text.name}/${x.on.name}`), ['color.text.on-primary/color.action.primary'], 'on-primary finds primary across groups');
});

test('the swatch hex IS the tokens.json hex, the DEC that named a token is on its swatch, deprecated is struck with its successor', () => {
  const dir = tidewell();
  const html = renderDesignHtml({ ...collectDesign(dir, 'Tidewell'), projectDir: dir }, '2026-09-13 20:00');
  assert.match(html, /color\.action\.primary<\/b><span class="val" data-copy="[^"]*">#1B7F79/);
  assert.match(html, /chosen · DEC-001/, 'DEC-001 names color.action.primary in backticks');
  assert.match(html, /class="sw retired"[\s\S]*?color\.text\.placeholder[\s\S]*?deprecated → color\.text\.muted/);
  assert.match(html, /data-copy="hex=#1B7F79\|token=color\.action\.primary\|css=var\(--color-action-primary\)"/, 'three copy forms on a swatch');
  assert.ok(!/\.sw \.val \{ display: inline; \}/.test(html), 'the swatch block stays a block — the rule that collapsed it to zero height is gone');
  assert.match(html, /<td class="mono tab">3\.63<\/td><td class="warn">large text only/);
  assert.ok(!/<td class="mono tab">2\.54<\/td>/.test(html), 'the deprecated placeholder is struck on the swatch, not scored in the table');
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
  assert.equal(readBrandShape(tidewell()).lines.find((l) => l.label === 'The name, and why').value, 'Tidewell — the tide comes in whether you like it or not', 'the optional ", and why" is not the value');
  const s = readBrandShape(tidewell());
  assert.equal(s.lines.find((l) => l.label === "Who it's for").value, '"I run a small care agency"');
  assert.equal(s.lines.find((l) => l.label === 'What it refuses').value, null, '"unknown" is a hole, not a value');
  assert.equal(s.lines.find((l) => l.label === 'How it sounds').value, null);
});

test('the brand file is found at docs/design/BRAND.md too — one resolver for every reader of it', () => {
  // BOSS's own brand bible predates the shipped path. Until 2026-09-13 readBrand accepted both
  // while readBrandShape opened only docs/BRAND.md, so the six lines were written and invisible.
  const dir = project({ 'docs/design/BRAND.md': BRAND });
  const s = readBrandShape(dir);
  assert.equal(s.present, true, 'present at the fallback path');
  assert.equal(s.lines.find((l) => l.label === "Who it's for").value, '"I run a small care agency"');
  const both = project({ 'docs/BRAND.md': BRAND.replace('"I run a small care agency"', '"the shipped path wins"'), 'docs/design/BRAND.md': BRAND });
  assert.equal(readBrandShape(both).lines.find((l) => l.label === "Who it's for").value, '"the shipped path wins"', 'docs/BRAND.md is read first when both exist');
  assert.equal(readBrandShape(project({})).present, false);
});

test('with nothing under docs/design/ every language chapter is a hole with the verb, and the page still renders', () => {
  const dir = project({ 'docs/BRAND.md': BRAND });
  const html = renderDesignHtml({ ...collectDesign(dir, 'Bare'), projectDir: dir }, 'x');
  for (const id of ['principle-none', 'colour-none', 'type-none', 'space-none', 'layout-hole']) assert.match(html, new RegExp(`id="${id}"`), id);
  assert.match(html, /\/design-tokens-init/);
  assert.match(html, /<b class="tab">1 of 16<\/b> slots/, 'the ledger counts the brand as the one filled slot');
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
  assert.match(html, /<b class="tab">9 of 16<\/b> slots/, 'the language, the story, the pairs (accessibility) — not layout, components, patterns, flows or content');
});

test('with no personas, no journey and no evidence the three chapters are holes with their verbs', () => {
  const dir = tidewell();
  const html = renderDesignHtml({ ...collectDesign(dir, 'Tidewell'), projectDir: dir }, 'x');
  assert.match(html, /id="persona-none"[\s\S]*?\/persona derive/);
  assert.match(html, /id="journey-none"[\s\S]*?\/spec writes docs\/product\/JOURNEY\.md/);
  assert.match(html, /nobody has been watched using anything/);
  assert.match(html, /id="research-methods"/, 'the methods table renders even at n=0 — every row a never');
});

// --- slice 3 (FEAT-032): the parts --------------------------------------------------------------------

const COMPONENTS = `---
id: components
status: active
updated: 2026-09-10
---
# Component index — Tidewell

| Component | What it's for | Import | Variants | Missing states | Status |
|---|---|---|---|---|---|
| \`Button\` | the one act on a screen | \`import { Button } from '@/components/Button'\` | primary · secondary · ghost | — | stable |
| \`ShiftRow\` | one shift, its state, who | \`import { ShiftRow } from '@/components/ShiftRow'\` | — | empty | draft |
| \`Card\` | a bounded surface | \`import { Card } from '@/components/Card'\` | — |  | deprecated → \`Surface\` |

| Concept | We call it | Never |
|---|---|---|
| the visual variation | \`variant\` | \`type\`, \`kind\` |

## Retired

| Component | Why retired | On |
|---|---|---|
| \`CTAButton\` | was \`Button variant="primary"\` all along — merged | 2026-09-01 |
`;
const BUTTON_SRC = `export function Button({ variant = 'primary', children }) { return <button className={'btn btn-' + variant}>{children}</button>; }\n`;
const PATTERNS = `# Patterns — Tidewell

## Always

| Pattern | The situation | The rule | Anti-pattern |
|---|---|---|---|
| **Destructive confirm** | delete, revoke, cancel | name the consequence and whether it can be undone | "Are you sure?" |

## Ours — patterns this product grew

| ID | Pattern | The situation | The rule | Anti-pattern | First seen |
|---|---|---|---|---|---|
| **PAT-1** | Ask, don't assign | a shift needs cover | the owner asks one person; the app never assigns | auto-assign with a notification | 2026-09-02 |
| **PAT-2** | *(your first one lands here)* | | | | |

## Refused — and why

| Pattern | Why refused | On |
|---|---|---|
| streak counter | engagement-shaped, not value-shaped | 2026-08-20 |
`;
const FLOWS = `---
id: flows
updated: 2026-09-11
---
# Flows — Tidewell

| Flow | Entry | Steps | Ends at | Owned by |
|---|---|---|---|---|
| Cover a shift | the uncovered row | 3 | the shift is covered | \`FEAT-004\` |
| Add the week | the calendar | 2 | seven days on the board | \`FEAT-006\` |

---

## Cover a shift · \`FEAT-004\`

**Happy path**

| # | Step | Asks the user for | Why it's needed *now* |
|---|---|---|---|
| 1 | pick who to ask | one name | there is no ask without a person |
| 2 | add a note | free text | |
| 3 | send | nothing | it is the act |

| Cut | Why |
|---|---|
| how urgent | the row already says |

**First-run path** — no caregivers yet: step 1 is the empty state with one action.

## Add the week · \`FEAT-006\`

Happy path, cut list, first-run and failure paths: in the FEAT's **Flow** section.
`;
const GUIDE_CONTENT = GUIDE + `
## The five states

| Component | default | hover | active | disabled | empty / loading |
|---|---|---|---|---|---|
| ShiftRow | ✓ | ✓ | ✓ | — | **✓ what does an empty list say?** |

## Accessibility floor (not negotiable, not a phase)

- Contrast: body text ≥ 4.5:1 — check the token pairs
- Every interactive element has a visible focus state

## Do / Don't

| Do | Don't | Because |
|---|---|---|
| one primary action per view | two buttons competing | a second primary means the view has two jobs |
| <your rule> | <the specific thing you keep seeing> | <the principle it serves> |

## Terminology

| Use | Never | Because |
|---|---|---|
| shift | slot, booking | the owner's word |
| <the word> | <the synonyms> | <what the distinction protects> |

## Voice in the interface

**Voice — 3 traits, each with a tradeoff**

- plain over clever — giving up: personality in the microcopy
- <trait> — giving up: <what>

**Tone by context:**

| Context | How the voice shifts | Real string |
|---|---|---|
| Success | brief | "Covered." |
| Error | what to do next | <> |

**Surfaces:**

- **Buttons:** verb first, sentence case
`;
function withParts(extra = {}) {
  return tidewell({ 'docs/design/COMPONENTS.md': COMPONENTS, 'src/components/Button.tsx': BUTTON_SRC, 'docs/design/PATTERNS.md': PATTERNS, 'docs/design/FLOWS.md': FLOWS, 'docs/design/STYLE_GUIDE.md': GUIDE_CONTENT,
    '.claude/settings.json': JSON.stringify({ hooks: { PostToolUse: [{ matcher: 'Write|Edit', hooks: [{ type: 'command', command: 'node "$CLAUDE_PROJECT_DIR"/.claude/hooks/contrast-guard.js' }] }] } }), ...extra });
}

test('the authored index reads as the template writes it: a dash is none missing, a blank is nobody checked, deprecated carries its successor, the import resolves only to a file that exists', () => {
  const dir = withParts();
  const co = readComponents(dir);
  assert.equal(co.source, 'docs/design/COMPONENTS.md'); assert.equal(co.both, false);
  const [button, row, card] = co.components;
  assert.equal(button.name, 'Button'); assert.deepEqual(button.variants, ['primary', 'secondary', 'ghost']); assert.deepEqual(button.missing, []); assert.equal(button.status, 'stable');
  assert.equal(button.source, 'src/components/Button.tsx', '@/ resolves to src/ and the .tsx is on disk'); assert.equal(button.sourceText, BUTTON_SRC);
  assert.deepEqual(row.missing, ['empty']); assert.equal(row.source, null, 'ShiftRow has an import line and no file — nothing is guessed'); assert.equal(row.sourceText, null);
  assert.equal(card.missing, null, 'a blank cell is not a dash'); assert.equal(card.status, 'deprecated'); assert.equal(card.replacedBy, 'Surface');
  assert.deepEqual(co.api, [{ concept: 'the visual variation', word: 'variant', never: 'type, kind' }]);
  assert.deepEqual(co.retired, [{ name: 'CTAButton', why: 'was Button variant="primary" all along — merged', on: '2026-09-01' }]);
  assert.equal(resolveImport(dir, "import { X } from './X'"), null, 'a relative specifier has no known base');
});

test('the manifest supersedes the index: states from the manifest, a stale hash is a finding, both files on disk is itself reported', () => {
  const manifest = JSON.stringify({ generated: '2026-09-12', components: [
    { name: 'Button', source: 'src/components/Button.tsx', sourceHash: 'deadbeef0000', purpose: 'the act', import: "import { Button } from '@/components/Button'", variants: ['primary'], states: { default: true, hover: true, active: true, disabled: false, empty: 'n/a' }, usedIn: 14, findings: [{ severity: 'serious', kind: 'raw-value', detail: '#3B82F6 at line 42' }] },
  ] });
  const dir = withParts({ 'docs/design/library/manifest.json': manifest });
  const co = readComponents(dir);
  assert.equal(co.source, 'docs/design/library/manifest.json'); assert.equal(co.both, true);
  const [b] = co.components;
  assert.deepEqual(b.missing, ['disabled']); assert.equal(b.usedIn, 14); assert.equal(b.stale, true, 'the hash in the manifest is not the file\'s'); assert.equal(b.findings[0].kind, 'raw-value');
  const html = renderDesignHtml({ ...collectDesign(dir, 'Tidewell'), projectDir: dir }, 'x');
  assert.match(html, /Both <code>COMPONENTS\.md<\/code> and <code>library\/manifest\.json<\/code> are on disk/);
  assert.match(html, /stale · source moved since the manifest/);
  assert.match(html, /<td class="n">✗ #3B82F6 at line 42<\/td>/, 'on tokens answers from the manifest findings');
});

test('every component card carries Code (the import line, the source when on disk) and SVG (a spec frame in the project\'s own tokens, never a render)', () => {
  const dir = withParts();
  const data = collectDesign(dir, 'Tidewell');
  const html = renderDesignHtml({ ...data, projectDir: dir }, 'x');
  assert.match(html, /id="component-button"[^>]*data-code="[^"]*Import line[^"]*Source · src\/components\/Button\.tsx/, 'Button offers both');
  assert.match(html, /id="component-shiftrow"[^>]*data-code="[^"]*Import line/, 'ShiftRow offers the import line only');
  assert.ok(!/id="component-shiftrow"[^>]*Source ·/.test(html), 'no source is invented for ShiftRow');
  const svg = data.components.components[0].svg;
  assert.match(svg, /^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg"/); assert.ok(svg.includes('#1B7F79'), 'the accent is the tokens.json hex'); assert.ok(svg.includes('#FFFFFF'), 'the paper is color.surface.paper');
  assert.ok(svg.includes('Public Sans'), 'the frame is set in the body face'); assert.match(svg, /spec frame · not a render/);
  assert.match(data.components.components[1].svg, />empty<\/text><text[^>]*>missing</, 'a missing state is drawn as missing');
  assert.match(html, /<td class="q">not checked — the Missing states cell is blank<\/td>/, 'Card\'s five states are not asserted');
  assert.match(html, /Not checked, for every component:/, 'said once, above the table');
});

test('patterns render Ours first with ids, the inherited groups after, the refused last, and the style guide\'s do/don\'t as pairs; the placeholder row is skipped', () => {
  const dir = withParts();
  const pa = readPatterns(dir);
  assert.deepEqual(pa.ours.map((r) => r.id), ['PAT-1'], 'PAT-2 is the template\'s placeholder');
  assert.equal(pa.groups.length, 1); assert.equal(pa.groups[0].heading, 'Always'); assert.equal(pa.groups[0].rows[0].anti, '"Are you sure?"');
  assert.deepEqual(pa.refused, [{ pattern: 'streak counter', why: 'engagement-shaped, not value-shaped', on: '2026-08-20' }]);
  const html = renderDesignHtml({ ...collectDesign(dir, 'Tidewell'), projectDir: dir }, 'x');
  const ours = html.indexOf('id="patterns-ours"'), refused = html.indexOf('id="patterns-refused"'), seeds = html.indexOf('prompt BOSS seeded (Always)'), dd = html.indexOf('id="patterns-dodont"');
  assert.ok(ours > 0 && ours < refused && refused < seeds, 'Ours · Refused · then the seeds as a quiet line — never as decisions');
  assert.ok(!html.includes('id="patterns-0"'), 'a seeded group is not a block of its own');
  assert.ok(dd > 0); assert.match(html, /<td class="do">one primary action per view<\/td><td class="dont">two buttons competing<\/td>/);
  assert.ok(!html.includes('&lt;your rule&gt;'), 'the placeholder pair is not a pair');
});

test('flows render the index and each flow\'s three paths; a step with no why-now is the step to cut; a section that defers to the FEAT is not a hole', () => {
  const dir = withParts();
  const fl = readFlows(dir);
  assert.equal(fl.flows.length, 2);
  const [cover, week] = fl.flows;
  assert.equal(cover.happy.length, 3); assert.equal(cover.happy[1].why, ''); assert.deepEqual(cover.cut, [{ cut: 'how urgent', why: 'the row already says' }]); assert.equal(cover.firstRun, true); assert.equal(cover.failure, false);
  assert.equal(week.deferred, true); assert.equal(week.happy.length, 0);
  const html = renderDesignHtml({ ...collectDesign(dir, 'Tidewell'), projectDir: dir }, 'x');
  assert.match(html, /cannot say — the step to cut/); assert.match(html, /1 step cannot say why now/);
  assert.match(html, /id="flow-1"[\s\S]*?<span class="chip dec">happy<\/span><span class="chip dec">first-run<\/span><span class="chip find">failure · missing<\/span>/);
  assert.match(html, /id="flow-2"[\s\S]*?three paths · in the FEAT/);
});

test('content renders the terms, the traits, the tone rows with a real string and the surfaces; placeholders are not content; a guard that is on is named', () => {
  const dir = withParts();
  const g = readStyleGuide(dir);
  assert.deepEqual(g.terms, [{ use: 'shift', never: 'slot, booking', because: 'the owner\'s word' }]);
  assert.deepEqual(g.voiceTraits, ['plain over clever — giving up: personality in the microcopy']);
  assert.equal(g.tone.length, 2); assert.equal(g.tone[0].string, '"Covered."'); assert.equal(g.tone[1].string, '');
  assert.deepEqual(g.surfaces, [{ surface: 'Buttons', rule: 'verb first, sentence case' }]);
  assert.equal(g.voiceDeferred, false); assert.equal(g.floor.length, 2);
  assert.deepEqual(g.fiveStates.ShiftRow, { default: true, hover: true, active: true, disabled: false, empty: true });
  const html = renderDesignHtml({ ...collectDesign(dir, 'Tidewell'), projectDir: dir }, 'x');
  assert.match(html, /1 of 2 contexts have a real string/);
  assert.match(html, /no string yet — an agent can't act on an adjective/);
  const guards = readGuards(dir);
  assert.deepEqual(guards.map((x) => [x.name, x.on]), [['contrast-guard', true], ['design-tokens-guard', false], ['component-reuse-guard', false], ['content-terminology-guard', false]]);
  assert.match(html, /<td class="mono">contrast-guard<\/td><td>[^<]*<\/td><td class="ok">on<\/td>/);
  assert.match(html, /<b class="tab">10 of 16<\/b> slots/, 'the parts fill four more slots; layout, people, journey and research stay empty');
});

test('with the style guide\'s voice left as placeholders the block is dormant with the template\'s reason, and with no parts files all five chapters hole with their verbs', () => {
  const dir = tidewell();
  const g = readStyleGuide(dir);
  assert.equal(g.voiceDeferred, true);
  const html = renderDesignHtml({ ...collectDesign(dir, 'Tidewell'), projectDir: dir }, 'x');
  assert.match(html, /id="components-none"[\s\S]*?\/design-tokens-init writes docs\/design\/COMPONENTS\.md/);
  assert.match(html, /class="block hole" id="patterns-ours"[\s\S]*?\/design-review names it/);
  assert.match(html, /id="flows-none"[\s\S]*?\/spec writes docs\/design\/FLOWS\.md/);
  assert.match(html, /id="content-terms"[\s\S]*?class="block hole"/.source ? /class="block hole" id="content-terms"/ : /x/);
  assert.match(html, /class="block dormant" id="content-voice"[\s\S]*?deferred by rule/);
  assert.match(html, /id="a11y-notchecked"[\s\S]*?7 · not checked/);
  assert.ok(!html.includes('id="component-'), 'no card without a component');
});

// --- slice 4 (FEAT-033): icons & logo, resources, exceptions ------------------------------------------

const ICON_A = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M4 12h16"/></svg>';
const ICON_B = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><circle cx="10" cy="10" r="8"/></svg>';
const MARK = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M2 20c6-8 22-8 28 0" fill="#1B7F79"/></svg>';
const GUIDE_REST = GUIDE_CONTENT + `
### 1b. Icons — *the set, and it is a dependency*

- **The set:** one stroke set, 1.5px, named in the deps
- **Sizes that exist:** <two or three, not "whatever fits">
- **Icon-only is allowed when:** it sits in a labelled row

## Logo

- **Clear space:** the height of the mark on every side
- **Minimum:** 16px on screen

## Exceptions

| Date | Where | What | Why |
|---|---|---|---|
| 2026-09-01 | the week view | two primary buttons | the owner asks and adds in one place |
| 2026-09-04 | the shift dialog | two primary buttons | ask and keep are both acts |
| 2026-09-08 | the print sheet | two primary buttons | paper has no hover |
| 2026-09-09 | ShiftRow | a raw hex for the print rule | the print stylesheet has no tokens yet |
| | | | |
`;
const BRAND_LOGO = BRAND.replace('tagline: Calm on Sunday.', 'tagline: Calm on Sunday.\nlogo: docs/brand/mark.svg');
function withRest(extra = {}) {
  return withParts({ 'docs/design/icons/dash.svg': ICON_A, 'docs/design/icons/dot.svg': ICON_B, 'docs/brand/mark.svg': MARK, 'docs/BRAND.md': BRAND_LOGO, 'docs/design/STYLE_GUIDE.md': GUIDE_REST, ...extra });
}

test('icons render from the files: each copies its own SVG, the set copies as one sprite of symbols, the decision reads the filled lines and not the placeholders', () => {
  const dir = withRest();
  const ic = readIcons(dir);
  assert.deepEqual(ic.files.map((f) => [f.name, f.size, f.viewBox]), [['dash', 24, '0 0 24 24'], ['dot', 20, '0 0 20 20']]);
  assert.match(ic.sprite, /^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" style="display:none"><symbol id="icon-dash" viewBox="0 0 24 24"><path d="M4 12h16"\/><\/symbol><symbol id="icon-dot" viewBox="0 0 20 20">/);
  const d = readIconDecision(readStyleGuide(dir).text);
  assert.equal(d.set, 'one stroke set, 1.5px, named in the deps'); assert.equal(d.sizes, '', 'the placeholder is not a decision'); assert.equal(d.iconOnly, 'it sits in a labelled row');
  const html = renderDesignHtml({ ...collectDesign(dir, 'Tidewell'), projectDir: dir }, 'x');
  assert.match(html, /id="icons-set"[^>]*data-svg="&lt;svg xmlns=&quot;http:\/\/www\.w3\.org\/2000\/svg&quot; style=&quot;display:none&quot;&gt;&lt;symbol id=&quot;icon-dash&quot;/, 'SVG on the block is the sprite');
  assert.match(html, /class="icon val" data-copy="svg=&lt;svg[^"]*M4 12h16/, 'one icon copies its own file');
  assert.match(html, /2 of 4 decided/);
});

test('the logo renders from the brand\'s file as lockups, with the rules that are written; no file → the slot and never a placeholder mark', () => {
  const dir = withRest();
  const lg = readLogo(dir);
  assert.equal(lg.mark, 'docs/brand/mark.svg'); assert.ok(lg.markSvg.startsWith('<svg')); assert.equal(lg.wordmarkFile, null);
  assert.equal(lg.clearSpace, 'the height of the mark on every side'); assert.equal(lg.minimum, '16px on screen'); assert.equal(lg.misuse, '');
  const html = renderDesignHtml({ ...collectDesign(dir, 'Tidewell'), projectDir: dir }, 'x');
  assert.match(html, /id="logo"[^>]*data-svg="&lt;svg[^"]*M2 20c6-8 22-8 28 0/, 'SVG on the block copies the mark');
  assert.match(html, /<div class="lk accent">/); assert.match(html, /<span class="wm" style="font-family:Newsreader, Georgia, serif">Tidewell<\/span>/, 'the wordmark is the name in the display face');
  assert.match(html, /2 of 5 rules written/);
  const bare = withParts();
  const html2 = renderDesignHtml({ ...collectDesign(bare, 'Tidewell'), projectDir: bare }, 'x');
  assert.match(html2, /class="block hole" id="logo"/); assert.ok(!html2.includes('<div class="lockups">'), 'no lockup without a file');
  assert.match(html2, /class="block hole" id="icons-set"/);
});

test('resources: the tokens file verbatim, the variables block derived from it value for value, the import lines as one paste, kit coverage from a design field only', () => {
  const dir = withRest();
  const data = collectDesign(dir, 'Tidewell');
  assert.equal(data.resources.tokensText, TOKENS, 'the file, not a re-serialisation');
  const css = tokensCss(data.tokens.tokens);
  assert.match(css, /^:root \{\n/); assert.ok(css.includes('  --color-surface-ground: #F4F6F5;')); assert.ok(css.includes('  --space-2: 8px;')); assert.ok(css.includes('  --font-body: "Public Sans", Arial, sans-serif;'));
  assert.ok(!css.includes('--color-text-placeholder'), 'a deprecated token is not emitted');
  assert.deepEqual(data.resources.kit.map((k) => k.design), [null, null, null], 'nobody wrote a design: link');
  const html = renderDesignHtml({ ...data, projectDir: dir }, 'x');
  assert.match(html, /<strong>0 of 3<\/strong> components carry a <code>design:<\/code> link/);
  assert.match(html, /id="res-tokens"[^>]*data-code="[^"]*tokens\.json \(DTCG\)[^"]*CSS variables — derived at render/);
  assert.match(html, /download="tokens.json"/);
  assert.match(html, /id="res-imports"[^>]*data-code="[^"]*import \{ Button \}[^"]*\\n[^"]*import \{ ShiftRow \}/, 'the import lines, newline-joined');
  const manifest = JSON.stringify({ components: [{ name: 'Button', import: "import { Button } from '@/components/Button'", design: 'https://example.test/file/abc?node-id=1' }, { name: 'ShiftRow', import: 'x' }] });
  const linked = withRest({ 'docs/design/library/manifest.json': manifest });
  assert.deepEqual(readKitLinks(linked, readComponents(linked).components).map((k) => k.design), ['https://example.test/file/abc?node-id=1', null]);
  const html2 = renderDesignHtml({ ...collectDesign(linked, 'Tidewell'), projectDir: linked }, 'x');
  assert.match(html2, /<strong>1 of 2<\/strong> components carry/); assert.match(html2, /<a href="https:\/\/example\.test\/file\/abc\?node-id=1" rel="noopener">Open in your design tool<\/a>/);
});

test('exceptions group by the rule they depart from: three against one rule is a verdict on the rule, one is an exception, the blank row is skipped, an empty table is dormant not a hole', () => {
  const dir = withRest();
  const ex = readExceptions(readStyleGuide(dir).text);
  assert.equal(ex.rows.length, 4); assert.equal(ex.groups.length, 2);
  assert.equal(ex.groups[0].rule, 'two primary buttons'); assert.equal(ex.groups[0].rows.length, 3); assert.match(ex.groups[0].verdict, /the rule is wrong/);
  assert.equal(ex.groups[1].rows.length, 1); assert.equal(ex.groups[1].verdict, 'an exception');
  const html = renderDesignHtml({ ...collectDesign(dir, 'Tidewell'), projectDir: dir }, 'x');
  assert.match(html, /4 recorded, against 2 rules/); assert.match(html, /id="exception-1"[\s\S]*?<span class="chip find">3 · the rule is wrong/);
  const bare = withParts();
  const html2 = renderDesignHtml({ ...collectDesign(bare, 'Tidewell'), projectDir: bare }, 'x');
  assert.match(html2, /class="block dormant" id="exceptions-none"/);
  assert.match(html2, /<b class="tab">10 of 16<\/b> slots/);
  assert.match(html, /<b class="tab">12 of 16<\/b> slots/, 'icons and the logo fill two more');
  const order = ['id="brand"', 'id="people"', 'id="journey"', 'id="principles"', 'id="colour"', 'id="type"', 'id="shape"', 'id="icons"', 'id="layout"', 'id="components"', 'id="patterns"', 'id="flows"', 'id="content"', 'id="a11y"', 'id="resources"', 'id="exceptions"', 'id="research"'].map((x) => html.indexOf('<section class="chapter" ' + x));
  assert.ok(order.every((v, i) => v > 0 && (i === 0 || v > order[i - 1])), 'seventeen sections in the decided order');
});

// --- the shipped skeleton is all holes (IDEA-107 kicks-up: the slots the template gained) -----------

test('the untouched STYLE_GUIDE skeleton renders every slot as a hole — its prose and <placeholders> never count as a decision', () => {
  const tpl = readFileSync(new URL('../stages/L1-mvp/template/.claude/skills/design-tokens-init/templates/style-guide.md', import.meta.url), 'utf8');
  const skeleton = tpl.slice(tpl.indexOf('```markdown') + 12, tpl.lastIndexOf('```')).replace(/\{\{PROJECT_NAME\}\}/g, 'Tidewell').replace(/\{\{DATE\}\}/g, '2026-09-13');
  const dir = tidewell({ 'docs/design/STYLE_GUIDE.md': skeleton });
  const g = readStyleGuide(dir);
  assert.equal(g.principles.length, 0, 'the <Principle> headings are placeholders'); assert.equal(g.layout, false, 'six sub-slots, all <placeholders>'); assert.deepEqual(g.layoutSlots.map((x) => x.label), ['Base unit', 'The ramp', 'Grid anatomy', 'Breakpoints', 'Responsive techniques', 'Density']);
  assert.equal(g.terms.length, 0); assert.equal(g.voiceDeferred, true); assert.equal(g.doDont.length, 2, 'the two seeded do/don\'t rows are real rules; the third is a placeholder');
  assert.deepEqual(readIconDecision(g.text), { set: '', sizes: '', iconOnly: '', never: '' });
  const lg = readLogo(dir); assert.equal(lg.clearSpace, ''); assert.equal(lg.misuse, '');
  assert.equal(readExceptions(g.text).rows.length, 0);
  const html = renderDesignHtml({ ...collectDesign(dir, 'Tidewell'), projectDir: dir }, 'x');
  assert.match(html, /id="layout-hole"/); assert.match(html, /class="block hole" id="logo"/); assert.match(html, /class="block hole" id="icons-decision"/);
  // and one decided line plus a breakpoint token turns Layout into a read
  const filled = skeleton.replace('- **Base unit:** <e.g. 4 — the spacing scale is multiples of it>', '- **Base unit:** 4');
  const tokens = JSON.parse(TOKENS); tokens.breakpoint = { md: { $type: 'dimension', $value: { value: 768, unit: 'px' } } }; tokens.target = { min: { $type: 'dimension', $value: { value: 44, unit: 'px' } } };
  const dir2 = tidewell({ 'docs/design/STYLE_GUIDE.md': filled, 'docs/design/tokens.json': JSON.stringify(tokens) });
  const html2 = renderDesignHtml({ ...collectDesign(dir2, 'Tidewell'), projectDir: dir2 }, 'x');
  assert.match(html2, /id="layout-guide"[\s\S]*?<strong>Base unit:<\/strong> 4<\/li>/); assert.match(html2, /1 of 6 decided/);
  assert.match(html2, /<code>breakpoint\.\*<\/code> tokens: breakpoint\.md 768px\./); assert.match(html2, /<code>target\.min<\/code> 44px\./);
});

test('research on a design object is by name, not by a new field: an EVID whose about:/relates: names the component or the PAT id shows on it; prose "button" does not', () => {
  const evidAbout = (id, about) => `---\nid: ${id}\ntype: evidence\ngrade: stated-pain\nmethod: interview\ndate: 2026-09-01\nabout: ${about}\n---\n# ${id} — x\n\nShe said the button was fine. Nothing here counts.\n`;
  const dir = withParts({ 'docs/evidence/EVID-010-a.md': evidAbout('EVID-010', 'Button, the ask flow'), 'docs/evidence/EVID-011-b.md': evidAbout('EVID-011', 'PAT-1'), 'docs/evidence/EVID-012-c.md': evidAbout('EVID-012', 'the button on the row') });
  const r = readResearch(dir);
  assert.deepEqual(researchOn(r.evid, 'Button'), ['EVID-010'], 'exact case, whole word — "button" in prose is not research on Button');
  assert.deepEqual(researchOn(r.evid, 'PAT-1'), ['EVID-011']); assert.deepEqual(researchOn(r.evid, 'ShiftRow'), []);
  const html = renderDesignHtml({ ...collectDesign(dir, 'Tidewell'), projectDir: dir }, 'x');
  assert.match(html, /id="component-button"[\s\S]*?<span class="chip ev">research · EVID-010<\/span>/);
  assert.match(html, /PAT-1[\s\S]*?<span class="chip asserted">no principle named<\/span> <span class="chip ev">research · EVID-011<\/span>/);
  assert.ok(!html.includes('A quote'), 'still never a quote');
  const withPrinciple = PATTERNS.replace('| ID | Pattern | The situation | The rule | Anti-pattern | First seen |\n|---|---|---|---|---|---|\n| **PAT-1** | Ask, don\'t assign | a shift needs cover | the owner asks one person; the app never assigns | auto-assign with a notification | 2026-09-02 |',
    '| ID | Pattern | The situation | The rule | Anti-pattern | Principle | First seen |\n|---|---|---|---|---|---|---|\n| **PAT-1** | Ask, don\'t assign | a shift needs cover | the owner asks one person; the app never assigns | auto-assign with a notification | 1 · Calm over urgent | 2026-09-02 |');
  const dir2 = withParts({ 'docs/design/PATTERNS.md': withPrinciple });
  const html2 = renderDesignHtml({ ...collectDesign(dir2, 'Tidewell'), projectDir: dir2 }, 'x');
  assert.match(html2, /descends from · 1 · Calm over urgent/);
  assert.match(html2, /id="principle-1"[\s\S]*?<span class="chip dec">1 rule descends<\/span>/); assert.match(html2, /id="principle-2"[\s\S]*?no rule descends from it yet/);
});

test('the open slots read back in build order, each with its verb and the moment that earns it; a filled slot drops out', () => {
  const dir = project({ 'docs/ideas/IDEA-001.md': '# nothing' });
  const data = collectDesign(dir, 'Tidewell');
  assert.equal(data.questions.length, 17, 'every slot is open on an empty tree');
  assert.deepEqual(data.questions.slice(0, 3).map((q) => q.verb), ['/landing', '/persona derive', '/spec'], 'cheapest and earliest first');
  const layout = data.questions.find((q) => q.id === 'layout-hole');
  assert.equal(layout.verb, '/design-review'); assert.equal(layout.moment, 'at the first screen with a grid');
  assert.equal(data.questions.find((q) => q.id === 'logo').verb, 'docs/BRAND.md · logo: <path>');
  assert.equal(data.questions.find((q) => q.id === 'content-voice').verb, '/ux-check');
  const rest = withRest();
  const q2 = collectDesign(rest, 'Tidewell').questions.map((q) => q.id);
  assert.ok(!q2.includes('logo') && !q2.includes('icons-set') && !q2.includes('components-none') && !q2.includes('content-voice'), 'filled slots are not questions');
  assert.ok(q2.includes('persona-none') && q2.includes('layout-hole'), 'the still-empty ones are');
  const html = renderDesignHtml({ ...collectDesign(rest, 'Tidewell'), projectDir: rest }, 'x');
  assert.match(html, /<b class="tab">\d+<\/b> open · next: \/persona derive/, 'the ledger names the next verb');
  assert.match(html, /\/design-review reads it back at the first screen with a grid/, 'the layout hole names the moment that fills it');
});

// --- IDEA-112 / FEAT-037: the library keeps itself ----------------------------------------------------

const USAGE_BUTTON = `---
component: Button
status: stable
source: src/components/Button.tsx
updated: 2026-09-12
---

# Button

**Why it exists:** new — the one act a screen exists for; nothing else commits the user to anything.

## When it applies
- the one act a screen exists for — "Ask Priya", "Add the week"

## When it doesn't
- navigation — that is a link
- a state change that isn't an act — a toggle

## Variants, and when
| Variant | Use it for | Never for |
|---|---|---|
| primary | the act | a second act on the same view |
| ghost | an act on a row | the only control on a screen |

## Content
- verb first, two to three words, sentence case

## Layout
- <where it sits>

## Accessibility
- the label is the name; 44px on the caregiver's phone

## Research
- <EVID-NNN>
`;
const USAGE_PROPOSED = `---
component: CoverSheet
status: proposed
---

# CoverSheet

**Why it exists:** new — a printable week for the one owner in eight who works on paper; no component renders for print today.

## When it applies
- the owner prints the week
`;
function withLibrary(extra = {}) {
  return withParts({ 'docs/design/components/Button.md': USAGE_BUTTON, 'docs/design/components/CoverSheet.md': USAGE_PROPOSED,
    'src/components/ShiftRow.tsx': 'export const ShiftRow = () => null;\n', 'src/components/CaregiverLine.tsx': 'export const CaregiverLine = () => null;\n', 'src/components/DashboardPage.tsx': 'x', 'src/components/Button.test.tsx': 'x', 'src/components/index.ts': 'x', ...extra });
}

test('a usage page reads as the template writes it — why it exists, the lists, the variants; placeholders are holes; a proposed page is a request', () => {
  const dir = withLibrary();
  const pages = readUsagePages(dir);
  assert.deepEqual(pages.map((p) => [p.name, p.status]), [['Button', 'stable'], ['CoverSheet', 'proposed']]);
  const b = pages[0];
  assert.match(b.why, /^new — the one act/); assert.equal(b.applies.length, 1); assert.equal(b.doesnt.length, 2); assert.deepEqual(b.layout, [], 'a <placeholder> bullet is not content'); assert.deepEqual(b.research, []);
  assert.deepEqual(b.variants.map((v) => v.variant), ['primary', 'ghost']); assert.equal(b.filled, 6, 'why · applies · doesnt · variants · content · a11y');
  const data = collectDesign(dir, 'Tidewell');
  assert.equal(data.components.components[0].usage.name, 'Button'); assert.equal(data.components.components[1].usage, null, 'ShiftRow has no page');
  assert.deepEqual(data.components.proposed.map((u) => u.name), ['CoverSheet']);
});

test('the tree is read back: PascalCase component files in the conventional directories, never tests, barrels or page-shaped names; those with no row are unindexed', () => {
  const dir = withLibrary();
  assert.deepEqual(scanTree(dir).map((f) => f.name), ['Button', 'CaregiverLine', 'ShiftRow']);
  const data = collectDesign(dir, 'Tidewell');
  assert.deepEqual(data.components.unindexed.map((f) => f.name), ['CaregiverLine'], 'Button and ShiftRow have rows; CaregiverLine does not');
  const html = renderDesignHtml({ ...data, projectDir: dir }, 'x');
  assert.match(html, /id="components-unindexed"[\s\S]*?<code>CaregiverLine<\/code> — <span class="mono">src\/components\/CaregiverLine\.tsx<\/span>/);
  assert.match(html, /1 of 3 component files/);
  assert.ok(!html.includes('DashboardPage'), 'a page is a composition, not a component');
  const q = data.questions.map((x) => x.id);
  assert.ok(q.includes('unindexed-caregiverline') && q.includes('usage-shiftrow') && q.includes('proposed-coversheet'), 'the row, the page and the request are all questions');
  assert.ok(!q.includes('usage-button'), 'Button has its page'); assert.ok(!q.includes('usage-card'), 'a deprecated component is not asked for a page');
  assert.equal(data.questions.find((x) => x.id === 'unindexed-caregiverline').moment, 'now — src/components/CaregiverLine.tsx already exists');
});

test('the card renders Usage before the frame with why-it-exists first; a component without a page says which verb writes it; Asked for lists the proposal; the request path is in Resources', () => {
  const dir = withLibrary();
  const html = renderDesignHtml({ ...collectDesign(dir, 'Tidewell'), projectDir: dir }, 'x');
  const card = html.slice(html.indexOf('id="component-button"'), html.indexOf('id="component-shiftrow"'));
  assert.ok(card.indexOf('<strong>Why it exists:</strong> new — the one act') < card.indexOf('<div class="frame"'), 'usage first, frame after');
  assert.match(card, /<td class="mono">ghost<\/td><td>an act on a row<\/td><td>the only control on a screen<\/td>/);
  assert.match(card, /<h4>Layout<\/h4><p class="unk">not written<\/p>/);
  assert.match(card, /6 of 8 written/);
  const row = html.slice(html.indexOf('id="component-shiftrow"'), html.indexOf('id="component-card"'));
  assert.match(row, /No usage page[\s\S]*?docs\/design\/components\/ShiftRow\.md/);
  assert.match(html, /id="components-asked"[\s\S]*?<strong>CoverSheet<\/strong> — new — a printable week/);
  assert.match(html, /id="res-ask"[\s\S]*?status: proposed/);
  // status disagreement: the index wins and the page says so
  const dis = withLibrary({ 'docs/design/components/Button.md': USAGE_BUTTON.replace('status: stable', 'status: draft') });
  const html2 = renderDesignHtml({ ...collectDesign(dis, 'Tidewell'), projectDir: dis }, 'x');
  assert.match(html2, /The page says <em>draft<\/em>; the index says <em>stable<\/em>\. The index wins\./);
});

test('the pattern-set template carries ten element families as decisions, every row with an anti-pattern', () => {
  const tpl = readFileSync(new URL('../stages/L1-mvp/template/.claude/skills/design-review/templates/pattern-set.md', import.meta.url), 'utf8');
  const md = tpl.slice(tpl.indexOf('```markdown') + 12, tpl.lastIndexOf('```'));
  const dir = tidewell({ 'docs/design/PATTERNS.md': md.replace(/\{\{PROJECT_NAME\}\}/g, 'T').replace(/\{\{DATE\}\}/g, '2026-09-13') });
  const pa = readPatterns(dir);
  const families = pa.groups.filter((g) => /^(Inputs|Data display|Waiting|Navigation|Overlays|Selection controls|Feedback|Forms as a whole|Layout primitives)/.test(g.heading));
  assert.equal(families.length, 9, 'nine tabled families; Icons is a decision list, not a table');
  assert.ok((tpl.match(/^### Icons/m)), 'icons is the tenth');
  for (const g of families) for (const r of g.rows) assert.ok(r.rule && r.anti, `${g.heading} · ${r.pattern} has a rule and an anti-pattern`);
  assert.equal(pa.ours.length, 0, 'the placeholder row is not a pattern');
});

test('a family appears only when the product uses it: a CLI-shaped tree shows no overlays even with seeded rows; a Modal in the tree shows overlays as in use and undecided; an Ours row lands under its family; the rest is one line of options', () => {
  const seededOverlays = PATTERNS + `
### Overlays — dialogs, popovers, tooltips, toasts

| Pattern | The situation | The rule | Anti-pattern |
|---|---|---|---|
| **A dialog is a question, not a place** | you are about to open a modal | one decision, then it closes | a modal with tabs |
`;
  const cli = withParts({ 'docs/design/PATTERNS.md': seededOverlays });
  const html = renderDesignHtml({ ...collectDesign(cli, 'Tidewell'), projectDir: cli }, 'x');
  assert.ok(!html.includes('id="family-overlays"'), 'no Modal anywhere → no overlays block, seeded rows or not');
  assert.ok(!html.includes('A dialog is a question, not a place'), 'the seed is not rendered for a family not in use');
  assert.match(html, /famil(y exists|ies exist) as options — [^<]*overlays/);
  assert.match(html, /1 decision of the product's own · 2 families in use, 2 with nothing decided/, 'ShiftRow (data display) and the deprecated-but-present Card (layout) are in use; the retired CTAButton is not; PAT-1 names no family');
  assert.match(html, /class="block hole" id="family-data-display"[\s\S]*?in use: ShiftRow/);
  assert.match(html, /class="block hole" id="family-layout"[\s\S]*?in use: Card/, 'deprecated is still in use until its last import goes');
  const web = withParts({ 'docs/design/PATTERNS.md': seededOverlays, 'src/components/Modal.tsx': 'export const Modal = () => null;\n' });
  const data = collectDesign(web, 'Tidewell');
  assert.deepEqual(data.patterns.inUse.get('overlays'), ['Modal']);
  const html2 = renderDesignHtml({ ...data, projectDir: web }, 'x');
  assert.match(html2, /class="block hole" id="family-overlays"[\s\S]*?in use: Modal · nothing decided/);
  assert.match(html2, /1 prompt BOSS seeded for this family — questions, not decisions/);
  assert.ok(data.questions.some((q) => q.id === 'family-overlays' && q.moment === 'at the next screen with Modal'));
  const decided = seededOverlays.replace('| **PAT-2** | *(your first one lands here)* | | | | |', '| **PAT-2** | One question per dialog | a modal is about to open | one decision, then it closes | a modal that opens a modal | 2026-09-05 |');
  const dir3 = withParts({ 'docs/design/PATTERNS.md': decided, 'src/components/Modal.tsx': 'x' });
  const d3 = collectDesign(dir3, 'Tidewell');
  assert.equal(d3.patterns.ours.find((r) => r.id === 'PAT-2').familyKey, 'overlays', 'the family is read from the row\'s words');
  const html3 = renderDesignHtml({ ...d3, projectDir: dir3 }, 'x');
  assert.match(html3, /<article class="block" id="family-overlays"[\s\S]*?1 decided/);
  assert.match(html3, /<b class="tab">\d+<\/b> open/);
});

test('divergence reads the trace back: decisions handed, and each new-component question answered by what is on disk now — a row, gone, or unanswered; outside the window is ignored; no trace is dormant', () => {
  const now = Date.now(), d = (n) => new Date(now - n * 86400000).toISOString();
  const trace = [
    { ts: d(1), kind: 'design-decision', file: 'src/components/CoverDialog.tsx', ids: ['PAT-1'] },
    { ts: d(2), kind: 'design-decision', file: 'src/components/WeekView.tsx', ids: ['PAT-1', 'dodont-1'] },
    { ts: d(3), kind: 'component-new', name: 'ShiftRow', path: 'src/components/ShiftRow.tsx', near: [] },
    { ts: d(4), kind: 'component-new', name: 'CaregiverLine', path: 'src/components/CaregiverLine.tsx', near: ['Caregiver'] },
    { ts: d(5), kind: 'component-new', name: 'CTAButton', path: 'src/components/CTAButton.tsx', near: ['Button'] },
    { ts: d(45), kind: 'component-new', name: 'OldThing', path: 'x', near: [] },
    { ts: d(1), session: 's', agent: 'coder', files: ['a'] },
  ].map((x) => JSON.stringify(x)).join('\n') + '\n';
  const dir = withLibrary({ '.boss/trace.jsonl': trace });
  const data = collectDesign(dir, 'Tidewell');
  const dv = data.divergence;
  assert.equal(dv.handed.length, 2); assert.deepEqual(dv.byId, [['PAT-1', 2], ['dodont-1', 1]]); assert.equal(dv.files.length, 2);
  assert.equal(dv.asked.length, 3, 'the 45-day-old question is outside the window');
  assert.deepEqual(Object.fromEntries(dv.asked.map((a) => [a.name, a.answer])), { ShiftRow: 'indexed', CaregiverLine: 'unanswered', CTAButton: 'reused' }, 'a row · in the tree with no row · gone from the tree');
  const html = renderDesignHtml({ ...data, projectDir: dir }, 'x');
  assert.match(html, /id="divergence"[\s\S]*?<strong class="tab">2<\/strong> times across <strong class="tab">2<\/strong> files — PAT-1 ×2 · dodont-1 ×1/);
  assert.match(html, /<span class="ok">1 became a row<\/span> · <span class="ok">1 reused<\/span>[^<]*<span class="n">1 unanswered<\/span>/);
  assert.match(html, /<code>CaregiverLine<\/code> — near Caregiver/);
  assert.ok(html.indexOf('id="divergence"') < html.indexOf('id="exception-1"') || !html.includes('id="exception-1"'), 'divergence sits first in the chapter');
  const bare = withLibrary();
  const html2 = renderDesignHtml({ ...collectDesign(bare, 'Tidewell'), projectDir: bare }, 'x');
  assert.match(html2, /class="block dormant" id="divergence"[\s\S]*?boss hooks enable design-decisions-guard · component-reuse-guard/);
});

test('the page is set in the founder\'s own tokens — ground, paper, ink, rule, faces — light scheme only; with no tokens the neutral shell stands', () => {
  const { tokens } = readTokens(tidewell());
  const th = themeFromTokens(tokens);
  assert.ok(th.css.includes('--ground: #F4F6F5') && th.css.includes('--paper: #FFFFFF') && th.css.includes('--ink: #17211E') && th.css.includes('--muted: #7D8985'));
  assert.ok(th.css.includes('--display: Newsreader, Georgia, serif') && th.css.includes('--body: "Public Sans", Arial, sans-serif'));
  assert.ok(th.css.includes('@media (prefers-color-scheme: light)') && th.css.includes(':root[data-theme="light"]') && !th.css.includes('[data-theme="dark"] {'), 'never applied to the dark scheme');
  assert.ok(!th.css.includes('--ink-2: #9AA5A1'), 'the deprecated placeholder is not a theme token');
  assert.deepEqual(themeFromTokens([]), { css: '', used: [] });
  const dir = tidewell();
  const html = renderDesignHtml({ ...collectDesign(dir, 'Tidewell'), projectDir: dir }, 'x');
  assert.match(html, /this page is set in your own tokens — ground ← color\.surface\.ground/);
  const bare = project({ 'docs/BRAND.md': BRAND });
  const html2 = renderDesignHtml({ ...collectDesign(bare, 'Tidewell'), projectDir: bare }, 'x');
  assert.match(html2, /set in the shell's neutral palette with your accent/);
});
