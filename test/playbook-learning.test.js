// IDEA-135 slice 2 — the Product chapter shows how the founder is learning, not how much they built.
//
// A count of features counts how the work was labelled: one FEAT can hold ten things, ten can be
// lumped into one. So the block leads with what survives relabelling — when someone outside was last
// heard from, how much code changed since, and what that hearing changed — and draws the build as one
// square per FEAT, met (an EVID's `about:` names it) or not. Each test is one claim the page makes.

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { project, cleanup } from './helpers.js';
import { collectPlaybook, renderPlaybookHtml, readTesting, readChanges, readBuildSince, readEvidence } from '../src/playbook.js';

after(cleanup);

const stamp = { '.boss/manifest.json': JSON.stringify({ name: 'tidewell', stage: 'L0-quickstart', version: '0.0.0' }) };
const canvas = (next, change = '_not yet_') => `---\nid: IDEA-001-canvas\ntype: canvas\nupdated: 2026-08-20\n---\n\n# Canvas\n\n## 1 · Human Foundation\n\n| Cell | Answer |\n|---|---|\n| **People** | Owners. |\n\n- **Riskiest assumption:** owners will pay for cover alone\n- ${next}\n- **What result would change the plan?** ${change}\n`;
const feat = (n, status, gist) => `---\nid: FEAT-${n}\ntype: feat\nstatus: ${status}\ngist: ${gist}\ncreated: 2026-08-01\n---\n\n# FEAT-${n}\n\n## Goal\nAn owner covers a visit.\n`;
const evid = (n, date, extra = '') => `---\nid: EVID-${n}\ntype: evidence\ndate: ${date}\nmethod: observation\ngrade: observed-behavior\n${extra}---\n\n# EVID-${n} — an owner covered a visit from the school gate\n`;
const product = (html) => html.slice(html.indexOf('id="product"'), html.indexOf('</section>', html.indexOf('id="product"')));
const render = (dir) => product(renderPlaybookHtml(collectPlaybook(dir, 'tidewell'), '2026-10-04 10:00'));

function git(dir, ...args) {
  return execFileSync('git', ['-c', 'user.name=t', '-c', 'user.email=t@x', '-c', 'core.hooksPath=', '-c', 'commit.gpgsign=false', ...args], { cwd: dir, stdio: 'pipe' });
}
function commitAt(dir, date, msg) {
  execFileSync('git', ['-c', 'user.name=t', '-c', 'user.email=t@x', '-c', 'commit.gpgsign=false', 'commit', '-qm', msg, '--no-verify'], { cwd: dir, stdio: 'pipe', env: { ...process.env, GIT_AUTHOR_DATE: `${date}T10:00:00`, GIT_COMMITTER_DATE: `${date}T10:00:00` } });
}

test('readTesting: reads "What we\'re testing next", accepts the old "Experiment this week" label, and a placeholder is blank', () => {
  assert.equal(readTesting(canvas("**What we're testing next:** the card form, in front of three owners")).next, 'the card form, in front of three owners');
  assert.equal(readTesting(canvas('**Experiment this week:** the card form')).next, 'the card form');
  const blank = readTesting(canvas("**What we're testing next:** _not yet_"));
  assert.equal(blank.next, '');
  assert.equal(blank.change, '');
  assert.equal(blank.risk, 'owners will pay for cover alone');
});

test('the testing block leads the chapter when set, and is a dashed hole naming /canvas when blank', () => {
  const set = render(project({ ...stamp, 'docs/ideas/IDEA-001-canvas.md': canvas("**What we're testing next:** the card form") }));
  assert.match(set, /What we&#39;re testing next|What we're testing next/);
  assert.match(set, /the card form/);
  assert.ok(set.indexOf('product-testing') < set.indexOf('product-how'), 'testing next comes before How it works');
  const hole = render(project({ ...stamp, 'docs/ideas/IDEA-001-canvas.md': canvas("**What we're testing next:** _not yet_") }));
  assert.match(hole, /id="product-testing"[^>]*class="[^"]*hole|class="[^"]*hole[^"]*"[^>]*id="product-testing"/);
  assert.match(hole, /\/canvas/);
});

test('readChanges: a DEC or FEAT that cites an EVID is learning that changed something; one that cites none is not', () => {
  const dir = project({
    'docs/decisions/DEC-001-phone.md': '---\nid: DEC-001\ncreated: 2026-07-02\n---\n\n# DEC-001 — Phone-first\n\nFour owners covered from a phone (EVID-001, EVID-002).\n',
    'docs/decisions/DEC-002-brand.md': '---\nid: DEC-002\ncreated: 2026-09-02\n---\n\n# DEC-002 — The brand anchor\n\nNo evidence named.\n',
    'docs/ideas/FEAT-003-pay.md': '---\nid: FEAT-003\ncreated: 2026-08-10\ngist: Take the first pound\n---\n\n# FEAT-003\n\nBecause of EVID-004.\n',
  });
  const changes = readChanges(dir);
  assert.deepEqual(changes.map((c) => c.id), ['DEC-001', 'FEAT-003'], 'oldest first, the uncited DEC left out');
  assert.deepEqual(changes[0].cites, ['EVID-001', 'EVID-002']);
  assert.equal(changes[0].title, 'Phone-first');
});

