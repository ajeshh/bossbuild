// RowSkeleton — see docs/design/components/RowSkeleton.md for when it applies. Tokens only; no raw values.
// The row's exact box, so nothing jumps when the day arrives. Hidden from the reader.
import { tokens } from '@/styles/tokens';

const bar = (width: string) => (
  <span style={{ width, height: tokens.space[3], borderRadius: tokens.radius.control, background: tokens.color.border.subtle }} />
);

export function RowSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }, (_, i) => (
        <li key={i} aria-hidden="true" className="kw-skeleton" style={{ display: 'flex', alignItems: 'center', gap: tokens.space[3], minHeight: tokens.target.min, padding: `${tokens.space[2]} 0`, borderBottom: `1px solid ${tokens.color.border.subtle}`, listStyle: 'none' }}>
          {bar(tokens.space[8])}
          {bar(`calc(${tokens.space[8]} * 2)`)}
          {bar(tokens.space[4])}
        </li>
      ))}
    </>
  );
}
