// AskCard — see docs/design/components/AskCard.md for when it applies. Tokens only; no raw values.
import { tokens } from '@/styles/tokens';
import { StatusChip } from '@/components/StatusChip';
import { Button } from '@/components/Button';

export function AskCard(props: { variant?: string; disabled?: boolean; loading?: boolean; onAsk?: () => void; children?: unknown }) {
  return null; // the showcase carries the component's shape, not its implementation
}
