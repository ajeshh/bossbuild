// `revisit_by:` is read by two surfaces — `boss status` (records.js) and the playbook's decision
// cards — and they used to disagree (IDEA-121): the playbook compared `Date.parse(date) < now`, so
// the due day itself never counted, UTC midnight decided the evening before, and a superseded or
// dropped decision still wore an "overdue" chip. One rule now, in src/frontmatter.js.

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { revisitDue } from '../src/frontmatter.js';
import { readDecisions } from '../src/playbook.js';
import { project, cleanup } from './helpers.js';

after(cleanup);

test('due on the day itself, not only after it', () => {
  assert.equal(revisitDue({ revisitBy: '2026-09-20' }, '2026-09-20'), true);
  assert.equal(revisitDue({ revisitBy: '2026-09-20' }, '2026-09-19'), false);
});

test('an outcome, or an ended record, silences it', () => {
  assert.equal(revisitDue({ revisitBy: '2026-09-01', outcome: 'held' }, '2026-09-20'), false);
  assert.equal(revisitDue({ revisitBy: '2026-09-01', status: 'superseded by DEC-004' }, '2026-09-20'), false);
  assert.equal(revisitDue({ revisitBy: '2026-09-01', status: 'dropped' }, '2026-09-20'), false);
  assert.equal(revisitDue({ revisitBy: 'soon' }, '2026-09-20'), false, 'no date, no claim');
});

test('the playbook card uses the same rule, on the local calendar day', () => {
  const dec = (id, extra) => `---\nid: ${id}\ntype: decision\nstatus: ${extra.status || 'decided'}\ncreated: 2026-08-01\nrevisit_by: ${extra.by}\n---\n\n# ${id} — x\n\n## Decision\n\nx\n`;
  const dir = project({
    'docs/decisions/DEC-001-a.md': dec('DEC-001', { by: '2026-09-20' }),
    'docs/decisions/DEC-002-b.md': dec('DEC-002', { by: '2026-09-01', status: 'superseded' }),
  });
  // Local noon on the due day — no timezone can push this across midnight.
  const noon = new Date(2026, 8, 20, 12).getTime();
  const decs = readDecisions(dir, noon);
  assert.equal(decs.find((d) => d.id === 'DEC-001').overdue, true, 'the due day counts');
  assert.equal(decs.find((d) => d.id === 'DEC-002').overdue, false, 'a superseded decision is not overdue');
});
