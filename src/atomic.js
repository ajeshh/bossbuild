// src/atomic.js — write a file so a reader never sees half of it, and so two writers take turns.
//
// Concurrent sessions are the norm on one machine (CLAUDE.md), and `~/.boss/registry.json` is the
// one file every one of them writes. A plain `writeFileSync` truncates first and fills second, so a
// reader landing in between parsed a torn file; the registry's forgiving reader then took that as
// "no projects" and the next save wrote the empty list back over every entry (IDEA-121). Measured
// before this: 30 concurrent registrations kept 26.
//
// Two small mechanisms, both Node built-ins:
// - `writeFileAtomic` writes a sibling temp file and renames it into place. Rename is atomic on one
//   filesystem, so the path always holds either the old whole file or the new whole file.
// - `withLock` serialises read-modify-write with a lock DIRECTORY (`mkdir` is atomic and fails if
//   it exists). A lock older than STALE_MS belongs to a process that died holding it and is taken.

import { writeFileSync, renameSync, mkdirSync, rmSync, statSync, unlinkSync } from 'node:fs';

const STALE_MS = 10_000;
const WAIT_MS = 5_000;
const sleep = (ms) => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);

// On Windows a rename over a file another process holds open (Claude Code reading settings.json)
// fails with EPERM/EBUSY for a moment; a few short retries ride that out.
const RETRY = new Set(['EPERM', 'EBUSY', 'EACCES']);

export function writeFileAtomic(file, data) {
  const tmp = `${file}.${process.pid}.${Math.random().toString(36).slice(2)}.tmp`;
  try {
    writeFileSync(tmp, data);
    for (let i = 0; ; i++) {
      try { renameSync(tmp, file); break; } catch (e) {
        if (!RETRY.has(e.code) || i >= 5) throw e;
        sleep(20 * (i + 1));
      }
    }
  } catch (e) {
    try { unlinkSync(tmp); } catch { /* never written */ }
    throw e;
  }
}

export function withLock(file, fn) {
  const lock = `${file}.lock`;
  const start = Date.now();
  for (;;) {
    try { mkdirSync(lock); break; } catch (e) {
      if (e.code !== 'EEXIST') throw e;
      let age = 0;
      try { age = Date.now() - statSync(lock).mtimeMs; } catch { continue; } // released meanwhile
      if (age > STALE_MS) { rmSync(lock, { recursive: true, force: true }); continue; }
      if (Date.now() - start > WAIT_MS) {
        throw new Error(`${file} is locked by another BOSS process (${lock}). If none is running, remove that directory.`);
      }
      sleep(10);
    }
  }
  try { return fn(); } finally { rmSync(lock, { recursive: true, force: true }); }
}
