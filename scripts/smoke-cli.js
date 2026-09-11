#!/usr/bin/env node
// The CLI smoke — "does `boss` work on THIS machine?" — as one node script, so it runs the same
// on macOS, Linux and Windows. No shell globs, no `$VAR`, no `/tmp`: every one of those is a
// thing that is true on one OS and silently false on another, which is how BOSS shipped ~300
// releases verified on exactly one laptop (IDEA-095).
//
// What it exercises, in order, and why each step is here:
//   boss new           — scaffold + git init + register (the Quickstart template, end to end)
//   boss id IDEA       — next-id allocation. THE Windows defect lived here: a `join()`ed path
//                        split on '/' made every id look unallocated, so ids duplicated.
//   boss unlock mvp    — the second template layer copies cleanly on top of the first
//   boss status/board/records — the three deterministic readers a founder runs most
//   the conscience hook, fed a UserPromptSubmit payload on stdin — the JS runs under node here;
//                        whether the HOST invokes it through a POSIX shell on Windows is a separate
//                        question this script cannot answer (IDEA-095 says so).
//
// Cleans up after itself, including its own row in ~/.boss/registry.json — the registry is
// per-machine and a smoke run must not leave a ghost project in `boss list`.

import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync, mkdirSync, existsSync, readFileSync, realpathSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const BOSS = join(ROOT, 'bin', 'boss');
const REGISTRY = join(process.env.HOME || process.env.USERPROFILE || tmpdir(), '.boss', 'registry.json');

let failures = 0;
const ok = (label) => console.log(`  ✓ ${label}`);
const fail = (label, detail) => { failures++; console.log(`  ✗ ${label}\n      ${String(detail).split('\n').join('\n      ')}`); };

function boss(args, cwd) {
  const r = spawnSync(process.execPath, [BOSS, ...args], { cwd, encoding: 'utf8' });
  return { code: r.status, out: (r.stdout || '') + (r.stderr || '') };
}

function expect(label, r, { code = 0, match } = {}) {
  if (r.code !== code) return fail(label, `exit ${r.code}, wanted ${code}\n${r.out.trim()}`);
  if (match && !match.test(r.out)) return fail(label, `output did not match ${match}\n${r.out.trim()}`);
  ok(label);
}

// realpath, because macOS hands out `/var/…` for a dir that registers as `/private/var/…`, and
// the prune below matches on the registered path. Without this the first run left a ghost row.
const work = realpathSync(mkdtempSync(join(tmpdir(), 'boss-smoke-')));
const app = join(work, 'smoke-app');
console.log(`\nBOSS · CLI smoke   node ${process.version} · ${process.platform}/${process.arch}\n  ${work}\n`);

try {
  expect('boss new scaffolds', boss(['new', 'smoke-app'], work));
  for (const f of ['.boss/manifest.json', '.claude/settings.json', '.claude/hooks/conscience.js', 'AGENTS.md', 'CLAUDE.md', '.gitignore']) {
    if (!existsSync(join(app, f))) fail(`scaffold wrote ${f}`, 'missing');
  }
  // Placeholder substitution reaches dotfiles too — the second Windows defect (scaffold.js
  // handed `isTextFile` a full path, so `.gitignore` kept its `{{name}}`).
  const leftover = ['CLAUDE.md', '.gitignore', 'AGENTS.md'].filter((f) => /\{\{\w+\}\}/.test(readFileSync(join(app, f), 'utf8')));
  if (leftover.length) fail('placeholders substituted', `unsubstituted {{…}} in ${leftover.join(', ')}`); else ok('placeholders substituted');

  expect('boss status reads a fresh project', boss(['status'], app), { match: /Quickstart/ });
  expect('boss id IDEA on an empty project', boss(['id', 'IDEA'], app), { match: /^IDEA-001\s*$/m });

  mkdirSync(join(app, 'docs', 'ideas'), { recursive: true });
  writeFileSync(join(app, 'docs', 'ideas', 'IDEA-001-first.md'), '---\nid: IDEA-001\ntype: idea\nowner: founder\nstatus: exploring\n---\n# IDEA-001 — first\n');
  writeFileSync(join(app, 'docs', 'ideas', 'IDEA-003-third.md'), '---\nid: IDEA-003\ntype: idea\nowner: founder\nstatus: exploring\n---\n# IDEA-003 — third\n');
  expect('boss id IDEA counts existing records (the Windows defect)', boss(['id', 'IDEA'], app), { match: /^IDEA-004\s*$/m });

  expect('boss unlock mvp layers the second template', boss(['unlock', 'mvp'], app));
  expect('boss status after unlock', boss(['status'], app), { match: /MVP/ });
  expect('boss board renders', boss(['board'], app));
  expect('boss records agrees with itself', boss(['records'], app));

  // The hook under node, fed what the host would send. Exit 0 and no `[conscience hook error]`
  // is the bar — the moment it chooses (or silence) is judgment, not smoke.
  const hook = spawnSync(process.execPath, [join(app, '.claude', 'hooks', 'conscience.js')], {
    cwd: app, encoding: 'utf8', env: { ...process.env, CLAUDE_PROJECT_DIR: app },
    input: JSON.stringify({ hook_event_name: 'UserPromptSubmit', prompt: 'add a login page', cwd: app }),
  });
  if (hook.status !== 0 || /hook error/.test(hook.stderr || '')) fail('conscience hook runs under node', `exit ${hook.status}\n${(hook.stderr || hook.stdout || '').trim()}`);
  else ok('conscience hook runs under node');
} finally {
  // Prune our row from the machine registry, then the tree. Both best-effort: a smoke that
  // cannot clean up is still a smoke that ran.
  try {
    const reg = JSON.parse(readFileSync(REGISTRY, 'utf8'));
    const before = reg.projects.length;
    reg.projects = reg.projects.filter((p) => !p.path || !p.path.startsWith(work));
    if (reg.projects.length !== before) writeFileSync(REGISTRY, JSON.stringify(reg, null, 2) + '\n');
  } catch { /* no registry, nothing to prune */ }
  try { rmSync(work, { recursive: true, force: true }); } catch { /* leave it */ }
}

console.log(failures ? `\n  ${failures} failed. Exit 1.\n` : '\n  CLI smoke clean.\n');
process.exit(failures ? 1 : 0);
