import { useEffect, useMemo, useRef, useState } from 'react';
import { Search, Trash2 } from 'lucide-react';
import { removeSubscription } from '../lib/freshrss';
import type { FeedAccount, Subscription } from '../types';

interface ManageFeedsDialogProps {
  account: FeedAccount;
  subscriptions: Subscription[];
  onClose: () => void;
  onRemoved: () => Promise<void>;
}

const focusableSelector = [
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'a[href]',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export function ManageFeedsDialog({ account, subscriptions, onClose, onRemoved }: ManageFeedsDialogProps) {
  const [query, setQuery] = useState('');
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const dialogRef = useRef<HTMLElement>(null);
  const removingRef = useRef(removingId);
  const onCloseRef = useRef(onClose);

  removingRef.current = removingId;
  onCloseRef.current = onClose;

  useEffect(() => {
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    dialogRef.current?.querySelector<HTMLElement>(focusableSelector)?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && !removingRef.current) {
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

  const filteredSubscriptions = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return [...subscriptions]
      .sort((a, b) => a.title.localeCompare(b.title))
      .filter((subscription) => !needle || `${subscription.title} ${subscription.categories.join(' ')}`.toLowerCase().includes(needle));
  }, [query, subscriptions]);

  async function unfollow(subscription: Subscription) {
    setRemovingId(subscription.id);
    setError('');
    try {
      await removeSubscription(account, subscription.id);
      await onRemoved();
      setConfirmingId(null);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to unfollow the feed.');
    } finally {
      setRemovingId(null);
    }
  }

  return (
    <div
      className="dialog-backdrop"
      role="presentation"
      onMouseDown={(event) => event.currentTarget === event.target && !removingId && onClose()}
    >
      <section
        ref={dialogRef}
        className="dialog manage-feeds-dialog glaze-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="manage-feeds-title"
        aria-describedby="manage-feeds-description"
        aria-busy={Boolean(removingId)}
        tabIndex={-1}
      >
        <p className="eyebrow">Your subscriptions</p>
        <h2 id="manage-feeds-title">Manage feeds</h2>
        <p id="manage-feeds-description">Subscriptions are stored by FreshRSS. Unfollowing removes the selected feed from your FreshRSS account.</p>

        <label className="manage-feed-search">
          <Search aria-hidden="true" />
          <span className="sr-only">Search followed feeds</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search followed feeds"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
          />
        </label>

        {error && <p className="error-banner" role="alert">{error}</p>}

        <div className="manage-feed-list">
          {filteredSubscriptions.map((subscription) => {
            const confirming = confirmingId === subscription.id;
            const removing = removingId === subscription.id;
            const categoryLabel = subscription.categories.length ? subscription.categories.join(' · ') : 'Uncategorized';
            return (
              <article className="manage-feed-row" key={subscription.id}>
                <div className="manage-feed-meta">
                  <span className="source-dot" aria-hidden="true">{subscription.title.slice(0, 1).toUpperCase()}</span>
                  <span className="manage-feed-copy"><strong>{subscription.title}</strong><small>{categoryLabel}</small></span>
                </div>
                {confirming ? (
                  <div className="manage-feed-confirm" role="group" aria-label={`Confirm unfollow ${subscription.title}`}>
                    <span>Remove this feed from FreshRSS?</span>
                    <button type="button" className="secondary-button compact-button" onClick={() => setConfirmingId(null)} disabled={removing}>Cancel</button>
                    <button type="button" className="danger-button" onClick={() => void unfollow(subscription)} disabled={removing}>{removing ? 'Unfollowing…' : 'Confirm unfollow'}</button>
                  </div>
                ) : (
                  <button type="button" className="unfollow-button" onClick={() => setConfirmingId(subscription.id)} disabled={Boolean(removingId)} aria-label={`Unfollow ${subscription.title}`}>
                    <Trash2 /><span>Unfollow</span>
                  </button>
                )}
              </article>
            );
          })}
          {!filteredSubscriptions.length && <p className="manage-feed-empty">No feeds match that search.</p>}
        </div>

        <div className="dialog-actions single-action">
          <button type="button" className="secondary-button" onClick={onClose} disabled={Boolean(removingId)}>Done</button>
        </div>
      </section>
    </div>
  );
}
