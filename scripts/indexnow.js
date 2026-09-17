// Submit every sitemap URL to IndexNow (indexnow.org) — Bing, Yandex, Naver and Seznam share the
// endpoint. Proof of control is the key file gen-site.js publishes at the site root, so this only
// works against the LIVE site: upload first, then `npm run indexnow`. Google does not take IndexNow;
// for Google the sitemap in robots.txt and Search Console are the whole story.
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const key = readFileSync(join(ROOT, 'web', 'indexnow.key'), 'utf8').trim();
const sitemap = readFileSync(join(ROOT, 'site', 'sitemap.xml'), 'utf8');
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const host = new URL(urlList[0]).host;

const live = await fetch(`https://${host}/${key}.txt`).then((r) => (r.ok ? r.text() : '')).catch(() => '');
if (live.trim() !== key) {
  console.error(`  ✗ https://${host}/${key}.txt is not serving the key — upload the site first, then run this.`);
  process.exit(1);
}
const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host, key, keyLocation: `https://${host}/${key}.txt`, urlList }),
});
// 200 = accepted, 202 = accepted and the key will be checked later; anything else is a real refusal.
const ok = res.status === 200 || res.status === 202;
console.log(`  ${ok ? '✦' : '✗'} IndexNow: ${res.status} for ${urlList.length} URLs on ${host}${ok ? '' : ` — ${await res.text()}`}`);
process.exit(ok ? 0 : 1);
