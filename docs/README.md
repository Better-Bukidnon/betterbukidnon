# BetterBukidnon Documentation

BetterBukidnon.org is a volunteer-run civic portal for the **Province of Bukidnon**. It
collects provincial services, officials, emergency hotlines, statistics and public records in
one easy-to-read site, in English, Filipino and Cebuano (Binisaya). It is part of the
[BetterGov.ph](https://bettergov.ph) volunteer ecosystem and is **not** an official
government website. The official site of the Provincial Government is
[bukidnon.gov.ph](https://bukidnon.gov.ph/).

The site is a Next.js (React 19, TypeScript) static export served by Cloudflare Workers. It
started as a fork of the [BetterSolano](https://github.com/BetterSolano/bettersolano)
template by Ramon Logan Jr. (MIT / CC BY 4.0) and was later rewritten in React. See
[rebrand-from-bettersolano.md](rebrand-from-bettersolano.md) for what changed from the
template.

## Start here

| If you want to…                                    | Read                                                         |
| -------------------------------------------------- | ------------------------------------------------------------ |
| Run the site on your computer                      | [getting-started.md](getting-started.md)                     |
| Understand how the code is organized               | [architecture.md](architecture.md)                           |
| Change text, officials, hotlines, services or data | [content-guide.md](content-guide.md)                         |
| Check or update a fact about Bukidnon              | [bukidnon-facts.md](bukidnon-facts.md)                       |
| Add or fix a translation, or add a language        | [translations.md](translations.md)                           |
| Deploy to betterbukidnon.org                       | [deployment.md](deployment.md)                               |
| Curate the News page                               | [news-curation.md](news-curation.md)                         |
| Pull posts from Facebook automatically             | [facebook-sync.md](facebook-sync.md)                         |
| Use the Claude Code subagents in this repo         | [claude-code.md](claude-code.md)                             |
| Know what was carried over from BetterSolano       | [rebrand-from-bettersolano.md](rebrand-from-bettersolano.md) |

The fork no longer tracks the BetterSolano upstream. Upstream content changes (officials,
hotlines, facts) are ported by hand when they apply to Bukidnon.

## Ground rules

1. **Facts need a source.** Every fact about the province is listed in
   [bukidnon-facts.md](bukidnon-facts.md) with a source and a status (Verified / Verify).
   Pages must match that file.
2. **Say who really handles it.** Many everyday services (birth certificates, business
   permits, tricycle franchises, barangay clearances) belong to the city or municipality, not
   the Province. Pages point people to the right office instead of pretending the Province
   issues everything.
3. **Empty is better than wrong.** Where we do not have verified Bukidnon data yet (budget,
   ordinances, DPWH projects, news), the page shows an empty state that links to the official
   source.
4. **Accessible and light.** Pre-rendered HTML that is readable without JavaScript, works on
   old phones and slow connections, meets WCAG 2.1 AA and scores 90 or more for accessibility
   in Lighthouse.
