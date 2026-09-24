// FEAT-026 — the playbook render, slice 1: the canvas as boxes.
//
// Every test here is an acceptance criterion from the FEAT record, phrased so a reader who has
// never seen src/playbook.js could check it against the page. The three rules the module
// claims (no composed words · a hole is a hole · numbers are counted) are each held by a test.

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { project, cleanup } from './helpers.js';
import { CELLS, parseCanvas, collectPlaybook, renderPlaybookHtml, playbookHtml, inline, readBrand } from '../src/playbook.js';
import { DEFAULT_ACCENT } from '../src/page-shell.js';

after(cleanup);

// fileURLToPath, never `.pathname`: on Windows `.pathname` is `/D:/a/...`, and join() made it `\\D:\\...`.
const ROOT = fileURLToPath(new URL('..', import.meta.url));
const BIN = join(ROOT, 'bin', 'boss');

const stamp = () => ({ '.boss/manifest.json': JSON.stringify({ name: 'tidewell', stage: 'L0-quickstart', version: '0.0.0' }) });

// A canvas in the exact shape /canvas writes: three bands, bold cell names, a dormant cell, a hole.
const CANVAS = `---
id: IDEA-001-canvas
type: canvas
owner: "@you"
status: draft
updated: 2026-08-20
---

# Canvas — Tidewell

## 1 · Human Foundation

| Cell | Answer |
|---|---|
| **People** | Owner-operators of small home-care agencies. **About 6,400** in England. |
| **Problem** | Every Sunday night the owner rebuilds the rota by phone. |
| **Promises** | We help agencies fill every shift *without* the phone tree. |

## 2 · Product Expression

| Cell | Answer |
|---|---|
| **Story** | One tap when someone calls in sick. |
| **Modes of Engagement** | Nothing pings after 8pm. |
| **Business Model** | £4 per caregiver per month, flat. |
| **Cost Structure** _(live once there's a price, or a real cost)_ | _(not yet)_ |
| **What it takes to deliver** _(live when the answer isn't "just me and a laptop")_ | _(live when the answer isn't "just me and a laptop")_ |
| **Key Partnerships** _(live only if someone else is load-bearing)_ | _(not yet)_ |

## 3 · Stewardship

| Cell | Answer |
|---|---|
| **Metrics** | _(not yet)_ |
| **Risks & Harms** | A visit marked covered that isn't. <br> Caregivers watched by location — refused. |
| **Build or buy?** | Build the cover flow only. |
| **Principles** | Never sell caregiver data. |
| **Our own cell** | A cell the founder added that no registry knows. |
`;

const EVID = (n, grade, assumption, date) => `---
id: EVID-00${n}
type: evidence
owner: "@you"
status: captured
grade: ${grade}
source: an owner — ${date}
assumption: ${assumption}
---
`;

test('registry stays in step with the /canvas template — every cell name is in the shipped SKILL.md', () => {
  const skill = readFileSync(join(ROOT, 'stages/L0-quickstart/template/.claude/skills/canvas/SKILL.md'), 'utf8');
  for (const c of CELLS) assert.ok(skill.includes(`**${c.name}**`), `${c.name} is not a cell in the canvas template`);
});

test('parseCanvas: every bold row is a cell, in its band, with its condition', () => {
  const { cells, updated } = parseCanvas(CANVAS);
  assert.equal(cells.length, 14);
  assert.equal(updated, '2026-08-20');
  const cost = cells.find((c) => c.name === 'Cost Structure');
  assert.equal(cost.band, 2);
  assert.equal(cost.condition, "live once there's a price, or a real cost");
  assert.equal(cost.answer, '_(not yet)_');
});

test('every cell renders as a box — none omitted, none reworded, the founder\'s own cell kept', () => {
  const dir = project({ ...stamp(), 'docs/ideas/IDEA-001-canvas.md': CANVAS });
  const { data } = playbookHtml(dir, 'tidewell');
  const html = readFileSync(join(dir, '.boss', 'playbook.html'), 'utf8');
  for (const c of CELLS) assert.ok(html.includes(`id="canvas-${c.key}"`), `${c.name} missing`);
  assert.ok(html.includes('Owner-operators of small home-care agencies. <strong>About 6,400</strong> in England.'), 'the answer must render whole, markup and all');
  assert.ok(html.includes('A cell the founder added'), 'an unknown cell is still the founder\'s cell');
  assert.ok(html.includes('· your cell'), 'and it is marked as theirs');
  assert.equal(data.boxes.length, 14);
});

test('a hole is a hole: not-yet renders dashed with its prompt and the verb; dormant renders with its condition', () => {
  const dir = project({ ...stamp(), 'docs/ideas/IDEA-001-canvas.md': CANVAS });
  const { data } = playbookHtml(dir, 'tidewell');
  const html = readFileSync(join(dir, '.boss', 'playbook.html'), 'utf8');
  const box = (key) => data.boxes.find((b) => b.key === key);
  assert.equal(box('metrics').state, 'hole');
  assert.equal(box('cost').state, 'dormant', 'a not-yet under a live-once condition is dormant');
  assert.equal(box('deliver').state, 'dormant');
  assert.match(html, /class="block hole[^"]*" id="canvas-metrics"/);
  assert.ok(html.includes('not yet · /canvas fills it'));
  assert.ok(html.includes("dormant — live once there's a price, or a real cost"));
  assert.ok(!html.includes('_(not yet)_'), 'machine syntax never reaches the page');
});

test('the floor: Risks & Harms and Principles render in the Lean frame as a full band under the template\'s own heading', () => {
  const dir = project({ ...stamp(), 'docs/ideas/IDEA-001-canvas.md': CANVAS });
  playbookHtml(dir, 'tidewell');
  const html = readFileSync(join(dir, '.boss', 'playbook.html'), 'utf8');
  assert.ok(html.includes("Two questions this canvas asks that Lean and BMC don't"));
  assert.match(html, /class="block filled floor[^"]*" id="canvas-risks"/);
  assert.match(html, /class="block filled floor[^"]*" id="canvas-principles"/);
  // Floor cells are never hidden by the Lean rule that hides humane-only cells.
  assert.ok(html.includes('.canvas[data-frame="lean"] .block.floor { display: flex; }'));
  assert.ok(html.includes('Lean Canvas · Ash Maurya'));
  assert.ok(html.includes('Humane Product Canvas · Ajesh Shah'));
});

test('chips and the ledger are counted from the files — EVID naming a cell backs it; the rest are asserted', () => {
  const dir = project({
    ...stamp(),
    'docs/ideas/IDEA-001-canvas.md': CANVAS,
    'docs/evidence/EVID-001.md': EVID(1, 'stated-pain', 'the Problem is the cover, not the rota', '2026-08-12'),
    'docs/evidence/EVID-002.md': EVID(2, 'stated-pain', 'owners will pay — bears on Problem and Business Model', '2026-08-19'),
    'docs/evidence/EVID-003.md': EVID(3, 'commitment', 'she handed over the rota (People)', '2026-08-30'),
  });
  const { data } = playbookHtml(dir, 'tidewell');
  const html = readFileSync(join(dir, '.boss', 'playbook.html'), 'utf8');
  const box = (key) => data.boxes.find((b) => b.key === key);
  assert.equal(box('problem').evidence, 2);
  assert.equal(box('people').topGrade, 'commitment');
  assert.equal(box('story').evidence, 0);
  assert.ok(html.includes('EVID ×2 · stated-pain'));
  assert.ok(html.includes('EVID ×1 · commitment'));
  assert.equal(data.ledger.signals, 3);
  assert.equal(data.ledger.backed, 3, 'Problem, Business Model, People');
  assert.equal(data.ledger.topOverall, 'commitment');
  assert.match(html, /<b class="tab">3 of \d+<\/b> cells backed by graded evidence · <b>3<\/b> signals, top <b>commitment<\/b>/);
});

