import { act, fireEvent, render, screen, within } from '@testing-library/react';
import type { Project } from '@/features/projects/projectsData';
import { ProjectsPage } from '@/features/projects/ProjectsPage';

// jsdom has <dialog> but not its methods; mimic the browser's open/close/close-event contract.
beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function () {
    this.open = true;
  };
  HTMLDialogElement.prototype.close = function () {
    if (!this.open) return;
    this.open = false;
    this.dispatchEvent(new Event('close'));
  };
});

const project = (id: string, status: string, category: string, repo: string): Project => ({
  id,
  name: `${id} tool`,
  description: `About ${id}`,
  url: `https://${id}.example.org`,
  repos: [{ name: `org/${repo}`, url: `https://github.com/org/${repo}` }],
  type: 'org',
  category,
  status,
  icon: 'bi-cash-coin',
});

const items = [
  project('alpha', 'active', 'transparency', 'alpha'),
  project('beta', 'active', 'health', 'beta'),
  project('gamma', 'development', 'transparency', 'alpha'),
  project('delta', 'archived', 'health', 'delta'),
];

const tab = (name: RegExp) => screen.getByRole('tab', { name });
const cards = () => within(screen.getByRole('tabpanel')).queryAllByRole('heading', { level: 2 });
const names = () => cards().map((h) => h.textContent);

describe('ProjectsPage', () => {
  it('shows the active tab first, with a count per status', () => {
    render(<ProjectsPage items={items} />);
    expect(tab(/Active/).getAttribute('aria-selected')).toBe('true');
    expect(tab(/Active/).textContent).toContain('2');
    expect(tab(/Development/).textContent).toContain('1');
    expect(tab(/Archived/).textContent).toContain('1');
    expect(names()).toEqual(['alpha tool', 'beta tool']);
    expect(screen.getByText('Showing 2 projects')).toBeTruthy();
  });

  it('switches tabs by click and arrow keys (roving tabindex)', () => {
    render(<ProjectsPage items={items} />);
    fireEvent.click(tab(/Archived/));
    expect(names()).toEqual(['delta tool']);
    fireEvent.keyDown(tab(/Archived/), { key: 'ArrowRight' });
    expect(tab(/Active/).getAttribute('aria-selected')).toBe('true');
    expect(document.activeElement).toBe(tab(/Active/));
    expect(tab(/Archived/).tabIndex).toBe(-1);
    fireEvent.keyDown(tab(/Active/), { key: 'End' });
    expect(names()).toEqual(['delta tool']);
  });

  it('combines search, repo and category filters, and the counts follow them', () => {
    render(<ProjectsPage items={items} />);
    fireEvent.change(screen.getByLabelText('Search projects'), { target: { value: 'BETA' } });
    expect(names()).toEqual(['beta tool']);
    expect(tab(/Development/).textContent).toContain('0');

    fireEvent.change(screen.getByLabelText('Search projects'), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText('Filter by repository'), {
      target: { value: 'org/alpha' },
    });
    expect(names()).toEqual(['alpha tool']);
    expect(tab(/Development/).textContent).toContain('1');

    fireEvent.change(screen.getByLabelText('Filter by category'), { target: { value: 'health' } });
    expect(names()).toEqual([]);
    expect(screen.getByText('No projects match your search.')).toBeTruthy();
  });

  it('opens an accessible details dialog and returns focus on close', () => {
    render(<ProjectsPage items={items} />);
    const button = screen.getByRole('button', { name: /View Details - alpha tool/ });
    button.focus();
    fireEvent.click(button);
    const dialog = document.querySelector('dialog')!;
    expect(dialog.open).toBe(true);
    expect(dialog.getAttribute('aria-modal')).toBe('true');
    expect(screen.getByRole('dialog', { name: 'alpha tool' })).toBeTruthy();
    expect(within(dialog).getByText('1 repository')).toBeTruthy();
    expect(
      within(dialog)
        .getByRole('link', { name: /See contributors/ })
        .getAttribute('href')
    ).toBe('https://github.com/org/alpha/graphs/contributors');

    // Escape makes the browser close the dialog, which fires the same close event.
    act(() => dialog.close());
    expect(dialog.open).toBe(false);
    expect(document.activeElement).toBe(button);
  });

  it('closes on the Close button and on a backdrop click, not on a click inside', () => {
    render(<ProjectsPage items={items} />);
    fireEvent.click(screen.getByRole('button', { name: /View Details - beta tool/ }));
    const dialog = document.querySelector('dialog')!;
    fireEvent.click(within(dialog).getByText('About beta'));
    expect(dialog.open).toBe(true);
    fireEvent.click(within(dialog).getByRole('button', { name: /Close/ }));
    expect(dialog.open).toBe(false);

    fireEvent.click(screen.getByRole('button', { name: /View Details - beta tool/ }));
    fireEvent.click(dialog);
    expect(dialog.open).toBe(false);
  });
});
