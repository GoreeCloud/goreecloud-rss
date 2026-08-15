import { describe, expect, it } from 'vitest';
import capability from '../src-tauri/capabilities/default.json';
import tauriConfig from '../src-tauri/tauri.conf.json';

interface HttpCapability {
  identifier?: string;
  allow?: Array<{ url?: string }>;
}

describe('GoreeCloud Feed native security contract', () => {
  it('keeps Tauri HTTP permission scoped to FreshRSS and localhost development', () => {
    const httpPermission = capability.permissions.find(
      (permission): permission is HttpCapability => typeof permission === 'object' && permission !== null && permission.identifier === 'http:default',
    );
    const urls = httpPermission?.allow?.map((entry) => entry.url) ?? [];

    expect(urls).toEqual([
      'https://rss.goreecloud.com/*',
      'http://localhost:*/*',
      'http://127.0.0.1:*/*',
    ]);
  });

  it('keeps native CSP aligned with the approved production host', () => {
    const csp = tauriConfig.app.security.csp;

    expect(csp).toContain('https://rss.goreecloud.com');
    expect(csp).toContain('http://localhost:*');
    expect(csp).toContain('http://127.0.0.1:*');
    expect(csp).not.toContain("connect-src 'self' ipc: http://ipc.localhost https:");
  });

  it('does not enable unrelated native capabilities', () => {
    const serialized = JSON.stringify(capability.permissions);

    expect(serialized).not.toMatch(/shell|clipboard|notification|process|fs:/i);
  });
});
