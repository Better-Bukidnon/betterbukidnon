# Getting started

## Requirements

- Node.js 22.18+, 24.11+ or 26+ (see `engines` in `package.json`)
- pnpm 11 or newer (Corepack is recommended)
- Git
- Python 3 for `pnpm serve:dist`

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

| Command              | Purpose                                               |
| -------------------- | ----------------------------------------------------- |
| `pnpm web:dev`       | Start the app development server                      |
| `pnpm web:check`     | Run app formatting, lint, and TypeScript checks       |
| `pnpm web:test`      | Run the app's unit and content tests                  |
| `pnpm web:build`     | Build, prerender, and generate the service worker     |
| `pnpm build`         | Production build entry point                          |
| `pnpm version:check` | Print current project version without changing it     |
| `pnpm lighthouse`    | Run Lighthouse CI against a running `pnpm serve:dist` |

## Contribution workflow

The user-facing application routes live in `apps/web`.

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

GitHub Actions runs Lighthouse CI on pushes and pull requests to `main`
(`.github/workflows/lighthouse.yml`). Accessibility must score 90 or more.

## Branches

| Branch           | Purpose                            | Deploys to                                              |
| ---------------- | ---------------------------------- | ------------------------------------------------------- |
| `main`           | Production                         | betterbukidnon.org (Worker `betterbukidnon-production`) |
| `develop`        | Integration                        | dev.betterbukidnon.org (Worker `betterbukidnon`)        |
| feature branches | Your work; open PRs into `develop` | preview URL on `*.workers.dev`                          |

See [deployment.md](deployment.md).
