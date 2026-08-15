# GoreeCloud Feed Release and Stable Promotion

## Purpose

This document defines the repository-level release boundary for GoreeCloud Feed. It does not authorize production publication by itself.

FreshRSS remains authoritative for user accounts, subscriptions, categories, article state, and multi-user data. A GoreeCloud Feed release packages the client software only.

## Version identity

The current development package is on the `0.1.0` Stable line. During development, `package.json` may use a `-dev.N` qualifier while Tauri and Cargo retain the target Stable base version. `npm run release:check` verifies that these identities remain aligned and that the approved product name, application identifier, private npm-package status, and MIT license have not drifted.

Before a release candidate or Stable release is cut, update version metadata deliberately and regenerate affected lock metadata with the approved package managers. Do not hand-edit deterministic lockfiles merely to make version checks pass.

## Automated candidate evidence

Every candidate must pass the exact source revision being evaluated:

- locked JavaScript dependency installation;
- release metadata validation;
- unit and source-controlled Glaze UI/security contracts;
- TypeScript checking and production Vite build;
- high-severity npm dependency audit;
- locked Cargo metadata validation with the pinned Rust toolchain;
- Linux Debian package generation;
- Android APK generation for development/acceptance validation.

Native CI artifacts include:

- `SHA256SUMS` for the packaged files;
- `SOURCE_REVISION` identifying the exact Git commit and workflow run;
- `RELEASE_METADATA_VALIDATION.txt` proving the release identity contract passed during that build.

CI development artifacts are acceptance evidence. They are not automatically final release artifacts.

## Stable promotion gates

Do not mark GoreeCloud Feed Stable until all applicable gates are complete and documented:

1. Exact-head Client CI, Linux packaging, and Android packaging are green.
2. FreshRSS compatibility is verified against the approved production FreshRSS version using isolated test identities and synthetic/non-sensitive data.
3. Multi-user authentication and data isolation are verified; one user's subscriptions, categories, read state, saved state, or credentials must not appear in another user's session.
4. The controlled same-origin browser API publication path is validated without broadening browser network permissions.
5. Representative web, Linux, and Android Glaze UI visual and accessibility acceptance is completed.
6. Release signing and signing-key handling are approved for every distributed native artifact that requires signing.
7. Installation, upgrade, rollback, and uninstall behavior is validated on representative target systems.
8. Monitoring, failure behavior, support expectations, and backup/recovery implications are reviewed and documented.
9. Final release artifacts are built from the exact approved source revision and their hashes/provenance are retained with the release record.
10. The final version metadata and deterministic lockfiles are synchronized and validated.
11. The draft pull request is reviewed and deliberately promoted; a green build alone does not authorize merge or Stable status.

## Signing boundary

The current Android workflow produces an unsigned/debug acceptance APK. It must never be represented as a production-signed Android Stable artifact.

Signing keys, passwords, recovery material, or reusable signing credentials must not be committed to this repository, written into ordinary documentation, or embedded in workflow source. Any future signing workflow must use an approved secret-storage boundary and least-privilege access.

## Release evidence retention

For each accepted release, retain at minimum:

- release version;
- Git commit SHA;
- workflow/run identity or equivalent controlled build record;
- package hashes;
- target/platform identity;
- signing status where applicable;
- acceptance result;
- known limitations;
- rollback/recovery reference.

This evidence distinguishes a reproducible GoreeCloud release from an untracked local build.
