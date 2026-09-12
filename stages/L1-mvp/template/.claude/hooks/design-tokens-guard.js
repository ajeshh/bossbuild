#!/usr/bin/env node
// BOSS design-tokens-guard — a PostToolUse hook (OPT-IN; the boundary the design practice prescribes).
//
// WHY IT EXISTS: `boss craft design-system` names "the 47 blues" as the signature
// AI-design drift — every screen derives slightly different colors until no single source of truth
// survives. Its prescribed prevention was *"reference tokens by name in every prompt."* That is a
// **filter**: it depends on every future prompt remembering. The same lesson `agent-security.md`
// took from CVE-2026-22708 applies here — **bound the capability, don't enumerate the route.** What
// actually stops the 47 blues is a check that fires on a raw hex. This is that check.
//
// WHAT IT DOES: after a write to a style-bearing file, scan for hardcoded style values and hand
// Claude the token vocabulary it should have used instead. Advisory, never blocking (PostToolUse
// cannot block; the tool already ran).
//
// FIVE FAMILIES, NOT ONE (v0.277.0). A token system defines color, spacing, type, radius and
// elevation; until v0.277.0 this guard enforced **one of the five** and the other four were prose.
// The other four are now checked — under a gate that keeps them quiet:
//
//   **No named tokens for a family, no opinion about that family.** You cannot ask someone to use a
//   token name that does not exist. If `DESIGN_TOKENS.md` defines no `radius.*` / `--radius-*`
//   vocabulary, a `border-radius: 12px` is not drift — it is the only way to say it. The gate is
//   the same JIT logic as the top-level one, applied per family instead of once.
//
//   COLOR IS THE EXCEPTION and stays unconditional: it is the original boundary, "the 47 blues" is
//   the named failure, and weakening a shipped check to generalize it would be a bad trade.
//
// THE NOISE RULE, said plainly: a spacing literal is far more common and far more often legitimate
// than a hex — a hairline border, a third-party embed, an optical nudge. A guard that cries wolf is
// a guard the founder turns off, and a guard that is off is worth LESS than no guard because they
// believe it is on. So spacing flags CSS declarations and Tailwind *arbitrary* values only — never
// `p-4`, which IS a scale reference — and never `0` or a 1px hairline.
//
// THE JIT RULE THAT KEEPS IT QUIET: it does NOTHING unless a tokens file exists. No token system
// means no opinion — a founder who hasn't run `/design-tokens-init` is not doing anything wrong, and
// a hook that nags them is the unearned ceremony BOSS warns against (Principle #2). The tokens file
// IS the opt-in signal, which is why `/design-tokens-init` is the natural place to turn this on.
//
// WHY OPT-IN: a PostToolUse hook fires a process after every matching tool call — real latency. Ship
// it dormant; the founder turns it on when the UI is worth keeping. Registration IS the on-switch.
//
// TO TURN IT ON — add to .claude/settings.json:
//   "hooks": {
//     "PostToolUse": [
//       { "matcher": "Edit|Write|MultiEdit",
//         "hooks": [ { "type": "command",
//                      "command": "node \"$CLAUDE_PROJECT_DIR/.claude/hooks/design-tokens-guard.js\"",
//                      "timeout": 5 } ] }
//     ]
//   }
//
// SINCE v0.310.0 it also reads the tokens doc's `## Deprecated` table — rows of `| \`old\` | \`new\` |`
// (or any line pairing two token names with `→`) — and names the successor when a write references
// a retired token. A deleted token breaks every screen silently; a deprecated one names its
// replacement, and this is the check that makes the table more than a note.
//
// Fail-open: any surprise exits 0 silently. A missed warning is fine; a broken session is not.

import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const MAX_REPORTED = 6;          // don't flood the context with 40 identical findings
const TOKENS_CANDIDATES = [
  join('docs', 'design', 'DESIGN_TOKENS.md'),
  join('docs', 'DESIGN_TOKENS.md'),
  'DESIGN_TOKENS.md',
];

