// src/share.js — share the folders that stay out of git with a team, through a folder the team
// already syncs (PROG-005 T4, option A).
//
// T3 kept `docs/evidence/`, `docs/source/` and `docs/competition/` out of git: interview notes are
// other people's words, and a repo can go public with its whole history. That left a team with no
// way to share them. Three options were weighed (PROG-005 T4): a shared drive, a private docs repo,
// an internal doc server. This is the drive, because it is the only one that keeps IDEA-037's refusal
// (no server, no accounts), works for a non-technical cofounder on day one, and lets an interviewee's
// words actually be deleted — a private repo keeps them in every clone's history.
//
// The mechanism is a link: each local folder becomes a link to the same-named folder under the path
// the founder names, so every skill, hook and agent keeps reading `docs/evidence/` and nothing else
// changes. The ignore rules carry no trailing slash on purpose — `docs/evidence/` matches only a
// directory, and a link in its place would be committed, local path and all.
//
// Nothing is ever deleted. A local folder is copied into the shared one (a file already there is
// never overwritten; a same-named file that differs is reported and both are kept), then moved to
// .boss/backups/ before the link is made. `--off` turns each link back into a local copy of what
// the shared folder holds. Where the shared folder lives is per person — teammates mount the same
// drive at different paths — so it is written to ~/.boss/projects/<key>/, never to the repo.

import {
  existsSync, lstatSync, mkdirSync, readdirSync, readFileSync, writeFileSync, renameSync,
  symlinkSync, readlinkSync, unlinkSync, rmdirSync, cpSync, statSync, realpathSync,
} from 'node:fs';
import { join, resolve, sep } from 'node:path';
import { personStateDir } from '../stages/L0-quickstart/template/.claude/hooks/lib/person-state.js';

export const SHARED = ['evidence', 'source', 'competition'];

const isLink = (p) => { try { return lstatSync(p).isSymbolicLink(); } catch { return false; } };
const today = () => new Date().toISOString().slice(0, 10);

function settingPath(projectDir) {
  const d = personStateDir(projectDir);
  return d ? join(d, 'share.json') : null;
}

export function readShare(projectDir) {
  const p = settingPath(projectDir);
  if (!p || !existsSync(p)) return null;
  try { return JSON.parse(readFileSync(p, 'utf8')); } catch { return null; }
}

function writeShare(projectDir, value) {
  const p = settingPath(projectDir);
  if (!p) return;
  mkdirSync(join(p, '..'), { recursive: true });
  writeFileSync(p, JSON.stringify(value, null, 2) + '\n');
}

// Each shared folder as it stands: local, linked (and whether the link resolves), or absent.
export function shareStatus(projectDir) {
  return {
    setting: readShare(projectDir),
    folders: SHARED.map((name) => {
      const local = join(projectDir, 'docs', name);
      if (isLink(local)) return { name, state: existsSync(local) ? 'linked' : 'broken', target: readlinkSync(local) };
      return { name, state: existsSync(local) ? 'local' : 'absent', target: null };
    }),
  };
}

function walk(dir, base = dir, out = []) {
  for (const n of readdirSync(dir)) {
    const p = join(dir, n);
    if (statSync(p).isDirectory()) walk(p, base, out);
    else out.push(p.slice(base.length + 1));
  }
  return out;
}

export function share(projectDir, rootArg) {
  if (!existsSync(resolve(rootArg)) || !statSync(resolve(rootArg)).isDirectory()) {
    throw new Error(`${resolve(rootArg)} is not a folder. Point at one your team already syncs (a shared drive folder for this project).`);
  }
  // Real paths on both sides: on macOS a temp or home path can arrive as /var/… while the working
  // directory resolves to /private/var/…, and a prefix test on the raw strings waves an in-repo
  // folder through — the one mistake this check exists to stop.
  const root = realpathSync(resolve(rootArg));
  const project = realpathSync(resolve(projectDir));
  if (root === project || root.startsWith(project + sep)) {
    throw new Error('That folder is inside this repo — it would be committed. Point at the team\'s shared drive instead.');
  }
  const backup = join(projectDir, '.boss', 'backups', `share-${today()}`);
  const results = [];
  for (const name of SHARED) {
    const local = join(projectDir, 'docs', name);
    const target = join(root, name);
    mkdirSync(target, { recursive: true });
    if (isLink(local)) {
      if (resolve(readlinkSync(local)) === target) { results.push({ name, state: 'already' }); continue; }
      unlinkLink(local);
    }
    let copied = 0;
    const conflicts = [];
    if (existsSync(local)) {
      for (const rel of walk(local)) {
        const from = join(local, rel);
        const to = join(target, rel);
        if (!existsSync(to)) {
          cpSync(from, to, { recursive: false });
          copied += 1;
        } else if (!readFileSync(from).equals(readFileSync(to))) {
          conflicts.push(rel); // the shared copy stands; the local one is kept in the backup
        }
      }
      mkdirSync(backup, { recursive: true });
      renameSync(local, join(backup, name));
    }
    mkdirSync(join(projectDir, 'docs'), { recursive: true });
    symlinkSync(target, local, process.platform === 'win32' ? 'junction' : 'dir');
    results.push({ name, state: 'linked', copied, conflicts, backedUp: copied || conflicts.length ? join(backup, name) : null });
  }
  writeShare(projectDir, { root, since: today() });
  return { root, results };
}

// A link is removed as a link — never with a recursive delete, which would follow it into the
// team's shared folder.
function unlinkLink(p) {
  try { unlinkSync(p); } catch { rmdirSync(p); }
}

export function unshare(projectDir) {
  const results = [];
  for (const name of SHARED) {
    const local = join(projectDir, 'docs', name);
    if (!isLink(local)) { results.push({ name, state: 'local' }); continue; }
    const target = resolve(readlinkSync(local));
    unlinkLink(local);
    if (existsSync(target)) cpSync(target, local, { recursive: true });
    else mkdirSync(local, { recursive: true });
    results.push({ name, state: 'copied-back', from: target });
  }
  const p = settingPath(projectDir);
  if (p && existsSync(p)) unlinkSync(p);
  return results;
}
