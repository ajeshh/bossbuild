#!/usr/bin/env node
// BOSS · deployed state — is the site a stranger loads the site this repo built?
//
//   npm run check:deployed
//
// WHY THIS EXISTS (2026-08-24): `check:published` covers npm and the Homebrew tap — the two install
// paths — and nothing covered the third public surface. The website went **sixteen releases** stale
// without a single gate noticing, and on the day it was finally redeployed it went stale again
// within the hour: two more releases regenerated `site/`, and the zip sitting ready to upload had
// been built before both of them. Uploading it would have redeployed the SAME version and looked
// exactly like a successful deploy.
//
// THE GAP IS STRUCTURAL, not forgetfulness. `check:site` validates the built output in `site/` and
// is completely correct while the deployed copy is months old — it never leaves the filesystem. The
// deploy is a hand action into Cloudflare with no CI behind it, which is the same shape as the npm
// and tap publishes `check:published` exists for. **The absence of automation IS the bug**, and the
// same sentence applies here.
//
// AND THE STALE COPY LIES IN THE FLATTERING DIRECTION. A stale site does not look broken; it looks
// finished. Every page renders, every link resolves, and the only symptom is that the thing it
// describes is not the thing that ships. RESUME learned this the hard way and wrote the rule three
// separate times: *never describe the live site from a file — look at the URL.* This is that rule
// with a runner behind it.
//
// WHAT IT READS, and why it derives rather than hardcodes:
//   · The DOMAIN comes from the built site's own `<link rel="canonical">`. Not a constant here, and
//     not a second copy of `SITE_URL` — the artifact declares where it believes it lives, and this
//     tests exactly that claim. Change the domain in gen-site.js and this follows with no edit.
//   · The VERSION comes from `<meta name="generator" content="BOSS x.y.z">`, added to the shell in
//     the same release as this check. Before it, the only version on the page was PROSE ("Where
//     this actually is: v0.237.0") — and a gate that scrapes a sentence someone is free to reword
//     is a gate with a hidden expiry date.
//
// THRESHOLDS — the load-bearing decision, and the same one `check:published` makes: ONE behind is
// normal mid-release (you deploy after the gate passes), TWO or more is a finding. A gate that is
// red for the entire window between building and uploading is a gate people learn to skip, and
// BOSS has killed three checkers that way.
//
// Zero-dep by rule; global fetch (Node 18+). OFFLINE IS NOT A FAILURE — a check that fails on a
// plane is a check that gets removed. No network, a timeout, or an unreachable host all exit 0
// with a visible note, exactly like `check:published`.

import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = join(ROOT, 'site');
const TIMEOUT_MS = 8000;

const bold = (s) => `\x1b[1m${s}\x1b[0m`;
const dim = (s) => `\x1b[2m${s}\x1b[0m`;
const ok = (s) => `\x1b[32m${s}\x1b[0m`;
const warn = (s) => `\x1b[33m${s}\x1b[0m`;
const err = (s) => `\x1b[31m${s}\x1b[0m`;

const strict = process.argv.includes('--strict');

// Both facts come out of the same page with the same parser, so LOCAL and LIVE are read identically.
// Comparing a value parsed one way against a value parsed another is how two surfaces that agree
// end up reporting that they disagree.
const generatorOf = (html) => html.match(/<meta\s+name="generator"\s+content="BOSS\s+(\d+\.\d+\.\d+)"/i)?.[1] ?? null;
const canonicalOf = (html) => html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i)?.[1] ?? null;

function cmpVersion(a, b) {
  const pa = a.split('.').map(Number), pb = b.split('.').map(Number);
  for (let i = 0; i < 3; i++) if ((pa[i] || 0) !== (pb[i] || 0)) return (pa[i] || 0) - (pb[i] || 0);
  return 0;
}

// Real releases between two versions, from the CHANGELOG — the same method check-published uses.
// The arithmetic fallback is a guess and says so by being the fallback.
function releasesBetween(low, high) {
  try {
    const text = readFileSync(join(ROOT, 'registry', 'CHANGELOG.md'), 'utf8');
    const all = [...text.matchAll(/^##\s+(\d+\.\d+\.\d+)/gm)].map((m) => m[1]);
    const n = all.filter((v) => cmpVersion(v, low) > 0 && cmpVersion(v, high) <= 0).length;
    if (n) return n;
  } catch { /* fall through */ }
  return Math.abs(cmpVersion(high, low));
}

async function get(url) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: ctrl.signal, redirect: 'follow', headers: { 'user-agent': 'boss-check-deployed' } });
    const body = await res.text();
    return { status: res.status, body, finalUrl: res.url };
  } catch (e) {
    const dns = /getaddrinfo|ENOTFOUND|EAI_AGAIN/i.test(e?.message || '');
    return { error: e?.name === 'AbortError' ? 'timed out' : dns ? 'host does not resolve' : 'no network', offline: true, dns };
  } finally {
    clearTimeout(timer);
  }
}

