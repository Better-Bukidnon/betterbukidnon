# From BetterSolano to BetterBukidnon

This repository began as a copy of [BetterSolano](https://github.com/BetterSolano/bettersolano),
a civic portal for the **Municipality of Solano, Nueva Vizcaya**. It was converted into a portal
for the **Province of Bukidnon** on 2026-11-01. This page records what changed, and why, so the
next person does not have to reverse-engineer it.

The site was later rewritten in React (Next.js), so the HTML pages, `assets/js/` scripts and
`translations.js` mentioned below no longer exist. Data file paths have been updated to the
current layout; see [architecture.md](architecture.md) for how the site works now.

## Scope change: municipality → province

A province does different work from a municipality. The conversion did more than swap names:

| Topic                                                                           | Solano (municipality)                          | Bukidnon (province)                                                                                       |
| ------------------------------------------------------------------------------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Chief executive                                                                 | Municipal Mayor                                | Governor (Hon. Rogelio Neil P. Roque)                                                                     |
| Legislature                                                                     | Sangguniang Bayan, councilors                  | Sangguniang Panlalawigan, board members, presided over by the Vice Governor (Hon. Clive D. Quiño)         |
| Seat                                                                            | Municipal Hall                                 | Provincial Capitol, Malaybalay City                                                                       |
| Subdivisions                                                                    | 22 barangays                                   | 2 cities, 20 municipalities, 464 barangays, 4 congressional districts                                     |
| Offices                                                                         | MSWDO, MDRRMO, MPDO, MHO, Municipal Treasurer… | PSWDO, PDRRMD, PPDO, PHO, Provincial Treasurer…                                                           |
| Civil registry, business permits, tricycle franchises, markets, slaughterhouses | Done by the municipality                       | Done by each **city or municipality**, not the Province. Pages now explain this and point to the LGU list |

## What changed

### Branding

- BetterSolano.org → BetterBukidnon.org everywhere (titles, meta tags, canonical URLs,
  sitemap, manifest, service worker cache names).
- New logo and favicon: the Philippine sun over a silhouette of Bukidnon province (outline
  from OpenStreetMap data, © OpenStreetMap contributors, ODbL). The sun was later replaced
  with a panika, the fan-shaped headdress Bukidnon women wear at rituals and festivities,
  drawn flat from a beaded panika design (#9).
- Page titles say "Bukidnon Civic Portal" instead of "Official Portal", and the footer and
  homepage state that this is a volunteer project, not an official government website.
- Footer: removed BetterSolano's LinkedIn, Discord and Facebook links and the Abakada.org and
  HIV Care Philippines partner logos (partners of BetterSolano, not of this project). Kept
  BetterGov.ph. Added GitHub and the volunteer email.

### Content

- Homepage rewritten: Bukidnon at a glance (2024 population, barangays, income class, land
  area), a map of the province, Bukidnon's history (seven tribes, 1907, 1917, Kaamulan,
  cityhood, districts), provincial leadership, and a "who handles what" guide that sends
  people to their city or municipality for municipal services.
- Government, officials, statistics, services, service details, legislative, budget, news,
  contact, FAQ and the legal pages were all rewritten for the Province.
- Hotline bar on every page: 911, PDRRMD, Bukidnon PPO, BFP Malaybalay, PHO, PSWDO.
- Map and weather point to the Provincial Capitol in Malaybalay City (8.1575° N, 125.1278° E).
- Removed Solano's Mayor's Office appointment system link and the Solano Quiz.

### Pages renamed, added and removed (`/service-details/`)

| Before                                                                                                                                                                                        | After                                      |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| `municipal-treasurer`, `municipal-assessor`, `municipal-accounting`, `municipal-budget`, `municipal-agriculture`, `municipal-engineering`, `municipal-planning`, `municipal-general-services` | `provincial-*` with the same suffix        |
| `mswdo`, `mswdo-services`                                                                                                                                                                     | `pswdo` (the two were merged)              |
| `municipal-civil-registrar`                                                                                                                                                                   | removed; use `civil-registrar`             |
| `general-services` (duplicate)                                                                                                                                                                | removed; use `provincial-general-services` |
| `seedo-public-market`, `seedo-slaughterhouse`, `tricycle-franchising`                                                                                                                         | removed (city/municipal functions)         |
| (new)                                                                                                                                                                                         | `provincial-health-office`, `pdrrmd`       |

### Data

Solano's records were removed rather than relabelled. These data files are now **empty** and
their pages show an empty state that links to the official source, until someone adds
verified Bukidnon data:

- `src/content/data/ordinances.json`, `resolutions.json`
- `src/content/data/fiscal_transparency.json`, `dpwh-projects.json`
- `src/content/data/competitive-index.json`
- `src/content/data/news.json`

`src/content/data/officials.json`, `demographics.json` and `services.json` hold Bukidnon data.

### Languages

- Ilocano was replaced by **Cebuano (Binisaya)**, the most widely spoken language in
  Bukidnon. The Ilocano dictionary was removed. Cebuano covers navigation, buttons, headings,
  the footer and other shared text; the rest falls back to English.
- Filipino strings were updated wherever the content changed.

### Privacy and infrastructure

- Removed BetterSolano's Google Analytics tag (`G-8777S9SP9X`) from every page. Without this,
  Bukidnon visitors would have been reported into another project's analytics.
- Office emails on `@solano.gov.ph` were removed. No `@bukidnon.gov.ph` addresses could be
  verified, so none were added.
- Deployment is Cloudflare Workers (see [deployment.md](deployment.md)). The cPanel files were
  removed in the React cutover.

### Repository

- Added `docs/` (this folder), `docs/bukidnon-facts.md` as the single source of province facts,
  and `.claude/agents/` with 32 Claude Code subagents (see [claude-code.md](claude-code.md)).
- Kept BetterSolano's own migration and rollout documents in `docs/upstream/` until the React
  cutover, which deleted them because they describe Solano. Git history still has them.
- Removed BetterSolano's one-off Python translation scripts (`scripts/translate-pass*.py`,
  `translate-remaining.py`, `i18n-upgrade.py`, `add-missing-keys.py`, `add-quiz-keys.py`,
  `fix-footer-quiz-copyright.py`). They edited the Ilocano dictionary and the quiz links,
  neither of which exists any more.
- Removed the unused `assets/js/statistics.js`, which still held Solano barangay data.
- `LICENSE` keeps Ramon Logan Jr.'s copyright notice, as the MIT and CC BY 4.0 licenses
  require, and adds the BetterBukidnon contributors.

## Still to do

See the "Verify" items in [bukidnon-facts.md](bukidnon-facts.md) and the launch checklist in
[deployment.md](deployment.md). The most important ones:

1. Confirm the hotline and Capitol directory numbers with the Provincial Government.
2. Confirm the official Facebook page of the Provincial Government (`facebook.com/lgubukidnon`
   is used on the homepage and footer).
3. Fill the empty data files from official sources (budget and SRE from BLGF, ordinances
   from the Sangguniang Panlalawigan, DPWH projects).
4. Add a Citizen's Charter link once the official URL is known (the footer currently links to
   the bukidnon.gov.ph homepage).
5. Set up email routing for `volunteer@betterbukidnon.org`.
