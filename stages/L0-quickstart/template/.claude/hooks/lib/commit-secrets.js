#!/usr/bin/env node
// BOSS commit-secrets — a git pre-commit check (IDEA-142). Not a Claude Code hook: it runs on every
// `git commit` in this repo, whoever or whatever makes it, because a key is lost the moment it is in
// history — deleting the line later leaves it in every earlier commit, and in every clone.
//
// HOW IT IS WIRED: `installCommitGuard` below writes a three-line `.git/hooks/pre-commit` that runs
// this file. Git copies no hooks on clone, so it is called from three places: `boss new` / `adopt` /
// `sync --apply`, and the reentry hook at session start — the one that reaches a cofounder's fresh
// clone, who may never have installed the CLI. It writes only into a free slot:
//   - `core.hooksPath` set (husky, lefthook, a team convention) → their hooks live elsewhere.
//   - a `pre-commit` already there that isn't ours → theirs; never overwritten, never chained.
// The shim's mode is set by the writer, so nothing relies on npm or a copy keeping an exec bit.
// If this file is gone, the shim does nothing.
//
// WHAT IT CATCHES: the staged ADDED lines only, against key shapes specific enough that a match is
// almost certainly real (a provider's prefix, a fixed length, a PEM header) — plus a `.env` file that
// was force-added past .gitignore. Deliberately NOT a generic `password = "…"` or entropy scan: a
// check that cries wolf teaches `--no-verify`, and then it catches nothing. A Supabase key is caught
// only when it is the service-role one; the anon key is public by design. Firebase / Google `AIza`
// keys are left alone for the same reason — they belong in client config.
//
// IT NEVER PRINTS THE KEY: the agent reads this output, and the point is to keep the key out of
// places it can travel. Fail-open on any surprise: a broken check must not block a commit.
//
// Skip once (a test fixture, a documented example): `git commit --no-verify`.

import { execFileSync } from 'node:child_process';
import { chmodSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, dirname, isAbsolute, join } from 'node:path';
import { pathToFileURL } from 'node:url';

export const SHIM_MARK = '# boss: commit-secrets';
const SCRIPT = '.claude/hooks/lib/commit-secrets.js';

export const SHIM = `#!/bin/sh
${SHIM_MARK} — stops a commit that would put a key into git history (written by BOSS).
s="$(git rev-parse --show-toplevel)/${SCRIPT}"
[ -f "$s" ] && command -v node >/dev/null 2>&1 || exit 0
exec node "$s"
`;