// Style-bearing files only. A hex in a README or a JSON fixture is not design drift.
// The non-web extensions are here because a design system is not a web idea: SwiftUI, Compose
// and Flutter all hardcode colour just as readily, and this guard was silent for all three.
const STYLE_EXT = /\.(css|scss|sass|less|styl|tsx|jsx|ts|js|mjs|vue|svelte|astro|html|swift|kt|kts|dart|xml)$/i;
// Never lint the token system itself, generated output, or tests.
// `colors.xml` / `themes.xml` are Android's tokens FILE — flagging a hex there is flagging the
// answer, which is the mistake the `DESIGN_TOKENS` exclusion already exists to avoid on the web.
const SKIP_PATH = /(^|[\\/])(node_modules|dist|build|out|coverage|\.next|\.svelte-kit)[\\/]|DESIGN_TOKENS|tokens\.(css|js|ts|json)$|(^|[\\/])(colors|themes|attrs)\.xml$|\.(test|spec|stories)\./i;

const TAILWIND_UTIL = 'bg|text|border|ring|fill|stroke|from|via|to|divide|outline|shadow|decoration|accent|caret|placeholder';
const TAILWIND_HUE = 'slate|gray|grey|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose';

// A value that defers to the system is never drift, in any family.
const DEFERS = /^(?:0|0px|none|inherit|initial|unset|auto|revert)$|\bvar\(|\bcalc\(|\benv\(|\bclamp\(|\btheme\(/i;

// --- the families ---------------------------------------------------------------------------
// `names` = how a token of this family is written in the tokens doc, used both to decide whether
// the family is governed at all and to name the alternative in the message.
const FAMILIES = [
  {
    key: 'color',
    label: 'color',
    always: true,                       // the original boundary; never gated
    names: ['color', 'colour'],
    checks: [
      { label: 'hex color',        re: new RegExp(`#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\\b`, 'g') },
      { label: 'rgb()/hsl()',      re: /\b(?:rgba?|hsla?)\s*\(/g },
      { label: 'palette class',    re: new RegExp(`\\b(?:${TAILWIND_UTIL})-(?:${TAILWIND_HUE})-(?:50|100|200|300|400|500|600|700|800|900|950)\\b`, 'g') },
      // Flutter and Compose write colour as a packed int, which no `#` pattern can see. Scoped to
      // `Color(0x…)` on purpose: a bare `0xFF0000` is a bitmask far more often than it is a colour,
      // and a guard that cries wolf on masks is one the founder turns off.
      { label: 'packed color int', re: /\bColor\(\s*0x[0-9a-fA-F]{6,8}\s*\)/g },
    ],
  },
  {
    key: 'radius',
    label: 'corner radius',
    names: ['radius', 'rounded', 'corner'],
    checks: [
      { label: 'css radius',   re: /\bborder-radius\s*:\s*[^;}\n]+/gi },
      { label: 'style radius', re: /\bborderRadius\s*:\s*["']?[\d.]+\w*/g },
      { label: 'arbitrary radius', re: /\brounded(?:-[trbl]{1,2})?-\[[^\]]+\]/g },
      { label: 'native radius', re: /\b(?:cornerRadius\s*:\s*[\d.]+|RoundedCornerShape\(\s*[\d.]+|BorderRadius\.circular\(\s*[\d.]+)/g },
    ],
  },
  {
    key: 'type',
    label: 'type scale',
    names: ['font', 'typography'],
    checks: [
      { label: 'css font-size',   re: /\bfont-size\s*:\s*[^;}\n]+/gi },
      { label: 'style fontSize',  re: /\bfontSize\s*:\s*["']?[\d.]+\w*/g },
      { label: 'arbitrary size',  re: /\btext-\[[^\]]*(?:px|rem|em|pt)[^\]]*\]/g },
      { label: 'native font size', re: /\bsize\s*:\s*[\d.]+\s*\)/g },
    ],
  },
  {
    key: 'elevation',
    label: 'elevation',
    names: ['shadow', 'elevation'],
    checks: [
      { label: 'css box-shadow', re: /\bbox-shadow\s*:\s*[^;}\n]+/gi },
      { label: 'arbitrary shadow', re: /\bshadow-\[[^\]]+\]/g },
    ],
  },
  {
    key: 'spacing',
    label: 'spacing',
    names: ['spacing', 'space'],
    // Narrowest patterns in the file, on purpose — see THE NOISE RULE above.
    checks: [
      {
        label: 'css spacing',
        re: /\b(?:padding|margin|gap|row-gap|column-gap)(?:-(?:top|right|bottom|left|inline|block)(?:-(?:start|end))?)?\s*:\s*[^;}\n]*\d[^;}\n]*/gi,
      },
      { label: 'arbitrary spacing', re: /\b(?:p|m|gap|space)[trblxy]?-\[[^\]]+\]/g },
    ],
    // A hairline and a zero are not spacing-scale decisions.
    ignoreValue: /(?::\s*)(?:0(?:px|rem|em)?|1px)\s*$/i,
  },
];

const out = (additionalContext) => {
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: { hookEventName: 'PostToolUse', additionalContext },
  }));
  process.exit(0);
};

