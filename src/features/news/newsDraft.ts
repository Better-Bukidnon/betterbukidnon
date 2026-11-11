import { BADGES, parseNews, type Badge, type NewsItem } from '@/features/news/newsData';

/** Same limits and presets as legacy/admin/news-editor.html. */
export const LIMITS = { title: 120, summary: 300, category: 32, source: 40, id: 80 } as const;

export const PRESET_BADGE: Record<string, Badge> = {
  announcement: 'info',
  advisory: 'warning',
  project: 'success',
  event: 'info',
  service: 'success',
  notice: 'warning',
  health: 'info',
  weather: 'warning',
};

export type Field = 'id' | 'title' | 'date' | 'category' | 'badge' | 'summary' | 'url' | 'source';
export type Draft = Record<Field, string>;
export type Errors = Partial<Record<Field, string>>;

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 70);

/** `base`, or `base-2`, `base-3`… when another entry already has it. */
export function uniqueId(base: string, taken: string[]) {
  const id = base || 'update';
  if (!taken.includes(id)) return id;
  let n = 2;
  while (taken.includes(`${id}-${n}`)) n++;
  return `${id}-${n}`;
}

export const emptyDraft = (date: string): Draft => ({
  id: '',
  title: '',
  date,
  category: '',
  badge: 'info',
  summary: '',
  url: '',
  source: '',
});

export const toDraft = (n: NewsItem): Draft => ({ ...n, url: n.url ?? '', source: n.source ?? '' });

/** Field errors, then the news validator itself, so the editor cannot produce a file the build rejects. */
export function validate(d: Draft, otherIds: string[]): { item?: NewsItem; errors: Errors } {
  const v = {
    ...d,
    id: slugify(d.id.trim() || d.title),
    url: d.url.trim(),
    source: d.source.trim(),
  };
  const errors: Errors = {};
  const title = d.title.trim();
  const summary = d.summary.trim();
  const category = d.category.trim();
  if (!title || title.length > LIMITS.title)
    errors.title = `A title is required (max ${LIMITS.title} characters).`;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(d.date) || isNaN(Date.parse(d.date)))
    errors.date = 'A valid date is required.';
  if (!(BADGES as readonly string[]).includes(d.badge)) errors.badge = 'Choose a badge color.';
  if (!category || category.length > LIMITS.category)
    errors.category = 'A category label is required.';
  if (!summary || summary.length > LIMITS.summary)
    errors.summary = `A summary is required (max ${LIMITS.summary} characters).`;
  if (v.url && !/^https?:\/\/.+/i.test(v.url))
    errors.url = 'Enter a valid http(s) URL or leave blank.';
  if (!v.id || otherIds.includes(v.id)) errors.id = 'A unique ID is required (lowercase, dashes).';
  if (Object.keys(errors).length) return { errors };

  const raw = { ...v, title, summary, category, url: v.url || null, source: v.source || undefined };
  return { item: parseNews({ news: [raw] })[0], errors };
}

/** news.json as the site reads it: newest first, two-space indent, trailing newline. */
export const toJson = (items: NewsItem[]) =>
  JSON.stringify({ news: [...items].sort((a, b) => b.date.localeCompare(a.date)) }, null, 2) + '\n';
