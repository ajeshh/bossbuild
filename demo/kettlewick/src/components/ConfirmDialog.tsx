// ConfirmDialog — see docs/design/components/ConfirmDialog.md for when it applies. Tokens only; no raw values.
// The title is the consequence; the danger button repeats it; the way out is "Keep it".
import { useEffect, useId, useRef } from 'react';
import { tokens } from '@/styles/tokens';
import { Button } from '@/components/Button';

export function ConfirmDialog({ title, confirmLabel, loading, onAsk, onKeep }: {
  title: string;
  confirmLabel: string;
  loading?: boolean;
  onAsk: () => void; // the destructive act
  onKeep: () => void;
}) {
  const titleId = useId();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const back = document.activeElement as HTMLElement | null;
    ref.current?.querySelector<HTMLElement>('button')?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onKeep();
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      back?.focus();
    };
  }, [onKeep]);

  return (
    <div style={{ position: 'fixed', inset: 0, display: 'grid', placeItems: 'center', zIndex: tokens['z-index'].overlay }}>
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        style={{
          width: `min(100%, calc(${tokens.breakpoint.phone} * 0.75))`,
          background: tokens.color.surface.raised,
          boxShadow: tokens.shadow.raised,
          borderRadius: tokens.radius.surface,
          padding: tokens.space[6],
        }}
      >
        <h2 id={titleId} style={{ margin: `0 0 ${tokens.space[6]}`, fontFamily: tokens.font.display, fontSize: tokens.type.size.heading }}>
          {title}
        </h2>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: tokens.space[2] }}>
          <Button variant="secondary" onAsk={onKeep}>Keep it</Button>
          <Button variant="danger" onAsk={onAsk} loading={loading} loadingLabel="Doing it…">{confirmLabel}</Button>
        </div>
      </div>
    </div>
  );
}
