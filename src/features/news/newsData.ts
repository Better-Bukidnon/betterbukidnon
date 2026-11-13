import raw from '@/content/data/news.json';

export const BADGES = ['info', 'success', 'warning'] as const;
export type Badge = (typeof BADGES)[number];

export interface NewsItem {
  id: string;
  title: string;
  /** YYYY-MM-DD */
  date: string;
  category: string;
  badge: Badge;
  summary: string;
  url?: string;
  source?: string;
}

export const FB_PAGE_URL = 'https://www.facebook.com/lgubukidnon';

const isText = (v: unknown): v is string => typeof v === 'string' && v.trim() !== '';

/** Throws at build time, so a malformed news.json (hand-curated or synced) never ships. */
export function parseNews(data: unknown): NewsItem[] {
  const list = (data as { news?: unknown })?.news;
  if (!Array.isArray(list)) throw new Error('news.json: "news" must be an array');
  // The editor finds items by id, so a duplicate would make one edit overwrite both.
  const ids = new Set<string>();
  const items = list.map((n, i): NewsItem => {
    const where = `news.json: news[${i}]`;
    for (const field of ['id', 'title', 'category', 'summary']) {
      if (!isText(n?.[field])) throw new Error(`${where}.${field} must be a non-empty string`);
    }
    if (ids.has(n.id)) throw new Error(`${where}.id "${n.id}" is used twice`);
    ids.add(n.id);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(n.date)) throw new Error(`${where}.date must be YYYY-MM-DD`);
    if (!BADGES.includes(n.badge)) throw new Error(`${where}.badge must be ${BADGES.join('|')}`);
    // null is what the Facebook sync writes for a post without a permalink.
    if (n.url != null && !/^https?:\/\//i.test(n.url)) {
      throw new Error(`${where}.url must be an http(s) URL`);
    }
    return {
      id: n.id,
      title: n.title,
      date: n.date,
      category: n.category,
      badge: n.badge,
      summary: n.summary,
      ...(n.url ? { url: n.url } : {}),
      ...(isText(n.source) ? { source: n.source } : {}),
    };
  });
  // Newest first; ISO dates sort as strings.
  return items.sort((a, b) => b.date.localeCompare(a.date));
}

export const news = parseNews(raw);

const dateFormat = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
});

/** "2026-03-10" -> "Mar 10, 2026", the same in every timezone. */
export const formatNewsDate = (date: string) => dateFormat.format(new Date(`${date}T00:00:00Z`));
