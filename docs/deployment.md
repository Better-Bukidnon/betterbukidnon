# Deployment

The site runs on **Cloudflare Workers** as static assets. There is no Worker script:
Cloudflare serves the files that `npm run build` writes to `out/`. Configuration is in
[`wrangler.jsonc`](../wrangler.jsonc).

## Environments

| Environment                                 | Branch         | Worker                             | Domain                                 |
| ------------------------------------------- | -------------- | ---------------------------------- | -------------------------------------- |
| Development (top level of `wrangler.jsonc`) | `develop`      | `betterbukidnon`                   | dev.betterbukidnon.org                 |
| Production (`env.production`)               | `main`         | `betterbukidnon-production`        | betterbukidnon.org                     |
| Previews                                    | other branches | `betterbukidnon` (preview version) | `*.workers.dev` preview URL, `noindex` |

Asset settings shared by both environments:

- `assets.directory: ./out`
- `html_handling: auto-trailing-slash`: `/services/health` serves `services/health.html`, and
  `/services/health/` redirects to it. The Next export uses `trailingSlash: false`, which
  produces exactly these file names, so every URL from the old site still works.
- `not_found_handling: 404-page`: unknown paths get `out/404.html` (from
  `src/app/not-found.tsx`) with status 404

Custom domains are declared in `routes` for each environment and applied on deploy. Do not
add or remove them in the Cloudflare dashboard; change `wrangler.jsonc` instead. Production
sets its own `routes` so it does not inherit `dev.betterbukidnon.org`.

## Automatic deploys (Workers Builds)

Each Worker is connected to this repository through Cloudflare Workers Builds, which runs the
build command and then deploys `out/`:

- `betterbukidnon` deploys `develop` with `npx wrangler deploy`
- `betterbukidnon-production` deploys `main` with `npx wrangler deploy --env production`
- For other branches, Workers Builds runs `npx wrangler preview`, which is why
  `wrangler.jsonc` has a `previews` block and `preview_urls: true`

The build and deploy commands are stored in the Cloudflare dashboard (Workers & Pages → the
Worker → Settings → Builds), not in this repository.

> **Manual step at cutover.** Set the build command of **both** Workers to `npm run build`.
> The old command (`bash build.sh --no-bump` or similar) no longer works because `build.sh`
> is gone. Nobody can make this change from the repository; do it in the dashboard before
> the first deploy of the React site.

Workers Builds installs dependencies from `package-lock.json` before running the build. The
build itself needs no network access, because fonts, icons and data are all local.

## Versioning

`public/version.json` holds the site version shown in the footer. The build only reads it;
it never bumps it. Change it on purpose, in its own commit, with:

```bash
npm run version:patch   # 2.0.0 → 2.0.1 (also: version:minor, version:major)
npm run version:check   # print the current version
```

`scripts/bump-version.js` updates `public/version.json` (including `lastUpdated`) and the
`version` in `package.json`.

## Security headers (`public/_headers`)

`public/_headers` is copied into `out/` and applied by Cloudflare's static-assets runtime. It
sets, for every path:

- `Content-Security-Policy` (below)
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` with geolocation, microphone, camera, payment and USB disabled
- `X-Frame-Options: SAMEORIGIN` (and `frame-ancestors 'self'` in the CSP)
- `Strict-Transport-Security: max-age=31536000; includeSubDomains`

It also sets `Cache-Control: public, max-age=31536000, immutable` on `/_next/static/*` (the
file names are content-hashed) and `no-cache` on `/sw.js`, so browsers always check for a new
service worker.

### The CSP decision

`script-src` allows `'unsafe-inline'`. Next's static export inlines small per-page bootstrap
scripts (`self.__next_f.push(…)`), and their content, and therefore their hashes, changes on
every build. A hash-based policy would need a post-build step that rewrites `_headers` for
every page; that was deferred when the decision was made (M1) and can be revisited now that
the legacy pages, with their inline scripts and `onclick` handlers, are gone. The rest of the
policy is strict: `default-src 'self'`, `object-src 'none'`, `base-uri 'self'`,
`form-action 'self'`.

The policy allow-lists the third parties the site uses:

| Directive     | Allows                                                                      |
| ------------- | --------------------------------------------------------------------------- |
| `connect-src` | Open-Meteo, open.er-api.com, Facebook Graph and plugin                      |
| `img-src`     | `'self'`, `data:`, `blob:` and any `https:` source (map tiles, Facebook)    |
| `frame-src`   | Google (Maps embed), Facebook plugin domains                                |
| `script-src`  | `'self'`, `'unsafe-inline'`, `connect.facebook.net`                         |

Origins that only the legacy pages needed (jsDelivr, unpkg, Google Fonts) are not used by the
React site; remove any that remain in `_headers`.

When you add a new third-party service, add its origin to the right directive, or the
browser will block it. Check the browser console on the dev site after deploying: CSP
violations are logged there.

## Manual deploy

```bash
npm ci
npm run build
npx wrangler login                      # once
npx wrangler deploy                     # development → dev.betterbukidnon.org
npx wrangler deploy --env production    # production  → betterbukidnon.org
```

`npx wrangler dev` serves `out/` locally with the same `html_handling` and 404 behaviour.

## Releasing to production

1. Merge feature branches into `develop`. CI (`ci.yml`) must pass: lint, typecheck, test,
   build.
2. Check the dev site (dev.betterbukidnon.org) in all three languages and at phone width.
3. Open a pull request from `develop` into `main`. Lighthouse CI (`lighthouse.yml`) runs on
   it and fails if accessibility scores below 90.
4. Merge. Workers Builds deploys `main` to betterbukidnon.org.

## Before the first production launch

- [ ] Change the Workers Builds build command to `npm run build` for both Workers (see
      above).
- [ ] Confirm every **Verify** item in [bukidnon-facts.md](bukidnon-facts.md), especially
      the hotline numbers in the hotline bar and the Provincial Government's Facebook page
      URL.
- [ ] Regenerate `public/assets/images/banners/opengraph.png` from the finished homepage (a
      1200×630 screenshot) if the homepage changed.
- [ ] Set up email routing for `volunteer@betterbukidnon.org` (Cloudflare Email Routing on
      the betterbukidnon.org zone). The address is used in the footer, the volunteer popup
      and the legal pages.
- [ ] Decide on analytics. None is installed. Cloudflare Web Analytics can be turned on for
      the Worker without code changes; update the privacy page (`src/features/legal/`) if you
      do.
- [ ] Run Lighthouse on the dev site and keep accessibility at 90 or more.