const gitIn = (dir, ...a) => execFileSync('git', a, { cwd: dir, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();

/**
 * Lay down the pre-commit shim if the slot is free. Returns { state, path }:
 * installed | current | no-script | no-git | hooks-path | theirs.
 */
export function installCommitGuard(projectDir) {
  if (!existsSync(join(projectDir, SCRIPT))) return { state: 'no-script' };
  try { gitIn(projectDir, 'rev-parse', '--git-dir'); } catch { return { state: 'no-git' }; }
  let hooksPath = '';
  try { hooksPath = gitIn(projectDir, 'config', '--get', 'core.hooksPath'); } catch { /* unset */ }
  if (hooksPath) return { state: 'hooks-path', path: hooksPath };
  let hooksDir = gitIn(projectDir, 'rev-parse', '--git-path', 'hooks');
  if (!isAbsolute(hooksDir)) hooksDir = join(projectDir, hooksDir);
  const path = join(hooksDir, 'pre-commit');
  if (existsSync(path)) {
    const cur = readFileSync(path, 'utf8');
    if (!cur.includes(SHIM_MARK)) return { state: 'theirs', path };
    if (cur === SHIM) return { state: 'current', path };
  }
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, SHIM);
  chmodSync(path, 0o755);
  return { state: 'installed', path };
}

export const SHAPES = [
  ['AWS access key', /\b(?:AKIA|ASIA)[0-9A-Z]{16}\b/g],
  ['GitHub token', /\bgh[pousr]_[A-Za-z0-9]{36,}\b/g],
  ['GitHub token', /\bgithub_pat_[A-Za-z0-9_]{50,}\b/g],
  ['Anthropic API key', /\bsk-ant-(?:api|admin)\d{2}-[A-Za-z0-9_-]{40,}/g],
  ['OpenAI API key', /\bsk-(?:proj|svcacct|admin)-[A-Za-z0-9_-]{40,}/g],
  ['OpenAI API key', /\bsk-[A-Za-z0-9]{20}T3BlbkFJ[A-Za-z0-9]{20}\b/g],
  ['Stripe live key', /\b[rs]k_live_[0-9A-Za-z]{20,}\b/g],
  ['Supabase secret key', /\bsb_secret_[A-Za-z0-9_-]{20,}/g],
  ['Slack token', /\bxox[abprs]-[0-9A-Za-z-]{10,}/g],
  ['private key', /-----BEGIN (?:RSA |EC |DSA |OPENSSH |PGP |ENCRYPTED )?PRIVATE KEY(?: BLOCK)?-----/g],
];

const JWT = /\beyJ[A-Za-z0-9_-]{8,}\.(eyJ[A-Za-z0-9_-]{8,})\.[A-Za-z0-9_-]{8,}/g;

function isServiceRole(payload) {
  try {
    return JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')).role === 'service_role';
  } catch { return false; }
}

/** A `.env` committed on purpose past .gitignore — the examples are meant to be committed. */
export function isEnvFile(path) {
  const b = basename(path);
  return /^\.env(\..+)?$/.test(b) && !/\.(example|sample|template|defaults?)$/.test(b);
}

/** Findings in a `git diff --cached -U0` text: [{ file, line, what }]. Never the matched text. */
export function scan(diff) {
  const out = [];
  let file = null;
  let line = 0;
  for (const raw of diff.split('\n')) {
    if (raw.startsWith('+++ ')) { file = raw.slice(4).replace(/^b\//, ''); continue; }
    const hunk = /^@@ -\d+(?:,\d+)? \+(\d+)/.exec(raw);
    if (hunk) { line = Number(hunk[1]); continue; }
    if (!file || !raw.startsWith('+')) continue;
    const text = raw.slice(1);
    const seen = new Set();
    for (const [what, re] of SHAPES) {
      re.lastIndex = 0;
      if (re.test(text) && !seen.has(what)) { seen.add(what); out.push({ file, line, what }); }
    }
    JWT.lastIndex = 0;
    for (const m of text.matchAll(JWT)) {
      if (isServiceRole(m[1])) { out.push({ file, line, what: 'Supabase service-role key' }); break; }
    }
    line++;
  }
  return out;
}

function main() {
  const git = (...a) => execFileSync('git', a, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, stdio: ['ignore', 'pipe', 'ignore'] });
  const found = scan(git('diff', '--cached', '-U0', '--no-color', '--no-ext-diff', '--diff-filter=ACMR'));
  for (const p of git('diff', '--cached', '--name-only', '--diff-filter=A').split('\n').filter(Boolean)) {
    if (isEnvFile(p)) found.push({ file: p, line: null, what: 'an .env file' });
  }
  if (!found.length) return 0;
  const say = (s = '') => process.stderr.write(s + '\n');
  say('');
  say('BOSS stopped this commit: it would put a secret into git history, where it stays even after');
  say('you delete the line.');
  say('');
  for (const f of found) say(`  ${f.line ? `${f.file}:${f.line}` : f.file}  ${f.what}`);
  say('');
  say('Keep it out of the code: put it in .env (already ignored) and read it from the environment,');
  say('e.g. process.env.MY_KEY. If this key was ever pushed or shared, rotate it at the provider —');
  say('removing it here does not take it back.');
  say('Not a real secret (a test fixture, a documented example)? git commit --no-verify');
  say('');
  return 1;
}

if (import.meta.url === pathToFileURL(process.argv[1] || '').href) {
  let code = 0;
  try { code = main(); } catch { code = 0; }
  process.exit(code);
}
