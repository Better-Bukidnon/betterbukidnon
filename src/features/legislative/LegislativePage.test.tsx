import { fireEvent, render, screen, within } from '@testing-library/react';
import { FrameworkPage } from '@/features/legislative/FrameworkPage';
import { LegislativePage } from '@/features/legislative/LegislativePage';

describe('LegislativePage', () => {
  it('renders members and switches the flowchart between ordinances and resolutions', () => {
    render(<LegislativePage />);
    expect(screen.getByRole('heading', { level: 1, name: 'Legislative Documents' })).toBeTruthy();
    expect(screen.getByText('Hon. Clive D. Quiño')).toBeTruthy();
    const flow = () =>
      within(document.getElementById('leg-flow') as HTMLElement).getAllByRole('listitem');
    expect(flow()).toHaveLength(11);
    const resolutions = screen.getByRole('button', { name: /For Resolutions/ });
    fireEvent.click(resolutions);
    expect(resolutions.getAttribute('aria-pressed')).toBe('true');
    expect(flow()).toHaveLength(6);
  });
});

describe('FrameworkPage', () => {
  it.each([
    ['ord', 'Ordinance Framework', 6],
    ['reso', 'Resolution Framework', 5],
  ] as const)(
    '%s: renders the steps and the empty records state linking the official source',
    (kind, title, steps) => {
      render(<FrameworkPage kind={kind} />);
      expect(screen.getByRole('heading', { level: 1, name: title })).toBeTruthy();
      // Lists: breadcrumb, category/type tags (6), process steps.
      const [, tags, process] = screen.getAllByRole('list');
      expect(tags?.querySelectorAll('li')).toHaveLength(6);
      expect(process?.querySelectorAll('li')).toHaveLength(steps);
      expect(screen.getByRole('heading', { name: 'No records published here yet.' })).toBeTruthy();
      expect(
        screen.getByRole('link', { name: /https:\/\/bukidnon\.gov\.ph\// }).getAttribute('href')
      ).toBe('https://bukidnon.gov.ph/');
    }
  );
});
