// The proof strip's three pages and the files gen-proof.js makes for each — one list, read by the
// renderer (to write them) and by gen-site.js (to copy them), so neither can name a file the other
// does not know. Kept apart from gen-proof.js because importing that file runs the render.
export const PROOF_PAGES = ['playbook', 'design', 'board'];
export const PROOF_ASSETS = PROOF_PAGES.flatMap((p) => [`proof-${p}.png`, `proof-${p}.webp`, `proof-${p}-320.webp`]);
