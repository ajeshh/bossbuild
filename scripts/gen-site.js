#!/usr/bin/env node
// Generates site/*.html from site/pages/*.html fragments + the SAME stage
// manifests `boss map` and `gen:docs` read (src/modes.js). The whole point:
//
//   NO NUMBER ON THE WEBSITE IS EVER TYPED BY HAND.
//
// Agent rosters, skill lists, per-mode counts and the governance tallies are all
// derived at build time, so a release cannot ship a site that disagrees with the
// product. This is the same fix as IDEA-018/gen:docs — CHEATSHEET.md drifted for
// 56 releases because its generator was wired to nothing. Wire it to something.
//
//   npm run gen:site
//
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync, copyFileSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { BOSS_ROOT, bossVersion } from '../src/paths.js';
import { loadModes, packageSkillMd, skillGloss, modeWord, STANDING_COMMANDS } from '../src/modes.js';
// ONE implementation of "what did this release say to a founder", read by both surfaces. The CLI
// had no copy of this at all until v0.256.0 and printed the raw entry instead; giving it one would
// have made two, and two copies of a rule is how the rule drifts. See src/changelog.js.
import { forYou, parseEntries } from '../src/changelog.js';
// The showcase (FEAT-039): demo/kettlewick/ rendered by the real renderers into site/demo/.
import { generate as generateDemo } from './gen-demo.js';
import { markSvg, faviconDataUri } from './mark.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
// web/ is SOURCE (page fragments, the shell, the stylesheets).
// site/ is pure BUILD OUTPUT — everything in it, and nothing else, is deployable.
// That split exists so "upload the site folder" can never accidentally publish a
// half-rendered fragment or the layout template.
const SRC = join(ROOT, 'web');
const SITE = join(ROOT, 'site');
const PAGES = SRC;
const DATA = join(SRC, '_data.json');

const V = bossVersion();
const modes = loadModes().filter((m) => m.authored);


// The BOSS mark — the built B, Ajesh's own (web/boss-logo-mark.svg; DEC-021, 2026-09-14). Read
// through scripts/mark.js, never retyped: the lockup, the hero rail, the favicon and the demo
// ribbon are one file. The site's small cut (≤ ~24px: the nav, the favicon) widens the seams so the
// parts stay separate; the hero rail gets the large cut. Until 2026-09-14 the mark was the CLI's
// `✦`, chosen because the terminal already printed it; the built B cannot be a glyph, so the site's
// mark and the CLI's success glyph are now two things, and VISUAL.md says so.
const MARK = (cls = 'mark', cut = 'small') => markSvg({ cls, cut });

// The favicon is the same mark, and the ONE place the site needs literal hexes —
// so they are READ from tokens.css rather than typed. A <link> and a <meta> cannot
// reference a CSS custom property, and a second copy of the brand colour is
// exactly the 47-blues failure tokens.css's header forbids.
const TOKENS = readFileSync(join(SRC, 'styles', 'tokens.css'), 'utf8');
const token = (name) => {
  const m = TOKENS.match(new RegExp(`^\\s*--${name}:\\s*(#[0-9A-Fa-f]{3,8})`, 'm'));
  if (!m) throw new Error(`gen:site cannot read --${name} from tokens.css`);
  return m[1];
};
// Inline SVG favicon: no request, no binary, scales to any tab density. The small cut, in the
// ice-ground pair (cornflower reads on light and dark tab bars; the authored sky would not on light).
const favicon = () => faviconDataUri({ face: token('cornflower'), bowl: token('persimmon') });
// Painted before first paint, so the browser chrome matches the ground instead of
// flashing white into a graphite page. Two values, one per scheme — same split as
// the stylesheet, read from the same file.
const HEAD_ICONS = () =>
  `<link rel="icon" href="${favicon()}" />\n`
  + `<meta name="theme-color" content="${token('ice')}" media="(prefers-color-scheme: light)" />\n`
  + `<meta name="theme-color" content="${token('deep')}" media="(prefers-color-scheme: dark)" />`;

// Inline markdown → HTML, escape-first so nothing user-authored can inject markup.
const md = (s) => esc(s)
  .replace(/`([^`]+)`/g, '<code>$1</code>')
  .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  .replace(/\*([^*]+)\*/g, '<em>$1</em>')
  // Links, http(s) or site-relative only. This renderer handled code/bold/italic and NOT
  // links for the site's whole life, which held while no "For you:" line used one —
  // v0.198.0's canvas announcement was the first, and shipped literal [a page](https://…)
  // to the public feed. A release feed is the one surface whose whole job is pointing.
  .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+|\/[^)\s]*)\)/g, '<a href="$2">$1</a>');

const esc = (s) => String(s || '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
// Package templates carry scaffold-time placeholders; they read wrong in generic copy.
const clean = (s) => (s || '').replace(/\{\{PROJECT_NAME\}\}/g, 'your app').replace(/\{\{[^}]+\}\}/g, '');

// ---- agents ---------------------------------------------------------------
function agentMd(stageId, name) {
  return join(ROOT, 'stages', stageId, 'template', '.claude', 'agents', `${name}.md`);
}

// An agent's description is one dense line ending in "Trigger phrases - …".
// Split it into a gloss (what it does) and the triggers (when it shows up).
function agentInfo(stageId, name) {
  const p = agentMd(stageId, name);
  if (!existsSync(p)) return { name, gloss: '', triggers: '', missing: true };
  const m = readFileSync(p, 'utf8').match(/^---\n([\s\S]*?)\n---/);
  const desc = m ? (m[1].match(/^description:\s*(.*)$/m) || [, ''])[1] : '';
  const t = desc.search(/\bTrigger phrases\s*[-:]/i);
  const body = clean((t === -1 ? desc : desc.slice(0, t)).trim());
  const triggers = t === -1 ? '' : clean(desc.slice(t).replace(/^Trigger phrases\s*[-:]\s*/i, '').trim());
  const dot = body.indexOf('. ');
  return {
    name,
    kind: name.startsWith('mentor-') ? 'mentor' : 'builder',
    gloss: (dot === -1 ? body : body.slice(0, dot + 1)).replace(/\.$/, '').trim(),
    full: body,
    triggers,
  };
}

const roster = modes.map((m) => ({
  id: m.id,
  word: modeWord(m.id),
  name: m.name,
  agents: m.agents.map((a) => agentInfo(m.id, a)),
  skills: m.skills.map((s) => {
    const { gloss, usage } = skillGloss(packageSkillMd(m.id, s));
    return { name: s, gloss: clean(gloss), usage: clean(usage) };
  }),
}));

// ---- counts (derived, never typed) ---------------------------------------
function countDir(dir, filter = (f) => f.endsWith('.md')) {
  const p = join(ROOT, dir);
  if (!existsSync(p)) return null;              // gitignored on a fresh clone
  return readdirSync(p).filter(filter).length;
}
function verdictSplit() {
  const p = join(ROOT, 'docs/research/verdicts');
  if (!existsSync(p)) return null;
  const out = { total: 0, ADOPT: 0, ADAPT: 0, REJECT: 0, 'NOT-YET': 0 };
  for (const f of readdirSync(p).filter((f) => f.endsWith('.md'))) {
    const m = readFileSync(join(p, f), 'utf8').match(/^verdict:\s*\**\s*([A-Z-]+)/m);
    out.total++;
    if (m && out[m[1]] !== undefined) out[m[1]]++;
  }
  return out;
}

// Sources that live in the gitignored dev workspace can't be counted from a clean
// clone. Carry the last known-good values forward rather than silently printing 0 —
// a website that quietly reports zero rejections is worse than one that's a release behind.
const prev = existsSync(DATA) ? JSON.parse(readFileSync(DATA, 'utf8')) : {};
const practices = countDir('library/practices') ?? prev.practices ?? null;
const verdicts = verdictSplit() ?? prev.verdicts ?? null;
if (countDir('library/practices') === null || verdictSplit() === null) {
  console.log('  note: dev-workspace sources unavailable — carrying forward committed counts.');
}

const data = {
  version: V,
  generated_from: 'stages/*/manifest.json via src/modes.js',
  agents: roster.reduce((n, m) => n + m.agents.length, 0),
  skills: roster.reduce((n, m) => n + m.skills.length, 0),
  mentors: roster.reduce((n, m) => n + m.agents.filter((a) => a.kind === 'mentor').length, 0),
  builders: roster.reduce((n, m) => n + m.agents.filter((a) => a.kind === 'builder').length, 0),
  modes: roster.map((m) => ({
    word: m.word, name: m.name,
    agents: m.agents.length, skills: m.skills.length,
    cumAgents: 0, cumSkills: 0,
  })),
  practices,
  verdicts,
};
let ca = 0, cs = 0;
for (const m of data.modes) { ca += m.agents; cs += m.skills; m.cumAgents = ca; m.cumSkills = cs; }
writeFileSync(DATA, JSON.stringify(data, null, 2) + '\n');

// ---- generated blocks -----------------------------------------------------
const blocks = {};

blocks.LADDER_TABLE = () => {
  const rows = roster.map((m, i) => {
    const b = m.agents.filter((a) => a.kind === 'builder').map((a) => a.name);
    const mn = m.agents.filter((a) => a.kind === 'mentor').map((a) => a.name.replace(/^mentor-/, ''));
    const d = data.modes[i];
    return `      <tr>
        <th scope="row">${esc(m.name)}</th>
        <td>${b.length ? (i ? '+ ' : '') + b.map((x) => `<code>${esc(x)}</code>`).join(' ') : '<span class="t-none">—</span>'}</td>
        <td>${mn.length ? (i ? '+ ' : '') + mn.map((x) => `<code>${esc(x)}</code>`).join(' ') : '<span class="t-none">—</span>'}</td>
        <td class="num"><b>${d.cumAgents}</b></td>
        <td class="num">${d.cumSkills}</td>
      </tr>`;
  }).join('\n');
  return `<div class="tablewrap">
    <table class="ladder">
      <caption>Who is on the project at each rung. Nothing is ever removed — the roster only grows.</caption>
      <thead><tr><th scope="col">Mode</th><th scope="col">Builders</th><th scope="col">Mentors</th><th scope="col" class="num">Team</th><th scope="col" class="num">Skills</th></tr></thead>
      <tbody>
