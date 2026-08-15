import { describe, expect, it } from 'vitest';
import html from '../index.html?raw';
import app from './App.tsx?raw';
import readinessCss from './readiness.css?raw';
import stylesCss from './styles.css?raw';

const css = `${stylesCss}\n${readinessCss}`;

describe('GoreeCloud Feed Glaze UI readiness contract', () => {
  it('marks the controlled shell and preserves accessible navigation', () => {
    expect(app).toContain('data-glaze-ui="feed"');
    expect(app).toContain('Skip to timeline');
    expect(app).toContain('aria-current');
    expect(app).toContain('aria-expanded={sidebarOpen}');
  });

  it('supports System, Light, and Dark appearance without remote UI assets', () => {
    expect(app).toContain("type Theme = 'system' | 'light' | 'dark'");
    expect(css).toContain('prefers-color-scheme: dark');
    expect(css).toContain('prefers-reduced-motion: reduce');
    expect(css).toContain('prefers-contrast: more');
    expect(css).toContain('forced-colors: active');
    expect(html).not.toMatch(/fonts\.(googleapis|gstatic)\.com/i);
  });

  it('keeps the browser API boundary same-origin except localhost development', () => {
    const csp = html.match(/Content-Security-Policy[\s\S]*?content="([^"]+)"/)?.[1] ?? '';
    expect(csp).toContain("connect-src 'self' http://localhost:* http://127.0.0.1:*");
    expect(csp).not.toContain("connect-src 'self' https:");
    expect(html).toContain('noindex,nofollow,noarchive');
    expect(html).toContain('name="referrer" content="same-origin"');
  });

  it('does not expose placeholder notifications or settings controls', () => {
    expect(app).not.toContain('aria-label="Notifications"');
    expect(app).not.toContain('<span>Settings</span>');
    expect(app).toContain('Sign out');
  });
});
