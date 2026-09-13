// Shared by check-site.js and check-help.js — the two "did a human re-read this after its
// sources moved?" gates. They had the same four helpers as two copies, and when the UTC
// "today" bug was fixed (v0.324.0) it had to be fixed twice. One copy now.
//
// Dates here are the reviewer's calendar, not UTC. `reviewed:` is a day a person typed after
// looking at a page, and a commit made that evening is the same day to them — it was only
// "tomorrow" in UTC, which is why every page read as behind after 17:00 Pacific and the line
// printed nightly until nobody heeded it. Both sides of the comparison are local.

import { execSync } from 'node:child_process';

export const localDay = (ms) => { const d = new Date(ms); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
export const endOfLocalDay = (ymd) => { const [y, m, d] = ymd.split('-').map(Number); return new Date(y, m - 1, d, 23, 59, 59, 999).getTime(); };

/** Last commit touching any of `paths` (a space-separated pathspec), in ms — or `none` when nothing did. */
export function lastChangedAt(root, paths, none = 0) {
  try {
    const out = execSync(`git log -1 --format=%ct -- ${paths}`, { cwd: root, encoding: 'utf8' }).trim();
    return out ? Number(out) * 1000 : none;
  } catch { return none; }
}

/** Uncommitted changes under `paths` — the moment docs are cheapest to update. */
export function changingNow(root, paths) {
  try {
    const out = execSync(`git status --porcelain -- ${paths}`, { cwd: root, encoding: 'utf8' }).trim();
    return out ? out.split('\n').length : 0;
  } catch { return 0; }
}
