# Architecture

BetterBukidnon is a **Next.js App Router** site in **TypeScript** (strict) with **React 19**,
exported as plain static files (`output: 'export'`). There is no server-side code, no
database and no runtime fetch of site data: every JSON file and MDX page is imported at build
time and baked into pre-rendered HTML. `next build` writes the site to `out/`, and Cloudflare
Workers serves that folder as static assets (see [deployment.md](deployment.md)).

## Directory layout

```
/
├── src/
│   ├── app/                    Routes only: metadata, generateStaticParams, composition
│   │   ├── layout.tsx          <html>, Inter font, LanguageProvider, page chrome
│   │   ├── page.tsx            Homepage
│   │   ├── services/           /services and /services/[category]
│   │   ├── service-details/    /service-details/[slug] (one per office MDX folder)
│   │   ├── government/ statistics/ legislative/ budget/ news/ projects/
│   │   ├── contact/ faq/ terms/ privacy/ accessibility/ sitemap/
│   │   ├── not-found.tsx       Exported as 404.html
│   │   ├── 403/ 500/ offline/  Exported as 403.html, 500.html, offline.html
│   │   ├── sitemap.ts          Generates sitemap.xml from the route list
│   │   ├── admin/news-editor/  page.dev.tsx: dev-only news editor
│   │   └── globals.css         Tailwind import, theme tokens, base styles
│   ├── features/<domain>/      Components, data loaders, i18n and tests per feature
│   ├── shared/                 Code used by three or more features
│   ├── content/
│   │   ├── data/               *.json site data
│   │   └── service-details/    <slug>/{en,fil,ceb}.mdx office pages
│   └── mdx-components.tsx      Registers the office MDX components
├── public/                     Copied as-is into out/: assets/, manifest, sw.js template,
│                               robots.txt, version.json, _headers
├── scripts/                    postbuild.js, bump-version.js, sync-facebook.js
├── .github/workflows/          ci.yml, lighthouse.yml, facebook-sync.yml
├── docs/                       This documentation (not deployed)
├── .claude/agents/             Claude Code subagents (see claude-code.md)
├── next.config.ts              Static export, MDX, dev-only page extensions
├── vitest.config.mts           Test runner (jsdom, @/ alias, MDX transform)
├── eslint.config.mjs           ESLint (next + jsx-a11y)
└── wrangler.jsonc              Cloudflare Workers config (development + production)
```

Imports use the `@/` alias for `src/` and go straight to the module. There are no `index.ts`
barrel files. Components use PascalCase file names (`NewsCard.tsx`); hooks, loaders and
utilities use camelCase (`newsData.ts`, `useT.ts`); content and route folders use
kebab-case.

## Routes (`src/app/`)

Route files stay thin. They set metadata, list static params and render one feature
component. For example, `src/app/news/page.tsx` renders `NewsPage` from `src/features/news/`.

| Route                                                                  | Feature                                                                     |
| ---------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `/`                                                                    | `home` (plus `search`, `weather-map`, `facebook-feed`, `news`, `volunteer`) |
| `/services`, `/services/[category]`                                    | `services`                                                                  |
| `/service-details/[slug]`                                              | `service-details`                                                           |
| `/government`, `/government/officials`                                 | `government`                                                                |
| `/statistics`                                                          | `statistics`                                                                |
| `/legislative`, `/legislative/{ordinance,resolution}-framework`        | `legislative`                                                               |
| `/budget`                                                              | `transparency`                                                              |
| `/news`, `/projects`                                                   | `news`, `projects`                                                          |
| `/contact`, `/faq`, `/terms`, `/privacy`, `/accessibility`, `/sitemap` | `legal`                                                                     |
| `404`, `/403`, `/500`, `/offline`                                      | `errors`                                                                    |

With `trailingSlash: false`, `/services/health` is exported as `services/health.html`.
Cloudflare's `html_handling: auto-trailing-slash` serves it at the same clean URL the old
site used. Every URL is listed once in `src/features/seo/routes.ts` (`ROUTES`), which feeds
`sitemap.xml` and the route-coverage test.

