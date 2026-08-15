# GoreeCloud Feed Private Staging

This directory defines the repository-controlled staging publication model for GoreeCloud Feed. It does not authorize Stable promotion or public exposure.

## Approved staging identity

- Service: GoreeCloud Feed
- Purpose: private acceptance and FreshRSS compatibility testing
- Private hostname: `feed.goreecloud.com`
- Private destination: `100.71.27.119:443` through NetBird and Caddy
- Frontend container: `goreecloud-feed-staging:8080`
- FreshRSS API upstream: `freshrss:80`
- Shared Docker network: `proxy`
- Backend host ports: none
- Browser API path: same-origin `/api/greader.php`
- Authentication authority: individual FreshRSS accounts and API passwords

## Host layout

The intended stack path follows the GoreeCloud Docker structure:

```text
/srv/docker/stacks/goreecloud-feed-staging/
├── docker-compose.yml
├── .env
└── README.md
```

The current active Caddyfile remains `/srv/docker/caddy/Caddyfile` until the separately planned Caddy-directory migration is completed.

## Image selection

The `Staging Web Image` GitHub Actions workflow publishes a unique GHCR image tag derived from the package version and exact Git revision. Use the tag-and-digest reference recorded in the workflow artifact `goreecloud-feed-staging-image-evidence`.

Example shape only:

```text
GOREECLOUD_FEED_IMAGE=ghcr.io/goreecloud/goreecloud-rss-web:0.1.0-dev.1-<short-sha>@sha256:<approved-digest>
```

Do not deploy a mutable `latest`, `main`, `staging`, or branch-only tag as the authoritative staging reference.

## Deployment sequence

1. Confirm exact-head Client CI, Native Build Validation, and Staging Web Image are green for the candidate source revision.
2. Download or record the `IMAGE_REFERENCE` evidence from the staging-image workflow.
3. Back up the active `/srv/docker/caddy/Caddyfile` before editing it.
4. Create `/srv/docker/stacks/goreecloud-feed-staging/` with restrictive administrative ownership.
5. Copy `docker-compose.yml` into that stack directory.
6. Create a protected `.env` containing only the approved `GOREECLOUD_FEED_IMAGE` tag-and-digest reference.
7. Run `docker compose config` and confirm no host `ports:` are rendered.
8. Pull the exact image and start only `goreecloud-feed-staging`.
9. Confirm the container is healthy and attached only to the existing `proxy` network.
10. Add the repository-provided `feed.goreecloud.com` site block to the current active Caddyfile. Do not copy literal Porkbun credentials into the Caddyfile.
11. Validate the complete Caddyfile before reload/recreation.
12. Create the AdGuard Home private DNS rewrite `feed.goreecloud.com -> 100.71.27.119` through the supported AdGuard administration interface.
13. Confirm the appropriate NetBird client group is explicitly permitted to reach the VPS on TCP 443. Do not broaden unrelated NetBird policies.
14. Reload Caddy using the established Caddy operational procedure.
15. Validate DNS, HTTPS, access restriction, UI routing, FreshRSS login, subscription/category isolation, read state, saved state, add-feed behavior, and logs.
16. Add monitoring only after the private route is functioning correctly.
17. Record the live change in the applicable GoreeCloud DNS, Caddy, Docker, monitoring, and Feed change records.

## Required validation

From an approved NetBird client:

```bash
dig +short feed.goreecloud.com
curl -I https://feed.goreecloud.com
```

Expected private DNS result:

```text
100.71.27.119
```

From the VPS, force the private Caddy endpoint when validating routing:

```bash
curl -I \
  --resolve feed.goreecloud.com:443:100.71.27.119 \
  https://feed.goreecloud.com
```

Verify the certificate:

```bash
openssl s_client \
  -connect 100.71.27.119:443 \
  -servername feed.goreecloud.com \
  </dev/null 2>/dev/null |
openssl x509 -noout -issuer -subject -ext subjectAltName -dates
```

Verify container exposure and network membership:

```bash
cd /srv/docker/stacks/goreecloud-feed-staging
sudo docker compose ps
sudo docker inspect goreecloud-feed-staging --format '{{json .NetworkSettings.Networks}}'
sudo docker network inspect proxy
```

The staging container must have no public or loopback host-port mapping. Caddy owns TCP 80/443 and reaches the container over `proxy`.

## Application acceptance

Use isolated non-sensitive FreshRSS test identities before real-user acceptance. Verify that each test identity can see only its own subscriptions, categories, read/unread state, and saved state. Test sign-out between identities and confirm no prior account state remains in the client.

Also verify web Glaze UI behavior for keyboard focus, modal containment, System/Light/Dark appearance, reduced motion, zoom/reflow, mobile navigation, and representative touch use.

## Rollback

If staging validation fails:

1. Restore the previous active Caddyfile and validate it before reload.
2. Remove the `feed.goreecloud.com` private DNS rewrite.
3. Stop and remove only the `goreecloud-feed-staging` container/stack.
4. Preserve the failed image reference and logs long enough for troubleshooting; do not delete unrelated rollback images.
5. Confirm `rss.goreecloud.com` FreshRSS remains unchanged and healthy.
6. Record the failed attempt and corrective action before another deployment attempt.

Because the staging web container is stateless, rollback does not require restoring application data. FreshRSS remains the authoritative data store and is not modified as part of container rollback.
