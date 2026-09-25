// The "I want to…" map in `boss help --html` (src/help-html.js wayfindingHtml).
//
// The map's tokens are `/skill`, `@agent` or `boss cmd` (src/help.js). From v0.275.0 the renderer
// still treated every token as a bare skill name, so every row printed `//boss`, `/@mentor-…`,
// `/boss status` and "— at undefined", installed or not. Reproduced 2026-09-25 in a fresh
// Quickstart project; this pins the three kinds against the stamp.

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { helpHtml } from '../src/help-html.js';
import { project, cleanup } from './helpers.js';

after(cleanup);

const quickstart = {
  name: 'demo', stage: 'L0-quickstart', installedLayers: ['L0-quickstart'],
  skills: ['welcome', 'boss', 'import', 'idea'], agents: ['product-lead', 'coder', 'mentor-founder'],
};

function want(html, intent) {
  const row = html.split('<div><span class="q">…').find((r) => r.startsWith(intent));
  assert.ok(row, `no "I want to…" row starting "${intent}"`);
  return row;
}

test('help --html: no token renders doubled, prefixed wrong or at an undefined rung', () => {
  const html = readFileSync(helpHtml(project(), quickstart), 'utf8');
  const start = html.indexOf('<div class="want">');
  const map = html.slice(start, html.indexOf('</section>', start));
  assert.doesNotMatch(map, /at undefined/);
  assert.doesNotMatch(map, /<code>\/\//);
  assert.doesNotMatch(map, /<code>\/(@|boss )/);
});

test('help --html: installed skills are yours, commands always are, the rest name their rung', () => {
  const html = readFileSync(helpHtml(project(), quickstart), 'utf8');
  const idea = want(html, 'get an idea out of my head');
  assert.match(idea, /<span class="a"><code>\/boss<\/code> · <code>\/idea<\/code> · <code>\/import<\/code><\/span>/);
  const resume = want(html, 'pick up where I left off');
  assert.doesNotMatch(resume, /class="soon"/, 'a boss command works in every mode');
  const mcp = want(html, 'hook my tools up to the AI');
  assert.match(mcp, /<code>boss craft mcp<\/code>/);
  assert.match(mcp, /class="soon"><code>@mentor-architect<\/code> — at MVP/);
});