${rows}
      </tbody>
    </table>
  </div>`;
};


// The mode ladder as a TRAIN LINE, not a table. EVID-001's founder asked in as many
// words to see "a train line where I can see where I am and that I'm moving" — and
// the team count is what actually grows along it, so the line carries the roster.
blocks.LADDER_LINE = () => {
  const stations = roster.map((m, i) => {
    const d = data.modes[i];
    const authored = d.skills > 0;
    return `      <li class="station${authored ? '' : ' thin'}">
        <span class="dot" aria-hidden="true"></span>
        <span class="stop">${esc(m.name)}</span>
        <span class="crew"><b>${d.cumAgents}</b> on the team</span>
        <span class="verbs">${d.cumSkills} skills</span>
      </li>`;
  }).join('\n');
  return `<div class="line-wrap">
    <ol class="trainline">
${stations}
    </ol>
    <p class="line-note">You unlock each stop. Nothing is ever removed — the roster only grows.</p>
  </div>`;
};

// One card per rung, read from the manifest the CLI reads (IDEA-117 §8): the summary, who
// arrives, the core loop, what is folded until earned, and the unlock line. The guide's prose
// folds under each card; the card itself cannot lag the product because it never typed a verb.
const chips = (names, cls = '') => `<ul class="chips${cls ? ` ${cls}` : ''}">${names.map((n) => `<li><code>${esc(n)}</code></li>`).join('')}</ul>`;
const EARNED = { shipped: 'folded until a feature ships', 'llm-in-source': 'folded until the app calls a model' };
const rungCard = (m, i) => {
  const mode = loadModes().find((x) => x.id === m.id);
  const d = data.modes[i];
  const core = mode.coreLoop || [];
  const groups = [];
  for (const [key, when] of Object.entries(mode.earned || {})) {
    const names = (mode[key] || []).filter((s) => !core.includes(s));
    if (names.length) groups.push({ label: EARNED[when] || `folded until ${when}`, names });
  }
  const grouped = new Set([...core, ...groups.flatMap((g) => g.names)]);
  const rest = m.skills.map((s) => s.name).filter((s) => !grouped.has(s));
  const agents = m.agents.map((a) => a.name);
  const hint = esc(mode.graduationHint || '').replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/(boss unlock [a-z0-9-]+)/g, '<code>$1</code>');
  return `<div class="rung" id="rung-${esc(m.word)}">
  <div class="rung-head">
    <h3>${esc(m.name)}</h3>
    <span class="rung-meta"><b>${d.cumAgents}</b> on the team · <b>${d.cumSkills}</b> skills</span>
  </div>
  <p class="rung-summary">${esc(mode.summary || '')}</p>
  <dl class="rung-rows">
    ${agents.length ? `<div><dt>arrives</dt><dd>${chips(agents, 'agents')}</dd></div>` : ''}
    ${core.length ? `<div><dt>the loop</dt><dd>${chips(core.map((s) => `/${s}`))}</dd></div>` : ''}
    ${rest.length ? `<div><dt>${core.length ? 'also' : 'verbs'}</dt><dd>${chips(rest.map((s) => `/${s}`))}</dd></div>` : ''}
    ${groups.map((g) => `<div><dt>${esc(g.label)}</dt><dd>${chips(g.names.map((s) => `/${s}`), 'folded')}</dd></div>`).join('\n    ')}
    ${hint ? `<div><dt>next</dt><dd class="rung-next">${hint}</dd></div>` : ''}
  </dl>
</div>`;
};
for (const [i, m] of roster.entries()) blocks[`RUNG_${m.word.toUpperCase().replace(/[^A-Z0-9]/g, '_')}`] = () => rungCard(m, i);

blocks.ROSTER = () => roster.map((m) => {
  if (!m.agents.length) return '';
  const cards = m.agents.map((a) => `        <div class="agent ${a.kind}">
          <h3><code>${esc(a.name)}</code> <span class="tag">${a.kind}</span></h3>
          <p>${esc(a.gloss)}.</p>
          ${a.triggers ? `<p class="triggers"><span>ask it</span> ${esc(a.triggers)}</p>` : ''}
        </div>`).join('\n');
  return `      <h3>Arrives at ${esc(m.name)}</h3>
      <div class="agents">
${cards}
      </div>`;
}).join('\n\n');

blocks.REFERENCE = () => roster.map((m) => {
  const rows = m.skills.map((s) => `          <tr>
            <th scope="row"><code>/${esc(s.name)}</code></th>
            <td>${esc(s.gloss)}${s.usage ? ` <span class="usage">${esc(s.usage)}</span>` : ''}</td>
          </tr>`).join('\n');
  return `      <h3>${esc(m.name)} <span class="count">${m.skills.length} skills</span></h3>
      <div class="tablewrap">
        <table class="skills">
          <tbody>
${rows}
          </tbody>
        </table>
      </div>`;
}).join('\n\n');


// "What's new", generated from registry/CHANGELOG.md — the same file `boss sync`
// reads to tell a project what changed since its pin. One source, two audiences.
blocks.WHATS_NEW = () => {
  const cl = join(ROOT, 'registry', 'CHANGELOG.md');
  if (!existsSync(cl)) return '<p class="small">Changelog unavailable at build time.</p>';
  // One parser for the CHANGELOG: `parseEntries` (src/changelog.js) — the same one `boss changelog`
  // and `boss sync` read, so an entry the site shows is an entry a founder can install. It never
  // returns `## Unreleased` (its heading is not a version) and it already separates a date from a
  // title, which this file's own head regex used to get wrong (a titled heading landed in the
  // date column).
  const out = [];
  for (const entry of parseEntries(readFileSync(cl, 'utf8'))) {
    // OPT-IN: a release reaches the public feed only if it carries a "For you:" line. Most
    // releases are internal — audits, refactors, doc sweeps — and a feed that lists those is a
    // commit log, not a reason for anyone to care. The block is multi-line and there can be more
    // than one; `forYou` reads all of them.
    const forYouLines = forYou(entry);
    if (!forYouLines.length) continue;
    out.push(`      <li>
        <div class="rel"><span class="ver">v${esc(entry.version)}</span><span class="when">${esc(entry.date || entry.title || '')}</span></div>
        ${forYouLines.map((t) => `<p>${md(t)}</p>`).join('\n        ')}
      </li>`);
    if (out.length >= 12) break;
  }
  if (!out.length) return '<p class="small">No user-facing releases recorded yet.</p>';
  return `<ol class="releases">\n${out.join('\n')}\n    </ol>`;
};



