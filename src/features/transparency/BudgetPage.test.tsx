import { render, screen } from '@testing-library/react';
import { BudgetPage } from '@/features/transparency/BudgetPage';

describe('BudgetPage', () => {
  it('renders every section with empty states that link the official sources', () => {
    render(<BudgetPage />);
    expect(
      screen.getByRole('heading', { level: 1, name: 'Budget & Financial Transparency' })
    ).toBeTruthy();
    expect(
      screen.getAllByRole('heading', { name: 'We are still gathering this information.' })
    ).toHaveLength(3);
    const hrefs = screen.getAllByRole('link').map((a) => a.getAttribute('href'));
    for (const url of [
      'https://blgf.gov.ph/',
      'https://fdpp.dilg.gov.ph/',
      'https://www.dpwh.gov.ph/',
      '/service-details/provincial-engineering',
      'https://www.coa.gov.ph/',
    ])
      expect(hrefs).toContain(url);
    expect(screen.queryByRole('table')).toBeNull();
  });
});
