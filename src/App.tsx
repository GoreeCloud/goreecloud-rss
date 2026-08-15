import { useEffect, useMemo, useState } from 'react';
import {
  Bookmark,
  CircleUserRound,
  Home,
  LogOut,
  Menu,
  Monitor,
  Moon,
  Plus,
  RefreshCw,
  Rss,
  Search,
  Sparkles,
  Sun,
} from 'lucide-react';
import { AddFeedDialog } from './components/AddFeedDialog';
import { ArticleCard } from './components/ArticleCard';
import { LoginPanel } from './components/LoginPanel';
import { getSubscriptions, getTimeline, setRead, setStarred } from './lib/freshrss';
import { demoArticles, demoSubscriptions } from './lib/demo';
import type { Article, FeedAccount, Subscription, TimelineFilter } from './types';
import './styles.css';
import './readiness.css';

type Theme = 'system' | 'light' | 'dark';

const navItems: Array<{ id: TimelineFilter; label: string; icon: typeof Home }> = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'unread', label: 'Unread', icon: Sparkles },
  { id: 'starred', label: 'Saved', icon: Bookmark },
];

function nextTheme(theme: Theme): Theme {
  if (theme === 'system') return 'light';
  if (theme === 'light') return 'dark';
  return 'system';
}

function ThemeIcon({ theme }: { theme: Theme }) {
  if (theme === 'light') return <Sun />;
  if (theme === 'dark') return <Moon />;
  return <Monitor />;
}

