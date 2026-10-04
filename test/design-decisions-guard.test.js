// design-decisions-guard — the product's OWN decisions, at the write. What's locked here: it reads
// only Ours rows (never a seeded prompt), the Do/Don't pairs and the exceptions at a path; two
// content words of the situation in the added text is a match; once per file per decision; a line
// in the trace per fire; silence without decisions, on non-UI files, and on a placeholder pair.

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { project, cleanup } from './helpers.js';

after(cleanup);

const HOOK = join(process.cwd(), 'stages', 'L1-mvp', 'template', '.claude', 'hooks', 'design-decisions-guard.js');
function run(dir, toolInput) {
  const stdout = execFileSync('node', [HOOK], { input: JSON.stringify({ cwd: dir, tool_name: 'Write', tool_input: toolInput }), encoding: 'utf8', env: { ...process.env, CLAUDE_PROJECT_DIR: dir } });
  return stdout.trim() ? JSON.parse(stdout).hookSpecificOutput.additionalContext : '';
}
const PATTERNS = `# Patterns

## Always

| Pattern | The situation | The rule | Anti-pattern |
|---|---|---|---|
| **Destructive confirm** | delete, revoke, cancel | name the consequence | "Are you sure?" |

## Ours

| ID | Pattern | The situation | The rule | Anti-pattern | Family | Principle | First seen |
|---|---|---|---|---|---|---|---|
| **PAT-1** | Ask, don't assign | a shift needs cover — the owner asks one caregiver | the owner asks one person; the app never assigns | auto-assign with a notification | | 1 | 2026-09-02 |
| **PAT-2** | *(your first one lands here)* | | | | | | |
`;
const GUIDE = `# Style guide

## Do / Don't

| Do | Don't | Because |
|---|---|---|
| one primary action per view | two primary buttons competing for the same weight | a second primary means the view has two jobs |
| <your rule> | <the specific thing you keep seeing> | <the principle it serves> |

## Exceptions

| Date | Where | What | Why |
|---|---|---|---|
| 2026-09-08 | PrintSheet | a raw hex for the print rule | the print stylesheet has no tokens yet |
| | | | |
`;
const withDecisions = (extra = {}) => project({ 'docs/design/PATTERNS.md': PATTERNS, 'docs/design/STYLE_GUIDE.md': GUIDE, ...extra });

