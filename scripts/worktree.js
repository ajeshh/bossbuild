#!/usr/bin/env node
// worktree — one worktree per piece of work, which chat windows join (IDEA-120).
//
//   node scripts/worktree.js                list the open work
//   node scripts/worktree.js IDEA-142       create the work's worktree, or join it if it exists
//   node scripts/worktree.js review IDEA-142  which scope review its diff calls for, and the files
//   node scripts/worktree.js land IDEA-142  rebase it onto the main branch, then fast-forward main
//        … land IDEA-142 --skip-review "why"  the same, with the skipped review kept as a git note
//   node scripts/worktree.js done IDEA-142  unlink the records, remove the worktree, drop the branch
//
// THE SCOPE REVIEW (IDEA-158): before land, a fresh subagent reads the diff against the record. The
// diff picks which review (Ajesh, 2026-10-08): records and docs only gets a text review, any other
// file a code review. A records-only land used to get the code review's question, which had nothing
// to find. This script does not gate on it, it names the review; skipping one is a choice with a
// why, kept as a note on the tip (`git log --notes=review`).
//
// WHY: chat windows share one checkout, so any of them can commit another's half-done work. That is
// what CLAUDE.md's never-checkout / never-stash / stage-one-hunk rules hold back by hand. A worktree
// per piece of work makes "whose change is this" a fact on disk: everything in `idea-142` is
// IDEA-142's, so committing all of it is right. A second window on the same work joins it.
//
// WHAT THE 2026-10-05 TRIAL TAUGHT THIS SCRIPT (IDEA-120, findings in the record):
//   · Branch from LOCAL HEAD — the host's default is origin/main, which lags unpushed commits.
//   · The gitignored records (.boss/, evidence, research, CANVAS, .claude/) are absent from a
//     worktree. They are linked, never copied: they are the single-copy files behind both of this
//     repo's unrecoverable losses, and a copy per worktree is a fork. The set is DERIVED from
//     .gitignore, never listed — the hand-kept list in CLAUDE.md was missing seven areas.
//   · A directory ignored whole can still hold tracked files (docs/research/verdicts/): linking it
//     would hide the worktree's own tracked copies, so descend and link only the ignored children.
//   · A trailing-slash ignore rule does not match a symlink, so each link also goes in the shared,
//     untracked .git/info/exclude — or one `git add -A` commits absolute paths to a public repo.
//   · Landing is `--ff-only` from the main checkout. Git refuses, and touches nothing, when a session
//     there holds an uncommitted copy of a file the work changed — say so and stop.
//   · `done` deletes symlinks ONLY, before removing the worktree; their targets are the originals.

import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, lstatSync, mkdirSync, readdirSync, readFileSync, realpathSync, symlinkSync, unlinkSync, writeFileSync } from 'node:fs';
import { dirname, join, sep } from 'node:path';
import { pathToFileURL } from 'node:url';
import { openWork, describe } from '../stages/L0-quickstart/template/.claude/hooks/lib/open-work.js';

