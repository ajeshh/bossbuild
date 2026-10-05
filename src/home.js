// home — `.boss/index.html`, the one page to bookmark (IDEA-144).
//
// The generated pages live in `.boss/`, a dot-folder Finder hides, and each was its own link: a
// founder who closed the tab had to know the folder existed to find it again. The folder was never
// the problem — the missing front page was. So every command that writes a page writes this one
// with it, and prints it as the bookmark.
//
// It lists each page with WHEN it was made, never whether it is still right: age is a fact this file
// can read (the file's own date); staleness would need each page's sources, and a guess here would
// be the flattery the playbook refuses. The age is computed in the viewer's browser from the stamped
// date, so a page opened a month later says a month, not "today".
//
// The bookmark hint can't vanish on its own when the page is bookmarked — no browser tells a page
// that. It has a Done button, remembered in the browser; with no storage (some browsers give a
// file:// page none) the hint simply shows again, never an error.

import { existsSync, mkdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { esc, shellCss, familyBar, SPACES, DEFAULT_ACCENT } from './page-shell.js';
import { readBrand } from './playbook.js';
import { isoDay, isoMinute } from './clock.js';

// What each page is, in a line — the card's body. `boss help playbook` has the long form.
const WHAT = {
  playbook: 'Your venture as one page: the pitch, the canvas as boxes, the proof behind each answer, every gap shown as a gap.',
  design: 'Your design system: tokens, type, components and patterns, with contrast computed and the decision behind each value.',
  board: 'Every idea and feature by where it stands: captured, taking shape, building, shipped, parked.',
  guide: 'Everything this project has and why: the skills and commands you can run right now.',
};

// The home's path, and the file:// form a browser opens — the one line every page command prints.
export function homePath(projectDir) { return join(projectDir, '.boss', 'index.html'); }
export function homeUrl(projectDir) { return pathToFileURL(homePath(projectDir)).href; }

export function collectHome(projectDir) {
  return SPACES.map((s) => {
    const p = join(projectDir, '.boss', s.file);
    let made = null;
    try { made = statSync(p).mtime; } catch { /* not generated yet */ }
    return { ...s, what: WHAT[s.key] || '', made };
  });
}

export function renderHomeHtml(projectDir, projectName, spaces, stampedAt) {
  const brand = readBrand(projectDir, projectName);
  const cards = spaces.map((s) => s.made
    ? `<a class="block card" href="${esc(s.file)}">
    <div class="head"><h3>${esc(s.label)}</h3></div>
    <div class="body"><p>${esc(s.what)}</p></div>
    <div class="foot"><span class="age" data-made="${s.made.toISOString()}">made ${esc(isoDay(s.made))}</span><span class="src">${esc(s.cmd)} to refresh</span></div>
  </a>`
    : `<div class="block card hole">
    <div class="head"><h3>${esc(s.label)}</h3></div>
    <div class="body"><p>${esc(s.what)}</p><span class="verb">not made yet: ${esc(s.cmd)}</span></div>
  </div>`).join('\n  ');
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(brand.name)} — Home</title>
<style>${shellCss(brand.accent || DEFAULT_ACCENT)}
  .home { max-width: 980px; margin: 0 auto; padding: 40px 20px 24px; }
  .home h1 { font-family: var(--display); font-size: 34px; line-height: 1.12; letter-spacing: -.01em; }
  .home .lede { margin-top: 10px; color: var(--ink-2); max-width: 60ch; }
  .mark { display: flex; flex-wrap: wrap; align-items: center; gap: 10px 16px; margin-top: 24px; padding: 12px 16px; background: var(--accent-soft); border: 1px solid var(--rule); border-radius: 8px; font-size: 14.5px; }
  .mark p { flex: 1 1 320px; } .mark kbd { font-family: var(--mono); font-size: 12px; padding: 1px 6px; border: 1px solid var(--rule); border-bottom-width: 2px; border-radius: 4px; background: var(--paper); }
  .mark button { padding: 5px 12px; border: 1px solid var(--rule); border-radius: 5px; background: var(--paper); font-size: 13px; color: var(--ink-2); } .mark button:hover { border-color: var(--accent); color: var(--ink); }
  .mark[hidden] { display: none; }
  .home .blocks { margin-top: 28px; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); }
  a.card { text-decoration: none; color: inherit; } a.card:hover { border-color: var(--accent); } a.card h3 { font-size: 16px; color: var(--accent); }
  .card.hole h3 { color: var(--hole); }
  .age.old { color: var(--stale); }
  .home .where { margin-top: 28px; font-family: var(--mono); font-size: 11px; color: var(--muted); line-height: 1.7; overflow-wrap: anywhere; }
</style>
</head>
<body>
<header class="topbar">
  <div class="wordmark">${esc(brand.name)}${brand.tagline ? `<span class="tag">${esc(brand.tagline)}</span>` : ''}</div>
  ${familyBar(projectDir, 'home')}
</header>
<main class="home">
  <h1>Everything BOSS has made for ${esc(brand.name)}</h1>
  <p class="lede">Each page is a read of your project's files. A command rewrites its page, and this one with it, so this list is never out of date. The pages themselves can be: each card says when it was made.</p>
  <aside class="mark" id="mark" aria-label="Bookmark this page">
    <p><b>Bookmark this page.</b> It's the one link to all of them. Press <kbd id="key">Ctrl+D</kbd>. The folder it lives in, <code>.boss/</code>, starts with a dot, so Finder and most file browsers hide it: the bookmark is the easy way back.</p>
    <button type="button" id="done">Done, hide this</button>
  </aside>
  <div class="blocks">
  ${cards}
  </div>
  <p class="where">${esc(homeUrl(projectDir))}<br>generated ${esc(stampedAt)} · re-run any page command to refresh</p>
</main>
<script>
(function () {
  var KEY = 'boss-home-bookmarked';
  var mark = document.getElementById('mark');
  try { if (localStorage.getItem(KEY)) mark.hidden = true; } catch (e) { /* no storage: the hint stays */ }
  document.getElementById('done').addEventListener('click', function () {
    mark.hidden = true;
    try { localStorage.setItem(KEY, '1'); } catch (e) { /* hidden for this visit only */ }
  });
  if (/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)) document.getElementById('key').textContent = '\\u2318D';
  var day = 864e5, now = Date.now();
  Array.prototype.forEach.call(document.querySelectorAll('.age[data-made]'), function (el) {
    var t = Date.parse(el.getAttribute('data-made')); if (isNaN(t)) return;
    var d = Math.floor((now - t) / day);
    el.textContent = d < 1 ? 'made today' : d === 1 ? 'made yesterday' : 'made ' + d + ' days ago';
    if (d >= 14) el.classList.add('old');
  });
})();
</script>
</body>
</html>
`;
}

// Write the home and return its path. Called after each page is written, so the card for the page
// just made says "today".
export function homeHtml(projectDir, projectName) {
  const dir = join(projectDir, '.boss');
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  const out = homePath(projectDir);
  writeFileSync(out, renderHomeHtml(projectDir, projectName, collectHome(projectDir), isoMinute()));
  return out;
}
