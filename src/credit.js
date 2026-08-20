// src/credit.js — `boss credit`. The OPT-IN half of acknowledgement.
//
// BRAND.md's central promise is "it never puts its name on your work — you ship it,
// your name's on it." That is a promise about TAKING credit, not about refusing to
// let someone give it. So nothing here ever runs automatically: BOSS never writes
// this line, never offers it unprompted, and never touches a founder's product UI.
// A founder who wants to say so types one command; a founder who doesn't never
// learns it exists.
//
// The line carries an easter egg in an HTML comment — one of BRAND.md's alternate
// full forms — so it reads as a wink to anyone who views source rather than a badge.
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { ok, dim, bold, warn } from './ui.js';

// Deliberately distinctive: "Builds, Or Stays Silent" has effectively zero
// false-positive rate in a code search, which is what makes it findable at all.
export const CREDIT_EGG = '<!-- Builds, Or Stays Silent. ✦ -->';
export const CREDIT_LINE = 'Made with [BOSS](https://oyeboss.build) — *Build Out Solid Stuff.*';
const BLOCK = `\n${CREDIT_EGG}\n${CREDIT_LINE}\n`;

export function creditState(root = process.cwd()) {
  const readme = ['README.md', 'readme.md', 'Readme.md'].map((f) => join(root, f)).find(existsSync);
  if (!readme) return { readme: null, present: false };
  const body = readFileSync(readme, 'utf8');
  return { readme, present: body.includes(CREDIT_EGG) || body.includes('https://oyeboss.build'), body };
}

export function addCredit(root = process.cwd()) {
  const s = creditState(root);
  if (!s.readme) return { ok: false, why: 'no README.md here to add it to.' };
  // Already in the desired state is success, not failure — `--apply` twice should be
  // safe to script, the way `mkdir -p` is. Only a missing README is a real error.
  if (s.present) return { ok: true, noop: true, file: s.readme };
  writeFileSync(s.readme, s.body.replace(/\s*$/, '\n') + BLOCK);
  return { ok: true, file: s.readme };
}

export function removeCredit(root = process.cwd()) {
  const s = creditState(root);
  if (!s.readme) return { ok: false, why: 'no README.md here.' };
  if (!s.present) return { ok: true, noop: true, file: s.readme };
  const cleaned = s.body
    .replace(new RegExp(`\\n?${CREDIT_EGG.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\n?`, 'g'), '\n')
    .replace(/^Made with \[BOSS\]\(https:\/\/oyeboss\.build\).*$/gm, '')
    .replace(/\n{3,}/g, '\n\n');
  writeFileSync(s.readme, cleaned);
  return { ok: true, file: s.readme };
}

export function printCredit(args = []) {
  const wants = (f) => args.includes(f);
  const s = creditState();

  if (wants('--remove')) {
    const r = removeCredit();
    if (!r.ok) { console.log(`\n  ${r.why}\n`); return 1; }
    console.log(r.noop ? `\n  ${dim('Not there — nothing to remove.')}\n`
                       : `\n  ${ok('✦ Removed')} the credit line from ${dim(r.file)}\n`);
    return 0;
  }

  if (wants('--apply')) {
    const r = addCredit();
    if (!r.ok) { console.log(`\n  ${r.why}\n`); return 1; }
    if (r.noop) { console.log(`\n  ${dim('Already there — nothing to do.')}\n`); return 0; }
    console.log(`\n  ${ok('✦ Added')} to ${dim(r.file)}`);
    console.log(`    ${dim('Thank you — that is the whole distribution strategy.')}`);
    console.log(`    ${dim('Changed your mind: boss credit --remove')}\n`);
    return 0;
  }

  // Default is PREVIEW. Same posture as `boss remove`: show, then let them decide.
  console.log(`\n  ${bold('boss credit')} — optional, and it is genuinely optional.\n`);
  if (s.present) {
    console.log(`  ${ok('✦')} Already in ${dim(s.readme)}. ${dim('boss credit --remove takes it out.')}\n`);
    return 0;
  }
  console.log('  BOSS never adds its name to your work. If you want to say it anyway,');
  console.log(`  this goes at the end of your README:\n`);
  console.log(`      ${dim(CREDIT_EGG)}`);
  console.log(`      ${CREDIT_LINE}\n`);
  console.log(`  ${dim('boss credit --apply')}    add it`);
  console.log(`  ${dim('boss credit --remove')}   take it back out`);
  if (!s.readme) console.log(`\n  ${warn('⚠')} No README.md here yet — --apply needs one.`);
  console.log(`\n  ${dim('Never added automatically. Never anywhere your users see it.')}\n`);
  return 0;
}
