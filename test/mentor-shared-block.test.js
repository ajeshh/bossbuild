// Three sections are copied into every mentor (IDEA-121 tier 3): how to read the state before
// advising, when to hand a question to /consult, and what to write down after. Six copies with no
// detector drift one edit at a time, which is how "agents claim the wrong mode" happened before.
// So the copies must stay identical, apart from three differences that are deliberate and named:
//   - each mentor writes its own dossier file (`docs/dossier/<lens>-<date>.md`);
//   - mentor-founder ships in Quickstart, before /consult exists, so it says when /consult arrives;
//   - a mentor may add paragraphs after the shared first one in "After a consequential session"
//     (mentor-capital's is what `boss playbook` quotes as The ask).

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { BOSS_ROOT } from '../src/paths.js';

const mentors = readdirSync(join(BOSS_ROOT, 'stages')).flatMap((st) => {
  const d = join(BOSS_ROOT, 'stages', st, 'template', '.claude', 'agents');
  return existsSync(d) ? readdirSync(d).filter((n) => /^mentor-.*\.md$/.test(n)).map((n) => ({ n, text: readFileSync(join(d, n), 'utf8').replace(/\r\n?/g, '\n') })) : [];
});

const section = (text, heading) => {
  const i = text.indexOf(`\n${heading}\n`);
  if (i < 0) return null;
  const j = text.indexOf('\n## ', i + heading.length + 2);
  return text.slice(i + 1, j < 0 ? undefined : j).trimEnd();
};

const SHARED = [
  ['## Before you advise — read the state first', (s) => s],
  ["## When the question isn't only yours", (s) => s.replace(' — which arrives when they unlock MVP —', '')],
  ['## After a consequential session', (s) => s.split('\n\n').slice(0, 2).join('\n\n').replace(/docs\/dossier\/[a-z-]+-<date>\.md/, 'docs/dossier/<lens>-<date>.md')],
];

test('every mentor carries the shared sections, identical apart from the named differences', () => {
  assert.ok(mentors.length >= 6, `found ${mentors.length} mentors`);
  for (const [heading, normalize] of SHARED) {
    const variants = new Map();
    for (const m of mentors) {
      const s = section(m.text, heading);
      assert.ok(s, `${m.n} is missing "${heading}"`);
      const key = normalize(s);
      variants.set(key, [...(variants.get(key) || []), m.n]);
    }
    assert.equal(variants.size, 1,
      `"${heading}" has drifted:\n${[...variants.values()].map((v) => '  ' + v.join(', ')).join('\n')}`);
  }
});

test('each mentor writes to its own dossier file', () => {
  const slugs = mentors.map((m) => (section(m.text, '## After a consequential session').match(/docs\/dossier\/([a-z-]+)-<date>\.md/) || [])[1]);
  assert.ok(slugs.every(Boolean), 'every mentor names its dossier');
  assert.equal(new Set(slugs).size, slugs.length, `two mentors share a dossier: ${slugs.join(', ')}`);
});