export default function App() {
  const [account, setAccount] = useState<FeedAccount | null>(null);
  const [demo, setDemo] = useState(false);
  const [articles, setArticles] = useState<Article[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [filter, setFilter] = useState<TimelineFilter>('home');
  const [category, setCategory] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState('');
  const [theme, setTheme] = useState<Theme>('system');
  const [showAddFeed, setShowAddFeed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'system') delete root.dataset.theme;
    else root.dataset.theme = theme;
  }, [theme]);

  async function refresh(nextFilter = filter) {
    if (demo) {
      setArticles(demoArticles.filter((article) => nextFilter === 'home' || (nextFilter === 'unread' ? article.unread : article.starred)));
      setSubscriptions(demoSubscriptions);
      return;
    }
    if (!account) return;

    setLoading(true);
    setNotice('');
    try {
      const [nextArticles, nextSubscriptions] = await Promise.all([
        getTimeline(account, nextFilter),
        subscriptions.length ? Promise.resolve(subscriptions) : getSubscriptions(account),
      ]);
      setArticles(nextArticles);
      setSubscriptions(nextSubscriptions);
    } catch (cause) {
      setNotice(cause instanceof Error ? cause.message : 'Unable to refresh the feed.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refresh(filter);
  }, [account, demo, filter]);

  const categoryFeedIds = useMemo(() => {
    if (!category) return null;
    return new Set(
      subscriptions
        .filter((subscription) => subscription.categories.includes(category))
        .map((subscription) => subscription.id),
    );
  }, [category, subscriptions]);

  const visibleArticles = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return articles.filter((article) => {
      if (categoryFeedIds && (!article.feedId || !categoryFeedIds.has(article.feedId))) return false;
      if (!needle) return true;
      return `${article.title} ${article.source} ${article.excerpt}`.toLowerCase().includes(needle);
    });
  }, [articles, categoryFeedIds, query]);

  const categoryCounts = useMemo(() => {
    const map = new Map<string, number>();
    subscriptions
      .flatMap((subscription) => subscription.categories)
      .forEach((name) => map.set(name, (map.get(name) ?? 0) + 1));
    return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0])).slice(0, 8);
  }, [subscriptions]);

  async function toggleStar(article: Article) {
    const next = !article.starred;
    setArticles((current) => current.map((item) => item.id === article.id ? { ...item, starred: next } : item));
    if (!account || demo) return;

    try {
      await setStarred(account, article.id, next);
    } catch (cause) {
      setArticles((current) => current.map((item) => item.id === article.id ? { ...item, starred: !next } : item));
      setNotice(cause instanceof Error ? cause.message : 'Unable to change saved state.');
    }
  }

  async function toggleRead(article: Article) {
    const nextUnread = !article.unread;
    setArticles((current) => current.map((item) => item.id === article.id ? { ...item, unread: nextUnread } : item));
    if (!account || demo) return;

    try {
      await setRead(account, article.id, !nextUnread);
    } catch (cause) {
      setArticles((current) => current.map((item) => item.id === article.id ? { ...item, unread: !nextUnread } : item));
      setNotice(cause instanceof Error ? cause.message : 'Unable to change read state.');
    }
  }

  function signOut() {
    setAccount(null);
    setDemo(false);
    setArticles([]);
    setSubscriptions([]);
    setFilter('home');
    setCategory(null);
    setQuery('');
    setNotice('');
    setSidebarOpen(false);
    setShowAddFeed(false);
  }

  function selectFilter(next: TimelineFilter) {
    setFilter(next);
    setCategory(null);
    setSidebarOpen(false);
  }

  function selectCategory(next: string) {
    setCategory((current) => current === next ? null : next);
    setSidebarOpen(false);
  }

  if (!account && !demo) {
    return <LoginPanel onAuthenticated={setAccount} onUseDemo={() => setDemo(true)} />;
  }

  const timelineLabel = category ?? navItems.find((item) => item.id === filter)?.label;

  return (
    <div className="app-shell" data-glaze-ui="feed">
      <a className="skip-link" href="#timeline">Skip to timeline</a>
      <header className="topbar glaze-panel">
        <button
          className="icon-button mobile-only"
          onClick={() => setSidebarOpen((open) => !open)}
          aria-label={sidebarOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={sidebarOpen}
          aria-controls="primary-sidebar"
        ><Menu /></button>
        <div className="brand-lockup">
          <div className="brand-mark small"><Rss /></div>
          <div><strong>GoreeCloud</strong><span>Feed</span></div>
        </div>
        <label className="search-box">
          <Search aria-hidden="true" />
          <span className="sr-only">Search articles</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search your feeds" />
        </label>
        <div className="topbar-actions">
          <button className="icon-button" onClick={() => void refresh()} aria-label="Refresh timeline" disabled={loading}><RefreshCw className={loading ? 'spin' : ''} /></button>
          <div className="account-chip" aria-label={demo ? 'Preview session' : `Signed in as ${account?.username ?? ''}`}><CircleUserRound /><span>{demo ? 'Preview' : account?.username}</span></div>
          <button className="icon-button" onClick={signOut} aria-label={demo ? 'Exit preview' : 'Sign out'}><LogOut /></button>
        </div>
      </header>

      <div className="layout">
        <aside id="primary-sidebar" className={`left-rail ${sidebarOpen ? 'open' : ''}`}>
          <nav aria-label="Primary">
            {navItems.map(({ id, label, icon: Icon }) => (
              <button key={id} className={!category && filter === id ? 'selected' : ''} onClick={() => selectFilter(id)} aria-current={!category && filter === id ? 'page' : undefined}>
                <Icon /><span>{label}</span>
              </button>
            ))}
          </nav>
          <button className="add-feed-button" onClick={() => setShowAddFeed(true)}><Plus /><span>Add feed</span></button>
          <section className="rail-section desktop-only" aria-labelledby="categories-heading">
            <h2 id="categories-heading">Categories</h2>
            {categoryCounts.length
              ? categoryCounts.map(([name, count]) => (
                  <button
                    key={name}
                    className={`category-link ${category === name ? 'selected' : ''}`}
                    onClick={() => selectCategory(name)}
                    aria-pressed={category === name}
                  >
                    <span>{name}</span><small>{count}</small>
                  </button>
                ))
              : <p>No categories yet.</p>}
          </section>
          <div className="rail-footer">
            <button onClick={() => setTheme((current) => nextTheme(current))} aria-label={`Appearance: ${theme}. Activate for next mode.`}><ThemeIcon theme={theme} /><span>Appearance: {theme}</span></button>
            <button onClick={signOut}><LogOut /><span>{demo ? 'Exit preview' : 'Sign out'}</span></button>
          </div>
        </aside>

        <main id="timeline" tabIndex={-1}>
          <section className="timeline-heading">
            <div><p className="eyebrow">Your timeline</p><h1>{timelineLabel}</h1></div>
            <span>{visibleArticles.length} posts</span>
          </section>
          {notice && <div className="notice-banner" role="status">{notice}</div>}
          <div className="feed-stack" aria-busy={loading}>
            {visibleArticles.map((article) => <ArticleCard key={article.id} article={article} onToggleStar={toggleStar} onToggleRead={toggleRead} />)}
            {!loading && !visibleArticles.length && (
              <section className="empty-state glaze-panel"><Rss /><h2>Nothing here yet</h2><p>Try another timeline, clear your search, or add a new feed.</p></section>
            )}
          </div>
        </main>

        <aside className="right-rail desktop-only">
          <section className="side-card glaze-panel">
            <div className="side-card-heading"><div><p className="eyebrow">Reading pulse</p><h2>Current view</h2></div><Sparkles /></div>
            <dl className="stats-grid"><div><dt>Sources</dt><dd>{subscriptions.length}</dd></div><div><dt>Unread</dt><dd>{articles.filter((article) => article.unread).length}</dd></div><div><dt>Saved</dt><dd>{articles.filter((article) => article.starred).length}</dd></div></dl>
          </section>
          <section className="side-card glaze-panel">
            <p className="eyebrow">Sources</p><h2>Following</h2>
            <div className="source-list">{subscriptions.slice(0, 6).map((subscription) => <div key={subscription.id}><span className="source-dot">{subscription.title.slice(0, 1).toUpperCase()}</span><span>{subscription.title}</span></div>)}</div>
          </section>
          <section className="side-card glaze-panel compact"><strong>No algorithm.</strong><p>FreshRSS stays authoritative. Your timeline follows the feeds you chose.</p></section>
        </aside>
      </div>

      <nav className="mobile-nav mobile-only" aria-label="Mobile primary">
        {navItems.map(({ id, label, icon: Icon }) => <button key={id} className={!category && filter === id ? 'selected' : ''} onClick={() => selectFilter(id)} aria-current={!category && filter === id ? 'page' : undefined}><Icon /><span>{label}</span></button>)}
        <button onClick={() => setShowAddFeed(true)}><Plus /><span>Add</span></button>
      </nav>

      {showAddFeed && (
        <AddFeedDialog
          account={account}
          demo={demo}
          onClose={() => setShowAddFeed(false)}
          onAdded={() => void refresh()}
        />
      )}
    </div>
  );
}
