// `boss update` — is the BOSS you have installed actually current?
//
// WHY THIS EXISTS: updating is two hops — the TOOL (`npm i -g oyeboss@latest`) and the PROJECT
// (`/boss-sync`) — and `boss status` could only ever see the second. It compares the project's pin
// against the INSTALLED package, so a founder who never runs hop 1 has a pin equal to their install
// and gets told "up to date" forever, while sitting fifty releases behind. **The silence was
// self-confirming: the more stale you were, the more confidently BOSS said you were fine.** v0.152.0
// named the trap in prose. This is the part that can actually answer the question.
//
// THE PRIVACY LINE, and why this is a command instead of something `boss status` does for you:
// BOSS's README promises no telemetry and local-only state. A registry lookup sends no project data
// — it's a public GET for a version string — but it is still an outbound request the founder didn't
// ask for, and a tool that quietly phones anywhere on every `status` has spent trust it can't get
// back. So: the fetch happens ONLY when explicitly invoked. `boss status` reads the cached result
// and never makes a call itself. If nobody ever runs this, BOSS says it doesn't know rather than
// checking behind their back.

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { homedir } from 'node:os';
import { BOSS_ROOT, bossVersion } from './paths.js';
import { cmpVersion } from './changelog.js';
import { dim, bold, ok, warn, err } from './ui.js';

const CACHE = join(homedir(), '.boss', 'update-check.json');
// Renamed bossbuild → oyeboss (v0.177.0, BRAND.md). An install predating the rename keeps
// polling the OLD name and would be told "current" forever while oyeboss moves on — the two-hop
// trap wearing a new hat. `npm deprecate bossbuild` is what actually reaches those installs.
// The package name is written ONCE: the registry URL and the update command must never disagree,
// because a rename that lands in one and not the other is silent. Pinned by a REGRESSION test.
export const PKG = 'oyeboss';
const REGISTRY = `https://registry.npmjs.org/${PKG}/latest`;
const TIMEOUT_MS = 4000;
const STALE_DAYS = 7;

export function readCache() {
  if (!existsSync(CACHE)) return null;
  try { return JSON.parse(readFileSync(CACHE, 'utf8')); } catch { return null; }
}

function writeCache(data) {
  try {
    mkdirSync(dirname(CACHE), { recursive: true });
    writeFileSync(CACHE, JSON.stringify(data, null, 2) + '\n');
  } catch { /* a cache we can't write is a cache we do without */ }
}

export function cacheAgeDays(cache, now = Date.now()) {
  if (!cache?.checked) return null;
  const t = Date.parse(cache.checked);
  return Number.isNaN(t) ? null : Math.floor((now - t) / 86400000);
}

// How this copy of BOSS got here, so the advice names the command that will actually work.
// Homebrew installs land under a Cellar; npm globals under node_modules. Anything else is a
// git checkout linked with `npm i -g .`, where `git pull` is the update.
export function installKind(root = BOSS_ROOT) {
  if (/[/\\](Cellar|homebrew)[/\\]/i.test(root)) return 'brew';
  if (/[/\\]node_modules[/\\]/.test(root)) return 'npm';
  return 'source';
}

export function updateCommand(kind = installKind()) {
  return kind === 'brew' ? 'brew upgrade boss'
    : kind === 'source' ? 'git pull && npm i -g .'
      : 'npm i -g oyeboss@latest';
}

async function fetchLatest() {
  // Zero-dep by rule — global fetch (Node 18+, which package.json already requires).
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(REGISTRY, { signal: ctrl.signal, headers: { accept: 'application/json' } });
    // 404 is NOT a transport failure, and calling it one is the false reassurance this file exists
    // to prevent: the registry answered, and its answer was "no such package." After a rename that
    // is the single most useful thing BOSS can say, so it gets its own branch.
    if (res.status === 404) return { error: 'no such package', notFound: true };
    if (!res.ok) return { error: `registry returned ${res.status}` };
    const body = await res.json();
    if (!body?.version) return { error: 'registry response had no version' };
    return { latest: body.version };
  } catch (e) {
    // Offline is a normal state, not an error worth shouting about. A founder on a plane should
    // get a shrug, not a stack trace, and definitely not a non-zero exit.
    return { error: e?.name === 'AbortError' ? 'timed out' : 'no network' };
  } finally {
    clearTimeout(timer);
  }
}

