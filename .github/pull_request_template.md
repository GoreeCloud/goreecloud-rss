## Summary

Describe the user-facing or engineering change and why it is needed.

## GoreeCloud boundaries

- [ ] FreshRSS remains the authoritative backend for subscriptions and synchronized feed state.
- [ ] No shared ordinary-user identity or cross-user data exposure is introduced.
- [ ] Glaze UI remains the controlled presentation language for user-facing changes.
- [ ] No reusable credential, token, signing material, or private infrastructure secret is committed.
- [ ] Production FreshRSS, DNS, Caddy, Docker, monitoring, or user data is unchanged unless this PR explicitly documents and validates that scope.

## Validation

- [ ] Unit tests pass.
- [ ] TypeScript checking and web production build pass.
- [ ] Linux desktop build validation passes when native code or packaging changes.
- [ ] Android debug APK validation passes when shared/native mobile code changes.
- [ ] Accessibility and responsive behavior were reviewed for user-facing changes.
- [ ] Security and trust-boundary implications were reviewed.

## Release state

- [ ] This change is still development-only, or the separate production/stable-release gates are explicitly satisfied and documented.

## Follow-up

List known limitations, deferred work, or release gates that remain after this PR.
