// /log's script (IDEA-100 pilot): the recipe half of the skill, as code. The claim it has to
// hold is the one the prose kept getting backwards — newest at the TOP, under the header, and a
// missing file seeded with the shape the loops read.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { appendEntry, insertTop, renderEntry, seed } from '../stages/L1-mvp/template/.claude/skills/log/scripts/entry.js';

const SCRIPT = join(process.cwd(), 'stages/L1-mvp/template/.claude/skills/log/scripts/entry.js');

test('seeds a missing devlog and puts the first entry under the header', () => {
  const dir = mkdtempSync(join(tmpdir(), 'boss-log-'));
  const file = join(dir, 'docs', 'devlog.md');
  appendEntry({ file, projectName: 'acme', date: '2026-09-01', feat: 'FEAT-001', landed: 'first', next: 'second', surprises: '' });
  const t = readFileSync(file, 'utf8');
  assert.ok(t.startsWith(seed('acme').trimEnd()), 'seeded with the frontmatter + header');
  assert.match(t, /Newest at the top[^\n]*\n\n## 2026-09-01\n- \*\*FEAT:\*\* FEAT-001\n- \*\*Landed:\*\* first\n- \*\*Next:\*\* second\n$/);
  assert.ok(!/Surprises/.test(t), 'an empty surprises line is not written');
  rmSync(dir, { recursive: true, force: true });
});

test('the second entry lands ABOVE the first — newest first, the invariant the prose got backwards', () => {
  const dir = mkdtempSync(join(tmpdir(), 'boss-log-'));
  const file = join(dir, 'docs', 'devlog.md');
  appendEntry({ file, projectName: 'acme', date: '2026-09-01', feat: '', landed: 'first', next: '', surprises: '' });
  appendEntry({ file, projectName: 'acme', date: '2026-09-02', feat: 'none', landed: 'later', next: '', surprises: 'one' });
  const t = readFileSync(file, 'utf8');
  assert.ok(t.indexOf('## 2026-09-02') < t.indexOf('## 2026-09-01'));
  assert.equal((t.match(/^# Devlog/gm) || []).length, 1, 'the header is not duplicated');
  assert.match(t, /## 2026-09-02\n- \*\*FEAT:\*\* _no FEAT — exploration\/ops_\n- \*\*Landed:\*\* later\n- \*\*Surprises \/ decisions:\*\* one\n\n## 2026-09-01/);
  rmSync(dir, { recursive: true, force: true });
});

test('a devlog with prose after the header but no entries yet gets the entry at the end', () => {
  const text = '---\nid: DEVLOG\n---\n\n# Devlog — x\n\nSome intro.\n\n> a callout\n';
  const out = insertTop(text, renderEntry({ date: '2026-09-01', feat: '', landed: 'l', next: '', surprises: '' }));
  assert.ok(out.endsWith('> a callout\n\n## 2026-09-01\n- **FEAT:** _no FEAT — exploration/ops_\n- **Landed:** l\n'));
});

test('the CLI form: --landed is required; exit 2 and nothing written without it', () => {
  const dir = mkdtempSync(join(tmpdir(), 'boss-log-'));
  let code = 0;
  try { execFileSync('node', [SCRIPT, '--feat', 'FEAT-001'], { cwd: dir, stdio: 'pipe' }); } catch (e) { code = e.status; }
  assert.equal(code, 2);
  assert.ok(!existsSync(join(dir, 'docs', 'devlog.md')));
  const out = execFileSync('node', [SCRIPT, '--landed', 'x', '--date', '2026-09-03'], { cwd: dir, encoding: 'utf8' });
  assert.match(out, /devlog\.md\n## 2026-09-03\n/);
  rmSync(dir, { recursive: true, force: true });
});
