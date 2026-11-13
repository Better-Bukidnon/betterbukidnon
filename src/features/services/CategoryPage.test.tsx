import { render, screen } from '@testing-library/react';
import { categories, type TemplateCategory } from '@/features/services/categories';
import { CategoryPage } from '@/features/services/CategoryPage';
import { HealthPage } from '@/features/services/HealthPage';
import en from '@/features/services/i18n/en.json';
import { ServicesIndexPage } from '@/features/services/ServicesIndexPage';

describe('category pages', () => {
  it.each(Object.keys(categories) as TemplateCategory[])('%s renders', (slug) => {
    const c = categories[slug];
    render(<CategoryPage slug={slug} />);
    screen.getByRole('heading', { level: 1, name: en[c.title] });
    expect(screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)).toEqual(
      c.sections.map((s) => en[s.title])
    );
    for (const card of c.sections.flatMap((s) => s.cards))
      if (card.link)
        expect(
          screen
            .getAllByRole('link', { name: en[card.link.label] })
            .map((a) => a.getAttribute('href'))
        ).toContain(card.link.href);
    expect(screen.getByRole('note').textContent).toContain(en[c.note.text]);
  });

  it('health keeps its own layout on the shared hero', () => {
    render(<HealthPage />);
    screen.getByRole('heading', { level: 1, name: en['health-page-title'] });
    expect(
      screen.getByRole('link', { name: /Provincial Health Office details/ }).getAttribute('href')
    ).toBe('/service-details/provincial-health-office');
  });

  it('the directory links to all 10 categories', () => {
    render(<ServicesIndexPage />);
    const hrefs = screen.getAllByRole('link').map((a) => a.getAttribute('href'));
    for (const slug of [...Object.keys(categories), 'health'])
      expect(hrefs).toContain(`/services/${slug}`);
  });
});
