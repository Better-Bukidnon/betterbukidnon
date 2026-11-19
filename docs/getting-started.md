# Getting Started

## Requirements

- Node.js 20.9 or newer (CI uses Node 22)
- Git
- Optional: [Wrangler](https://developers.cloudflare.com/workers/wrangler/) for previewing
  and deploying (`npx wrangler` works without a global install)

No Python, no global build tools and no network access are needed for a build: fonts, icons
and all site data are local.

## Run the site locally

```bash
git clone https://github.com/Better-Bukidnon/betterbukidnon.git
cd betterbukidnon
npm install
npm run dev            # http://localhost:3000
```

`npm run dev` starts the Next.js development server with hot reload. Clean URLs
(`/services/health`, `/service-details/pswdo`) work as they do in production. The dev-only
news editor is at `/admin/news-editor` (see [news-curation.md](news-curation.md)).

The service worker is registered only in production builds, so it never caches anything
while you develop.

## Build for production

```bash
npm run build          # next build + scripts/postbuild.js, writes out/
npm run check:routes   # checks that every route and root file exists in out/
```

`out/` is the complete static site. To preview it with the same URL handling Cloudflare uses
(`html_handling` and the 404 page from `wrangler.jsonc`):

```bash
npx wrangler dev
```

The build does not bump the version. See [architecture.md](architecture.md#build-pipeline)
for what each step does.

## Tests and checks

```bash
npm test               # Vitest + React Testing Library
npm run lint           # ESLint (next + jsx-a11y)
npm run typecheck      # tsc --noEmit
npm run format:check   # Prettier (npm run format to fix)
npm run lighthouse     # Lighthouse CI (lhci autorun)
```

Run one test file while you work, for example `npx vitest run src/features/news`, or
`npx vitest` for watch mode.

GitHub Actions runs lint, typecheck, test and build on pull requests to `develop`
(`.github/workflows/ci.yml`). Lighthouse CI runs on pushes and pull requests to `main`
(`.github/workflows/lighthouse.yml`); accessibility must score 90 or more.

## Branches

| Branch           | Purpose                            | Deploys to                                              |
| ---------------- | ---------------------------------- | ------------------------------------------------------- |
| `main`           | Production                         | betterbukidnon.org (Worker `betterbukidnon-production`) |
| `develop`        | Integration                        | dev.betterbukidnon.org (Worker `betterbukidnon`)        |
| feature branches | Your work; open PRs into `develop` | preview URL on `*.workers.dev`                          |

See [deployment.md](deployment.md).

## Your first change

1. Read [architecture.md](architecture.md) for where code lives and
   [content-guide.md](content-guide.md) for where content lives.
2. Visible text lives in each feature's `i18n/en.json` (and `fil.json`, `ceb.json`), not in
   the components. Change all three languages, or at least English (see
   [translations.md](translations.md)).
3. Run `npm run dev`, check the page in English, Filipino and Cebuano, and at phone width
   (320–412px).
4. Run `npm test`, `npm run lint` and `npm run typecheck`.
5. Open a pull request into `develop`.
