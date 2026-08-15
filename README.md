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

For the current GoreeCloud FreshRSS installation, the API shape is:

```text
https://<FreshRSS host>/api/greader.php
```

The default web-client field uses the relative path `/api/greader.php`, intended for a same-origin reverse-proxy deployment. Desktop and Android can use a full HTTPS API address.

## Current foundation

Implemented or scaffolded in the first development milestone:

- Glaze UI social timeline shell
- System/light/dark appearance
- Desktop three-region layout
- Responsive Android/mobile layout with bottom navigation
- FreshRSS ClientLogin authentication
- Subscription loading
- Home, unread, and saved timelines
- Timeline search
- Save/unsave article mutation
- Read/unread article mutation
- Add-feed mutation
- Demo timeline for UI development without credentials
- Plain-text handling of untrusted RSS summary HTML
- HTTP/HTTPS external-link validation
- Web content-security policy
- Minimal Tauri native permissions
- Web unit/build CI
- Linux desktop and Android APK build workflows

## Development

```bash
npm install
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

The native CI workflow performs the same icon-generation sequence automatically.

## Security notes

The current development milestone keeps the FreshRSS API password and returned authentication token in memory only. They are not persisted to browser local storage. Native secure credential persistence is intentionally deferred until a reviewed platform-secure storage implementation is added.

Raw RSS HTML is not injected into the interface. Article summaries are reduced to plain text in this milestone.

See [docs/SECURITY.md](docs/SECURITY.md) for the full trust-boundary notes.

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [Glaze UI contract](docs/GLAZE-UI.md)
- [Security model](docs/SECURITY.md)

## License

MIT. FreshRSS is a separate upstream service and retains its own license and project identity.
