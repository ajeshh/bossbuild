// The carer's whole product: one card. Opened from the link in the ask's text: #/ask/<visit>/<carer>.
import { useState } from 'react';
import { tokens } from '@/styles/tokens';
import { answer, inQuietHours } from '@/rota/cover.js';
import { loadDay, saveDay } from '@/rota/day';
import { AskCard } from '@/components/AskCard';
import { EmptyState } from '@/components/EmptyState';

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function AskPage({ visitId, carerId }: { visitId: string; carerId: string }) {
  const [day, setDay] = useState(loadDay);
  const visit = day.rota.visits.find((v) => v.id === visitId);
  const cover = day.covers[visitId];

  // A carer sees only their own ask — never anyone else's schedule (FEAT-001's negative path).
  if (!visit || !cover?.asked.includes(carerId)) {
    return <main style={{ padding: tokens.space[4] }}><EmptyState>No asks. Enjoy the gap.</EmptyState></main>;
  }

  const reply = (yes: boolean) => {
    const next = { ...day, covers: { ...day.covers, [visitId]: answer(cover, carerId, yes).cover } };
    saveDay(next);
    setDay(next);
  };
  const coveredBy = cover.heldBy ? day.rota.carers.find((c) => c.id === cover.heldBy)?.firstName : undefined;
  if (cover.declined.includes(carerId) && !coveredBy) {
    return <main style={{ padding: tokens.space[4] }}><EmptyState>No asks. Enjoy the gap.</EmptyState></main>;
  }

  return (
    <main style={{ padding: tokens.space[4], maxWidth: tokens.breakpoint.phone, margin: '0 auto' }}>
      <AskCard
        time={visit.start}
        day={DAY_NAMES[new Date(`${visit.day}T12:00:00`).getDay()]}
        client={visit.client}
        from="Marta"
        coveredBy={coveredBy}
        disabled={inQuietHours(new Date())}
        onAsk={() => reply(true)}
        onDecline={() => reply(false)}
      />
    </main>
  );
}
