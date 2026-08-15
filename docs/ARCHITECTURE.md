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

The application shell owns session, timeline, search, navigation, appearance, and synchronization state. Focused UI behaviors that have their own interaction lifecycle, such as the add-feed modal, are isolated into dedicated components rather than embedded in the shell. Preview mode is explicitly non-mutating.

## API boundary

The client uses FreshRSS's Google Reader-compatible API.

For a same-origin web deployment, the preferred publication model is to serve the GoreeCloud Feed frontend and reverse-proxy `/api/greader.php` to the existing FreshRSS backend. This avoids requiring broad cross-origin API exposure and allows the browser client to keep a fixed same-origin endpoint.

Desktop and Android use Tauri's Rust-backed HTTP plugin rather than WebView `fetch` for FreshRSS requests. This avoids making native functionality depend on browser CORS policy while still enforcing a narrow Tauri capability scope. The native capability and native CSP permit the approved GoreeCloud FreshRSS HTTPS host plus localhost development endpoints; they do not grant generic HTTPS egress.

Native clients therefore use the source-controlled `https://rss.goreecloud.com/api/greader.php` API address. The browser client uses the source-controlled `/api/greader.php` same-origin address. A development-only environment override exists for isolated local testing rather than production endpoint selection.

## Multi-user model

Every person authenticates with that person's own FreshRSS username and dedicated FreshRSS API password. The client does not use or create a shared GoreeCloud Feed identity.

FreshRSS remains responsible for server-side user separation. The client must never treat private network connectivity as application authorization.

## Local state

The current development milestone deliberately keeps the API credential and authentication token in memory only. It does not persist reusable credentials in browser local storage. Sign-out clears the active account, loaded timeline/subscription state, search state, notices, navigation state, and open add-feed state.

Later desktop/Android persistence must use a platform-appropriate secure credential store. Offline article caching may be added, but cached data is a replica and never becomes authoritative over FreshRSS.

## Reproducible build boundary

JavaScript dependencies are committed in `package-lock.json` and installed with `npm ci`. Rust dependencies are committed in `src-tauri/Cargo.lock` and checked with Cargo's `--locked` behavior.

The native compiler is pinned in `rust-toolchain.toml` to Rust 1.97.1. Native CI validates that toolchain explicitly on Linux and Android before build work. This keeps an unchanged source revision from silently moving to a different Rust compiler during validation.

CI concurrency is scoped to the pull request so superseded branch heads are cancelled rather than consuming build capacity or being confused with current acceptance evidence.

## Linux packaging

The validated Linux distribution artifact is a Debian package. AppImage and additional Linux packaging formats are separate release-engineering work rather than requirements for the current desktop foundation.

## Current feature contract

The current foundation implements or scaffolds:

- ClientLogin authentication.
- Subscription discovery.
- Home, unread, and saved/starred timelines.
- Article search over the loaded timeline.
- Read/unread mutation.
- Save/unsave mutation.
- Feed subscription creation.
- Explicitly non-mutating preview mode.
- Social-style article cards.
- Responsive desktop and mobile navigation.
- System-aware System/Light/Dark appearance cycling.
- Development preview data for UI work without production credentials.
- Browser and native FreshRSS transport separation.
- Source-controlled browser/native security contracts.
- Deterministic JavaScript and Rust dependency graphs.
- Pinned Rust native compiler validation.

Future milestones should add robust pagination, sync checkpoints, secure account persistence on native targets only if persistent sign-in is required, offline reading with account-isolated caches, category filtering, feed management, OPML entry points, richer content/media rendering, notification policy, release signing, and additional desktop package formats when justified.
