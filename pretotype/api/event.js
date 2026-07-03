// BOSS pretotype — the Savoia ladder beacon (IDEA-047).
//
// Client-side ladder rungs (output-copied, install-link-clicked) POST here. We record
// ONLY the rung name — a plain counter event to stdout, which Vercel captures. No idea
// text, no IP stored by us, no fingerprint, no cookie. The point of the ladder is
// skin-in-the-game: did a real attempt happen (pasted a real idea), did the output land
// (copied), did intent to install form (clicked)? Counts, nothing more (Savoia's rule).

const ALLOWED = new Set(["pasted-real-idea", "output-copied", "install-link-clicked"]);

export default function handler(req, res) {
  if (req.method !== "POST") { res.status(405).end(); return; }
  let event = "";
  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
    event = String(body.event || "");
  } catch { /* ignore malformed beacons */ }

  if (ALLOWED.has(event)) {
    console.log(JSON.stringify({ event, ts: Date.now() }));
  }
  // 204: fire-and-forget; the browser used sendBeacon and isn't reading the response.
  res.status(204).end();
}
