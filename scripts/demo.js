#!/usr/bin/env node
// demo — Kettlewick, live (IDEA-149).
//
// Lays the showcase's record set (`demo/kettlewick/`, FEAT-039) down as a working project, so checking a
// change no longer means `boss new` in /tmp plus an afternoon of hand-written records. The demo is
// already full, at MVP, with every chapter filled, and `check:demo` keeps it that way.
//
//   npm run demo                      # $TMPDIR/boss-kettlewick — reuses it if it's there
//   npm run demo -- --fresh           # wipe it and lay it down again (only a dir this script marked)
//   npm run demo -- --dir <path>      # somewhere else
//   source $TMPDIR/boss-kettlewick/env.sh   # cd in, BOSS_HOME set, `boss` = THIS checkout's bin/boss
//
// HOW IT STAYS HONEST: the install is BOSS's own `adopt --mode <stage>`, run with this checkout's
// `bin/boss`. Nothing is hand-stamped (gen-demo stamps; this must not, or it tests a stamp instead of
// an install). The history is built from the dates the records carry, authored by the fictional
// founder, and each commit says it was generated. It lives only in the copy, never in `demo/`.
//
// WHY THE GUARDS: 2026-08-21 a cleanup ran `boss remove --apply` in this repo instead of the throwaway
// and destroyed a single-copy file. So: never inside a git checkout that isn't the demo's own, and
// `--fresh` deletes only a dir carrying the `.boss-demo` marker this script writes.

import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, realpathSync, rmSync, statSync, writeFileSync, chmodSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dateField } from '../src/frontmatter.js';
import { DEMO } from './gen-demo.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const BOSS = join(ROOT, 'bin', 'boss');
const MARK = '.boss-demo';
const AUTHOR = { GIT_AUTHOR_NAME: 'Marta Kowalczyk', GIT_AUTHOR_EMAIL: 'marta@kettlewick.invalid', GIT_COMMITTER_NAME: 'Marta Kowalczyk', GIT_COMMITTER_EMAIL: 'marta@kettlewick.invalid' };
// The demo's stand-in for `.boss/manifest.json` (gen-demo reads it); the install writes the real one.
const NOT_THE_PROJECTS = new Set(['project.json']);

const git = (cwd, args, env = {}) => execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], env: { ...process.env, ...env } }).trim();

// The nearest existing ancestor's checkout, or null. A demo inside someone's repo is the 08-21 shape.
function enclosingCheckout(dir) {
  let d = dir;
  while (!existsSync(d)) d = dirname(d);
  try { return git(d, ['rev-parse', '--show-toplevel']); } catch { return null; }
}

function walk(dir, base = dir, out = []) {
  for (const n of readdirSync(dir)) {
    const p = join(dir, n);
    if (statSync(p).isDirectory()) walk(p, base, out); else out.push(relative(base, p).split(sep).join('/'));
  }
  return out;
}

// When each record came to be: its own `created:` / `date:`, else the venture's start. `.boss/` is the
// install's (and gitignored once adopted), so it never enters the history.
function dated(project, created) {
  const groups = new Map();
  for (const f of walk(project)) {
    if (f.startsWith('.boss/') || f.startsWith('.git/')) continue;
    let day = created;
    if (f.endsWith('.md')) { const t = readFileSync(join(project, f), 'utf8'); day = dateField(t, 'created') || dateField(t, 'date') || created; }
    if (!groups.has(day)) groups.set(day, []);
    groups.get(day).push(f);
  }
  return [...groups.entries()].sort(([a], [b]) => a.localeCompare(b));
}

