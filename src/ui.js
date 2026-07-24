// src/ui.js — the one place BOSS's terminal styling lives (IDEA-055).
//
// Zero-dep (raw ANSI, Principle 4). Restraint is the whole point: ONE accent per
// SEMANTIC STATE, never decoration. Color is the THIRD channel — the glyph and the
// word already carry the meaning, so a plain pipe / NO_COLOR / a screen reader
// loses nothing. If a color doesn't help a scanning founder answer "did it work /
// is this a warning / what now?", it doesn't belong here.
//
// This replaces the `dim` helper that was defined byte-identical three times
// (cli.js / brain.js / conscience.js) and lets the palette evolve in one place.

// Honor the de-facto standards. NO_COLOR (any non-empty value) disables color;
// FORCE_COLOR opts back in even when piped (CI, `| less -R`). Otherwise color only
// when stdout is a real terminal, so `boss board | cat` stays clean. Evaluated at
// call time (not import time) because isTTY can differ per stream/run.
const noColor = () => 'NO_COLOR' in process.env && process.env.NO_COLOR !== '';
const forceColor = () => process.env.FORCE_COLOR != null && process.env.FORCE_COLOR !== '0';
export const colorEnabled = () => forceColor() || (!noColor() && !!process.stdout.isTTY);

// Specific close codes (39 = default fg, 22 = normal weight) rather than a full
// reset, so a wrapped span can nest inside another without killing it.
const wrap = (open, close) => (s) => (colorEnabled() ? `\x1b[${open}m${s}\x1b[${close}m` : String(s));

// The vocabulary — deliberately small. Add a color here only when a real new
// semantic state earns it, never for flourish.
export const dim  = wrap(90, 39); // the aside / secondary detail (bright black)
export const bold = wrap(1, 22);  // structure: section headers, the word that anchors
export const ok   = wrap(32, 39); // success — a thing happened and it worked (green)
export const warn = wrap(33, 39); // a soft warning — worth a look, not a failure (yellow)
export const err  = wrap(31, 39); // an error — the command could not do the thing (red)
