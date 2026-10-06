// StatusChip — see docs/design/components/StatusChip.md for when it applies. Tokens only; no raw values.
// The shape carries the state; colour is the second channel and the name the third.
import { tokens } from '@/styles/tokens';

export type VisitState = 'uncovered' | 'asked' | 'covered';

const colour: Record<VisitState, string> = {
  uncovered: tokens.color.signal.uncovered,
  asked: tokens.color.signal.asked,
  covered: tokens.color.signal.covered,
};

function Shape({ variant }: { variant: VisitState }) {
  if (variant === 'covered') return <circle cx="8" cy="8" r="7" fill="currentColor" />;
  return (
    <>
      <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeWidth="2" />
      {variant === 'asked' && <path d="M8 2 A6 6 0 0 0 8 14 Z" fill="currentColor" />}
    </>
  );
}

export function StatusChip({ variant, size = 'row', showLabel = false, ink = false }: {
  variant: VisitState;
  ink?: boolean; // one colour, for the printed Monday: the shape alone carries the state
  size?: 'row' | 'card';
  showLabel?: boolean; // the word beside the shape on the laptop; the shape alone on the phone row
}) {
  const side = size === 'card' ? `calc(${tokens.space[4]} + ${tokens.space[1]})` : tokens.space[4];
  return (
    <span
      className="kw-chip"
      style={{ display: 'inline-flex', alignItems: 'center', gap: tokens.space[1], color: ink ? 'inherit' : colour[variant], fontSize: tokens.type.size.small }}
    >
      <svg viewBox="0 0 16 16" role="img" aria-label={variant} style={{ width: side, height: side }}>
        <Shape variant={variant} />
      </svg>
      {showLabel && <span aria-hidden="true">{variant}</span>}
    </span>
  );
}