## Page chrome

`src/app/layout.tsx` renders the same chrome on every page, in this order:

1. `SkipLink` ("Skip to main content")
2. `HotlineBar`: emergency numbers as `tel:` links, in a marquee that pauses on hover, focus
   and reduced motion. The numbers are in `HOTLINES` in `HotlineBar.tsx` and must match
   [bukidnon-facts.md](bukidnon-facts.md).
3. `Header`: logo, navigation with dropdowns, the globe language menu and the mobile menu.
   The menu structure is `NAV` in `src/features/layout/navigation.ts`. Each item lists the
   URL sections that mark it active (`services` and `service-details` highlight Services,
   `budget` highlights Transparency). The "Our Projects" dropdown is built from
   `projects.json`.
4. `InfoBar`: exchange rates (open.er-api.com), Malaybalay weather (Open-Meteo) and
   Philippine time
5. `<main id="main-content">` with the page
6. `Footer`: tagline, links, resources, "Cost to the People of Bukidnon = ₱0", partners and
   the version from `public/version.json`
7. `PwaBanners`: install and "update available" banners

The volunteer popup (`src/features/volunteer/`) is rendered by the homepage only. Because the
chrome exists once, in React, there is nothing to copy into each page.

## Features (`src/features/`)

| Feature           | Contents                                                                    |
| ----------------- | --------------------------------------------------------------------------- |
| `layout`          | Skip link, hotline bar, header, navigation, language menu, info bar, footer |
| `i18n`            | `LanguageProvider`, `useT()`, `locales.ts`, chrome dictionary               |
| `home`            | Homepage sections and the Lottie animations                                 |
| `search`          | Service search with autocomplete over `services.json`                       |
| `services`        | `/services` and the category pages (`categories/*.ts`, `HealthPage.tsx`)    |
| `service-details` | Office page template, MDX components, frontmatter validation                |
| `government`      | Officials, districts, provincial offices, cities and municipalities         |
| `statistics`      | Charts (react-chartjs-2), animated counters, per-LGU table, CMCI            |
| `legislative`     | Ordinance and resolution lists, the two framework pages                     |
| `transparency`    | Fiscal report and DPWH projects on `/budget`                                |
| `news`            | News list and card, `news.json` loader, dev-only news editor                |
| `projects`        | Status tabs, search, filters, card grid and details dialog                  |
| `weather-map`     | Weather widget and the Google Maps embed                                    |
| `facebook-feed`   | Facebook page plugin embed                                                  |
| `volunteer`       | Volunteer popup dialog                                                      |
| `pwa`             | Service-worker registration and banners                                     |
| `seo`             | Route list (`routes.ts`) and the route-coverage test                        |
| `legal`           | Contact, FAQ, terms, privacy, accessibility and HTML sitemap pages          |
| `errors`          | 403, 404, 500 and offline pages                                             |

A feature folder holds its own components, `<feature>Data.ts` loaders, an `i18n/` folder with
`en.json`, `fil.json` and `ceb.json`, a `<feature>Dictionary.ts`, and co-located `*.test.ts(x)`
files. `src/shared/` holds only code that three or more features need: `EmptyState`,
`PageHero`, `SectionHeading`, class helpers in `ui.ts` and the validation helpers in
`validate.ts`. It has no business logic.

## Rendering model

- Every page is pre-rendered. English HTML contains the full content, nav links and footer,
  so the site is readable without JavaScript.
- Interactive pieces are client components (`'use client'`): language menu, mobile nav,
  dropdowns, info bar, search, projects filters and dialog, volunteer popup, PWA banners.
- Browser-only libraries load with `next/dynamic` and `ssr: false` behind a placeholder of
  fixed size, so they cause no layout shift: the Chart.js charts (`StatisticsSections.tsx`).
  Lottie, the Facebook plugin and the Google Maps iframe (`MapCard.tsx`, no API key) also load only
  in the browser.
