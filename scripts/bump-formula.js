#!/usr/bin/env node
// BOSS · bump the Homebrew formula — the hand step that nobody remembered, made one command.
//
//   npm run bump:formula                 point the tap at whatever npm currently serves as latest
//   npm run bump:formula -- --version X  point it at a specific published version
//   npm run bump:formula -- --commit     also commit in the tap checkout (never pushes)
//   npm run bump:formula -- --tap PATH   a tap checkout somewhere other than brew's
//
// WHY THIS EXISTS: bumping the formula by hand means editing THREE fields that have to agree —
// `url`, `sha256`, and the version string inside `test do`. Nothing computed the sha256, so it came
// from running `shasum -a 256` on a tarball you had to download first, and nothing checked that the
// three matched afterwards. Three hand-copied fields in a second repo, with no gate on either side:
// the tap moved twice in two months while the repo shipped 38 releases.
//
// IT TARGETS NPM, NOT VERSION, and that is not a shortcut. The formula's `url` is the npm tarball,
// so the tap is structurally downstream: pointing it at an unpublished VERSION writes a formula
// whose url 404s. `npm publish` first, then this. The script refuses the other order rather than
// producing a broken formula — see the exit below.
//
// IT DOES NOT PUSH. A tap push is what a stranger's `brew install` resolves against; that stays a
// deliberate human keystroke. `--commit` goes as far as a commit in the tap checkout, and prints
// the push command rather than running it.

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { BOSS_ROOT } from '../src/paths.js';
import { cmpVersion } from '../src/changelog.js';
import { PKG } from '../src/update.js';
import { dim, bold, ok, warn, err } from '../src/ui.js';

const argv = process.argv.slice(2);
const flag = (name) => { const i = argv.indexOf(`--${name}`); return i === -1 ? null : argv[i + 1]; };
const has = (name) => argv.includes(`--${name}`);

const die = (msg, hint) => {
  console.log(`\n  ${err('✗')} ${msg}`);
  if (hint) console.log(`  ${dim(hint)}`);
  console.log('');
  process.exit(1);
};

console.log(`\n  ${bold('BOSS formula bump')}\n`);

// --- 1. what version, and does npm actually have it? ----------------------
const wanted = flag('version');
const meta = await (async () => {
  const url = `https://registry.npmjs.org/${PKG}/${wanted ?? 'latest'}`;
  const res = await fetch(url).catch((e) => ({ ok: false, status: e?.message ?? 'no network' }));
  if (!res.ok) {
    if (res.status === 404 && wanted) {
      die(`npm has no ${PKG}@${wanted}.`,
        'The formula can only point at a tarball that exists. Publish it first, then bump.');
    }
    die(`Couldn't read the npm registry (${res.status}).`, 'This step needs network — it downloads the tarball to hash it.');
  }
  return res.json();
})();

const version = meta.version;
const tarball = meta.dist?.tarball;
if (!tarball) die('The registry entry has no dist.tarball.');

// The guard that makes the npm-first order structural rather than remembered.
const VERSION = readFileSync(join(BOSS_ROOT, 'VERSION'), 'utf8').trim();
if (cmpVersion(VERSION, version) > 0) {
  console.log(`  ${warn('⚠')} repo is at ${bold(VERSION)}; npm's newest is ${bold(version)}.`);
  console.log(`  ${dim('Pointing the tap at ' + version + ' is correct — a formula cannot reference an unpublished tarball.')}`);
  console.log(`  ${dim('Run `npm publish` first if you meant to ship ' + VERSION + ' to Homebrew too.')}\n`);
}

