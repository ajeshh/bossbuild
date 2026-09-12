// src/help-html.js — `boss help --html`, the visual twin of `boss help`.
//
// WHY THIS EXISTS AND WHY IT IS NOT THE WEBSITE
// The website describes the SUPERSET: 48 skills, 12 agents, four rungs. A founder standing in a
// Quickstart project has 17 skills and 4 agents, and the site cannot tell them which of the 48 they
// have — so the one surface with the most content is the one least able to answer "what can I run".
// `boss map` answers it in the terminal, tersely, for the person who is comfortable there.
// This is the sit-down read for the person who isn't: everything they have, why it exists, and
// nothing they don't.
//
// WHY IT IS GENERATED ON DEMAND AND NEVER SCAFFOLDED
// A doc written into the founder's repo at install is a doc that is wrong by the second unlock, and
// nothing would be watching it. `boss board --html` already established the shape — read state,
// render, write to `.boss/`, which is gitignored. So this cannot rot: it is rebuilt from the stamp
// and the manifests every time it is asked for, and if it is stale the fix is to run it again.
//
// THE ONE RULE ABOUT ADDING TO IT
// If a manifest can answer it, it is generated here. If it needs a human sentence, it goes in
// `library/help/` with `covers:` + `reviewed:` frontmatter, and `npm run check:help` reports when
// the code moved out from under the prose. Prose in this file would be prose nothing is watching.

import { readdirSync, readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { STAGE_ORDER } from './paths.js';
import { loadModes, packageSkillMd, skillGloss, STANDING_COMMANDS } from './modes.js';
import { HELP, SYMBOLS, WAYFINDING } from './help.js';
import { GLOSSARY } from './glossary.js';
import { bossVersion } from './paths.js';

const HERE = dirname(fileURLToPath(import.meta.url));
const HELP_SRC = join(HERE, '..', 'library', 'help');

const esc = (s) => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Skill glosses carry template tokens meant for a scaffolded file; a reader should never
// meet `{{PROJECT_NAME}}` in prose. Substitute the one we know and drop the rest.
function fill(text, projectName) {
  return String(text || '')
    .replace(/\{\{PROJECT_NAME\}\}/g, projectName || 'this project')
    .replace(/\{\{[^}]+\}\}/g, '')
    .trim();
}

// ---- the hand-written half -------------------------------------------------
// Fragments are read in filename order (they are numbered for exactly this reason) and
// their frontmatter is stripped. A fragment with no frontmatter is still rendered — the
// gate complains about that, not the renderer, because a founder asking for help should
// never be shown less because a stamp is missing.
function fragments() {
  if (!existsSync(HELP_SRC)) return [];
  return readdirSync(HELP_SRC)
    .filter((f) => f.endsWith('.html'))
    .sort()
    .map((f) => {
      const raw = readFileSync(join(HELP_SRC, f), 'utf8');
      const head = (raw.match(/^<!--\n([\s\S]*?)\n-->/) || [, ''])[1];
      const meta = {};
      for (const line of head.split(/\r?\n/)) {
        const m = line.match(/^([a-z_]+):\s*(.*)$/);
        if (m) meta[m[1]] = m[2].trim();
      }
      return { file: f, meta, body: raw.replace(/^<!--\n[\s\S]*?\n-->\n?/, '').trim() };
    });
}

function stylesheet() {
  const f = join(HELP_SRC, 'help.css');
  return existsSync(f) ? readFileSync(f, 'utf8') : '';
}

// ---- the generated half ----------------------------------------------------
function ladderHtml(installed, deepest) {
  const byId = Object.fromEntries(loadModes().map((m) => [m.id, m]));
  return `<ol class="rungs">${STAGE_ORDER.map((id) => {
    const name = (byId[id] && byId[id].name) || id.replace(/^L\d+-/, '');
    const cls = id === deepest ? 'here' : installed.includes(id) ? 'on' : '';
    const aria = id === deepest ? ' aria-current="step"' : '';
    return `<li class="${cls}"${aria}>${esc(name)}</li>`;
  }).join('')}</ol>`;
}

