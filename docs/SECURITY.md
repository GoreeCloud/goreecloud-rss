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

## Web publication

The preferred web deployment is same-origin API proxying through the controlled GoreeCloud reverse proxy rather than enabling unrestricted CORS on FreshRSS. The browser frontend can then use `/api/greader.php` while the reverse proxy forwards only the intended FreshRSS API path.

## Content handling

RSS content is untrusted. The timeline currently converts FreshRSS summary HTML to plain text instead of injecting raw feed HTML into the DOM. External links are limited to HTTP/HTTPS and open with `noopener noreferrer`.

Remote article images are displayed only through normal image elements and use `no-referrer`. A future rich article reader must use a reviewed sanitizer and explicit content-security policy before rendering feed HTML.

## Native shell

Tauri starts with the minimal default capability set. Native plugins and permissions should be added only when a concrete feature requires them.
