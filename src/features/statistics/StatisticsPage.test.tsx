import { render, screen, within } from '@testing-library/react';
import { StatisticsPage } from '@/features/statistics/StatisticsPage';

// Chart.js needs a real canvas; the charts are covered by the build, not jsdom.
vi.mock('@/features/statistics/StatisticsCharts', () => ({
  DistrictChart: () => <div data-testid="district-chart" />,
  PopulationBarChart: () => <div data-testid="bar-chart" />,
}));

describe('StatisticsPage', () => {
  it('renders metrics, the per-LGU table and the CMCI empty state with the official link', () => {
    render(<StatisticsPage />);
    expect(screen.getByRole('heading', { level: 1, name: 'Provincial Statistics' })).toBeTruthy();
    // Counters render the final figure in the HTML (and under reduced motion).
    expect(screen.getAllByText('1,601,902').length).toBeGreaterThan(0);
    expect(screen.getByText('+3.9%')).toBeTruthy();

    const table = screen.getByRole('table');
    expect(within(table).getAllByRole('columnheader')).toHaveLength(5);
    expect(within(table).getAllByRole('row')).toHaveLength(1 + 22 + 1);

    const cmci = screen.getByRole('link', { name: /See the official CMCI results/ });
    expect(cmci.getAttribute('href')).toBe('https://cmci.dti.gov.ph/');
  });
});
