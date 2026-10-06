// Open work — the worktrees under `.claude/worktrees/`, one per piece of work (IDEA-120).
//
// Each chat window is its own session; all they share is the disk. So a window can't know another
// is building the same thing unless something says so at the moment it matters. This reads what is
// open — which work, how far ahead of the main branch, how fresh, what's uncommitted — so a session
// start can name it once and a new window can answer "that's mine" and join instead of starting a
// second copy in the shared checkout.
//
// Read-only. Every git call is local and cheap; any surprise returns null (the caller says nothing).

import { execFileSync } from 'node:child_process';
import { realpathSync } from 'node:fs';
import { sep } from 'node:path';

const git = (cwd, ...a) => execFileSync('git', a, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
const real = (p) => { try { return realpathSync(p); } catch { return p; } };
const MARK = `${sep}.claude${sep}worktrees${sep}`;

/** { base, mainPath, current, items: [{ name, path, branch, ahead, dirty, minutes }] } or null. */
export function openWork(projectDir, { now = Date.now() } = {}) {
  let list;
  try { list = git(projectDir, 'worktree', 'list', '--porcelain'); } catch { return null; }
  const entries = list.split(/\n\n+/).map((block) => {
    const e = {};
    for (const line of block.split('\n')) {
      const [k, ...v] = line.split(' ');
      if (k === 'worktree') e.path = v.join(' ');
      else if (k === 'branch') e.branch = v.join(' ').replace(/^refs\/heads\//, '');
    }
    return e;
  }).filter((e) => e.path);
  if (!entries.length) return null;
  const main = entries[0];
  const here = real(projectDir);
  const items = [];
  for (const e of entries.slice(1)) {
    const p = real(e.path);
    if (!(p + sep).includes(MARK) || !e.branch) continue;
    const name = p.slice(p.lastIndexOf(sep) + 1);
    let ahead = 0, dirty = 0, minutes = null;
    try { ahead = Number(git(main.path, 'rev-list', '--count', `${main.branch}..${e.branch}`)); } catch { /* unknown */ }
    try { dirty = git(p, 'status', '--porcelain').split('\n').filter(Boolean).length; } catch { /* gone */ }
    if (ahead) {
      try { minutes = Math.round((now - Number(git(main.path, 'log', '-1', '--format=%ct', e.branch)) * 1000) / 60000); } catch { /* unknown */ }
    }
    items.push({ name, path: e.path, branch: e.branch, ahead, dirty, minutes });
  }
  const current = items.find((i) => here === real(i.path) || here.startsWith(real(i.path) + sep));
  return { base: main.branch, mainPath: main.path, current: current ? current.name : null, items };
}

const ago = (m) => (m < 60 ? `${m} min ago` : m < 2880 ? `${Math.round(m / 60)} h ago` : `${Math.round(m / 1440)} days ago`);

/** One item as a short phrase: "idea-142 (2 commits ahead, last 10 min ago, 1 file uncommitted)". */
export function describe(i) {
  const bits = [i.ahead ? `${i.ahead} commit${i.ahead === 1 ? '' : 's'} ahead${i.minutes != null ? `, last ${ago(i.minutes)}` : ''}` : 'no commits yet'];
  if (i.dirty) bits.push(`${i.dirty} file${i.dirty === 1 ? '' : 's'} uncommitted`);
  return `${i.name} (${bits.join(', ')})`;
}
