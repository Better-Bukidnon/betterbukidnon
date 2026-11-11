import { validateFrontmatter } from '@/features/service-details/frontmatter';

const valid = () => ({
  title: 'Provincial Treasurer',
  slug: 'provincial-treasurer',
  badge: 'Treasury',
  category: 'tax-payments',
  summary: 'Taxes and fees',
  lastVerified: '2026-11-11',
  office: {
    name: "Provincial Treasurer's Office",
    head: '',
    address: 'Provincial Capitol Compound, Malaybalay City',
    phone: '(088) 813-2474',
    email: '',
    hours: 'Monday to Friday, 8:00 AM to 5:00 PM',
    mapLink: '',
  },
  sources: ['https://bukidnon.gov.ph/'],
});

describe('validateFrontmatter', () => {
  it('accepts a complete office', () => {
    expect(validateFrontmatter(valid(), 'x/en.mdx').office.phone).toBe('(088) 813-2474');
  });

  it.each(['title', 'slug', 'summary', 'lastVerified', 'badge'])('rejects a missing %s', (key) => {
    const data: Record<string, unknown> = valid();
    delete data[key];
    expect(() => validateFrontmatter(data, 'x/en.mdx')).toThrow(`"${key}"`);
  });

  it.each(['name', 'head', 'address', 'phone', 'email', 'hours', 'mapLink'])(
    'rejects a missing office.%s',
    (key) => {
      const data = valid();
      const office: Record<string, unknown> = data.office;
      delete office[key];
      expect(() => validateFrontmatter(data, 'x/en.mdx')).toThrow(`"${key}"`);
    }
  );

  it('rejects a bad category, date or source list', () => {
    expect(() => validateFrontmatter({ ...valid(), category: 'nope' }, 'x')).toThrow('category');
    expect(() => validateFrontmatter({ ...valid(), lastVerified: 'May' }, 'x')).toThrow('date');
    expect(() => validateFrontmatter({ ...valid(), sources: [] }, 'x')).toThrow('sources');
    expect(() => validateFrontmatter({ ...valid(), office: undefined }, 'x')).toThrow('office');
    expect(() => validateFrontmatter(undefined, 'x')).toThrow('no frontmatter');
  });
});
