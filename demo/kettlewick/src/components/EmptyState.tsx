// EmptyState — see docs/design/components/EmptyState.md for when it applies. Tokens only; no raw values.
import type { ReactNode } from 'react';
import { tokens } from '@/styles/tokens';

export function EmptyState({ children }: { children: ReactNode }) {
  return (
    <p style={{ margin: 0, padding: `${tokens.space[8]} ${tokens.space[4]}`, textAlign: 'center', color: tokens.color.text.muted }}>
      {children}
    </p>
  );
}
