// TextField — see docs/design/components/TextField.md for when it applies. Tokens only; no raw values.
// The label stays; the placeholder is an example; the error names the fix.
import { useId } from 'react';
import { tokens } from '@/styles/tokens';

export function TextField({ label, variant = 'single', value, onChange, placeholder, error, disabled, rows = 6 }: {
  label: string;
  variant?: 'single' | 'multiline';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  rows?: number;
}) {
  const id = useId();
  const field = {
    id,
    value,
    placeholder,
    disabled,
    'aria-invalid': Boolean(error) || undefined,
    'aria-describedby': error ? `${id}-error` : undefined,
    style: {
      width: '100%',
      boxSizing: 'border-box' as const,
      minHeight: tokens.target.min,
      padding: tokens.space[2],
      border: `1px solid ${error ? tokens.color.signal.uncovered : tokens.color.border.default}`,
      borderRadius: tokens.radius.control,
      background: tokens.color.surface.paper,
      color: tokens.color.text.body,
      fontFamily: tokens.font.body,
      fontSize: tokens.type.size.body,
    },
  };
  return (
    <div style={{ display: 'grid', gap: tokens.space[1], maxWidth: `calc(${tokens.breakpoint.phone} * 0.75)` }}>
      <label htmlFor={id} style={{ fontSize: tokens.type.size.small, fontWeight: 600 }}>{label}</label>
      {variant === 'multiline'
        ? <textarea {...field} rows={rows} onChange={(e) => onChange(e.target.value)} />
        : <input {...field} onChange={(e) => onChange(e.target.value)} />}
      {error && <p id={`${id}-error`} role="alert" style={{ margin: 0, color: tokens.color.signal.uncovered, fontSize: tokens.type.size.small }}>{error}</p>}
    </div>
  );
}