// --- 2. hash the exact bytes Homebrew will download ----------------------
// Not the registry's own `dist.integrity` (sha512) or `dist.shasum` (sha1) — Homebrew wants sha256
// of the tarball, so the only honest way to get it is to fetch the tarball and hash it.
process.stdout.write(`  ${dim('fetching')} ${tarball}\n`);
const res = await fetch(tarball);
if (!res.ok) die(`Tarball fetch failed (HTTP ${res.status}).`);
const bytes = Buffer.from(await res.arrayBuffer());
const sha256 = createHash('sha256').update(bytes).digest('hex');
console.log(`  ${dim('sha256')}   ${sha256}  ${dim(`(${(bytes.length / 1024).toFixed(0)} kB)`)}`);

// --- 3. find the tap checkout --------------------------------------------
const tapDir = flag('tap') ?? (() => {
  try {
    return execFileSync('brew', ['--repository', 'ajeshh/boss'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch { return null; }
})();
if (!tapDir || !existsSync(tapDir)) {
  die('No tap checkout found.',
    'Pass --tap PATH, or `brew tap ajeshh/boss` to get one at brew --repository ajeshh/boss.');
}
const formulaPath = join(tapDir, 'Formula', 'boss.rb');
if (!existsSync(formulaPath)) die(`No formula at ${formulaPath}.`);

// --- 4. move all three fields together -----------------------------------
const before = readFileSync(formulaPath, 'utf8');
const edits = [
  [/(url\s+")[^"]*(")/, `$1${tarball}$2`, 'url'],
  [/(sha256\s+")[0-9a-f]{64}(")/, `$1${sha256}$2`, 'sha256'],
  [/(assert_match\s+")\d+\.\d+\.\d+(")/, `$1${version}$2`, 'test assertion'],
];
let after = before;
for (const [re, to, name] of edits) {
  if (!re.test(after)) die(`Couldn't find the ${name} in Formula/boss.rb.`, 'The formula shape changed — update this script rather than hand-editing.');
  after = after.replace(re, to);
}

// Verify the written result rather than trusting the regexes — three fields that must agree is the
// whole reason this script exists, so it re-reads and checks instead of assuming.
const check = {
  url: after.match(/url\s+"[^"]*\/oyeboss-(\d+\.\d+\.\d+)\.tgz"/)?.[1],
  sha: after.match(/sha256\s+"([0-9a-f]{64})"/)?.[1],
  test: after.match(/assert_match\s+"(\d+\.\d+\.\d+)"/)?.[1],
};
if (check.url !== version || check.test !== version || check.sha !== sha256) {
  die(`Post-write check failed — url ${check.url}, test ${check.test}, sha ${check.sha?.slice(0, 12)}….`);
}

if (before === after) {
  console.log(`\n  ${ok('✦')} Formula already at ${bold(version)} with a matching sha256 — nothing to do.\n`);
  process.exit(0);
}

writeFileSync(formulaPath, after);
const wasVersion = before.match(/url\s+"[^"]*\/oyeboss-(\d+\.\d+\.\d+)\.tgz"/)?.[1] ?? '?';
console.log(`\n  ${ok('✓')} ${formulaPath}`);
console.log(`      ${bold(wasVersion)} ${dim('→')} ${bold(version)}  ${dim('· url · sha256 · test assertion all moved')}`);

// --- 5. commit, but never push -------------------------------------------
if (has('commit')) {
  try {
    execFileSync('git', ['-C', tapDir, 'add', 'Formula/boss.rb'], { stdio: 'ignore' });
    execFileSync('git', ['-C', tapDir, 'commit', '-m', `boss ${version}`], { stdio: 'ignore' });
    console.log(`  ${ok('✓')} committed in the tap checkout`);
  } catch (e) { console.log(`  ${warn('⚠')} commit failed — the file is written; commit by hand.`); }
}

console.log(`\n  ${dim('Next, and deliberately not automated (this is what a stranger\'s `brew install` resolves):')}`);
if (!has('commit')) console.log(`      git -C ${tapDir} commit -am "boss ${version}"`);
console.log(`      git -C ${tapDir} push`);
console.log(`  ${dim('Then `npm run check:published` should go clean.')}\n`);
