// Test helpers — a throwaway project tree in a temp dir, built from plain objects.
//
// Zero-dep like everything else (PRINCIPLE #4): `node:test` + `node:assert`, no runner,
// no fixtures framework. A fixture is a { path: contents } map so a test reads as the
// project state it describes rather than a pile of mkdir calls.

import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';

const roots = [];

// Build a project dir from { 'docs/ideas/IDEA-001.md': '...' }. Returns the abs path.
export function project(files = {}) {
  const root = mkdtempSync(join(tmpdir(), 'boss-test-'));
  roots.push(root);
  for (const [rel, body] of Object.entries(files)) {
    const abs = join(root, rel);
    mkdirSync(dirname(abs), { recursive: true });
    writeFileSync(abs, body);
  }
  return root;
}

export function cleanup() {
  for (const r of roots.splice(0)) {
    try { rmSync(r, { recursive: true, force: true }); } catch { /* best effort */ }
  }
}

// An IDEA doc with frontmatter. `body` is appended after the heading so a test can put
// prose in it (which is exactly how the canvassed-count bug got in).
export function idea(id, { status = 'captured', created = '2026-01-01', title = 'An idea', body = '', ...rest } = {}) {
  const extra = Object.entries(rest).map(([k, v]) => `${k}: ${v}`).join('\n');
  return `---\nid: ${id}\ntype: idea\nowner: pm\nstatus: ${status}\ncreated: ${created}${extra ? '\n' + extra : ''}\n---\n\n# ${title}\n\n${body}\n`;
}

export function feat(id, { status = 'building', created = '2026-01-01', title = 'A feature', ...rest } = {}) {
  const extra = Object.entries(rest).map(([k, v]) => `${k}: ${v}`).join('\n');
  return `---\nid: ${id}\ntype: feature\nowner: pm\nstatus: ${status}\ncreated: ${created}${extra ? '\n' + extra : ''}\n---\n\n# ${title}\n`;
}

// A canvas. `risk: null` writes the italic placeholder the real template ships with —
// the distinction the board's `riskiestNamed()` turns on.
export function canvas(ideaId, risk) {
  const line = risk ? risk : '_(not yet — name the bet that could sink this)_';
  return `---\nid: ${ideaId}-canvas\ntype: canvas\nowner: pm\nstatus: draft\n---\n\n# Canvas\n\n- **Riskiest assumption:** ${line}\n`;
}

// Today/offset as YYYY-MM-DD, for date-sensitive projections (aging, review-due).
export function daysAgo(n) {
  return new Date(Date.now() - n * 86400000).toISOString().slice(0, 10);
}