// ---- diagrams -------------------------------------------------------------
// Hand-authored inline SVG: no library, no runtime, currentColor so both themes
// work, one hi-vis element carrying the claim. Each figure makes ONE point.
// Secondary labels take the token (`--color-text-secondary`), never `opacity` — an
// opacity stack is what a pixel-contrast check reads as invisible text, and it was
// (2026-09-12). Nothing in a figure is set under 13 units: at the figure's 52rem
// max width that is ~12.6px, the smallest text on the site.

blocks.DIAGRAM_CONSCIENCE = () => `<figure class="fig">
  <svg viewBox="0 0 860 300" role="img" aria-label="A mechanical hook reads project state on every prompt and evaluates a named condition. When the condition does not hold, which is the usual case, nothing happens. Only when it holds is a model asked to compose the words. The model never decides whether to speak."
       xmlns="http://www.w3.org/2000/svg">
    <defs>
      <marker id="ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M0 0 L10 5 L0 10 z" fill="currentColor"/>
      </marker>
    </defs>
    <g fill="none" stroke="currentColor" stroke-width="1.5" marker-end="url(#ar)">
      <line x1="196" y1="150" x2="248" y2="150"/>
      <path d="M468 150 H500 V74 H540"/>
      <path d="M468 150 H500 V214 H540"/>
      <line x1="796" y1="214" x2="844" y2="214"/>
    </g>
    <g stroke="currentColor" stroke-width="1.5" fill="none">
      <rect x="16" y="118" width="180" height="64" rx="3"/>
      <rect x="248" y="118" width="220" height="64" rx="3"/>
      <rect x="540" y="44" width="180" height="60" rx="3"/>
    </g>
    <rect x="540" y="182" width="256" height="64" rx="3" fill="var(--color-brand)" stroke="none"/>
    <g font-family="system-ui, sans-serif" font-size="13.5" fill="currentColor" text-anchor="middle">
      <text x="106" y="146">project state</text>
      <text x="106" y="167" font-size="13" fill="var(--color-text-secondary)">files on disk</text>
      <text x="358" y="146">hook</text>
      <text x="358" y="167" font-size="13" fill="var(--color-text-secondary)">a mechanical condition</text>
      <text x="630" y="70">silence</text>
      <text x="630" y="89" font-size="13" fill="var(--color-text-secondary)">the usual path</text>
    </g>
    <g font-family="system-ui, sans-serif" font-size="13.5" fill="var(--color-on-brand)" text-anchor="middle">
      <text x="668" y="210">model composes the words</text>
      <text x="668" y="230" font-size="13">only now is a model involved</text>
    </g>
    <g font-family="system-ui, sans-serif" font-size="13" fill="var(--color-text-secondary)">
      <text x="222" y="140" text-anchor="middle">read</text>
      <text x="508" y="66">not met</text>
      <text x="508" y="236">met</text>
      <text x="820" y="205" text-anchor="middle">one</text>
      <text x="820" y="219" text-anchor="middle">message,</text>
      <text x="820" y="233" text-anchor="middle">then quiet</text>
    </g>
  </svg>
  <figcaption><strong>The model never decides whether to speak.</strong> A hook evaluates a named
    condition against files on disk; only once it fires is a model asked to compose anything. Nothing
    ever asks a model “is this person drifting?” — which is why the judgment is inspectable, arguable,
    and switchable off.</figcaption>
</figure>`;

blocks.DIAGRAM_PRACTICE_FLOW = () => `<figure class="fig">
  <svg viewBox="0 0 860 250" role="img" aria-label="The practice shelf is distilled into the agent prompts, which apply it while your code is written. You can also read the shelf directly with boss craft, but you never have to."
       xmlns="http://www.w3.org/2000/svg">
    <defs>
      <marker id="ar2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M0 0 L10 5 L0 10 z" fill="currentColor"/>
      </marker>
    </defs>
    <g fill="none" stroke="currentColor" stroke-width="1.5" marker-end="url(#ar2)">
      <line x1="242" y1="76" x2="312" y2="76"/>
      <line x1="560" y1="76" x2="630" y2="76"/>
      <path d="M129 108 V186 H312" stroke-dasharray="5 4"/>
    </g>
    <g stroke="currentColor" stroke-width="1.5" fill="none">
      <rect x="16" y="44" width="226" height="64" rx="3"/>
      <rect x="630" y="44" width="214" height="64" rx="3"/>
      <rect x="312" y="158" width="268" height="56" rx="3" stroke-dasharray="5 4"/>
    </g>
    <rect x="312" y="44" width="248" height="64" rx="3" fill="var(--color-brand)" stroke="none"/>
    <g font-family="system-ui, sans-serif" font-size="13.5" fill="currentColor" text-anchor="middle">
      <text x="129" y="72">the practice shelf</text>
      <text x="129" y="93" font-size="13" fill="var(--color-text-secondary)">attributed · dated · versioned</text>
      <text x="737" y="72">your code, your screens,</text>
      <text x="737" y="93">your schema</text>
      <text x="446" y="184" font-size="12.5">boss craft &lt;name&gt;</text>
      <text x="446" y="202" font-size="13" fill="var(--color-text-secondary)">read the source yourself — optional</text>
    </g>
    <g font-family="system-ui, sans-serif" font-size="13.5" fill="var(--color-on-brand)" text-anchor="middle">
      <text x="436" y="72">the agents that do the work</text>
      <text x="436" y="93" font-size="13">carry it distilled, in their prompts</text>
    </g>
    <g font-family="system-ui, sans-serif" font-size="13" fill="var(--color-text-secondary)" text-anchor="middle">
      <text x="277" y="66">distilled into</text>
      <text x="595" y="66">applied while</text>
    </g>
  </svg>
  <figcaption><strong>You never have to read the shelf.</strong> The practice is distilled into the
    prompt of the agent whose job it is, so <code>mentor-architect</code> already knows about row-level
    security and <code>tester</code> already knows that agents rewrite assertions to match broken
    behaviour. <code>boss craft &lt;name&gt;</code> is there if you want the full reasoning.</figcaption>
</figure>`;


// ---- the record system ----------------------------------------------------
// Parsed out of the IDS.md a founder actually receives, not out of BOSS's own. The
// two have drifted before (BOSS ran a seven-word closed status vocabulary while the
// template still shipped six and called the list open), and a page describing the
// private version would be selling something nobody installs. Parse the shipped file
// and the claim is true by construction.
const SHIPPED_IDS = join(ROOT, 'stages', 'L0-quickstart', 'template', 'docs', 'IDS.md');

function idsTables() {
  const md = readFileSync(SHIPPED_IDS, 'utf8');
  const ids = [];
  const status = [];
  let section = '';
  for (const raw of md.split('\n')) {
    const h = /^##\s+(.+?)\s*$/.exec(raw);
    if (h) { section = h[1]; continue; }
    if (!raw.startsWith('|')) continue;
    const cells = raw.split('|').slice(1, -1).map((c) => c.trim());
    // Only rows whose first cell is a code span are data — this skips the header
    // row ("Prefix", "Status") and the |---| separator without hardcoding either.
    if (!/^`.+`$/.test(cells[0])) continue;
    if (/^Status/i.test(section) && cells.length === 2) {
      status.push({ word: cells[0].replace(/`/g, ''), means: cells[1] });
    } else if (cells.length === 3) {
      const active = /^Active in/i.test(section);
      ids.push({
        prefix: cells[0].replace(/`/g, ''),
        means: cells[1],
        mode: active ? (/Active in (.+?) mode/i.exec(section) || [, 'Quickstart'])[1] : cells[2],
        active,
      });
    }
  }
  if (!ids.length || !status.length) {
    console.error(`  ✗ could not parse the shipped IDS.md (${ids.length} ids, ${status.length} statuses)`);
    process.exitCode = 1;
  }
  return { ids, status };
}
const IDS = idsTables();

