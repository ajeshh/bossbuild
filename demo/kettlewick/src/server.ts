// The server: the built app from dist/, and the one route that needs a secret (drafting the ask).
// Node runs this file directly (type stripping), so there is no server build step.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { draftAsk } from './ask/draft.ts';

const PORT = Number(process.env.PORT ?? 8080);
const DIST = join(process.cwd(), 'dist');
const TYPES: Record<string, string> = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png',
};

async function body(req: import('node:http').IncomingMessage) {
  let raw = '';
  for await (const chunk of req) raw += chunk;
  return JSON.parse(raw || '{}');
}

createServer(async (req, res) => {
  try {
    if (req.method === 'GET' && req.url === '/healthz') return res.end('ok');
    if (req.method === 'POST' && req.url === '/api/ask/draft') {
      const { visit, carers, agencyId, owner } = await body(req);
      const baseUrl = `${req.headers['x-forwarded-proto'] ?? 'http'}://${req.headers.host}`;
      res.setHeader('content-type', 'application/json');
      return res.end(JSON.stringify(await draftAsk(visit, carers, { agencyId, owner, baseUrl })));
    }
    const path = normalize(req.url === '/' ? '/index.html' : (req.url ?? '/').split('?')[0]);
    const file = await readFile(join(DIST, path)).catch(() => readFile(join(DIST, 'index.html')));
    res.setHeader('content-type', TYPES[extname(path)] ?? 'text/html');
    res.end(file);
  } catch {
    res.statusCode = 500;
    res.end();
  }
}).listen(PORT, () => console.log(`kettlewick on :${PORT}`));
