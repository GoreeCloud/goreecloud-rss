# GoreeCloud Feed Security Model

## Trust boundaries

- FreshRSS is the authoritative backend and authorization authority for feed data.
- GoreeCloud Feed is a client and must not weaken FreshRSS user boundaries.
- NetBird or another private network may protect transport reachability but does not replace application authentication.
- Preview mode is local demonstration data only and must not perform FreshRSS mutations.

## Credentials

Use the FreshRSS API password created for the individual user. Do not use the user's primary FreshRSS password in the client.

The development foundation does not persist API passwords or returned authentication tokens. Credentials are held in process/page memory only and are cleared when the application session ends or the user signs out.

Do not put credentials in repository files, screenshots, sample configuration, browser storage, logs, analytics, crash reports, or URLs. Credential-bearing API URLs and feed URLs are rejected rather than normalized.

## Transport

Remote FreshRSS endpoints must use HTTPS. Plain HTTP is accepted only for localhost development.

The production browser client uses the browser Fetch API through the fixed same-origin `/api/greader.php` reverse-proxy path. Its CSP does not grant generic cross-origin HTTPS connectivity.

Desktop and Android use Tauri's Rust HTTP transport for FreshRSS traffic. The Tauri HTTP capability and CSP restrict that native transport to `https://rss.goreecloud.com/*` and localhost development URLs. Adding another production FreshRSS host requires a deliberate capability review rather than giving the native client unrestricted outbound HTTP access.

## Web publication

The production web deployment is same-origin API proxying through the controlled GoreeCloud reverse proxy rather than enabling unrestricted CORS on FreshRSS. The browser frontend uses `/api/greader.php` while the reverse proxy forwards only the intended FreshRSS API path.

## Content handling

RSS content is untrusted. The timeline currently converts FreshRSS summary HTML to plain text instead of injecting raw feed HTML into the DOM. External links are limited to HTTP/HTTPS and open with `noopener noreferrer`.

Remote article images are displayed only when an enclosure identifies an image MIME type, through normal image elements using `no-referrer`. A future rich article reader must use a reviewed sanitizer and explicit content-security policy before rendering feed HTML.

## Native shell

Tauri starts with core defaults plus the narrowly scoped HTTP capability required for the approved FreshRSS API. No filesystem, shell, process, notification, or broad network permission is added by the current milestone.

The native Rust compiler is pinned by `rust-toolchain.toml`, and native validation also uses the committed Cargo lockfile. Compiler/dependency changes therefore require visible source changes rather than silently entering an unchanged validation run.

Future native secure credential storage, notifications, file import/export, offline cache storage, or update mechanisms must receive separate permission and data-handling review before the associated capabilities are added.

## Validation boundary

Passing source, web, Debian-package, and Android debug-APK validation demonstrates that the tested revision satisfies the automated contracts currently encoded in the repository. It does not substitute for real multi-user isolation testing, representative Glaze UI/accessibility acceptance, release signing, production publication controls, monitoring/recovery review, or final release provenance.