// Inline code spans are the only markdown these cells carry; anything else is a sign
// the template grew a construct this parser would silently flatten.
const md1 = (s) => esc(s).replace(/`([^`]+)`/g, '<code>$1</code>')
  .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/\*([^*]+)\*/g, '<em>$1</em>');

blocks.ID_LADDER = () => `<div class="tablewrap"><table>
  <thead><tr><th>ID</th><th>What it holds</th><th>You get it at</th></tr></thead>
  <tbody>${IDS.ids.map((r) => `
    <tr><td><code>${esc(r.prefix)}</code></td><td>${md1(r.means)}</td>
    <td>${r.active ? '<strong>day one</strong>' : md1(r.mode)}</td></tr>`).join('')}
  </tbody></table></div>`;

blocks.COUNT_ID_TYPES = () => String(IDS.ids.length);
blocks.COUNT_ID_DAY_ONE = () => String(IDS.ids.filter((r) => r.active).length);
blocks.COUNT_STATUS = () => String(IDS.status.length);

blocks.STATUS_VOCAB = () => `<div class="pairs">${IDS.status.map((s) => `
  <div class="pair"><span class="k">${esc(s.word)}</span><span>${md1(s.means)}</span></div>`).join('')}
</div>`;

blocks.DIAGRAM_RECORDS = () => `<figure class="fig">
  <svg viewBox="0 0 860 330" role="img" aria-label="Each record file carries its own status in frontmatter. The boss board command reads those files and renders a view of them. There is no board file and no status document — the view is produced on demand and thrown away, so there is nothing that can disagree with the files."
       xmlns="http://www.w3.org/2000/svg">
    <defs>
      <marker id="ar3" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M0 0 L10 5 L0 10 z" fill="currentColor"/>
      </marker>
    </defs>
    <g stroke="currentColor" stroke-width="1.5" fill="none">
      <rect x="16" y="34" width="176" height="54" rx="3"/>
      <rect x="16" y="110" width="176" height="54" rx="3"/>
      <rect x="16" y="186" width="176" height="54" rx="3"/>
      <rect x="292" y="110" width="152" height="54" rx="3"/>
    </g>
    <g fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M192 61 H236" /><path d="M192 137 H236" /><path d="M192 213 H236" />
      <path d="M236 61 V213" />
    </g>
    <g fill="none" stroke="currentColor" stroke-width="1.5" marker-end="url(#ar3)">
      <path d="M236 137 H286" />
      <path d="M444 137 H494" />
    </g>
    <rect x="494" y="34" width="350" height="206" rx="3" fill="var(--color-brand)" stroke="none"/>
    <g font-family="system-ui, sans-serif" font-size="13" fill="currentColor" text-anchor="middle">
      <text x="104" y="57">IDEA-014.md</text>
      <text x="104" y="133">FEAT-003.md</text>
      <text x="104" y="209">DEC-007.md</text>
      <text x="368" y="133">boss board</text>
    </g>
    <g font-family="system-ui, sans-serif" font-size="13" fill="var(--color-text-secondary)" text-anchor="middle">
      <text x="104" y="76">status: exploring</text>
      <text x="104" y="152">status: building</text>
      <text x="104" y="228">status: shipped</text>
      <text x="368" y="152">reads the folder</text>
      <text x="264" y="128">status</text>
      <text x="469" y="128">render</text>
    </g>
    <g font-family="system-ui, sans-serif" fill="var(--color-on-brand)">
      <text x="518" y="62" font-size="12.5" font-weight="600">Captured</text>
      <text x="518" y="84" font-size="13">IDEA-014</text>
      <text x="518" y="127" font-size="12.5" font-weight="600">Taking shape</text>
      <text x="518" y="149" font-size="13">— empty —</text>
      <text x="686" y="62" font-size="12.5" font-weight="600">Building</text>
      <text x="686" y="84" font-size="13">FEAT-003</text>
      <text x="686" y="127" font-size="12.5" font-weight="600">Shipped</text>
      <text x="686" y="149" font-size="13">DEC-007</text>
      <text x="518" y="206" font-size="13">rendered on read,</text>
      <text x="518" y="222" font-size="13">never written down</text>
    </g>
    <g stroke="currentColor" stroke-width="1.5" fill="none" opacity="0.4" stroke-dasharray="5 4">
      <rect x="292" y="256" width="152" height="48" rx="3"/>
      <path d="M368 164 V256" />
    </g>
    <g font-family="system-ui, sans-serif" fill="var(--color-text-secondary)" text-anchor="middle">
      <text x="368" y="280" font-size="12.5">a status doc</text>
      <text x="368" y="297" font-size="13">does not exist</text>
    </g>
  </svg>
  <figcaption><strong>The view is a render, never a record.</strong> Status lives in one place — the
    frontmatter of the file the work is about. <code>boss board</code> reads the folder and draws the
    columns on demand. There is no board file and no status doc to update, which is why nothing here
    can quietly disagree with anything else. <strong>The empty column is drawn on purpose</strong> — a
    stage with nothing in it is the most useful cell on the board.</figcaption>
</figure>`;


// ---- practices: the attribution layer ------------------------------------
// Every practice file carries `curve:` (how fast its ground moves), `last_reviewed:`,
// and TWO provenance fields. The engineering page renders that metadata rather than
// restating it by hand — attribution that has to be retyped is attribution that goes stale.
//
// WHY TWO FIELDS (v0.178.0). `provenance:` is the internal build record: how BOSS came to
// believe a thing, in BOSS's own filing vocabulary — review numbers, idea numbers, the audit
// that caught the mistake, the dogfooded product a pattern was ported up from. It is the most
// honest field in the repo and it is written for us. It was also being piped verbatim into a
// public page, which published 43 identifiers pointing at gitignored directories no reader can
// open, and named an unrelated product of the author's six times.
//
// `provenance_public:` is the half a reader can actually use: who we learned it from, and what
// it cost us to find out. The site renders ONLY that. A practice with no `provenance_public:`
// gets no provenance block — silence beats a leak, and the omission is visible on the page,
// which is what makes it get written. The guard below enforces the boundary rather than
// trusting whoever writes the next one.
function loadPractices() {
  const dir = join(ROOT, 'library', 'practices');
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter((f) => f.endsWith('.md')).map((f) => {
    const raw = readFileSync(join(dir, f), 'utf8');
    const fm = (raw.match(/^---\n([\s\S]*?)\n---/) || [, ''])[1];
    const get = (k) => {
      const m = fm.match(new RegExp('^' + k + ':\\s*([\\s\\S]*?)(?=\\n[a-z_]+:|$)', 'm'));
      return m ? m[1].replace(/\s+/g, ' ').trim() : '';
    };
    const title = (raw.match(/^#\s+(.+)$/m) || [, f.replace(/\.md$/, '')])[1]
      .replace(/^Practice\s*[:—–-]\s*/i, '').replace(/^PRACTICE-\S+\s*/i, '').trim();
    return { id: f.replace(/\.md$/, ''), title, owner: get('owner'),
             curve: get('curve'), reviewed: get('last_reviewed'),
             provenance: get('provenance_public') };
  });
}
// The boundary, enforced at generation. BOSS's internal ids resolve in a gitignored directory
// and nowhere else; publishing one is a citation to a filing system the reader cannot open.
// Hard failure, not a warning: a warning in a build script is a warning nobody reads.
const PRIVATE_ID = /\b(IDEA|FEAT|RVW|EVID|REVIEW|SESSION|RESEARCH-COMPENDIUM)-\d|\bdhun\b|docs\/(research|ideas|decisions|dossier|design|business|evidence)\//i;

const practiceDocs = loadPractices();
for (const p of practiceDocs) {
  const hit = p.provenance.match(PRIVATE_ID);
  if (hit) {
    console.error(`\n  gen:site — INTERNAL REFERENCE IN A PUBLIC FIELD\n`);
    console.error(`      library/practices/${p.id}.md`);
    console.error(`        provenance_public: names "${hit[0]}"\n`);
    console.error(`  That field is rendered on the public site. BOSS's own ids (IDEA/FEAT/RVW/...),`);
    console.error(`  the dogfood product names, and links into gitignored docs/ belong in`);
    console.error(`  \`provenance:\` — the internal record, which is not published.\n`);
    process.exit(1);
  }
}
const byId = Object.fromEntries(practiceDocs.map((p) => [p.id, p]));

