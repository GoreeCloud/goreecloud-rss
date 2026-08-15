import type { Article, FeedAccount, Subscription, TimelineFilter } from '../types';
import { appFetch, isNativeClient } from './transport';

const STARRED = 'user/-/state/com.google/starred';
const READ = 'user/-/state/com.google/read';

export class FreshRssError extends Error {
  constructor(message: string, readonly status?: number) {
    super(message);
    this.name = 'FreshRssError';
  }
}

export function normalizeApiBase(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) throw new FreshRssError('Enter a FreshRSS API address.');

  if (trimmed.startsWith('/')) {
    if (isNativeClient()) {
      throw new FreshRssError('Desktop and Android require the full HTTPS FreshRSS API address.');
    }
    return trimmed.replace(/\/$/, '');
  }

  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    throw new FreshRssError('Enter a valid FreshRSS API address.');
  }

  const localhost = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
  if (url.protocol !== 'https:' && !(localhost && url.protocol === 'http:')) {
    throw new FreshRssError('Use HTTPS for FreshRSS API connections. HTTP is allowed only for local development.');
  }
  if (url.username || url.password) {
    throw new FreshRssError('Do not place credentials in the FreshRSS API address.');
  }

  url.hash = '';
  url.search = '';
  return url.toString().replace(/\/$/, '');
}

export function parseClientLogin(body: string): string {
  const auth = body
    .split(/\r?\n/)
    .find((line) => line.startsWith('Auth='))
    ?.slice(5)
    .trim();

  if (!auth) {
    throw new FreshRssError('FreshRSS did not return an API authentication token.');
  }
  return auth;
}

