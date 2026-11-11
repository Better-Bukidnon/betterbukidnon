# Content Guide

How to change what the site says. Before changing a fact (a name, a number, a date), update
[bukidnon-facts.md](bukidnon-facts.md) with the new value and its source, then update the
files listed below.

Content is compiled into the site at build time. A change goes live only after it is
committed, merged and deployed (see [deployment.md](deployment.md)).

## Where things live

| What                                                        | Where                                                                                                   |
| ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Visible text (headings, buttons, prose)                     | `src/features/<feature>/i18n/{en,fil,ceb}.json` (see [translations.md](translations.md))                |
| Emergency hotline bar                                       | `HOTLINES` in `src/features/layout/HotlineBar.tsx`                                                      |
| Navigation menu                                             | `NAV` in `src/features/layout/navigation.ts`; labels in `src/features/i18n/i18n/*.json`                 |
| Footer                                                      | `src/features/layout/Footer.tsx`; labels in the chrome dictionary                                       |
| Officials (Governor, Vice Governor, Board, representatives) | `src/content/data/officials.json`                                                                       |
| Population, area, barangays, per-LGU table                  | `src/content/data/demographics.json`                                                                    |
| Service categories (`/services/<slug>`)                     | `src/features/services/categories/<slug>.ts` (structure) and `src/features/services/i18n/*.json` (text) |
| Office pages (`/service-details/<slug>`)                    | `src/content/service-details/<slug>/{en,fil,ceb}.mdx`                                                   |
| Search results                                              | `src/content/data/services.json`                                                                        |
| Our Projects page and nav dropdown                          | `src/content/data/projects.json` plus `proj-*` keys in `src/features/projects/i18n/`                    |
| Ordinances and resolutions                                  | `src/content/data/ordinances.json`, `resolutions.json`                                                  |
| Budget and DPWH projects                                    | `src/content/data/fiscal_transparency.json`, `dpwh-projects.json`                                       |
| CMCI scores                                                 | `src/content/data/competitive-index.json`                                                               |
| News                                                        | `src/content/data/news.json` (see [news-curation.md](news-curation.md))                                 |
| Contact, FAQ, terms, privacy, accessibility                 | `src/features/legal/` and its `i18n/` folder                                                            |
| Route list and `sitemap.xml`                                | `ROUTES` in `src/features/seo/routes.ts`                                                                |

To find every place a name or number appears, search `src/` (for example `git grep -n "Old
Name" src`).

## Data files and validators

