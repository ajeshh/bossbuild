#!/usr/bin/env node
// Build a SINGLE browsable preview of the whole site: inline the stylesheets,
// inline every built page, and swap between them client-side for the nav.
//
//   node scripts/build-preview.mjs <site-dir> <out-file>
//
// The page list and its labels are read from the BUILT output (site/*.html and the
// nav each page already carries), never hardcoded — a hardcoded list is how this
// script silently degraded to previewing one page after four were added.
// Output is a body-only fragment; the Artifact host supplies the document shell.
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const root = process.argv[2] || 'site';
const out = process.argv[3];
if (!out) { console.error('usage: build-preview.mjs <site-dir> <out-file>'); process.exit(1); }

const tokens = readFileSync(join(root, 'styles/tokens.css'), 'utf8');
const site = readFileSync(join(root, 'styles/site.css'), 'utf8');

// Page order + labels are gathered from BOTH nav levels across every built page —
// the primary bar lives on index.html, but section children only appear in the
// sub-bar of pages inside that section. Reading one page would silently drop them.
const files = readdirSync(root).filter((f) => f.endsWith('.html'));
const present = new Set(files.map((f) => f.slice(0, -5)));
const seen = new Map();
const addFrom = (html) => {
  for (const chunk of [...html.matchAll(/<(?:nav class="sitenav"|div class="subnav")[\s\S]*?<\/(?:nav|div)>\s*<\/div>/g)].map((m) => m[0])) {
    for (const m of chunk.matchAll(/<a href="([a-z-]+)\.html"[^>]*>(.*?)<\/a>/g)) {
      if (!seen.has(m[1]) && present.has(m[1])) seen.set(m[1], m[2].replace(/<[^>]*>/g, ''));
    }
  }
};
addFrom(readFileSync(join(root, 'index.html'), 'utf8'));
for (const f of files) addFrom(readFileSync(join(root, f), 'utf8'));
for (const id of present) if (!seen.has(id)) seen.set(id, id);   // never silently drop a built page
const pages = [...seen].map(([id, label]) => ({ id, label }));
const navHtml = readFileSync(join(root, 'index.html'), 'utf8');

let body = '';
for (const p of pages) {
  const html = readFileSync(join(root, `${p.id}.html`), 'utf8');
  const m = html.match(/<div class="shell">([\s\S]*)<\/div>\s*<script>/);
  if (!m) { console.error(`  ! could not extract ${p.id}`); continue; }
  body += `<div class="pv-page" data-page="${p.id}"${p.id === 'index' ? '' : ' hidden'}>\n<div class="shell">${m[1]}</div>\n</div>\n`;
}

const mark = (navHtml.match(/<svg class="mark"[\s\S]*?<\/svg>/) || [''])[0];
const nav = pages.map((p) =>
  `<li><a href="#${p.id}" data-go="${p.id}"${p.id === 'index' ? ' aria-current="page"' : ''}>${p.label}</a></li>`).join('');

writeFileSync(out, `<title>BOSS — the team you hire, just in time</title>
<style>
${tokens}
${site}
.pv-page[hidden] { display: none; }
</style>
<nav class="sitenav" aria-label="Site">
  <div class="sitenav-in">
    <a class="brand" href="#index" data-go="index">${mark}<span>BOSS</span></a>
    <ul>${nav}</ul>
  </div>
</nav>
${body}
<script>
  var pages = ${JSON.stringify(pages.map((p) => p.id))};
  function show(id) {
    if (pages.indexOf(id) === -1) id = "index";
    document.querySelectorAll(".pv-page").forEach(function (el) {
      el.hidden = el.getAttribute("data-page") !== id;
    });
    document.querySelectorAll(".sitenav a[data-go]").forEach(function (a) {
      if (a.getAttribute("data-go") === id) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
    document.querySelectorAll(".pv-page:not([hidden]) .terminal").forEach(function (t) {
      t.querySelectorAll(".line").forEach(function (l, i) {
        l.style.animationDelay = Math.min(i * 55, 900) + "ms";
      });
    });
    window.scrollTo(0, 0);
  }
  document.addEventListener("click", function (e) {
    var a = e.target.closest("a[data-go], a[href$='.html']");
    if (!a) return;
    var id = a.getAttribute("data-go") || a.getAttribute("href").replace(/\\.html$/, "");
    if (pages.indexOf(id) === -1) return;   // external link — let it through
    e.preventDefault();
    history.replaceState(null, "", "#" + id);
    show(id);
  });
  document.querySelectorAll("button.copy").forEach(function (btn) {
    btn.addEventListener("click", async function () {
      var text = btn.getAttribute("data-copy");
      try { await navigator.clipboard.writeText(text); } catch (_) {}
      var was = btn.textContent;
      btn.textContent = "Copied"; btn.dataset.done = "true"; btn.disabled = true;
      setTimeout(function () { btn.textContent = was; delete btn.dataset.done; btn.disabled = false; }, 1600);
    });
  });
  show((location.hash || "#index").slice(1));
</script>
`);
console.log(`preview → ${out}\n  ${pages.length} pages: ${pages.map((p) => p.id).join(', ')}`);
