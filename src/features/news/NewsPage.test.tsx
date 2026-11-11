import { render, screen } from '@testing-library/react';
import { FB_PAGE_URL, parseNews } from '@/features/news/newsData';
import { NewsPage } from '@/features/news/NewsPage';

const item = (id: string, date: string) => ({
  id,
  title: `Title ${id}`,
  date,
  category: 'Advisory',
  badge: 'info',
  summary: `Summary ${id}`,
});

describe('NewsPage', () => {
  it('lists every item, newest first', () => {
    const items = parseNews({
      news: [
        item('a', '2026-01-05'),
        item('b', '2026-03-01'),
        item('c', '2025-12-31'),
        item('d', '2026-02-10'),
      ],
    });
    render(<NewsPage items={items} />);
    const titles = screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent);
    expect(titles.slice(0, 4)).toEqual(['Title b', 'Title d', 'Title a', 'Title c']);
    expect(screen.queryByText('No updates yet')).toBeNull();
  });

  it('shows the empty state linking to the official Facebook page', () => {
    render(<NewsPage items={[]} />);
    expect(screen.getByText('No updates yet')).toBeTruthy();
    const link = screen.getByRole('link', {
      name: /Provincial Government of Bukidnon on Facebook/,
    });
    expect(link.getAttribute('href')).toBe(FB_PAGE_URL);
  });
});