test('what it changed: the newest record citing a REAL EVID, and the evidence heard since that changed nothing', () => {
  const dir = project({
    ...stamp,
    'docs/evidence/EVID-001.md': evid('001', '2026-06-01'),
    'docs/evidence/EVID-002.md': evid('002', '2026-08-30'),
    'docs/evidence/EVID-003.md': evid('003', '2026-09-05'),
    'docs/decisions/DEC-001-phone.md': '---\nid: DEC-001\ncreated: 2026-07-02\n---\n\n# DEC-001 — Phone-first\n\n(EVID-001)\n',
    'docs/decisions/DEC-009-ghost.md': '---\nid: DEC-009\ncreated: 2026-09-20\n---\n\n# DEC-009 — Cites a record that is gone\n\n(EVID-077)\n',
  });
  const html = render(dir);
  assert.match(html, /What it changed:<\/strong> DEC-001 · Phone-first/);
  assert.doesNotMatch(html, /DEC-009/, 'a citation of an EVID that does not exist changes nothing');
  assert.match(html, /2 things heard since haven(&#39;|')t changed anything on record/);
  assert.match(html, /\/interview/, 'learning gone quiet offers the next conversation');
});

test('nobody yet: no evidence says so plainly, offers /interview, and draws every FEAT as not met', () => {
  const dir = project({ ...stamp, 'docs/ideas/FEAT-001-a.md': feat('001', 'building', 'Carer chat — owners message carers'), 'docs/ideas/FEAT-002-b.md': feat('002', 'shipped', 'Reviews — owners rate carers') });
  const html = render(dir);
  assert.match(html, /Nobody outside has been recorded seeing it yet/);
  assert.match(html, /\/interview/);
  assert.match(html, /0 met · 2 not in front of anyone yet · 1 half built/);
  assert.match(html, /class="chip"[^>]*>Carer chat\b/, 'an unmet FEAT is a chip carrying its short name');
});

test('met: an EVID whose about: names a FEAT puts that FEAT first, in full, with the grade and what they did', () => {
  const dir = project({
    ...stamp,
    'docs/ideas/FEAT-001-a.md': feat('001', 'shipped', 'The cover flow — one tap on the visit'),
    'docs/ideas/FEAT-002-b.md': feat('002', 'building', 'Referrals — invite another agency'),
    'docs/evidence/EVID-001.md': evid('001', '2026-08-30', 'about: FEAT-001, VisitRow\n'),
  });
  assert.deepEqual(readEvidence(dir)[0].meets, ['FEAT-001']);
  const html = render(dir);
  assert.match(html, /1 met · 1 not in front of anyone yet/);
  assert.ok(html.indexOf('The cover flow') < html.indexOf('Referrals'), 'what someone met comes first');
  assert.match(html, /observed-behavior<\/span> an owner covered a visit from the school gate/);
});

test('at scale: past a dozen unmet, the names fold behind a count and every FEAT still has a square', () => {
  const files = { ...stamp };
  for (let i = 1; i <= 30; i++) files[`docs/ideas/FEAT-${String(i).padStart(3, '0')}-x.md`] = feat(String(i).padStart(3, '0'), 'building', `Thing ${i} — added on a Tuesday`);
  const html = render(project(files));
  assert.match(html, /the 30 names/);
  assert.equal((html.match(/<span title="FEAT-\d+/g) || []).length, 30, 'one square per FEAT');
});

test('readBuildSince: counts source files git last touched after the newest EVID — not docs, not deleted files; no git, no count', () => {
  const noGit = project({ 'docs/evidence/EVID-001.md': evid('001', '2026-09-05'), 'src/a.js': 'x' });
  const blind = readBuildSince(noGit, readEvidence(noGit));
  assert.equal(blind.changed, null, 'outside a checkout the count is absent, never invented');
  assert.equal(blind.last, '2026-09-05');

  const dir = project({ 'docs/evidence/EVID-001.md': evid('001', '2026-09-05'), 'src/a.js': 'a', 'src/b.js': 'b', 'src/gone.js': 'g', 'docs/notes.md': 'n' });
  git(dir, 'init', '-q'); git(dir, 'add', '-A'); commitAt(dir, '2026-08-20', 'base');
  execFileSync('node', ['-e', "const f=require('fs');f.appendFileSync('src/a.js','2');f.appendFileSync('docs/notes.md','2');f.writeFileSync('src/c.js','c');f.unlinkSync('src/gone.js')"], { cwd: dir });
  git(dir, 'add', '-A'); commitAt(dir, '2026-09-12', 'after');
  const since = readBuildSince(dir, readEvidence(dir));
  assert.equal(since.changed, 2, 'src/a.js and src/c.js — docs/notes.md is not source, src/gone.js no longer exists');
  assert.equal(since.total, 3);
  assert.equal(typeof since.days, 'number');
});
