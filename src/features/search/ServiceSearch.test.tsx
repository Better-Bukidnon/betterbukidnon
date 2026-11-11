import { fireEvent, render, screen } from '@testing-library/react';
import { ServiceSearch } from '@/features/search/ServiceSearch';
import { parseServices, searchServices, services } from '@/features/search/serviceIndex';

describe('parseServices', () => {
  it('accepts services.json and turns legacy relative URLs into clean paths', () => {
    expect(services.length).toBeGreaterThan(0);
    for (const s of services) expect(s.url).toMatch(/^\/[a-z0-9/-]*$/);
    expect(services.find((s) => s.id === 'birth-certificate')?.url).toBe(
      '/service-details/birth-certificate'
    );
  });

  it('rejects a malformed entry', () => {
    expect(() => parseServices({ services: [{ id: 'x' }] })).toThrow(/title/);
    expect(() =>
      parseServices({
        services: [
          {
            id: 'x',
            title: 'X',
            category: 'C',
            categoryId: 'c',
            description: 'D',
            keywords: ['k'],
            url: 'javascript:alert(1)',
          },
        ],
      })
    ).toThrow(/site path/);
  });
});

describe('searchServices', () => {
  it('ranks the exact title first, tolerates typos and ignores short queries', () => {
    expect(searchServices('birth certificate')[0].id).toBe('birth-certificate');
    expect(searchServices('brith certficate')[0].id).toBe('birth-certificate');
    expect(searchServices('kasal')[0].id).toBe('marriage-certificate');
    expect(searchServices('b')).toEqual([]);
    expect(searchServices('zzzzqqq')).toEqual([]);
  });
});

describe('ServiceSearch', () => {
  it('works as a combobox: arrows move the active option, Escape closes', () => {
    render(<ServiceSearch label="Search services" placeholder="Search" />);
    const input = screen.getByRole('combobox');
    fireEvent.change(input, { target: { value: 'birth' } });
    expect(input.getAttribute('aria-expanded')).toBe('true');

    fireEvent.keyDown(input, { key: 'ArrowDown' });
    const first = screen.getAllByRole('option')[0];
    expect(input.getAttribute('aria-activedescendant')).toBe(first.id);
    expect(first.getAttribute('aria-selected')).toBe('true');

    fireEvent.keyDown(input, { key: 'Escape' });
    expect(input.getAttribute('aria-expanded')).toBe('false');
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  it('says so when nothing matches', () => {
    render(<ServiceSearch label="Search services" placeholder="Search" />);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'zzzzqqq' } });
    expect(screen.getByRole('status').textContent).toMatch(/No services found/);
  });
});
