// Where the app starts: the tokens, then the page the hash names.
import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import '@/styles/tokens.css';
import '@/styles/app.css';
import { DayViewPage } from '@/components/DayViewPage';
import { CarersPage } from '@/components/CarersPage';
import { SettingsPage } from '@/components/SettingsPage';
import { ImportPage } from '@/components/ImportPage';
import { AskPage } from '@/components/AskPage';

function App() {
  const [hash, setHash] = useState(location.hash);
  useEffect(() => {
    const onHash = () => setHash(location.hash);
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const [, place, a, b] = hash.split('/');
  if (place === 'ask') return <AskPage visitId={a} carerId={b} />;
  if (place === 'carers') return <CarersPage />;
  if (place === 'settings') return <SettingsPage />;
  if (place === 'import') return <ImportPage />;
  return <DayViewPage />;
}

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);
