// FEAT-026 — the playbook render, slice 1: the canvas as boxes.
//
// Every test here is an acceptance criterion from the FEAT record, phrased so a reader who has
// never seen src/playbook.js could check it against the page. The three rules the module
// claims (no composed words · a hole is a hole · numbers are counted) are each held by a test.

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { project, cleanup } from './helpers.js';
import { CELLS, parseCanvas, collectPlaybook, renderPlaybookHtml, playbookHtml, inline, readBrand } from '../src/playbook.js';

after(cleanup);

const ROOT = new URL('..', import.meta.url).pathname;
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
  assert.ok(html.includes("Two questions this canvas asks that Lean doesn't"));
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

test('single-file: nothing is fetched — no external script, stylesheet, font or image request', () => {
  const dir = project({ ...stamp(), 'docs/ideas/IDEA-001-canvas.md': CANVAS });
  playbookHtml(dir, 'tidewell');
  const html = readFileSync(join(dir, '.boss', 'playbook.html'), 'utf8');
  assert.doesNotMatch(html, /<link\b/i);
  assert.doesNotMatch(html, /<script[^>]+src=/i);
  assert.doesNotMatch(html, /@import|url\(/i);
  assert.doesNotMatch(html, /<img\b/i);
});

test('brand: BRAND.md accent and tagline apply; unknown falls back per field; no BRAND.md is nascent', () => {
  const branded = project({ ...stamp(), 'docs/BRAND.md': '---\nid: brand\nstatus: nascent\naccent: "#1B7F79"\ntagline: Calm on Sunday.\n---\n# Brand\n' });
  const b = readBrand(branded, 'tidewell');
  assert.equal(b.accent, '#1B7F79'); assert.equal(b.tagline, 'Calm on Sunday.'); assert.equal(b.nascent, true);
  const unknown = project({ ...stamp(), 'docs/BRAND.md': '---\nid: brand\naccent: unknown\ntagline: unknown\n---\n' });
  const u = readBrand(unknown, 'tidewell');
  assert.equal(u.accent, null, 'unknown is not a colour'); assert.equal(u.tagline, null);
  const html = renderPlaybookHtml(collectPlaybook(unknown, 'tidewell'), '2026-09-13 10:00');
  assert.ok(html.includes('--accent: #16181A'), 'no accent → monochrome, never an invented hue');
  assert.ok(html.includes('accent unknown → default'));
  const none = renderPlaybookHtml(collectPlaybook(project(stamp()), 'tidewell'), '2026-09-13 10:00');
  assert.ok(none.includes('brand: nascent — no docs/BRAND.md yet'));
});

test('first run: no canvas → every cell is a hole with its prompt, the ledger reads 0 of N, exit 0', () => {
  const dir = project(stamp());
  const out = execFileSync('node', [BIN, 'playbook'], { cwd: dir, encoding: 'utf8' });
  assert.match(out, /no canvas yet/);
  const html = readFileSync(join(dir, '.boss', 'playbook.html'), 'utf8');
  assert.equal((html.match(/class="block hole/g) || []).length, CELLS.length);
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