const git = (cwd, ...a) => execFileSync('git', a, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const gitIn = (cwd, input, ...a) => execFileSync('git', a, { cwd, input, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
const SKIP = new Set(['.git', 'node_modules', '.DS_Store']);
const NOISE = /^(site|\.wrangler|coverage|dist)(\/|$)|\.log$/;

export function mainCheckout(cwd) {
  const common = git(cwd, 'rev-parse', '--path-format=absolute', '--git-common-dir');
  return dirname(common);
}

export const nameOf = (id) => {
  const n = String(id || '').toLowerCase();
  if (!/^[a-z0-9][a-z0-9._-]{0,63}$/.test(n)) throw new Error(`not a work id: ${id} (expected e.g. IDEA-142 or FEAT-031)`);
  return n;
};

function walk(root) {
  const out = [];
  (function go(rel) {
    let entries;
    try { entries = readdirSync(join(root, rel), { withFileTypes: true }); } catch { return; }
    for (const e of entries) {
      if (SKIP.has(e.name)) continue;
      const p = rel ? `${rel}/${e.name}` : e.name;
      if (p === '.claude/worktrees') continue;
      out.push({ path: p, dir: e.isDirectory() });
      if (e.isDirectory()) go(p);
    }
  })('');
  return out;
}

/** Link the main checkout's gitignored paths into `wt` without shadowing a tracked file. */
export function linkRecords(main, wt) {
  const entries = walk(main);
  const all = entries.map((e) => e.path);
  // A directory goes in with its trailing slash: a `secret/` rule matches nothing without it.
  const ignored = new Set(
    gitIn(wt, entries.map((e) => (e.dir ? e.path + '/' : e.path)).join('\n') + '\n', 'check-ignore', '--no-index', '--stdin')
      .split('\n').filter(Boolean).map((p) => p.replace(/\/$/, '')),
  );
  const children = new Map();
  for (const p of all) {
    const d = p.includes('/') ? p.slice(0, p.lastIndexOf('/')) : '';
    if (!children.has(d)) children.set(d, []);
    children.get(d).push(p);
  }
  const linked = [];
  const place = (p) => {
    if (NOISE.test(p) || p.startsWith('.claude/worktrees')) return;
    const dst = join(wt, p);
    let st = null;
    try { st = lstatSync(dst); } catch { /* absent */ }
    if (!st) {
      mkdirSync(dirname(dst), { recursive: true });
      symlinkSync(join(main, p), dst);
      linked.push(p);
      return;
    }
    if (!st.isDirectory()) return; // a tracked file of the same name: the worktree's own copy wins
    for (const c of children.get(p) || []) if (ignored.has(c)) place(c);
  };
  const tops = [...ignored].filter((p) => !p.split('/').slice(0, -1).some((_, i, a) => ignored.has(a.slice(0, i + 1).join('/'))));
  for (const p of tops) {
    if (p === '.claude') { // holds worktrees/ — link its children, never itself (a loop)
      mkdirSync(join(wt, '.claude'), { recursive: true });
      for (const c of children.get('.claude') || []) place(c);
      continue;
    }
    place(p);
  }
  // Each link, slashless, into the shared exclude — a `dir/` rule never matches a symlink.
  const exclude = git(wt, 'rev-parse', '--path-format=absolute', '--git-path', 'info/exclude');
  const have = existsSync(exclude) ? readFileSync(exclude, 'utf8') : '';
  const lines = new Set(have.split('\n'));
  const add = linked.map((p) => `/${p}`).filter((l) => !lines.has(l));
  if (add.length) {
    mkdirSync(dirname(exclude), { recursive: true });
    const head = have.includes('# worktree.js links') ? '' : '\n# worktree.js links — gitignored records linked into worktrees (IDEA-120)\n';
    writeFileSync(exclude, have + (have.endsWith('\n') || !have ? '' : '\n') + head + add.join('\n') + '\n');
  }
  return linked;
}

export function createOrJoin(cwd, id) {
  const name = nameOf(id);
  const main = mainCheckout(cwd);
  const path = join(main, '.claude', 'worktrees', name);
  const branch = `work/${name}`;
  const open = openWork(main);
  if (open && open.items.some((i) => i.name === name)) return { joined: true, path, branch, name };
  git(main, 'worktree', 'add', '-q', '-b', branch, path, 'HEAD');
  const linked = linkRecords(main, path);
  return { joined: false, path, branch, name, linked: linked.length };
}

const TEXT = /\.(md|txt)$/i;
export const REVIEW_ASKS = {
  text: 'does the change say what the record says, and nothing it doesn’t?',
  code: 'what got built that no criterion, task or found item names?',
};

/** The review a diff calls for: text when every changed file is a record or doc, else code. */
export function reviewFor(path, base) {
  const files = git(path, 'diff', '--name-only', `${base}...HEAD`).split('\n').filter(Boolean);
  const code = files.filter((f) => !TEXT.test(f));
  return { mode: code.length ? 'code' : 'text', files, code };
}

function workAt(cwd, id) {
  const main = mainCheckout(cwd);
  const name = nameOf(id);
  const open = openWork(main);
  const item = open && open.items.find((i) => i.name === name);
  return { main, name, open, item, path: join(main, '.claude', 'worktrees', name) };
}

export function review(cwd, id) {
  const { name, open, item, path } = workAt(cwd, id);
  if (!item) return { ok: false, why: `no open work named ${name}` };
  return { ok: true, ...reviewFor(path, open.base) };
}

export function land(cwd, id, opts = {}) {
  const { main, name, open, item, path } = workAt(cwd, id);
  if (!item) return { ok: false, why: `no open work named ${name}` };
  if (opts.skip !== undefined && !String(opts.skip).trim()) return { ok: false, why: '--skip-review needs a why, in quotes after it' };
  const tracked = git(path, 'status', '--porcelain', '--untracked-files=no');
  if (tracked) return { ok: false, why: `${name} has uncommitted changes — commit them (or drop them) first:\n${tracked}` };
  const rv = reviewFor(path, open.base);
  const rebase = spawnSync('git', ['rebase', open.base], { cwd: path, encoding: 'utf8' });
  if (rebase.status !== 0) {
    spawnSync('git', ['rebase', '--abort'], { cwd: path });
    return { ok: false, why: `rebasing ${name} onto ${open.base} conflicts — resolve it in ${path} with \`git rebase ${open.base}\`, then land again.` };
  }
  const ff = spawnSync('git', ['merge', '--ff-only', item.branch], { cwd: main, encoding: 'utf8' });
  if (ff.status !== 0) {
    const files = (ff.stderr.match(/^\t(.+)$/gm) || []).map((l) => l.trim());
    return {
      ok: false,
      why: files.length
        ? `the main checkout holds uncommitted changes to ${files.join(', ')} — a session working there. Nothing moved. Land again once they commit, or once that work has its own worktree.`
        : `${open.base} moved while landing, or can't fast-forward: ${ff.stderr.trim().split('\n')[0]} — run land again.`,
    };
  }
  if (opts.skip !== undefined) {
    git(main, 'notes', '--ref=review', 'add', '-f', '-m', `${rv.mode} review skipped: ${String(opts.skip).trim()}`, item.branch);
  }
  return { ok: true, base: open.base, branch: item.branch, ahead: item.ahead, review: rv, skipped: opts.skip };
}

const reviewLine = (rv) => rv.mode === 'text'
  ? `text review: ${rv.files.length} file${rv.files.length === 1 ? '' : 's'}, records and docs only`
  : `code review: ${rv.code.length} of ${rv.files.length} file${rv.files.length === 1 ? '' : 's'} not records or docs`;

export function done(cwd, id) {
  const main = mainCheckout(cwd);
  const name = nameOf(id);
  const path = join(main, '.claude', 'worktrees', name);
  if (!existsSync(path)) return { ok: false, why: `no worktree at ${path}` };
  const here = realpathSync(cwd);
  const there = realpathSync(path);
  if (here === there || here.startsWith(there + sep)) {
    return { ok: false, why: 'run `done` from outside the worktree it removes' };
  }
  // Symlinks only: their targets are the main checkout's single copies.
  let unlinked = 0;
  (function go(d) {
    for (const e of readdirSync(d, { withFileTypes: true })) {
      if (e.name === '.git') continue;
      const p = join(d, e.name);
      if (e.isSymbolicLink()) { unlinkSync(p); unlinked++; } else if (e.isDirectory()) go(p);
    }
  })(path);
  const rm = spawnSync('git', ['worktree', 'remove', path], { cwd: main, encoding: 'utf8' });
  if (rm.status !== 0) return { ok: false, why: `git kept the worktree: ${rm.stderr.trim()} (its links are already gone; rerun ${name} to relink)` };
  const br = spawnSync('git', ['branch', '-d', `work/${name}`], { cwd: main, encoding: 'utf8' });
  return { ok: true, unlinked, branchKept: br.status !== 0 ? br.stderr.trim() : null };
}

function main(argv) {
  const [a, b] = argv;
  const cwd = process.cwd();
  if (!a) {
    const open = openWork(cwd);
    if (!open || !open.items.length) { console.log('No open work. Start one: node scripts/worktree.js IDEA-NNN'); return 0; }
    console.log(`Open work (land into ${open.base}):`);
    for (const i of open.items) console.log(`  ${open.current === i.name ? '▸' : ' '} ${describe(i)}  ${i.path}`);
    return 0;
  }
  if (a === 'review') {
    const r = review(cwd, b);
    if (!r.ok) { console.log(`No review: ${r.why}`); return 1; }
    console.log(`${b} calls for a ${reviewLine(r)}.\n  Ask: ${REVIEW_ASKS[r.mode]}`);
    for (const f of r.files) console.log(`  ${r.code.includes(f) ? 'code' : 'text'}  ${f}`);
    return 0;
  }
  if (a === 'land') {
    const i = argv.indexOf('--skip-review');
    const r = land(cwd, b, i === -1 ? {} : { skip: argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : '' });
    if (!r.ok) { console.log(`Not landed: ${r.why}`); return 1; }
    console.log(`Landed ${r.branch} on ${r.base}. \`node scripts/worktree.js done ${b}\` when you're finished with it.`);
    console.log(r.skipped !== undefined
      ? `  Skipped the ${reviewLine(r.review)}. Why: ${String(r.skipped).trim()} (kept as a note, \`git log --notes=review\`).`
      : `  The diff called for a ${reviewLine(r.review)}.`);
    return 0;
  }
  if (a === 'done') {
    const r = done(cwd, b);
    console.log(r.ok ? `Removed ${nameOf(b)} (${r.unlinked} links undone, originals untouched).${r.branchKept ? ` Branch kept — ${r.branchKept}` : ''}` : `Not removed: ${r.why}`);
    return r.ok ? 0 : 1;
  }
  const r = createOrJoin(cwd, a);
  console.log(r.joined
    ? `Joining ${r.name} — another window already works there. Everything in it is ${a.toUpperCase()}'s.`
    : `Created ${r.name} on ${r.branch} at local HEAD; ${r.linked} gitignored records linked, not copied.`);
  console.log(`  ${r.path}`);
  return 0;
}

if (import.meta.url === pathToFileURL(process.argv[1] || '').href) {
  try { process.exitCode = main(process.argv.slice(2)); } catch (e) { console.error(e.message); process.exitCode = 1; }
}