function endpoint(base: string, path: string): string {
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

async function request(account: FeedAccount, path: string, init: RequestInit = {}): Promise<Response> {
  const response = await appFetch(endpoint(account.apiBase, path), {
    ...init,
    cache: 'no-store',
    credentials: 'omit',
    headers: {
      Authorization: `GoogleLogin auth=${account.authToken}`,
      ...init.headers,
    },
  });

  if (!response.ok) {
    throw new FreshRssError(`FreshRSS request failed (${response.status}).`, response.status);
  }
  return response;
}

export async function login(apiBaseInput: string, username: string, apiPassword: string): Promise<FeedAccount> {
  const apiBase = normalizeApiBase(apiBaseInput);
  const normalizedUsername = username.trim();
  if (!normalizedUsername) throw new FreshRssError('Enter your FreshRSS username.');
  if (!apiPassword) throw new FreshRssError('Enter your FreshRSS API password.');

  const body = new URLSearchParams({ Email: normalizedUsername, Passwd: apiPassword });
  const response = await appFetch(endpoint(apiBase, '/accounts/ClientLogin'), {
    method: 'POST',
    cache: 'no-store',
    credentials: 'omit',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
    body,
  });

  if (!response.ok) {
    throw new FreshRssError('FreshRSS rejected the API credentials.', response.status);
  }

  return { apiBase, username: normalizedUsername, authToken: parseClientLogin(await response.text()) };
}

export async function getSubscriptions(account: FeedAccount): Promise<Subscription[]> {
  const response = await request(account, '/reader/api/0/subscription/list?output=json');
  const json = (await response.json()) as {
    subscriptions?: Array<{ id?: string; title?: string; url?: string; categories?: Array<{ id?: string; label?: string }> }>;
  };

  return (json.subscriptions ?? [])
    .filter((item): item is { id: string; title: string; url?: string; categories?: Array<{ id?: string; label?: string }> } => Boolean(item.id && item.title))
    .map((item) => ({
      id: item.id,
      title: item.title,
      url: item.url,
      categories: (item.categories ?? []).map((category) => category.label ?? category.id ?? '').filter(Boolean),
    }));
}

function plainText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function safeExternalUrl(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  try {
    const url = new URL(value);
    if (url.username || url.password) return undefined;
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.toString() : undefined;
  } catch {
    return undefined;
  }
}

function publishedAt(item: Record<string, unknown>): Date {
  const timestampUsec = typeof item.timestampUsec === 'string' ? Number(item.timestampUsec) : Number.NaN;
  if (Number.isFinite(timestampUsec) && timestampUsec > 0) return new Date(timestampUsec / 1000);

  const crawlTimeMsec = Number(item.crawlTimeMsec);
  if (Number.isFinite(crawlTimeMsec) && crawlTimeMsec > 0) return new Date(crawlTimeMsec);

  return new Date();
}

export async function getTimeline(account: FeedAccount, filter: TimelineFilter, count = 40): Promise<Article[]> {
  const stream = filter === 'starred' ? STARRED : 'user/-/state/com.google/reading-list';
  const query = new URLSearchParams({ output: 'json', n: String(Math.min(Math.max(count, 1), 100)) });
  if (filter === 'unread') query.set('xt', READ);

  const response = await request(account, `/reader/api/0/stream/contents/${stream}?${query}`);
  const json = (await response.json()) as { items?: Array<Record<string, unknown>> };

  return (json.items ?? []).map((item, index) => {
    const categories = Array.isArray(item.categories) ? item.categories.filter((x): x is string => typeof x === 'string') : [];
    const origin = (item.origin ?? {}) as Record<string, unknown>;
    const summary = (item.summary ?? item.content ?? {}) as Record<string, unknown>;
    const alternate = Array.isArray(item.alternate) ? (item.alternate[0] as Record<string, unknown> | undefined) : undefined;
    const enclosure = Array.isArray(item.enclosure) ? (item.enclosure[0] as Record<string, unknown> | undefined) : undefined;

    return {
      id: String(item.id ?? `goreecloud-feed-item-${index}`),
      title: typeof item.title === 'string' && item.title.trim() ? item.title : 'Untitled article',
      source: typeof origin.title === 'string' && origin.title.trim() ? origin.title : 'RSS source',
      sourceUrl: safeExternalUrl(origin.htmlUrl),
      articleUrl: safeExternalUrl(alternate?.href),
      excerpt: plainText(typeof summary.content === 'string' ? summary.content : '').slice(0, 380),
      publishedAt: publishedAt(item),
      unread: !categories.some((category) => category.endsWith('/state/com.google/read')),
      starred: categories.some((category) => category.endsWith('/state/com.google/starred')),
      imageUrl: typeof enclosure?.type === 'string' && enclosure.type.startsWith('image/') ? safeExternalUrl(enclosure.href) : undefined,
      categories,
    } satisfies Article;
  });
}

async function getEditToken(account: FeedAccount): Promise<string> {
  const response = await request(account, '/reader/api/0/token');
  const token = (await response.text()).trim();
  if (!token) throw new FreshRssError('FreshRSS did not return a write token.');
  return token;
}

async function editTag(account: FeedAccount, articleId: string, add?: string, remove?: string): Promise<void> {
  const token = await getEditToken(account);
  const body = new URLSearchParams({ i: articleId, T: token });
  if (add) body.set('a', add);
  if (remove) body.set('r', remove);
  await request(account, '/reader/api/0/edit-tag', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
    body,
  });
}

export async function setStarred(account: FeedAccount, articleId: string, starred: boolean): Promise<void> {
  await editTag(account, articleId, starred ? STARRED : undefined, starred ? undefined : STARRED);
}

export async function setRead(account: FeedAccount, articleId: string, read: boolean): Promise<void> {
  await editTag(account, articleId, read ? READ : undefined, read ? undefined : READ);
}

export async function addSubscription(account: FeedAccount, feedUrl: string): Promise<void> {
  let parsed: URL;
  try {
    parsed = new URL(feedUrl.trim());
  } catch {
    throw new FreshRssError('Enter a valid RSS or Atom feed URL.');
  }
  if (!['https:', 'http:'].includes(parsed.protocol)) throw new FreshRssError('Feed URL must use HTTP or HTTPS.');
  if (parsed.username || parsed.password) throw new FreshRssError('Do not place credentials in a feed URL.');

  const token = await getEditToken(account);
  const body = new URLSearchParams({ ac: 'subscribe', s: `feed/${parsed.toString()}`, T: token });
  await request(account, '/reader/api/0/subscription/edit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
    body,
  });
}
