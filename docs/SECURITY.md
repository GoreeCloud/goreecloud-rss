# GoreeCloud Feed Security Model

## Trust boundaries

- FreshRSS is the authoritative backend and authorization authority for feed data.
- GoreeCloud Feed is a client and must not weaken FreshRSS user boundaries.
- NetBird or another private network may protect transport reachability but does not replace application authentication.
- Browser and native network reachability are intentionally narrower than arbitrary user-selected remote API access.

## Credentials and session state

Use the FreshRSS API password created for the individual user. Do not use the user's primary FreshRSS password in the client.

The current development foundation does not persist API passwords or returned authentication tokens. Credentials are held in process/page memory only. The application provides functional sign-out that clears the active account reference, loaded subscription/article data, search state, and view state before returning to the login surface.

Do not put reusable credentials in repository files, screenshots, sample configuration, browser storage, logs, analytics, crash reports, URLs, feed URLs, or API addresses.

The URL validation layer rejects API and feed URLs containing embedded username/password credentials.

## Production API endpoint selection

Production endpoint selection is a source-controlled security boundary rather than a user preference.

- Browser production requests use same-origin `/api/greader.php`.
- Linux desktop and Android production requests use `https://rss.goreecloud.com/api/greader.php`.
- `VITE_FRESHRSS_API_BASE` is honored only during Vite development mode for approved isolated development targets.

The production login surface exposes the selected API address as read-only and does not permit an arbitrary production API host.

## Browser transport

The browser uses the ordinary Fetch API.

The browser Content Security Policy restricts `connect-src` to:

- the application origin; and
- localhost development endpoints.

It does not grant a broad `https:` connection allowance. The intended production publication design is therefore the same-origin `/api/greader.php` reverse-proxy boundary rather than unrestricted cross-origin FreshRSS access or permissive CORS.

## Native transport

Desktop and Android use Tauri's Rust HTTP transport for FreshRSS traffic.

Two controls constrain native network access:

1. The Tauri HTTP capability allows `https://rss.goreecloud.com/*` and localhost development URLs.
2. The Tauri CSP restricts production `connect-src` to `https://rss.goreecloud.com`, Tauri IPC, and localhost development endpoints.

Adding another production FreshRSS host requires deliberate source, capability, CSP, and security review rather than granting unrestricted native outbound HTTP access.

No filesystem, shell, clipboard, process, notification, broad network, or secure-storage permission is added by the current milestone.

## Transport requirements

Remote FreshRSS endpoints must use HTTPS. Plain HTTP is accepted only for localhost development.

API normalization rejects malformed addresses and credential-bearing URLs. Authentication failures and malformed ClientLogin responses are surfaced as bounded application errors rather than raw URL-parser failures.

## Content handling

RSS content is untrusted.

The timeline currently converts FreshRSS summary/content HTML to plain text instead of injecting raw feed HTML into the DOM. External article and source links are accepted only for HTTP/HTTPS URLs without embedded credentials and open with `noopener noreferrer`.

Remote article images are displayed only when an enclosure identifies an image MIME type. Images use `no-referrer`. The browser CSP allows remote HTTPS images but does not extend that permission to API connections.

A future rich article reader must use a reviewed sanitizer and explicit content-security policy before rendering feed HTML.

## Dependency and supply-chain controls

The repository commits deterministic JavaScript and Rust dependency locks:

- `package-lock.json`
- `src-tauri/Cargo.lock`

Client CI uses `npm ci` and performs `npm audit --audit-level=high`. Native validation also uses `npm ci` and checks the Cargo graph in `--locked` mode before packaging.

Dependabot is configured for npm, Cargo, and GitHub Actions maintenance. A dependency update still requires normal review and validation; automated discovery does not authorize automatic production release.

## Glaze UI and browser privacy contract

Source-controlled tests protect selected Glaze UI and privacy invariants, including:

- the controlled Glaze UI shell marker;
- accessible skip/navigation state;
- System/Light/Dark appearance cycling;
- local browser UI dependency posture;
- private-app noindex metadata;
- same-origin referrer metadata;
- the restricted browser API connection policy; and
- absence of placeholder Notifications/Settings controls.

These automated checks supplement, but do not replace, manual visual and accessibility acceptance.

## Future security review gates

The following features require separate security/design review before production approval:

- secure native credential persistence;
- offline article/cache storage;
- notifications;
- file import/export capabilities;
- richer HTML/media rendering;
- native update mechanisms;
- release signing and key handling; and
- broader network permissions.

Real isolated FreshRSS multi-user authentication/data-isolation testing, controlled production web publication, target-device validation, monitoring/failure behavior, backup/recovery implications, and exact release provenance remain production-readiness gates.
