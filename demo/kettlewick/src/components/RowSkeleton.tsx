// RowSkeleton — see docs/design/components/RowSkeleton.md for when it applies. Tokens only; no raw values.
import { tokens } from '@/styles/tokens';

export function RowSkeleton(props: { variant?: string; disabled?: boolean; loading?: boolean; onAsk?: () => void; children?: unknown }) {
  return null; // the showcase carries the component's shape, not its implementation
}
