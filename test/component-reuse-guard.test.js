// component-reuse-guard — the boundary under "reuse first, extend second, create last."
//
// The load-bearing behavior, as with every guard BOSS ships, is the SILENCE. This one fires once
// per NEW component name, never on an edit to a known one, and never at all without an index —
// because a hook that speaks on every write is a hook that gets turned off, and a guard that is off
// is worth less than no guard since the founder believes it is on.

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { project, cleanup } from './helpers.js';

after(cleanup);

const HOOK = join(process.cwd(), 'stages', 'L1-mvp', 'template', '.claude', 'hooks', 'component-reuse-guard.js');

function run(dir, toolInput, toolName = 'Write') {
  const stdout = execFileSync('node', [HOOK], {
    input: JSON.stringify({ cwd: dir, tool_name: toolName, tool_input: toolInput }),
    encoding: 'utf8',
  });
  if (!stdout.trim()) return '';
  return JSON.parse(stdout).hookSpecificOutput.additionalContext;
}

function withIndex() {
  const dir = project({});
  mkdirSync(join(dir, 'docs', 'design'), { recursive: true });
  writeFileSync(join(dir, 'docs', 'design', 'COMPONENTS.md'), [
    '# Component index',
    '',
    '| Component | What it\'s for | Import | Variants | Missing states |',
    '|---|---|---|---|---|',
    '| `Button` | primary and secondary actions | `import { Button }` | primary · ghost | — |',
    '| `EmptyState` | what a list shows before there is data | `import { EmptyState }` | — | loading |',
    '',
  ].join('\n'));
  return dir;
}

const NEW = { file_path: 'src/components/CTAButton.tsx', content: 'export function CTAButton(){}' };

test('stays SILENT when the project has no component index (the JIT gate)', () => {
  assert.equal(run(project({}), NEW), '', 'no index means no opinion — never nag an un-opted-in founder');
});

test('asks the three-way question when an unindexed component is written', () => {
  const out = run(withIndex(), NEW);
  assert.match(out, /reuse, adjust, or new/i, 'the question is the point, not the warning');
  assert.match(out, /CTAButton/);
});

test('names the near-name it should have been compared against', () => {
  const out = run(withIndex(), NEW);
  assert.match(out, /`Button`/, 'CTAButton shares a word with Button — the canonical forked-variant tell');
  assert.match(out, /JOB, not the look/, 'the decision rule travels with the question');
});

// The silence that keeps it usable: editing a component you already have must never speak.
// A synonym hides the canonical component: the job is in the purpose column, not the name. Before
// RVW-110 the guard scored names only and, finding no shared word, listed the first five rows in
// file order — every row except the one it needed.
test('finds a component by what it is FOR when the name is a synonym', () => {
  const dir = project({});
  mkdirSync(join(dir, 'docs', 'design'), { recursive: true });
  writeFileSync(join(dir, 'docs', 'design', 'COMPONENTS.md'), [
    '| Component | What it\'s for | Import | Variants | Missing states |',
    '|---|---|---|---|---|',
    ...['Button', 'Card', 'Modal', 'Input', 'Avatar', 'Tooltip'].map((c) => `| \`${c}\` | something else | \`import { ${c} }\` | — | — |`),
    '| `Tag` | status badge or pill: priority, state, counts | `import { Tag }` | status | — |',
    '',
  ].join('\n'));
  for (const name of ['Badge', 'StatusBadge']) {
    const out = run(dir, { file_path: `src/components/${name}.tsx`, content: `export function ${name}(){}` });
    assert.match(out, /`Tag`/, `${name}: the row whose job says "badge" must be shown`);
  }
});

test('stays SILENT for a component already in the index', () => {
  const dir = withIndex();
  assert.equal(run(dir, { file_path: 'src/components/Button.tsx', content: 'x' }), '', 'known component');
  assert.equal(
    run(dir, { file_path: 'src/components/Button.tsx', new_string: 'x' }, 'Edit'), '',
    'an edit to a known component is not a reuse decision',
  );
});

test('ignores what is not a component', () => {
  const dir = withIndex();
  for (const [label, file_path] of [
    ['a barrel', 'src/components/index.tsx'],
    ['a page', 'src/components/page.tsx'],
    ['a test', 'src/components/Card.test.tsx'],
    ['vendored code', 'node_modules/pkg/Thing.tsx'],
    ['a stylesheet', 'src/components/Card.css'],
    ['a lowercase module outside a components dir', 'src/lib/helpers.ts'],
  ]) {
    assert.equal(run(dir, { file_path, content: 'x' }), '', `must ignore ${label}`);
  }
});

// Word-boundary matching: `Button` in the index must not mask a genuinely new `ButtonGroup`.
test('a longer name containing an indexed one still asks', () => {
  const out = run(withIndex(), { file_path: 'src/components/ButtonGroup.tsx', content: 'x' });
  assert.match(out, /ButtonGroup/, 'Button in the index must not mask ButtonGroup');
});