- Under `prefers-reduced-motion`, the marquee, Lottie animations, counters and charts do not
  animate.

## Data files

Data lives in `src/content/data/` and is imported by a typed loader in the feature that owns
it. Each loader validates the file when the module loads. A malformed file throws an error
that names the file and the entry, which fails `next build` (and the tests) instead of
shipping a broken page.

| File                                             | Loader                             | Status                          |
| ------------------------------------------------ | ---------------------------------- | ------------------------------- |
| `officials.json`                                 | `government/governmentData.ts`     | Filled                          |
| `demographics.json`                              | `statistics/statisticsData.ts`     | Filled                          |
| `competitive-index.json`                         | `statistics/statisticsData.ts`     | Empty, links to cmci.dti.gov.ph |
| `services.json`                                  | `search/serviceIndex.ts`           | Filled                          |
| `projects.json`                                  | `projects/projectsData.ts`         | Filled                          |
| `news.json`                                      | `news/newsData.ts`                 | Empty until curated or synced   |
| `ordinances.json`, `resolutions.json`            | `legislative/legislativeData.ts`   | Empty                           |
| `fiscal_transparency.json`, `dpwh-projects.json` | `transparency/transparencyData.ts` | Empty                           |

Every page must render a useful empty state, linking to the official source, when its data
file is empty. See [content-guide.md](content-guide.md) for the fields each file expects.

## Service-detail pages (MDX)

The 18 `/service-details/<slug>` pages are MDX files in `src/content/service-details/<slug>/`:
`en.mdx` (required) plus optional `fil.mdx` and `ceb.mdx`. One template,
`src/features/service-details/OfficePage.tsx`, renders them all. The body may use the
components in `src/features/service-details/mdxComponents.tsx` (`ServiceList`, `Service`,
`Requirements`, `Steps`, `Fees`, `Callout`, `Faq`), wired in through `src/mdx-components.tsx`.
The template adds the hero and the office `ContactCard` from the frontmatter.

