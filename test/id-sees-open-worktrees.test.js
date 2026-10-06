// `boss id` counts the ids other open worktrees of the same repo already hold.
//
// Reproduced 2026-10-05: with IDEA-148 and IDEA-149 sitting in two peers' open worktrees (not yet
// landed), `boss id IDEA` in the main checkout answered IDEA-148, a number already taken. Each work
// gets its own worktree now (IDEA-120), so the main checkout is exactly where a peer's newest record
// is invisible. A duplicate id made at allocation is the one `boss records` can only catch later.

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { project, cleanup } from './helpers.js';
import { nextId } from '../src/records.js';

after(cleanup);
const git = (cwd, ...a) => execFileSync('git', a, { cwd, stdio: 'pipe', env: { ...process.env, GIT_AUTHOR_NAME: 't', GIT_AUTHOR_EMAIL: 't@t', GIT_COMMITTER_NAME: 't', GIT_COMMITTER_EMAIL: 't@t' } });

test('nextId skips a number a peer worktree already holds', () => {
  const dir = project({ 'docs/ideas/IDEA-001-first.md': '---\nid: IDEA-001\n---\n' });
  git(dir, 'init', '-q', '-b', 'main');
  git(dir, 'add', '-A');
  git(dir, 'commit', '-qm', 'one');
  const peer = join(dir, '.claude', 'worktrees', 'peer');
  git(dir, 'worktree', 'add', '-q', '-b', 'work/peer', peer);
  mkdirSync(join(peer, 'docs', 'ideas'), { recursive: true });
  writeFileSync(join(peer, 'docs', 'ideas', 'IDEA-002-peer.md'), '---\nid: IDEA-002\n---\n');
  assert.equal(nextId(dir, 'IDEA'), 'IDEA-003');
});

test('nextId still works outside git', () => {
  const dir = project({ 'docs/ideas/IDEA-004-x.md': '---\nid: IDEA-004\n---\n' });
  assert.equal(nextId(dir, 'IDEA'), 'IDEA-005');
});