// Topic groups for the engineering page. Explicit on purpose — and CHECKED below,
// so adding a practice to the library forces a decision here instead of silently
// vanishing from the site. (It has already caught one: automation.md, added mid-flight.)
const ENG_GROUPS = [
  ['Building with agents', 'The harness, the context window, what gets written down — and what stays deterministic.',
   ['harness-engineering', 'context-discipline', 'documentation', 'skill-authoring', 'model-routing', 'automation']],
  ['Security', 'The failure modes specific to agentic systems, and the ones AI-written code introduces.',
   ['agent-security', 'data-schema']],
  ['Testing & quality', 'Why an agent going green is not the same as the code being right.',
   ['testing-with-agents', 'quality-ratchet', 'git-workflow', 'revalidation']],
  ['Data, retrieval & protocols', 'What NOT to build yet, mostly.',
   ['retrieval', 'mcp']],
  ['Shipping & scale', 'Getting it live, and what to do when it grows.',
   ['ship-it-live', 'feature-flags', 'scalable-architecture', 'seed-to-scale']],
  // NOTE: `documentation` sits in "Building with agents" ONLY — it was listed here a
  // second time under its own heading, so it rendered twice and inflated the practice
  // count. One practice, one group. Its founder-facing half is keeping-track.html.
  ['Design & interface', 'The failure modes that appear by default when AI writes your UI.',
   ['design-system', 'ai-ux-patterns', 'accessibility']],
  // A group of one, deliberately, rather than filed under a heading it does not belong to. The
  // alternative was "Testing & quality", whose own description is about code being right — and a
  // practice about weighing somebody else's advice is not that. A thin honest group beats a
  // plausible wrong one; the next practice of this kind has somewhere to land.
  ['Judgment', 'What to do when a stranger tells you how to build.',
   ['outside-claims']],
];
// The other three shelves. Until 2026-09-13 only ENG_GROUPS existed, so a product-shaped
// practice had nowhere to be rendered — twelve of thirty-four were surfaced on no page, and
// eleven of those were also the ones with no public provenance. Not excluded; there was no
// door. The exactly-one check below found two more the hand count missed (accessibility,
// deceptive-patterns) on its first run. Each page renders its own shelf now, from the same files, with the same receipt.
const PRODUCT_GROUPS = [
  ['Finding fit', 'Getting the first users to a real result, and keeping them.',
   ['activation', 'retention', 'analytics-for-ai-products']],
  ['Money', 'From the first dollar to operating it.',
   ['first-dollar', 'monetization-in-practice']],
  ['Going public', 'The first page a stranger sees.',
   ['landing-page']],
];
const PROJECT_GROUPS = [
  ['The founder', 'How the job changes as the thing grows, and how a threshold gets marked.',
   ['founder-role-shifts', 'celebration-of-done']],
  ['The team', 'Bringing AI to people without breeding resentment.',
   ['ai-adoption-culture']],
];
const CONSCIENCE_GROUPS = [
  ['How the conscience speaks', 'What it names, and the one thing it never does.',
   ['conscience-voicing', 'harm-taxonomy', 'deceptive-patterns']],
];
// A practice that ships but is deliberately rendered on no craft page. Empty today; an entry
// here needs a reason, because a silent skip is how the twelve went missing in the first place.
const SHELF_EXEMPT = new Map([
  // ['some-practice', 'why no page shows it'],
]);

{
  // Every practice appears in EXACTLY ONE group across the four shelves, or is exempt with a
  // reason. Exactly-one rather than at-least-one: a practice in two groups is a categorisation
  // someone fudged, and it rendered twice once (documentation.md). Both directions fail the
  // build — an unclassified practice used to be carried into a catch-all group, which is how
  // twelve sat unrendered for months: the catch-all only ever caught the engineering page's
  // orphans, and reported them as a note nobody read.
  const SHELVES = [...ENG_GROUPS, ...PRODUCT_GROUPS, ...PROJECT_GROUPS, ...CONSCIENCE_GROUPS];
  const all = SHELVES.flatMap(([, , ids]) => ids);
  const dupes = [...new Set(all.filter((id, i) => all.indexOf(id) !== i))];
  if (dupes.length) {
    console.error(`  ✗ practice(s) classified into more than one group: ${dupes.join(', ')}`);
    process.exitCode = 1;
  }
  const claimed = new Set(all);
  const stale = [...claimed].filter((id) => !byId[id]);
  if (stale.length) {
    console.error(`  ✗ a shelf names a practice not in library/: ${stale.join(', ')}`);
    process.exitCode = 1;
  }
  const orphans = practiceDocs.map((p) => p.id).filter((id) => !claimed.has(id) && !SHELF_EXEMPT.has(id));
  if (orphans.length) {
    console.error(`  ✗ practice(s) on no shelf and not exempt: ${orphans.join(', ')} — add to a group in gen-site.js, or to SHELF_EXEMPT with a reason`);
    process.exitCode = 1;
  }
  // The receipt. A practice with no public provenance is one the site structurally cannot
  // stand behind — "every position names who it was learned from" is the craft pages' claim.
  const unattributed = practiceDocs.filter((p) => !p.provenance && !SHELF_EXEMPT.has(p.id)).map((p) => p.id);
  if (unattributed.length) {
    console.error(`  ✗ practice(s) with no provenance_public: ${unattributed.join(', ')}`);
    process.exitCode = 1;
  }
}

// ---- source references ----------------------------------------------------
// library/sources.json lifts the NAMED sources out of each practice's provenance
// prose so the page shows compact references instead of a paragraph. A source
// renders as a link only when it has a verified url; otherwise it renders as the
// name. Nothing is ever invented — see the note at the top of that file.
const SOURCES = (() => {
  const f = join(ROOT, 'library', 'sources.json');
  if (!existsSync(f)) return { sources: {}, practices: {} };
  return JSON.parse(readFileSync(f, 'utf8'));
})();

{
  for (const [pid, keys] of Object.entries(SOURCES.practices || {})) {
    if (!byId[pid]) console.log(`  note: sources.json lists ${pid}, not currently in library/ — ignored.`);
    for (const k of keys) if (!SOURCES.sources[k]) {
      console.error(`  ✗ sources.json: practice ${pid} cites unknown source key: ${k}`); process.exitCode = 1;
    }
  }
}

function refs(practiceId) {
  const keys = (SOURCES.practices || {})[practiceId] || [];
  if (!keys.length) return '<p class="prov"><span>source</span> BOSS’s own practice, extracted from its build, not from outside</p>';
  const chips = keys.map((k) => {
    const src = SOURCES.sources[k];
    const label = esc(src.name);
    return src.url
      ? `<a class="ref" href="${esc(src.url)}" rel="noopener">${label}</a>`
      : `<span class="ref">${label}</span>`;
  }).join(' ');
  return `<p class="prov"><span>learned from</span> ${chips}</p>`;
}

const renderShelf = (groups) => groups.map(([name, blurb, ids]) => {
  const rows = ids.map((id) => byId[id]).filter(Boolean).map((p) => `        <div class="practice">
          <h3>${md(p.title)}</h3>
          <p class="meta"><code>${esc(p.id)}</code>, owned by <code>${esc(p.owner)}</code>, on a
            <span class="curve" title="how fast this ground moves">${esc(p.curve)}-moving curve</span>;
            last checked ${esc(p.reviewed)}.</p>
          ${refs(p.id)}
          ${p.provenance ? `<details class="prov-full"><summary>where this came from</summary><p>${md(p.provenance)}</p></details>` : ''}
        </div>`).join('\n');
  return `      <h2 class="group">${esc(name)}</h2>
      <p class="small">${esc(blurb)}</p>
      <div class="practices">
${rows}
      </div>`;
}).join('\n\n');
blocks.ENGINEERING_PRACTICES = () => renderShelf(ENG_GROUPS);
blocks.PRODUCT_PRACTICES = () => renderShelf(PRODUCT_GROUPS);
blocks.PROJECT_PRACTICES = () => renderShelf(PROJECT_GROUPS);
blocks.CONSCIENCE_PRACTICES = () => renderShelf(CONSCIENCE_GROUPS);
blocks.COUNT_PRODUCT_PRACTICES = () => String(PRODUCT_GROUPS.flatMap(([, , ids]) => ids).length);
blocks.COUNT_PROJECT_PRACTICES = () => String(PROJECT_GROUPS.flatMap(([, , ids]) => ids).length);

