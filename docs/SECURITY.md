# GoreeCloud Feed Security Model

## Trust boundaries

- FreshRSS is the authoritative backend and authorization authority for feed data.
- GoreeCloud Feed is a client and must not weaken FreshRSS user boundaries.
- NetBird or another private network may protect transport reachability but does not replace application authentication.

## Credentials

Use the FreshRSS API password created for the individual user. Do not use the user's primary FreshRSS password in the client.

The development foundation does not persist API passwords or returned authentication tokens. Credentials are held in process/page memory only and are cleared when the application session ends.

Do not put credentials in repository files, screenshots, sample configuration, browser storage, logs, analytics, crash reports, or URLs.

## Transport

Remote FreshRSS endpoints must use HTTPS. Plain HTTP is accepted only for localhost development.

The browser client uses the browser Fetch API and is designed for a same-origin `/api/greader.php` reverse-proxy path.

Desktop and Android use Tauri's Rust HTTP transport for FreshRSS traffic. The Tauri capability restricts that native transport to `https://rss.goreecloud.com/*` and localhost development URLs. Adding another production FreshRSS host requires a deliberate capability review rather than giving the native client unrestricted outbound HTTP access.

## Web publication

The preferred web deployment is same-origin API proxying through the controlled GoreeCloud reverse proxy rather than enabling unrestricted CORS on FreshRSS. The browser frontend can then use `/api/greader.php` while the reverse proxy forwards only the intended FreshRSS API path.

## Content handling

RSS content is untrusted. The timeline currently converts FreshRSS summary HTML to plain text instead of injecting raw feed HTML into the DOM. External links are limited to HTTP/HTTPS and open with `noopener noreferrer`.

Remote article images are displayed only when an enclosure identifies an image MIME type, through normal image elements using `no-referrer`. A future rich article reader must use a reviewed sanitizer and explicit content-security policy before rendering feed HTML.

## Native shell

Tauri starts with core defaults plus the narrowly scoped HTTP capability required for the approved FreshRSS API. No filesystem, shell, clipboard, process, notification, or broad network permission is added by the current milestone.

Future native secure credential storage, notifications, file import/export, offline cache storage, or update mechanisms must receive separate permission and data-handling review before the associated capabilities are added.
