import { isTauri } from '@tauri-apps/api/core';
import { fetch as tauriFetch } from '@tauri-apps/plugin-http';

/**
 * Use the browser Fetch API for the web client and Tauri's scoped Rust HTTP
 * transport for desktop/Android so native clients are not dependent on CORS.
 */
export function isNativeClient(): boolean {
  return isTauri();
}

export async function appFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  if (isTauri()) {
    return tauriFetch(input, init);
  }

  return globalThis.fetch(input, init);
}