export async function printUpdate({ quiet = false } = {}) {
  const installed = bossVersion();
  const kind = installKind();
  const cmd = updateCommand(kind);

  if (!quiet) console.log(`\n  ${bold('BOSS update check')}   ${dim(`installed: ${installed}`)}\n`);

  const { latest, error, notFound } = await fetchLatest();
  if (notFound) {
    console.log(`  ${warn('▸')} npm has no package called ${bold(PKG)}, so this check can't answer.`);
    console.log(`  ${dim("It isn't published yet, or this install predates the rename from `bossbuild`.")}`);
    console.log(`\n    ${bold(`npm uninstall -g bossbuild && npm i -g ${PKG}`)}`);
    console.log(`  ${dim('Both packages provide `boss`, so installing over the old one fails with EEXIST.')}\n`);
    return 0;
  }
  if (error) {
    console.log(`  ${dim(`Couldn't reach the npm registry (${error}).`)}`);
    const cache = readCache();
    if (cache?.latest) {
      const age = cacheAgeDays(cache);
      console.log(`  ${dim(`Last known latest: ${cache.latest}${age === null ? '' : ` (checked ${age}d ago)`}`)}`);
    }
    console.log(`  ${dim('Nothing is wrong — this check needs network. Try again when you have it.')}\n`);
    return 0;
  }

  writeCache({ checked: new Date().toISOString(), latest, installed });

  const delta = cmpVersion(latest, installed);
  if (delta < 0) {
    // AHEAD of the registry — a source checkout, or a maintainer between releases. Saying "you're
    // on the latest" here would be false in the direction that matters most: it would hide that
    // everything since `latest` is unpublished, so nobody else can install any of it.
    console.log(`  ${warn('▸')} You're ${bold('ahead')} of what's published — installed ${bold(installed)}, npm has ${bold(latest)}.`);
    console.log(`  ${dim("Nothing to update. Worth knowing if you expected others to have this: they don't yet.")}\n`);
    return 0;
  }
  if (delta === 0) {
    console.log(`  ${ok('✦')} ${installed} is the latest published BOSS.`);
    // Say the second hop out loud. Being on the newest TOOL says nothing about whether a given
    // project has taken those practices in — that is exactly the confusion this file exists for.
    console.log(`  ${dim('That covers the tool. To bring a project up to it: `boss changelog` then `/boss-sync`.')}\n`);
    return 0;
  }

  console.log(`  ${warn('⟳')} ${bold(latest)} is out — you have ${installed}.\n`);
  console.log(`    ${bold(cmd)}${kind === 'source' ? dim('   (you\'re running a git checkout)') : ''}`);
  console.log(`\n  ${dim('Then, in each project you want it in: `boss changelog` to read what changed,')}`);
  console.log(`  ${dim('`/boss-sync` to review and apply it. Updating the tool changes no project by itself.')}\n`);
  return 0;
}

// What `boss status` shows — never fetches, only reads what an explicit check left behind.
export function updateNote(installed = bossVersion(), cache = readCache(), now = Date.now()) {
  if (!cache?.latest) return { state: 'unknown', cmd: 'boss update' };
  const age = cacheAgeDays(cache, now);
  if (cmpVersion(cache.latest, installed) > 0) {
    return { state: 'behind', latest: cache.latest, age, cmd: updateCommand() };
  }
  if (age !== null && age > STALE_DAYS) return { state: 'unknown', age, cmd: 'boss update' };
  return { state: 'current', age };
}

export { err };
