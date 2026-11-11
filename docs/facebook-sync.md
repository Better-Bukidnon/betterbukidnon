# Automated Facebook → News Sync

Pulls the latest posts from the Provincial Government of Bukidnon Facebook page
(<https://www.facebook.com/lgubukidnon>, marked **Verify** in
[bukidnon-facts.md](bukidnon-facts.md)), categorizes them and merges them into
`src/content/data/news.json`, the file behind the homepage **Latest Updates** and the
**News** page.

- Engine: [`scripts/sync-facebook.js`](../scripts/sync-facebook.js)
- Scheduler: [`.github/workflows/facebook-sync.yml`](../.github/workflows/facebook-sync.yml)
- Renderer: `src/features/news/` (reads and validates the file at build time)

## Publishing needs a commit and a rebuild

The site imports `news.json` at build time, so an updated file changes nothing until it is
committed and the site is rebuilt. The workflow does **not** commit. When the sync changes the
file, the run uploads it as the `news-json` artifact (kept for 7 days). To publish:

1. Open the run in the GitHub **Actions** tab and download the `news-json` artifact.
2. Replace `src/content/data/news.json` with it.
3. Commit and open a pull request into `develop`. The dev site updates when it merges, and
   production updates when `develop` is merged into `main`.

Whether the workflow should commit to `develop` automatically is still an open decision.
There is no FTP or cPanel deploy any more.

## The one prerequisite (activation gate)

Facebook returns a page's posts only to a caller holding a **Page access token**, and that
token requires a **role on the page**. No code can bypass this.

1. **Get an Editor role on the page.** Ask the Provincial Government of Bukidnon page admin
   (Meta Business Suite → Settings → People) to add the BetterBukidnon account or app as an
   **Editor**. Editor is enough for read access; full Admin is not required.
2. **Create a Meta app** at developers.facebook.com, add the **Facebook Login** / **Pages**
   products and request `pages_read_engagement`.
3. **Generate a long-lived Page access token.** Use Graph API Explorer to get a user token,
   exchange it for a long-lived one, then call `/me/accounts` to get the **Page** token. For
   a token that never expires, create a **System User** in Business Manager and generate its
   token. (A short-lived token works for testing but stops working after about an hour.)
4. **Find the Page ID** in the page's About section or via `/me/accounts`.

Until then the workflow runs but **stays dormant**: the engine logs "skipping sync (dormant)"
and never touches `news.json`. Curated entries ([news-curation.md](news-curation.md)) keep
the sections populated in the meantime, and the two sources merge automatically once the
token is added.

## Configure the repository

In **GitHub → Settings → Secrets and variables → Actions**:

| Name              | Type         | Value                                              |
| ----------------- | ------------ | -------------------------------------------------- |
| `FB_PAGE_ID`      | **Variable** | The page's numeric ID (public, safe as a variable) |
| `FB_ACCESS_TOKEN` | **Secret**   | The Page or System User access token               |

Optional overrides, set as `env` in the workflow step:

| Name             | Default | Meaning                              |
| ---------------- | ------- | ------------------------------------ |
| `FB_API_VERSION` | `v21.0` | Graph API version                    |
| `FB_LIMIT`       | `25`    | Posts requested per run              |
| `MAX_FB_ITEMS`   | `30`    | Most Facebook items kept in the feed |

## How it behaves

- **Schedule:** every 20 minutes (`*/20 * * * *`; GitHub may delay scheduled runs).
  `workflow_dispatch` lets you start a run by hand from the Actions tab.
- **Categorization:** deterministic keyword and `#hashtag` rules map each post to
  Announcement, Advisory, Project or Event and a badge (`info`, `success`, `warning`).
  Editors can force a category by adding a hashtag such as `#advisory` or `#project` to the
  post. Titles are cut to 120 characters and summaries to 300.
- **Merge:** curated entries (any `id` that does **not** start with `fb-`) are always kept;
  Facebook entries (`fb-…`) are refreshed each run. The combined list is sorted newest first.
- **Never blanks the feed:** on a fetch error, an empty result or zero valid items, the engine
  leaves `news.json` untouched. Writes are atomic (temp file, then rename).
- **Idempotent:** if nothing changed, the run reports `changed=false` and uploads nothing.
- **Token expiry:** an expired or invalid token (Graph error 190) or a permission error fails
  the run, so it shows red in the Actions tab. That is the signal to refresh the token.

The site validates the file again at build time (`parseNews` in
`src/features/news/newsData.ts`), so a malformed sync result fails the build instead of
shipping.

## Test it locally (no token needed)

The engine accepts a saved Graph `/posts` response through `FB_FIXTURE`, skipping the network.
`NEWS_JSON_PATH` writes somewhere other than the real file. In Windows `cmd`:

```bat
set FB_FIXTURE=fixture.json
set NEWS_JSON_PATH=%TEMP%\news.json
node scripts\sync-facebook.js
```

In a POSIX shell:

```bash
FB_FIXTURE=fixture.json NEWS_JSON_PATH=/tmp/news.json node scripts/sync-facebook.js
```

Once a real token exists, run against the live API the same way with `FB_PAGE_ID` and
`FB_ACCESS_TOKEN` set instead of `FB_FIXTURE`. Keep `NEWS_JSON_PATH` pointed at a temporary
file until you want to update `src/content/data/news.json`.

## Optional upgrade: smarter categorization

The current categorizer is deterministic and has no dependencies, which is the right default
for reliability. For cleaner headlines and more accurate categories on messy posts, the
transform step could call a small LLM with structured output and fall back to the keyword
rules when the API is unavailable. This is not implemented.
