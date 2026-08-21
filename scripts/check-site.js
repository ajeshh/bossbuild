#!/usr/bin/env node
// BOSS · website freshness — "does the public site still describe the product?"
//
//   npm run check:site
//
// The site is generated from the manifests, so the ROSTER can't drift. What CAN
// drift is everything a human wrote around it: a page that names a skill we
// removed, a practice added to the library that no page mentions, prose past its
// review date. The product ships `review_by:` staleness-awareness to founders;
// this is the same discipline pointed at BOSS's own front door.
//
// Soft by default (reports and exits 0) — HARD on a broken claim, because a site
// promising a command that doesn't exist is worse than a site that's a bit stale.
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadModes, STANDING_COMMANDS } from '../src/modes.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const WEB = join(ROOT, 'web');
const SITE = join(ROOT, 'site');
const strict = process.argv.includes('--strict');
const today = process.env.BOSS_TODAY || new Date().toISOString().slice(0, 10);

const problems = [];
const notes = [];

// ---- 1. does every page still describe a product that exists? -------------
const modes = loadModes().filter((m) => m.authored);
const skills = new Set(modes.flatMap((m) => m.skills));
const agents = new Set(modes.flatMap((m) => m.agents));
const verbs = new Set(STANDING_COMMANDS.map(([c]) => c.split(' ')[1]).filter(Boolean));

// Skills legitimately named on the site that are not stage skills (host built-ins
// or CLI-side verbs) — listed so a genuine typo still gets caught.
const ALLOW = new Set(['boss', 'boss-sync', 'boss-learn', 'welcome', 'comprehend', 'vet',
  'practice', 'feedback', 'retention', 'canvas', 'red-team']);

for (const f of readdirSync(WEB).filter((f) => f.endsWith('.html') && !f.startsWith('_'))) {
  const raw = readFileSync(join(WEB, f), 'utf8');
  const page = f.replace(/\.html$/, '');
  // A page may deliberately name something that does NOT ship — /team explains why
  // there is no humane mentor. That intent has to be declared in the fragment's own
  // header, so the check stays strict and the exception stays visible.
  const fmHead = (raw.match(/^<!--\n([\s\S]*?)\n-->/) || [, ''])[1];
  const absent = new Set(((fmHead.match(/^mentions-absent:\s*(.*)$/m) || [, ''])[1])
    .split(',').map((x) => x.trim()).filter(Boolean));
  // Skill references written as /verb in prose (skip generated blocks entirely).
  const body = raw.replace(/\{\{[A-Z_]+\}\}/g, '');
  for (const m of body.matchAll(/<code>\/([a-z][a-z0-9-]*)(?:\s[^<]*)?<\/code>/g)) {
    const name = m[1];
    if (!skills.has(name) && !ALLOW.has(name) && !absent.has(name)) {
      problems.push(`${page}.html names /${name} — no such skill in any stage manifest`);
    }
  }
  // Agent references. `persona-` is in this list for a specific reason: the eight
  // persona-* agents are BOSS's OWN instruments for pretotyping founder reactions and
  // `registry/boundary.json` rules every one of them `internal`. They are also the
  // single most tempting thing to put on a page about /persona — README and GUIDE have
  // already described dev-workspace agents as founder features once. The prefix list
  // used to omit persona-, so the site could have named one and nothing would have said so.
  for (const m of body.matchAll(/<code>((?:mentor-|persona-|db-|ui-|ux-)[a-z-]+|coder|tester|planner|pm)<\/code>/g)) {
    if (!agents.has(m[1]) && !absent.has(m[1])) problems.push(`${page}.html names agent ${m[1]} — not in any stage manifest`);
  }
  // The SAME name check, pointed at the terminal mocks — and this is where it actually
  // mattered. The loop above only sees <code> tags, so two retired agents sat in <pre>
  // blocks for ~27 releases: the homepage printed `agents: pm, coder, mentor-founder` and
  // /keeping-track showed `owner: pm`, both after `pm` was superseded by `product-lead`.
  // A mock is the STRONGEST claim on the site — the homepage one is captioned "what that
  // actually prints" — so it is the last place a burnt name should be allowed to survive.
  for (const pre of body.matchAll(/<pre>([\s\S]*?)<\/pre>/g)) {
    const text = pre[1].replace(/<[^>]+>/g, '');
    for (const m of text.matchAll(/(?<![a-z0-9-])((?:mentor-|persona-|db-|ui-|ux-)[a-z-]+|coder|tester|planner|pm)(?![a-z0-9-])/g)) {
      if (!agents.has(m[1]) && !absent.has(m[1])) {
        problems.push(`${page}.html shows agent ${m[1]} in a terminal mock — not in any stage manifest`);
      }
    }
  }
  // `boss <verb>` references.
  for (const m of body.matchAll(/<code>boss ([a-z-]+)/g)) {
    if (!verbs.has(m[1]) && !['craft', 'update', 'insights', 'sync', 'learn'].includes(m[1])) {
      notes.push(`${page}.html mentions \`boss ${m[1]}\` — not in the standing list (may still be valid)`);
    }
  }
}

