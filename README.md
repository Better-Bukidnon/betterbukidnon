# BetterBukidnon.org

A volunteer-run civic portal for the **Province of Bukidnon**, Philippines: provincial
services, officials, emergency hotlines, statistics and public records in one easy-to-read
site, in English, Filipino and Cebuano (Binisaya).

BetterBukidnon.org is part of the [BetterGov.ph](https://bettergov.ph) volunteer ecosystem.
It is **not** an official government website. The Provincial Government of Bukidnon's
official site is [bukidnon.gov.ph](https://bukidnon.gov.ph/).

This repository is built from the [BetterSolano](https://github.com/BetterSolano/bettersolano)
template, the civic portal for the Municipality of Solano, Nueva Vizcaya. See the
[rebrand notes](docs/rebrand-from-bettersolano.md) for what was changed for Bukidnon.

**Cost to the People of Bukidnon = ₱0**

![License](https://img.shields.io/badge/license-MIT%20%7C%20CC%20BY%204.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-000000?logo=nextdotjs&logoColor=white)
![React 19](https://img.shields.io/badge/React%2019-20232A?logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?logo=tailwindcss&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-6E9F18?logo=vitest&logoColor=white)
![Cloudflare Workers](https://img.shields.io/badge/Cloudflare%20Workers-F38020?logo=cloudflare&logoColor=white)

- Production: [betterbukidnon.org](https://betterbukidnon.org)
- Development: [dev.betterbukidnon.org](https://dev.betterbukidnon.org)

## What's on the site

| Section         | Content                                                                                                                                                                                              |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Services        | What the Province does in health, social welfare, agriculture, infrastructure, tax, education, environment and public safety, and which office to go to                                              |
| Service details | One page per provincial office (Treasurer, Assessor, PSWDO, PHO, PDRRMD, PEO, PPDO, …) plus guides for civil registry documents and business permits, which are handled by cities and municipalities |
| Government      | Governor, Vice Governor, Sangguniang Panlalawigan, congressional districts, and the 2 cities and 20 municipalities                                                                                   |
| Statistics      | Population (2024 POPCEN), land area, barangays, per-LGU table                                                                                                                                        |
| Legislative     | How provincial ordinances and resolutions are made                                                                                                                                                   |
| Transparency    | Where to find the provincial budget and financial reports                                                                                                                                            |
| News            | Curated updates and posts from the Provincial Government's Facebook page                                                                                                                             |
| Contact         | Capitol directory and emergency hotlines                                                                                                                                                             |

## Quick start

Requires Node.js 20.9 or newer.

```bash
git clone https://github.com/Better-Bukidnon/betterbukidnon.git
cd betterbukidnon
npm install
npm run dev            # http://localhost:3000
```

| Command             | What it does                                                           |
| ------------------- | ---------------------------------------------------------------------- |
| `npm run dev`       | Development server with hot reload (includes the dev-only news editor) |
| `npm run build`     | Static export to `out/` (`next build` + `scripts/postbuild.js`)        |
| `npm test`          | Vitest + React Testing Library                                         |
| `npm run lint`      | ESLint (`next` + `jsx-a11y`)                                           |
| `npm run typecheck` | `tsc --noEmit`                                                         |

Cloudflare Workers serves `out/` as static assets (see `wrangler.jsonc` and
[deployment.md](docs/deployment.md)). The build never bumps the version; use
`npm run version:patch` (or `minor`, `major`) on purpose.

## Project structure

```
src/
├── app/                Thin Next.js routes (metadata + one feature component each)
├── features/<domain>/  Components, data loaders, i18n/{en,fil,ceb}.json and tests per feature
├── shared/             Small UI and validation helpers used by three or more features
└── content/
    ├── data/           Site data as JSON (officials, demographics, services, news, …)
    └── service-details/<slug>/{en,fil,ceb}.mdx   One MDX file per office per language
public/                 Images, manifest, service-worker template, robots.txt, version.json, _headers
scripts/                postbuild.js, bump-version.js, sync-facebook.js
docs/                   Documentation
```

## Documentation

Everything else is in [docs/](docs/README.md):

- [Getting started](docs/getting-started.md): local setup, build, tests, branches
- [Architecture](docs/architecture.md): routes, features, data, MDX, build pipeline, PWA
- [Content guide](docs/content-guide.md): updating officials, hotlines, services, office pages and data
- [Bukidnon fact sheet](docs/bukidnon-facts.md): every province fact the site uses, with sources
- [Translations](docs/translations.md): how EN / FIL / CEB work, and how to add a language
- [Deployment](docs/deployment.md): Cloudflare Workers environments, headers and the launch checklist
- [News curation](docs/news-curation.md) and [Facebook sync](docs/facebook-sync.md): keeping the News page current
- [Claude Code subagents](docs/claude-code.md): the AI helpers included in `.claude/agents/`
- [Rebrand notes](docs/rebrand-from-bettersolano.md): what changed from the BetterSolano template

## Technology

- **Next.js** (App Router) with **React 19**, exported as a fully static site (`output: 'export'`)
- **TypeScript** in strict mode
- **Tailwind CSS** v4, with the palette and spacing as theme tokens in `src/app/globals.css`
- **MDX** (`@next/mdx`) for the office pages
- **Vitest** and **React Testing Library** for tests; ESLint, Prettier and Lighthouse CI as
  quality gates
- **Cloudflare Workers** static assets for hosting
- Chart.js (`react-chartjs-2`) for charts, keyless Google Maps embeds for
  maps, Bootstrap Icons (`react-bootstrap-icons`), self-hosted Inter, weather from
  Open-Meteo and exchange rates from open.er-api.com

All data is compiled in at build time; there is no backend and no analytics. The site is an
installable PWA with an offline page.

## Contributing

Developers, designers, writers, translators (especially Binisaya, Binukid and Higaonon) and
researchers are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md), then open an issue or a
pull request into `develop`. Province facts must come from official sources; see the
[fact sheet](docs/bukidnon-facts.md).

## Data sources

| Source                                                        | Used for                            |
| ------------------------------------------------------------- | ----------------------------------- |
| [Provincial Government of Bukidnon](https://bukidnon.gov.ph/) | Offices, contact directory          |
| [Philippine Statistics Authority](https://psa.gov.ph/)        | Population, PSGC                    |
| [COMELEC](https://comelec.gov.ph/) and news reports           | 2025 election results               |
| [Bureau of Local Government Finance](https://blgf.gov.ph/)    | Financial reports (to be added)     |
| [DTI CMCI](https://cmci.dti.gov.ph/)                          | Competitiveness index (to be added) |

## License

Dual-licensed, like the template it comes from:

| License   | Applies to                                 |
| --------- | ------------------------------------------ |
| MIT       | Source code                                |
| CC BY 4.0 | Content (text, images, data, translations) |

See [LICENSE](LICENSE).

## Credits

- Built on the [BetterSolano](https://github.com/BetterSolano/bettersolano) template by
  [Ramon Logan Jr.](https://ramonloganjr.com/), used under the MIT and CC BY 4.0 licenses.
- [BetterGov.ph](https://bettergov.ph) for the civic-tech movement this project belongs to.
- Maps by [Google Maps](https://www.google.com/maps) (keyless embed).
- Claude Code subagents from
  [VoltAgent/awesome-claude-code-subagents](https://github.com/VoltAgent/awesome-claude-code-subagents) (MIT).
- Every volunteer who gives their time to the people of Bukidnon.

## Contact

- Email: volunteer@betterbukidnon.org
- GitHub: [Better-Bukidnon/betterbukidnon](https://github.com/Better-Bukidnon/betterbukidnon)
