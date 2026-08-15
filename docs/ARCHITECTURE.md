# GoreeCloud Feed Architecture

## Role

GoreeCloud Feed is a client application. FreshRSS remains the authoritative aggregator, subscription store, read-state store, favorite-state store, and multi-user backend.

The repository does not fork or replace FreshRSS. It supplies a GoreeCloud-controlled presentation and client layer.

## Client model

One React + TypeScript + Vite interface is used for three targets:

1. Web browser.
2. Tauri desktop application.
3. Tauri Android application / APK.

Tauri is intentionally used for both desktop and Android so GoreeCloud does not maintain separate desktop and mobile presentation codebases without a product requirement.

## API boundary

The client uses FreshRSS's Google Reader-compatible API.

For a same-origin web deployment, the preferred publication model is to serve the GoreeCloud Feed frontend and reverse-proxy `/api/greader.php` to the existing FreshRSS backend. This avoids requiring broad cross-origin API exposure and allows the default browser login endpoint to remain relative.

Desktop and Android use Tauri's Rust-backed HTTP plugin rather than WebView `fetch` for FreshRSS requests. This avoids making native functionality depend on browser CORS policy while still enforcing a narrow Tauri capability scope. The native capability currently permits the approved GoreeCloud FreshRSS HTTPS host plus localhost development endpoints.

Native clients therefore require a complete HTTPS `.../api/greader.php` API address. The GoreeCloud FreshRSS API address is supplied as their default. The browser client keeps `/api/greader.php` as its same-origin default.

## Multi-user model

Every person authenticates with that person's own FreshRSS username and dedicated FreshRSS API password. The client does not use or create a shared GoreeCloud Feed identity.

FreshRSS remains responsible for server-side user separation. The client must never treat private network connectivity as application authorization.

## Local state

The first development milestone deliberately keeps the API credential and authentication token in memory only. It does not persist reusable credentials in browser local storage.

Later desktop/Android persistence must use a platform-appropriate secure credential store. Offline article caching may be added, but cached data is a replica and never becomes authoritative over FreshRSS.

## Linux packaging

The first validated Linux distribution artifact is a Debian package. AppImage and additional Linux packaging formats are separate release-engineering work rather than requirements for the initial desktop foundation.

## Initial feature contract

The current foundation implements or scaffolds:

- ClientLogin authentication.
- Subscription discovery.
- Home, unread, and saved/starred timelines.
- Article search over the loaded timeline.
- Read/unread mutation.
- Save/unsave mutation.
- Feed subscription creation.
- Social-style article cards.
- Responsive desktop and mobile navigation.
- System-aware light/dark appearance.
- Development preview data for UI work without production credentials.
- Browser and native FreshRSS transport separation.

Future milestones should add robust pagination, sync checkpoints, secure account persistence on native targets, offline reading, category filtering, feed management, OPML entry points, richer content/media rendering, notification policy, release signing, and additional desktop package formats when justified.
