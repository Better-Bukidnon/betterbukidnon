# News Curation Workflow

How the **Latest Updates** (homepage) and **News** page are kept up to date.

## How it works

Both sections use the shared data file [`data/news.json`](../data/news.json). The homepage shows the 3 most recent items;
the News page shows all of them, newest first. No backend is involved — it is a static
JSON file served by the Cloudflare Workers deployment (previously cPanel).

`data/news.json` starts empty (`{ "news": [] }`). While it has no items, the News page and the
homepage feed show: "No updates yet. Follow the Provincial Government of Bukidnon on Facebook",
linking to <https://www.facebook.com/lgubukidnon>.

To avoid hand-editing JSON, use the maintainer tool at `/admin/news-editor` in the app.
It validates the JSON in the browser and downloads a file for review; changes still need to be
committed to the repository.

## Adding or editing an update

1. Start the local server from the project root:
   ```bash
   pnpm web:dev
   ```
2. Open the local Vite URL followed by `/admin/news-editor`. It loads the current
   `data/news.json` automatically.
3. Edit the JSON in the text area using the schema below. Keep each `id` unique.
4. Click **Validate and download**. The tool reports invalid data in the page.
5. Replace [`data/news.json`](../data/news.json) with the downloaded file, run `pnpm web:test`,
   then commit and deploy (`pnpm build` → Cloudflare Workers).

## Schema

```jsonc
{
  "news": [
    {
      "id": "unique-slug", // required, lowercase + dashes
      "title": "string", // required, ≤120 chars
      "date": "YYYY-MM-DD", // required
      "category": "Announcement", // required label shown on the badge
      "badge": "info", // required: info | success | warning
      "excerpt": "string", // required, ≤300 chars
      "url": "https://...", // optional outbound link; omit when unavailable
      "source": "View on Facebook", // optional link label (defaults to "Read more")
    },
  ],
}
```

`news.js` escapes all fields before rendering and ignores non-`http(s)` URLs, so the
feed is safe even if a future automated source (e.g. a Facebook Graph API sync) appends
items in the same shape. When that access becomes available, the sync writes
Facebook-sourced entries into the same array and they merge automatically with the
manually curated ones.
