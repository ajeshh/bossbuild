// Minimal YAML parser for the BOSS loop-runtime — zero deps.
// Covers the subset used by loop specs and eval files:
//   - top-level sequence (- item) or mapping
//   - block mappings (key: value with indented children)
//   - inline mappings ({k: v, k2: v2})
//   - inline sequences ([a, b, c])
//   - scalars: bare string, quoted string, int, true/false, null
//   - comments (# ...) and blank lines
//   - multi-line scalars: block (`>` folds, `|` keeps), a plain value wrapped onto deeper lines,
//     and a quoted value that runs past its line
// NOT supported: anchors, aliases, flow-style mixing, explicit indentation indicators (`>2`).
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
  // CRLF-tolerant: a Windows editor, or a cofounder's autocrlf clone, hands us `---\r\n`. The
  // first Windows CI run parsed ZERO loop specs for exactly this reason (IDEA-095).
  text = String(text).replace(/\r\n?/g, '\n');
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

// A multi-line value used to end the mapping it sat in: its continuation lines are indented deeper
// than the key, and `parseMapping` stops at the first line whose indent differs — so every key
// AFTER a folded `gist: >` or a wrapped `proof_note:` was silently dropped. Measured 2026-09-23:
// 102 keys across 42 of 537 docs, read by `boss status`, the hook and two gates (IDEA-121).
// So multi-line values are folded into ONE token here, with the value already parsed, and the
// block/mapping logic below never sees their continuation lines. Mirrors `src/frontmatter.js`,
// which is the CLI's reader; `test/yaml-parity.test.js` holds the two together.
const BLOCK_HEAD = /^(-\s+)?([^:#\s][^:]*):\s*([>|])[-+]?\s*$/;
const PLAIN_HEAD = /^(-\s+)?([^:#\s][^:]*):\s+(\S.*)$/;

function tokenize(text) {
  const lines = text.split(/\r?\n/);
  const out = [];
  for (let n = 0; n < lines.length; n++) {
    const raw = lines[n];
    const body = raw.trim();
    if (!body || body.startsWith('#')) continue;
    const indent = indentOf(raw);
    const deeperAhead = (m, dash) => {
      // Continuation = blank lines and lines indented past the KEY, stopping at the first that isn't.
      // Past the key, not the line: in `- id: x` the key sits after the dash, and the item's
      // sibling keys sit at exactly that column — measuring from the dash swallowed the whole item.
      const keyCol = indent + (dash ? dash.length : 0);
      const rows = [];
      let k = m;
      while (k + 1 < lines.length && (lines[k + 1].trim() === '' || indentOf(lines[k + 1]) > keyCol)) rows.push(lines[++k]);
      while (rows.length && rows[rows.length - 1].trim() === '') { rows.pop(); k--; }
      return [rows, k];
    };

    const block = BLOCK_HEAD.exec(body);
    if (block) {
      const [rows, k] = deeperAhead(n, block[1]);
      const margin = Math.min(...rows.filter((l) => l.trim()).map(indentOf), Infinity);
      const cut = rows.map((l) => (l.trim() ? l.slice(Number.isFinite(margin) ? margin : 0) : ''));
      const value = block[3] === '|'
        ? cut.join('\n').trim()
        : cut.reduce((acc, row) => (row === '' ? acc + '\n' : acc + (acc === '' || acc.endsWith('\n') ? '' : ' ') + row.trim()), '').trim();
      out.push({ raw, lineNum: n + 1, indent, body: `${block[1] || ''}${block[2].trim()}:`, value });
      n = k;
      continue;
    }

    const plain = PLAIN_HEAD.exec(body);
    if (plain) {
      const v = plain[3];
      const q = v[0];
      const openQuote = (q === '"' || q === "'") && !(v.length > 1 && v.endsWith(q));
      const flow = q === '[' || q === '{';
      const [rows, k] = deeperAhead(n, plain[1]);
      // A deeper line after a key WITH a value can only be a continuation (YAML has no other
      // reading), unless the value is a flow collection, which this parser keeps on one line.
      if (rows.length && !flow && (openQuote || !/^['"]/.test(v))) {
        const joined = [v, ...rows.map((l) => l.trim())].reduce((acc, row) => (row === '' ? acc + '\n' : acc + (acc === '' || acc.endsWith('\n') ? '' : ' ') + row), '').trim();
        out.push({ raw, lineNum: n + 1, indent, body: `${plain[1] || ''}${plain[2].trim()}:`, value: parseScalar(joined) });
        n = k;
        continue;
      }
    }

    out.push({ raw, lineNum: n + 1, indent, body });
  }
  return out;
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
    if ('value' in tokens[i]) {
      obj[key] = tokens[i].value;
      i++;
    } else if (valStr) {
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