// ---- 2. is anything in the product missing from the site? -----------------
const practices = existsSync(join(ROOT, 'library/practices'))
  ? readdirSync(join(ROOT, 'library/practices')).filter((f) => f.endsWith('.md')).map((f) => f.replace(/\.md$/, ''))
  : [];
const siteText = readdirSync(SITE).filter((f) => f.endsWith('.html'))
  .map((f) => readFileSync(join(SITE, f), 'utf8')).join('\n');
const unmentioned = practices.filter((p) => !siteText.includes(p));
if (unmentioned.length) {
  problems.push(`${unmentioned.length} practice(s) exist but appear nowhere on the site: ${unmentioned.join(', ')}`);
}

// Coverage was ONE-DIRECTIONAL for everything except practices, and the asymmetry hid
// behind the generated table. Section 1 fails hard when the site CLAIMS a skill that
// doesn't exist; nothing ever asked the reverse. And the reverse looks answered, because
// `{{REFERENCE}}` expands into a row for every skill in the manifests — so grepping the
// built site finds all 47 and reports full coverage.
//
// That table is why nobody noticed. `/persona` ships at Quickstart with a full lifecycle
// (derive → enrich → consult, with a synthetic%/real% evidence ledger) and has never been
// described by a single hand-written sentence anywhere on the site; the same holds for the
// money mentors. Listed in a reference table is not the same as claimed, positioned, or
// explained — and only the second kind tells a founder the capability exists.
//
// So this measures `web/` (the half a human wrote), never `site/` (the half a generator
// wrote). Deliberately a NOTE, not a problem: an omission is not a broken claim, and this
// file's contract is soft-on-stale / hard-on-false. The point is that the number gets SAID
// on every run instead of being rediscovered by hand every few months.
const proseText = readdirSync(WEB).filter((f) => f.endsWith('.html') && !f.startsWith('_'))
  .map((f) => readFileSync(join(WEB, f), 'utf8')).join('\n')
  .replace(/\{\{[A-Z_]+\}\}/g, '');
const quietSkills = [...skills].filter((s) => !new RegExp(`/${s}(?![a-z0-9-])`).test(proseText)).sort();
const quietAgents = [...agents].filter((a) => !proseText.includes(a)).sort();
if (quietSkills.length) {
  notes.push(`${quietSkills.length}/${skills.size} shipped skill(s) are in the generated table but in no hand-written sentence: ${quietSkills.join(', ')}`);
}
if (quietAgents.length) {
  notes.push(`${quietAgents.length}/${agents.size} shipped agent(s) are named nowhere in the site's prose: ${quietAgents.join(', ')}`);
}

// ---- 2a. does the site name the right package and repo? -------------------
// The install line is the single most consequential string on the site, and it is
// the one most likely to go quietly wrong: the npm package was renamed bossbuild →
// oyeboss and every `npx …` line, the npm link and the docs links all had to move.
// A stale install command doesn't look broken — it looks fine and installs nothing.
{
  const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
  const repo = (pkg.repository?.url || '').replace(/^git\+/, '').replace(/\.git$/, '');
  // web/ is the site's source — plus pretotype/index.html, which is a PUBLIC page
  // that lives outside it. It shipped `npx bossbuild` for the whole rename because
  // this scan only ever read web/: the demand page's single call to action pointed
  // at a package that no longer exists, on the one page built to measure demand.
  const surfaces = readdirSync(WEB).filter((f) => f.endsWith('.html')).map((f) => [f, join(WEB, f)]);
  if (existsSync(join(ROOT, 'pretotype', 'index.html'))) {
    surfaces.push(['pretotype/index.html', join(ROOT, 'pretotype', 'index.html')]);
  }
  for (const [f, path] of surfaces) {
    const raw = readFileSync(path, 'utf8');
    // Any npx/npm install line must name the real published package.
    for (const m of raw.matchAll(/(?:npx|npm i(?:nstall)? -g)\s+([a-z][a-z0-9-]*)/g)) {
      if (m[1] !== pkg.name && m[1] !== 'uninstall') {
        problems.push(`${f} installs "${m[1]}" — the published package is "${pkg.name}"`);
      }
    }
    for (const m of raw.matchAll(/npmjs\.com\/package\/([a-z0-9-]+)/g)) {
      if (m[1] !== pkg.name) problems.push(`${f} links npm package "${m[1]}" — it is "${pkg.name}"`);
    }
    if (repo) for (const m of raw.matchAll(/https:\/\/github\.com\/([\w-]+\/[\w-]+)/g)) {
      if (!repo.endsWith(m[1])) problems.push(`${f} links github.com/${m[1]} — the repo is ${repo}`);
    }
  }
}

