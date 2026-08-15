# GoreeCloud Feed

GoreeCloud Feed is a GoreeCloud-owned RSS client that keeps **FreshRSS as the authoritative backend** while providing a new social-feed-style reading experience built with **Glaze UI**.

## Targets

- Responsive web client
- Linux desktop through Tauri 2
- Android APK through Tauri 2

The same React + TypeScript interface is shared across targets so navigation, authentication behavior, FreshRSS synchronization, accessibility, and Glaze UI do not fragment into unrelated clients.

## Product direction

The interaction model takes inspiration from the readability and immediacy of modern social applications: a chronological home timeline, source identity, search, left navigation on desktop, a contextual right rail, compact mobile navigation, and quick actions on every article.

It deliberately does **not** add social-network engagement ranking, ads, tracking, follower metrics, or algorithmic recommendations. RSS subscriptions chosen by the user remain the timeline.

## FreshRSS integration

GoreeCloud Feed uses the FreshRSS Google Reader-compatible API. Each person signs in using an individual FreshRSS username and that user's dedicated API password.

Production endpoints are deliberately source controlled:

- Web: same-origin `/api/greader.php` through the controlled GoreeCloud reverse proxy.
- Linux/Android: `https://rss.goreecloud.com/api/greader.php` through the scoped Tauri HTTP capability.
- Development: an explicit local/development override may be supplied by the development environment.

This prevents the production client from becoming a generic credential-bearing network requester.

## Current foundation

Implemented or scaffolded in the current development milestone:

- Glaze UI social timeline shell
- System, Light, and Dark appearance with a return path to System mode
- Desktop three-region layout
- Responsive Android/mobile layout with bottom navigation
- Accessible navigation state and skip-to-timeline support
- FreshRSS ClientLogin authentication
- Subscription loading
- Home, Unread, and Saved timelines
- Timeline search
- Save/unsave article mutation
- Read/unread article mutation
- Add-feed mutation with a non-mutating preview mode
- Demo timeline for UI development without credentials
- Functional sign-out that clears memory-held account and loaded client state
- Plain-text handling of untrusted RSS summary HTML
- HTTP/HTTPS external-link validation
- Browser and native content-security policies
- Minimal, scoped Tauri native permissions
- Deterministic JavaScript and Rust dependency lockfiles
- Locked dependency validation and npm vulnerability auditing in CI
- Web unit/build CI
- Linux desktop and Android APK build validation
- PR-scoped CI concurrency that cancels superseded validation runs

## Development

Install exactly the committed JavaScript dependency graph:

```bash
npm ci
npm run dev
npm test
npm run build
```

If dependency manifests are intentionally changed, regenerate and review the relevant lockfiles before committing them. Do not use an unlocked dependency resolution as release evidence.

Generate the native icon set from the repository's canonical GoreeCloud Feed SVG before a local Tauri build:

```bash
npm run icons
```

Desktop:

```bash
npm run icons
npm run desktop:dev
npm run desktop:build
```

Android requires the Tauri Android prerequisites. Generate the desktop icon prerequisites, initialize the Android project, then regenerate icons so Tauri also writes the Android launcher resources:

```bash
npm run icons
npm run android:init
npm run icons
npm run android:dev
npm run android:build
```

The native CI workflow performs the same icon-generation sequence automatically and verifies that the committed Cargo lock is consistent before native builds.

## Security notes

The current development milestone keeps the FreshRSS API password and returned authentication token in memory only. They are not persisted to browser storage. Native secure credential persistence is intentionally deferred until a reviewed platform-secure storage implementation is added.

Raw RSS HTML is not injected into the interface. Article summaries are reduced to plain text in this milestone. Production browser connectivity is restricted to the same origin, and the native shell is restricted to the approved GoreeCloud FreshRSS host plus localhost development.

See [docs/SECURITY.md](docs/SECURITY.md) for the full trust-boundary notes.

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [Glaze UI contract](docs/GLAZE-UI.md)
- [Security model](docs/SECURITY.md)

## Release boundary

Successful source and build validation does not by itself authorize a production deployment or Stable release. Real multi-user isolation validation, controlled web publication, representative Glaze UI acceptance, release signing/update behavior, monitoring/recovery review, and final source-to-artifact provenance remain release gates.

## License

MIT. FreshRSS is a separate upstream service and retains its own license and project identity.
