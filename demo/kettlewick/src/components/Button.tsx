// Button — see docs/design/components/Button.md for when it applies. Tokens only; no raw values.
import type { ReactNode } from 'react';
import { tokens } from '@/styles/tokens';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

const look: Record<ButtonVariant, { background: string; color: string; border: string }> = {
  primary: { background: tokens.color.action.primary, color: tokens.color.text['on-primary'], border: tokens.color.action.primary },
  secondary: { background: tokens.color.surface.paper, color: tokens.color.text.body, border: tokens.color.border.default },
  ghost: { background: 'transparent', color: tokens.color.action.primary, border: 'transparent' },
  danger: { background: tokens.color.action.danger, color: tokens.color.text['on-danger'], border: tokens.color.action.danger },
};

export function Button({ variant = 'primary', disabled, loading, loadingLabel, onAsk, children }: {
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  loadingLabel?: string; // the participle — "Asking…"
  onAsk?: () => void;
  children: ReactNode;
}) {
  const l = look[variant];
  return (
    <button
      type="button"
      className={`kw-button kw-button--${variant}`}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      onClick={onAsk}
      style={{
        minHeight: tokens.target.min,
        padding: `0 ${tokens.space[4]}`,
        borderRadius: tokens.radius.control,
        border: `1px solid ${l.border}`,
        background: l.background,
        color: l.color,
        fontFamily: tokens.font.body,
        fontSize: tokens.type.size.body,
        fontWeight: 600,
        cursor: disabled || loading ? 'default' : 'pointer',
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {loading && loadingLabel ? loadingLabel : children}
    </button>
  );
}
