# Getting started

## Requirements

- Node.js 22.18+, 24.11+ or 26+ (see `engines` in `package.json`)
- pnpm 11 or newer (Corepack is recommended)
- Git
- Python 3 for `pnpm serve:dist` and the Playwright test server

## Install and run

```bash
git clone https://github.com/Better-Bukidnon/betterbukidnon.git
cd betterbukidnon
corepack enable
pnpm install
pnpm web:dev
```

The Vite development server prints its local URL. The current React app lives in `apps/web`;
run its scripts from the repository root so it uses the shared dependency installation.

## Build and preview

```bash
pnpm web:check
pnpm web:test
pnpm build
pnpm serve:dist
```

`pnpm build` writes the Cloudflare static site to `apps/web/dist/client`. It prerenders routes
and generates the service worker. `pnpm serve:dist` serves those generated files on port 8080.
Use `wrangler.jsonc` as the source of truth for the deployed static directory and environment
routes.

## Repository commands

| Command                             | Purpose                                                        |
| ----------------------------------- | -------------------------------------------------------------- |
| `pnpm web:dev`                      | Start the app development server                               |
| `pnpm web:check`                    | Run app formatting, lint, and TypeScript checks                |
| `pnpm web:test`                     | Run the app's unit and content tests                           |
| `pnpm web:e2e`                      | Run browser checks against the built app                       |
| `pnpm web:build`                    | Build, prerender, and generate the service worker              |
| `pnpm build`                        | Production build entry point                                   |
| `pnpm version:check`                | Print current project version without changing it              |
| `pnpm test`                         | Run the legacy Playwright browser tests                        |
| `pnpm lighthouse`                   | Run Lighthouse CI against a running `pnpm serve:dist`          |
| `pnpm screenshots:mobile`           | Phone-size screenshots of the legacy pages                     |
| `pnpm chrome` / `pnpm chrome:check` | Regenerate or check the legacy pages' shared header and footer |
| `pnpm visual:parity`                | Capture a side-by-side app and legacy comparison               |

### Visual parity review

Build first, then compare a focused set of routes in the supported locales and widths:

```bash
pnpm build
pnpm visual:parity -- --routes=/,/projects,/services --locales=en,fil,ceb --widths=1366,1024,768,375
```

The script serves the legacy root and built app locally, stops both servers when finished, and
writes screenshots plus an opacity-overlay review page to `screenshots/parity/index.html`.
Choose routes explicitly so comparisons stay focused; app clean URLs are matched to their
legacy `.html` sources through `apps/web/public/_redirects`.
Pass `--browser=firefox` or `--browser=webkit` to use another installed Playwright browser.

## Migration and contribution workflow

The user-facing application routes live in `apps/web`. Legacy HTML, CSS, and JavaScript stay
in the repository as visual and behavior references during parity review; see
[architecture.md](architecture.md#legacy-static-pages).

For a new feature, prefer this sequence:

1. Put the page, its components, data loading and tests in `apps/web/src/features/<domain>/`,
   and a thin route in `apps/web/src/routes` that renders it.
2. Validate JSON where the feature loads it, with a Zod schema and `parseContent`.
3. Use shared route links, localization, and layout components rather than duplicating them.
4. Run `pnpm web:check`, `pnpm web:test`, and `pnpm build` for app or deployment changes.
5. Open a pull request into `develop` and describe any content sources or verification limits.

See [architecture.md](architecture.md), [content-guide.md](content-guide.md), and
[deployment.md](deployment.md) for more detail.

## Tests and checks

The Playwright tests need browsers the first time:

```bash
pnpm exec playwright install
pnpm test
pnpm build
pnpm web:e2e
```

`pnpm test` covers the retained legacy pages. `pnpm web:e2e` serves `apps/web/dist/client`
through a local static server that applies the app's trailing-slash and 404 behavior.

GitHub Actions runs Lighthouse CI on pushes and pull requests to `main`
(`.github/workflows/lighthouse.yml`). Accessibility must score 90 or more.

### Phone screenshots

```bash
pnpm screenshots:mobile
```

Saves the first screen and the full page of every legacy page at 320, 375 and 412 px wide to
`screenshots/` (ignored by git) and lists any page that scrolls sideways. It uses your
installed Google Chrome; pass `--browser=chromium` or `--browser=firefox` to use a browser
from `pnpm exec playwright install` instead. Narrow it down with `--pages=home,services` and
`--widths=375`.

For before/after images in a pull request, run it on `develop` and on your branch with
different output folders:

```bash
git switch develop && pnpm screenshots:mobile -- --out=screenshots/before
git switch my-branch && pnpm screenshots:mobile -- --out=screenshots/after
```

## Branches

| Branch           | Purpose                            | Deploys to                                              |
| ---------------- | ---------------------------------- | ------------------------------------------------------- |
| `main`           | Production                         | betterbukidnon.org (Worker `betterbukidnon-production`) |
| `develop`        | Integration                        | dev.betterbukidnon.org (Worker `betterbukidnon`)        |
| feature branches | Your work; open PRs into `develop` | preview URL on `*.workers.dev`                          |

See [deployment.md](deployment.md).
