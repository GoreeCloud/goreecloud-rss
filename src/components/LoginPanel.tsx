import { FormEvent, useState } from 'react';
import { LockKeyhole, Rss, ShieldCheck } from 'lucide-react';
import type { FeedAccount } from '../types';
import { login } from '../lib/freshrss';

interface LoginPanelProps {
  onAuthenticated: (account: FeedAccount) => void;
  onUseDemo: () => void;
}

export function LoginPanel({ onAuthenticated, onUseDemo }: LoginPanelProps) {
  const [server, setServer] = useState('/api/greader.php');
  const [username, setUsername] = useState('');
  const [apiPassword, setApiPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      const account = await login(server, username, apiPassword);
      setApiPassword('');
      onAuthenticated(account);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to sign in to FreshRSS.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="login-page">
      <section className="login-card glaze-panel" aria-labelledby="login-title">
        <div className="brand-mark"><Rss aria-hidden="true" /></div>
        <p className="eyebrow">GoreeCloud</p>
        <h1 id="login-title">Feed</h1>
        <p className="login-lede">Your FreshRSS subscriptions, reimagined as a calm social-style timeline.</p>

        <form onSubmit={submit} className="login-form">
          <label>
            <span>FreshRSS API address</span>
            <input value={server} onChange={(event) => setServer(event.target.value)} autoCapitalize="none" spellCheck={false} required />
          </label>
          <label>
            <span>Username</span>
            <input value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" required />
          </label>
          <label>
            <span>API password</span>
            <input type="password" value={apiPassword} onChange={(event) => setApiPassword(event.target.value)} autoComplete="current-password" required />
          </label>
          {error && <p className="error-banner" role="alert">{error}</p>}
          <button className="primary-button" disabled={busy}>{busy ? 'Connecting…' : 'Connect to FreshRSS'}</button>
        </form>

        <button className="text-button" type="button" onClick={onUseDemo}>Preview Glaze UI without signing in</button>

        <div className="privacy-note">
          <ShieldCheck aria-hidden="true" />
          <span>API credentials stay in memory for this development milestone and are never written to browser storage.</span>
        </div>
        <div className="privacy-note">
          <LockKeyhole aria-hidden="true" />
          <span>Use the dedicated FreshRSS API password, not the primary account password.</span>
        </div>
      </section>
    </div>
  );
}
