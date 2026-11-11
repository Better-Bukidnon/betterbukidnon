import { formatNewsDate, news, parseNews } from '@/features/news/newsData';

const item = (over: Record<string, unknown> = {}) => ({
  id: 'a',
  title: 'Title',
  date: '2026-03-10',
  category: 'Event',
  badge: 'info',
  summary: 'Summary',
  ...over,
});

describe('parseNews', () => {
  it('accepts the shipped news.json', () => {
    expect(Array.isArray(news)).toBe(true);
  });

  it('sorts newest first and drops a null url', () => {
    const list = parseNews({
      news: [
        item({ id: 'old', date: '2025-01-02', url: null }),
        item({ id: 'new', date: '2026-05-01' }),
        item({ id: 'mid', date: '2025-12-31' }),
      ],
    });
    expect(list.map((n) => n.id)).toEqual(['new', 'mid', 'old']);
    expect('url' in list[2]).toBe(false);
  });

  it('rejects non-http(s) urls, unknown badges, bad dates and missing fields', () => {
    expect(() => parseNews({ news: [item({ url: 'javascript:alert(1)' })] })).toThrow(/url/);
    expect(() => parseNews({ news: [item({ badge: 'danger' })] })).toThrow(/badge/);
    expect(() => parseNews({ news: [item({ date: '10/03/2026' })] })).toThrow(/date/);
    expect(() => parseNews({ news: [item({ title: ' ' })] })).toThrow(/title/);
    expect(() => parseNews({})).toThrow(/array/);
  });

  it('formats dates without a timezone shift', () => {
    expect(formatNewsDate('2026-03-10')).toBe('Mar 10, 2026');
  });
});
