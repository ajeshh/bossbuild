#!/usr/bin/env node
// BOSS · reach — is anyone out there, as far as the public feeds can tell?
//
// WHY THIS EXISTS (2026-09-13): there is no gate, no signup, no telemetry — by design (`/feedback`
// promises "never background telemetry"). So the only way to know whether a stranger has installed
// BOSS is to read the three counters that exist anyway: npm downloads, the two repos' git traffic,
// and the human signals (stars, forks, issues). Nobody had wired them up, and the first read said
// something the raw total hides:
//
//   npm last-month  1,784   ·   latest (0.306.0) last-week  126   ·   0.245.0 last-week  182
//
// A human `npm i -g oyeboss` fetches `latest` and nothing else. Seven stale versions each pulling
// ~140 in the same week is a mirror/scanner crawl (mirrors, dependency scanners, archive bots).
// So the number this script leads with is NOT the total — it is the latest version's downloads
// minus the median of the stale versions, which is the only estimate of human installs the feed
// supports. It is an estimate. It says so.
//
// THE 14-DAY WINDOW. GitHub's traffic API keeps two weeks and forgets. Every run appends one dated
// line to `.boss/reach.jsonl` (gitignored — a per-checkout ledger, never a repo file) so a curve
// can exist at all. `--no-save` reads without writing.
//
// OFFLINE IS NOT A FINDING — same line as check-published.js: a shrug, exit 0. `gh` missing or
// signed out is the same shape: say which half is blind, show the other half.
//
// NOT IN `npm run check`. This is a number to look at, not a gate to pass. It prints and exits 0
// unless the network died mid-read.

import { appendFileSync, existsSync, readFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { BOSS_ROOT } from '../src/paths.js';
import { PKG } from '../src/update.js';
import { dim, bold, ok, warn, err } from '../src/ui.js';

const SAVE = !process.argv.includes('--no-save');
const TIMEOUT_MS = 6000;
const REPO = 'ajeshh/bossbuild';
const TAP_REPO = 'ajeshh/homebrew-boss';
const LEDGER = join(BOSS_ROOT, '.boss', 'reach.jsonl');

async function get(url) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: ctrl.signal, headers: { 'user-agent': 'boss-check-reach' } });
    if (!res.ok) return { error: `HTTP ${res.status}` };
    return { body: await res.json() };
  } catch (e) {
    return { error: e?.name === 'AbortError' ? 'timed out' : 'no network', offline: true };
  } finally {
    clearTimeout(timer);
  }
}

// `gh api` rather than fetch: traffic endpoints need push access, and gh already holds the token.
// One probe up front so a missing/signed-out gh is reported once, not once per endpoint.
function gh(path, jq) {
  const r = spawnSync('gh', ['api', path, ...(jq ? ['--jq', jq] : [])], { encoding: 'utf8', timeout: TIMEOUT_MS });
  if (r.error) return { error: 'gh not installed' };
  if (r.status !== 0) {
    const msg = (r.stderr || '').trim().split('\n')[0] || `exit ${r.status}`;
    return { error: /auth|login|token/i.test(msg) ? 'gh is signed out' : msg };
  }
  try { return { body: JSON.parse(r.stdout) }; } catch { return { body: r.stdout.trim() }; }
}

function median(xs) {
  if (!xs.length) return 0;
  const s = [...xs].sort((a, b) => a - b);
  const m = s.length >> 1;
  return s.length % 2 ? s[m] : Math.round((s[m - 1] + s[m]) / 2);
}

function readLedger() {
  if (!existsSync(LEDGER)) return [];
  return readFileSync(LEDGER, 'utf8').split('\n').filter(Boolean).map((l) => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);
}

const delta = (now, then, key) => {
  if (then?.[key] == null || now?.[key] == null) return '';
  const d = now[key] - then[key];
  return dim(` (${d >= 0 ? '+' : ''}${d} since ${then.date})`);
};

console.log(`\n  ${bold('BOSS reach')}  ${dim('· what the public counters can see')}\n`);

const snap = { date: new Date().toISOString().slice(0, 10) };
const prev = readLedger().at(-1);

// --- npm ------------------------------------------------------------------
const [latestRes, monthRes, weekRes, perVerRes] = await Promise.all([
  get(`https://registry.npmjs.org/${PKG}/latest`),
  get(`https://api.npmjs.org/downloads/point/last-month/${PKG}`),
  get(`https://api.npmjs.org/downloads/point/last-week/${PKG}`),
  get(`https://api.npmjs.org/versions/${PKG}/last-week`),
]);

