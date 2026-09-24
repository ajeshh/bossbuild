// page-shell — the chrome every generated page in .boss/ shares: the neutral palette (board.js's
// inlined tokens; the founder's accent is the only thing BRAND.md changes), the top bar with the
// family bar (playbook · design · board — relative links, dimmed when the sibling file isn't on
// disk), the rail, the block with Link · Copy, value copy, and the copy sheet.
//
// One renderer, three spaces (IDEA-107): the playbook and the design space are two chapter sets
// over this one shell. Two copies of a top bar is how two pages start to disagree about what a
// block looks like, so this file is the only place the chrome is written. `boss playbook` adopts
// it in a separate commit (FEAT-030, with a byte-for-byte snapshot before/after); until then the
// design space is its first consumer.
//
// Every copy shows its payload. "Copied as text" tells the reader nothing about what will paste;
// the sheet shows the exact bytes and which form reached the clipboard (rich HTML falls back to
// plain text in more places than people expect, and the amber label is how they find out).

import { existsSync } from 'node:fs';
import { join } from 'node:path';

export const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m]));

// The three spaces and the file each one lives in. `current` is the page being rendered; a
// sibling is a live link only when its file exists — a dimmed entry says "not generated yet",
// never 404.
export const SPACES = [
  { key: 'playbook', label: 'Playbook', file: 'playbook.html' },
  { key: 'design', label: 'Design', file: 'design.html' },
  { key: 'board', label: 'Board', file: 'board.html' },
];

export function familyBar(projectDir, current) {
  const items = SPACES.map((s) => {
    if (s.key === current) return `<a href="#" class="on" aria-current="page">${s.label}</a>`;
    const there = existsSync(join(projectDir, '.boss', s.file));
    return there
      ? `<a href="${s.file}">${s.label}</a>`
      : `<a href="#" class="dim" aria-disabled="true" tabindex="-1" title="not generated yet — boss ${s.key === 'board' ? 'board --html' : s.key}">${s.label}</a>`;
  });
  return `<nav class="family" aria-label="Spaces">${items.join('')}</nav>`;
}

// The default palette — what a founder with no tokens.json and no brand accent sees. It used to be
// BOSS's own concrete-and-graphite greys (a copy of the site's tokens), which made every new
// project look like BOSS in monochrome; Ajesh, 2026-09-13: "we should have a good default … the
// grey is very boring." So the default is chosen, not inherited: a warm stone ground with a
// slight hue, ink with a blue cast, and a teal accent — every text pair ≥ 4.8:1 on the ground,
// ≥ 5.3 on paper, in both schemes. BOSS's own pages don't use it: docs/design/tokens.json sets
// them in the site's look the way any founder's tokens set theirs.
export const NEUTRAL = {
  light: { ground: '#ECEAE3', paper: '#F7F5EF', ink: '#1F2328', ink2: '#5D6470', muted: '#5D6470', hole: '#8A8F98', rule: '#CFCBC1', rule2: '#E0DDD4', accentInk: '#F7F5EF' },
  dark: { ground: '#1B1D22', paper: '#23262C', ink: '#E8E6DF', ink2: '#A6ACB4', muted: '#A6ACB4', hole: '#6E747D', rule: '#3A3E46', rule2: '#2C3036', accentInk: '#1B1D22' },
};
// The default accent, and its dark-scheme twin (a brand's own accent is used as given in both).
export const DEFAULT_ACCENT = '#1F6F78';
const DEFAULT_ACCENT_DARK = '#6FB7BF';
const vars = (t) => `--ground: ${t.ground}; --paper: ${t.paper}; --ink: ${t.ink}; --ink-2: ${t.ink2}; --muted: ${t.muted}; --hole: ${t.hole}; --rule: ${t.rule}; --rule-2: ${t.rule2}; --accent-ink: ${t.accentInk};`;

