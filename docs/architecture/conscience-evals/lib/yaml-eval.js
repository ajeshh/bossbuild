// Minimal YAML parser shared by the conscience eval runners (gate + judgment).
// Zero-dep. Covers the subset our eval files use:
//   - block sequence at top level (- key: ...)
//   - block mappings (key: value with indented children)
//   - inline mappings ({k: v, k2: v2}) and inline sequences ([a, b, c])
//   - scalars: string (bare or quoted), int, true/false, null
//   - comments (# ...) and blank lines
//
// NOT supported (intentionally): anchors, aliases, multi-line scalars,
// flow-style mixing, tags. Keep the eval files within the subset.
//
// Extracted from runner.js (v0.32.0) so judgment/replay.js can parse the same
// way without duplicating the parser. runner.js imports parseYaml from here.

export function parseScalar(s) {
  s = s.trim();
  if (s === '' || s === '~' || s === 'null') return null;
  if (s === 'true') return true;
  if (s === 'false') return false;
  if (/^-?\d+$/.test(s)) return parseInt(s, 10);
  if (/^-?\d+\.\d+$/.test(s)) return parseFloat(s);
  // quoted string
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    return s.slice(1, -1);
  }
  // inline list
  if (s.startsWith('[') && s.endsWith(']')) {
    const inner = s.slice(1, -1).trim();
    if (!inner) return [];
    return splitTopLevel(inner, ',').map((p) => parseScalar(p));
  }
  // inline object
  if (s.startsWith('{') && s.endsWith('}')) {
    const inner = s.slice(1, -1).trim();
    if (!inner) return {};
    const obj = {};
    for (const pair of splitTopLevel(inner, ',')) {
      const colonIdx = findTopLevelChar(pair, ':');
      if (colonIdx < 0) continue;
      const k = pair.slice(0, colonIdx).trim();
      const v = pair.slice(colonIdx + 1).trim();
      obj[k] = parseScalar(v);
    }
    return obj;
  }
  return s; // bare string
}

// Split a string by `sep` but respect brackets, braces, and quotes.
export function splitTopLevel(s, sep) {
  const parts = [];
  let depth = 0;
  let inQuote = null;
  let start = 0;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (inQuote) {
      if (c === inQuote) inQuote = null;
      continue;
    }
    if (c === '"' || c === "'") { inQuote = c; continue; }
    if (c === '[' || c === '{') depth++;
    else if (c === ']' || c === '}') depth--;
    else if (c === sep && depth === 0) {
      parts.push(s.slice(start, i));
      start = i + 1;
    }
  }
  parts.push(s.slice(start));
  return parts.map((p) => p.trim()).filter((p) => p.length > 0);
}

export function findTopLevelChar(s, ch) {
  let depth = 0;
  let inQuote = null;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (inQuote) { if (c === inQuote) inQuote = null; continue; }
    if (c === '"' || c === "'") { inQuote = c; continue; }
    if (c === '[' || c === '{') depth++;
    else if (c === ']' || c === '}') depth--;
    else if (c === ch && depth === 0) return i;
  }
  return -1;
}

function indentOf(line) {
  let i = 0;
  while (i < line.length && line[i] === ' ') i++;
  return i;
}

// Tokenize: split into non-blank, non-comment lines with their indent levels.
function tokenize(text) {
  return text.split('\n')
    .map((line, i) => ({ raw: line, lineNum: i + 1 }))
    .filter((t) => t.raw.trim().length > 0 && !t.raw.trim().startsWith('#'))
    .map((t) => ({ ...t, indent: indentOf(t.raw), body: t.raw.trim() }));
}