test('the deck and the PDF wear the brand\'s light scheme whatever the viewer\'s dark mode (IDEA-129)', () => {
  const dir = project({ ...stamp(), 'docs/ideas/IDEA-001-canvas.md': CANVAS, 'docs/BRAND.md': '---\nid: BRAND\naccent: "#B84E12"\n---\n# Brand\n', 'docs/design/tokens.json': JSON.stringify({ surface: { paper: { $type: 'color', $value: '#FFF8EE' } } }) });
  playbookHtml(dir, 'tidewell');
  const html = readFileSync(join(dir, '.boss', 'playbook.html'), 'utf8');
  const rule = [...html.matchAll(/\.deck, \.printdeck \{[^}]*\}/g)].map((m) => m[0]).find((r) => r.includes('--accent')) || '';
  assert.ok(rule.includes('color-scheme: light'), 'light, never the presenter\'s scheme');
  assert.ok(rule.includes('--accent: #B84E12'), 'the brand accent');
  assert.ok(rule.includes('--paper: #FFF8EE'), 'the brand tokens, after the neutral light defaults');
  assert.ok(rule.indexOf('--paper: #FFF8EE') > rule.indexOf('--paper: #F7F5EF'), 'tokens win over the neutral');
});

test('an EVID that matches an unanswered cell backs nothing: the ledger and the cover count answered cells only (IDEA-129)', () => {
  const dir = project({
    ...stamp(),
    'docs/ideas/IDEA-001-canvas.md': CANVAS.replace(/\| \*\*What it takes to deliver\*\*[^\n]*/, '| **What it takes to deliver** | _(not yet)_ |'),
    'docs/evidence/EVID-001.md': EVID(1, 'stated-pain', 'founders cannot deliver alone', '2026-08-10'),
  });
  const { data } = playbookHtml(dir, 'tidewell');
  const html = readFileSync(join(dir, '.boss', 'playbook.html'), 'utf8');
  const d = data.boxes.find((b) => b.key === 'deliver');
  assert.equal(d.state, 'hole'); assert.equal(d.evidence, 1, 'the match still exists');
  assert.equal(data.ledger.backed, 0, 'but a hole is not backed');
  assert.match(html, /class="tile t-hole" href="#canvas-deliver" data-targets="canvas-deliver"/, 'the cover draws it as a hole');
  assert.ok(html.includes('id="cover"'), 'the cover renders');
  assert.ok(data.cuts.vc[0] === 'cover', 'and opens the VC cut');
});

