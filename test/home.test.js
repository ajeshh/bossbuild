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

test('where things live lists only the folders and key files on disk, each with Open and Copy path', () => {
  const dir = project({ 'docs/ideas/IDEA-001.md': idea('IDEA-001'), 'docs/ideas/IDEA-002.md': idea('IDEA-002'), 'docs/RESUME.md': '# r\n' });
  const html = readFileSync(homeHtml(dir, 'demo'), 'utf8');
  assert.match(html, /id="where-things-live"/);
  assert.match(html, /<code>docs\/ideas\/<\/code><\/a> <span class="pl-meta">2 files · \/idea/);
  assert.ok(html.includes(`data-path="${join(dir, 'docs', 'ideas')}"`), 'Copy path carries the OS path, not a URL');
  assert.match(html, /href="file:\/\/\/[^"]*\/docs\/ideas\/"/);
  assert.match(html, /<code>docs\/RESUME\.md<\/code>/);
  assert.ok(!html.includes('docs/evidence/'), 'a folder not on disk is not listed');
  assert.ok(!html.includes('CLAUDE.md</code>'), 'a key file not on disk is not listed');
});

test('a bare project lists only .boss/ — the folder the home itself lives in — and no empty group', () => {
  const html = readFileSync(homeHtml(project({}), 'demo'), 'utf8');
  assert.match(html, /<code>\.boss\/<\/code>/);
  assert.equal((html.match(/class="label pl-group"/g) || []).length, 1, 'only the machine group');
});

test('the board leads the spaces: it is the page opened most', () => {
  assert.match(familyBar(project({}), 'home'), /data-space="home">Home<\/a><a [^>]*data-space="board"/);
});

test('a page is out of date when a file it reads changed after it was made — and names the newest', async () => {
  const { utimesSync } = await import('node:fs');
  const dir = project({ 'docs/ideas/IDEA-001.md': idea('IDEA-001'), 'docs/design/tokens.json': '{}' });
  const old = new Date(Date.now() - 3 * 86400000);
  utimesSync(join(dir, 'docs/ideas/IDEA-001.md'), old, old);
  utimesSync(join(dir, 'docs/design/tokens.json'), old, old);
  boardHtml(dir, 'demo');
  let html = readFileSync(homeHtml(dir, 'demo'), 'utf8');
  assert.match(html, /nothing changed since/, 'fresh right after it was made');
  const later = new Date(Date.now() + 60000);
  utimesSync(join(dir, 'docs/ideas/IDEA-001.md'), later, later);
  utimesSync(join(dir, 'docs/design/tokens.json'), later, later);   // the board does not read docs/design
  html = readFileSync(homeHtml(dir, 'demo'), 'utf8');
  assert.match(html, /out of date: 1 file changed since/);
  assert.match(html, /newest change: docs\/ideas\/IDEA-001\.md · boss board --html to refresh/);
});

test('the home says when it checked, so an old home never reads as a current "up to date"', () => {
  const html = readFileSync(homeHtml(project({}), 'demo'), 'utf8');
  assert.match(html, /<span class="checked" data-made="\d{4}-\d\d-\d\dT[^"]+">checked /);
});
