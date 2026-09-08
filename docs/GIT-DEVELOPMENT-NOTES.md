# GoreeCloud Feed Development Notes

## Development workflow

GoreeCloud Feed development follows the Glaze UI design system and keeps the FreshRSS API boundary explicit.

## Commit expectations

Changes should include:

- a focused commit message describing the product change
- updated documentation when behavior changes
- validation evidence when changing build or release paths
- no accidental credential or generated-secret files

## Current priorities

- continue polishing the Glaze UI reading experience
- improve desktop and mobile parity
- maintain FreshRSS compatibility
- keep Stable release boundaries target-specific

## Product polish roadmap

Upcoming improvements should continue the unified GoreeCloud experience:

- refine article cards with stronger hierarchy and clearer reading states
- improve responsive navigation transitions across desktop, tablet, and mobile
- expand Glaze UI component consistency across RSS interactions
- improve empty states, loading states, and error recovery experiences
- continue accessibility validation for keyboard and touch workflows

## Release discipline

Feature work should preserve:

- FreshRSS as the authoritative feed backend
- user-controlled subscriptions as the timeline source
- privacy-first credential handling
- reproducible builds and documented validation
