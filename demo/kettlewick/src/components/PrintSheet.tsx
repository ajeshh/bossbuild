// PrintSheet — see docs/design/components/PrintSheet.md for when it applies. Tokens only; no raw values.
// The printed Monday: one colour, the three shapes, time order, "ring" and "cover by" at equal weight.
import { tokens } from '@/styles/tokens';
import { StatusChip, type VisitState } from '@/components/StatusChip';

export function PrintSheet({ day, visits }: {
  day: string;
  visits: { id: string; time: string; client: string; state: VisitState; carer?: string }[];
}) {
  const cell = { padding: `${tokens.space[1]} ${tokens.space[2]}`, borderBottom: `1px solid ${tokens.color.gray[900]}`, textAlign: 'left' as const };
  return (
    <section style={{ color: tokens.color.gray[900], fontFamily: tokens.font.body }}>
      <h1 style={{ fontFamily: tokens.font.display, fontSize: tokens.type.size.heading }}>{day}</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>{['Time', 'Client', 'State', 'Carer', 'Ring', 'Cover by'].map((h) => <th key={h} style={cell}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {[...visits].sort((a, b) => a.time.localeCompare(b.time)).map((v) => (
            <tr key={v.id}>
              <td style={{ ...cell, fontFamily: tokens.font.mono }}>{v.time}</td>
              <td style={cell}>{v.client}</td>
              <td style={cell}><StatusChip variant={v.state} showLabel ink /></td>
              <td style={cell}>{v.carer ?? ''}</td>
              <td style={cell} />
              <td style={cell} />
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
