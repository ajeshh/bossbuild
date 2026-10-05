// The home — .boss/index.html, the one page to bookmark (IDEA-144).

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { homeHtml, homeUrl } from '../src/home.js';
import { familyBar } from '../src/page-shell.js';
import { boardHtml } from '../src/board.js';
import { project, cleanup, idea } from './helpers.js';

after(cleanup);

test('a page that exists is a link with its date; one that does not is a hole naming its command', () => {
  const dir = project({ 'docs/ideas/IDEA-001.md': idea('IDEA-001') });
  boardHtml(dir, 'demo');
  const out = homeHtml(dir, 'demo');
  assert.equal(out, join(dir, '.boss', 'index.html'));
  const html = readFileSync(out, 'utf8');
  assert.match(html, /<a class="block card" href="board.html">/);
  assert.match(html, /class="age" data-made="\d{4}-\d\d-\d\dT/);
  assert.match(html, /not made yet: boss playbook/);
  assert.match(html, /not made yet: boss help --html/);
  assert.ok(!html.includes('href="playbook.html"'), 'no link to a page that is not on disk');
});

test('the bookmark hint hides on Done and survives a browser with no storage', () => {
  const html = readFileSync(homeHtml(project({}), 'demo'), 'utf8');
  assert.match(html, /id="done"/);
  assert.match(html, /try \{ if \(localStorage\.getItem/);
  assert.match(html, /try \{ localStorage\.setItem/);
});

test('the bookmark is a file:// URL a browser opens', () => {
  const dir = project({});
  assert.match(homeUrl(dir), /^file:\/\/\/.*\/\.boss\/index\.html$/);
});

test('the family bar leads with Home and dims a page not generated yet, Guide included', () => {
  const dir = project({});
  const bar = familyBar(dir, 'playbook');
  assert.match(bar, /^<nav[^>]*><a href="index.html" data-space="home">Home<\/a>/);
  assert.match(bar, /class="dim"[^>]*title="not generated yet — boss help --html" data-space="guide">Guide/);
  assert.ok(!existsSync(join(dir, '.boss', 'help.html')));
});