test('says nothing useful-less when the index is still a skeleton', () => {
  const dir = project({});
  mkdirSync(join(dir, 'docs', 'design'), { recursive: true });
  writeFileSync(join(dir, 'docs', 'design', 'COMPONENTS.md'), '# Component index\n\nnothing yet\n');
  assert.equal(run(dir, NEW), '', 'an index with no rows has nothing to compare against');
});

test('fails open — a broken guard must never break a session', () => {
  const stdout = execFileSync('node', [HOOK], { input: 'not json at all', encoding: 'utf8' });
  assert.equal(stdout.trim(), '', 'unparseable input exits 0 and silent');
});

// --- v0.309.0: the Status column and the API-shape floor -------------------------------------

function withStatusIndex() {
  const dir = project({});
  mkdirSync(join(dir, 'docs', 'design'), { recursive: true });
  writeFileSync(join(dir, 'docs', 'design', 'COMPONENTS.md'), [
    '# Component index',
    '',
    '| Component | What it\'s for | Import | Variants | Missing states | Status |',
    '|---|---|---|---|---|---|',
    '| `Button` | primary and secondary actions | `import { Button }` | primary · ghost | — | stable |',
    '| `Card` | a bounded surface | `import { Card }` | — | — | deprecated → `Surface` |',
    '| `Surface` | a bounded surface for one thing | `import { Surface }` | raised · flat | — | stable |',
    '',
  ].join('\n'));
  return dir;
}

test('names the replacement when a write references a deprecated component — even from a page', () => {
  const out = run(withStatusIndex(), {
    file_path: 'src/app/dashboard/page.tsx',
    content: "import { Card } from '@/ui/Card';\nexport default () => <Card />;",
  });
  assert.match(out, /`Card` is marked \*\*deprecated → `Surface`\*\*/, 'reads the Status column');
  assert.match(out, /Use `Surface`/);
  assert.doesNotMatch(out, /reuse, adjust, or new/, 'a page is not a component; only the deprecation speaks');
});

test('lets the deprecated component\'s own file exist, and stays quiet on the replacement', () => {
  const own = run(withStatusIndex(), { file_path: 'src/ui/Card/Card.tsx', content: 'export function Card(){}' });
  assert.equal(own, '', 'the deprecated row stays until its last import is gone — its file may be edited');
  const next = run(withStatusIndex(), { file_path: 'src/app/page.tsx', content: "import { Surface } from '@/ui/Surface';" });
  assert.equal(next, '');
});

test('asks for an enumerated variant when a component\'s prefixed booleans reach three', () => {
  const dir = withStatusIndex();
  const out = run(dir, {
    file_path: 'src/ui/Button/Button.tsx',
    content: 'type Props = { isPrimary?: boolean; isLarge?: boolean; isDanger: boolean; disabled?: boolean };',
  });
  assert.match(out, /3 prefixed boolean props/);
  assert.match(out, /`isPrimary`, `isLarge`, `isDanger`/);
  assert.match(out, /enumerated variants, not boolean piles/);
  assert.match(out, /\(`isPrimary`, `isLarge`, `isDanger`\) —/, 'the pile is exactly the prefixed three — `disabled` is not counted');
  assert.doesNotMatch(out, /reuse, adjust, or new/, 'Button is indexed — no three-way question');
});

test('stays quiet at two booleans, and on an edit that adds none', () => {
  const dir = withStatusIndex();
  const two = run(dir, { file_path: 'src/ui/Button/Button.tsx', content: 'type P = { isPrimary?: boolean; isLarge?: boolean }' });
  assert.equal(two, '');
  mkdirSync(join(dir, 'src', 'ui', 'Button'), { recursive: true });
  writeFileSync(join(dir, 'src', 'ui', 'Button', 'Button.tsx'), 'type P = { isA: boolean; isB: boolean; isC: boolean }');
  const untouched = run(dir, { file_path: 'src/ui/Button/Button.tsx', old_string: 'x', new_string: 'const y = 1;' }, 'Edit');
  assert.equal(untouched, '', 'an existing pile is reported when a write ADDS to it, not on every edit');
});

test('a new component with a pile gets both the pile and the three-way question, in that order', () => {
  const out = run(withStatusIndex(), {
    file_path: 'src/ui/CTAButton.tsx',
    content: 'type P = { isPrimary: boolean; isLarge: boolean; isDanger: boolean }',
  });
  assert.ok(out.indexOf('boolean piles') < out.indexOf('reuse, adjust, or new'));
});

// B1.1 (IDEA-137): at V1 `/design-library` replaces COMPONENTS.md with a one-line pointer and moves the
// rows into the manifest. The guard read only COMPONENTS.md, found no rows, and fell silent — the reuse
// and deprecated-import checks stopped exactly when a project scaled. Reproduced 2026-10-04: the same
// write that drew two warnings at MVP drew nothing at V1.
function atV1() {
  const dir = project({});
  mkdirSync(join(dir, 'docs', 'design', 'library'), { recursive: true });
  writeFileSync(join(dir, 'docs', 'design', 'COMPONENTS.md'),
    '# Components\n\nThe index moved to the design library: `docs/design/library/` (manifest.json).\n');
  writeFileSync(join(dir, 'docs', 'design', 'library', 'manifest.json'), JSON.stringify({
    generated: '2026-10-04',
    components: [
      { name: 'Button', purpose: 'primary and secondary actions', usedIn: 4, status: 'stable' },
      { name: 'OldCard', purpose: 'content card', usedIn: 2, status: 'deprecated → Card' },
      { name: 'Card', purpose: 'content card', usedIn: 3, status: 'stable' },
    ],
  }));
  return dir;
}