// The light scheme as bare declarations, for a surface that must look the same on every screen
// whatever the viewer's dark-mode setting — the playbook's deck and its PDF (IDEA-129).
export const lightScheme = (accent) => `--accent: ${accent}; ${vars(NEUTRAL.light)} --accent-soft: color-mix(in srgb, var(--accent) 12%, var(--paper)); --chip-ev: #2F5D8A; --chip-ev-soft: #E3ECF5; --stale: #A8681A; --stale-soft: #F6ECDA; --bad: #A33A2E; --bad-soft: #F8E4E1; --shadow: 0 1px 2px rgba(0,0,0,.06), 0 8px 24px rgba(0,0,0,.08); color-scheme: light;`;

export function shellCss(accent) {
  const darkAccent = accent === DEFAULT_ACCENT ? ` --accent: ${DEFAULT_ACCENT_DARK};` : '';
  return `
  :root { --accent: ${accent}; ${vars(NEUTRAL.light)} --accent-soft: color-mix(in srgb, var(--accent) 12%, var(--paper)); --chip-ev: #2F5D8A; --chip-ev-soft: #E3ECF5; --stale: #A8681A; --stale-soft: #F6ECDA; --bad: #A33A2E; --bad-soft: #F8E4E1; --shadow: 0 1px 2px rgba(0,0,0,.06), 0 8px 24px rgba(0,0,0,.08); --display: "Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif; --body: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif; --mono: ui-monospace, "SF Mono", Menlo, Consolas, monospace; color-scheme: light; }
  @media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { ${vars(NEUTRAL.dark)}${darkAccent} --chip-ev: #8FB6DD; --chip-ev-soft: #1F2E3D; --stale: #E0A94F; --stale-soft: #3A2C14; --bad: #E58A7D; --bad-soft: #3B2320; --shadow: 0 1px 2px rgba(0,0,0,.4), 0 8px 24px rgba(0,0,0,.35); color-scheme: dark; } }
  :root[data-theme="dark"] { ${vars(NEUTRAL.dark)}${darkAccent} --chip-ev: #8FB6DD; --chip-ev-soft: #1F2E3D; --stale: #E0A94F; --stale-soft: #3A2C14; --bad: #E58A7D; --bad-soft: #3B2320; --shadow: 0 1px 2px rgba(0,0,0,.4), 0 8px 24px rgba(0,0,0,.35); color-scheme: dark; }
  * { box-sizing: border-box; } body { margin: 0; background: var(--ground); color: var(--ink); font-family: var(--body); font-size: 15.5px; line-height: 1.55; -webkit-font-smoothing: antialiased; }
  a { color: var(--accent); } h1, h2, h3, h4 { margin: 0; font-weight: 500; text-wrap: balance; } p { margin: 0; } code { font-family: var(--mono); font-size: .9em; }
  button { font: inherit; color: inherit; background: none; border: 0; padding: 0; cursor: pointer; } button:focus-visible, a:focus-visible, [tabindex]:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; border-radius: 3px; }
  .label { font-family: var(--mono); font-size: 11px; letter-spacing: .06em; text-transform: uppercase; color: var(--muted); } .tab { font-variant-numeric: tabular-nums; }
  .topbar { position: sticky; top: 0; z-index: 20; display: flex; align-items: center; gap: 18px; padding: 10px 20px; background: color-mix(in srgb, var(--ground) 88%, transparent); backdrop-filter: blur(8px); border-bottom: 1px solid var(--rule); }
  .wordmark { font-family: var(--display); font-size: 21px; font-weight: 500; white-space: nowrap; } .wordmark .tag { font-family: var(--body); font-size: 12.5px; color: var(--muted); font-weight: 400; margin-left: 6px; }
  .family { display: flex; gap: 2px; font-size: 13px; } .family a { padding: 4px 9px; border-radius: 5px; text-decoration: none; color: var(--ink-2); white-space: nowrap; } .family a:hover { background: var(--paper); color: var(--ink); } .family a.on { background: var(--accent-soft); color: var(--ink); } .family a.dim { color: var(--hole); } .family a.dim::after { content: " · not generated"; font-family: var(--mono); font-size: 10px; letter-spacing: .04em; }
  .ledger { margin-left: auto; font-family: var(--mono); font-size: 11.5px; color: var(--ink-2); min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; } .ledger b { color: var(--ink); font-weight: 500; }
  .shell { display: grid; grid-template-columns: 220px minmax(0, 1fr); max-width: 1360px; margin: 0 auto; padding-inline: 20px; }
  .rail { position: sticky; top: 56px; align-self: start; padding-block: 32px 40px; padding-right: 24px; border-right: 1px solid var(--rule); height: calc(100vh - 56px); overflow: auto; }
  .rail .label { margin-bottom: 10px; } .rail .group { margin-top: 14px; } .rail ol { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 2px; }
  .rail a { display: flex; align-items: baseline; gap: 8px; min-width: 0; padding: 6px 8px; border-radius: 5px; text-decoration: none; font-size: 14px; color: var(--ink-2); } .rail a:hover { background: var(--paper); color: var(--ink); } .rail a.on { background: var(--accent-soft); color: var(--ink); }
  .rail a .n { font-family: var(--mono); font-size: 11px; color: var(--muted); width: 18px; flex: none; } .rail a.hole-link { color: var(--hole); } .rail a.hole-link::after { content: "empty"; margin-left: auto; flex: none; font-family: var(--mono); font-size: 10px; letter-spacing: .05em; text-transform: uppercase; color: var(--hole); }
  main { padding-block: 32px 80px; padding-left: 40px; min-width: 0; }
  .chapter { padding-block: 24px 56px; border-bottom: 1px solid var(--rule); scroll-margin-top: 70px; } .chapter:last-of-type { border-bottom: 0; }
  .chapter-head { max-width: 62ch; margin-bottom: 26px; } .chapter-head .label { margin-bottom: 8px; } .chapter-head h2 { font-family: var(--display); font-size: 34px; line-height: 1.12; letter-spacing: -.01em; } .chapter-head p { margin-top: 10px; color: var(--ink-2); max-width: 58ch; }
  .blocks { display: grid; gap: 14px; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); } .blocks.one { grid-template-columns: 1fr; } .blocks.two { grid-template-columns: repeat(auto-fit, minmax(380px, 1fr)); }
  .block { position: relative; display: flex; flex-direction: column; background: var(--paper); border: 1px solid var(--rule); border-radius: 8px; padding: 18px 20px 14px; scroll-margin-top: 80px; min-width: 0; }
  .block .head { display: flex; align-items: baseline; gap: 10px; margin-bottom: 10px; flex-wrap: wrap; } .block h3 { font-size: 13px; font-weight: 600; letter-spacing: .01em; } .block h3 .sub { font-weight: 400; color: var(--muted); }
  .block .body { font-size: 15px; line-height: 1.5; flex: 1; min-width: 0; } .block .body p + p { margin-top: 8px; } .block .body ul { margin: 0; padding-left: 18px; } .block .body li + li { margin-top: 4px; }
  .block .foot { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 12px; margin-top: 14px; padding-top: 10px; border-top: 1px solid var(--rule-2); font-family: var(--mono); font-size: 11px; color: var(--muted); } .block .src { min-width: 0; overflow-wrap: anywhere; }
  .chip { display: inline-flex; align-items: center; gap: 6px; padding: 2px 8px; border-radius: 99px; font-family: var(--mono); font-size: 10.5px; letter-spacing: .02em; white-space: nowrap; } .chip::before { content: ""; width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
  .chip.ev { background: var(--chip-ev-soft); color: var(--chip-ev); } .chip.dec { background: var(--accent-soft); color: var(--ink-2); } .chip.asserted { background: transparent; color: var(--muted); border: 1px solid var(--rule); } .chip.asserted::before { background: transparent; border: 1.5px solid currentColor; width: 5px; height: 5px; }
  .chip.stale, .chip.find { background: var(--stale-soft); color: var(--stale); } .chip.find::before { border-radius: 1px; } .chip.bad { background: var(--bad-soft); color: var(--bad); }
  .actions { position: absolute; top: 10px; right: 10px; display: flex; gap: 2px; opacity: 0; transition: opacity .12s; background: var(--paper); border: 1px solid var(--rule); border-radius: 6px; padding: 2px; z-index: 2; }
  .block:hover .actions, .block:focus-within .actions { opacity: 1; } @media (hover: none) { .actions { opacity: 1; } }
  .actions button { display: inline-flex; align-items: center; gap: 5px; padding: 4px 8px; border-radius: 4px; font-size: 11.5px; color: var(--ink-2); } .actions button:hover { background: var(--accent-soft); color: var(--ink); } .actions svg { width: 13px; height: 13px; stroke: currentColor; fill: none; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
  .block.hole .actions .copy, .block.dormant .actions .copy { display: none; }
  .block.hole { border-style: dashed; background: transparent; } .block.hole .body { color: var(--hole); font-style: italic; } .block.hole .body .verb, .block.dormant .body .cond { font-style: normal; font-family: var(--mono); font-size: 11.5px; color: var(--ink-2); display: block; margin-top: 10px; }
  .block.dormant { background: transparent; } .block.dormant .body { color: var(--hole); }
  table.t { width: 100%; border-collapse: collapse; font-size: 14px; } table.t th { text-align: left; font-family: var(--mono); font-size: 10.5px; letter-spacing: .06em; text-transform: uppercase; color: var(--muted); font-weight: 500; padding: 0 10px 8px 0; border-bottom: 1px solid var(--rule); white-space: nowrap; }
  table.t td { padding: 9px 10px 9px 0; border-bottom: 1px solid var(--rule-2); vertical-align: top; } table.t tr:last-child td { border-bottom: 0; } table.t td.mono { font-family: var(--mono); font-size: 12.5px; white-space: nowrap; }
  table.t td.ok { color: var(--accent); font-weight: 500; } table.t td.warn { color: var(--stale); font-weight: 500; } table.t td.fail { color: var(--bad); font-weight: 500; } table.t td.q { color: var(--hole); font-style: italic; } .tscroll { overflow-x: auto; }
  .t-small { font-size: 13px; color: var(--ink-2); }
  .val { cursor: pointer; border-bottom: 1px dotted color-mix(in srgb, currentColor 45%, transparent); border-radius: 2px; } .val:hover { background: var(--accent-soft); border-bottom-color: var(--accent); }
  .valmenu { position: absolute; z-index: 30; display: flex; flex-direction: column; min-width: 190px; background: var(--paper); border: 1px solid var(--rule); border-radius: 6px; box-shadow: var(--shadow); padding: 4px; }
  .valmenu button { display: flex; justify-content: space-between; gap: 14px; padding: 6px 8px; border-radius: 4px; font-size: 12.5px; text-align: left; } .valmenu button:hover { background: var(--accent-soft); } .valmenu button span { font-family: var(--mono); font-size: 11px; color: var(--muted); } .valmenu .k { font-family: var(--mono); font-size: 10px; letter-spacing: .06em; text-transform: uppercase; color: var(--muted); padding: 4px 8px 2px; }
  .sheet { position: fixed; right: 18px; bottom: 18px; z-index: 55; width: min(560px, calc(100vw - 36px)); max-height: min(70vh, 640px); display: flex; flex-direction: column; background: var(--paper); border: 1px solid var(--rule); border-radius: 10px; box-shadow: var(--shadow); }
  .sheet .sh { display: flex; align-items: center; gap: 10px; padding: 10px 12px 8px; border-bottom: 1px solid var(--rule-2); } .sheet .sh b { font-weight: 600; font-size: 13px; } .sheet .sh .form { font-family: var(--mono); font-size: 10.5px; color: var(--muted); } .sheet .sh .form.plain { color: var(--stale); } .sheet .sh .x { margin-left: auto; padding: 4px 8px; border: 1px solid var(--rule); border-radius: 5px; font-size: 12px; color: var(--ink-2); }
  .sheet .stabs { display: flex; gap: 2px; padding: 6px 10px 0; } .sheet .stabs button { padding: 5px 9px; font-size: 12px; color: var(--muted); border-bottom: 2px solid transparent; } .sheet .stabs button[aria-selected="true"] { color: var(--ink); border-bottom-color: var(--accent); }
  .sheet .sb { overflow: auto; padding: 12px; min-height: 0; } .sheet .sb pre { margin: 0; font-family: var(--mono); font-size: 11.5px; line-height: 1.5; white-space: pre-wrap; overflow-wrap: anywhere; color: var(--ink-2); }
  .sheet .sb .rendered { font-family: Helvetica, Arial, sans-serif; font-size: 13px; color: #17211E; background: #fff; border: 1px dashed var(--rule); border-radius: 6px; padding: 12px; } .sheet .sb .rendered table { border-collapse: collapse; } .sheet .sb .rendered td, .sheet .sb .rendered th { border: 1px solid #ddd; padding: 3px 6px; font-size: 12px; text-align: left; }
  .sheet .sb .literal { font-family: var(--mono); font-size: 15px; padding: 10px 12px; background: var(--ground); border-radius: 6px; }
  .sheet .sf { display: flex; align-items: center; gap: 10px; padding: 8px 12px; border-top: 1px solid var(--rule-2); font-family: var(--mono); font-size: 10.5px; color: var(--muted); } .sheet .sf .again { margin-left: auto; padding: 4px 9px; border: 1px solid var(--rule); border-radius: 5px; font-family: var(--body); font-size: 12px; color: var(--ink-2); } .sheet .sf .again:hover { border-color: var(--accent); }
  footer.site { padding-block: 26px 40px; padding-left: 40px; font-family: var(--mono); font-size: 11px; color: var(--muted); line-height: 1.7; }
  @media (max-width: 980px) { .shell { grid-template-columns: 1fr; } .rail { position: static; height: auto; border-right: 0; border-bottom: 1px solid var(--rule); padding: 18px 0 14px; } .rail ol { flex-direction: row; flex-wrap: wrap; gap: 4px 6px; } .rail .group { margin-top: 8px; } .rail a { padding: 5px 9px; } .rail a.hole-link::after { display: none; } main, footer.site { padding-left: 0; } }
  @media (max-width: 640px) { .topbar { flex-wrap: wrap; gap: 8px 12px; } .ledger { order: 4; flex-basis: 100%; margin-left: 0; white-space: normal; } .family a.dim::after { display: none; } .blocks, .blocks.two { grid-template-columns: 1fr; } .sheet { right: 12px; left: 12px; bottom: 12px; width: auto; } }
  @media (prefers-reduced-motion: reduce) { .actions { transition: none; } }
  @media print { .topbar, .rail, .actions, .valmenu, .sheet, footer.site { display: none !important; } .shell { display: block; } main { padding: 0; } .block { break-inside: avoid; } }
`;
}

