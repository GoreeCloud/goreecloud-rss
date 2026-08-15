# GoreeCloud Feed

GoreeCloud Feed is a GoreeCloud-owned RSS client that keeps **FreshRSS as the authoritative backend** while providing a social-feed-style reading experience built with **Glaze UI**.

## Targets

- Responsive web client
- Linux desktop through Tauri 2
- Android APK through Tauri 2

The same React + TypeScript presentation layer is shared across targets so navigation, authentication behavior, FreshRSS synchronization, accessibility, and Glaze UI do not fragment into unrelated clients.

## Product direction

The interaction model uses a chronological home timeline, source identity, search, left navigation on desktop, a contextual right rail, compact mobile navigation, and quick article actions.

It deliberately does **not** add engagement ranking, advertising, tracking, follower metrics, reaction scoring, or algorithmic recommendations. RSS subscriptions chosen by the user remain the timeline.

## FreshRSS integration

GoreeCloud Feed uses the FreshRSS Google Reader-compatible API. Each person signs in using an individual FreshRSS username and that user's dedicated API password.

Production endpoint selection is intentionally fixed by the client security boundary:

- Web: same-origin `/api/greader.php`, intended for controlled reverse-proxy publication.
- Linux desktop and Android: `https://rss.goreecloud.com/api/greader.php` through Tauri's scoped Rust HTTP transport.
- Local development only: `VITE_FRESHRSS_API_BASE` may override the endpoint for an approved development target.

The production login interface does not accept an arbitrary API host.

## Current foundation

Implemented in the current development foundation:

- Glaze UI social timeline shell with an explicit source-controlled UI contract
- System, Light, and Dark appearance cycle
- Desktop three-region layout
- Responsive Android/mobile layout with bottom navigation
- Accessible navigation state and keyboard skip target
- FreshRSS ClientLogin authentication
- Individual in-memory account sessions with functional sign-out
- Subscription loading
- Home, Unread, and Saved timelines
- Timeline search
- Save/unsave article mutation
- Read/unread article mutation
- Add-feed mutation
- Demo timeline for UI development without credentials
- Plain-text handling of untrusted RSS summary HTML
- HTTP/HTTPS external-link validation and credential-bearing URL rejection
- Referrer-reducing remote article images
- Same-origin browser API Content Security Policy
- Narrow Tauri HTTP capability and CSP for the approved FreshRSS host
- Deterministic npm and Cargo dependency locks
- Dependabot maintenance for npm, Cargo, and GitHub Actions
- Source-controlled pull-request readiness checklist
- Web unit/build/audit CI
- Locked Linux desktop and Android APK build-validation workflows
- Architecture, Glaze UI, and security documentation

Placeholder controls are not presented as functional features. Category filtering, notifications, deeper feed management, offline reading, and secure persistent native sign-in remain later reviewed milestones.

## Development

Install the committed JavaScript dependency graph exactly:

```bash
npm ci
npm run dev
npm test
npm run build
```

Generate the native icon set from the repository's canonical GoreeCloud Feed SVG before a local Tauri build:

```bash
npm run icons
```

Desktop:

```bash
npm ci
npm run icons
npm run desktop:dev
npm run desktop:build
```

Android requires the Tauri Android prerequisites. Generate desktop icon prerequisites, initialize the Android project, and regenerate icons so Tauri also writes Android launcher resources:

```bash
npm ci
npm run icons
npm run android:init
npm run icons
npm run android:dev
npm run android:build
```

The native CI workflow validates the committed Cargo lock before packaging and uses the committed npm lock through `npm ci`.

## Security and privacy

The current development milestone keeps the FreshRSS API password and returned authentication token in memory only. Sign-out removes the in-memory account state. Reusable credentials are not written to browser storage.

Raw RSS HTML is not injected into the interface. Article summaries are reduced to plain text. Remote API endpoints require HTTPS except approved localhost development, and credentials embedded in API or feed URLs are rejected.

The browser CSP permits API connections only to the same origin and localhost development. Native FreshRSS access is restricted to the approved GoreeCloud FreshRSS host plus localhost development by both Tauri capability and CSP.

See [docs/SECURITY.md](docs/SECURITY.md) for the full trust-boundary notes.

## Readiness boundary

This repository remains in development. Passing compilation, tests, dependency audit, Linux packaging, or Android debug-APK validation does not by itself authorize a Stable release or production deployment.

Production approval still requires the applicable GoreeCloud gates, including real isolated multi-user validation, approved FreshRSS compatibility testing, controlled same-origin web publication, representative Glaze UI visual/accessibility acceptance, native signing/update/rollback design, monitoring/failure behavior, backup/recovery review, and exact release provenance.

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [Glaze UI contract](docs/GLAZE-UI.md)
- [Security model](docs/SECURITY.md)

The authoritative GoreeCloud Feed project specification and platform governance records are maintained outside this repository. Repository documentation describes the implementation and does not replace those governing records.

## License

MIT. FreshRSS is a separate upstream service and retains its own license and project identity.
