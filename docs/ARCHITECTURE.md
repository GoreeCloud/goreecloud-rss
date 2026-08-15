# GoreeCloud Feed Architecture

## Role

GoreeCloud Feed is a client application. FreshRSS remains the authoritative aggregator, subscription store, read-state store, saved/starred-state store, and multi-user backend.

The repository does not fork or replace FreshRSS. It supplies a GoreeCloud-controlled presentation and client layer.

## Client model

One React + TypeScript + Vite presentation layer is used for three targets:

1. Web browser.
2. Tauri desktop application.
3. Tauri Android application / APK.

Tauri is intentionally used for both desktop and Android so GoreeCloud does not maintain separate desktop and mobile presentation codebases without a product requirement.

## API and transport boundary

The client uses FreshRSS's Google Reader-compatible API.

### Web

The browser production endpoint is fixed to the relative `/api/greader.php` path. The intended publication model is to serve GoreeCloud Feed and reverse-proxy only that API path to FreshRSS through the controlled GoreeCloud web-service publication layer.

The browser Content Security Policy restricts connection targets to the same origin plus localhost development endpoints. The production login interface does not provide an arbitrary API-host selector.

### Linux desktop and Android

Desktop and Android use Tauri's Rust-backed HTTP plugin rather than WebView `fetch` for FreshRSS requests. Native clients use `https://rss.goreecloud.com/api/greader.php` as the production endpoint.

Two controls enforce this boundary:

- The Tauri HTTP capability permits the approved GoreeCloud FreshRSS HTTPS host plus localhost development endpoints.
- The Tauri Content Security Policy restricts production network connections to the same approved FreshRSS host plus Tauri IPC and localhost development endpoints.

A different production FreshRSS host requires deliberate source and capability review rather than a runtime user-entered override.

### Development override

`VITE_FRESHRSS_API_BASE` may override the endpoint only while Vite is running in development mode. This supports isolated development without turning production endpoint selection into an unrestricted networking feature.

## Multi-user model

Every person authenticates with that person's own FreshRSS username and dedicated FreshRSS API password. The client does not use or create a shared GoreeCloud Feed identity.

FreshRSS remains responsible for server-side user separation. The client must never treat private network connectivity as application authorization.

The current client keeps one active account in memory. Sign-out clears the in-memory account, authentication token reference, loaded article/subscription state, search state, and view state before returning to the login surface.

Real multi-user isolation against approved FreshRSS test identities remains a production-readiness validation gate.

## Local state

The current milestone deliberately keeps the API credential and returned authentication token in memory only. It does not persist reusable credentials in browser local storage or another client cache.

Later desktop/Android persistent sign-in must use a separately reviewed platform-appropriate secure credential store. Offline article caching may be added only after account separation, cache lifecycle, encryption where appropriate, stale-state reconciliation, and sign-out/account-removal behavior are defined.

FreshRSS remains authoritative over any future offline replica.

## Content trust boundary

RSS content is untrusted input.

The current foundation:

- Converts summary/content HTML to plain text rather than injecting feed HTML into the DOM.
- Limits external article/source URLs to HTTP or HTTPS.
- Rejects credential-bearing external URLs.
- Displays a remote image only when a FreshRSS enclosure identifies an image MIME type.
- Uses `no-referrer` for remote article images.

Richer HTML rendering requires a separate sanitizer and CSP review.

## Dependency and build model

The repository commits both dependency graphs:

- `package-lock.json` for JavaScript/npm dependencies.
- `src-tauri/Cargo.lock` for Rust dependencies.

Client CI installs JavaScript dependencies through `npm ci`, runs unit tests and the production web build, and fails on npm audit findings at High severity or above.

Native CI uses the committed npm lock and validates the Cargo dependency graph with Cargo's `--locked` mode before Linux or Android packaging. Successful build validation remains distinct from Stable-release approval.

## Linux packaging

The first validated Linux distribution format is a Debian package. AppImage and additional Linux packaging formats are separate release-engineering work rather than requirements for the initial desktop foundation.

## Initial feature contract

The current foundation implements:

- ClientLogin authentication.
- Subscription discovery.
- Home, Unread, and Saved/starred timelines.
- Article search over the loaded timeline.
- Read/unread mutation.
- Save/unsave mutation.
- Feed subscription creation.
- Social-style article cards.
- Responsive desktop and mobile navigation.
- System, Light, and Dark appearance cycling.
- Development preview data for UI work without production credentials.
- Browser and native FreshRSS transport separation.
- Functional in-memory sign-out.
- Source-controlled Glaze UI/security regression checks.

Category filtering, robust pagination and sync checkpoints, secure account persistence, offline reading, deeper feed management, OPML workflows, richer content/media rendering, notifications, signed releases, update/rollback behavior, and additional desktop package formats remain later work unless separately implemented and validated.

## Readiness boundary

This architecture record describes repository implementation. It does not supersede the authoritative GoreeCloud Feed project specification or platform governance records.

Source/build readiness is not production readiness. Real multi-user validation, production FreshRSS compatibility, controlled web publication, Glaze UI visual/accessibility acceptance, signing/update behavior, monitoring, backup/recovery implications, and exact source-to-release-artifact provenance remain separate gates.
