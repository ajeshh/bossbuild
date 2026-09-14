// The mark is read from web/boss-logo-mark.svg, never retyped (scripts/mark.js). These hold the
// reader to the file and the small cut to its job.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PARTS, AUTHORED, TIGHT_VIEWBOX, markSvg, faviconDataUri } from '../scripts/mark.js';

test('the mark is the five authored parts — three faces, two ribbons — classified by the file\'s own colours', () => {
  assert.equal(PARTS.length, 5);
  assert.deepEqual(PARTS.map((p) => p.role), ['face', 'face', 'face', 'bowl', 'bowl']);
  assert.match(AUTHORED.face, /^#[0-9A-F]{6}$/i); assert.match(AUTHORED.bowl, /^#[0-9A-F]{6}$/i);
  assert.match(TIGHT_VIEWBOX, /^\d+ \d+ \d+ \d+$/, 'the viewBox is cropped to the mark, not the file\'s margin');
});

test('the large cut is the file verbatim; the small cut insets every part so the seams widen', () => {
  const large = markSvg({ cut: 'large' });
  const small = markSvg({ cut: 'small' });
  assert.equal((large.match(/<path /g) || []).length, 5);
  assert.equal((large.match(/transform=/g) || []).length, 0);
  assert.equal((small.match(/transform="translate\([^)]+\) scale\(0\.86\) translate\([^)]+\)"/g) || []).length, 5, 'one inset per part, about its own centre');
  assert.ok(large.includes('fill="var(--color-mark-face)"') && large.includes('fill="var(--color-mark-bowl)"'), 'colours are the site\'s custom properties, not hexes');
});

test('the favicon is the small cut with literal colours and no raw # in the data URI', () => {
  const uri = faviconDataUri({ face: '#5089E0', bowl: '#FF5C34' });
  assert.ok(uri.startsWith('data:image/svg+xml,'));
  assert.ok(!uri.slice('data:image/svg+xml,'.length).includes('#'), '# is escaped as %23');
  assert.equal((uri.match(/scale\(0\.86\)/g) || []).length, 5);
});
