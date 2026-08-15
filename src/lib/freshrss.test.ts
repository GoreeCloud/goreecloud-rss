import { describe, expect, it } from 'vitest';
import { FreshRssError, normalizeApiBase, parseClientLogin } from './freshrss';

describe('FreshRSS connection helpers', () => {
  it('normalizes a secure API endpoint', () => {
    expect(normalizeApiBase('https://rss.example.test/api/greader.php/')).toBe('https://rss.example.test/api/greader.php');
  });

  it('rejects insecure remote endpoints', () => {
    expect(() => normalizeApiBase('http://rss.example.test/api/greader.php')).toThrow(FreshRssError);
  });

  it('accepts localhost HTTP for development', () => {
    expect(normalizeApiBase('http://localhost:8080/api/greader.php/')).toBe('http://localhost:8080/api/greader.php');
  });

  it('rejects malformed and credential-bearing API addresses', () => {
    expect(() => normalizeApiBase('not a URL')).toThrow('Enter a valid FreshRSS API address.');
    expect(() => normalizeApiBase('https://user:secret@rss.example.test/api/greader.php')).toThrow('Do not place credentials');
  });

  it('extracts the ClientLogin Auth token', () => {
    expect(parseClientLogin('SID=demo/abc\nAuth=demo/abc\n')).toBe('demo/abc');
  });

  it('rejects a ClientLogin response without an auth token', () => {
    expect(() => parseClientLogin('SID=demo/abc\n')).toThrow(FreshRssError);
  });
});
