#!/usr/bin/env node
// BOSS contrast-guard — a PostToolUse hook (OPT-IN). The one accessibility check that is arithmetic.
//
// WHY IT EXISTS: BOSS said two contradictory things about contrast, in shipped text.
//   · `designer.md`: "Anything needing a rendered page — contrast ratios, focus order, screen-reader
//     sequence — is NOT CHECKED, never a pass."
//   · `/design-library`: a `contrast {{ratio}}:1 {{PASS_OR_FAIL}}` placeholder that nothing computed,
//     so the model was being asked to fill it by reasoning about hex values.
//
// Both are wrong, in opposite directions. **WCAG contrast is a pure function of two colours** —
// relative luminance, a published formula, no browser and no guess. It is the ONLY accessibility
// property that can be a real boundary in a tool that ships no renderer, and the style guide already
// prescribed the right method: *"check the token pairs, not screenshots."* The method was written
// down and the arithmetic was never shipped. This is the arithmetic.
//
// WHAT IT CHECKS: on a write to the tokens file, pair every `text.*` colour against every
// `surface.*` / `background.*` colour and report the pairs that fall under WCAG AA — 4.5:1 for body
// text, 3.0:1 for large text and UI boundaries. It checks the pairs you DECLARED, which is the right
// altitude: a failure here is a token-system finding, caught once, rather than the same failure found
// again on every screen that uses it.
//
// WHAT IT CANNOT CHECK, and says so: text over an image, a gradient, a translucent overlay, or
// anything composited at runtime. Those need a rendered page and remain `not checked` — never a pass.
// A guard that implies it verified the page would be worse than no guard.
//
// THE JIT GATE: nothing happens unless the written file IS a tokens file. No token system, no
// opinion — the same rule every other guard here follows.
//
// TO TURN IT ON — add to .claude/settings.json (it can share the block with the other guards):
//   "hooks": { "PostToolUse": [ { "matcher": "Edit|Write|MultiEdit",
//     "hooks": [ { "type": "command",
//                  "command": "node \"$CLAUDE_PROJECT_DIR/.claude/hooks/contrast-guard.js\"",
//                  "timeout": 5 } ] } ] }
//
// Fail-open: any surprise exits 0 silently.

import { readFileSync } from 'node:fs';

const TOKENS_FILE = /(^|[\\/])(DESIGN_TOKENS\.md|tokens\.(css|js|ts|json)|colors\.xml)$/i;
const AA_BODY = 4.5;
const AA_LARGE = 3.0;
const MAX_REPORTED = 6;

// --- WCAG 2.x relative luminance. A published formula; no approximation in here. -------------
const channel = (v) => {
  const c = v / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};
const luminance = ({ r, g, b }) =>
  0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
const ratio = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

// #rgb · #rrggbb · #rrggbbaa (alpha ignored — it composites at runtime, which is exactly the part
// this hook does not claim to check).
const parseHex = (hex) => {
  let h = hex.replace('#', '');
  if (h.length === 3 || h.length === 4) h = [...h.slice(0, 3)].map((c) => c + c).join('');
  if (h.length === 8) h = h.slice(0, 6);
  if (h.length !== 6 || /[^0-9a-f]/i.test(h)) return null;
  return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16) };
};

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
  process.exit(0);
}

try {
  const input = event.tool_input || {};
  const path = input.file_path || '';
  if (!path || !TOKENS_FILE.test(path)) process.exit(0);   // the JIT gate

  // Read the whole file, not just the edit: a contrast PAIR spans two lines that were probably not
  // written in the same call, so "only what changed" — right for the drift guards — is wrong here.
  let body = '';
  try { body = readFileSync(path, 'utf8'); } catch { /* fall through to the written slice */ }
  if (!body) {
    if (typeof input.content === 'string') body = input.content;
    else if (typeof input.new_string === 'string') body = input.new_string;
  }
  if (!body.trim()) process.exit(0);

  // A token is a name near a hex. Semantic naming is what makes this possible at all — you can only
  // pair text against surface if the names say which is which, which is why `/design-tokens-init`
  // insists on purpose-naming rather than hue-naming.
  const tokens = [];
  for (const line of body.split('\n')) {
    const name = line.match(/([-\w.]*(?:text|surface|background|bg|foreground|fg|ink|action|feedback)[-\w.]*)/i);
    const hex = line.match(/#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b/);
    if (!name || !hex) continue;
    const rgb = parseHex(hex[0]);
    if (rgb) tokens.push({ name: name[1], hex: hex[0], rgb });
  }

  const isText = (t) => /text|foreground|\bfg\b|ink/i.test(t.name);
  const isSurface = (t) => /surface|background|\bbg\b/i.test(t.name);
  const fg = tokens.filter(isText);
  const bg = tokens.filter((t) => isSurface(t) && !isText(t));
  if (!fg.length || !bg.length) process.exit(0);   // nothing pairable — no opinion

  const findings = [];
  for (const f of fg) {
    for (const b of bg) {
      const r = ratio(f.rgb, b.rgb);
      if (r < AA_BODY) {
        findings.push({ f, b, r: Math.round(r * 100) / 100, large: r >= AA_LARGE });
      }
    }
  }
  if (!findings.length) process.exit(0);

  findings.sort((a, b) => a.r - b.r);
  const shown = findings.slice(0, MAX_REPORTED);
  const extra = findings.length - shown.length;

  const list = shown.map((x) =>
    `\`${x.f.name}\` on \`${x.b.name}\` = **${x.r}:1**` +
    (x.large ? ' (passes for large text only — under 4.5 for body)' : ' (fails AA for any text size)')
  ).join(' · ');

  out(
    `contrast-guard: ${findings.length} declared token pair(s) fall under WCAG AA in \`${path}\`` +
    `${extra > 0 ? ` (showing ${shown.length})` : ''} — ${list}. ` +
    `AA is 4.5:1 for body text and 3.0:1 for large text and UI boundaries. Fix it **in the tokens**, ` +
    `not on the screen that surfaced it: a pair that fails here fails everywhere it is used, so ` +
    `changing the token fixes every screen at once and changing the screen fixes one. If a pair is ` +
    `deliberate — a disabled state, decorative text — say so and record it in the style guide's ` +
    `Exceptions table rather than leaving it to read as an accident. ` +
    `**Scope, so this is not mistaken for more than it is:** these are the pairs you DECLARED. Text ` +
    `over an image, a gradient, or a translucent overlay composites at runtime, needs a rendered ` +
    `page, and stays *not checked* — never a pass.`
  );
} catch {
  process.exit(0);
}
