// What the model may see, and what it may say back (FEAT-007, DEC-005).
//
// The prompt carries four fields: the visit's day, its time (phrased here, "tomorrow at 9"), its area,
// and the first names of the carers being asked. Never a client's name, an address or a care note.
// toPromptFacts builds those four from an allow-list rather than deleting fields, so anything added to
// a visit later stays out of the prompt. A fifth field is a new DEC, not an edit here.

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MAX_TEXT = 300; // two text messages
const PRESSURE = ['stuck', 'sorry', 'urgent', 'desperate', 'asap', 'really need', 'last minute', 'let us down', 'let me down', 'favour'];
const REFUSAL = /^\s*(i can'?t|i cannot|i'?m not able|i am not able|i'?m unable|i am unable|as an ai)\b/i;

const dateOf = (day) => new Date(`${day}T12:00:00`);

// "tomorrow at 9", "today at 2:30", "Thursday at 8" — the carer's words, never "09:00" or a date.
export function phraseWhen(visit, now) {
  const [h, m] = visit.start.split(':').map(Number);
  const clock = `${h % 12 || 12}${m ? `:${String(m).padStart(2, '0')}` : ''}`;
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12);
  const days = Math.round((dateOf(visit.day) - today) / 86_400_000);
  const when = days === 0 ? 'today' : days === 1 ? 'tomorrow' : DAY_NAMES[dateOf(visit.day).getDay()];
  return `${when} at ${clock}`;
}

export function toPromptFacts(visit, carers, now) {
  return {
    day: DAY_NAMES[dateOf(visit.day).getDay()],
    time: phraseWhen(visit, now),
    area: visit.area,
    carers: carers.map((c) => c.firstName),
  };
}

// The tail code adds to every ask, drafted or not: the answer link and the owner's sign-off.
export const signOff = (link, owner) => `Yes or no here: ${link} — ${owner}`;

// The plain ask every carer got before FEAT-007, and the one sent whenever a draft can't be used.
export function templateAsks(facts, carers, linkFor, owner) {
  return carers.map((c) => ({
    carerId: c.id,
    carer: c.firstName,
    text: `${c.firstName}, can you take a visit ${facts.time} in ${facts.area}? ${signOff(linkFor(c.id), owner)}`,
  }));
}

const words = (text) => text.split(/\s+/).filter(Boolean);
const bare = (w) => w.replace(/['’]s\b/g, '').replace(/[^\p{L}]/gu, '');
const names = (text) => words(text).map(bare);

// Read the model's reply. Returns { ok, asks } or { ok: false, kind, reason }, where kind picks the
// handler: 'garbage' (retried once), 'refusal', or 'hallucination' (a made-up detail, another carer,
// pressure — discarded, no retry).
export function checkDraft(reply, facts) {
  const raw = (reply ?? '').trim();
  if (REFUSAL.test(raw)) return { ok: false, kind: 'refusal', reason: 'refusal' };
  let asks;
  try { asks = JSON.parse(raw.replace(/^```(json)?|```$/g, '')).asks; } catch { return { ok: false, kind: 'garbage', reason: 'not-json' }; }
  if (!Array.isArray(asks) || asks.some((a) => typeof a?.carer !== 'string' || typeof a?.text !== 'string')) {
    return { ok: false, kind: 'garbage', reason: 'schema' };
  }
  const given = facts.carers;
  if (asks.length !== given.length || !given.every((n) => asks.some((a) => a.carer === n))) {
    return { ok: false, kind: 'garbage', reason: 'count' };
  }

  const timeNumbers = facts.time.match(/\d+/g) ?? [];
  const allowed = new Set([...names(facts.area), ...DAY_NAMES, 'I']);
  for (const { carer, text } of asks) {
    const t = text.trim();
    if (!t) return { ok: false, kind: 'garbage', reason: 'empty' };
    if (t.length > MAX_TEXT) return { ok: false, kind: 'garbage', reason: 'too-long' };
    if (REFUSAL.test(t)) return { ok: false, kind: 'refusal', reason: 'refusal' };
    const said = names(t);
    if (!said.includes(carer)) return { ok: false, kind: 'hallucination', reason: 'own-name-missing' };
    if (given.some((n) => n !== carer && said.includes(n))) return { ok: false, kind: 'hallucination', reason: 'other-carer' };
    if ((t.match(/\d+/g) ?? []).some((n) => !timeNumbers.includes(n))) return { ok: false, kind: 'hallucination', reason: 'number' };
    const ws = words(t);
    const stranger = ws.find((w, i) => {
      const n = bare(w);
      const sentenceStart = i === 0 || /[.!?:]$/.test(ws[i - 1]);
      return /^\p{Lu}/u.test(n) && !sentenceStart && n !== carer && !allowed.has(n);
    });
    if (stranger) return { ok: false, kind: 'hallucination', reason: 'name' };
    if (PRESSURE.some((p) => t.toLowerCase().includes(p))) return { ok: false, kind: 'hallucination', reason: 'pressure' };
  }
  return { ok: true, asks };
}
