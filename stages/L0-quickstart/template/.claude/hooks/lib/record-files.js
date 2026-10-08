// Where this project keeps its records, and which files are them (IDEA-163).
//
// Every reader used to list one folder and keep the flat `<ID>-*.md` names in it. A repo that keeps
// `docs/features/FEAT-001-login/README.md` — a folder per record, somewhere BOSS didn't put it — had
// a FEAT in build that the session-start hook and `boss board` both reported as nothing in flight.
// Adopt never moves a founder's files, so the readers learn where they are instead:
//
//   · a record is `<dir>/<ID>-*.md`, or a folder `<dir>/<ID>-*/` holding `README.md` or `index.md`;
//   · `<dir>` is BOSS's own folders, plus `layout.records` in `.boss/config.json` — the project's
//     layout map, where it keeps what BOSS reads (adopt writes it when it finds records elsewhere,
//     and says so in its preview first). Records are its first entry; the devlog and RESUME follow.
//
// Zero-dep, never throws: an unreadable folder is an empty one.

import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

export const DEFAULT_DIRS = ['docs/ideas', 'docs/programs', 'docs/decisions', 'docs/evidence', 'docs/practices'];
const NAME = /^([A-Z]+)-\d+/i;
const INDEXES = ['README.md', 'index.md'];

const entries = (d) => { try { return readdirSync(d, { withFileTypes: true }); } catch { return []; } };

/** BOSS's record folders, then the project's own from `.boss/config.json` (`layout.records`). */
export function recordDirs(projectDir) {
  let extra = [];
  try {
    const cfg = JSON.parse(readFileSync(join(projectDir, '.boss', 'config.json'), 'utf8'));
    const dirs = cfg.layout && cfg.layout.records;
    if (Array.isArray(dirs)) extra = dirs.filter((d) => typeof d === 'string' && d && !d.includes('..'));
  } catch { /* no config, or not JSON: BOSS's own folders only */ }
  return [...new Set([...DEFAULT_DIRS, ...extra.map((d) => d.replace(/\/+$/, ''))])];
}

/**
 * The record files of the given kinds, across every record folder, sorted by path.
 * @param {string} projectDir
 * @param {string[]} [kinds] — id prefixes (`['IDEA', 'FEAT']`); all when omitted
 * @param {string[]} [dirs] — defaults to recordDirs(projectDir)
 * @returns {{ rel: string, name: string, kind: string }[]} `name` is the file or folder name the id is read from
 */
export function recordFiles(projectDir, kinds = null, dirs = recordDirs(projectDir)) {
  const want = kinds && new Set(kinds.map((k) => k.toUpperCase()));
  const out = [];
  for (const dir of dirs) {
    for (const e of entries(join(projectDir, dir))) {
      const m = NAME.exec(e.name);
      if (!m) continue;
      const kind = m[1].toUpperCase();
      if (want && !want.has(kind)) continue;
      if (e.isDirectory()) {
        const f = INDEXES.find((n) => existsSync(join(projectDir, dir, e.name, n)));
        if (f) out.push({ rel: `${dir}/${e.name}/${f}`, name: e.name, kind });
      } else if (e.name.endsWith('.md')) {
        out.push({ rel: `${dir}/${e.name}`, name: e.name, kind });
      }
    }
  }
  return out.sort((a, b) => a.rel.localeCompare(b.rel));
}

/** The file holding one record, by id — `FEAT-001` → `docs/features/FEAT-001-login/README.md`. */
export function recordFile(projectDir, id) {
  const ID = String(id).toUpperCase();
  const hit = recordFiles(projectDir, [ID.split('-')[0]]).find((r) => {
    const n = r.name.toUpperCase();
    return n.startsWith(`${ID}-`) || n === `${ID}.MD` || n === ID;
  });
  return hit ? hit.rel : null;
}
