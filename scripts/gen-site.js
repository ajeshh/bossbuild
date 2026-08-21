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


// The BOSS mark. It is not invented: `✦` is what the CLI already prints on every
// success line (`✦ Created my-app`). Drawn properly here as a four-point spark with
// concave sides, so it holds at favicon size and at hero size. currentColor so it
// inherits whatever it sits in.
const MARK = (cls = 'mark') =>
  `<svg class="${cls}" viewBox="0 0 100 100" aria-hidden="true" focusable="false">` +
  `<path fill="currentColor" d="M50 0 C56 32 68 44 100 50 C68 56 56 68 50 100 C44 68 32 56 0 50 C32 44 44 32 50 0 Z"/></svg>`;

// Inline markdown → HTML, escape-first so nothing user-authored can inject markup.
const md = (s) => esc(s)
  .replace(/`([^`]+)`/g, '<code>$1</code>')
  .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  .replace(/\*([^*]+)\*/g, '<em>$1</em>');

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
  summary: m.summary,
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

blocks.ROSTER = () => roster.map((m) => {
  if (!m.agents.length) return '';
  const cards = m.agents.map((a) => `        <div class="agent ${a.kind}">
          <h4><code>${esc(a.name)}</code> <span class="tag">${a.kind}</span></h4>
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
  const parts = readFileSync(cl, 'utf8').split(/^## /m).slice(1);
  const out = [];
  for (const chunk of parts) {
    // OPT-IN: a release reaches the public feed only if it carries a "For you:" line.
    // Most releases are internal — audits, refactors, doc sweeps — and a feed that
    // lists those is a commit log, not a reason for anyone to care.
    // The block is MULTI-LINE. `(.+)$` captured only the first line, so every release note
    // longer than ~100 chars was published to the world truncated mid-sentence — v0.180.0's read
    // "there's now one command for" and stopped. The changelog's own header tells authors to write
    // these as prose, and prose wraps. Take the `> ` continuation lines too, and stop at the first
    // line that is not a quote.
    // And there can be MORE THAN ONE. `.match()` without /g returns the first hit only, so a
    // release that changed three things for founders published one of them and silently dropped
    // the rest — v0.189.0 shipped a merged designer, a retired agent with a new guard hook, and
    // seven renames, and the feed showed the designer. The array below was always plural; only
    // the reader was singular.
    const blocks = [...chunk.matchAll(/^>\s*\*\*For you:\*\*\s*(.+(?:\n>.*)*)/gm)];
    if (!blocks.length) continue;
    const forYou = blocks.map((b) => b[1].split('\n').map((l) => l.replace(/^>\s?/, '').trim()).join(' ').trim());
    const head = chunk.split('\n')[0].trim();
    const m = head.match(/^([\d.]+)\s+\u2014\s+(.+)$/);
    out.push(`      <li>
        <div class="rel"><span class="ver">v${esc(m ? m[1] : head)}</span><span class="when">${esc(m ? m[2] : '')}</span></div>
        ${forYou.map((t) => `<p>${md(t)}</p>`).join('\n        ')}
      </li>`);
    if (out.length >= 12) break;
  }
  if (!out.length) return '<p class="small">No user-facing releases recorded yet.</p>';
  return `<ol class="releases">\n${out.join('\n')}\n    </ol>`;
};



