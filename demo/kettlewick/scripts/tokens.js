#!/usr/bin/env node
// Derives src/styles/tokens.css and src/styles/tokens.ts from docs/design/tokens.json, the one file a
// colour is a fact in. `node scripts/tokens.js` writes them; `--check` exits 1 when they are stale.
// A `$deprecated` token is left out, so code can't reach for it.
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE = join(ROOT, 'docs', 'design', 'tokens.json');
const CSS = join(ROOT, 'src', 'styles', 'tokens.css');
const TS = join(ROOT, 'src', 'styles', 'tokens.ts');
const HEADER = 'Generated from docs/design/tokens.json by scripts/tokens.js. Never edit by hand.';

function cssValue(token) {
  const v = token.$value;
  if (Array.isArray(v)) return v.map((f) => (/\s/.test(f) ? `"${f}"` : f)).join(', ');
  if (v && typeof v === 'object') return `${v.value}${v.unit}`;
  return String(v);
}

export function flatten(node, path = [], out = []) {
  for (const [key, child] of Object.entries(node)) {
    if (key.startsWith('$') || !child || typeof child !== 'object') continue;
    if ('$value' in child) {
      if (!child.$deprecated) out.push({ path: [...path, key], value: cssValue(child) });
    } else {
      flatten(child, [...path, key], out);
    }
  }
  return out;
}

function nest(flat, leaf) {
  const tree = {};
  for (const t of flat) {
    let at = tree;
    t.path.slice(0, -1).forEach((k) => { at = at[k] ??= {}; });
    at[t.path.at(-1)] = leaf(t);
  }
  return tree;
}

export function render(json) {
  const flat = flatten(json);
  const name = (t) => `--${t.path.join('-')}`;
  const css = `/* ${HEADER} */\n:root {\n${flat.map((t) => `  ${name(t)}: ${t.value};`).join('\n')}\n}\n`;
  const ts = `// ${HEADER}\n// \`tokens\` is what components style with (CSS custom properties); \`values\` is the raw value, for\n// the rare place a property can't take a var (a media query, a canvas).\n`
    + `export const tokens = ${JSON.stringify(nest(flat, (t) => `var(${name(t)})`), null, 2)} as const;\n\n`
    + `export const values = ${JSON.stringify(nest(flat, (t) => t.value), null, 2)} as const;\n`;
  return { css, ts };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { css, ts } = render(JSON.parse(readFileSync(SOURCE, 'utf8')));
  if (process.argv.includes('--check')) {
    const stale = [[CSS, css], [TS, ts]].filter(([p, want]) => {
      try { return readFileSync(p, 'utf8') !== want; } catch { return true; }
    });
    for (const [p] of stale) console.error(`stale: ${p} — run node scripts/tokens.js`);
    process.exit(stale.length ? 1 : 0);
  }
  writeFileSync(CSS, css);
  writeFileSync(TS, ts);
  console.log('wrote src/styles/tokens.css and src/styles/tokens.ts');
}