// ---- 2ab. the share card exists, and every page points at one --------------
// For most traffic the link preview IS the first impression: a page shared into
// Slack, iMessage or a group chat is a card before it is a page. BOSS's shell
// shipped og:title and og:description and NO og:image for its entire life, so its
// own front door previewed as text while the practice it ships teaches the share
// layer. HARD, in both directions: a page with no og:image shares as a bare link,
// and a page promising an image that isn't on disk renders a BROKEN card — worse
// than no card, because it looks like a site that doesn't work.
{
  const built = existsSync(SITE) ? readdirSync(SITE).filter((f) => f.endsWith('.html')) : [];
  for (const f of built) {
    const raw = readFileSync(join(SITE, f), 'utf8');
    const m = raw.match(/<meta property="og:image" content="([^"]+)"/);
    if (!m) { problems.push(`${f} declares no og:image — it shares as a text-only card`); continue; }
    // Absolute URL by design; resolve it back to the file the deploy must carry.
    const rel = m[1].replace(/^https?:\/\/[^/]+\//, '');
    if (!existsSync(join(SITE, rel))) {
      problems.push(`${f} points og:image at "${rel}" — no such file in site/, so the card is broken`);
    }
  }
}

// ---- 2b. citation debt -----------------------------------------------------
// Every named source should carry the URL of the primary document someone actually
// opened. `/vet` verifies attributions before grading them, so the work is already
// done — losing the URL throws it away. Reported, never fatal.
let debt = 0, sourceTotal = 0;
{
  const f = join(ROOT, 'library', 'sources.json');
  if (existsSync(f)) {
    const reg = JSON.parse(readFileSync(f, 'utf8'));
    // Only KEY sources owe a URL — a named practitioner whose thinking is distilled
    // here, or a primary spec a reviewer would re-open. Supporting citations are
    // credited by name and that is enough. Chasing a link for all 41 was busywork
    // that made the real number invisible.
    const all = Object.values(reg.sources || {}).filter((x) => x.key);
    sourceTotal = all.length;
    debt = all.filter((x) => !x.url).length;
  }
}

