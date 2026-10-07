#!/usr/bin/env node
// Archive files into a folder WITHOUT breaking their links.
//
//   node scripts/archive.js <dest-dir> <file> [file …]
//
// WHY THIS EXISTS: PROG-005 kept the full text of four retired skills and two watchlists in
// `docs/research/retired-skills/2026-10-06/` by copying them by hand. Every relative link in them was
// written for where the file USED to live, so all 37 broke at once, and `npm run check` stayed red in
// the main checkout until they were re-resolved one by one (2026-10-07). The rule that fixed them is
// mechanical, so it lives here instead of in the next session's memory:
//
//   · a link to another file in THIS batch → that file's archived copy (the original is usually the
//     thing being retired, and will be gone soon);
//   · a link whose target exists → rewritten to reach the same target from the archive;
//   · a link that was already broken where the file lived → left as it was, and reported.
//
// Copies; never deletes. Removing the original is a separate act. A `SKILL.md` is archived as
// `<skill>.SKILL.md` (every skill's file has the same name). Refuses to overwrite an archived file.
// Zero-dep.

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { basename, dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const posix = (p) => p.split(sep).join('/');

// Inline links and images `](target#anchor "title")`, and reference definitions `[id]: target`.
const INLINE = /(\]\()([^)\s#]+)((?:#[^)\s]*)?(?:\s+"[^"]*")?\))/g;
const REFDEF = /^(\s*\[[^\]]+\]:\s*)([^\s#]+)((?:#\S*)?.*)$/gm;
const external = (t) => /^[a-z][a-z0-9+.-]*:/i.test(t) || t.startsWith('/') || t.startsWith('#');

export function archivedName(file) {
  const b = basename(file);
  return b === 'SKILL.md' ? `${basename(dirname(file))}.SKILL.md` : b;
}

/**
 * @returns {{ written: string[], rewritten: number, broken: Array<{file: string, link: string}> }}
 */
export function archive(dest, files) {
  const destAbs = resolve(dest);
  const batch = new Map(files.map((f) => [resolve(f), join(destAbs, archivedName(f))]));
  const names = [...batch.values()];
  const dup = names.find((n, i) => names.indexOf(n) !== i);
  if (dup) throw new Error(`two files would archive as ${basename(dup)} — archive them separately`);
  for (const out of names) if (existsSync(out)) throw new Error(`${posix(relative(process.cwd(), out))} already exists — not overwriting an archive`);

  const result = { written: [], rewritten: 0, broken: [] };
  mkdirSync(destAbs, { recursive: true });
  for (const [src, out] of batch) {
    const from = dirname(src);
    const fix = (whole, pre, target, post) => {
      if (external(target)) return whole;
      const abs = resolve(from, target);
      const to = batch.get(abs) || (existsSync(abs) ? abs : null);
      if (!to) { result.broken.push({ file: posix(relative(process.cwd(), src)), link: target }); return whole; }
      const next = posix(relative(dirname(out), to)) || basename(to);
      if (next !== target) result.rewritten++;
      return pre + next + post;
    };
    const text = readFileSync(src, 'utf8').replace(INLINE, fix).replace(REFDEF, fix);
    writeFileSync(out, text);
    result.written.push(posix(relative(process.cwd(), out)));
  }
  return result;
}

const isMain = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const [dest, ...files] = process.argv.slice(2);
  if (!dest || !files.length) {
    console.error('usage: node scripts/archive.js <dest-dir> <file> [file …]');
    process.exit(2);
  }
  const missing = files.filter((f) => !existsSync(f));
  if (missing.length) { console.error(`not found: ${missing.join(', ')}`); process.exit(2); }
  try {
    const r = archive(dest, files);
    console.log(`Archived ${r.written.length} file(s) into ${posix(relative(process.cwd(), resolve(dest))) || '.'}; ${r.rewritten} link(s) rewritten.`);
    for (const w of r.written) console.log(`  ${w}`);
    if (r.broken.length) {
      console.log(`${r.broken.length} link(s) were already broken where the file lived — left as they were:`);
      for (const b of r.broken) console.log(`  ${b.file} -> ${b.link}`);
    }
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
}