function commandsHtml() {
  const rows = STANDING_COMMANDS.map(([cmd, what]) => {
    const verb = cmd.startsWith('boss ') ? cmd.split(' ')[1] : null;
    const detail = verb && HELP[verb];
    // The standing line is the one-liner; HELP carries the paragraph. Printing the
    // paragraph too is the difference between a cheatsheet and a guide.
    const extra = detail ? `<span class="d">${esc(detail.what)}</span>` : '';
    return `<tr><td><code>${esc(cmd)}</code></td><td><div class="cell">${esc(what)}${
      extra ? `<br><span class="more">${esc(detail.what)}</span>` : ''}</div></td></tr>`;
  }).join('\n');
  return `<div class="tw"><table><thead><tr><th>command</th><th>what it does</th></tr></thead><tbody>\n${rows}\n</tbody></table></div>`;
}

// Skills the project HAS, grouped by the rung that introduced each — plus the next rung
// as a preview, dimmed. The gloss prefers the project's OWN copy of SKILL.md, because a
// founder who edited a skill should read what theirs says, not what the package ships.
function skillsHtml(projectDir, stamp) {
  const modes = loadModes();
  const byId = Object.fromEntries(modes.map((m) => [m.id, m]));
  const skillStage = {};
  for (const m of modes) for (const s of m.skills || []) if (!(s in skillStage)) skillStage[s] = m.id;

  const installed = stamp.installedLayers || [stamp.stage];
  const have = new Set(stamp.skills || []);
  const gloss = (name, stageId) => {
    const own = join(projectDir, '.claude', 'skills', name, 'SKILL.md');
    const g = existsSync(own) ? skillGloss(own) : skillGloss(packageSkillMd(stageId, name));
    return fill(g && g.gloss, stamp.name);
  };

  const out = [];
  for (const layerId of STAGE_ORDER) {
    if (!installed.includes(layerId)) continue;
    const mode = byId[layerId];
    if (!mode) continue;
    const here = (mode.skills || []).filter((s) => have.has(s) && skillStage[s] === layerId);
    if (!here.length) continue;
    const loop = (mode.coreLoop || []).filter((s) => here.includes(s));
    // `boss map` HIDES these until they are relevant. A guide is a reference, so it shows
    // them — but flags them, because an unflagged flat list says "all of these are your
    // next move" and four of Quickstart's seventeen are BOSS's own upkeep.
    const aside = new Set(mode.aside || []);
    const post = new Set(mode.postLaunch || []);
    const tag = (s) => aside.has(s) ? 'upkeep' : post.has(s) ? 'after you ship' : '';
    const rest = here.filter((s) => !loop.includes(s)).sort()
      .sort((a, b) => (tag(a) ? 1 : 0) - (tag(b) ? 1 : 0));
    const ordered = [...loop, ...rest];
    out.push(`<div class="rung-group"><h3>${esc(mode.name)} <span class="n">${ordered.length} skills</span></h3>${
      loop.length > 1 ? `<p class="loop">the loop: ${loop.map((s) => `/${esc(s)}`).join(' → ')}</p>` : ''
    }<div class="skills">${ordered.map((s) =>
      `<div class="skill"><b>/${esc(s)}</b>${tag(s) ? `<i class="tag">${esc(tag(s))}</i>` : ''}<span>${esc(gloss(s, layerId))}</span></div>`).join('')}</div></div>`);
  }

  // One rung of preview, never more: the reason `boss map` folds this is that MVP's full
  // list printed into a Quickstart project is a 45-line wall, 64% of it unavailable.
  const nextId = STAGE_ORDER.find((id) => !installed.includes(id));
  if (nextId && byId[nextId] && (byId[nextId].skills || []).length) {
    const next = byId[nextId];
    // `headline` is the manifest's own curated preview — the few worth naming to someone who
    // has not climbed yet. Empty is legitimate (a rung with 1-3 skills), so fall back to all.
    const preview = (next.headline && next.headline.length) ? next.headline : (next.skills || []);
    out.push(`<div class="rung-group locked"><h3>${esc(next.name)} <span class="n">not unlocked, ${
      (next.skills || []).length} skills</span></h3><div class="skills">${
      preview.map((s) => `<div class="skill"><b>/${esc(s)}</b><span>${esc(gloss(s, nextId))}</span></div>`).join('')
    }</div><p class="loop">Unlock with <code>boss unlock ${esc(next.id.replace(/^L\d+-/, ''))}</code> — it names what earns the rung first.</p></div>`);
  }
  return out.join('\n');
}