if (latestRes.offline && monthRes.offline) {
  console.log(`  ${dim('No network — npm skipped.')}`);
} else if (latestRes.error || perVerRes.error) {
  console.log(`  ${warn('⚠')} npm  ${dim(`couldn't read the registry (${latestRes.error || perVerRes.error})`)}`);
} else {
  const latest = latestRes.body?.version;
  const perVer = perVerRes.body?.downloads ?? {};
  const latestDl = perVer[latest] ?? 0;
  const stale = Object.entries(perVer).filter(([v, n]) => v !== latest && n > 0).map(([, n]) => n);
  const floor = median(stale);
  const humans = Math.max(0, latestDl - floor);
  Object.assign(snap, {
    npm_month: monthRes.body?.downloads ?? null,
    npm_week: weekRes.body?.downloads ?? null,
    npm_latest: latest,
    npm_latest_week: latestDl,
    npm_crawl_floor: floor,
    npm_humans_est: humans,
  });
  console.log(`  ${bold('npm')}  ${PKG}@${latest}`);
  console.log(`      ${bold(String(humans))} ${dim('≈ human installs last week — latest-version downloads minus the crawl floor')}${delta(snap, prev, 'npm_humans_est')}`);
  console.log(`      ${dim(`latest ${latestDl} · crawl floor ${floor} (median of ${stale.length} stale versions still being fetched)`)}`);
  console.log(`      ${dim(`raw: ${snap.npm_week ?? '?'} last week · ${snap.npm_month ?? '?'} last month — tarball fetches, not people`)}`);
  if (stale.length >= 3 && floor > 0 && latestDl <= floor * 1.2) {
    console.log(`      ${dim('Latest is inside the crawl band — nothing here distinguishes a person from a mirror.')}`);
  }
}

// --- GitHub ---------------------------------------------------------------
console.log('');
const probe = gh(`repos/${REPO}`);
if (probe.error) {
  console.log(`  ${warn('⚠')} github  ${dim(`${probe.error} — traffic, stars and the tap are blind this run`)}`);
} else {
  const meta = probe.body;
  const clones = gh(`repos/${REPO}/traffic/clones`);
  const views = gh(`repos/${REPO}/traffic/views`);
  const tapMeta = gh(`repos/${TAP_REPO}`);
  const tapClones = gh(`repos/${TAP_REPO}/traffic/clones`);
  Object.assign(snap, {
    gh_private: !!meta.private,
    gh_stars: meta.stargazers_count ?? null,
    gh_forks: meta.forks_count ?? null,
    gh_open_issues: meta.open_issues_count ?? null,
    gh_clones_14d: clones.body?.count ?? null,
    gh_cloners_14d: clones.body?.uniques ?? null,
    gh_views_14d: views.body?.count ?? null,
    gh_viewers_14d: views.body?.uniques ?? null,
    tap_private: tapMeta.body ? !!tapMeta.body.private : null,
    tap_clones_14d: tapClones.body?.count ?? null,
    tap_tappers_14d: tapClones.body?.uniques ?? null,
  });

  console.log(`  ${bold('github')}  ${REPO}${meta.private ? `  ${warn('private')}` : ''}`);
  console.log(`      ${bold(String(snap.gh_stars))} stars · ${snap.gh_forks} forks · ${snap.gh_open_issues} open issues${delta(snap, prev, 'gh_stars')}  ${dim('— the only counters a bot never moves')}`);
  if (views.error) console.log(`      ${dim(`traffic: ${views.error} (needs push access)`)}`);
  else console.log(`      ${dim(`14d: ${snap.gh_viewers_14d} people viewed (${snap.gh_views_14d} views) · ${snap.gh_cloners_14d} cloned (${snap.gh_clones_14d} clones — includes mirrors and your own machines)`)}`);
  if (meta.private) {
    console.log(`      ${err('✗')} ${bold('private')} ${dim('— /feedback ships `gh issue create --repo ' + REPO + '` and a prefilled issues/new link; both 404 for a stranger now.')}`);
  }

  console.log(`  ${bold('tap')}  ${TAP_REPO}${snap.tap_private ? `  ${warn('private')}` : ''}`);
  if (tapClones.error) console.log(`      ${dim(`traffic: ${tapClones.error}`)}`);
  else console.log(`      ${dim(`14d: ${snap.tap_tappers_14d} machines fetched it (${snap.tap_clones_14d} fetches) — \`brew tap\` clones, \`brew update\` fetches; an upper bound on machines with the tap, yours included`)}${delta(snap, prev, 'tap_tappers_14d')}`);
  console.log(`      ${dim('Homebrew publishes no analytics for third-party taps; the formula pulls the npm tarball, so brew installs land in the npm count above.')}`);
  if (snap.tap_private) console.log(`      ${err('✗')} ${bold('private')} ${dim('— `brew tap ajeshh/boss` cannot clone a private repo; the Homebrew install path is dead.')}`);
}

// --- ledger ---------------------------------------------------------------
console.log('');
if (SAVE) {
  mkdirSync(join(BOSS_ROOT, '.boss'), { recursive: true });
  appendFileSync(LEDGER, JSON.stringify(snap) + '\n');
  console.log(`  ${ok('✓')} ${dim(`snapshot appended to .boss/reach.jsonl (${readLedger().length} so far — GitHub forgets after 14 days; this doesn't)`)}`);
} else {
  console.log(`  ${dim('--no-save: nothing written')}`);
}
console.log(`  ${dim('Estimates, not counts. Nothing here can see a running install — that would take a phone-home, which is a decision, not a script.')}\n`);