// ---- diagrams -------------------------------------------------------------
// Hand-authored inline SVG: no library, no runtime, currentColor so both themes
// work, one hi-vis element carrying the claim. Each figure makes ONE point.

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
      <text x="106" y="167" font-size="11.5" opacity="0.72">files on disk</text>
      <text x="358" y="146">hook</text>
      <text x="358" y="167" font-size="11.5" opacity="0.72">a mechanical condition</text>
      <text x="630" y="70">silence</text>
      <text x="630" y="89" font-size="11.5" opacity="0.72">the usual path</text>
    </g>
    <g font-family="system-ui, sans-serif" font-size="13.5" fill="var(--color-on-brand)" text-anchor="middle">
      <text x="668" y="210">model composes the words</text>
      <text x="668" y="230" font-size="11.5" opacity="0.85">only now is a model involved</text>
    </g>
    <g font-family="system-ui, sans-serif" font-size="11.5" fill="currentColor" opacity="0.72">
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
      <text x="129" y="93" font-size="11.5" opacity="0.72">attributed · dated · versioned</text>
      <text x="737" y="72">your code, your screens,</text>
      <text x="737" y="93">your schema</text>
      <text x="446" y="184" font-size="12.5">boss craft &lt;name&gt;</text>
      <text x="446" y="202" font-size="11.5" opacity="0.72">read the source yourself — optional</text>
    </g>
    <g font-family="system-ui, sans-serif" font-size="13.5" fill="var(--color-on-brand)" text-anchor="middle">
      <text x="436" y="72">the agents that do the work</text>
      <text x="436" y="93" font-size="11.5" opacity="0.85">carry it distilled, in their prompts</text>
    </g>
    <g font-family="system-ui, sans-serif" font-size="11.5" fill="currentColor" opacity="0.72" text-anchor="middle">
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
    <g font-family="system-ui, sans-serif" font-size="11" fill="currentColor" opacity="0.72" text-anchor="middle">
      <text x="104" y="76">status: exploring</text>
      <text x="104" y="152">status: building</text>
      <text x="104" y="228">status: shipped</text>
      <text x="368" y="152">reads the folder</text>
      <text x="264" y="128">status</text>
      <text x="469" y="128">render</text>
    </g>
    <g font-family="system-ui, sans-serif" fill="var(--color-on-brand)">
      <text x="518" y="62" font-size="12.5" font-weight="600">Captured</text>
      <text x="518" y="84" font-size="11" opacity="0.85">IDEA-014</text>
      <text x="518" y="127" font-size="12.5" font-weight="600">Taking shape</text>
      <text x="518" y="149" font-size="11" opacity="0.85">— empty —</text>
      <text x="686" y="62" font-size="12.5" font-weight="600">Building</text>
      <text x="686" y="84" font-size="11" opacity="0.85">FEAT-003</text>
      <text x="686" y="127" font-size="12.5" font-weight="600">Shipped</text>
      <text x="686" y="149" font-size="11" opacity="0.85">DEC-007</text>
      <text x="518" y="206" font-size="11" opacity="0.85">rendered on read,</text>
      <text x="518" y="222" font-size="11" opacity="0.85">never written down</text>
    </g>
    <g stroke="currentColor" stroke-width="1.5" fill="none" opacity="0.4" stroke-dasharray="5 4">
      <rect x="292" y="256" width="152" height="48" rx="3"/>
      <path d="M368 164 V256" />
    </g>
    <g font-family="system-ui, sans-serif" fill="currentColor" text-anchor="middle" opacity="0.55">
      <text x="368" y="280" font-size="12.5">a status doc</text>
      <text x="368" y="297" font-size="11">does not exist</text>
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
   ['design-system', 'ai-ux-patterns']],
];
const NON_ENG = new Set(['activation', 'ai-adoption-culture', 'analytics-for-ai-products',
  'celebration-of-done', 'conscience-voicing', 'first-dollar', 'founder-role-shifts',
  'harm-taxonomy', 'landing-page', 'monetization-in-practice', 'retention']);