// --- the local build, which is the thing that would be uploaded -------------------------------
const indexPath = join(SITE, 'index.html');
if (!existsSync(indexPath)) {
  console.log(`\n  ${bold('BOSS deployed state')}\n`);
  console.log(`  ${dim('No site/index.html — nothing has been built. `npm run gen:site` first.')}\n`);
  process.exit(0);
}
const localHtml = readFileSync(indexPath, 'utf8');
const localVersion = generatorOf(localHtml);
const canonical = canonicalOf(localHtml);

console.log(`\n  ${bold('BOSS deployed state')}  ${dim(`· built site/ v${localVersion || '?'}`)}\n`);

if (!canonical) {
  console.log(`  ${warn('⚠')} ${dim('site/index.html has no <link rel="canonical"> — cannot tell where this deploys to.')}\n`);
  process.exit(0);
}
if (!localVersion) {
  // The stamp is what makes this check possible; without it there is nothing to compare and saying
  // so is the honest output. Never fall back to scraping the prose version — that is the fragility
  // the stamp was added to remove.
  console.log(`  ${warn('⚠')} ${dim('site/index.html has no <meta name="generator"> stamp — rebuild with `npm run gen:site`.')}\n`);
  process.exit(0);
}

// --- the live copy, which is the only version that matters to a stranger ----------------------
const res = await get(canonical);

if (res.offline) {
  // A domain that does not resolve is reported as a NOTE, not a finding, and deliberately so: the
  // most likely cause is no network, and the check cannot tell that apart from a domain that has
  // lapsed. Saying which one it might be beats guessing wrong in either direction.
  console.log(`  ${dim(`No read of ${canonical} — ${res.error}.`)}`);
  if (res.dns) console.log(`  ${dim('If you are online, that means the domain in the canonical does not exist.')}`);
  console.log(`  ${dim('Offline is not a failure; this check needs one public GET and nothing else.')}\n`);
  process.exit(0);
}

const findings = [];
// Whether the live version was actually READ. Not the same as "no findings" — and conflating the
// two is the failure v0.230.0 named: a gate that could not perform its check reported a pass. The
// first run of THIS check did exactly that, against a live copy with no stamp: zero findings, and a
// cheerful "the site a stranger loads is the site this repo built" while the deploy was three
// releases behind. Unverifiable is `not checked`, never a pass.
let verified = false;

if (res.status !== 200) {
  console.log(`  ${err('✗')} ${bold(canonical)} ${dim(`— HTTP ${res.status}`)}`);
  findings.push(`the site's own canonical URL returns HTTP ${res.status} — every page points at a URL that does not serve.`);
} else {
  const liveVersion = generatorOf(res.body);
  const liveCanonical = canonicalOf(res.body);

  if (!liveVersion) {
    // Expected exactly once: the deploy still predates the release that added the stamp.
    console.log(`  ${warn('⚠')} ${bold(canonical)} ${dim('— serving, but with no generator stamp')}`);
    console.log(`      ${dim('That means the live copy predates the release that added it. Redeploy and this reads clean.')}`);
  } else if (cmpVersion(liveVersion, localVersion) >= 0) {
    verified = true;
    console.log(`  ${ok('✓')} live ${dim(`${canonical} at ${liveVersion} — matches what site/ was built from`)}`);
  } else {
    verified = true;
    const behind = releasesBetween(liveVersion, localVersion);
    const hard = behind >= 2;
    console.log(`  ${hard ? err('✗') : warn('⚠')} live ${bold(`${canonical} at ${liveVersion}`)} ${dim(`vs built site/ ${localVersion}`)} — ${bold(String(behind))} behind`);
    if (hard) findings.push(`the deployed site is ${behind} releases behind what site/ was built from — a stale site does not look broken, it looks finished.`);
    else console.log(`      ${dim('One behind is normal mid-release — you deploy after this gate passes.')}`);
  }

  // A live canonical pointing somewhere else means the deploy landed on a different domain than the
  // build believes in — which sends every crawler to the wrong place while both pages look correct.
  if (liveCanonical && liveCanonical.replace(/\/$/, '') !== canonical.replace(/\/$/, '')) {
    console.log(`  ${err('✗')} the live page's canonical is ${bold(liveCanonical)}, not ${bold(canonical)}`);
    findings.push('the deployed copy and the local build disagree about which domain is canonical.');
  }
}

console.log('');
if (!findings.length && verified) {
  console.log(`  ${ok('✦')} The site a stranger loads is the site this repo built.\n`);
  process.exit(0);
}
if (!findings.length) {
  // Reached the site, could not read a version off it. Say so plainly rather than banking it as a
  // pass — the whole point of the check is the gap between "looks fine" and "is current".
  console.log(`  ${warn('~')} ${bold('NOT CHECKED')} ${dim('— the live copy is serving, but its version could not be read.')}`);
  console.log(`  ${dim('This is not a pass. Redeploy so the stamp is there, and this answers properly.')}\n`);
  process.exit(0);
}

console.log(`  ${findings.length} finding(s) — what is deployed is not what this repo built.\n`);
for (const f of findings) console.log(`      · ${f}`);
console.log(`\n  ${dim('Rebuild with `npm run gen:site`, then upload the whole `site/` folder.')}`);
console.log(`  ${dim('Not automated — that absence IS the bug this catches, same as `check:published`.')}\n`);
process.exit(strict ? 1 : 0);
