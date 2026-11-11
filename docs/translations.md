# Translations

The site is available in three languages on the **same URLs**:

| Code  | Language           | Coverage                                                                         |
| ----- | ------------------ | -------------------------------------------------------------------------------- |
| `en`  | English            | Complete; the fallback for everything                                            |
| `fil` | Filipino           | Nearly all interface text; all 18 office pages                                   |
| `ceb` | Cebuano (Binisaya) | About four fifths of interface text, including all of the chrome; 4 office pages |

Cebuano replaced the upstream template's Ilocano because it is the language most widely
spoken in Bukidnon. Binukid, Higaonon and other indigenous languages would be welcome
additions (see [Adding a language](#adding-a-language)).

## How it works

- **Pre-rendered HTML is English.** A short script in `<head>` (`localeScript` in
  `src/features/i18n/locales.ts`) picks the language before the page paints and sets
  `<html lang>` and `data-locale`. The order is: the saved choice in
  `localStorage.selectedLang`, then the browser language (`tl`/`fil` → Filipino,
  `ceb`/`bis` → Cebuano), then English. The storage key is the same as on the old site, so
  returning visitors keep their choice.
- **`LanguageProvider`** (`src/features/i18n/LanguageProvider.tsx`) reads that choice on
  hydration and exposes `useLocale()`. The globe menu (`LanguageMenu.tsx`) calls
  `setLocale`, which updates `<html lang>` and saves the choice.
- **Each feature owns its strings** in `src/features/<feature>/i18n/en.json`, `fil.json` and
  `ceb.json`. The shared chrome (skip link, navigation, footer, common labels) uses
  `src/features/i18n/i18n/*.json`.
- **English is bundled; other languages load on demand.** Each feature has a dictionary
  module that imports `en.json` directly and the others lazily:

```ts
// src/features/news/newsDictionary.ts
import en from '@/features/news/i18n/en.json';
import type { Dictionary } from '@/features/i18n/useT';

export type NewsKey = keyof typeof en;

export const newsDictionary: Dictionary<NewsKey> = {
  en,
  load: {
    fil: () => import('@/features/news/i18n/fil.json'),
    ceb: () => import('@/features/news/i18n/ceb.json'),
  },
};
```

- **Components call `useT()`** with their dictionary:

```tsx
const t = useT(newsDictionary);
return <h1>{t('news-news-updates')}</h1>;
```

### Typed keys

Key types come from the English JSON (`keyof typeof en`). Calling `t()` with a key that is
not in `en.json` is a type error, so `npm run typecheck` and `npm run build` catch typos and
missing English strings.

### Fallback

A key missing from `fil.json` or `ceb.json` shows the English value. A language with no
loader for a feature shows English for that whole feature. While a language file is still
loading, the English text stays on screen.

### Placeholders

`{{name}}` placeholders are filled from the second argument:

```tsx
t('results-count', { count: 12 }); // "Showing {{count}} results" → "Showing 12 results"
```

Keep every `{{placeholder}}` unchanged in each language. A placeholder with no value is left
as written.

### Links and bold text inside a sentence

There is no `<Trans>` helper, and strings are plain text: never put HTML in a JSON value. When
a sentence needs a link or bold text, split it into separate keys and compose them in the
component, for example `{t('x-before')} <a href="…">{t('x-link')}</a> {t('x-after')}`.

### Tests

`src/features/i18n/i18n.test.tsx` covers detection order, interpolation, lazy loading and
fallback, and fails if the chrome `fil.json` or `ceb.json` has a key that is not in English.

## Editing translations

1. Find the key. Search the component for the text you see, or search the JSON files:
   `git grep -n "Provincial Treasurer" src/features`.
2. Change `en.json` first, then the same key in `fil.json` and `ceb.json`.
3. To add a string, add the key to `en.json` (keys keep their feature prefix, such as
   `news-`, `gov-`, `proj-`), then to the other languages if you can. Untranslated keys fall
   back to English, so adding English only is fine.
4. Check the page with `npm run dev` in all three languages.

Keys removed from `en.json` should be removed from `fil.json` and `ceb.json` too.

## Office pages (MDX)

Office pages are translated as whole files, not as keys:

```
src/content/service-details/<slug>/
├── en.mdx    required
├── fil.mdx   optional
└── ceb.mdx   optional
```

A translated file has only `title`, `summary` and `badge` in its frontmatter, followed by the
translated body. The office details (address, phone, sources) always come from `en.mdx`. See
[content-guide.md](content-guide.md#office-pages-mdx) for the full frontmatter.

English is rendered into the HTML. A translated file is a separate chunk that loads when the
visitor switches to that language. If an office has no file for the current language, the
page shows English with a small "Not yet translated" note. The note's wording is the
`sd-not-translated` key in `src/features/service-details/i18n/`.

To translate an office, copy `en.mdx` to `fil.mdx` or `ceb.mdx`, delete every frontmatter
field except `title`, `summary` and `badge`, and translate the text. Keep component names and
props (`<Service title={…}>`) and links as they are; translate only the text.

## Style

- **Filipino:** natural Tagalog-based Filipino. Keep official names in English where people
  use them that way ("Provincial Treasurer's Office", "Sangguniang Panlalawigan").
- **Cebuano:** everyday Binisaya as spoken in Malaybalay and Valencia, with the loanwords
  people use (serbisyo, opisina, permit, sertipiko, amilyar for real property tax).
  "Probinsya", not "Lalawigan"; "Gobyerno", not "Pamahalaan".
- Keep acronyms, phone numbers, email addresses, URLs and peso amounts unchanged.
- Some older Filipino strings inherited from the template are machine-translated and read
  awkwardly. Fixes are welcome.

## Adding a language

For example, Binukid (`bkd`):

1. Add it to `LOCALES` in `src/features/i18n/locales.ts`:
   `{ code: 'bkd', name: 'Binukid' }`. The language menu and the `Locale` type pick it up from
   there.
2. If browsers report a language code for it, map that code in `detectLocale` in the same
   file. Otherwise visitors choose it from the menu.
3. Add `bkd.json` next to each feature's `en.json` and a `bkd: () => import(…/bkd.json)` line
   in that feature's `<feature>Dictionary.ts`. Start with the chrome dictionary
   (`src/features/i18n/`); every key you leave out falls back to English.
4. Optionally add `bkd.mdx` files for office pages.
5. Run `npm run typecheck` and `npm test`, then check the site in the new language.
