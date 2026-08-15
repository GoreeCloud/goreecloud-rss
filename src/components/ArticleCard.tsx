import { Bookmark, Check, ExternalLink, Share2, Undo2 } from 'lucide-react';
import type { Article } from '../types';

interface ArticleCardProps {
  article: Article;
  onToggleStar: (article: Article) => void;
  onToggleRead: (article: Article) => void;
}

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

export function ArticleCard({ article, onToggleStar, onToggleRead }: ArticleCardProps) {
  const share = async () => {
    if (!article.articleUrl) return;
    if (navigator.share) {
      await navigator.share({ title: article.title, url: article.articleUrl }).catch(() => undefined);
    } else {
      await navigator.clipboard?.writeText(article.articleUrl).catch(() => undefined);
    }
  };

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
        <button onClick={share} disabled={!article.articleUrl}><Share2 /><span>Share</span></button>
        {article.articleUrl && (
          <a href={article.articleUrl} target="_blank" rel="noopener noreferrer"><ExternalLink /><span>Open</span></a>
        )}
      </footer>
    </article>
  );
}