// The behaviour every page shares. Link · Copy on blocks — plus Code on a block with `data-code`
// (JSON, label → text) and SVG on one with `data-svg` (the markup, copied as plain text: that is the
// form a design tool pastes as editable vectors); `.val[data-copy="k=v|k=v"]` on values; the sheet
// after every copy. Nothing here fetches, stores, or runs on load beyond wiring.
export function shellJs() {
  return String.raw`
(function () {
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = (s) => String(s).replace(/[&<>"]/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m]));

  /* the copy sheet — the payload that actually reached the clipboard, and in which form */
  let sheet = null;
  function showCopied(p) {
    if (!sheet) { sheet = document.createElement('aside'); sheet.className = 'sheet'; sheet.setAttribute('role', 'dialog'); sheet.setAttribute('aria-label', 'What was copied'); document.body.appendChild(sheet); }
    const form = p.result === 'rich' ? 'on the clipboard as rich text + plain text' : 'on the clipboard as plain text' + (p.views.some((v) => v.kind === 'html') ? ' only' : '');
    sheet.innerHTML = '<div class="sh"><b>Copied</b><span class="form ' + (p.result !== 'rich' && p.views.some((v) => v.kind === 'html') ? 'plain' : '') + '">' + esc(form) + '</span><button type="button" class="x">Close · Esc</button></div>'
      + (p.views.length > 1 ? '<div class="stabs" role="tablist">' + p.views.map((v, i) => '<button type="button" role="tab" aria-selected="' + (i === 0) + '" data-i="' + i + '">' + esc(v.name) + '</button>').join('') + '</div>' : '')
      + '<div class="sb"></div><div class="sf"><span>' + esc(p.title) + '</span><button type="button" class="again">Copy again</button></div>';
    const sb = $('.sb', sheet);
    const render = (i) => { const v = p.views[i]; sb.innerHTML = '';
      if (v.kind === 'html') { const d = document.createElement('div'); d.className = 'rendered'; d.innerHTML = v.body; sb.appendChild(d); }
      else if (v.kind === 'value') { const d = document.createElement('div'); d.className = 'literal'; d.textContent = v.body; sb.appendChild(d); }
      else { const pre = document.createElement('pre'); pre.textContent = v.body; sb.appendChild(pre); } };
    render(0);
    $$('[role="tab"]', sheet).forEach((b) => b.addEventListener('click', () => { $$('[role="tab"]', sheet).forEach((x) => x.setAttribute('aria-selected', String(x === b))); render(+b.dataset.i); }));
    $('.x', sheet).addEventListener('click', () => { sheet.hidden = true; });
    $('.again', sheet).addEventListener('click', () => p.recopy());
    sheet.hidden = false;
  }
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { if (sheet) sheet.hidden = true; closeMenu(); } });

  /* clipboard: rich where the host allows, plain otherwise — and say which */
  function writeClipboard(text, html) {
    if (html && navigator.clipboard && window.ClipboardItem) {
      try { const item = new ClipboardItem({ 'text/html': new Blob([html], { type: 'text/html' }), 'text/plain': new Blob([text], { type: 'text/plain' }) });
        return navigator.clipboard.write([item]).then(() => 'rich').catch(() => plain(text)); } catch (e) { return plain(text); }
    }
    return plain(text);
  }
  function plain(text) { if (navigator.clipboard) return navigator.clipboard.writeText(text).then(() => 'plain').catch(() => legacy(text)); return legacy(text); }
  function legacy(text) { const ta = document.createElement('textarea'); ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0'; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); } catch (e) {} ta.remove(); return Promise.resolve('plain'); }

  /* blocks: Link · Copy */
  const ICON = { link: '<svg viewBox="0 0 24 24"><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/></svg>', copy: '<svg viewBox="0 0 24 24"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h9"/></svg>', code: '<svg viewBox="0 0 24 24"><path d="M8 7l-5 5 5 5"/><path d="M16 7l5 5-5 5"/><path d="M14 4l-4 16"/></svg>', svg: '<svg viewBox="0 0 24 24"><path d="M4 20L20 4"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="6" r="2"/></svg>' };
  const wordmark = ($('.wordmark') ? $('.wordmark').textContent.trim().split('\n')[0] : '');
  $$('.block').forEach((b) => {
    const a = $('.actions', b); if (!a) return;
    a.innerHTML = '<button type="button" class="link" title="Copy link to this block">' + ICON.link + 'Link</button><button type="button" class="copy" title="Copy this block for a doc or a deck">' + ICON.copy + 'Copy</button>'
      + (b.dataset.code ? '<button type="button" class="code" title="Copy the code — the import line, the source">' + ICON.code + 'Code</button>' : '')
      + (b.dataset.svg ? '<button type="button" class="svg" title="Copy as SVG — pastes into a design tool as editable vectors">' + ICON.svg + 'SVG</button>' : '');
    $('.link', a).addEventListener('click', () => copyLink(b.id));
    $('.copy', a).addEventListener('click', () => copyBlock(b));
    /* Code: data-code is JSON {label: text} — code holds '|' and '=', so the value format won't do */
    if (b.dataset.code) $('.code', a).addEventListener('click', (e) => { e.stopPropagation(); let o = {}; try { o = JSON.parse(b.dataset.code); } catch (x) {} const fs = Object.keys(o).map((k) => ({ k, v: o[k], name: k })); if (fs.length === 1) return copyVal(fs[0].k, fs[0].v, fs[0].name); openMenu($('.code', a), fs); });
    /* SVG: plain text — that is the form a design tool pastes as vectors; the sheet shows the markup */
    if (b.dataset.svg) $('.svg', a).addEventListener('click', () => copyVal('svg', b.dataset.svg));
  });
  function copyLink(id) { const url = location.href.replace(/#.*$/, '') + '#' + id; history.replaceState(null, '', '#' + id);
    writeClipboard(url, null).then((r) => showCopied({ title: 'Link to #' + id, result: r, views: [{ name: 'Link', kind: 'value', body: url }], recopy: () => copyLink(id) })); }
  /* what a copy leaves out: the action buttons, and a filled block's .prompt (the question above a canvas answer) */
  function strip(node) { $$('.actions, .prompt', node).forEach((x) => x.remove()); return node; }
  function plainText(el) { const c = strip(el.cloneNode(true)); return c.innerText.replace(/\n{3,}/g, '\n\n').trim(); }
  function blockHtml(b) { const body = strip($('.body', b).cloneNode(true)); const title = $('h3', b) ? $('h3', b).innerText.trim() : (b.dataset.title || ''); const foot = $('.foot', b) ? $('.foot', b).innerText.replace(/\s+/g, ' ').trim() : '';
    return '<div style="font-family:Helvetica,Arial,sans-serif;font-size:14px;line-height:1.45;color:#16181A"><p style="margin:0 0 6px;font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:#565C62">' + esc(wordmark ? wordmark + ' · ' : '') + esc(title) + '</p>' + body.innerHTML.replace(/ class="[^"]*"/g, '') + '<p style="margin:10px 0 0;font-size:10px;color:#565C62;font-family:Menlo,Consolas,monospace">' + esc(foot) + '</p></div>'; }
  function copyBlock(b) { const html = blockHtml(b), text = plainText(b);
    writeClipboard(text, html).then((r) => showCopied({ title: (b.dataset.title || b.id) + ' · the block, for a doc or a deck', result: r, views: [{ name: 'Looks like (rich)', kind: 'html', body: html }, { name: 'Text', kind: 'text', body: text }], recopy: () => copyBlock(b) })); }

  /* values: click → the one form, or a menu of forms */
  const LABEL = { hex: 'Hex', token: 'Token name', css: 'CSS variable', stack: 'Font stack', size: 'Size / line', px: 'Pixels', value: 'Value', svg: 'SVG', import: 'Import line', source: 'Source file' };
  let menu = null;
  function closeMenu() { if (menu) { menu.remove(); menu = null; } }
  function forms(el) { return el.dataset.copy.split('|').map((kv) => { const k = kv.slice(0, kv.indexOf('=')); return { k, v: kv.slice(k.length + 1) }; }); }
  function copyVal(k, v, name) { const label = name || LABEL[k] || k; const long = k === 'svg' || k === 'source' || /\n/.test(v);
    writeClipboard(v, null).then((r) => showCopied({ title: label, result: r, views: [{ name: label, kind: long ? 'text' : 'value', body: v }], recopy: () => copyVal(k, v, name) })); }
  function openMenu(anchor, fs) {
    closeMenu();
    menu = document.createElement('div'); menu.className = 'valmenu'; menu.setAttribute('role', 'menu');
    menu.innerHTML = '<div class="k">Copy as</div>' + fs.map((f, i) => '<button type="button" role="menuitem" data-i="' + i + '">' + esc(f.name || LABEL[f.k] || f.k) + '<span>' + esc(f.v.length > 26 ? f.v.slice(0, 24).replace(/\s+/g, ' ') + '…' : f.v) + '</span></button>').join('');
    document.body.appendChild(menu);
    const r = anchor.getBoundingClientRect(); menu.style.left = Math.min(r.left + window.scrollX, window.scrollX + document.documentElement.clientWidth - menu.offsetWidth - 12) + 'px'; menu.style.top = (r.bottom + window.scrollY + 6) + 'px';
    $$('button', menu).forEach((b) => b.addEventListener('click', () => { const f = fs[+b.dataset.i]; copyVal(f.k, f.v, f.name); closeMenu(); }));
    $('button', menu).focus();
  }
  document.addEventListener('click', (e) => {
    const el = e.target.closest('.val');
    if (!el) { if (!e.target.closest('.valmenu')) closeMenu(); return; }
    if (e.target.closest('.valmenu')) return;
    e.preventDefault(); e.stopPropagation();
    const fs = forms(el); if (fs.length === 1) return copyVal(fs[0].k, fs[0].v);
    openMenu(el, fs);
  });
  $$('.val').forEach((el) => { if (!el.hasAttribute('tabindex')) { el.tabIndex = 0; el.setAttribute('role', 'button'); } el.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); el.click(); } }); });

  /* rail highlight */
  const links = $$('.rail a'), sections = $$('.chapter');
  function highlight() { const y = window.scrollY + window.innerHeight * 0.35; let id = sections.length ? sections[0].id : ''; sections.forEach((sec) => { if (sec.offsetTop <= y) id = sec.id; }); links.forEach((l) => l.classList.toggle('on', l.getAttribute('href') === '#' + id)); }
  window.addEventListener('scroll', highlight, { passive: true }); highlight();
  if (location.hash) { const t = $(location.hash); if (t) setTimeout(() => t.scrollIntoView({ block: 'start' }), 60); }
})();
`;
}

