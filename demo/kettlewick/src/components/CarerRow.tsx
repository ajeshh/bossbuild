// CarerRow — see docs/design/components/CarerRow.md for when it applies. Tokens only; no raw values.
// As thin as the owner's own head: name, phone, the days they usually can. No ranking, no act.
import { tokens } from '@/styles/tokens';

export function CarerRow({ name, phone, usually }: {
  name: string;
  phone: string;
  usually: string; // the owner's words — "most mornings"
}) {
  return (
    <li style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: tokens.space[3], minHeight: tokens.target.min, padding: `${tokens.space[2]} 0`, borderBottom: `1px solid ${tokens.color.border.subtle}`, listStyle: 'none' }}>
      <span style={{ fontWeight: 600 }}>{name}</span>
      <a href={`tel:${phone.replace(/\s/g, '')}`} style={{ fontFamily: tokens.font.mono, color: tokens.color.text.body }}>{phone}</a>
      <span style={{ color: tokens.color.text.muted, fontSize: tokens.type.size.small }}>{usually}</span>
    </li>
  );
}