// Render one named group's practices — lets the design page show its own sources
// without duplicating the engineering page's whole table.
blocks.DESIGN_PRACTICES = () => {
  const g = ENG_GROUPS.find(([n]) => n === 'Design & interface');
  if (!g) return '';
  return g[2].map((id) => byId[id]).filter(Boolean).map((p) => `        <div class="practice">
          <h3>${md(p.title)}</h3>
          <p class="meta"><code>${esc(p.id)}</code>, on a <span class="curve">${esc(p.curve)}-moving curve</span>;
            last checked ${esc(p.reviewed)}.</p>
          ${refs(p.id)}
          ${p.provenance ? `<details class="prov-full"><summary>where this came from</summary><p>${md(p.provenance)}</p></details>` : ''}
        </div>`).join('\n');
};


// ---- credits --------------------------------------------------------------
// A single page crediting everyone BOSS learned from, grouped by kind, with the
// practices each one informed. Aggregated from library/sources.json — so crediting
// someone is a data edit, not a hand-maintained list that quietly falls behind.
const KIND_ORDER = [
  ['person',   'People',                 'Practitioners and researchers whose published thinking is distilled into a practice BOSS ships.'],
  ['org',      'Labs, companies & projects', 'Engineering writing, open-source projects and published guidelines BOSS builds on.'],
  ['research', 'Research, reports & incidents', 'Papers, studies and the named failures BOSS designs against.'],
  ['standard', 'Standards & specifications', 'The specs and canonical documentation BOSS reads directly.'],
];

blocks.CREDITS = () => {
  // Which practices each source informed — reverse index, so nothing is typed twice.
  const informs = {};
  for (const [pid, keys] of Object.entries(SOURCES.practices || {})) {
    for (const k of keys) (informs[k] = informs[k] || []).push(pid);
  }
  return KIND_ORDER.map(([kind, heading, blurb]) => {
    const entries = Object.entries(SOURCES.sources || {})
      .filter(([, v]) => v.kind === kind)
      .sort((a, b) => a[1].name.localeCompare(b[1].name));
    if (!entries.length) return '';
    const items = entries.map(([key, v]) => {
      const name = v.url
        ? `<a href="${esc(v.url)}" rel="noopener">${esc(v.name)}</a>`
        : esc(v.name);
      const flag = v.key ? '<span class="key-src" title="a named practitioner or primary spec BOSS distils directly">key</span>' : '';
      const forWhat = v.for ? `<span class="credit-for">${esc(v.for)}</span>` : '';
      const ps = (informs[key] || []).map((x) => `<span class="chip">${esc(x)}</span>`).join(' ');
      return `        <li class="credit">
          <p class="credit-name">${name}${flag}</p>
          ${forWhat}
          ${ps ? `<p class="credit-in">${ps}</p>` : ''}
        </li>`;
    }).join('\n');
    return `      <h2 class="group">${esc(heading)}</h2>
      <p class="small">${esc(blurb)}</p>
      <ul class="credits">
${items}
      </ul>`;
  }).filter(Boolean).join('\n\n');
};

blocks.COUNT_LINKED = () => String(Object.values(SOURCES.sources || {}).filter((s) => s.key && s.url).length);
blocks.COUNT_UNLINKED = () => String(Object.values(SOURCES.sources || {}).filter((s) => s.key && !s.url).length);
blocks.COUNT_KEY = () => String(Object.values(SOURCES.sources || {}).filter((s) => s.key).length);

blocks.COUNT_SOURCES = () => String(Object.keys(SOURCES.sources || {}).length);
blocks.COUNT_ENG_PRACTICES = () => String(ENG_GROUPS.flatMap(([, , ids]) => ids).length);

blocks.STANDING = () => `<div class="tablewrap">
      <table class="skills">
        <tbody>
${STANDING_COMMANDS.map(([cmd, what]) => `          <tr><th scope="row"><code>${esc(cmd)}</code></th><td>${esc(what)}</td></tr>`).join('\n')}
        </tbody>
      </table>
    </div>`;

// ---- what each shipped agent already carries ------------------------------
// Built from each practice's `owner:` field, then VALIDATED against the shipped
// roster — an owner that isn't a shipped agent means a founder can never reach the
// thing that owns their guidance. Those are surfaced, not hidden.
blocks.AGENT_PRACTICES = () => {
  const shipped = new Set(roster.flatMap((m) => m.agents.map((a) => a.name)));
  const byOwner = {};
  for (const pr of practiceDocs) {
    const owner = pr.owner.replace(/\s*\(with .*\)$/, '').trim();
    (byOwner[owner] = byOwner[owner] || []).push(pr);
  }
  const rows = Object.entries(byOwner)
    .filter(([o]) => shipped.has(o))
    .sort((a, b) => b[1].length - a[1].length)
    .map(([owner, ps]) => `        <tr>
          <th scope="row"><code>${esc(owner)}</code></th>
          <td>${ps.map((p) => `<span class="chip">${esc(p.id)}</span>`).join(' ')}</td>
        </tr>`).join('\n');

  const orphaned = Object.entries(byOwner).filter(([o]) => !shipped.has(o));
  if (orphaned.length) {
    console.log(`  note: ${orphaned.reduce((n, [, ps]) => n + ps.length, 0)} practice(s) owned by a non-shipped role ` +
      `(${orphaned.map(([o]) => o).join(', ')}) — rendered as wiring, not as an agent.`);
  }
  const orphanNote = orphaned.length ? `
    <p class="small orphan-note"><strong>Not every practice has a founder-facing owner, and the site
    says so.</strong> ${orphaned.reduce((n, [, ps]) => n + ps.length, 0)} of them
    (${orphaned.flatMap(([, ps]) => ps.map((p) => `<code>${esc(p.id)}</code>`)).join(', ')}) are owned by
    internal roles that don’t ship as agents. Their content reaches you as <em>wiring</em> instead — the
    conscience, the canvas’s Risks &amp; Harms cell, <code>/design-review</code>,
    <code>/red-team --humane</code> — which is deliberate for the humane ones, and worth questioning for
    the design ones.</p>` : '';

  return `<div class="tablewrap">
      <table class="skills agentmap">
        <thead><tr><th scope="col">Agent</th><th scope="col">Already carries</th></tr></thead>
        <tbody>
${rows}
        </tbody>
      </table>
    </div>${orphanNote}`;
};


// Quickstart's own numbers — hardcoded English numerals in prose ("three agents and
// sixteen skills") are a rot class the generated tables don't have.
blocks.Q_AGENTS = () => String(data.modes[0].agents);
blocks.Q_SKILLS = () => String(data.modes[0].skills);
blocks.COUNT_AGENTS = () => String(data.agents);
blocks.COUNT_SKILLS = () => String(data.skills);
blocks.COUNT_MENTORS = () => String(data.mentors);
blocks.COUNT_BUILDERS = () => String(data.builders);
blocks.COUNT_PRACTICES = () => (data.practices == null ? '—' : String(data.practices));
blocks.COUNT_VERDICTS = () => (data.verdicts == null ? '—' : String(data.verdicts.total));
blocks.VERSION = () => V;
// "On this page": the h2s of the fragment, linked by the ids anchorHeadings() stamps. The block
// leaves a marker because ids do not exist yet when blocks expand; the loop fills it after.
blocks.TOC = () => '<!--TOC-->';
blocks.MARK = () => MARK('mark mark-lg', 'large');