{
  // The library is edited independently of this file, so a practice can appear or
  // vanish between builds. Neither case should break the site or silently drop a
  // practice: a stale reference is skipped, and an unclassified one is CARRIED into
  // a catch-all group so it still gets credited. Both are reported so the grouping
  // can be corrected deliberately rather than by a build failure.
  // A practice listed in two groups renders twice and inflates COUNT_ENG_PRACTICES.
  // That shipped undetected once (documentation.md), so it fails the build now: unlike
  // a stale or unclassified id, there is no reading where this is what someone meant.
  const all = ENG_GROUPS.flatMap(([, , ids]) => ids);
  const dupes = [...new Set(all.filter((id, i) => all.indexOf(id) !== i))];
  if (dupes.length) {
    console.error(`  ✗ practice(s) classified into more than one group: ${dupes.join(', ')}`);
    process.exitCode = 1;
  }

  const claimed = new Set(all);
  const stale = [...claimed].filter((id) => !byId[id]);
  if (stale.length) console.log(`  note: group references a practice not currently in library/: ${stale.join(', ')} — skipped.`);

  const orphans = practiceDocs.map((p) => p.id).filter((id) => !claimed.has(id) && !NON_ENG.has(id));
  if (orphans.length) {
    console.log(`  note: unclassified practice(s) shown under “Also on the shelf”: ${orphans.join(', ')}`);
    ENG_GROUPS.push(['Also on the shelf',
      'Practices that ship but have not been sorted into a group above yet.', orphans]);
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
  if (!keys.length) return '<p class="prov"><span>source</span> BOSS’s own practice — extracted from its build, not from outside</p>';
  const chips = keys.map((k) => {
    const src = SOURCES.sources[k];
    const label = esc(src.name);
    return src.url
      ? `<a class="ref" href="${esc(src.url)}" rel="noopener">${label}</a>`
      : `<span class="ref">${label}</span>`;
  }).join(' ');
  return `<p class="prov"><span>learned from</span> ${chips}</p>`;
}

blocks.ENGINEERING_PRACTICES = () => ENG_GROUPS.map(([name, blurb, ids]) => {
  const rows = ids.map((id) => byId[id]).filter(Boolean).map((p) => `        <div class="practice">
          <h4>${md(p.title)}</h4>
          <p class="meta"><code>${esc(p.id)}</code> · owned by <code>${esc(p.owner)}</code> ·
            <span class="curve" title="how fast this ground moves">${esc(p.curve)} curve</span> ·
            last checked ${esc(p.reviewed)}</p>
          ${refs(p.id)}
          ${p.provenance ? `<details class="prov-full"><summary>where this came from</summary><p>${md(p.provenance)}</p></details>` : ''}
        </div>`).join('\n');
  return `      <h3>${esc(name)}</h3>
      <p class="small">${esc(blurb)}</p>
      <div class="practices">
${rows}
      </div>`;
}).join('\n\n');

// Render one named group's practices — lets the design page show its own sources
// without duplicating the engineering page's whole table.
blocks.DESIGN_PRACTICES = () => {
  const g = ENG_GROUPS.find(([n]) => n === 'Design & interface');
  if (!g) return '';
  return g[2].map((id) => byId[id]).filter(Boolean).map((p) => `        <div class="practice">
          <h4>${md(p.title)}</h4>
          <p class="meta"><code>${esc(p.id)}</code> · <span class="curve">${esc(p.curve)} curve</span> ·
            last checked ${esc(p.reviewed)}</p>
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
    return `      <h3>${esc(heading)}</h3>
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
blocks.MARK = () => MARK('mark mark-lg');

// ---- build ----------------------------------------------------------------
// Two levels: a light primary bar, and a sub-bar that only appears inside a
// section. Twelve pages in one flat row is a wall; grouping lets the main pages
// stay light and pushes the detail onto subpages.
const NAV = [
  { id: 'index', href: 'index.html', label: 'Home' },
  { id: 'start', href: 'start.html', label: 'Start' },
  { label: 'The product', href: 'team.html', children: [
    { id: 'team', href: 'team.html', label: 'The team' },
    { id: 'keeping-track', href: 'keeping-track.html', label: 'Keeping track' },
    { id: 'guide', href: 'guide.html', label: 'Guide' },
    { id: 'teams', href: 'teams.html', label: 'Cofounders' },
    { id: 'quick-guide', href: 'quick-guide.html', label: 'Quick guide' },
  ] },
  { label: 'How it works', href: 'engineering.html', children: [
    { id: 'engineering', href: 'engineering.html', label: 'For engineers' },
    { id: 'design', href: 'design.html', label: 'Design' },
    { id: 'conscience', href: 'conscience.html', label: 'The conscience' },
  ] },
  { label: 'Trust', href: 'charter.html', children: [
    { id: 'charter', href: 'charter.html', label: 'Charter' },
    { id: 'governance', href: 'governance.html', label: 'Governance' },
    { id: 'credits', href: 'credits.html', label: 'Credits' },
  ] },
  { id: 'whats-new', href: 'whats-new.html', label: "What's new" },
];

function navFor(current) {
  const section = NAV.find((n) => n.children && n.children.some((c) => c.id === current));
  const primary = NAV.map((n) => {
    const active = n.id === current || (n.children && n.children.some((c) => c.id === current));
    return `<li><a href="${n.href}"${active ? ' aria-current="page"' : ''}>${n.label}</a></li>`;
  }).join('');
  const sub = section
    ? `<div class="subnav"><div class="subnav-in"><span class="subnav-label">${section.label}</span><ul>` +
      section.children.map((c) =>
        `<li><a href="${c.href}"${c.id === current ? ' aria-current="page"' : ''}>${c.label}</a></li>`).join('') +
      '</ul></div></div>'
    : '';
  return { primary, sub };
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
const ROOT_ASSETS = ['og.png'];
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
const canonical = (f) => (f === 'index.html' ? `${SITE_URL}/` : `${SITE_URL}/${f}`);

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
  content = content.replace(/\{\{([A-Z_]+)\}\}/g, (m0, key) => {
    if (!blocks[key]) { console.error(`  ✗ ${f}: unknown block {{${key}}}`); process.exitCode = 1; return m0; }
    return blocks[key]();
  });

  const { primary: nav, sub: subnav } = navFor(meta.nav);

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
    .replace('{{NAV}}', nav)
    .replace('{{SUBNAV}}', subnav)
    .replace('{{CONTENT}}', content.trim())
    .replace(/\{\{VERSION\}\}/g, V);

  // The content fragment's tokens are checked above; the SHELL's were not, and that
  // gap shipped 52 literal {{TITLE}}/{{DESCRIPTION}} into the og: tags the moment the
  // shell grew social metadata. Check the assembled page instead of either half.
  const left = out.match(/\{\{[A-Z_]+\}\}/g);
  if (left) {
    console.error(`  ✗ ${f}: unsubstituted token(s) ${[...new Set(left)].join(' ')}`);
    process.exitCode = 1;
  }

  writeFileSync(join(SITE, f), out);
  built++;
}

// robots.txt + sitemap.xml are generated from the same page list that was just built,
// so a sitemap can never advertise a page that isn't there.
// Cloudflare Pages picks these up automatically; generated so a rebuild can't drop them.
writeFileSync(join(SITE, '_headers'),
  '# Cloudflare Pages. Static site, no build step — serve site/ as-is.\n' +
  '/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n' +
  '  X-Frame-Options: SAMEORIGIN\n/styles/*\n  Cache-Control: public, max-age=3600\n');
writeFileSync(join(SITE, 'robots.txt'),
  `User-agent: *\nAllow: /\nSitemap: ${SITE_URL}/sitemap.xml\n`);
writeFileSync(join(SITE, 'sitemap.xml'),
  '<?xml version="1.0" encoding="UTF-8"?>\n'
  + '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
  + pages.map((f) => `  <url><loc>${esc(canonical(f))}</loc></url>`).join('\n')
  + '\n</urlset>\n');

console.log(`\n  BOSS · site — ${built} pages from ${pages.length} fragments, v${V}`);
console.log(`    source: web/   →   deploy: site/  (upload the whole folder)`);
console.log(`    ${data.agents} agents (${data.builders} builders · ${data.mentors} mentors) · ${data.skills} skills`);
console.log(`    counts derived from ${data.generated_from} — never typed by hand.\n`);
