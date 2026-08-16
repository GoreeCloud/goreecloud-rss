import type { Article, Subscription } from '../types';

export const demoSubscriptions: Subscription[] = [
  { id: 'feed/tech', title: 'Open Source Weekly', categories: ['Technology'] },
  { id: 'feed/privacy', title: 'Privacy Dispatch', categories: ['Privacy'] },
  { id: 'feed/linux', title: 'Linux Journal', categories: ['Technology'] },
  { id: 'feed/design', title: 'Interface Notes', categories: ['Design'] },
];

const now = Date.now();
export const demoArticles: Article[] = [
  {
    id: 'demo-1',
    feedId: 'feed/tech',
    title: 'A calmer way to follow the web',
    source: 'Open Source Weekly',
    articleUrl: 'https://example.com/calm-web',
    excerpt: 'RSS can feel less like an inbox and more like a living timeline. This first GoreeCloud Feed concept puts sources, context, and quick reading actions into a social-style stream without algorithms or tracking.',
    publishedAt: new Date(now - 18 * 60_000),
    unread: true,
    starred: false,
    categories: ['Technology'],
  },
  {
    id: 'demo-2',
    feedId: 'feed/design',
    title: 'Self-hosted software should feel great to use',
    source: 'Interface Notes',
    articleUrl: 'https://example.com/self-hosted-design',
    excerpt: 'Ownership and visual polish do not have to compete. Layered surfaces, clear hierarchy, strong typography, responsive navigation, and respectful motion can make private software feel first-class.',
    publishedAt: new Date(now - 2.2 * 60 * 60_000),
    unread: true,
    starred: true,
    categories: ['Design'],
  },
  {
    id: 'demo-3',
    feedId: 'feed/privacy',
    title: 'Why local-first reading still matters',
    source: 'Privacy Dispatch',
    articleUrl: 'https://example.com/local-reading',
    excerpt: 'A feed reader can preserve user choice: subscribe directly, read chronologically, keep data under your control, and avoid engagement ranking. FreshRSS supplies the durable backend while the client focuses on the reading experience.',
    publishedAt: new Date(now - 7.5 * 60 * 60_000),
    unread: false,
    starred: false,
    categories: ['Privacy'],
  },
  {
    id: 'demo-4',
    feedId: 'feed/linux',
    title: 'Desktop and mobile from one GoreeCloud client surface',
    source: 'Linux Journal',
    articleUrl: 'https://example.com/cross-platform',
    excerpt: 'The client architecture shares the React and Glaze UI presentation layer across the browser, Tauri desktop application, and Tauri Android application while leaving FreshRSS as the authoritative feed store.',
    publishedAt: new Date(now - 24 * 60 * 60_000),
    unread: false,
    starred: true,
    categories: ['Technology'],
  },
];