// ---- build ----------------------------------------------------------------
// Two levels: a light primary bar, and a sub-bar that only appears inside a
// section. Twelve pages in one flat row is a wall; grouping lets the main pages
// stay light and pushes the detail onto subpages.
const NAV = [
  { id: 'index', href: 'index.html', label: 'Home' },
  // 'Get started', not 'Start': the bare word is on Lighthouse's non-descriptive-link list.
  { id: 'start', href: 'start.html', label: 'Get started' },
  { id: 'guide', href: 'guide.html', label: 'Guide' },
  // The second door. Everything under here is depth someone came looking for, not a step
  // in the install path — so it stops competing with Start for a first-time visitor's
  // attention, and stops making the product look like fourteen pages of machinery
  // (which is exactly what EVID-002 said it looked like).
  // Ordered by what a curious reader wants next, not alphabetically and not by how much work
  // each page was. Three beats: what you actually get -> how it is built -> what it believes.
  // `About` and `The canvas` sit at the end because they are context and a takeaway, not the
  // argument. Decisions leads the third beat because it is the one with falsifiers in it.
  // The three beats are now DECLARED rather than implied by ordering. A reader could not see
  // the structure before: the subnav was one flat row of ten, and a flat row of ten reads as a
  // pile whatever order it is in.
  { label: 'How it thinks', href: 'team.html', groups: [
    { label: 'what you get', items: [
      { id: 'team', href: 'team.html', label: 'The team' },
      { id: 'keeping-track', href: 'keeping-track.html', label: 'Keeping track' },
      { id: 'playbook', href: 'playbook.html', label: 'The playbook' },
      { id: 'conscience', href: 'conscience.html', label: 'The conscience' },
    ] },
    { label: 'how it is built', items: [
      { id: 'engineering', href: 'engineering.html', label: 'Engineering' },
      { id: 'design', href: 'design.html', label: 'Design' },
      { id: 'product', href: 'product.html', label: 'Product' },
      { id: 'project', href: 'project.html', label: 'Project' },
    ] },
    { label: 'what it believes', items: [
      { id: 'thinking', href: 'thinking.html', label: 'What it refuses' },
      { id: 'charter', href: 'charter.html', label: 'Charter' },
      { id: 'governance', href: 'governance.html', label: 'Governance' },
      { id: 'credits', href: 'credits.html', label: 'Credits' },
      { id: 'canvas', href: 'canvas.html', label: 'The canvas' },
    ] },
  ] },
  { id: 'demo', href: 'demo.html', label: 'Demo' },
  { id: 'about', href: 'about.html', label: 'About' },
  { id: 'whats-new', href: 'whats-new.html', label: "What's new" },
];

// Every h2 gets an id from its own text, so any section on any page has an address a link, a
// table of contents or a search result can land on. No page had one until IDEA-117 §6 — the
// subnav was the only way in, and it scrolls away. Ids are stable while the heading is; a
// second heading with the same text gets a numbered id rather than a collision.
function anchorHeadings(html) {
  const seen = new Set();
  return html.replace(/<h2(\s[^>]*)?>([\s\S]*?)<\/h2>/g, (m, attrs = '', inner) => {
    if (/\sid=/.test(attrs)) return m;
    const text = inner.replace(/<[^>]+>/g, '').replace(/&[a-z]+;|&#\d+;/g, ' ');
    const base = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 60).replace(/^-+|-+$/g, '') || 'section';
    let id = base;
    for (let n = 2; seen.has(id); n++) id = `${base}-${n}`;
    seen.add(id);
    return `<h2 id="${id}"${attrs}>${inner}</h2>`;
  });
}

function navFor(current) {
  // A section declares EITHER a flat `children` list or labelled `groups`. `kids()` flattens
  // both so the active-section test and the primary bar stay identical either way.
  const kids = (n) => n.children || (n.groups || []).flatMap((g) => g.items);
  const section = NAV.find((n) => kids(n).some((c) => c.id === current));
  const primary = NAV.map((n) => {
    const active = n.id === current || kids(n).some((c) => c.id === current);
    return `<li><a href="${n.href}"${active ? ' aria-current="page"' : ''}>${n.label}</a></li>`;
  }).join('');
  const link = (c) =>
    `<li><a href="${c.href}"${c.id === current ? ' aria-current="page"' : ''}>${c.label}</a></li>`;
  let sub = '';
  if (section && section.groups) {
    sub = '<div class="subnav"><div class="subnav-in">'
      + section.groups.map((g) =>
        `<div class="subgroup"><span class="subnav-label">${g.label}</span>`
        + `<ul>${g.items.map(link).join('')}</ul></div>`).join('')
      + '</div></div>';
  } else if (section) {
    sub = `<div class="subnav"><div class="subnav-in"><span class="subnav-label">${section.label}</span><ul>`
      + kids(section).map(link).join('') + '</ul></div></div>';
  }
  // The subnav scrolls away with the top of the page (IDEA-117 §6). Two answers, no sticky wall:
  // a one-row strip of the current group's siblings that the shell shows once the subnav has
  // left the viewport, and the whole subnav again at the end of the content with a way back up.
  let strip = '';
  let end = '';
  if (section) {
    const group = section.groups
      ? section.groups.find((g) => g.items.some((c) => c.id === current))
      : { label: section.label, items: kids(section) };
    strip = `<div class="substrip" aria-label="This section"><div class="substrip-in">`
      + `<span class="subnav-label">${group.label}</span><ul>${group.items.map(link).join('')}</ul>`
      + `<a class="totop" href="#top">Top ↑</a></div></div>`;
    end = `<nav class="pagenav" aria-label="More in this section">${sub}`
      + `<a class="totop" href="#top">Back to top ↑</a></nav>`;
  }
  return { primary, sub, strip, end };
}

// Rebuild site/ from scratch every time: a page fragment that gets deleted must not
// leave a stale HTML file behind on the deployed site.
rmSync(SITE, { recursive: true, force: true });
mkdirSync(join(SITE, 'styles'), { recursive: true });
for (const f of readdirSync(join(SRC, 'styles'))) {
  copyFileSync(join(SRC, 'styles', f), join(SITE, 'styles', f));
}

// Static assets that sit at the site root. Today that is the share card — the page
// most people see first is the CARD, not the page, and a text-only preview is the
// one part of the front door a stranger judges before deciding to click. Its recipe
// is scripts/og-card.html, kept as source so the card can be re-rendered rather
// than re-invented. Copied, never generated: this is a binary the build must not touch.
// The proof strip's three renders (gen-proof.js) are binaries of the same kind.
const ROOT_ASSETS = ['og.png', 'humane-product-canvas.md', 'proof-playbook.png', 'proof-design.png', 'proof-board.png'];
for (const f of ROOT_ASSETS) {
  if (existsSync(join(SRC, f))) copyFileSync(join(SRC, f), join(SITE, f));
}

const shell = readFileSync(join(PAGES, '_shell.html'), 'utf8');
// Files starting with _ are layout, not pages — the shell must never be served.
const pages = readdirSync(PAGES).filter((f) => f.endsWith('.html') && !f.startsWith('_'));
let built = 0;

// The one place the public origin is written down. The shell's canonical/og:url tags
// and the sitemap both read it, so a domain change is a one-line edit rather than a
// hunt through generated HTML. index.html canonicalizes to the bare root — two URLs
// serving one page is the oldest self-inflicted SEO bug there is.
// Canonical base. oyeboss.build — REGISTERED 2026-08-20 (Cloudflare), so these URLs
// are real. Changed from boss.build, which was never available: registered 2026-01-16,
// five months before BOSS chose it. One constant; change it here if the domain moves.
const SITE_URL = 'https://oyeboss.build';
// Cloudflare Pages serves the EXTENSIONLESS path and 307s `/start.html` → `/start`.
// So the canonical — and the sitemap, which shares this function — must name the URL
// that answers 200, never the one that redirects to it. Pointing a canonical at a
// redirect is the same self-inflicted bug as two URLs serving one page, one level in.
const canonical = (f) => (f === 'index.html' ? `${SITE_URL}/` : `${SITE_URL}/${f.replace(/\.html$/, '')}`);

// The two stylesheets ride inside every page (IDEA-117 §5): one HTML response paints, no
// render-blocking fetch, and the cache-lifetime question on /styles/* goes away. Comments and
// runs of whitespace are dropped; nothing else is rewritten, so tokens stay readable in source
// and identical in the page. The files are still copied to site/styles/ for the demo pages.
const inlineCss = ['tokens.css', 'site.css']
  .map((f) => readFileSync(join(SRC, 'styles', f), 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/ ?([{};,>]) ?/g, '$1')
    .trim())
  .join('');

