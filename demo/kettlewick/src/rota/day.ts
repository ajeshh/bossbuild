// The day the owner is working: the rota and the open covers. Kept in the browser; the schedule
// stays the owner's spreadsheet (DEC-002), and this is only what was pasted from it.
import { rota as sample } from '@/rota/sample.js';

export type Carer = { id: string; firstName: string; phone: string; area: string; days: string[] };
// What the import keeps (PRIVACY.md): the client's first name, the day, the time, the area.
export type Visit = {
  id: string; day: string; start: string; end: string; area: string;
  client: string; carerId: string | null; offCarerId: string | null;
};
export type Rota = { carers: Carer[]; visits: Visit[] };
export type Cover = {
  visitId: string; status: 'asked' | 'held' | 'covered'; asked: string[]; declined: string[]; heldBy: string | null;
  drafted: boolean; edited: boolean; // FEAT-007: the text came from the model; the owner changed it
};
export type Day = { rota: Rota; covers: Record<string, Cover> };

const KEY = 'kettlewick.day';

export function loadDay(): Day {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved) return JSON.parse(saved);
  } catch { /* a bad save falls back to the sample day */ }
  return { rota: sample as Rota, covers: {} };
}

export function saveDay(day: Day) {
  localStorage.setItem(KEY, JSON.stringify(day));
}

// "09:00" → "9 o'clock", "09:30" → "9:30" — the owner's words (STYLE_GUIDE tone table).
export function spoken(time: string) {
  const [h, m] = time.split(':').map(Number);
  return m ? `${h}:${String(m).padStart(2, '0')}` : `${h} o'clock`;
}
