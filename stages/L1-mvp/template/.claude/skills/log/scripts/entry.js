#!/usr/bin/env node
// /log's recipe half — the part a careful engineer would have scripted by the third run.
//
// Seeds docs/devlog.md if it is missing and inserts one dated entry at the TOP (newest first),
// under the header and above the first existing entry. The judgment — what landed, what to say
// under Surprises, whether a FEAT closed — stays in SKILL.md; this only does the append the
// model used to re-derive every time (and occasionally got backwards: an entry at the bottom of
// a newest-first file is the one nobody reads).
//
// Zero-dep, Node built-ins only. Ships with the skill; the host runs it through Bash.
//
//   node .claude/skills/log/scripts/entry.js --landed "…" [--feat FEAT-NNN] [--next "…"]
//        [--surprises "…"] [--date YYYY-MM-DD] [--project NAME] [--file docs/devlog.md]
//
// Prints the entry it wrote. Exit 2 on a missing --landed (blanks are honest, but an entry with
// nothing landed is not an entry).

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, basename } from 'node:path';

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith('--')) continue;
    const key = a.slice(2);
    const next = argv[i + 1];
    if (next === undefined || next.startsWith('--')) { out[key] = true; continue; }
    out[key] = next; i++;
  }
  return out;
}

export function seed(projectName) {
  return `---
id: DEVLOG
type: devlog
owner: product-lead
status: active
---

# Devlog — ${projectName}

Append-only. Newest at the top. Each entry: date, FEAT (if any), what landed, what's next.
`;
}

export function renderEntry({ date, feat, landed, next, surprises }) {
  const lines = [`## ${date}`];
  lines.push(`- **FEAT:** ${feat && feat !== 'none' ? feat : '_no FEAT — exploration/ops_'}`);
  lines.push(`- **Landed:** ${landed}`);
  if (next) lines.push(`- **Next:** ${next}`);
  if (surprises) lines.push(`- **Surprises / decisions:** ${surprises}`);
  return lines.join('\n') + '\n';
}

// Insert above the first `## ` heading; a file with no entries yet gets it at the end.
export function insertTop(text, entry) {
  const m = text.match(/^## /m);
  if (!m) return text.replace(/\s*$/, '\n\n') + entry;
  const at = m.index;
  return text.slice(0, at) + entry + '\n' + text.slice(at);
}

export function appendEntry({ file, projectName, ...fields }) {
  if (!existsSync(file)) {
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, seed(projectName));
  }
  const entry = renderEntry(fields);
  writeFileSync(file, insertTop(readFileSync(file, 'utf8'), entry));
  return entry;
}

if (import.meta.url === `file://${process.argv[1]}` || basename(process.argv[1] || '') === 'entry.js') {
  const a = parseArgs(process.argv.slice(2));
  if (!a.landed || a.landed === true) {
    console.error('entry.js: --landed is required (what is now real that was not before)');
    process.exit(2);
  }
  const file = join(process.cwd(), typeof a.file === 'string' ? a.file : 'docs/devlog.md');
  const entry = appendEntry({
    file,
    projectName: typeof a.project === 'string' ? a.project : basename(process.cwd()),
    date: typeof a.date === 'string' ? a.date : new Date().toISOString().slice(0, 10),
    feat: typeof a.feat === 'string' ? a.feat : '',
    landed: a.landed,
    next: typeof a.next === 'string' ? a.next : '',
    surprises: typeof a.surprises === 'string' ? a.surprises : '',
  });
  process.stdout.write(`${file}\n${entry}`);
}
