# GoreeCloud Feed

GoreeCloud Feed is a GoreeCloud-owned, open-source RSS client experience built around FreshRSS as the authoritative feed backend.

The project targets:

- Web / PWA
- Linux desktop
- Android APK

The product direction is a social-feed-style reader inspired by the interaction clarity of modern social applications while remaining visually distinct through GoreeCloud Glaze UI.

## Current status

Foundation development has started. FreshRSS remains the backend and source of truth; this repository is the client layer.

## Core principles

- FreshRSS Google Reader-compatible API integration
- Individual FreshRSS user identities; no shared application identity
- Privacy by default and no analytics or tracking dependencies
- Glaze UI across every controlled user-facing surface
- Responsive desktop, tablet, and mobile layouts
- One shared TypeScript/React presentation layer where practical
- Reproducible web, desktop, and Android builds
- Offline-friendly local cache without creating a second authoritative feed database

## Development

Implementation work is developed on feature branches and reviewed through pull requests before merge.
