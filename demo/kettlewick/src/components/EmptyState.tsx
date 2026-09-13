// EmptyState — see docs/design/components/EmptyState.md for when it applies. Tokens only; no raw values.
import { tokens } from '@/styles/tokens';

export function EmptyState(props: { variant?: string; disabled?: boolean; loading?: boolean; onAsk?: () => void; children?: unknown }) {
  return null; // the showcase carries the component's shape, not its implementation
}
