// Toast — see docs/design/components/Toast.md for when it applies. Tokens only; no raw values.
// Said once and gone: success leaves after 4s (paused on hover); an error stays until dismissed.
import { useEffect, useState, type ReactNode } from 'react';
import { tokens } from '@/styles/tokens';
import { Button } from '@/components/Button';

const SHOWN_MS = 4000;

export function Toast({ variant = 'success', children, onUndo, onDismiss }: {
  variant?: 'success' | 'error';
  children: ReactNode;
  onUndo?: () => void; // only when the act is reversible
  onDismiss: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (variant === 'error' || hovered) return;
    const t = setTimeout(onDismiss, SHOWN_MS);
    return () => clearTimeout(t);
  }, [variant, hovered, onDismiss]);

  return (
    <div
      role="status"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'fixed',
        left: tokens.space[4],
        bottom: `calc(${tokens.target.min} + ${tokens.space[4]})`,
        zIndex: tokens['z-index'].toast,
        display: 'flex',
        alignItems: 'center',
        gap: tokens.space[3],
        padding: `${tokens.space[2]} ${tokens.space[4]}`,
        background: tokens.color.surface.raised,
        boxShadow: tokens.shadow.raised,
        borderRadius: tokens.radius.surface,
        borderLeft: `${tokens.space[1]} solid ${variant === 'error' ? tokens.color.signal.uncovered : tokens.color.signal.covered}`,
      }}
    >
      <span>{children}</span>
      {onUndo && <Button variant="ghost" onAsk={onUndo}>Undo</Button>}
      {variant === 'error' && <Button variant="ghost" onAsk={onDismiss}>Close</Button>}
    </div>
  );
}