test('a write in a decided situation is handed the product\'s rule and anti-pattern — an Ours row, never the seeded prompt', () => {
  const dir = withDecisions();
  const ctx = run(dir, { file_path: join(dir, 'src/components/CoverDialog.tsx'), content: 'export function CoverDialog({ shift }) { /* the shift needs cover: ask one caregiver */ return null; }' });
  assert.match(ctx, /PAT-1 — Ask, don't assign\.\*\* the owner asks one person; the app never assigns Not: auto-assign with a notification\./);
  assert.ok(!ctx.includes('Destructive confirm'), 'the seeded Always row is a prompt, not a decision');
  assert.ok(!ctx.includes('lands here'));
  const trace = readFileSync(join(dir, '.boss', 'trace.jsonl'), 'utf8').trim().split('\n').map((l) => JSON.parse(l));
  assert.equal(trace.length, 1); assert.equal(trace[0].kind, 'design-decision'); assert.deepEqual(trace[0].ids, ['PAT-1']); assert.equal(trace[0].file, 'src/components/CoverDialog.tsx');
});

test('once per file per decision: the second write to the same file is silent; a different file hears it again', () => {
  const dir = withDecisions();
  const input = { file_path: join(dir, 'src/components/CoverDialog.tsx'), content: 'the shift needs cover — ask one caregiver' };
  assert.match(run(dir, input), /PAT-1/);
  assert.equal(run(dir, input), '', 'said once');
  assert.match(run(dir, { file_path: join(dir, 'src/components/WeekView.tsx'), content: 'a shift needs cover; the owner picks a caregiver' }), /PAT-1/);
  assert.ok(existsSync(join(dir, '.boss', 'decisions-guard.json')));
});

test('a Do/Don\'t pair fires on its words; the placeholder pair never does; an exception fires on its path', () => {
  const dir = withDecisions();
  const ctx = run(dir, { file_path: join(dir, 'src/components/Toolbar.tsx'), content: '<Button variant="primary">Save</Button><Button variant="primary">Publish</Button> // two primary buttons competing' });
  assert.match(ctx, /Do: one primary action per view\. Don't: two primary buttons competing for the same weight\. Because a second primary/);
  assert.ok(!ctx.includes('your rule'));
  const ex = run(dir, { file_path: join(dir, 'src/components/PrintSheet.tsx'), content: 'const ink = "#17211E";' });
  assert.match(ex, /An exception is recorded here\*\* \(2026-09-08 · PrintSheet\): a raw hex for the print rule — the print stylesheet has no tokens yet/);
});

test('silent without decisions, on a non-UI file, on a write that touches no decided situation, and it never reads a seeded family table', () => {
  const none = project({ 'docs/design/PATTERNS.md': PATTERNS.split('## Ours')[0], 'docs/design/STYLE_GUIDE.md': '# Style guide\n' });
  assert.equal(run(none, { file_path: join(none, 'src/components/CoverDialog.tsx'), content: 'the shift needs cover; delete, revoke, cancel' }), '', 'only prompts on disk → nothing to hand over');
  const dir = withDecisions();
  assert.equal(run(dir, { file_path: join(dir, 'src/lib/cover.ts'), content: 'the shift needs cover — ask one caregiver' }), '', 'not a UI file');
  assert.equal(run(dir, { file_path: join(dir, 'src/components/Footer.tsx'), content: '<footer>© Tidewell</footer>' }), '', 'no decided situation touched');
});

// IDEA-132: a usage page's Never lines are a nesting the product ruled out — handed over when a write
// opens both tags; the Inside/Holds lines and the template's placeholders are never read.
const USAGE_CARD = `---
component: Card
status: stable
---

# Card

## Composition
- Inside: a page section, a Dialog body
- Holds: text, a Button
- **Never holds:** Card — a box in a box reads as two things
- Never inside: <Name, Name — and why>
`;
const USAGE_LINK = `---
component: Link
---

# Link

## Composition
- Never holds: Button, IconButton — a button in a link is two targets
`;
test('a Never line fires when the write opens both tags; once per file; siblings never named stay silent; placeholders are not rules', () => {
  const dir = project({ 'docs/design/components/Card.md': USAGE_CARD, 'docs/design/components/Link.md': USAGE_LINK });
  const ctx = run(dir, { file_path: join(dir, 'src/screens/Week.tsx'), content: '<Card title="Week"><Card title="Monday" /></Card>' });
  assert.match(ctx, /Card never goes inside Card\*\* — a box in a box reads as two things \(docs\/design\/components\/Card\.md\)/);
  assert.equal(run(dir, { file_path: join(dir, 'src/screens/Week.tsx'), content: '<Card><Card /></Card>' }), '', 'said once per file');
  const link = run(dir, { file_path: join(dir, 'src/components/Nav.tsx'), content: '<Link href="/x"><Button>Go</Button></Link>' });
  assert.match(link, /Button never goes inside Link\*\* — a button in a link is two targets/);
  assert.ok(!link.includes('IconButton'), 'only the tags this write opened');
  assert.equal(run(dir, { file_path: join(dir, 'src/components/Row.tsx'), content: '<Card><ButtonGroup /></Card>' }), '', '<ButtonGroup is not <Button; Holds is not a rule');
  const trace = readFileSync(join(dir, '.boss', 'trace.jsonl'), 'utf8').trim().split('\n').map((l) => JSON.parse(l));
  assert.deepEqual(trace.map((t) => t.ids[0]), ['nest-Card>Card', 'nest-Link>Button']);
});

test('the template\'s own Composition section is all placeholders and says nothing', () => {
  const tpl = readFileSync(join(process.cwd(), 'stages', 'L1-mvp', 'template', '.claude', 'skills', 'design-review', 'templates', 'component-usage.md'), 'utf8');
  const page = tpl.slice(tpl.indexOf('```markdown') + 11, tpl.lastIndexOf('```')).replace('component: <Name>', 'component: Card');
  const dir = project({ 'docs/design/components/Card.md': page });
  assert.equal(run(dir, { file_path: join(dir, 'src/screens/Week.tsx'), content: '<Card><Card /><Link /><Name /></Card>' }), '');
});