test('single-file: nothing is fetched — no external script, stylesheet, font or image request', () => {
  const dir = project({ ...stamp(), 'docs/ideas/IDEA-001-canvas.md': CANVAS });
  playbookHtml(dir, 'tidewell');
  const html = readFileSync(join(dir, '.boss', 'playbook.html'), 'utf8');
  assert.doesNotMatch(html, /<link\b/i);
  assert.doesNotMatch(html, /<script[^>]+src=/i);
  assert.doesNotMatch(html, /@import|url\(/i);
  assert.doesNotMatch(html, /<img\b(?![^>]*src="data:)/i, 'an image only as an inlined data URI');
});

test('brand: BRAND.md accent and tagline apply; unknown falls back per field; no BRAND.md is nascent', () => {
  const branded = project({ ...stamp(), 'docs/BRAND.md': '---\nid: brand\nstatus: nascent\naccent: "#1B7F79"\ntagline: Calm on Sunday.\n---\n# Brand\n' });
  const b = readBrand(branded, 'tidewell');
  assert.equal(b.accent, '#1B7F79'); assert.equal(b.tagline, 'Calm on Sunday.'); assert.equal(b.nascent, true);
  const unknown = project({ ...stamp(), 'docs/BRAND.md': '---\nid: brand\naccent: unknown\ntagline: unknown\n---\n' });
  const u = readBrand(unknown, 'tidewell');
  assert.equal(u.accent, null, 'unknown is not a colour'); assert.equal(u.tagline, null);
  const html = renderPlaybookHtml(collectPlaybook(unknown, 'tidewell'), '2026-09-13 10:00');
  assert.ok(html.includes(`--accent: ${DEFAULT_ACCENT}`), 'no accent → the shell\'s one default, never a hue invented per project');
  assert.ok(html.includes('accent unknown → default'));
  const none = renderPlaybookHtml(collectPlaybook(project(stamp()), 'tidewell'), '2026-09-13 10:00');
  assert.ok(none.includes('brand: nascent — no docs/BRAND.md yet'));
});

test('first run: no canvas → every cell is a hole with its prompt, the ledger reads 0 of N, exit 0', () => {
  const dir = project(stamp());
  const out = execFileSync('node', [BIN, 'playbook'], { cwd: dir, encoding: 'utf8' });
  assert.match(out, /no canvas yet/);
  const html = readFileSync(join(dir, '.boss', 'playbook.html'), 'utf8');
  assert.equal((html.match(/class="block hole[^"]*" id="canvas-/g) || []).length, CELLS.length, 'every canvas cell is a hole');
  assert.ok(html.includes('<b class="tab">0 of'));
  assert.ok(html.includes('this page fills itself as you answer'));
});

test('failure path: a canvas with no cell table renders a page with one box saying so, exit 0', () => {
  const dir = project({ ...stamp(), 'docs/ideas/IDEA-001-canvas.md': '---\nid: x\n---\n# Canvas\n\nJust prose, no table.\n' });
  const out = execFileSync('node', [BIN, 'playbook'], { cwd: dir, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  assert.match(out, /Playbook →/);
  const html = readFileSync(join(dir, '.boss', 'playbook.html'), 'utf8');
  assert.ok(html.includes("Couldn't read the canvas"));
  assert.ok(html.includes('id="canvas-people"'), 'the rest of the page still renders');
});

test('destructive path: the render writes exactly one file and docs/ is byte-identical before and after', () => {
  const dir = project({
    ...stamp(),
    'docs/ideas/IDEA-001-canvas.md': CANVAS,
    'docs/evidence/EVID-001.md': EVID(1, 'stated-pain', 'Problem', '2026-08-12'),
    'docs/BRAND.md': '---\nid: brand\n---\n',
  });
  const snapshot = (d) => Object.fromEntries(readdirSync(d, { recursive: true }).map((f) => {
    const p = join(d, f); return [f, statSync(p).isFile() ? readFileSync(p, 'utf8') : 'dir'];
  }));
  const before = snapshot(join(dir, 'docs'));
  playbookHtml(dir, 'tidewell');
  assert.deepEqual(snapshot(join(dir, 'docs')), before);
  const boss = readdirSync(join(dir, '.boss')).sort();
  assert.deepEqual(boss, ['manifest.json', 'playbook.html']);
});

test('inline markdown: the founder\'s markup renders, everything else is escaped, wiki-links become plain text', () => {
  assert.equal(inline('**bold** and *em* and `code`'), '<strong>bold</strong> and <em>em</em> and <code>code</code>');
  assert.equal(inline('see [[DEC-009]] and [the site](https://x.example)'), 'see DEC-009 and <a href="https://x.example">the site</a>');
  assert.equal(inline('<script>alert(1)</script>'), '&lt;script&gt;alert(1)&lt;/script&gt;');
  assert.equal(inline('one <br> two'), 'one <br> two');
});

test('several canvases → the newest by updated:, named in the footer', () => {
  const dir = project({
    ...stamp(),
    'docs/ideas/IDEA-001-canvas.md': CANVAS.replace('updated: 2026-08-20', 'updated: 2026-07-01'),
    'docs/ideas/IDEA-002-canvas.md': CANVAS.replace('Owner-operators', 'NEWER-operators'),
  });
  const html = renderPlaybookHtml(collectPlaybook(dir, 'tidewell'), '2026-09-13 10:00');
  assert.ok(html.includes('NEWER-operators'));
  assert.ok(html.includes('newest of 2 (IDEA-001-canvas.md)'));
});

test('help lists the command and the template gitignores the output', () => {
  const help = execFileSync('node', [BIN, 'help'], { encoding: 'utf8' });
  assert.match(help, /boss playbook/);
  const gi = readFileSync(join(ROOT, 'stages/L0-quickstart/template/.gitignore'), 'utf8');
  assert.ok(gi.includes('.boss/playbook.html'));
  assert.ok(existsSync(BIN));
});

// --- FEAT-027 — the Pitch chapters ---------------------------------------------------------------

import { firstSentence, readPersonas, readCompetition, readIdea, blockMd, headline } from '../src/playbook.js';

const IDEA = `---
id: IDEA-001
type: idea
status: building
gist: A phone-first rota for small home-care agencies.
motivation: own-problem
success_looks_like: "Five agencies I don't know run their week on it."
created: 2026-08-04
---

# Tidewell

## Current shape
_The best articulation so far._
- **What:** One tap when someone calls in sick. The rota stays a spreadsheet.
- **Who it's for:** owner-operators with 3 to 15 caregivers.

## Capture log
- 2026-08-04 — seed
`;
const PERSONA = `---
id: persona-dee
created: 2026-08-19
role: primary
---

# Persona — Dee

**who** — 52, owns a nine-caregiver agency in a market town; runs it from the kitchen table.
**context** — Sunday, 8:40pm: a text says "can't do tomorrow".
**jobs** — keep every visit covered.

Evidence ledger:  synthetic 60% · real 40%
`;
const COMP = `---
id: COMPETITION
updated: 2026-08-30
---

# The field

| Rival | What it is | Pricing | Why they might win | Where they're weak | Checked |
|---|---|---|---|---|---|
| [**Rotawise**](rotawise.md) | direct — agency rota software | £12 / seat | every inspector already recognises their export | office-first | 2026-08-30 |
| **ShiftLoop** | adjacent — generic shifts | £3 / user | cheaper, slicker | no visit model | 2026-05-02 |
`;
const ROTAWISE = `# Rotawise\n\n## Where it breaks\n- caregivers rate the phone app 2.1 — "it logs me out on every visit"\n- cover-finding is still a phone call\n\n## How they do it\n- rota: office-first\n`;

test('headline: a chapter line drops a status mark, a version stamp and a field label — trimmed, never reworded (IDEA-129)', () => {
  assert.equal(headline('🟢 v0.5 (2026-08-21) — RE-AIMED, not swept.'), 'RE-AIMED, not swept.');
  assert.equal(headline('What: One tap when someone calls in sick.'), 'One tap when someone calls in sick.');
  assert.equal(headline('We find cover before the kettle boils.'), 'We find cover before the kettle boils.');
  assert.equal(headline('Note: ok'), 'Note: ok', 'too little left: the line stays whole');
  for (const x of ['🟢 v0.5 — UNCHANGED BY DECISION.', 'What: One tap.']) assert.ok(x.includes(headline(x)), 'still a substring of the record');
});

test('firstSentence: the record\'s own first sentence, markdown stripped, never composed', () => {
  assert.equal(firstSentence('We help **small** agencies fill every shift. Then more.'), 'We help small agencies fill every shift.');
  assert.equal(firstSentence('- **What:** One tap when someone calls in sick. The rota stays.'), 'What: One tap when someone calls in sick.');
  assert.equal(firstSentence(''), '');
});

test('readers: the IDEA doc the canvas belongs to, persona fields in the founder\'s markup, the competition table as it is', () => {
  const dir = project({
    ...stamp(),
    'docs/ideas/IDEA-001-tidewell.md': IDEA, 'docs/ideas/IDEA-001-canvas.md': CANVAS,
    'docs/ideas/IDEA-002-later.md': IDEA.replace('IDEA-001', 'IDEA-002').replace('2026-08-04', '2026-09-01'),
    'docs/personas/dee.md': PERSONA, 'docs/personas/priya.md': PERSONA.replace('role: primary', 'role: secondary').replace('2026-08-19', '2026-09-01').replace('Dee', 'Priya').replace('synthetic 60% · real 40%', 'synthetic 100% · real 0%'),
    'docs/competition/README.md': COMP, 'docs/competition/rotawise.md': ROTAWISE,
  });
  const idea = readIdea(dir, 'IDEA-001-canvas');
  assert.equal(idea.id, 'IDEA-001', 'the canvas\'s own idea, not the newest');
  assert.equal(idea.motivation, 'own-problem');
  assert.match(idea.shape, /One tap when someone calls in sick/);
  const ps = readPersonas(dir);
  assert.equal(ps[0].slug, 'dee'); assert.equal(ps[0].primary, true);
  assert.match(ps[0].who, /^52, owns a nine-caregiver agency/);
  assert.equal(ps[0].synthetic, 60); assert.equal(ps[1].real, 0);
  const comp = readCompetition(dir, Date.parse('2026-09-13'));
  assert.equal(comp.rows.length, 2);
  assert.equal(comp.rows[0].name, 'Rotawise'); assert.equal(comp.rows[0].key, true); assert.equal(comp.rows[0].breaks.length, 2);
  assert.equal(comp.rows[1].key, false); assert.equal(comp.rows[1].stale, true); assert.equal(comp.rows[1].ageDays, 134);
});

test('with no canvas, readIdea picks the kind: venture record over a newer capability, and a motivation-carrying record over a bare one (IDEA-114)', () => {
  const bare = (id, extra, created) => `---\nid: ${id}\ntype: idea\nowner: product-lead\nstatus: seedling\ngist: x\n${extra}created: ${created}\n---\n\n# ${id}\n`;
  const dir = project({
    ...stamp(),
    'docs/ideas/IDEA-001-app.md': bare('IDEA-001', 'kind: venture\nmotivation: own-problem\n', '2026-08-01'),
    'docs/ideas/IDEA-002-feature.md': bare('IDEA-002', 'kind: capability\n', '2026-09-01'),
  });
  assert.equal(readIdea(dir).id, 'IDEA-001', 'the venture, not the newest');
  const dir2 = project({
    ...stamp(),
    'docs/ideas/IDEA-001-app.md': bare('IDEA-001', 'motivation: unset\n', '2026-08-01'),
    'docs/ideas/IDEA-002-feature.md': bare('IDEA-002', '', '2026-09-01'),
  });
  assert.equal(readIdea(dir2).id, 'IDEA-001', 'pre-field project: the record /boss wrote, by its motivation: line');
});

test('readIdea never takes a kind: capability as the venture; the canvas pairing still wins (IDEA-129)', () => {
  const bare = (id, extra, created) => `---\nid: ${id}\ntype: idea\nowner: product-lead\nstatus: seedling\ngist: x\n${extra}created: ${created}\n---\n\n# ${id}\n`;
  const dir = project({
    ...stamp(),
    'docs/ideas/IDEA-001-a.md': bare('IDEA-001', 'kind: capability\n', '2026-08-01'),
    'docs/ideas/IDEA-002-b.md': bare('IDEA-002', 'kind: capability\n', '2026-09-01'),
  });
  assert.equal(readIdea(dir), null, 'all capabilities: no venture, so the Vision holes');
  assert.equal(readIdea(dir, 'IDEA-002-canvas').id, 'IDEA-002', 'a canvas paired to a capability still reads it');
  const old = project({
    ...stamp(),
    'docs/ideas/IDEA-001-app.md': bare('IDEA-001', '', '2026-06-01'),
    'docs/ideas/IDEA-002-feature.md': bare('IDEA-002', '', '2026-07-01'),
  });
  assert.equal(readIdea(old).id, 'IDEA-001', 'pre-field project, no motivation: the spin-up record, not the newest feature');
});

test('eight chapters, each line a substring of a record on disk or absent — BOSS writes no chapter line', () => {
  const files = {
    ...stamp(),
    'docs/ideas/IDEA-001-tidewell.md': IDEA, 'docs/ideas/IDEA-001-canvas.md': CANVAS,
    'docs/personas/dee.md': PERSONA, 'docs/competition/README.md': COMP, 'docs/competition/rotawise.md': ROTAWISE,
    'docs/source/2026-08-20-register.csv': 'a,b\n', 'docs/dossier/mentor-capital.md': '---\nid: mentor-capital\nupdated: 2026-08-30\n---\n# Capital\n\nNot yet — nobody outside the founder\'s circle has paid.\n',
    'docs/BRAND.md': '---\nid: brand\n---\n## Current shape\n- **What it is NOT:** agency software. A marketplace.\n',
  };
  const dir = project(files);
  const html = renderPlaybookHtml(collectPlaybook(dir, 'tidewell'), '2026-09-13 10:00');
  for (const id of ['vision', 'product', 'customers', 'problem', 'market', 'competition', 'canvas', 'model']) assert.ok(html.includes(`<section class="chapter" id="${id}">`), id);
  const corpus = Object.values(files).join('\n').replace(/[*_`]/g, '');
  const lines = [...html.matchAll(/<h2>([^<]*)<\/h2>/g)].map((m) => m[1].replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&amp;/g, '&'));
  assert.ok(lines.length >= 5, 'most chapters have a line');
  for (const l of lines) {
    if (/^\d+ on the field; \d+ of them key\.$/.test(l)) continue;   // the one counted line
    assert.ok(corpus.includes(l.replace(/…$/, '')), `chapter line not from a record: "${l}"`);
  }
  // the pieces
  assert.ok(html.includes('Motivation:</strong> own-problem'));
  assert.ok(html.includes('One tap when someone calls in sick'));
  assert.ok(html.includes('agency software. A marketplace.'));
  assert.ok(html.includes('id="persona-dee"') && html.includes('synthetic 60% · real 40%'));
  assert.ok(html.includes('the full card lives in the Design space — not rendered yet'), 'no design.html → no link');
  assert.ok(html.includes('2026-08-20-register.csv'));
  assert.ok(html.includes('id="rival-rotawise"') && html.includes('it logs me out on every visit'));
  assert.match(html, /stale · \d+ d/, 'the 2026-05-02 row renders stale');
  assert.ok(html.includes("Not yet — nobody outside the founder"), 'the ask quotes the dossier');
  assert.ok(!/ceiling|×|TAM/.test(html), 'no arithmetic on the Market chapter');
});

test('first run of the chapters: no idea, personas, competition, sources or dossier → every chapter is questions and verbs', () => {
  const dir = project({ ...stamp(), 'docs/ideas/IDEA-001-canvas.md': CANVAS });
  const html = renderPlaybookHtml(collectPlaybook(dir, 'tidewell'), '2026-09-13 10:00');
  for (const v of ['/idea', '/persona derive', '/comp-eval', '/import', '/consult · mentor-capital', '/spec']) assert.ok(html.includes(v), v);
  assert.ok(html.includes('id="persona-none"') && html.includes('id="competition-none"'));
});

test('the Design link renders only when .boss/design.html is on disk, and is relative', () => {
  const dir = project({ ...stamp(), 'docs/ideas/IDEA-001-canvas.md': CANVAS, 'docs/personas/dee.md': PERSONA, '.boss/design.html': '<p>design</p>' });
  const html = renderPlaybookHtml(collectPlaybook(dir, 'tidewell'), '2026-09-13 10:00');
  assert.ok(html.includes('href="design.html#persona-dee"'));
  assert.doesNotMatch(html, /https:\/\/claude\.ai/);
});

test('blockMd: a hard-wrapped paragraph is one <p>, and emphasis across the wrap renders (IDEA-129)', () => {
  assert.equal(blockMd('Ajesh said: *"improve how we do it for\nshipped."* Then more.\n\nNext para.'), '<p>Ajesh said: <em>&quot;improve how we do it for shipped.&quot;</em> Then more.</p><p>Next para.</p>');
  assert.equal(blockMd('- **A.** first line\n  wraps here\n- second'), '<ul><li><strong>A.</strong> first line wraps here</li><li>second</li></ul>');
  assert.equal(blockMd('_a helper that\nwraps_'), '<p class="helper">a helper that wraps</p>');
});

test('blockMd: the IDEA doc\'s bullets and helper line render, escaped', () => {
  assert.equal(blockMd('_helper_\n- **What:** one <b>tap</b>\n- second'), '<p class="helper">helper</p><ul><li><strong>What:</strong> one &lt;b&gt;tap&lt;/b&gt;</li><li>second</li></ul>');
});

// --- IDEA-111 — the pull: the page's questions read back in the terminal -------------------------
import { openQuestions, questionsLine } from '../src/playbook.js';

test('open questions are the page\'s holes, once each — every canvas hole and every chapter hole, no dormant cell, no duplicate', () => {
  const dir = project({ ...stamp(), 'docs/ideas/IDEA-001-canvas.md': CANVAS, 'docs/ideas/IDEA-001-app.md': IDEA });
  const data = collectPlaybook(dir, 'tidewell');
  const html = renderPlaybookHtml(data, '2026-09-13 10:00');
  const qs = openQuestions(data, dir);
  const holeIds = [...html.matchAll(/class="block hole[^"]*" id="([^"]+)"/g)].map((m) => m[1]);
  // every terminal question is a hole on the page, and every non-canvas hole on the page is a question
  for (const q of qs) assert.ok(holeIds.includes(q.id), `${q.id} is on the page`);
  // a chapter's repeat of another chapter's hole (Vision repeats Team) is on the page and off the list — once each
  for (const id of holeIds.filter((i) => !i.startsWith('canvas-'))) {
    const h = data.holes.find((x) => x.id === id);
    assert.ok(qs.some((q) => q.id === id || (q.title === h.title && q.src === h.src)), `${id} is in the list, or its owner is`);
  }
  // the chapters repeat canvas cells as holes; the list carries each cell once, and never a dormant one
  const canvasQs = qs.filter((q) => q.verb === '/canvas');
  assert.equal(canvasQs.length, data.boxes.filter((b) => b.state === 'hole').length);
  assert.equal(new Set(canvasQs.map((q) => q.id)).size, canvasQs.length);
  assert.ok(!qs.some((q) => data.boxes.find((b) => b.state === 'dormant' && `canvas-${b.key}` === q.id)));
  // cheapest first: every /canvas before any other verb
  const firstOther = qs.findIndex((q) => q.verb !== '/canvas');
  assert.ok(qs.slice(0, firstOther).every((q) => q.verb === '/canvas'));
});

test('a verb the project does not have yet: droppable records point at /import, the rest wait for the mode; a verb it has is printed as is', () => {
  const dir = project({ ...stamp(), 'docs/ideas/IDEA-001-canvas.md': CANVAS, '.claude/skills/import/SKILL.md': '# import', '.claude/skills/persona/SKILL.md': '# persona' });
  const data = collectPlaybook(dir, 'tidewell'); renderPlaybookHtml(data, '2026-09-13 10:00');
  const line = (id) => openQuestions(data, dir).find((q) => q.id === id).line;
  assert.equal(line('competition-none'), '/comp-eval — or drop what you know: /import');
  assert.equal(line('product-not'), '/landing seeds docs/BRAND.md — or drop what you know: /import');
  assert.equal(line('product-feats'), '/spec — arrives with the next mode (boss unlock)');
  assert.equal(line('persona-none'), '/persona derive');
  assert.equal(line('team-none'), 'write docs/team/<you>.md — the README there has the shape; boss team add writes a cofounder\'s', 'a hole with no verb points at the record shape, without citing BOSS\'s own records');
  // skills folder present but no /import → the gated verb just waits
  const noImport = project({ ...stamp(), 'docs/ideas/IDEA-001-canvas.md': CANVAS, '.claude/skills/canvas/SKILL.md': '# canvas' });
  const d2 = collectPlaybook(noImport, 'tidewell'); renderPlaybookHtml(d2, '2026-09-13 10:00');
  assert.equal(openQuestions(d2, noImport).find((q) => q.id === 'competition-none').line, '/comp-eval — arrives with the next mode (boss unlock)');
  // no skills folder at all → nothing can be said about gating; the verb prints as is
  const bare = project({ ...stamp(), 'docs/ideas/IDEA-001-canvas.md': CANVAS });
  const d3 = collectPlaybook(bare, 'tidewell'); renderPlaybookHtml(d3, '2026-09-13 10:00');
  assert.equal(openQuestions(d3, bare).find((q) => q.id === 'competition-none').line, '/comp-eval');
});

test('the terminal: one summary line grouped by verb, --questions lists each with its verb, nothing open says so', () => {
  assert.equal(questionsLine([]), 'no questions open');
  assert.equal(questionsLine([{ line: '/canvas' }, { line: '/canvas' }, { line: '/idea' }]), '3 questions open · /canvas ×2 · /idea');
  const dir = project({ ...stamp(), 'docs/ideas/IDEA-001-canvas.md': CANVAS, 'docs/ideas/IDEA-001-app.md': IDEA });
  const out = execFileSync('node', [BIN, 'playbook', '--questions'], { cwd: dir, encoding: 'utf8' });
  assert.match(out, /\d+ questions open · \/canvas · \/decide/);
  assert.match(out, /· Who, exactly — \/persona derive/);
  const plain = execFileSync('node', [BIN, 'playbook'], { cwd: dir, encoding: 'utf8' });
  assert.doesNotMatch(plain, /· Who, exactly/, 'the list only with --questions');
});

test('the page says the same thing the terminal says: a gated hole\'s verb line matches, and the ledger carries the open count with the cheapest verb', () => {
  const dir = project({ ...stamp(), 'docs/ideas/IDEA-001-canvas.md': CANVAS, 'docs/ideas/IDEA-001-app.md': IDEA, '.claude/skills/import/SKILL.md': '# import', '.claude/skills/canvas/SKILL.md': '# canvas' });
  const data = collectPlaybook(dir, 'tidewell');
  const html = renderPlaybookHtml(data, '2026-09-13 10:00');
  assert.ok(html.includes('not yet · /comp-eval — or drop what you know: /import'));
  assert.ok(html.includes('not yet · /spec — arrives with the next mode (boss unlock)'));
  assert.ok(html.includes(`<b class="tab">${data.questions.length}</b> open · start: /canvas</div>`), 'the open line closes the ledger');
});

// --- FEAT-028, commit 1 — the shared shell -----------------------------------------------------
test('the playbook renders through the shared shell: family bar (siblings live only when on disk), copy sheet, frame toggle in the canvas chapter, Slide beside Link · Copy', () => {
  const dir = project({ ...stamp(), 'docs/ideas/IDEA-001-canvas.md': CANVAS });
  let html = renderPlaybookHtml(collectPlaybook(dir, 'tidewell'), '2026-09-13 10:00');
  assert.ok(html.includes('<nav class="family"'));
  assert.ok(html.includes('class="on" aria-current="page">Playbook</a>'));
  assert.match(html, /class="dim" aria-disabled="true"[^>]*>Design<\/a>/, 'no design.html → dimmed');
  assert.ok(html.includes("sheet.className = 'sheet'"), 'the copy sheet is the shell\'s');
  assert.ok(!html.includes('id="toast"'), 'the toast is gone');
  assert.match(html, /<div class="frame-bar"><div class="seg"/, 'the frame toggle lives in the canvas chapter');
  assert.ok(html.includes('class="slide" title="Open this box as a slide"'));
  assert.equal((html.match(/<header class="topbar">/g) || []).length, 1);
  const withDesign = project({ ...stamp(), 'docs/ideas/IDEA-001-canvas.md': CANVAS, '.boss/design.html': '<p>d</p>' });
  html = renderPlaybookHtml(collectPlaybook(withDesign, 'tidewell'), '2026-09-13 10:00');
  assert.ok(html.includes('<a href="design.html">Design</a>'));
});

// --- FEAT-028 — the Proof chapters ---------------------------------------------------------------
import { readDevlog, readDecisions, readHealth, firstParagraph } from '../src/playbook.js';

const EVID_FULL = `---
id: EVID-007
type: evidence
owner: "@you"
status: active
date: 2026-08-30
source: Marta K., owner of a 12-carer agency — call
method: interview
grade: observed-behavior
assumption: owners will open a phone app on a Monday morning
---

# EVID-007 — she opened the spreadsheet on speaker and read the gaps aloud

She said "every Monday I lose an hour to this" and showed the sheet — three tabs, colour-coded by hand.
`;
const DEC_OLD = `---
id: DEC-001
type: decision
owner: "@you"
decided_by: founder
status: decided
created: 2026-08-01
reversibility: reversible
revisit_by: 2026-08-20
---

# DEC-001 — Office-first rota

## Context
Owners sit at a desk.

## Decision
Build the rota for the office screen first; the phone app waits.

## Falsifier — what would prove this wrong, and by when?
If three owners ask for the phone view before September, this was wrong. Then we swap.
`;
const DEC_NEW = `---
id: DEC-002
type: decision
owner: "@you"
decided_by: ai-suggested-ratified
status: decided
created: 2026-08-25
reversibility: costly
revisit_by: 2099-01-01
supersedes: DEC-001
---

# DEC-002 — Phone-first after all

## Decision
The phone view ships first; the office screen is the same page wider.

## Falsifier
If Monday opens on phones stay under half by November, the office screen comes back.
`;
const DEVLOG = `# Devlog

## 2026-08-30
- **Landed:** the rota renders on a phone; Marta opened it on speaker.
- **Next:** cover-finding.
- **Surprises / decisions:** the office screen was the wrong bet — DEC-002.

## 2026-08-12 (first week)
- **Landed:** scaffold, canvas, two calls.
- **Next:** build the rota.
`;

test('Proof readers: devlog entries newest first with the founder\'s lines; DEC cards with falsifier, overdue and superseded; health newest by filename', () => {
  const dir = project({ ...stamp(), 'docs/devlog.md': DEVLOG, 'docs/decisions/DEC-001-office.md': DEC_OLD, 'docs/decisions/DEC-002-phone.md': DEC_NEW,
    'docs/health/HEALTH-2026-08-01.md': '# Health\n\nToo early.\n', 'docs/health/HEALTH-2026-09-01.md': '---\nid: h\n---\n# Health read\n\nEight owners; five came back the second Monday.\nPre-fit, honestly.\n\n## Verdict\n' });
  const log = readDevlog(dir);
  assert.equal(log.total, 2);
  assert.equal(log.entries[0].heading, '2026-08-30');
  assert.equal(log.entries[0].landed, 'the rota renders on a phone; Marta opened it on speaker.');
  assert.equal(log.entries[0].surprises, 'the office screen was the wrong bet — DEC-002.');
  assert.equal(log.entries[1].surprises, '');
  const decs = readDecisions(dir, Date.parse('2026-09-13'));
  assert.equal(decs[0].id, 'DEC-002', 'newest first');
  assert.equal(decs[0].title, 'Phone-first after all');
  assert.equal(decs[0].decision, 'The phone view ships first; the office screen is the same page wider.');
  assert.equal(decs[0].falsifier, 'If Monday opens on phones stay under half by November, the office screen comes back.');
  assert.equal(decs[0].overdue, false);
  assert.equal(decs[1].supersededBy, 'DEC-002');
  assert.equal(decs[1].overdue, true, 'revisit_by 2026-08-20 passed with no outcome');
  assert.equal(decs[1].falsifier, 'If three owners ask for the phone view before September, this was wrong.');
  const h = readHealth(dir);
  assert.equal(h.health.date, '2026-09-01');
  assert.equal(h.health.text, 'Eight owners; five came back the second Monday. Pre-fit, honestly.');
  assert.equal(h.measure, null);
  assert.equal(firstParagraph('---\na: b\n---\n# T\n\nfirst line\nsecond line\n\nthird para'), 'first line second line');
});

test('Evidence renders the ladder rows — id, date, grade, method, title, assumption — and never a body line or a source', () => {
  const dir = project({ ...stamp(), 'docs/ideas/IDEA-001-canvas.md': CANVAS, 'docs/evidence/EVID-007-marta.md': EVID_FULL, 'docs/evidence/EVID-001.md': EVID(1, 'stated-pain', 'Problem', '2026-08-12') });
  const html = renderPlaybookHtml(collectPlaybook(dir, 'tidewell'), '2026-09-13 10:00');
  assert.ok(html.includes('<section class="chapter" id="evidence">'));
  assert.ok(html.includes('she opened the spreadsheet on speaker and read the gaps aloud'), 'the title line');
  assert.ok(html.includes('observed-behavior') && html.includes('interview') && html.includes('owners will open a phone app on a Monday morning'));
  assert.ok(!html.includes('every Monday I lose an hour'), 'the body never renders');
  assert.ok(!html.includes('Marta K.'), 'source: never renders');
  assert.ok(html.includes('<h2>she opened the spreadsheet on speaker and read the gaps aloud</h2>'), 'the chapter line is the newest record\'s title');
  assert.match(html, /<div class="rung"><span class="g">commitment<\/span><span class="bar"><i style="width:0%"><\/i><\/span><b class="tab">0<\/b>/);
  assert.match(html, /<span class="g">observed-behavior<\/span><span class="bar"><i style="width:100%"><\/i><\/span><b class="tab">1<\/b>/);
});

test('Learnings, Decisions, Risks & harms, Health render from their records; every hole has its verb; Health is dormant, not a question', () => {
  const dir = project({ ...stamp(), 'docs/ideas/IDEA-001-canvas.md': CANVAS, 'docs/devlog.md': DEVLOG, 'docs/decisions/DEC-001-office.md': DEC_OLD, 'docs/decisions/DEC-002-phone.md': DEC_NEW, 'docs/trust/TRUST.md': '# Trust\n\nWe keep the rota and the phone numbers on it; nothing else.\n' });
  const data = collectPlaybook(dir, 'tidewell');
  const html = renderPlaybookHtml(data, '2026-09-13 10:00');
  for (const id of ['learnings', 'decisions', 'risks', 'health']) assert.ok(html.includes(`<section class="chapter" id="${id}">`), id);
  assert.ok(html.includes('<strong>Landed:</strong> the rota renders on a phone; Marta opened it on speaker.'));
  assert.ok(html.includes('<h2>the rota renders on a phone; Marta opened it on speaker.</h2>'));
  assert.ok(html.includes('class="block filled superseded" id="dec-001"'), 'DEC-001 is superseded');
  assert.ok(html.includes('superseded by DEC-002') && html.includes('overdue · revisit 2026-08-20'));
  assert.ok(html.includes('<strong>Falsifier —</strong> If Monday opens on phones stay under half by November'));
  assert.ok(html.includes('<h2>The phone view ships first; the office screen is the same page wider.</h2>'));
  assert.ok(html.includes('We keep the rota and the phone numbers on it; nothing else.'));
  assert.ok(html.includes('id="health-dormant"') && html.includes('dormant — live once there are users to read'));
  assert.ok(!data.questions.some((q) => q.id === 'health-dormant'), 'dormant is not a question');
  // the empty state: every proof chapter a hole with its verb, the rail marking it
  const bare = project({ ...stamp(), 'docs/ideas/IDEA-001-canvas.md': CANVAS });
  const d2 = collectPlaybook(bare, 'tidewell');
  const h2 = renderPlaybookHtml(d2, '2026-09-13 10:00');
  for (const [id, verb] of [['evidence-none', '/evidence'], ['learnings-none', '/log'], ['decisions-none', '/decide'], ['risks-trust', '/trust']]) {
    assert.ok(h2.includes(`id="${id}"`), id);
    assert.ok(d2.questions.some((q) => q.id === id && q.verb === verb), `${id} → ${verb}`);
  }
  assert.match(h2, /<a href="#evidence" class="hole-link">/, 'the rail marks an empty chapter');
  assert.doesNotMatch(h2, /<a href="#health" class="hole-link">/, 'dormant is not empty');
  assert.equal((h2.match(/<section class="chapter"/g) || []).length, 16);
});

test('Learnings merges the devlog with the IDEA capture logs by date (Ajesh, 2026-09-13); the source README is not an imported source; the URL prints', () => {
  const idea = IDEA.replace('- 2026-08-04 — seed', '- 2026-08-04 — seed\n- 2026-08-20 — first thought: owners lose Monday to the rota.\n- 2026-09-01 — Marta said she would pay for cover-finding.');
  const dir = project({ ...stamp(), 'docs/ideas/IDEA-001-tidewell.md': idea, 'docs/ideas/IDEA-001-canvas.md': CANVAS, 'docs/devlog.md': DEVLOG, 'docs/source/README.md': '# Source\n\ndrop anything here\n' });
  const data = collectPlaybook(dir, 'tidewell');
  assert.deepEqual(data.devlog.entries.map((e) => e.date), ['2026-09-01', '2026-08-30', '2026-08-20', '2026-08-12', '2026-08-04']);
  assert.equal(data.devlog.entries[0].source, 'docs/ideas/IDEA-001-tidewell.md');
  assert.equal(data.devlog.entries[0].landed, 'Marta said she would pay for cover-finding.');
  const html = renderPlaybookHtml(data, '2026-09-13 10:00');
  assert.ok(html.includes('<h2>Marta said she would pay for cover-finding.</h2>'), 'the newest entry\'s line, from the capture log');
  assert.ok(html.includes('2026-09-01 · IDEA-001'));
  assert.equal(data.sources.length, 0, 'the folder README is not a source');
  assert.ok(html.includes('id="market-sources"'), 'Market still renders the import hole');
  const out = execFileSync('node', [BIN, 'playbook'], { cwd: dir, encoding: 'utf8' });
  assert.match(out, /bookmark: file:\/\/.*\/\.boss\/playbook\.html/);
});

// --- FEAT-036 — the Company chapters -------------------------------------------------------------
import { readTeam, readBrandDoc, readPhoto } from '../src/playbook.js';
import { writePersonStub } from '../src/team.js';

const PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64');
const PERSON = (name, role, photo = 'unknown') => `---
id: person
type: person
name: ${name}
handle: "@${name.toLowerCase()}"
role: ${role}
photo: ${photo}
status: active
---

# ${name} — ${role}

## The specific thing
Ran a 12-carer agency for six years and did the Monday rota by hand every week.

## What they bring, and don't
- **Brings:** the owners' trust; the rota in her head.
- **Doesn't:** code.

## Bio
Marta owned Tidewell Care until 2025.
`;
const BRAND_DOC = `---
id: brand
type: brand
status: nascent
updated: 2026-09-01
tagline: Cover found before the kettle boils
accent: "#2F5D8A"
logo: unknown
---

# Brand — Tidewell

## Current shape

- **Who it's for:** owner-operators with 3 to 15 carers
- **What it promises:** cover found before the kettle boils
- **What it refuses:** it will not rank carers against each other.
- **How it sounds:** <2–3 traits>
- **What it is NOT:** agency software. A marketplace.
- **The name, and why:** unknown

## How we build

- **Owners first** — every screen is designed at the owner's desk on a Monday, not in a demo. *Costs:* the carer app is plainer than it could be.
- **No league tables** — we never rank people. *Costs:* some owners ask for it and leave.
- **<headline>** — <what it means>. *Costs:* <what you give up>.

## What we've learned (append-only — never rewrite a row)

| Date | What happened | What it says about the brand |
|---|---|---|
| 2026-08-30 | Marta called it "the thing that finds cover" | the verb is the brand |
| | a word that landed | |
`;

test('Team: person files read with role order, sections and a photo only from a file; the stub is written once by boss team add', () => {
  const dir = project({ ...stamp(), 'docs/team/marta.md': PERSON('Marta', 'founder', './marta.png'), 'docs/team/marta.png': PNG, 'docs/team/dev.md': PERSON('Dev', 'advisor'), 'docs/team/README.md': '# Team\n' });
  const team = readTeam(dir);
  assert.deepEqual(team.map((p) => p.role), ['founder', 'advisor']);
  assert.equal(team[0].thing, 'Ran a 12-carer agency for six years and did the Monday rota by hand every week.');
  assert.match(team[0].photo.dataUri, /^data:image\/png;base64,/);
  assert.equal(team[1].photo, null, 'unknown → no photo, no placeholder');
  assert.deepEqual(readPhoto(join(dir, 'docs', 'team'), './nope.jpg'), { file: './nope.jpg', missing: true });
  const r = writePersonStub(dir, 'sam', 'Sam Lee');
  assert.equal(r.written, true);
  assert.ok(readFileSync(r.file, 'utf8').includes('handle: "@sam"'));
  assert.equal(writePersonStub(dir, 'marta', 'X').written, false, 'never overwrites');
  assert.ok(readFileSync(join(dir, 'docs/team/marta.md'), 'utf8').includes('Marta owned Tidewell'));
});

test('Company chapters: Team cards with the face inlined, who-is-missing as a hole; Brand as the doc holds it, never a learned row\'s words; Values from How we build', () => {
  const dir = project({ ...stamp(), 'docs/ideas/IDEA-001-canvas.md': CANVAS, 'docs/team/marta.md': PERSON('Marta', 'founder', './marta.png'), 'docs/team/marta.png': PNG, 'docs/BRAND.md': BRAND_DOC, '.boss/design.html': '<p>d</p>' });
  const data = collectPlaybook(dir, 'tidewell');
  const html = renderPlaybookHtml(data, '2026-09-13 10:00');
  for (const id of ['team', 'brand', 'values']) assert.ok(html.includes(`<section class="chapter" id="${id}">`), id);
  assert.equal((html.match(/<section class="chapter"/g) || []).length, 16);
  assert.ok(html.includes('id="person-marta"') && html.includes('<img class="face" src="data:image/png;base64,'));
  assert.ok(html.includes('id="team-missing"') && data.questions.some((q) => q.id === 'team-missing'));
  assert.ok(html.includes('<h2>Ran a 12-carer agency for six years and did the Monday rota by hand every week.</h2>'));
  // brand
  assert.ok(html.includes('<dt>What it refuses</dt><dd>it will not rank carers against each other.</dd>'));
  assert.ok(html.includes('<dt>How it sounds</dt><dd><em class="hole-text">unknown</em></dd>'), 'a template placeholder renders unknown');
  assert.ok(html.includes('4 of 6 known'));
  assert.ok(html.includes('<code>#2F5D8A</code> accent') && html.includes('<p class="specimen">Cover found before the kettle boils</p>'));
  assert.ok(html.includes('<b class="tab">1</b> thing that actually happened, newest 2026-08-30'));
  assert.ok(!html.includes('the thing that finds cover'), 'a learned row\'s words never render');
  assert.ok(html.includes('href="design.html">tokens and type, in Design'));
  assert.ok(html.includes('<h2>it will not rank carers against each other.</h2>'));
  // values
  assert.equal(data.brandDoc.values.length, 2, 'the template placeholder bullet is not a value');
  assert.ok(html.includes('data-title="Owners first"') && html.includes('the carer app is plainer than it could be'));
  assert.ok(html.includes('<h2>Owners first</h2>'));
  // empty state
  const bare = project({ ...stamp(), 'docs/ideas/IDEA-001-canvas.md': CANVAS });
  const d2 = collectPlaybook(bare, 'tidewell'); const h2 = renderPlaybookHtml(d2, '2026-09-13 10:00');
  for (const id of ['team-none', 'brand-none', 'values-none']) assert.ok(h2.includes(`id="${id}"`) && d2.questions.some((q) => q.id === id), id);
  assert.match(h2, /<a href="#team" class="hole-link">/);
  // Vision repeats Team's hole on the page; the list names "who is building it" once, the Team chapter's (IDEA-118)
  assert.ok(h2.includes('id="vision-team"'));
  assert.equal(d2.questions.filter((q) => q.title === 'Who is building it').length, 1);
  assert.ok(!d2.questions.some((q) => q.id === 'vision-team'));
});

// --- IDEA-118 — day 0 -----------------------------------------------------------------------------
test('day 0: with no IDEA doc the venture holes point at /boss (the verb that writes the record; /idea asks nothing), /boss leads the order, and the terminal collapses to one sentence', () => {
  const dir = project({ ...stamp(), '.claude/skills/boss/SKILL.md': '# boss', '.claude/skills/idea/SKILL.md': '# idea', '.claude/skills/canvas/SKILL.md': '# canvas' });
  const data = collectPlaybook(dir, 'tidewell');
  const html = renderPlaybookHtml(data, '2026-09-13 10:00');
  for (const id of ['vision-why', 'vision-few-years', 'product-shape']) {
    const q = data.questions.find((x) => x.id === id);
    assert.ok(q && q.line === '/boss <your idea>', `${id} → /boss`);
  }
  assert.ok(!data.questions.some((q) => q.line === '/idea'), 'nothing points at /idea before the record exists');
  assert.equal(data.questions[0].line, '/boss <your idea>');
  assert.ok(html.includes('open · start: /boss &lt;your idea&gt;</div>'));
  const out = execFileSync('node', [BIN, 'playbook'], { cwd: dir, encoding: 'utf8' });
  assert.match(out, /nothing to read yet — `\/boss <your idea>` starts it; the page holds the \d+ questions/);
  assert.doesNotMatch(out, /questions open ·/);
  // once the venture record exists, the same holes point at /idea — edit the record you have
  const later = project({ ...stamp(), 'docs/ideas/IDEA-001-app.md': IDEA.replace('motivation: own-problem\n', 'kind: venture\n').replace(/success_looks_like: .*\n/, ''), '.claude/skills/idea/SKILL.md': '# idea' });
  const d2 = collectPlaybook(later, 'tidewell'); renderPlaybookHtml(d2, '2026-09-13 10:00');
  assert.equal(d2.questions.find((x) => x.id === 'vision-why').line, '/idea');
  const out2 = execFileSync('node', [BIN, 'playbook'], { cwd: later, encoding: 'utf8' });
  assert.match(out2, /\d+ questions open ·/);
});

test('a person stub\'s placeholders never render — only what the person wrote', () => {
  const dir = project({ ...stamp(), 'docs/ideas/IDEA-001-canvas.md': CANVAS });
  writePersonStub(dir, 'sam', 'Sam Lee');
  const html = renderPlaybookHtml(collectPlaybook(dir, 'tidewell'), '2026-09-13 10:00');
  assert.ok(html.includes('id="person-sam"') && html.includes('the specific thing — not written yet'));
  assert.ok(!html.includes('two or three things') && !html.includes('&lt;the gap'));
});

test('the two new IDEA fields (Ajesh, 2026-09-13): in_a_few_years renders under Vision, prior_capital beside the ask; `none` is an answer, `unset` is a hole', () => {
  const withBoth = IDEA.replace('motivation: own-problem', 'motivation: own-problem\nin_a_few_years: "every small agency in the county runs its Monday on this"\nprior_capital: none');
  const dir = project({ ...stamp(), 'docs/ideas/IDEA-001-tidewell.md': withBoth, 'docs/ideas/IDEA-001-canvas.md': CANVAS });
  const html = renderPlaybookHtml(collectPlaybook(dir, 'tidewell'), '2026-09-13 10:00');
  assert.ok(html.includes('id="vision-few-years"') && html.includes('every small agency in the county runs its Monday on this'));
  assert.ok(html.includes('id="model-capital"') && html.includes('<p>none</p>'), 'none is a fact, not a hole');
  const bare = project({ ...stamp(), 'docs/ideas/IDEA-001-tidewell.md': IDEA, 'docs/ideas/IDEA-001-canvas.md': CANVAS });
  const d2 = collectPlaybook(bare, 'tidewell'); const h2 = renderPlaybookHtml(d2, '2026-09-13 10:00');
  assert.ok(d2.questions.some((q) => q.id === 'vision-few-years') && d2.questions.some((q) => q.id === 'model-capital'));
  assert.ok(h2.includes('add in_a_few_years: to the IDEA doc'));
});

test('the ask reads the dossier the shipped capital mentor writes (business-<date>.md), newest by name; the older mentor-capital.md still counts', () => {
  const dir = project({ ...stamp(), 'docs/ideas/IDEA-001-canvas.md': CANVAS, 'docs/dossier/business-2026-08-01.md': '# Capital\n\nOld position.\n', 'docs/dossier/business-2026-09-01.md': '# Capital\n\nNot yet — the first observed-behaviour signal reopens this.\n' });
  const html = renderPlaybookHtml(collectPlaybook(dir, 'tidewell'), '2026-09-13 10:00');
  assert.ok(html.includes('Not yet — the first observed-behaviour signal reopens this.') && !html.includes('Old position.'));
  assert.ok(html.includes('docs/dossier/business-2026-09-01.md'));
});

test('the BMC frame: seven cells with a BMC home carry their Osterwalder name and area; Problem, Story and Metrics have none and hide; the floor stays', () => {
  const dir = project({ ...stamp(), 'docs/ideas/IDEA-001-canvas.md': CANVAS });
  const html = renderPlaybookHtml(collectPlaybook(dir, 'tidewell'), '2026-09-13 10:00');
  assert.ok(html.includes('data-frame="bmc" aria-pressed="false">BMC</button>'));
  for (const name of ['Customer segments', 'Value propositions', 'Customer relationships', 'Revenue streams', 'Cost structure', 'Key activities · Key resources', 'Key partnerships']) assert.ok(html.includes(`<span class="t-bmc">${name}</span>`), name);
  assert.equal(CELLS.filter((c) => c.bmc).length, 7);
  for (const key of ['problem', 'story', 'metrics', 'buildbuy']) assert.match(html, new RegExp(`class="block [^"]*no-bmc[^"]*" id="canvas-${key}"`), `${key} hides in BMC`);
  assert.match(html, /class="block [^"]*floor[^"]*" id="canvas-risks"/);
  assert.ok(html.includes('--bmc-area:1 / 1 / 3 / 2;'), 'Key partnerships top-left');
  assert.ok(html.includes('Business Model Canvas · Alexander Osterwalder'));
});

// --- FEAT-029 — the deck -------------------------------------------------------------------------
import { deckCuts } from '../src/playbook.js';

test('deck cuts: Everything is every block in page order; Internal has no hole, no dormant, no chapter-duplicated cell; the VC cut omits a 100% synthetic persona and keeps a real one', () => {
  const synthetic = PERSONA.replace(/synthetic\s*\d+%\s*·\s*real\s*\d+%/, 'synthetic 100% · real 0%').replace(/^name:.*$/m, 'name: Priya');
  const dir = project({ ...stamp(), 'docs/ideas/IDEA-001-tidewell.md': IDEA, 'docs/ideas/IDEA-001-canvas.md': CANVAS, 'docs/personas/dee.md': PERSONA, 'docs/personas/priya.md': synthetic, 'docs/evidence/EVID-001.md': EVID(1, 'stated-pain', 'Problem', '2026-08-12'), 'docs/team/marta.md': PERSON('Marta', 'founder') });
  const data = collectPlaybook(dir, 'tidewell');
  const html = renderPlaybookHtml(data, '2026-09-13 10:00');
  const { all, internal, vc } = data.cuts;
  const pageIds = [...html.matchAll(/<article class="([^"]*)" id="([^"]+)"/g)].filter((m) => !/pointer/.test(m[1])).map((m) => m[2]);
  assert.deepEqual(all, pageIds, 'Everything = every block, page order');
  const holes = new Set([...html.matchAll(/<article class="[^"]*\b(?:hole|dormant)\b[^"]*" id="([^"]+)"/g)].map((m) => m[1]));
  assert.ok(internal.every((id) => !holes.has(id)), 'Internal has no hole or dormant');
  assert.ok(!internal.includes('canvas-problem') && internal.includes('canvas-modes'), 'a chapter-rendered cell leaves the grid; a grid-only cell stays');
  assert.ok(vc.includes('persona-dee') && !vc.includes('persona-priya'), 'the synthetic persona is on the page and off the VC cut');
  assert.ok(html.includes('id="persona-priya"'));
  assert.ok(vc.includes('evidence-ladder') && vc.includes('person-marta') && vc.includes('risks-harms'));
  assert.ok(!vc.includes('canvas-modes') && !vc.includes('learn-1'), 'no grid cell, no devlog entry in the VC cut');
  assert.ok(vc.every((id) => all.indexOf(id) >= 0) && vc.slice(1).every((id, i) => all.indexOf(id) > all.indexOf(vc[i])), 'VC in page order');
  // the page carries the bar, the counts, the print sheet, the browser-only removal store
  assert.ok(html.includes('id="present"') && html.includes(`<b class="tab n-vc">${vc.length}</b>`) && html.includes('>All <b class="tab n-all">'));
  assert.ok(html.includes('function filterPage()') && html.includes("b.hidden = !inCut.has(b.id)"), 'the cut filters the page');
  assert.ok(html.includes("const KEY = 'boss-playbook-' + BRAND") && html.includes("store.set('removed-' + cut, r)"), 'removals live in localStorage, keyed by project');
  assert.ok(html.includes('.printdeck { display: block; }') && html.includes('.topbar, .shell, footer.site, .deck, .sheet, .valmenu { display: none !important; }'), 'print shows the cut only');
  assert.ok(html.includes('page-break-after: always') && html.includes('@page { size: landscape; margin: 0; }'));
  assert.ok(html.includes('class="remove" title="Take this slide out of the current cut'));
  assert.ok(!/addEventListener\('load'|DOMContentLoaded.*openDeck|openDeck\(0\);\s*$/m.test(html), 'Present opens on click only');
});
