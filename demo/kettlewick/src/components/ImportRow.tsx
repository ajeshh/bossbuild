// ImportRow — see docs/design/components/ImportRow.md for when it applies. Tokens only; no raw values.
// One pasted line as it was read, so the owner checks it before it becomes the day.
import { tokens } from '@/styles/tokens';
import { StatusChip } from '@/components/StatusChip';

export type ParsedLine =
  | { variant: 'read'; time: string; client: string; area: string; carer: string | null }
  | { variant: 'couldnt-read'; raw: string };

export function ImportRow({ line }: { line: ParsedLine }) {
  const unread = line.variant === 'couldnt-read';
  return (
    <li
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: tokens.space[3],
        minHeight: tokens.target.min,
        padding: `${tokens.space[2]} ${tokens.space[3]}`,
        borderBottom: `1px solid ${tokens.color.border.subtle}`,
        borderLeft: `${tokens.space[1]} solid ${unread ? tokens.color.signal.uncovered : 'transparent'}`,
        listStyle: 'none',
      }}
    >
      {unread ? (
        <>
          <span style={{ fontFamily: tokens.font.mono }}>{line.raw}</span>
          <span style={{ color: tokens.color.text.muted, fontSize: tokens.type.size.small }}>couldn't read this one — the rest will import</span>
        </>
      ) : (
        <>
          <span style={{ fontFamily: tokens.font.mono }}>{line.time}</span>
          <span style={{ fontWeight: 600 }}>{line.client}</span>
          <StatusChip variant={line.carer ? 'covered' : 'uncovered'} />
          <span>{line.carer ?? 'nobody yet'}</span>
        </>
      )}
    </li>
  );
}
