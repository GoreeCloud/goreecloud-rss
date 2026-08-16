# GoreeCloud Feed production deployment

This directory defines the Stable web deployment boundary for GoreeCloud Feed.

## Current Stable release

- Release: `0.1.0`
- Stable source revision: `ae989d0cd3bd1129689d2c7630400dbe5903b294`
- Stable Web Image workflow run: `31937492517`
- Approved image: `ghcr.io/goreecloud/goreecloud-rss-web:0.1.0-ae989d0cd3bd@sha256:fcec3902a9c65ed51e15cf52b1c5254cd968fef8684daf744ee36e295ca40575`
- Target: web
- Native Linux/Android status: development/acceptance; not Stable distributed releases

The active server-side `.env` value is protected configuration and must use the approved tag-and-digest image reference. Do not replace it with `latest`, `stable`, a digest-only convenience reference, or a floating tag.

## Production identity

The production Compose project, service, container, and stack directory use the stable name `goreecloud-feed`. The previous `goreecloud-feed-staging` identity is a temporary acceptance identity and should be retired only after the production stack and Caddy route have been validated.

The frontend publishes no host port. Caddy reaches it over the existing external `proxy` Docker network at `goreecloud-feed:8080`. The same-origin FreshRSS API path remains routed directly from Caddy to `freshrss:80` and is restricted to the NetBird `100.64.0.0/10` source range.

## Required validation

Before activation:

1. Preserve the current Caddyfile and current staging `.env` image reference for rollback.
2. Validate the resolved production Compose configuration with `docker compose config`.
3. Confirm no host `ports:` are published.
4. Pull the exact approved tag-and-digest image.
5. Start the production container and require Docker health `healthy`.
6. Confirm the production container is attached only to the required `proxy` network.
7. Update the existing `feed.goreecloud.com` Caddy upstream from `goreecloud-feed-staging:8080` to `goreecloud-feed:8080`.
8. Run `caddy validate` before reload.
9. Reload Caddy and verify HTTPS, authentication, FreshRSS reads/mutations, and the web health path.
10. Keep the staging container and previous image available until the Stable production path has been validated and the rollback window is accepted.

## Rollback

If production validation fails, restore the preserved Caddyfile so `feed.goreecloud.com` routes back to `goreecloud-feed-staging:8080`, validate and reload Caddy, then confirm the previously validated staging service is healthy before troubleshooting the Stable production stack.
