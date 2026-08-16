import { useState } from 'react';
import { Bookmark, Check, ExternalLink, Share2, Undo2 } from 'lucide-react';
import type { Article } from '../types';

interface ArticleCardProps {
  article: Article;
  onToggleStar: (article: Article) => void;
  onToggleRead: (article: Article) => void;
}

type ShareStatus = 'idle' | 'copied' | 'failed';

function relativeTime(date: Date): string {
  const seconds = Math.round((date.getTime() - Date.now()) / 1000);
  const formatter = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' });
  if (Math.abs(seconds) < 60) return formatter.format(seconds, 'second');
  const minutes = Math.round(seconds / 60);
  if (Math.abs(minutes) < 60) return formatter.format(minutes, 'minute');
  const hours = Math.round(minutes / 60);
  if (Math.abs(hours) < 24) return formatter.format(hours, 'hour');
  return formatter.format(Math.round(hours / 24), 'day');
}

function initial(source: string) {
  return source.trim().slice(0, 1).toUpperCase() || 'R';
}

async function copyShareText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Continue to the legacy copy path for browsers that expose Clipboard API
    // but reject it because of permissions or runtime policy.
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  textarea.style.pointerEvents = 'none';
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();

  try {
    return document.execCommand('copy');
  } catch {
    return false;
  } finally {
    textarea.remove();
  }
}

export function ArticleCard({ article, onToggleStar, onToggleRead }: ArticleCardProps) {
  const [shareStatus, setShareStatus] = useState<ShareStatus>('idle');

  const share = async () => {
    if (!article.articleUrl) return;

    setShareStatus('idle');

    if (navigator.share) {
      try {
        await navigator.share({ title: article.title, url: article.articleUrl });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return;
      }
    }

    const copied = await copyShareText(`${article.title}\n${article.articleUrl}`);
    setShareStatus(copied ? 'copied' : 'failed');

    window.setTimeout(() => {
      setShareStatus('idle');
    }, 2500);
  };

  const shareLabel = shareStatus === 'copied' ? 'Copied' : shareStatus === 'failed' ? 'Copy failed' : 'Share';

  return (
    <article className={`article-card glaze-panel ${article.unread ? 'is-unread' : ''}`}>
      <header className="article-header">
        <div className="source-avatar" aria-hidden="true">{initial(article.source)}</div>
        <div className="source-meta">
          <strong>{article.source}</strong>
          <span>{relativeTime(article.publishedAt)}{article.unread ? ' · New' : ''}</span>
        </div>
      </header>

      <div className="article-body">
        <h2>{article.title}</h2>
        {article.excerpt && <p>{article.excerpt}</p>}
        {article.imageUrl && <img className="article-image" src={article.imageUrl} alt="" loading="lazy" referrerPolicy="no-referrer" />}
      </div>

      <footer className="article-actions">
        <button onClick={() => onToggleStar(article)} className={article.starred ? 'active' : ''} aria-pressed={article.starred}>
          <Bookmark fill={article.starred ? 'currentColor' : 'none'} />
          <span>{article.starred ? 'Saved' : 'Save'}</span>
        </button>
        <button onClick={() => onToggleRead(article)}>
          {article.unread ? <Check /> : <Undo2 />}
          <span>{article.unread ? 'Mark read' : 'Unread'}</span>
        </button>
        <button onClick={share} disabled={!article.articleUrl} aria-label={shareLabel}>
          <Share2 />
          <span aria-live="polite">{shareLabel}</span>
        </button>
        {article.articleUrl && (
          <a href={article.articleUrl} target="_blank" rel="noopener noreferrer"><ExternalLink /><span>Open</span></a>
        )}
      </footer>
    </article>
  );
}