// One machine-readable identity for the thing itself — what it is, who made it, that it is free
// and MIT, where it installs from. Home page only; it is the entity, the other pages are about it.
const jsonLd = (meta) => `<script type="application/ld+json">${JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'BOSS',
  alternateName: ['oyeboss', 'Build Out Solid Stuff'],
  description: meta.description || '',
  url: `${SITE_URL}/`,
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'macOS, Linux, Windows',
  softwareVersion: V,
  license: 'https://opensource.org/license/mit',
  isAccessibleForFree: true,
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  downloadUrl: 'https://www.npmjs.com/package/oyeboss',
  softwareRequirements: 'Node.js 18+, Claude Code',
  author: { '@type': 'Person', name: 'Ajesh Shah', url: 'https://www.linkedin.com/in/ajeshshah/' },
  sameAs: ['https://github.com/ajeshh/bossbuild', 'https://www.npmjs.com/package/oyeboss'],
  screenshot: `${SITE_URL}/og.png`,
}).replace(/</g, '\\u003c')}</script>`;

const pageMeta = [];
for (const f of pages) {
  const raw = readFileSync(join(PAGES, f), 'utf8');
  const meta = {};
  const head = raw.match(/^<!--\n([\s\S]*?)\n-->\n/);
  if (head) for (const line of head[1].split('\n')) {
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (kv) meta[kv[1]] = kv[2];
  }
  let content = head ? raw.slice(head[0].length) : raw;

  // Expand generated blocks. An unknown token is a hard error — a silent
  // {{TYPO}} shipping to the website is exactly the failure this file prevents.
  // The shell owns the footer. A fragment that declares its own gets TWO on the page —
  // which shipped: the landing page carried a full duplicate whose version was typed by
  // hand and sat 35 releases stale, directly under the rule that no number on this site
  // is ever typed by hand. Cheap to state, so state it rather than trusting the next author.
  if (/<footer[\s>]/.test(content)) {
    console.error(`  ✗ ${f}: fragments must not declare <footer> — the shell renders it (and stamps {{VERSION}})`);
    process.exitCode = 1;
  }
  content = content.replace(/\{\{([A-Z0-9_]+)\}\}/g, (m0, key) => {
    if (!blocks[key]) { console.error(`  ✗ ${f}: unknown block {{${key}}}`); process.exitCode = 1; return m0; }
    return blocks[key]();
  });
  content = anchorHeadings(content);
  if (content.includes('<!--TOC-->')) {
    const items = [...content.matchAll(/<h2 id="([^"]+)"[^>]*>([\s\S]*?)<\/h2>/g)]
      .map(([, id, inner]) => `<li><a href="#${id}">${inner.replace(/<[^>]+>/g, '')}</a></li>`);
    content = content.replace('<!--TOC-->', `<nav class="toc" aria-label="On this page"><span class="toc-label">on this page</span><ol>${items.join('')}</ol></nav>`);
  }

  const { primary: nav, sub: subnav, strip: substrip, end: pagenav } = navFor(meta.nav);

  const out = shell
    .replace(/\{\{MARK\}\}/g, MARK())
    // Global, not first-match: the shell repeats title/description across the
    // og: and twitter: tags, so a single-shot replace ships a literal {{TITLE}}
    // into the social preview of every page. Function form so a `$` in a title
    // can't be read as a replacement pattern.
    .replace(/\{\{TITLE\}\}/g, () => esc(meta.title || 'BOSS'))
    .replace(/\{\{DESCRIPTION\}\}/g, () => esc(meta.description || ''))
    .replace(/\{\{CANONICAL\}\}/g, () => esc(canonical(f)))
    // Absolute, always: every crawler resolves og:image against its own origin, and
    // a relative path silently yields no card at all. One image for the whole site —
    // a per-page card is a generator nobody asked for.
    .replace(/\{\{OGIMAGE\}\}/g, () => esc(`${SITE_URL}/og.png`))
    .replace('{{HEAD_ICONS}}', HEAD_ICONS)
    .replace('{{STYLES}}', () => `<style>${inlineCss}</style>`)
    .replace('{{JSONLD}}', () => (f === 'index.html' ? jsonLd(meta) : ''))
    .replace('{{NAV}}', nav)
    .replace('{{SUBNAV}}', subnav)
    .replace('{{SUBSTRIP}}', substrip)
    .replace('{{CONTENT}}', () => content.trim())
    .replace('{{PAGENAV}}', pagenav)
    .replace(/\{\{VERSION\}\}/g, V);

  // The content fragment's tokens are checked above; the SHELL's were not, and that
  // gap shipped 52 literal {{TITLE}}/{{DESCRIPTION}} into the og: tags the moment the
  // shell grew social metadata. Check the assembled page instead of either half.
  const left = out.match(/\{\{[A-Z0-9_]+\}\}/g);
  if (left) {
    console.error(`  ✗ ${f}: unsubstituted token(s) ${[...new Set(left)].join(' ')}`);
    process.exitCode = 1;
  }

  writeFileSync(join(SITE, f), out);
  pageMeta.push({ f, title: meta.title || 'BOSS', description: meta.description || '', nav: meta.nav });
  built++;
}

// robots.txt + sitemap.xml are generated from the same page list that was just built,
// so a sitemap can never advertise a page that isn't there.
// Cloudflare Pages picks these up automatically; generated so a rebuild can't drop them.
// The canvas template is a DOWNLOAD, and `download` on the anchor only covers the click. Someone
// who copies the link, shares it, or opens it directly gets whatever the host decides `.md` is —
// and with `nosniff` set globally that is a coin-flip between a save dialog and a wall of raw
// Markdown. Say it explicitly instead, so the artifact behaves the same however it is reached.
writeFileSync(join(SITE, '_headers'),
  '# Cloudflare Pages. Static site, no build step — serve site/ as-is.\n' +
  '/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n' +
  '  X-Frame-Options: SAMEORIGIN\n/styles/*\n  Cache-Control: public, max-age=3600\n' +
  '/humane-product-canvas.md\n  Content-Type: text/markdown; charset=utf-8\n' +
  '  Content-Disposition: attachment; filename="humane-product-canvas.md"\n' +
  '  Cache-Control: public, max-age=3600\n');
writeFileSync(join(SITE, 'robots.txt'),
  `User-agent: *\nAllow: /\nSitemap: ${SITE_URL}/sitemap.xml\n`);
// llms.txt (llmstxt.org): the site as an assistant reads it — one paragraph of what BOSS is,
// then every page with its own description, from the same list as the sitemap. An assistant
// that cites this site should cite what the site says, so nothing here is written twice.
const home = pageMeta.find((p) => p.f === 'index.html');
writeFileSync(join(SITE, 'llms.txt'),
  `# BOSS\n\n> ${home ? home.description : ''}\n\n`
  + `BOSS (Build Out Solid Stuff) is a zero-dependency CLI plus Claude Code skills, agents and hooks for founders. `
  + `It sets a project up with only the structure it has earned, grows it through four modes (Quickstart → MVP → V1 → Scale), `
  + `and says one thing when the founder drifts. Everything stays on the founder's machine. `
  + `MIT licensed, free, v${V}. Install: \`npm install -g oyeboss\` or \`brew install ajeshh/boss/oyeboss\`; needs Node 18+ and Claude Code.\n\n`
  + `## Pages\n\n`
  + pageMeta.map((p) => `- [${p.title}](${canonical(p.f)}): ${p.description}`).join('\n')
  + `\n\n## Demo\n\n- [Kettlewick, one fictional venture run through BOSS end to end](${SITE_URL}/demo): the playbook, the design space and the board, rendered by the same code an install runs.\n\n`
  + `## Source\n\n- [GitHub](https://github.com/ajeshh/bossbuild)\n- [npm](https://www.npmjs.com/package/oyeboss)\n- [Changelog](${SITE_URL}/whats-new)\n`);
writeFileSync(join(SITE, 'sitemap.xml'),
  '<?xml version="1.0" encoding="UTF-8"?>\n'
  + '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
  + pages.map((f) => `  <url><loc>${esc(canonical(f))}</loc></url>`).join('\n')
  + '\n</urlset>\n');

const demo = generateDemo();
console.log(`  ✦ demo → site/demo/ · ${demo.line}`);
console.log(`\n  BOSS · site — ${built} pages from ${pages.length} fragments, v${V}`);
console.log(`    source: web/   →   deploy: site/  (upload the whole folder)`);
console.log(`    ${data.agents} agents (${data.builders} builders · ${data.mentors} mentors) · ${data.skills} skills`);
console.log(`    counts derived from ${data.generated_from} — never typed by hand.\n`);
