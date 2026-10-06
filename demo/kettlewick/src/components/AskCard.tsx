// AskCard — see docs/design/components/AskCard.md for when it applies. Tokens only; no raw values.
// The carer's whole product: one visit, yes or no with one thumb.
import { tokens } from '@/styles/tokens';
import { QUIET_END_SAID } from '@/rota/cover.js';
import { StatusChip } from '@/components/StatusChip';
import { Button } from '@/components/Button';

export function AskCard({ time, day, client, from, coveredBy, disabled, loading, onAsk, onDecline }: {
  time: string;
  day: string;
  client: string; // first name only
  from: string; // who is asking
  coveredBy?: string; // set once answered
  disabled?: boolean; // quiet hours
  loading?: boolean;
  onAsk: () => void; // Yes
  onDecline: () => void; // Not this one
}) {
  return (
    <section
      aria-label={`Ask from ${from}`}
      style={{
        background: tokens.color.surface.paper,
        border: `1px solid ${tokens.color.border.default}`,
        borderRadius: tokens.radius.surface,
        padding: tokens.space[4],
        display: 'grid',
        gap: tokens.space[3],
      }}
    >
      <p style={{ margin: 0, color: tokens.color.text.muted, fontSize: tokens.type.size.small }}>{from} is asking</p>
      <p style={{ margin: 0, fontFamily: tokens.font.display, fontSize: tokens.type.size.heading }}>
        <span style={{ fontFamily: tokens.font.mono }}>{day} {time}</span> · {client}
      </p>
      {coveredBy ? (
        <p style={{ margin: 0, display: 'flex', alignItems: 'center', gap: tokens.space[2] }}>
          <StatusChip variant="covered" size="card" />
          {`${coveredBy} has it.`}
        </p>
      ) : (
        <>
          {disabled && <p style={{ margin: 0, color: tokens.color.text.muted }}>{`This ask goes out at ${QUIET_END_SAID}.`}</p>}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: tokens.space[2] }}>
            <Button variant="primary" onAsk={onAsk} disabled={disabled} loading={loading} loadingLabel="Saying yes…">Yes</Button>
            <Button variant="secondary" onAsk={onDecline} disabled={disabled || loading}>Not this one</Button>
          </div>
        </>
      )}
    </section>
  );
}
