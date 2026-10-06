// VisitRow — see docs/design/components/VisitRow.md for when it applies. Tokens only; no raw values.
// Time, the client's first name, the chip, who has the ask, the one act. Nothing to open.
import { tokens } from '@/styles/tokens';
import { StatusChip, type VisitState } from '@/components/StatusChip';
import { Button } from '@/components/Button';

export function VisitRow({ time, client, state, who = [], heldBy, note, loading, disabled, onAsk }: {
  time: string;
  client: string; // first name only
  state: VisitState;
  who?: string[]; // first names of the carers who have the ask
  heldBy?: string; // the carer whose yes is waiting for the owner's confirm
  note?: string;
  loading?: boolean;
  disabled?: boolean;
  onAsk?: () => void;
}) {
  const act = heldBy
    ? <Button variant="primary" onAsk={onAsk} disabled={disabled}>{`Confirm ${heldBy}`}</Button>
    : state === 'uncovered'
      ? <Button variant="ghost" onAsk={onAsk} loading={loading} loadingLabel="Asking…" disabled={disabled}>Ask</Button>
      : null;

  return (
    <li style={{ padding: `${tokens.space[2]} 0`, borderBottom: `1px solid ${tokens.color.border.subtle}`, listStyle: 'none' }}>
      <div className="kw-visit" style={{ display: 'flex', alignItems: 'center', gap: tokens.space[3], minHeight: tokens.target.min }}>
        <span style={{ fontFamily: tokens.font.mono, color: tokens.color.text.body }}>{time}</span>
        <span style={{ fontWeight: 600 }}>{client}</span>
        <StatusChip variant={state} showLabel />
        <span style={{ flex: 1, color: tokens.color.text.muted, fontSize: tokens.type.size.small }}>
          {heldBy ? `${heldBy} said yes` : who.length ? `Asked ${who.join(', ')}` : ''}
        </span>
        {act}
      </div>
      {note && <p style={{ margin: 0, color: tokens.color.text.muted, fontSize: tokens.type.size.small }}>{note}</p>}
    </li>
  );
}
