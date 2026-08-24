# Mandatory Native and Platform Conformance

Effective August 24, 2026, this GoreeCloud application must be built and maintained as original GoreeCloud-owned software from the ground up.

Small, technically necessary foundational dependencies remain permitted where independent reimplementation would reduce security, correctness, interoperability, standards compliance, or maintainability. Examples include WireGuard, cryptographic and encryption libraries, protocol libraries, codecs, database engines, operating-system APIs, and comparable critical foundations. Such dependencies must not become the application shell or define the GoreeCloud product identity.

The application must implement and remain current with the latest approved contracts for Glaze UI, Wardveil Security, GoreeCloud Privacy Shield, and Everkeep. All four integrations are mandatory and must be substantive and evidence-backed.

No release or service state may be classified or retained as Stable unless native application qualification and current validated conformance with all four platform systems are complete. A missing, materially incomplete, unvalidated, or materially outdated integration is a Stable blocker.

If this repository contains inherited or upstream-derived application code, that code is transitional or historical. It may be maintained for security, continuity, migration, compatibility, recovery, and rollback while a native replacement is developed, but it is not the approved final architecture.

Repository CI, release documentation, project specifications, and change logs must progressively enforce and record this contract.