// The wayfinding map, resolved against this install. An intent whose verbs are ALL locked
// still prints — with the rung that would bring it — because "not yet, and here is when"
// orients better than an intent that silently isn't there.
function wayfindingHtml(stamp) {
  const modes = loadModes();
  const skillStage = {};
  const modeName = Object.fromEntries(modes.map((m) => [m.id, m.name]));
  for (const m of modes) for (const s of m.skills || []) if (!(s in skillStage)) skillStage[s] = m.id;
  const have = new Set(stamp.skills || []);
  return `<div class="want">${WAYFINDING.map(([want, verbs]) => {
    const mine = verbs.filter((v) => have.has(v));
    const later = verbs.filter((v) => !have.has(v));
    const parts = [];
    if (mine.length) parts.push(mine.map((v) => `<code>/${esc(v)}</code>`).join(' · '));
    if (later.length) {
      const byRung = {};
      for (const v of later) (byRung[skillStage[v]] ||= []).push(v);
      parts.push(Object.entries(byRung).map(([id, vs]) =>
        `<span class="soon">${vs.map((v) => `<code>/${esc(v)}</code>`).join(' · ')} — at ${esc(modeName[id] || id)}</span>`).join(' · '));
    }
    return `<div><span class="q">…${esc(want)}</span><span class="a">${parts.join(' · ')}</span></div>`;
  }).join('')}</div>`;
}

// The team, read from the AGENT FILES rather than the manifest — the manifest lists names
// only, so an earlier version of this rendered a "role" column that was empty on every row.
// Prefer the project's own copy: a founder who edited an agent should read theirs.
//
// The description is trimmed to its first sentence and its "Trigger phrases -" tail is dropped.
// Those tails are written for the model that reads the file, not for a person scanning a table,
// and one of them is 40 words long.
function agentDescription(projectDir, name, stageId) {
  const own = join(projectDir, '.claude', 'agents', `${name}.md`);
  const pkg = join(HERE, '..', 'stages', stageId || '', 'template', '.claude', 'agents', `${name}.md`);
  const file = existsSync(own) ? own : (stageId && existsSync(pkg) ? pkg : null);
  if (!file) return '';
  const head = (readFileSync(file, 'utf8').match(/^---\n([\s\S]*?)\n---/) || [, ''])[1];
  let d = (head.match(/^description:\s*(.*)$/m) || [, ''])[1].trim();
  d = d.split(/\s+Trigger phrases?\s*[-–—:]/)[0].trim();
  const stop = d.search(/\.\s/);
  if (stop > 40) d = d.slice(0, stop + 1);
  // Some agents have no early full stop and run to 350 characters, which in a table cell is a
  // paragraph pretending to be a label. Cap at a word boundary; the agent file is the full read.
  if (d.length > 180) {
    const cut = d.slice(0, 180);
    d = cut.slice(0, cut.lastIndexOf(' ')).trimEnd() + '…';
  }
  return d;
}

function teamHtml(projectDir, stamp) {
  const modes = loadModes();
  const agentStage = {};
  for (const m of modes) for (const a of m.agents || []) {
    const name = typeof a === 'string' ? a : a.name;
    if (!(name in agentStage)) agentStage[name] = m.id;
  }
  const have = (stamp.agents || []).filter(Boolean);
  if (!have.length) return '<p>No agents recorded in this project\'s stamp yet.</p>';
  // Mentors first, then builders, each alphabetical: the two classes are the actual
  // distinction and interleaving them alphabetically hides it.
  const isMentor = (n) => /^mentor-/.test(n);
  const sorted = have.slice().sort((a, b) =>
    (isMentor(b) - isMentor(a)) || a.localeCompare(b));
  const rows = sorted.map((name) => {
    const stageId = agentStage[name];
    const mode = modes.find((m) => m.id === stageId);
    return `<tr><td><code>${esc(name)}</code></td><td>${
      isMentor(name) ? 'mentor' : 'builder'}</td><td>${
      esc(mode ? mode.name : '')}</td><td><div class="cell">${esc(fill(agentDescription(projectDir, name, stageId), stamp.name))}</div></td></tr>`;
  }).join('\n');
  return `<p><strong>Builders make the product; mentors coach you.</strong> They arrive as the
    project earns them, and nothing is ever removed by climbing a rung.</p>
    <div class="tw"><table><thead><tr><th>agent</th><th>class</th><th>arrived at</th><th>what it is for</th></tr></thead><tbody>
${rows}
</tbody></table></div>`;
}


