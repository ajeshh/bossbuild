// Settings — the ones she never touches: her name, the agency, the 8pm rule (read-only; DEC-003),
// and leaving in one tap (FEAT-006): a confirm, and gone in a day, texts included.
import { useState } from 'react';
import { tokens } from '@/styles/tokens';
import { QUIET_END_SAID } from '@/rota/cover.js';
import { Rail } from '@/components/Rail';
import { TextField } from '@/components/TextField';
import { Button } from '@/components/Button';
import { ConfirmDialog } from '@/components/ConfirmDialog';

export function SettingsPage() {
  const [name, setName] = useState('Marta');
  const [agency, setAgency] = useState('');
  const [leaving, setLeaving] = useState(false);
  const [left, setLeft] = useState(false);

  return (
    <div className="kw-shell">
      <Rail current="settings" />
      <main className="kw-main" style={{ display: 'grid', gap: tokens.space[4], alignContent: 'start' }}>
        <h1 style={{ fontFamily: tokens.font.display, fontSize: tokens.type.size.display, margin: 0 }}>Settings</h1>
        <TextField label="Your name" value={name} onChange={setName} />
        <TextField label="Your agency" value={agency} onChange={setAgency} />
        <p style={{ margin: 0, color: tokens.color.text.muted }}>
          {`Nothing is sent between 8pm and ${QUIET_END_SAID}am. A carer's evening is theirs, so this one doesn't change.`}
        </p>
        {left
          ? <p role="status" style={{ margin: 0 }}>Your agency is deleted. Everything is gone within a day, texts included.</p>
          : <div><Button variant="secondary" onAsk={() => setLeaving(true)}>Leave Kettlewick</Button></div>}
      </main>
      {leaving && (
        <ConfirmDialog
          title="Delete your agency. Every visit, carer and text goes within a day."
          confirmLabel="Delete the agency"
          onAsk={() => { localStorage.clear(); setLeaving(false); setLeft(true); }}
          onKeep={() => setLeaving(false)}
        />
      )}
    </div>
  );
}
