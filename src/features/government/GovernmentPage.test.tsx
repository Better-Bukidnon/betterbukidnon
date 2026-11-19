import { render, screen, within } from '@testing-library/react';
import { GovernmentPage } from '@/features/government/GovernmentPage';
import { OfficialsPage } from '@/features/government/OfficialsPage';

describe('GovernmentPage', () => {
  it('renders the legacy sections in order, with every LGU and district totals', () => {
    const { container } = render(<GovernmentPage />);
    expect(
      screen.getByRole('heading', { level: 1, name: 'Provincial Government of Bukidnon' })
    ).toBeTruthy();
    const ids = [...container.querySelectorAll('section[id]')].map((s) => s.id);
    expect(ids).toEqual(['leadership', 'provincial-board', 'offices', 'districts', 'lgus']);
    const table = screen.getByRole('table');
    expect(within(table).getAllByRole('row')).toHaveLength(1 + 22 + 1);
    expect(within(table).getByRole('rowheader', { name: 'Malaybalay City' })).toBeTruthy();
    expect(screen.getByText('332,575')).toBeTruthy();
    expect(screen.getByText('1,541,308')).toBeTruthy();
  });
});

describe('OfficialsPage', () => {
  it('renders the governor, board, ex officio and representatives with https sources', () => {
    render(<OfficialsPage />);
    expect(screen.getByText('Hon. Rogelio Neil P. Roque')).toBeTruthy();
    expect(screen.getAllByText('Board Member')).toHaveLength(10);
    expect(screen.getByText('Hon. Laarni Roque')).toBeTruthy();
    const source = screen.getByRole('link', { name: 'Wikipedia: Bukidnon Provincial Board' });
    expect(source.getAttribute('href')).toMatch(/^https:\/\//);
  });
});
