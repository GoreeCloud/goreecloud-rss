import { describe, expect, it } from 'vitest';
import app from './App.tsx?raw';
import manageFeedsDialog from './components/ManageFeedsDialog.tsx?raw';
import freshrss from './lib/freshrss.ts?raw';

describe('Stable feed management and category contracts', () => {
  it('keeps every FreshRSS category available with explicit readable feed-count semantics', () => {
    expect(app).toContain("import './feed-management.css';");
    expect(app).toContain('category-name');
    expect(app).toContain('category-count');
    expect(app).toContain('aria-pressed={category === name}');
    expect(app).toContain("${count === 1 ? 'feed' : 'feeds'}");
    expect(app).toContain('aria-hidden="true">{count}</small>');
    expect(app).not.toContain('sort((a, b) => a[0].localeCompare(b[0])).slice(0, 8)');
  });

  it('exposes category controls in the responsive navigation rail rather than desktop only', () => {
    expect(app).toContain('<section className="rail-section" aria-labelledby="categories-heading">');
    expect(app).not.toContain('<section className="rail-section desktop-only" aria-labelledby="categories-heading">');
  });

  it('makes search and category intersections explicit and easy to clear', () => {
    expect(app).toContain('Search: {normalizedQuery}');
    expect(app).toContain('Clear search');
    expect(app).toContain('matching ${visibleArticles.length === 1 ? \'post\' : \'posts\'}');
    expect(app).toContain('loaded ${visibleArticles.length === 1 ? \'post\' : \'posts\'}');
    expect(app).toContain('No posts in ${category} match “${normalizedQuery}”.');
  });

  it('explains category-empty states in terms of loaded timeline scope instead of implying an empty subscription category', () => {
    expect(app).toContain('No loaded posts in this category');
    expect(app).toContain('assigned to this category, but none of its posts are present in the current loaded timeline.');
    expect(app).toContain('categoryFeedCount');
  });

  it('provides deliberate FreshRSS-authoritative feed removal with confirmation', () => {
    expect(app).toContain('Manage feeds');
    expect(manageFeedsDialog).toContain('Confirm unfollow');
    expect(manageFeedsDialog).toContain('Remove this feed from FreshRSS?');
    expect(manageFeedsDialog).toContain('removeSubscription(account, subscription.id)');
    expect(freshrss).toContain("ac: 'unsubscribe'");
    expect(freshrss).toContain("'/reader/api/0/subscription/edit'");
  });

  it('reloads FreshRSS subscription authority after a removal and clears stale categories', () => {
    expect(app).toContain('onRemoved={async () => { await refresh(filter, true); }}');
    expect(app).toContain('!subscriptions.some((subscription) => subscription.categories.includes(category))');
    expect(app).toContain('setCategory(null)');
  });
});