// Recursive parse — given a list of tokens at a given indent level, parse a value.
function parseBlock(tokens, startIdx, indent) {
  if (startIdx >= tokens.length) return [null, startIdx];
  const first = tokens[startIdx];
  if (first.indent < indent) return [null, startIdx];

  // Sequence
  if (first.body.startsWith('- ')) {
    const arr = [];
    let i = startIdx;
    while (i < tokens.length && tokens[i].indent === indent && tokens[i].body.startsWith('- ')) {
      const itemBody = tokens[i].body.slice(2);
      // Two cases: "- key: val" (start of mapping) or "- scalar"
      const colonIdx = findTopLevelChar(itemBody, ':');
      if (colonIdx >= 0 && !itemBody.startsWith('{') && !itemBody.startsWith('[')) {
        // The "-" introduces a mapping. Fold the first key into the next-indent level.
        const syntheticTokens = [...tokens];
        const key = itemBody.slice(0, colonIdx).trim();
        const val = itemBody.slice(colonIdx + 1).trim();
        syntheticTokens[i] = { ...tokens[i], indent: indent + 2, body: `${key}: ${val}` };
        const [obj, nextIdx] = parseMapping(syntheticTokens, i, indent + 2);
        arr.push(obj);
        i = nextIdx;
      } else {
        // Scalar / inline value after "- "
        arr.push(parseScalar(itemBody));
        i++;
      }
    }
    return [arr, i];
  }

  // Mapping
  return parseMapping(tokens, startIdx, indent);
}

function parseMapping(tokens, startIdx, indent) {
  const obj = {};
  let i = startIdx;
  while (i < tokens.length && tokens[i].indent === indent && !tokens[i].body.startsWith('- ')) {
    const line = tokens[i].body;
    const colonIdx = findTopLevelChar(line, ':');
    if (colonIdx < 0) { i++; continue; }
    const key = line.slice(0, colonIdx).trim();
    const valStr = line.slice(colonIdx + 1).trim();
    if (valStr) {
      obj[key] = parseScalar(valStr);
      i++;
    } else {
      // Value is on subsequent indented lines
      const childIndent = i + 1 < tokens.length ? tokens[i + 1].indent : indent;
      if (childIndent > indent) {
        const [child, next] = parseBlock(tokens, i + 1, childIndent);
        obj[key] = child;
        i = next;
      } else {
        obj[key] = null;
        i++;
      }
    }
  }
  return [obj, i];
}

export function parseYaml(text) {
  const tokens = tokenize(text);
  if (tokens.length === 0) return [];
  const baseIndent = tokens[0].indent;
  const [result] = parseBlock(tokens, 0, baseIndent);
  return result;
}

// ---------------------------------------------------------------------------
// The silent-drop guard (v0.174.0).
//
// WHY THIS EXISTS: this parser is a deliberate subset — no multi-line scalars,
// no escape sequences. When it meets a construct it can't represent it does not
// throw; it stops early and returns what it has. Authoring `moment-unverified.yml`
// hit that twice, and both failures were INVISIBLE:
//
//   1. A `why:` value wrapped onto a second line dropped 6 of 7 cases while the
//      suite still printed "passed". A gate that quietly loses cases is worse
//      than no gate — it reports confidence it hasn't earned.
//   2. An inline `content: "---\nstatus: shipped\n---"` parsed to a LITERAL
//      backslash-n, so a `^status:` predicate never matched and the case failed
//      for a reason nothing reported. Multi-line file bodies belong in FIXTURES.
//
// The fix is not a bigger parser (that risks changing how 170+ existing cases
// parse). It's reconciling what the FILE declares against what came back — a
// check that catches any future silent drop regardless of which construct
// caused it.
export function reconcileCases(raw, parsed, name = 'eval file') {
  const problems = [];

  const declared = [...raw.matchAll(/^-\s+id:\s*(\S+)/gm)].map((m) => m[1]);
  const got = new Set((parsed || []).map((c) => c && c.id).filter(Boolean));
  const missing = declared.filter((id) => !got.has(id));
  if (missing.length) {
    problems.push(
      `${name}: ${missing.length} case(s) declared in the file but NOT parsed — ${missing.join(', ')}. `
      + 'Almost always a value wrapped onto a second line: this parser has no multi-line scalars, '
      + 'so it stops at the wrap and silently drops every case after it. Keep each value on one line.');
  }

  // A `\n` inside an inline double-quoted value becomes a literal backslash-n.
  for (const m of raw.matchAll(/^\s*-?\s*\{[^}]*\bcontent:\s*"[^"]*\\n[^"]*"/gm)) {
    problems.push(
      `${name}: inline \`content:\` contains a \\n escape, which this parser stores LITERALLY `
      + `(so predicates like \`^status:\` can never match): ${m[0].trim().slice(0, 80)}… `
      + 'Move multi-line file bodies into the FIXTURES registry in runner.js and reference them with `fixture:`.');
  }

  return problems;
}
