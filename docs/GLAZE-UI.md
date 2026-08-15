# GoreeCloud Feed — Glaze UI Contract

GoreeCloud Feed uses Glaze UI as a release requirement, not an optional theme.

The application adapts social-feed interaction patterns without reproducing another company's visual identity. The UI should feel like GoreeCloud first.

## Feed-specific expression

- A centered chronological timeline is the primary reading surface.
- Article entries use rounded layered cards with restrained depth.
- Source identity, article context, publication recency, and unread state appear before engagement-style actions.
- Save, read-state, share, and open-original actions replace social-network reaction metrics.
- Desktop uses left navigation, centered timeline, and contextual right rail.
- Mobile uses a compact top search surface and bottom navigation.
- The interface communicates that the timeline is user-chosen RSS, not algorithmic social ranking.

## Shared Glaze requirements

- Selective translucent surfaces, never glass everywhere.
- Soft rounded geometry.
- Restrained shadows and purposeful gradients.
- Clear typography and generous spacing.
- System, light, and dark appearance behavior.
- Visible keyboard focus.
- Practical touch targets.
- Reduced-motion support.
- Increased-contrast and forced-colors fallbacks.
- Solid-surface fallback when backdrop filtering is unavailable.
- No remote fonts, analytics, ad scripts, tracking pixels, or remote UI framework assets.

## Completion boundary

The current implementation is a development foundation. Visual acceptance must still be performed on desktop, Android, and responsive web viewports before a stable release.
