// home — `.boss/index.html`, the one page to bookmark (IDEA-144): the generated pages, then where
// every record lives.
//
// The generated pages live in `.boss/`, a dot-folder Finder hides, and each was its own link: a
// founder who closed the tab had to know the folder existed to find it again. The folder was never
// the problem — the missing front page was. So every command that writes a page writes this one
// with it, and prints it as the bookmark.
//
// It lists each page with when it was made and whether it is out of date: a page is out of date when
// a file it reads (SPACES[].reads) changed after the page was written — file dates, both sides, no
// guessing. That check is as old as this file: nothing rewrites the home between page commands, so
// the page says when it checked, and the ages are computed in the viewer's browser from stamped
// dates — a home opened a month later says "checked a month ago", never a stale "up to date".
//
// The bookmark hint can't vanish on its own when the page is bookmarked — no browser tells a page
// that. It has a Done button, remembered in the browser; with no storage (some browsers give a
// file:// page none) the hint simply shows again, never an error.

import { existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { esc, shellCss, familyBar, SPACES, DEFAULT_ACCENT } from './page-shell.js';
import { readBrand } from './playbook.js';
import { isoDay, isoMinute } from './clock.js';
import { GROUPS, WRITES, KEY_FILES } from './places.js';

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

// The files under `reads` changed after `since`: how many, and the newest. Dot-entries below the
// roots are skipped (.DS_Store, an editor's swap files), and so is anything in .boss — the pages
// themselves live there.
export function changedSince(projectDir, reads, since) {
  let count = 0; let newest = null;
  const visit = (abs, rel, depth) => {
    let st; try { st = statSync(abs); } catch { return; }
    if (st.isDirectory()) {
      let names = []; try { names = readdirSync(abs); } catch { return; }
      for (const n of names) if (!n.startsWith('.') && n !== 'node_modules') visit(join(abs, n), `${rel}/${n}`, depth + 1);
    } else if (st.mtime > since) {
      count++;
      if (!newest || st.mtime > newest.mtime) newest = { rel, mtime: st.mtime };
    }
  };
  for (const r of reads || []) if (!r.startsWith('.boss')) visit(join(projectDir, r), r, 0);
  return { count, newest: newest && newest.rel };
}

export function collectHome(projectDir) {
  return SPACES.map((s) => {
    const p = join(projectDir, '.boss', s.file);
    let made = null;
    try { made = statSync(p).mtime; } catch { /* not generated yet */ }
    return { ...s, what: WHAT[s.key] || '', made, changed: made ? changedSince(projectDir, s.reads, made) : null };
  });
}

// Where things live — the folders and key files that are on disk, each with what it holds and how
// to reach it. A web page cannot open Finder or Explorer, so each row has Open (the browser: Chrome
// and Firefox list a folder; Safari won't) and Copy path (for the file browser or a terminal).
// Never a typed tree: a folder that isn't there isn't listed.
export function collectPlaces(projectDir) {
  const isDir = (p) => { try { return statSync(p).isDirectory(); } catch { return false; } };
  const files = KEY_FILES.filter((f) => existsSync(join(projectDir, f.path)))
    .map((f) => ({ ...f, abs: join(projectDir, f.path), url: pathToFileURL(join(projectDir, f.path)).href }));
  const groups = GROUPS.map((g) => ({
    title: g.title,
    folders: g.folders.filter((f) => isDir(join(projectDir, f))).map((f) => {
      const abs = join(projectDir, f);
      let count = 0;
      try { count = readdirSync(abs).filter((n) => { try { return statSync(join(abs, n)).isFile(); } catch { return false; } }).length; } catch { /* unreadable: 0 */ }
      return { path: f, abs, url: pathToFileURL(abs).href + '/', count, verbs: (WRITES[f] || {}).verbs || [], line: (WRITES[f] || {}).line || '' };
    }),
  })).filter((g) => g.folders.length);
  return { files, groups };
}

function renderPlaces({ files, groups }) {
  if (!files.length && !groups.length) return '';
  const row = (r, name, meta) => `<li class="place"><div class="pl-main"><a href="${esc(r.url)}"><code>${esc(name)}</code></a>${meta ? ` <span class="pl-meta">${meta}</span>` : ''}<p>${esc(r.line)}</p></div><div class="pl-act"><a href="${esc(r.url)}">Open</a><button type="button" class="cp" data-path="${esc(r.abs)}">Copy path</button></div></li>`;
  const fileList = files.length ? `<div class="label pl-group">Key files</div><ul class="places">${files.map((f) => row(f, f.path, '')).join('')}</ul>` : '';
  const groupLists = groups.map((g) => `<div class="label pl-group">${esc(g.title)}</div><ul class="places">${g.folders.map((f) => row(f, f.path + '/', `${f.count} file${f.count === 1 ? '' : 's'}${f.verbs.length ? ' · ' + f.verbs.map(esc).join(' · ') : ''}`)).join('')}</ul>`).join('');
  return `<section class="where-live" id="where-things-live">
    <h2>Where things live</h2>
    <p class="lede">Every record BOSS writes has a folder. <b>Open</b> shows it in your browser; <b>Copy path</b> gives you the path to paste into your file browser or a terminal.</p>
    ${fileList}${groupLists}
  </section>`;
}

export function renderHomeHtml(projectDir, projectName, spaces, stampedAt, places = { files: [], groups: [] }, checkedAt = Date.now()) {
  const brand = readBrand(projectDir, projectName);
  const cards = spaces.map((s) => s.made
    ? `<a class="block card" href="${esc(s.file)}">
    <div class="head"><h3>${esc(s.label)}</h3></div>
    <div class="body"><p>${esc(s.what)}</p>${s.changed && s.changed.count ? `<span class="verb">newest change: ${esc(s.changed.newest)} · ${esc(s.cmd)} to refresh</span>` : ''}</div>
    <div class="foot">${s.changed && s.changed.count
      ? `<span class="chip stale">out of date: ${s.changed.count} file${s.changed.count === 1 ? '' : 's'} changed since</span>`
      : '<span class="chip ev">nothing changed since</span>'}<span class="age" data-made="${s.made.toISOString()}">made ${esc(isoDay(s.made))}</span></div>
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
a.card .verb { font-style: normal; font-family: var(--mono); font-size: 11.5px; color: var(--stale); display: block; margin-top: 10px; overflow-wrap: anywhere; }
  .where-live { margin-top: 44px; } .where-live h2 { font-family: var(--display); font-size: 26px; }
  .pl-group { margin: 22px 0 6px; } ul.places { list-style: none; margin: 0; padding: 0; border-top: 1px solid var(--rule-2); }
  .place { display: flex; gap: 8px 18px; align-items: baseline; justify-content: space-between; padding: 10px 2px; border-bottom: 1px solid var(--rule-2); }
  .pl-main { min-width: 0; } .pl-main a { text-decoration: none; } .pl-main code { font-size: 13.5px; } .pl-meta { font-family: var(--mono); font-size: 11px; color: var(--muted); }
  .pl-main p { margin-top: 3px; font-size: 13.5px; color: var(--ink-2); max-width: 70ch; }
  .pl-act { display: flex; gap: 6px; flex: none; } .pl-act a, .pl-act button { padding: 4px 9px; border: 1px solid var(--rule); border-radius: 5px; font-size: 12.5px; color: var(--ink-2); text-decoration: none; background: var(--paper); white-space: nowrap; } .pl-act a:hover, .pl-act button:hover { border-color: var(--accent); color: var(--ink); }
  @media (max-width: 640px) { .place { flex-direction: column; } }
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
  <p class="lede">Each page is a read of your project's files. Each card says when its page was made and whether any file it reads has changed since — <span class="checked" data-made="${esc(new Date(checkedAt).toISOString())}">checked ${esc(stampedAt)}</span>. Any page command re-checks.</p>
  <aside class="mark" id="mark" aria-label="Bookmark this page">
    <p><b>Bookmark this page.</b> It's the one link to all of them. Press <kbd id="key">Ctrl+D</kbd>. The folder it lives in, <code>.boss/</code>, starts with a dot, so Finder and most file browsers hide it: the bookmark is the easy way back.</p>
    <button type="button" id="done">Done, hide this</button>
  </aside>
  <div class="blocks">
  ${cards}
  </div>
  ${renderPlaces(places)}
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
  function copy(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(text).catch(function () { return legacy(text); });
    return legacy(text);
  }
  function legacy(text) {
    var t = document.createElement('textarea'); t.value = text; t.style.position = 'fixed'; t.style.opacity = '0';
    document.body.appendChild(t); t.select(); try { document.execCommand('copy'); } catch (e) { /* shown below either way */ } document.body.removeChild(t);
    return Promise.resolve();
  }
  Array.prototype.forEach.call(document.querySelectorAll('button.cp'), function (b) {
    b.addEventListener('click', function () {
      copy(b.getAttribute('data-path')).then(function () { b.textContent = 'Copied'; setTimeout(function () { b.textContent = 'Copy path'; }, 1600); });
    });
  });
  var day = 864e5, now = Date.now();
  Array.prototype.forEach.call(document.querySelectorAll('.age[data-made]'), function (el) {
    var t = Date.parse(el.getAttribute('data-made')); if (isNaN(t)) return;
    var d = Math.floor((now - t) / day);
    el.textContent = d < 1 ? 'made today' : d === 1 ? 'made yesterday' : 'made ' + d + ' days ago';
  });
  Array.prototype.forEach.call(document.querySelectorAll('.checked[data-made]'), function (el) {
    var t = Date.parse(el.getAttribute('data-made')); if (isNaN(t)) return;
    var m = Math.floor((now - t) / 6e4), d = Math.floor(m / 1440);
    el.textContent = m < 2 ? 'checked just now' : m < 60 ? 'checked ' + m + ' minutes ago' : d < 1 ? 'checked today' : d === 1 ? 'checked yesterday' : 'checked ' + d + ' days ago';
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
  writeFileSync(out, renderHomeHtml(projectDir, projectName, collectHome(projectDir), isoMinute(), collectPlaces(projectDir)));
  return out;
}
