// Rail — see docs/design/components/Rail.md for when it applies. Tokens only; no raw values.
// The three places. A rail on the laptop, a bottom bar on the phone (app.css); never a fourth.
import { tokens } from '@/styles/tokens';

export type Place = 'today' | 'carers' | 'settings';

const PLACES: { id: Place; label: string }[] = [
  { id: 'today', label: 'Today' },
  { id: 'carers', label: 'Carers' },
  { id: 'settings', label: 'Settings' },
];

export function Rail({ current }: { current: Place }) {
  return (
    <nav aria-label="Kettlewick" className="kw-rail" style={{ background: tokens.color.surface.paper, borderRight: `1px solid ${tokens.color.border.subtle}` }}>
      <ul style={{ display: 'flex', flexDirection: 'column', margin: 0, padding: tokens.space[2], listStyle: 'none' }}>
        {PLACES.map((p) => (
          <li key={p.id}>
            <a
              href={`#/${p.id}`}
              aria-current={p.id === current ? 'page' : undefined}
              style={{
                display: 'flex',
                alignItems: 'center',
                minHeight: tokens.target.min,
                padding: `0 ${tokens.space[3]}`,
                color: tokens.color.text.body,
                fontWeight: p.id === current ? 700 : 400,
                textDecoration: 'none',
              }}
            >
              {p.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