test('B1.1 — at V1 it reads the manifest: the three-way question still fires, and names the manifest', () => {
  const out = run(atV1(), NEW);
  assert.match(out, /reuse, adjust, or new/);
  assert.match(out, /`Button`/);
  assert.match(out, /docs\/design\/library\/manifest\.json/);
  assert.match(out, /re-run `\/design-library`/);
});

test('B1.1 — at V1 a deprecated import from the manifest is still named', () => {
  const out = run(atV1(), { file_path: 'src/app/page.tsx', content: 'import { OldCard } from "@/components/OldCard"' });
  assert.match(out, /`OldCard` is marked \*\*deprecated → `Card`\*\*/);
});

test('B1.1 — at V1 a component already in the manifest stays SILENT', () => {
  assert.equal(run(atV1(), { file_path: 'src/components/Button.tsx', content: 'export function Button(){}' }), '');
});

test('REGRESSION (IDEA-136 · F2): a page-shaped file is not a component — no reuse question', () => {
  // `boss design` has always excluded *Page / *Route / *Layout; this guard didn't, so it asked
  // "reuse, adjust, or new?" about files the design page would never list.
  for (const n of ['DashboardPage', 'SettingsLayout', 'UserRoute']) {
    const out = run(withIndex(), { file_path: `src/components/${n}.tsx`, content: `export function ${n}(){}` });
    assert.doesNotMatch(out, /reuse, adjust, or new/i, `${n} is page-shaped`);
  }
});

// --- A5 (IDEA-136): reuse for code — a new exported helper checked against the seed's helper table. ---
// Agents copy-paste on the third or fourth repeat unless nudged (one practitioner's agent-built app,
// 2026). The founder's `.claude/rules/engineering.md` holds the table; the guard reads it and nothing
// else. Silent with no table, with an empty table, for names the table already knows, and once asked.

const TABLE = [
  '# Engineering', '', '## Find this before you write one', '',
  '| You need | Use | Not |', '|---|---|---|',
  '| a day a person reads | `formatDay()` in `lib/time` | `toISOString().slice(0, 10)` |',
  '| a price shown to a customer | `formatPrice()` in `lib/money` | `toFixed(2)` |', '',
].join('\n');
const withTable = (table = TABLE) => project({ '.claude/rules/engineering.md': table, '.boss/.keep': '' });

test('A5: SILENT with no engineering file, and with an empty helper table', () => {
  const w = { file_path: 'src/lib/currency.ts', content: 'export function formatAmount(n) { return n }' };
  assert.equal(run(project({}), w), '');
  assert.equal(run(withTable('# Engineering\n\n## Find this before you write one\n\n| You need | Use | Not |\n|---|---|---|\n| | | |\n'), w), '');
});

test('A5: asks reuse / widen / inline / copy for a new exported helper, naming the near row', () => {
  const out = run(withTable(), { file_path: 'src/lib/currency.ts', content: 'export function formatAmount(n) { return n.toFixed(2) }' });
  assert.match(out, /formatAmount/);
  assert.match(out, /formatPrice/, 'shares a word with formatAmount, and the job says price');
  assert.match(out, /inline/i, 'carries the code-specific answer: inline back on the parameter-plus-conditional tell');
  assert.match(out, /engineering\.md/);
});

test('A5: SILENT for a name the table already knows, for unexported code, and for tests', () => {
  const dir = withTable();
  assert.equal(run(dir, { file_path: 'src/lib/money.ts', content: 'export function formatPrice(n) { return n }' }), '');
  assert.equal(run(dir, { file_path: 'src/lib/money.ts', content: 'function localHelper(n) { return n }' }), '');
  assert.equal(run(dir, { file_path: 'src/lib/money.test.ts', content: 'export function formatAmount() {}' }), '');
});

test('A5: asks once per name — the second write of the same new helper is silent', () => {
  const dir = withTable();
  const w = { file_path: 'src/lib/currency.ts', content: 'export const formatAmount = (n) => n' };
  assert.match(run(dir, w), /formatAmount/);
  assert.equal(run(dir, w), '');
});

test('A5: reads Python and Go exports too', () => {
  assert.match(run(withTable(), { file_path: 'app/utils/days.py', content: 'def format_day_label(d):\n    return d\n' }), /format_day_label/);
  assert.match(run(withTable(), { file_path: 'internal/money/fmt.go', content: 'func FormatAmount(n int) string { return "" }' }), /FormatAmount/);
});