// ---- 2c. has the product moved since the page was written? ----------------
// THE POINT OF THIS FILE. BOSS ships most days; the website is hand-written prose
// that silently stops being true. Each page declares `covers:` — the paths it
// documents — and this compares the last commit touching those paths against the
// page's `reviewed:` date. A practice refreshed, a command changed, a new agent:
// the page that documents it gets named, at the moment it falls behind, instead of
// six weeks later when someone notices the site is describing an older product.
const behind = [];
const inflight = [];
// Timestamps, not dates. BOSS shipped FIFTEEN releases in one day — day-granularity
// silently reports "fresh" for everything that changed since this morning, which is
// exactly the rot this file exists to catch. Compare the source's last COMMIT time
// against when the page itself was last edited.
function lastChangedAt(paths) {
  try {
    const out = execSync(`git log -1 --format=%ct -- ${paths}`, { cwd: ROOT, encoding: 'utf8' }).trim();
    return out ? Number(out) * 1000 : 0;
  } catch { return 0; }
}
// The LATER of the last commit and the working-tree mtime. Preferring git alone
// reports a page as stale while you are actively fixing it; preferring mtime alone
// misses that a checkout resets timestamps. Take whichever says "more recently".
function pageTouchedAt(file) {
  let git = 0, disk = 0;
  try {
    const c = execSync(`git log -1 --format=%ct -- ${file}`, { cwd: ROOT, encoding: 'utf8' }).trim();
    if (c) git = Number(c) * 1000;
  } catch { /* untracked */ }
  try { disk = statSync(join(ROOT, file)).mtimeMs; } catch { /* gone */ }
  return Math.max(git, disk);
}
const fmt = (ms) => new Date(ms).toISOString().slice(0, 10);
// Committed history only tells you what already landed. The moment that matters is
// while the work is happening — that's when the docs are cheap to update and when
// you still remember what changed. So uncommitted edits to a page's sources count too.
function changingNow(paths) {
  try {
    const out = execSync(`git status --porcelain -- ${paths}`, { cwd: ROOT, encoding: 'utf8' }).trim();
    return out ? out.split('\n').length : 0;
  } catch { return 0; }
}
for (const f of readdirSync(WEB).filter((f) => f.endsWith('.html') && !f.startsWith('_'))) {
  const head = (readFileSync(join(WEB, f), 'utf8').match(/^<!--\n([\s\S]*?)\n-->/) || [, ''])[1];
  const covers = (head.match(/^covers:\s*(.*)$/m) || [, ''])[1].trim();
  const reviewed = (head.match(/^reviewed:\s*(\S+)/m) || [])[1];
  if (!covers) { problems.push(`${f} declares no \`covers:\` — nothing can tell when it falls behind`); continue; }
  if (!reviewed) continue;
  const now = changingNow(covers);
  if (now) inflight.push(`${f.replace(/\.html$/, '')} — ${now} uncommitted change(s) under ${covers.split(' ').slice(0, 2).join(', ')}`);
  const srcAt = lastChangedAt(covers);
  const pageAt = pageTouchedAt(`web/${f}`);
  if (srcAt && pageAt && srcAt > pageAt) {
    behind.push(`${f.replace(/\.html$/, '')} — ${covers.split(' ')[0]}… changed ${fmt(srcAt)}, page last touched ${fmt(pageAt)}`);
  }
}

// ---- 3. prose past its review date ----------------------------------------
const overdue = [];
for (const f of readdirSync(WEB).filter((f) => f.endsWith('.html') && !f.startsWith('_'))) {
  const head = (readFileSync(join(WEB, f), 'utf8').match(/^<!--\n([\s\S]*?)\n-->/) || [, ''])[1];
  const by = (head.match(/^review_by:\s*(\S+)/m) || [])[1];
  const what = (head.match(/^describes:\s*(.*)$/m) || [, ''])[1];
  if (!by) { problems.push(`${f} has no review_by — nothing can report it stale`); continue; }
  if (by < today) overdue.push(`${f.replace(/\.html$/, '')} — due ${by} · ${what}`);
}

// ---- report ---------------------------------------------------------------
console.log(`\n  BOSS · website freshness — ${practices.length} practices, ${skills.size} skills, ${agents.size} agents, as of ${today}\n`);
for (const p of problems) console.log(`  ✗ ${p}`);
for (const b of behind) console.log(`  ! may be behind: ${b}`);
for (const i of inflight) console.log(`  ~ changing now: ${i}`);
for (const o of overdue) console.log(`  · overdue: ${o}`);
for (const n of notes) console.log(`  · ${n}`);
if (!problems.length && !overdue.length && !behind.length && !inflight.length) console.log('  Everything the site claims exists, nothing is past review, and no page trails its source.');
if (inflight.length) {
  console.log(`\n  ${inflight.length} page(s) document something you are editing RIGHT NOW.`);
  console.log('  This is the cheap moment to update them — while you still remember what changed.');
}
if (behind.length) {
  console.log(`\n  ${behind.length} page(s) document something that changed after they were last reviewed.`);
  console.log('  Re-read them, fix what moved, then bump `reviewed:` in the fragment header.');
}
if (debt) {
  console.log(`\n  · citation debt: ${debt} of ${sourceTotal} KEY sources have no URL.`);
  console.log('    /vet now requires recording the primary-source URL; these predate that rule.');
  console.log('    Fill a `url` in library/sources.json and the credits page links it automatically.');
}
console.log(`\n  ${problems.length} broken claim(s) · ${inflight.length} in flight · ${behind.length} trailing · ${overdue.length} overdue\n`);
console.log('  The roster and the counts are GENERATED and cannot drift. This checks the half a');
console.log('  human wrote: claims about commands, coverage of new practices, and review dates.\n');

if (strict && problems.length) process.exitCode = 1;
