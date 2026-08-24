// pattern-catalog-vet — locks the two facts a re-edit of these rows would quietly destroy.
//
// WHY THIS FILE EXISTS: the deceptive-pattern catalog shipped 87 `adopted` rows and 2 marked
// `candidate` (which render to the founder as UNVETTED). Vetting them (RVW-087, RVW-088) turned up
// two couplings that live in PROSE, across two directories, with nothing watching them:
//
//   1. `consent-or-pay` is only honest BECAUSE `monetization-in-practice.md` carries the
//      counterweight. Without it the catalog is BOSS's only voice on the subject, and it states the
//      manipulative reading with nothing stating the legitimate one — so the row fires on a paid
//      ad-free tier, which is how a lot of calm companies fund themselves. RVW-088 made the
//      counterweight a CONDITION of adopting the row. A condition nothing enforces is a wish.
//
//   2. Every figure in a `teeth` string was verified against a primary source once. Nothing reads
//      them back. This is the [[checkers-state-intents-they-dont-enforce]] shape and the RVW-016
//      drift shape at the same time: shipped text drifting from the record that authorized it.
//
// The tests bind to MEANING, not phrasing — the v0.223.0 lesson, where a guard matched one wording
// and a reworded mandate walked straight through it.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { BOSS_ROOT, STAGES_DIR, PRACTICES_DIR } from '../src/paths.js';

const catalog = JSON.parse(
  readFileSync(join(BOSS_ROOT, 'library', 'deceptive-patterns.json'), 'utf8'));

function rows() {
  const out = [];
  (function walk(o) {
    if (Array.isArray(o)) return o.forEach(walk);
    if (o && typeof o === 'object') {
      if (o.id && o.looks_like) out.push(o);
      Object.values(o).forEach(walk);
    }
  })(catalog);
  return out;
}

const row = (id) => rows().find((r) => r.id === id);

test('every catalog row carries a known status', () => {
  const known = new Set(['adopted', 'candidate']);
  for (const r of rows()) {
    assert.ok(known.has(r.status),
      `row "${r.id}" has status "${r.status}" — not one of ${[...known].join(' / ')}`);
  }
});

// --- 1. consent-or-pay: the row and its counterweight are one change --------------------------

test('consent-or-pay names the BINARY, not the paid tier', () => {
  const r = row('consent-or-pay');
  assert.ok(r, 'the consent-or-pay row is missing');
  const copy = `${r.looks_like} ${r.honest}`;

  // The defect RVW-088 found: copy that condemns "privacy becomes a paid tier" full stop will fire
  // on an honest ad-free plan. The primary (EDPB Opinion 08/2024) locates the defect in the absence
  // of a third door, so the row must say so.
  assert.match(copy, /\b(binary|two doors|only two|third door|further alternative)\b/i,
    'consent-or-pay must name the two-doors/third-door test — otherwise it fires on a legitimate ad-free tier');

  // ...and it must say out loud that charging is not itself the pattern.
  assert.match(copy, /\b(normal|fine|legitimate|pro-user)\b/i,
    'consent-or-pay must concede that charging for an ad-free plan is legitimate');
});

test('shipping consent-or-pay REQUIRES the monetization counterweight', () => {
  if (!row('consent-or-pay')) return; // row withdrawn — the coupling is moot
  const practice = readFileSync(
    join(PRACTICES_DIR, 'monetization-in-practice.md'), 'utf8');

  assert.match(practice, /ad-free/i,
    'monetization-in-practice must address ad-free tiers while the consent-or-pay row ships');
  assert.match(practice, /\b(binary|only two|two doors|only way not to be tracked)\b/i,
    'the counterweight must draw the same line the row draws — the binary, not the price');
});

test('consent-or-pay teeth keeps its verified scope limit', () => {
  const t = row('consent-or-pay').teeth;
  assert.match(t, /Opinion 08\/2024/,
    'the teeth must name the opinion it rests on');
  // The scope caveat is the whole reason this row is safe to show a solo founder. RVW-088 verified
  // it from the primary; losing it turns the row into regulatory intimidation.
  assert.match(t, /\b(does not reach|large online platform|LARGE ONLINE PLATFORM)/,
    'the teeth must keep the scope limit — the opinion binds large online platforms, not a solo founder');
});

// --- 2. ai-washing: the teeth was verified to the digit; hold it there ------------------------

test('claims-ai-washing teeth keeps every figure verified against ftc.gov', () => {
  const t = row('claims-ai-washing').teeth;
  // Each of these was read from the FTC's own press releases in RVW-087. If an edit changes one,
  // this fails and the editor has to go re-read the primary — which is the entire point.
  for (const fact of [/Operation AI Comply/, /2024-09-25/, /five actions/, /5-0/,
    /2025-01-16/, /\$193,000/, /2021.2023/]) {
    assert.match(t, fact,
      `claims-ai-washing teeth lost a verified figure (${fact}) — re-verify against ftc.gov before editing`);
  }
});

// --- 3. mentor-capital: the two halves most likely to be dropped in retelling -----------------

const mentorCapital = readFileSync(
  join(STAGES_DIR, 'L1-mvp', 'template', '.claude', 'agents', 'mentor-capital.md'), 'utf8');

test('the pitch-bias finding keeps its citation and its men-only moderation', () => {
  assert.match(mentorCapital, /PNAS/,
    'the pitch-bias bullet must name its venue — the inbox file guessed it and said not to cite until checked');
  assert.match(mentorCapital, /Brooks[^.\n]{0,60}Murray/,
    'the pitch-bias bullet must carry the author list');

  // The abstract is explicit: "physical attractiveness did not matter among female entrepreneurs."
  // Retelling it as "gender and appearance" makes it symmetric, which is false.
  const bullet = mentorCapital.slice(mentorCapital.indexOf('PNAS') - 900,
    mentorCapital.indexOf('PNAS') + 600);
  assert.match(bullet, /for men only|men only|did nothing for women|not.{0,20}women/i,
    'the pitch-bias bullet must keep the men-only attractiveness moderation');
});

test('the pitch-bias finding does not call angel investors VCs', () => {
  const i = mentorCapital.indexOf('PNAS');
  const bullet = mentorCapital.slice(i - 900, i + 600);
  assert.doesNotMatch(bullet, /\bVCs?\b|venture capitalists?/i,
    'this literature observed ANGEL investors; "VC" is the word attached in the retelling (see RVW-091)');
});

// --- 4. a candidate row must leave something for /vet to rule on ------------------------------

test('a candidate row is a promise to vet it, not a place to park it', () => {
  const inbox = join(BOSS_ROOT, 'docs', 'research', 'inbox');
  // FAIL-OPEN BY DESIGN: docs/research/ is gitignored, so a fresh clone has no inbox and this
  // check cannot run there. Said out loud rather than left as a silent pass.
  if (!existsSync(inbox)) return;

  const files = readdirSync(inbox).join('\n');
  for (const r of rows().filter((x) => x.status === 'candidate')) {
    const stem = r.id.replace(/^[a-z]+-/, '').split('-')[0];
    assert.ok(files.toLowerCase().includes(stem.toLowerCase()),
      `row "${r.id}" renders UNVETTED to founders but has no claim file in docs/research/inbox/ — ` +
      'nobody can tell what would resolve it');
  }
});