let event;
try {
  event = JSON.parse(readFileSync(0, 'utf8') || '{}');
} catch {
  process.exit(0); // fail-open
}

try {
  const projectDir = process.env.CLAUDE_PROJECT_DIR || event.cwd || process.cwd();

  // --- The JIT gate: no token system, no opinion. ------------------------------------------
  const tokensRel = TOKENS_CANDIDATES.find((p) => existsSync(join(projectDir, p)));
  if (!tokensRel) process.exit(0);

  const input = event.tool_input || {};
  const path = input.file_path || input.notebook_path || '';
  if (!path || !STYLE_EXT.test(path) || SKIP_PATH.test(path)) process.exit(0);

  // Only look at what this call actually wrote — not the whole file. A pre-existing hex the
  // founder already decided to keep is not this hook's business; drift is what's NEW.
  let written = '';
  if (typeof input.content === 'string') written = input.content;            // Write
  else if (typeof input.new_string === 'string') written = input.new_string; // Edit
  else if (Array.isArray(input.edits)) {                                     // MultiEdit
    written = input.edits.map((e) => e && e.new_string).filter(Boolean).join('\n');
  }
  if (!written.trim()) process.exit(0);

  // --- Read the vocabulary FIRST: it decides which families are governed at all. ------------
  // A warning that names no alternative just gets acknowledged and ignored — and a family with no
  // vocabulary has no alternative to name, which is exactly why it stays silent.
  let doc = '';
  try { doc = readFileSync(join(projectDir, tokensRel), 'utf8'); } catch { /* vocabulary is a nicety */ }

  const vocabFor = (keywords) => {
    const names = new Set();
    for (const kw of keywords) {
      const re = new RegExp('`(--[\\w-]*' + kw + '[\\w-]*|' + kw + '\\.[\\w.-]+|[\\w-]*\\.' + kw + '\\.[\\w.-]+)`', 'gi');
      for (const m of doc.matchAll(re)) names.add(m[1]);
    }
    return [...names];
  };

  const governed = FAMILIES
    .map((f) => ({ ...f, vocab: vocabFor(f.names) }))
    .filter((f) => f.always || f.vocab.length > 0);

  // --- Deprecated tokens: the successor table, read where the old name gets typed. -----------
  // Under a `## Deprecated` heading, a table row `| \`old\` | \`new\` | … |`; anywhere, a line that
  // says "deprecated" and pairs two names with an arrow. Both shapes are what a person writes.
  const retired = new Map();
  let inDeprecated = false;
  for (const line of doc.split(/\r?\n/)) {
    if (/^#{1,6}\s/.test(line)) inDeprecated = /deprecat/i.test(line);
    const row = inDeprecated && line.match(/^\|\s*`([\w.-]+)`\s*\|\s*`([\w.-]+)`/);
    const arrow = /deprecat/i.test(line) && line.match(/`([\w.-]+)`[^`\n]{0,40}?(?:→|->)\s*`([\w.-]+)`/);
    const m = row || arrow;
    if (m && m[1] !== m[2]) retired.set(m[1], m[2]);
  }
  const retiredHits = [];
  for (const [old, next] of retired) {
    // `tokens.color.brand` and `--color-brand` both count; `color.brandmark` does not.
    const dotted = old.replace(/[.]/g, '\\.');
    const dashed = '--' + old.replace(/[.]/g, '-');
    const re = new RegExp(`(^|[^\\w-])(?:${dotted}|${dashed})(?![\\w-])`);
    if (re.test(written)) retiredHits.push({ old, next });
  }

  // --- Scan, family by family. --------------------------------------------------------------
  const found = [];
  for (const family of governed) {
    for (const { label, re } of family.checks) {
      for (const m of written.matchAll(re)) {
        const value = m[0].replace(/\s*\($/, '()').trim();
        const bare = value.replace(/^[^:]*:\s*/, '').trim();
        if (DEFERS.test(bare)) continue;
        if (family.ignoreValue && family.ignoreValue.test(value)) continue;
        found.push({ family, label, value });
        if (found.length > 400) break; // pathological file guard
      }
    }
  }
  const retiredNote = retiredHits.length
    ? `design-tokens-guard: \`${path}\` references ${retiredHits.length === 1 ? 'a deprecated token' : `${retiredHits.length} deprecated tokens`} — ` +
      retiredHits.map((h) => `\`${h.old}\` → use \`${h.next}\``).join(', ') +
      `. The \`Deprecated\` table in \`${tokensRel}\` retired ${retiredHits.length === 1 ? 'it' : 'them'}; ` +
      `the old name keeps working until its last use is gone, and this is one of the uses keeping it alive.`
    : '';
  if (!found.length) {
    if (retiredNote) out(retiredNote);
    process.exit(0);
  }

  // De-dupe by literal value, keep source order.
  const seen = new Set();
  const unique = found.filter((f) => !seen.has(f.value) && seen.add(f.value));
  const shown = unique.slice(0, MAX_REPORTED);
  const extra = unique.length - shown.length;

  // --- Point at the token, don't just complain. ---------------------------------------------
  const list = shown.map((f) => `\`${f.value}\` (${f.label})`).join(', ');
  const tail = extra > 0 ? `, and ${extra} more` : '';

  const hitFamilies = [...new Set(shown.map((f) => f.family.key))]
    .map((k) => governed.find((g) => g.key === k));
  const suggest = hitFamilies
    .map((f) => (f.vocab.length
      ? `${f.label} → ${f.vocab.slice(0, 5).map((v) => `\`${v}\``).join(', ')}`
      : `${f.label} → read \`${tokensRel}\` and use a semantic token name`))
    .join(' · ');

  out(
    (retiredNote ? `${retiredNote}\n\n` : '') +
    `design-tokens-guard: hardcoded style values were just written to \`${path}\` — ${list}${tail}. ` +
    `This project has a token system, so raw values are drift ("the 47 blues": each screen derives ` +
    `slightly different values until no single source of truth survives — it happens to spacing and ` +
    `radius the same way it happens to color). Tokens to use instead: ${suggest}. ` +
    `Replace the raw values with token references, or — if this one is a deliberate exception — say ` +
    `so out loud and record it, rather than leaving it to look like an accident.`
  );
} catch {
  process.exit(0); // fail-open on any matching/IO error
}