// The complete index — every rung in full, unlocked or not. This is what the website's
// `quick-guide.html` was for ("the whole surface on one page"), and it is the one thing the
// project-scoped sections deliberately withhold: `__skills` shows your working set, and the
// next rung only as its curated `headline`.
//
// The two are different jobs and the duplication is intentional here: a working set is read
// top-to-bottom, an index is searched. Every rung ships COLLAPSED except the one you are on,
// so a complete reference costs nothing to scroll past but everything is present in the DOM
// and therefore findable with ctrl-F — which is how anybody actually uses an index.
function surfaceHtml(projectDir, stamp) {
  const modes = loadModes();
  const skillStage = {};
  for (const m of modes) for (const sk of m.skills || []) if (!(sk in skillStage)) skillStage[sk] = m.id;
  const installed = stamp.installedLayers || [stamp.stage];
  const deepest = installed[installed.length - 1];
  const have = new Set(stamp.skills || []);
  const byId = Object.fromEntries(modes.map((m) => [m.id, m]));

  const blocks = STAGE_ORDER.map((id) => {
    const mode = byId[id];
    if (!mode || !(mode.skills || []).length) return '';
    const own = (mode.skills || []).filter((sk) => skillStage[sk] === id).sort();
    if (!own.length) return '';
    const yours = own.filter((sk) => have.has(sk)).length;
    const plural = own.length === 1 ? 'skill' : 'skills';
    const state = installed.includes(id)
      ? `unlocked · ${yours} of ${own.length} installed`
      : `not unlocked · ${own.length} ${plural}`;
    const rows = own.map((sk) => {
      const file = join(projectDir, '.claude', 'skills', sk, 'SKILL.md');
      const g = existsSync(file) ? skillGloss(file) : skillGloss(packageSkillMd(id, sk));
      const usage = fill(g && g.usage, stamp.name);
      return `<tr><td><code>/${esc(sk)}</code>${have.has(sk) ? '' : ' <span class="soon">·</span>'}</td><td><div class="cell">${
        esc(fill(g && g.gloss, stamp.name))}${
        usage ? `<br><span class="usage">${esc(usage)}</span>` : ''}</div></td></tr>`;
    }).join('\n');
    return `<details${id === deepest ? ' open' : ''}><summary>${esc(mode.name)} <span class="n">${esc(state)}</span></summary>
      <div class="tw"><table><tbody>\n${rows}\n</tbody></table></div></details>`;
  }).filter(Boolean).join('\n');

  return `<p>Every rung, complete — including the ones this project has not climbed. A
    <span class="soon">·</span> marks a skill you do not have yet. The rung you are on is open;
    the rest are folded, and everything is searchable with ctrl-F whether it is folded or not.</p>
${blocks}`;
}

function glossaryHtml() {
  const rows = Object.entries(GLOSSARY).sort(([a], [b]) => a.localeCompare(b)).map(([term, d]) =>
    `<tr><td><code>${esc(term)}</code></td><td><div class="cell">${esc(d.what)}${
      d.more ? `<br><span class="more">${esc(d.more)}</span>` : ''}${
      d.see ? `<br><span class="more">met at <code>${esc(d.see)}</code></span>` : ''}</div></td></tr>`).join('\n');
  return `<div class="tw"><table><thead><tr><th>word</th><th>what it means</th></tr></thead><tbody>\n${rows}\n</tbody></table></div>`;
}

function symbolsHtml() {
  return `<div class="tw"><table><tbody>${SYMBOLS.map(([g, meaning, tone]) =>
    `<tr><td class="glyph ${esc(tone)}">${esc(g)}</td><td>${esc(meaning)}</td></tr>`).join('')}</tbody></table></div>`;
}

