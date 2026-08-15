export type TimelineFilter = 'home' | 'unread' | 'starred';

export interface FeedAccount {
  apiBase: string;
  username: string;
  authToken: string;
}

export interface Subscription {
  id: string;
  title: string;
  url?: string;
  categories: string[];
}

export interface Article {
  id: string;
  title: string;
  source: string;
  sourceUrl?: string;
  articleUrl?: string;
  excerpt: string;
  publishedAt: Date;
  unread: boolean;
  starred: boolean;
  imageUrl?: string;
  categories: string[];
}