Each file in `src/content/data/` is read by a typed loader that checks it at build time (see
[architecture.md](architecture.md#data-files)). If an entry is wrong, `npm run build` and
`npm test` fail with a message such as `projects.json: projects[2].url must be an https URL`.
Fix the entry it names. Keep the top-level shape of each file, and use `YYYY-MM-DD` for every
date.

| File                       | Fields (checked at build time)                                                                                                                                                                                                                                                                |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `officials.json`           | `term`, `last_verified`, `governor` and `vice_governor` (`name`, `title`), `board_members[]` and `representatives[]` (`name`, `district` 1–4), `ex_officio[]` (`id`: `abc`, `pcl`, `sk` or `ipmr`; `name`; `seat`), `sources[]` (`name`, http(s) `url`)                                       |
| `demographics.json`        | `population` and `population_2020` (`total`, `year`, `source`), `land_area_km2`, `counts` (`cities`, `municipalities`, `barangays`), `lgus[]` (`name`, `type` `city` or `municipality`, `district` 1–4, `population_2020`, `area_km2`, `barangays`, optional `capital`), `sources[]`          |
| `competitive-index.json`   | https `source_url`, `years[]`, `overall[]` (empty, or one score or `null` per year), `pillars[]` (`id`, `name`, one score or `null` per year)                                                                                                                                                 |
| `services.json`            | `services[]`: `id`, `title`, `category`, `categoryId`, `description`, `url` (a site path such as `/service-details/pswdo`), `keywords[]`; optional `fee`, `processingTime`, `office`                                                                                                          |
| `projects.json`            | `projects[]`: `id`, `name`, `description`, https `url`, `repos[]` (`name`, https `url`), `type` (use `org` or `community`), `category`, `status` (use `active`, `development` or `archived`), Bootstrap `icon` name                                                                           |
| `ordinances.json`          | `ordinances[]`: `ordinanceNo`, `title`, `sessionDate`                                                                                                                                                                                                                                         |
| `resolutions.json`         | `resolutions[]`: `resolutionNo`, `title`, `sessionDate`                                                                                                                                                                                                                                       |
| `fiscal_transparency.json` | `fiscal_years[]`: `year`, http(s) `source_url`, `periods[]` (`id`, `label`, optional `range`, `income` {`local`, `external`, `total`}, `expenditures` {`gps`, `social`, `economic`, `debt`, `total`}, `netIncome`, `fundBalance`). Amounts are in millions of pesos; the newest year is shown |
| `dpwh-projects.json`       | `projects[]`: `id`, `name`, `location`, `category`, `contractor`, optional `contractorId`, `cost` (≥ 0), `status` (percent complete, 0–100), `completionDate` (date or `null`)                                                                                                                |
| `news.json`                | `news[]`: see [news-curation.md](news-curation.md#schema)                                                                                                                                                                                                                                     |

External links in data must be `http(s)` URLs. Anything else (`javascript:`, `data:`) is
rejected.

### The empty-state rule

Every page must stay useful when its data file is empty. Instead of a blank section it shows
an empty state (`src/shared/EmptyState.tsx`) that links to the official source: the
Sangguniang Panlalawigan for ordinances, BLGF and DBM for budget data, DPWH, DTI CMCI, and
the Provincial Government's Facebook page for news. If you add a new data-driven section,
give it an empty state too. Empty is better than wrong: never fill a file with unverified or
placeholder data.

### Fill an empty data file

1. Get the data from the official source (Sangguniang Panlalawigan records, BLGF, DBM, DPWH,
   DTI CMCI).
2. Add entries in the shape shown above. Add a source URL where the format has one.
3. Run `npm test` (the validator tests read the real files) and `npm run dev` to check the
   page.

## Office pages (MDX)

Each office has a folder `src/content/service-details/<slug>/` with `en.mdx` (required) and
optional `fil.mdx` and `ceb.mdx`. The English file starts with frontmatter:

```yaml
---
title: 'Provincial Disaster Risk Reduction and Management Department (PDRRMD)'
summary: 'Disaster preparedness, response and recovery for the Province of Bukidnon'
badge: 'Public Safety'
slug: 'pdrrmd' # must equal the folder name
category: 'public-safety' # a /services/<category> slug, or "government"
office:
  name: 'Provincial Disaster Risk Reduction and Management Department (PDRRMD)'
  head: '' # may be "" when not published; the key must be there
  address: 'Provincial Capitol Compound, Malaybalay City'
  phone: '(088) 813-1262' # may be ""
  email: '' # may be ""
  hours: 'Monday to Friday, 8:00 AM to 5:00 PM'
  mapLink: 'https://www.google.com/maps/search/?api=1&query=...' # may be ""
lastVerified: '2026-11-11' # YYYY-MM-DD
sources: # at least one http(s) URL
  - 'https://bukidnon.gov.ph/'
---
```

`fil.mdx` and `ceb.mdx` carry only the translated `title`, `summary` and `badge`, followed by
the translated body. A missing or empty required field fails the build with
`Invalid frontmatter in src/content/service-details/<file>: …`.

The body is Markdown plus these components (from
`src/features/service-details/mdxComponents.tsx`): `<ServiceList>` with `<Service title=…>`
items, `<Requirements>`, `<Steps>`, `<Fees>`, `<Callout>` and `<Faq>`. Copy the usage from an
existing office. The hero and the contact card come from the frontmatter, so do not repeat
them in the body.

### Add an office page

1. Create `src/content/service-details/<slug>/en.mdx` with full frontmatter. Translations
   are optional.
2. Add the slug to `OFFICES` in `src/features/seo/routes.ts`, so it appears in
   `sitemap.xml` and the route-coverage check.
3. Link to it from the matching category in `src/features/services/categories/<category>.ts`
   (and from the government page if it is a provincial office).
4. Add an entry to `src/content/data/services.json` so search finds it.

The page itself is generated automatically: `/service-details/[slug]` builds one page per
folder that has an `en.mdx`.

## Common tasks

### Officials change (election, succession)

1. Update section 3 of [bukidnon-facts.md](bukidnon-facts.md) with the source.
2. Edit `src/content/data/officials.json` and update `last_verified`.
3. Search `src/` for the old names (the homepage leadership section reads `officials.json`,
   but office MDX files may name office heads).

### A hotline number changes

Edit `HOTLINES` in `src/features/layout/HotlineBar.tsx` (both the `tel` value and the label),
then update the contact page in `src/features/legal/`, any office MDX that lists it, and
[bukidnon-facts.md](bukidnon-facts.md). The bar appears on every page, so one edit covers
the whole site.

### Add or change a project on the Our Projects page

1. Add an entry to `src/content/data/projects.json` (fields above). The tabs, filters,
   dialog and the "Our Projects" nav dropdown are built from this file.
2. Add `proj-<id>-name` and `proj-<id>-desc` to the `fil` and `ceb` files in
   `src/features/projects/i18n/` (and `proj-cat-<category>` for a new category). The JSON
   text is the English fallback.

## Province vs. city or municipality

When writing about a service, say who actually provides it:

| Service                                                                    | Who handles it                                                                                                                             |
| -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Birth, marriage and death certificates                                     | City/municipal civil registrar (LCRO) where the event was registered; certified copies from PSA                                            |
| Business permits                                                           | City/municipal BPLO                                                                                                                        |
| Barangay clearance                                                         | The barangay                                                                                                                               |
| Real property tax                                                          | Provincial Treasurer for properties in the 20 municipalities (with the municipal treasurer); the city treasurer in Malaybalay and Valencia |
| Tax declarations                                                           | Provincial Assessor (with the municipal assessor); the city assessor in Malaybalay and Valencia                                            |
| Provincial hospitals, provincial roads, provincial social welfare programs | The Province                                                                                                                               |
| Public schools                                                             | DepEd Division of Bukidnon (the Province supports through the Special Education Fund)                                                      |
| Police and fire                                                            | PNP Bukidnon Police Provincial Office, BFP                                                                                                 |

The civil-registry and business-permit office pages keep a `<Callout>` that explains this.
Do not state fees, processing times or requirements as official unless they come from the
Provincial Government's Citizen's Charter. Otherwise describe the process in general terms
and add "Requirements may vary; confirm with the office."

## Writing style

- Plain, short sentences. Many readers are on phones, on prepaid data, in their second or
  third language.
- Say what to do and where to go. Put phone numbers in `tel:` links.
- Use "Bukidnonon" for people from Bukidnon.
- Don't call the site "official". It is a volunteer project; link to bukidnon.gov.ph for
  official information.
