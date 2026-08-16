# GoreeCloud Feed Release and Stable Promotion

## Purpose

This document defines the repository-level release boundary for GoreeCloud Feed. It does not authorize production publication by itself.

FreshRSS remains authoritative for user accounts, subscriptions, categories, article state, and multi-user data. A GoreeCloud Feed release packages client software only.

Stable status is **target-specific**. A web release may be Stable while Linux desktop and Android remain development/acceptance targets when their native-only release gates are not yet satisfied. No Stable designation for one target may be generalized to another target without completing the applicable gates for that target.

## Version identity

The `0.1.0` Stable line is the first GoreeCloud Feed release line. During development, `package.json` may use a `-dev.N` qualifier while Tauri and Cargo retain the target Stable base version. `npm run release:check` verifies that these identities remain aligned and that the approved product name, application identifier, private npm-package status, and MIT license have not drifted.

A release candidate should move the npm package identity from `-dev.N` to an approved `-rc.N` qualifier only as part of a controlled candidate cut. A final Stable source release removes the prerelease qualifier so npm, Tauri, and Cargo identify the same `MAJOR.MINOR.PATCH` release.

Before a release candidate or Stable release is cut, update version metadata deliberately and synchronize affected lock metadata with the approved package managers. Do not hand-edit deterministic lockfiles merely to make version checks pass.

## Automated candidate evidence

Every candidate must pass the exact source revision being evaluated:

- locked JavaScript dependency installation;
- release metadata validation;
- unit and source-controlled Glaze UI/security contracts;
- TypeScript checking and production Vite build;
- high-severity npm dependency audit;
- locked Cargo metadata validation with the pinned Rust toolchain.

When native targets are in scope, candidate evidence must additionally include the applicable Linux and Android build validation. Native CI artifacts include:

- `SHA256SUMS` for the packaged files;
- `SOURCE_REVISION` identifying the exact Git commit and workflow run;
- `RELEASE_METADATA_VALIDATION.txt` proving the release identity contract passed during that build.

CI development artifacts are acceptance evidence. They are not automatically final release artifacts.

## Web Stable promotion gates

Do not mark the web target Stable until all web-applicable gates are complete and documented:

1. Exact-head Client CI is green for locked dependencies, release metadata, tests, type checking, production build, and the configured vulnerability threshold.
2. FreshRSS compatibility is verified against the approved production FreshRSS version using isolated test identities and synthetic/non-sensitive data.
3. Multi-user authentication and data isolation are verified; one user's subscriptions, categories, read state, saved state, or credentials must not appear in another user's session.
4. The controlled same-origin browser API publication path is validated without broadening browser network permissions.
5. Representative responsive web Glaze UI visual and accessibility behavior is accepted, including light/system/dark appearance and keyboard/modal behavior covered by the repository contracts.
6. Core web mutations are validated against FreshRSS: read/unread, save/unsave, add-feed, manage/unfollow, search/category state, and authoritative refresh behavior.
7. Production web image creation produces exact source-revision evidence and an immutable digest suitable for tag-and-digest deployment pinning.
8. Monitoring/failure behavior, service recovery, and rollback implications are reviewed for the stateless web frontend and its FreshRSS dependency.
9. The final version metadata and deterministic lockfiles are synchronized and validated.
10. The pull request is deliberately promoted from draft and merged only after the accepted source revision is identified.

## Native Stable promotion gates

Linux desktop and Android must not be represented as Stable distributed native releases until their target-specific gates are complete. These include, as applicable:

1. Exact-head native CI/build validation.
2. Representative Glaze UI visual/accessibility acceptance on the target platform.
3. Installation, upgrade, rollback, and uninstall validation on representative target systems/devices.
4. Release signing and signing-key handling for every artifact that requires signing.
5. Secure credential persistence review before persistent native sign-in is enabled.
6. Final native artifacts built from the exact approved source revision with retained hashes and provenance.
7. Target-specific update and recovery behavior documented and validated.

The current Android development/debug APK must never be represented as a production-signed Stable Android artifact.

## Web 0.1.0 promotion record

Web 0.1.0 is the first Stable web release line. Its acceptance baseline includes the controlled private `feed.goreecloud.com` publication path, FreshRSS 1.29.1 API compatibility, isolated test-account validation, add/remove subscription mutation testing, read/saved state testing, category/search behavior, Share clipboard fallback feedback, Glaze UI light/system/dark acceptance, and immutable GHCR image deployment by tag plus digest.

Linux and Android remain development/acceptance targets on the same source line until the native Stable gates above are completed.

## Signing boundary

Signing keys, passwords, recovery material, or reusable signing credentials must not be committed to this repository, written into ordinary documentation, or embedded in workflow source. Any future signing workflow must use an approved secret-storage boundary and least-privilege access.

## Release evidence retention

For each accepted release, retain at minimum:

- release version;
- target/platform status;
- Git commit SHA;
- workflow/run identity or equivalent controlled build record;
- package/image hashes or digest;
- signing status where applicable;
- acceptance result;
- known limitations;
- rollback/recovery reference.

This evidence distinguishes a reproducible GoreeCloud release from an untracked local build.
