# News Curation

How the **Latest Updates** section on the homepage and the **News** page are kept up to date.

## How it works

Both sections read one file, `src/content/data/news.json`, through
`src/features/news/newsData.ts`. The homepage shows the 3 newest items; the News page shows
all of them, newest first. There is no backend: the file is imported at build time and baked
into the HTML.

That means **a news change is published only by a commit and a rebuild**. Editing the file
changes nothing on the live site until the commit reaches `develop` (dev site) or `main`
(production) and Workers Builds redeploys.

While the file has no items (`{ "news": [] }`), both sections show an empty state: "No updates
yet. Follow the Provincial Government of Bukidnon on Facebook", linking to
<https://www.facebook.com/lgubukidnon>.

Entries come from two places, which merge in the same file:

- **Curated** entries, written with the editor below. Their `id` must not start with `fb-`.
- **Facebook** entries (`id` starting with `fb-`), written by the automatic sync. See
  [facebook-sync.md](facebook-sync.md).

## The news editor (development only)

To avoid hand-editing JSON, use the editor at `/admin/news-editor`. It exists only under
`npm run dev`; it is never built or deployed (see
[architecture.md](architecture.md#dev-only-admin-news-editor)).

1. Start the development server:
   ```bash
   npm run dev
   ```
2. Open <http://localhost:3000/admin/news-editor>. It loads the current `news.json`.
3. Click **+ Add new update** (or **Edit** on an existing entry) and fill in:
   - **Title** (up to 120 characters) and **Summary** (up to 300)
   - **Date**, **Category** label and **Badge** color (`info` blue, `success` green,
     `warning` amber). Common categories pick a badge color automatically.
   - **Link URL** (optional), for example the original Facebook post. Must be `http(s)`.
   - **Link label** (optional), shown instead of "Read more"
   - **ID**, filled in from the title. It must be unique.

   The live preview uses the site's own `NewsCard`, so it shows exactly what will ship.
   Validation blocks entries that would fail the build.

4. Click **Save update**. Repeat for other entries.
5. Click **Download news.json**.
6. Replace `src/content/data/news.json` with the downloaded file, then commit it and open a
   pull request into `develop`.

**Copy JSON** puts the file on the clipboard instead. **Import file…** loads a `news.json`
you saved earlier, and **Reload from news.json** discards your unsaved changes.

The editor works on an in-memory copy. Nothing is written to disk until you replace the file
yourself.

## Schema

```jsonc
{
  "news": [
    {
      "id": "unique-slug", // required, lowercase + dashes; "fb-…" is reserved for the sync
      "title": "string", // required, ≤ 120 characters
      "date": "YYYY-MM-DD", // required
      "category": "Announcement", // required, label shown on the badge
      "badge": "info", // required: info | success | warning
      "summary": "string", // required, ≤ 300 characters
      "url": "https://...", // optional outbound link (or null)
      "source": "View on Facebook", // optional link label (defaults to "Read more")
    },
  ],
}
```

`parseNews` in `newsData.ts` checks every entry at build time. A missing field, a bad date, an
unknown badge or a non-`http(s)` URL fails `npm run build` and `npm test` with a message
naming the entry, so a broken file cannot reach the live site. The length limits are
enforced by the editor and by the Facebook sync, not by the build.

React renders all fields as text, so no HTML in an entry is ever interpreted.
