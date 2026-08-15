import { FormEvent, useEffect, useRef, useState } from 'react';
import type { FeedAccount } from '../types';
import { addSubscription } from '../lib/freshrss';

interface AddFeedDialogProps {
  account: FeedAccount | null;
  demo: boolean;
  onClose: () => void;
  onAdded: () => void;
}

const focusableSelector = [
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'a[href]',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export function AddFeedDialog({ account, demo, onClose, onAdded }: AddFeedDialogProps) {
  const [url, setUrl] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const dialogRef = useRef<HTMLElement>(null);
  const busyRef = useRef(busy);
  const onCloseRef = useRef(onClose);

  busyRef.current = busy;
  onCloseRef.current = onClose;

  // A modal must keep keyboard focus inside itself and return focus to the
  // invoking control when it closes. The trap is installed once per modal
  // lifetime so rerenders cannot replace the original focus-return target.
  useEffect(() => {
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const firstFocusable = dialogRef.current?.querySelector<HTMLElement>(focusableSelector);
    firstFocusable?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && !busyRef.current) {
        event.preventDefault();
        onCloseRef.current();
        return;
      }

      if (event.key !== 'Tab') return;
      const focusable = [...(dialogRef.current?.querySelectorAll<HTMLElement>(focusableSelector) ?? [])];
      if (!focusable.length) {
        event.preventDefault();
        dialogRef.current?.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      previousFocus?.focus();
    };
  }, []);

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
        ref={dialogRef}
        className="dialog glaze-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-feed-title"
        aria-describedby="add-feed-description"
        tabIndex={-1}
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
          <form onSubmit={submit} aria-busy={busy}>
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