// ---- the page --------------------------------------------------------------
export function renderHelpHtml(projectDir, stamp, stampedAt) {
  const V = bossVersion();
  const installed = stamp.installedLayers || [stamp.stage];
  const deepest = installed[installed.length - 1];
  const frags = fragments();
  const bySection = Object.fromEntries(frags.map((f) => [f.meta.section || f.file, f]));

  // Order is explicit, not fragment order: generated and hand-written sections interleave,
  // and the sequence is the argument — where you are, what you can run, what to reach for,
  // then the deeper why, then the reference tables, then how to leave.
  const plan = [
    ['orientation', 'What this is'],
    ['__skills', 'Everything you can run'],
    ['__wayfinding', 'I want to…'],
    ['ladder', 'The ladder'],
    ['__commands', 'The terminal commands'],
    ['records', 'What BOSS writes down'],
    ['conscience', 'The conscience'],
    ['__team', 'Your team'],
    ['__glossary', 'Words'],
    ['__symbols', 'Symbols'],
    ['__surface', 'The whole surface'],
    ['removing', 'Taking it back out'],
  ];

  const generated = {
    __skills: () => skillsHtml(projectDir, stamp),
    __wayfinding: () => wayfindingHtml(stamp),
    __commands: () => commandsHtml(),
    __team: () => teamHtml(projectDir, stamp),
    __glossary: () => glossaryHtml(),
    __symbols: () => symbolsHtml(),
    __surface: () => surfaceHtml(projectDir, stamp),
  };

  const sections = [];
  const toc = [];
  for (const [key, fallbackTitle] of plan) {
    const frag = bySection[key];
    if (!frag && !generated[key]) continue;
    const title = frag ? (frag.meta.title || fallbackTitle) : fallbackTitle;
    const id = key.replace(/^__/, '');
    toc.push(`<li><a href="#${esc(id)}">${esc(fallbackTitle)}</a></li>`);
    const body = frag ? frag.body : generated[key]();
    // The short TOC name sits above the heading only when the heading says something else;
    // a label that repeats the h2 under it is the kicker-above-heading tell, not wayfinding.
    const label = title !== fallbackTitle ? `\n  <p class="eyebrow">${esc(fallbackTitle)}</p>` : '';
    sections.push(`<section id="${esc(id)}">${label}
  <h2>${esc(title)}</h2>
  ${body}
</section>`);
  }

  return `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(stamp.name)} — BOSS guide</title>
<meta name="generator" content="BOSS ${esc(V)}">
<style>
${stylesheet()}
</style>
</head><body>
<div class="wrap">
<header class="top">
  <p class="kicker"><b>${esc(stamp.name)}</b>, the guide</p>
  <h1>Everything this project has, and why.</h1>
  <p class="lede">Generated from this project — not the BOSS website. Every skill and command
    below is one you actually have right now. Rebuild it any time with
    <code>boss help --html</code>.</p>
  ${ladderHtml(installed, deepest)}
  <p class="stamp">You are here: <b>${esc(stamp.mode || stamp.stage)}</b>, with
    ${(stamp.skills || []).length} skills and ${(stamp.agents || []).length} agents.
    BOSS pinned <b>${esc(stamp.bossVersion || '—')}</b>, installed <b>${esc(V)}</b>${
    stampedAt ? `, generated ${esc(stampedAt)}` : ''}.</p>
</header>
<nav class="toc" aria-label="Sections"><ul>
${toc.join('\n')}
</ul></nav>
${sections.join('\n')}
<footer>
  <p><b>This page is a read, not a document.</b> Nothing here is maintained by hand — it is
  rebuilt from your project's own stamp and BOSS's manifests each time you run
  <code>boss help --html</code>. If it looks stale, it is: run it again.</p>
  <p>The terminal has the same answers, faster: <code>boss help</code>,
  <code>boss map</code>, <code>boss status</code> and <code>boss help &lt;command&gt;</code>.</p>
</footer>
</div>
</body></html>
`;
}

// Write the guide and return its path. Mirrors boardHtml (src/board.js) deliberately:
// same destination folder, same gitignored-by-default posture, same "re-run to refresh".
export function helpHtml(projectDir, stamp) {
  const dir = join(projectDir, '.boss');
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  const stampedAt = new Date().toISOString().slice(0, 10);
  const out = join(dir, 'help.html');
  writeFileSync(out, renderHelpHtml(projectDir, stamp, stampedAt));
  return out;
}
