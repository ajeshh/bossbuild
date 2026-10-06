// Paste the day; check it (PAT-8). Every line shows as read, or as couldn't-read; none is dropped.
// Four columns are kept: time, the client's first name, area, carer. An address or notes column in
// the owner's sheet is skipped, never stored (PRIVACY.md, DEC-005).
import { useState } from 'react';
import { tokens } from '@/styles/tokens';
import { loadDay, saveDay } from '@/rota/day';
import { Rail } from '@/components/Rail';
import { TextField } from '@/components/TextField';
import { ImportRow, type ParsedLine } from '@/components/ImportRow';
import { Button } from '@/components/Button';
import { Toast } from '@/components/Toast';

const KEPT = ['time', 'client', 'area', 'carer'] as const;
const TIME = /^(\d{1,2})[:.](\d{2})$/;

export function parseSheet(text: string): ParsedLine[] {
  const rows = text.split('\n').filter((l) => l.trim()).map((l) => l.split(/[,\t]/).map((c) => c.trim()));
  const head = rows[0]?.map((c) => c.toLowerCase());
  const hasHeader = head?.includes('time');
  const at = Object.fromEntries(KEPT.map((k, i) => [k, hasHeader ? head.indexOf(k) : i]));
  return rows.slice(hasHeader ? 1 : 0).map((cells) => {
    const m = cells[at.time]?.match(TIME);
    const client = cells[at.client]?.split(' ')[0];
    if (!m || !client) return { variant: 'couldnt-read', raw: cells.join(', ') };
    return {
      variant: 'read',
      time: `${m[1].padStart(2, '0')}:${m[2]}`,
      client,
      area: cells[at.area] ?? '',
      carer: cells[at.carer] || null,
    };
  });
}

const plus45 = (time: string) => {
  const [h, m] = time.split(':').map(Number);
  const end = h * 60 + m + 45;
  return `${String(Math.floor(end / 60)).padStart(2, '0')}:${String(end % 60).padStart(2, '0')}`;
};

export function ImportPage() {
  const [text, setText] = useState('');
  const [done, setDone] = useState(false);
  const lines = parseSheet(text);
  const read = lines.filter((l) => l.variant === 'read');

  function importDay() {
    const day = loadDay();
    const today = new Date().toISOString().slice(0, 10);
    const byName = (n: string | null) => day.rota.carers.find((c) => c.firstName.toLowerCase() === n?.toLowerCase())?.id ?? null;
    const visits = read.map((l, i) => ({
      id: `v-${i}`, day: today, start: l.time, end: plus45(l.time), area: l.area, client: l.client,
      carerId: byName(l.carer), offCarerId: null,
    }));
    saveDay({ rota: { ...day.rota, visits }, covers: {} });
    setDone(true);
  }

  return (
    <div className="kw-shell">
      <Rail current="today" />
      <main className="kw-main" style={{ display: 'grid', gap: tokens.space[4] }}>
        <h1 style={{ fontFamily: tokens.font.display, fontSize: tokens.type.size.display, margin: 0 }}>Paste your day</h1>
        <TextField label="Your sheet" variant="multiline" value={text} onChange={setText} placeholder="09:00, Maureen, Church End, Priya" />
        {lines.length > 0 && <ul style={{ margin: 0, padding: 0 }}>{lines.map((l, i) => <ImportRow key={i} line={l} />)}</ul>}
        <div><Button variant="primary" onAsk={importDay} disabled={!read.length}>Use this day</Button></div>
      </main>
      {done && <Toast onDismiss={() => setDone(false)}>{`${read.length} visits in. Today is ready.`}</Toast>}
    </div>
  );
}