export function layDown({ dir = join(tmpdir(), 'boss-kettlewick'), fresh = false, log = () => {} } = {}) {
  dir = resolve(dir);
  const project = join(dir, 'kettlewick');
  const home = join(dir, 'home');
  const meta = JSON.parse(readFileSync(join(DEMO, 'project.json'), 'utf8'));

  if (existsSync(dir) && readdirSync(dir).length) {
    if (!existsSync(join(dir, MARK))) throw new Error(`${dir} is not empty and isn't a demo this script made — pick another --dir.`);
    if (!fresh) return { dir, project, home, reused: true };
    rmSync(dir, { recursive: true, force: true });
  }
  const outer = enclosingCheckout(dir);
  if (outer) throw new Error(`${dir} is inside the git checkout ${outer} — the demo lays down its own repo, outside any other.`);

  mkdirSync(home, { recursive: true });
  writeFileSync(join(dir, MARK), 'Laid down by scripts/demo.js (IDEA-149). `npm run demo -- --fresh` deletes this whole folder.\n');
  cpSync(DEMO, project, { recursive: true, filter: (src) => !NOT_THE_PROJECTS.has(relative(DEMO, src)) });

  // 1. The history, from the dates the records carry.
  git(project, ['init', '-q', '-b', 'main']);
  for (const [day, files] of dated(project, meta.created)) {
    git(project, ['add', '--', ...files]);
    const when = `${day}T10:00:00`;
    const subject = files.length === 1 ? `Add ${files[0]}` : `Add ${files.length} files (${[...new Set(files.map((f) => f.split('/').slice(0, 2).join('/')))].slice(0, 3).join(', ')}…)`;
    git(project, ['commit', '-q', '--no-verify', '-m', subject, '-m', 'Generated by scripts/demo.js from the dates in the records. Kettlewick is fictional.'], { ...AUTHOR, GIT_AUTHOR_DATE: when, GIT_COMMITTER_DATE: when });
  }

  // 2. The install, the way a founder's runs.
  const env = { ...process.env, BOSS_HOME: home, NO_COLOR: '1' };
  execFileSync(process.execPath, [BOSS, 'adopt', '--mode', meta.mode], { cwd: project, env, stdio: ['ignore', 'pipe', 'pipe'] });
  // What adopt can't know about a venture that's been running since May: who it's for, when it began,
  // who's on the team. The same overlay the site's render uses (gen-demo.js), so the two read alike.
  const mf = join(project, '.boss', 'manifest.json');
  const manifest = JSON.parse(readFileSync(mf, 'utf8'));
  writeFileSync(mf, JSON.stringify({ ...manifest, cohort: meta.cohort, createdAt: meta.created }, null, 2) + '\n');
  if (meta.cohort) writeFileSync(join(project, '.boss', 'config.json'), JSON.stringify({ cohort: meta.cohort, team: [{ handle: '@ola', name: 'Ola Bennett', added: '2026-06-01' }] }, null, 2) + '\n');
  git(project, ['add', '-A']);
  git(project, ['commit', '-q', '--no-verify', '-m', `Adopt BOSS at ${meta.mode}`, '-m', 'Generated by scripts/demo.js: `boss adopt` from this checkout.'], AUTHOR);

  // 3. A shell that points at it: BOSS_HOME, and `boss` meaning this checkout, not the global install.
  mkdirSync(join(dir, 'bin'), { recursive: true });
  writeFileSync(join(dir, 'bin', 'boss'), `#!/bin/sh\nexec node "${BOSS}" "$@"\n`);
  chmodSync(join(dir, 'bin', 'boss'), 0o755);
  writeFileSync(join(dir, 'env.sh'), `# source me — Kettlewick, live (IDEA-149)\nexport BOSS_HOME="${home}"\nexport PATH="${join(dir, 'bin')}:$PATH"\ncd "${project}"\n`);
  log(`laid down from ${relative(ROOT, DEMO)} at ${meta.mode}`);
  return { dir, project, home, reused: false };
}

if (process.argv[1] && realpathSync(fileURLToPath(import.meta.url)) === realpathSync(process.argv[1])) {
  const a = process.argv.slice(2);
  const at = a.indexOf('--dir');
  try {
    const r = layDown({ dir: at >= 0 ? a[at + 1] : undefined, fresh: a.includes('--fresh') });
    console.log(`Kettlewick, live${r.reused ? ' (already there; --fresh to lay it down again)' : ''}`);
    console.log(`  project    ${r.project}`);
    console.log(`  BOSS_HOME  ${r.home}`);
    console.log(`  boss       ${BOSS} (this checkout)\n`);
    console.log(`  source ${join(r.dir, 'env.sh')}`);
    console.log('  boss status · boss board · claude');
  } catch (e) {
    console.error(`demo: ${e.message}`);
    process.exit(1);
  }
}
