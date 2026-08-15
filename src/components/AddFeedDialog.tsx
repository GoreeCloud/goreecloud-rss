import { FormEvent, useEffect, useState } from 'react';
import type { FeedAccount } from '../types';
import { addSubscription } from '../lib/freshrss';

interface AddFeedDialogProps {
  account: FeedAccount | null;
  demo: boolean;
  onClose: () => void;
  onAdded: () => void;
}

export function AddFeedDialog({ account, demo, onClose, onAdded }: AddFeedDialogProps) {
  const [url, setUrl] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  // Escape is the platform-consistent dismissal path for the custom modal surface.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && !busy) onClose();
    }

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [busy, onClose]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!account || demo) return;

    setBusy(true);
    setError('');
    try {
      await addSubscription(account, url);
      onAdded();
      onClose();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to add the feed.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className="dialog-backdrop"
      role="presentation"
      onMouseDown={(event) => event.currentTarget === event.target && !busy && onClose()}
    >
      <section
        className="dialog glaze-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-feed-title"
        aria-describedby="add-feed-description"
      >
        <p className="eyebrow">Follow the web</p>
        <h2 id="add-feed-title">Add a feed</h2>
        <p id="add-feed-description">
          {demo
            ? 'Preview mode never changes FreshRSS. Sign in to subscribe to an RSS or Atom feed.'
            : 'Paste an RSS or Atom feed URL. GoreeCloud Feed will ask FreshRSS to subscribe for your account.'}
        </p>

        {demo ? (
          <div className="dialog-actions single-action">
            <button type="button" className="primary-button" onClick={onClose}>Close preview</button>
          </div>
        ) : (
          <form onSubmit={submit}>
            <label>
              <span>Feed URL</span>
              <input
                type="url"
                inputMode="url"
                placeholder="https://example.com/feed.xml"
                value={url}
                onChange={(event) => setUrl(event.target.value)}
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                required
                autoFocus
              />
            </label>
            {error && <p className="error-banner" role="alert">{error}</p>}
            <div className="dialog-actions">
              <button type="button" className="secondary-button" onClick={onClose} disabled={busy}>Cancel</button>
              <button className="primary-button" disabled={busy}>{busy ? 'Adding…' : 'Add feed'}</button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
}
