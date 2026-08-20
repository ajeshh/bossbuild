// Minimal YAML parser for the BOSS loop-runtime — zero deps.
// Covers the subset used by loop specs and eval files:
//   - top-level sequence (- item) or mapping
//   - block mappings (key: value with indented children)
//   - inline mappings ({k: v, k2: v2})
//   - inline sequences ([a, b, c])
//   - scalars: bare string, quoted string, int, true/false, null
//   - comments (# ...) and blank lines
// NOT supported: anchors, aliases, multi-line scalars, flow-style mixing.
// Lifted from BOSS's own conscience-eval runner so the same parser
// is available to the project-side hook.

export function parseYaml(text) {
  const tokens = tokenize(text);
  if (tokens.length === 0) return null;
  const baseIndent = tokens[0].indent;
  const [result] = parseBlock(tokens, 0, baseIndent);
  return result;
}

// Extract YAML frontmatter from a markdown file (between leading `---` and `---`).
// Returns the parsed object, or null if no frontmatter is present.
export function parseFrontmatter(text) {
  if (!text.startsWith('---\n')) return null;
  const end = text.indexOf('\n---\n', 4);
  if (end < 0) return null;
  return parseYaml(text.slice(4, end));
}

function parseScalar(s) {
  s = s.trim();
  if (s === '' || s === '~' || s === 'null') return null;
  if (s === 'true') return true;
  if (s === 'false') return false;
  if (/^-?\d+$/.test(s)) return parseInt(s, 10);
  if (/^-?\d+\.\d+$/.test(s)) return parseFloat(s);
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    return s.slice(1, -1);
  }
  if (s.startsWith('[') && s.endsWith(']')) {
    const inner = s.slice(1, -1).trim();
    if (!inner) return [];
    return splitTopLevel(inner, ',').map((p) => parseScalar(p));
  }
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
  return s;
}

function splitTopLevel(s, sep) {
  const parts = [];
  let depth = 0;
  let inQuote = null;
  let start = 0;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (inQuote) { if (c === inQuote) inQuote = null; continue; }
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

function findTopLevelChar(s, ch) {
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

function tokenize(text) {
  return text.split('\n')
    .map((line, i) => ({ raw: line, lineNum: i + 1 }))
    .filter((t) => t.raw.trim().length > 0 && !t.raw.trim().startsWith('#'))
    .map((t) => ({ ...t, indent: indentOf(t.raw), body: t.raw.trim() }));
}

function parseBlock(tokens, startIdx, indent) {
  if (startIdx >= tokens.length) return [null, startIdx];
  const first = tokens[startIdx];
  if (first.indent < indent) return [null, startIdx];

  if (first.body.startsWith('- ')) {
    const arr = [];
    let i = startIdx;
    while (i < tokens.length && tokens[i].indent === indent && tokens[i].body.startsWith('- ')) {
      const itemBody = tokens[i].body.slice(2);
      const colonIdx = findTopLevelChar(itemBody, ':');
      if (colonIdx >= 0 && !itemBody.startsWith('{') && !itemBody.startsWith('[')) {
        const syntheticTokens = [...tokens];
        const key = itemBody.slice(0, colonIdx).trim();
        const val = itemBody.slice(colonIdx + 1).trim();
        syntheticTokens[i] = { ...tokens[i], indent: indent + 2, body: `${key}: ${val}` };
        const [obj, nextIdx] = parseMapping(syntheticTokens, i, indent + 2);
        arr.push(obj);
        i = nextIdx;
      } else {
        arr.push(parseScalar(itemBody));
        i++;
      }
    }
    return [arr, i];
  }

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
