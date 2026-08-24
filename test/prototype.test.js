// `/prototype` — the shipped text, locked against the three defects RVW-084/085/086 removed.
//
// THE INCIDENT (2026-08-24): three claims in one skill were shipped for ~170 releases without ever
// matching the record that authorized them.
//   1. RVW-016 approved ONE line — "a sketch to think with" — and FIVE shipped, swapping in
//      "a throwaway": Fred Brooks 1975, which Brooks publicly RETRACTED in 1995.
//   2. That blockquote credited "(Marty Cagan, 2026)" for a phrase Cagan explicitly credits to
//      Jeff Patton *in the very article cited as RVW-016's source*.
//   3. The "restart it ... rebuild to keep" mandate predates RVW-016 by twelve versions and
//      NO verdict ever authorized it.
//
// WHAT THESE TESTS ENFORCE (read this before changing them): the skill may not re-acquire the
// retracted throwaway/restart doctrine, may not drop Patton's credit, must constrain mock-data
// PLAUSIBILITY (not just licence fabrication), and must tell the founder to commit BEFORE the run
// step — because Claude Code checkpointing does not cover Bash edits, so git is the only real undo.
//
// No checker in BOSS can see "shipped text drifted from its authorizing verdict" — that contract
// lives in prose across two directories. These tests are the closest thing to a gate for this file.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { STAGES_DIR } from '../src/paths.js';

const SKILL = join(
  STAGES_DIR, 'L0-quickstart', 'template', '.claude', 'skills', 'prototype', 'SKILL.md');
const src = () => readFileSync(SKILL, 'utf8');

test('/prototype never re-acquires the retracted throw-it-away doctrine', () => {
  const text = src();
  // Brooks retracted "plan to throw one away" in 1995 ("Don't Build One to Throw Away — The
  // Waterfall Model Is Wrong!"). Cagan, the cited authority, says the opposite: the discovery
  // prototype gets productized. No RCT compares rewrite against incremental hardening in either
  // direction, so BOSS may not mandate EITHER. Keep-or-rebuild stays the founder's call.
  const banned = [
    /\*restart it\*/i,
    /rebuild to \*?keep\*?/i,
    /\b(thrown?|discard\w*|scrapp?\w*)\b[^.]{0,60}when it earns a real build/i,
    /a throwaway to discover/i,
    /don't grow the sketch into production/i,
  ];
  for (const re of banned) {
    assert.ok(!re.test(text),
      `/prototype re-acquired the retracted restart mandate (matched ${re}). `
      + 'See RVW-086 — no verdict ever authorized it, and Brooks withdrew the doctrine in 1995.');
  }
  // The diagnosis it replaced must survive — removing the remedy must not remove the warning.
  assert.match(text, /Don't quietly become the MVP/,
    'the sketch-becomes-the-MVP warning was removed along with the mandate; the hazard is real');
});

