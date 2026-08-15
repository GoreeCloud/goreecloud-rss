import { describe, expect, it } from 'vitest';
import capability from '../src-tauri/capabilities/default.json';
import tauriConfig from '../src-tauri/tauri.conf.json';

type Permission = (typeof capability.permissions)[number];
type ScopedPermission = Extract<Permission, { identifier: string }>;

function isScopedPermission(permission: Permission): permission is ScopedPermission {
  return typeof permission === 'object' && permission !== null && 'identifier' in permission;
}

function directiveSources(csp: string, directive: string): string[] {
  const value = csp
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${directive} `));

  return value?.split(/\s+/).slice(1) ?? [];
}

describe('GoreeCloud Feed native security contract', () => {
  it('keeps Tauri HTTP permission scoped to FreshRSS and localhost development', () => {
    const httpPermission = capability.permissions.find(
      (permission) => isScopedPermission(permission) && permission.identifier === 'http:default',
    );
    const urls = isScopedPermission(httpPermission as Permission)
      ? httpPermission.allow.map((entry) => entry.url)
      : [];

    expect(urls).toEqual([
      'https://rss.goreecloud.com/*',
      'http://localhost:*/*',
      'http://127.0.0.1:*/*',
    ]);
  });

  it('keeps native CSP aligned with the approved production host', () => {
    const sources = directiveSources(tauriConfig.app.security.csp, 'connect-src');

    expect(sources).toEqual([
      "'self'",
      'ipc:',
      'http://ipc.localhost',
      'https://rss.goreecloud.com',
      'http://localhost:*',
      'http://127.0.0.1:*',
    ]);
    expect(sources).not.toContain('https:');
    expect(sources).not.toContain('http:');
  });

  it('does not enable unrelated native capabilities', () => {
    const serialized = JSON.stringify(capability.permissions);

    expect(serialized).not.toMatch(/shell|clipboard|notification|process|fs:/i);
  });
});
