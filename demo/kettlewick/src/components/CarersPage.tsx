// The owner's Carers — one row per carer, alphabetical (DEC-003: no order but the alphabet).
import { useState } from 'react';
import { tokens } from '@/styles/tokens';
import { loadDay, saveDay } from '@/rota/day';
import { Rail } from '@/components/Rail';
import { CarerRow } from '@/components/CarerRow';
import { TextField } from '@/components/TextField';
import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';

const usually = (days: string[]) => days.map((d) => d[0].toUpperCase() + d.slice(1)).join(', ');

export function CarersPage() {
  const [day, setDay] = useState(loadDay);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const carers = [...day.rota.carers].sort((a, b) => a.firstName.localeCompare(b.firstName));

  function add() {
    const firstName = name.trim().split(' ')[0];
    const carer = { id: firstName.toLowerCase(), firstName, phone: phone.trim(), area: '', days: [] };
    const next = { ...day, rota: { ...day.rota, carers: [...day.rota.carers, carer] } };
    saveDay(next);
    setDay(next);
    setName('');
    setPhone('');
  }

  return (
    <div className="kw-shell">
      <Rail current="carers" />
      <main className="kw-main">
        <h1 style={{ fontFamily: tokens.font.display, fontSize: tokens.type.size.display, margin: `0 0 ${tokens.space[4]}` }}>Carers</h1>
        {carers.length
          ? <ul style={{ margin: 0, padding: 0 }}>{carers.map((c) => <CarerRow key={c.id} name={c.firstName} phone={c.phone} usually={usually(c.days)} />)}</ul>
          : <EmptyState>No carers yet. Add the first one below.</EmptyState>}
        <section aria-label="Add a carer" style={{ marginTop: tokens.space[6], display: 'grid', gap: tokens.space[3] }}>
          <TextField label="Name" value={name} onChange={setName} />
          <TextField label="Phone" value={phone} onChange={setPhone} placeholder="07700 900123" />
          <div><Button variant="primary" onAsk={add} disabled={!name.trim() || !phone.trim()}>Add carer</Button></div>
        </section>
      </main>
    </div>
  );
}
