// BOSS pretotype — the one serverless call (IDEA-047).
//
// Takes an idea string, calls Claude ONCE with the Humane-Product-Canvas spine +
// one conscience-style question in BOSS's voice, returns the text. This is the whole
// backend. It is deliberately NOT inside src/ (the zero-dep rule is src/-only); this
// tiny web surface may take a dependency.
//
// SECURITY (the /ship pre-flight applied to BOSS itself):
//   - The API key lives ONLY in the server env (never shipped to the browser).
//   - Hard input length cap; reject empty. No user data stored, no IPs logged by us.
//   - Cheapest honest model (this is a demand-measurement volume surface, not a
//     judgment surface — IDEA-047 + the campaign's "volumes on the cheap model" rule).
//   - Hard monthly spend cap is enforced at the platform level (Vercel spend limit) —
//     see EXPERIMENT.md. This function also caps max_tokens per request.

import Anthropic from "@anthropic-ai/sdk";

// The cheapest current model per the /claude-api skill's live table ($1/$5 per M).
// A pressure-test is one short call; the whole point is to keep the volume surface cheap.
const MODEL = "claude-haiku-4-5";
const MAX_IDEA_CHARS = 2000;
const MAX_TOKENS = 600;

// BOSS's voice, distilled: the seasoned hand who's built many things and doesn't need
// the credit; assume intelligence, never assume knowledge; humor over performed warmth.
// A conscience makes a cost visible; it never makes the choice. (conscience-voicing.md)
const SYSTEM = `You are BOSS — a build tool with a conscience, voiced as a seasoned founder
who has built many things and doesn't need the credit. Someone just pasted a raw idea.
Give them a 60-second pressure-test using the Humane Product Canvas spine. Be brief, specific,
and warm without performing warmth. Assume intelligence; never explain the obvious.

Return exactly these four short parts, plainly labelled, no preamble:

1. WHO IT'S FOR — the specific person, not "users." If the idea is vague about this, say so.
2. THE REAL TENSION — the painful problem underneath, in one line. Name it, don't flatter it.
3. THE RISKIEST ASSUMPTION — the one belief that, if wrong, sinks the whole thing. Be blunt.
4. THE ONE QUESTION — a single conscience-style question in your own voice that a seasoned
   hand would ask before they'd let this person write a line of code. It should point at
   evidence, not encouragement. Often the honest answer is "go talk to one real person first."

Hard rules: no pitch, no feature list, no roadmap, no "great idea!" No more than ~140 words total.
Never tell them what to build — surface the cost of being wrong and hand the decision back.
End on their agency. If the idea is empty or nonsense, say so kindly in one line and stop.`;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Use POST." });
    return;
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    // Fail honestly rather than pretend — the operator forgot to set the key.
    res.status(500).json({ error: "Not configured yet. (Server is missing its API key.)" });
    return;
  }

  let idea = "";
  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
    idea = String(body.idea || "").trim();
  } catch {
    res.status(400).json({ error: "Couldn't read that." });
    return;
  }

  if (idea.length < 12) { res.status(400).json({ error: "Give it a sentence or two." }); return; }
  if (idea.length > MAX_IDEA_CHARS) idea = idea.slice(0, MAX_IDEA_CHARS);

  try {
    const client = new Anthropic(); // reads ANTHROPIC_API_KEY from env
    const msg = await client.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: SYSTEM,
      messages: [{ role: "user", content: idea }],
    });
    const text = (msg.content || [])
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("\n")
      .trim();
    if (!text) throw new Error("empty response");

    // Savoia ladder — server half. A real idea reached the model. Facts to stdout only
    // (Vercel captures logs); no user data, no idea text, no IP stored by us.
    console.log(JSON.stringify({ event: "pressure-test-served", len: idea.length, ts: Date.now() }));

    res.status(200).json({ text });
  } catch (e) {
    console.error("[pressure-test]", e && e.message ? e.message : e);
    res.status(502).json({ error: "The seasoned hand is thinking too hard. Try again in a moment." });
  }
}
