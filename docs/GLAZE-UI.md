# GoreeCloud Feed — Glaze UI Contract

GoreeCloud Feed uses Glaze UI as a release requirement, not an optional theme.

The application adapts useful social-feed interaction patterns without reproducing another company's visual identity. The interface must remain recognizably GoreeCloud first.

## Feed-specific expression

- A centered chronological timeline is the primary reading surface.
- Article entries use rounded layered cards with restrained depth.
- Source identity, article context, publication recency, and unread state appear before engagement-style actions.
- Save, read-state, share, and open-original actions replace social-network reaction metrics.
- Desktop uses left navigation, centered timeline, and a contextual right rail.
- Mobile uses a compact top search surface and bottom navigation.
- The interface communicates that the timeline is user-chosen RSS, not algorithmic social ranking.
- Controls are presented only when the current milestone provides functional behavior; unfinished Notifications, Settings, category filtering, or overflow actions are not exposed as inert interface elements.

## Shared Glaze requirements

- Selective translucent surfaces, never glass everywhere.
- Soft rounded geometry.
- Restrained shadows and purposeful gradients.
- Clear typography and generous spacing.
- System, Light, and Dark appearance behavior, including a path back to System mode.
- Visible keyboard focus.
- Practical touch targets.
- Accessible navigation state and a keyboard skip target.
- Reduced-motion support.
- Increased-contrast and forced-colors fallbacks.
- Solid-surface fallback when backdrop filtering is unavailable.
- Responsive behavior that preserves access to essential controls.
- No remote fonts, analytics, ad scripts, tracking pixels, or remote UI framework assets.

## Privacy-conscious interface behavior

Glaze UI presentation must not weaken GoreeCloud privacy or security boundaries.

For Feed this includes:

- private-app noindex metadata;
- same-origin referrer metadata;
- no browser persistence of reusable FreshRSS credentials in the current milestone;
- fixed production API routing rather than an unrestricted remote-host selector;
- clear sign-out/preview-exit behavior; and
- no remote browser UI dependency required to render the controlled application shell.

## Source-controlled contract

`src/glaze-ui.test.ts` protects selected shell, accessibility, appearance, browser privacy, and placeholder-control invariants. `src/native-security.test.ts` protects the narrow native HTTP capability and Tauri network CSP.

These tests make important release expectations reviewable and regression-resistant. They do not attempt to test subjective visual quality.

## Manual acceptance boundary

Automated checks do not replace visual and interaction review.

Before a Stable release, GoreeCloud Feed still requires representative acceptance across web, Linux desktop, and Android for applicable widths, System/Light/Dark appearance, keyboard and touch use, zoom/reflow, reduced motion, increased contrast, forced colors where supported, and other relevant accessibility behavior.

The current implementation remains a development foundation until those and the broader GoreeCloud production-readiness gates are satisfied.