- **Frontmatter** is validated by `frontmatter.ts` during `next build`; a missing field fails
  it. The fields are listed in [content-guide.md](content-guide.md#office-pages-mdx).
- **Locales:** English is rendered into the HTML. Each translated file is its own client
  chunk (`officeModule.ts`), fetched when the visitor switches language. A locale without a
  file shows English plus a "not yet translated" note (`LocalizedOffice.tsx`).
- **Loader choice: `@next/mdx`.** The files are local and known at build time, so they are
  imported like modules and compiled by the bundler (Turbopack in `next build`, a small
  `@mdx-js/mdx` transform in `vitest.config.mts`). That gives per-file code splitting for the
  locale chunks for free and needs no runtime compiler in the browser. `next-mdx-remote` was
  not chosen: it is built for content fetched or read as strings at request time, would need
  its own serialization step for the lazy locales, and adds a dependency. Frontmatter comes
  from `remark-frontmatter` + `remark-mdx-frontmatter` (exported as `frontmatter`). The
  plugins are named by string in `next.config.ts` because Turbopack only accepts
  serializable options.

## Styling

Tailwind CSS v4 through `@tailwindcss/postcss`. The design tokens are in the `@theme` block of
`src/app/globals.css`: colors (`primary` `#0032a0`, `primary-dark`, `secondary`, `accent`
`#f77f00`, `success`, `danger`, `info`, `bg`, `bg-alt`, `text`, `text-light`), spacing
(`xs` 8px to `xl` 48px), `max-w-site` (1200px), `rounded-base` (8px), `shadow-sm` and
`shadow-md`. `globals.css` also holds base element styles, the skip link and the
reduced-motion rules. Components use utilities only; there are no page stylesheets.

Do not add new brand colors. Tints and shades of the existing tokens are fine for hover and
focus states. There is no dark mode.

The Inter font is self-hosted from `@fontsource-variable/inter` through `next/font/local`, and
icons come from `react-bootstrap-icons`. Neither needs a CDN or network access at build time.

## Build pipeline

`npm run build` runs `next build && node scripts/postbuild.js`:

1. `next build` type-checks, compiles the MDX, runs every data and frontmatter validator,
   pre-renders all routes and writes `out/`. `src/app/sitemap.ts` writes `out/sitemap.xml`
   from `ROUTES`. Files in `public/` are copied to the root of `out/`.
2. `scripts/postbuild.js` then:
   - fails the build if a dev-only route (`out/admin`) was exported
   - strips every `<script>` from `out/offline.html`, so the offline fallback is plain
     HTML and CSS and works without any JS chunk
   - writes `out/sw.js` from the `public/sw.js` template, filling `PRECACHE_URLS` with the
     core routes (`/`, `/services`, `/news`, `/projects`, `/contact`, `/offline`), the
     `/_next/static` files they load and a few logos, and setting `CACHE_VERSION` to a hash
     of those files

The build never changes `version.json`. Bump it on purpose with `npm run version:patch`
(or `minor`, `major`); the footer reads it at build time.

`SITE_URL` (default `https://betterbukidnon.org`) sets canonical and OpenGraph URLs and the
sitemap host. Override it in the environment for a staging build.

## Dev-only admin news editor

`src/app/admin/news-editor/page.dev.tsx` exists only under `npm run dev`. `next.config.ts`
adds `dev.tsx` to `pageExtensions` only in the development-server phase, so `next build` does
not see the route. `postbuild.js` and the route-coverage test both fail if an `admin` route
reaches `out/`. Usage is in [news-curation.md](news-curation.md).

## Progressive Web App

`public/manifest.webmanifest` makes the site installable. `src/features/pwa/PwaBanners.tsx`
registers the service worker in production builds only and shows the install and update
banners. The generated `sw.js` precaches the core routes and serves `offline.html` when a
navigation fails. Because the precache list and `CACHE_VERSION` are generated, there is
nothing to update by hand when pages or assets change.

## Tests and quality gates

| Check                  | Tool                                                                                                        |
| ---------------------- | ----------------------------------------------------------------------------------------------------------- |
| `npm test`             | Vitest + React Testing Library (jsdom), files matching `src/**/*.test.ts(x)`                                |
| `npm run check:routes` | After a build: every route and root file exists in `out/`, `sitemap.xml` matches `ROUTES`, no `admin` route |
| `npm run lint`         | ESLint with `eslint-config-next` and `jsx-a11y`                                                             |
| `npm run typecheck`    | `tsc --noEmit` (strict, no `any`)                                                                           |
| `npm run format:check` | Prettier                                                                                                    |
| `npm run lighthouse`   | Lighthouse CI; accessibility must score 90 or more                                                          |

The tests cover i18n detection, fallback and interpolation, every data validator (real files
pass, malformed fixtures fail), search ranking and keyboard use, navigation, the projects
page, the volunteer popup, news sorting and URL rules, and the office template (every MDX
file renders, missing frontmatter is rejected). `vitest.config.mts` compiles MDX with the
same plugins as `next.config.ts`, so tests render office files exactly as the build does.

GitHub Actions runs lint, typecheck, test and build on pull requests and pushes to `develop`
(`ci.yml`), and Lighthouse CI on pull requests and pushes to `main` (`lighthouse.yml`).

## Third-party services

| Service              | Purpose             | Data sent               |
| -------------------- | ------------------- | ----------------------- |
| Open-Meteo           | Weather             | Malaybalay coordinates  |
| open.er-api.com      | Exchange rates      | none                    |
| Google Maps          | Embedded map        | map coordinates         |
| Facebook page plugin | Latest updates feed | standard Facebook embed |

Fonts, icons, Chart.js and Lottie are npm packages bundled into the site, so no CDN
is involved. There is no analytics script.