// Wrap chapters in the shell. `rail` is [{ group, items: [{ href, n, label, hole }] }].
export function shellPage({ title, brand, projectDir, current, ledgerHtml, rail, mainHtml, footerLines, extraCss = '', extraJs = '' }) {
  const railHtml = rail.map((g) => `${g.group ? `<div class="label group">${esc(g.group)}</div>` : ''}<ol>${g.items.map((it) => `<li><a href="#${esc(it.href)}"${it.hole ? ' class="hole-link"' : ''}><span class="n">${it.n}</span>${esc(it.label)}</a></li>`).join('')}</ol>`).join('\n');
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<style>${shellCss(brand.accent || DEFAULT_ACCENT)}${extraCss}</style>
</head>
<body>
<header class="topbar">
  <div class="wordmark">${esc(brand.name)}${brand.tagline ? `<span class="tag">${esc(brand.tagline)}</span>` : ''}</div>
  ${familyBar(projectDir, current)}
  <div class="ledger">${ledgerHtml}</div>
</header>
<div class="shell">
  <nav class="rail" aria-label="Sections">
    ${railHtml}
  </nav>
  <main>
${mainHtml}
  </main>
</div>
<footer class="site">
${footerLines.map((l) => `  <div>${l}</div>`).join('\n')}
</footer>
<script>${shellJs()}${extraJs}</script>
</body>
</html>
`;
}