test('/prototype credits Jeff Patton for the phrase Cagan credits to him', () => {
  const text = src();
  assert.match(text, /Jeff Patton/,
    'the build-to-learn/build-to-earn phrase is Jeff Patton\'s; Cagan says so in the cited article');
  const frame = text.match(/> \*\*The frame, plainly[^\n]*/)?.[0] ?? '';
  assert.ok(/Patton/.test(frame),
    `the attribution must be in the frame line itself, not a footnote elsewhere. Got: ${frame}`);
  assert.ok(!/\*\*The frame, plainly \(Marty Cagan/.test(text),
    'the frame credits Cagan alone again — that is the misattribution RVW-086 fixed');
});

test('/prototype constrains mock-data PLAUSIBILITY, not just licence to fabricate', () => {
  const text = src();
  // "fake responses — all fine" licensed speed but said nothing about plausibility, and the model's
  // documented default is to fabricate seemingly-authentic domain data (Taloni 2023: a synthetic
  // 250-patient dataset detectable only by statistical forensics). Two ADOPTED entries in
  // library/deceptive-patterns.json already hold this position for the product surface.
  assert.match(text, /never invent a plausible domain fact/i,
    'nothing stops the model inventing a lab value, dosage, citation or price in a sketch');
  assert.match(text, /unmistakably synthetic/i,
    'the rule must say the VALUES are obviously fake, not merely that mocking is allowed');
  // The domain-expert guardrail covers real data going IN; this covers fake data coming OUT.
  assert.match(text, /don't put real \[patient\/client\/financial\] data in it/i,
    'the domain-expert cohort guardrail was dropped — it is the complementary half, not a duplicate');
});

test('/prototype tells the founder to commit BEFORE the run step', () => {
  const text = src();
  // Claude Code checkpointing tracks Write/Edit/NotebookEdit only: "Changes made through Bash
  // commands are not tracked", subagent edits are not tracked, and it does not rewind the
  // conversation. Git is the only real undo, and the skill never mentioned it.
  const commitAt = text.indexOf('**4.5. Commit it');
  const runAt = text.indexOf('**5. Run it.**');
  assert.ok(commitAt !== -1, '/prototype no longer commits the sketch — git is the only real undo');
  assert.ok(runAt !== -1, '/prototype lost its run step');
  assert.ok(commitAt < runAt,
    'the commit step must come BEFORE the run step, or the undo arrives after the damage');
  assert.match(text, /not\*\* changes made\s*\n?by shell commands/i,
    'the skill must say what /rewind does NOT cover, or it promises an undo that is not there');
});

test('/prototype offers two versions only at SHOWING time, never as default generation', () => {
  const text = src();
  // Tohidi et al. CHI 2006 (N=48) is the only literal 1-vs-3 study and its mechanism is SOCIAL —
  // it removes the viewer's reluctance to disappoint. Dow 2010 held prototype count CONSTANT and
  // does not support generating variants; AI-generated examples measurably increase design
  // fixation. So this belongs at the moment a human is about to look, and nowhere else.
  assert.match(text, /If showing someone is the next move/,
    'the showing-time two-version nudge (RVW-084) is gone');
  const nudge = text.slice(text.indexOf('If showing someone is the next move'));
  assert.match(nudge.slice(0, 700), /One\s*\n?sketch stays the default output/,
    'the nudge must state that one sketch remains the default — otherwise it reads as generate-N');
});

test('no L0 skill still tells the founder to throw the sketch away', () => {
  // Sibling sweep: the mandate was stated twice in one file (the magic-circle wall repeated it).
  // A rewrite that does not sweep its siblings is a documented BOSS failure mode.
  const dir = join(STAGES_DIR, 'L0-quickstart', 'template', '.claude', 'skills');
  for (const skill of readdirSync(dir)) {
    const f = join(dir, skill, 'SKILL.md');
    if (!existsSync(f)) continue;
    const text = readFileSync(f, 'utf8');
    // Match the DOCTRINE, not one phrasing — the first version of this test only caught the
    // original wording, so any reword ("gets discarded when it earns a real build") slipped past.
    const flat = text.replace(/\n>?\s*/g, ' ');
    assert.ok(!/\b(thrown?|discard\w*|scrapp?\w*|deleted?|binned?)\b[^.]{0,60}when it earns a real build/i
      .test(flat), `/${skill} still repeats the retracted throw-it-away mandate`);
  }
});

test('/prototype caps unsupervised iteration and does not cite the number that failed', () => {
  const text = src();
  // v0.223.0 shipped "Coming back to it" — iterate on the sketch — with no cap. Shukla, Joshi & Syed
  // (IEEE-ISTAS 2025) measured security defects accumulating across unsupervised edit chains
  // (2.1 -> 6.2 per sample by iteration 8-10) and recommend at most THREE consecutive AI-only
  // iterations. That is the citable finding.
  assert.match(text, /three rounds/i,
    'the "Coming back to it" step lets a founder iterate forever with no look-at-it checkpoint');
  // The widely-repeated "37% more critical vulns after 5 iterations / modified up to 40 times"
  // version DOES NOT VERIFY: longest chain was 10, the 37.6% appears once (abstract only) and is
  // never derived, and the baseline was zero-vulnerability code. Never ship those numbers.
  for (const re of [/37(\.6)?%/, /\b40 times\b/i]) {
    assert.ok(!re.test(text),
      `/prototype cites an unverified iterative-degradation figure (matched ${re}). `
      + 'The primary supports the authors\' cap of 3, not that number.');
  }
});
