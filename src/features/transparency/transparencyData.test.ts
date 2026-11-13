import {
  dpwhCategory,
  dpwhProjects,
  fiscalYears,
  parseDpwh,
  parseFiscal,
} from '@/features/transparency/transparencyData';

const period = {
  id: 'q1',
  label: 'Q1',
  income: { local: 1, external: 2, total: 3 },
  expenditures: { gps: 1, social: 1, economic: 0.5, debt: 0, total: 2.5 },
  netIncome: 0.5,
  fundBalance: 10,
};
const project = {
  id: 'P1',
  name: 'Road widening',
  location: 'Malaybalay City',
  category: 'Roads',
  contractor: 'ACME',
  cost: 1_000_000,
  status: 40,
  completionDate: null,
};

describe('parseFiscal', () => {
  it('accepts the empty fiscal_transparency.json', () => {
    expect(fiscalYears).toEqual([]);
  });

  it('returns years newest first and rejects malformed periods', () => {
    const years = [
      { year: 2024, source_url: 'https://blgf.gov.ph/', periods: [period] },
      { year: 2025, source_url: 'https://blgf.gov.ph/', periods: [period] },
    ];
    expect(parseFiscal({ fiscal_years: years }).map((y) => y.year)).toEqual([2025, 2024]);
    const bad = (p: object, url = 'https://blgf.gov.ph/') =>
      parseFiscal({ fiscal_years: [{ year: 2025, source_url: url, periods: [p] }] });
    expect(() => bad({ ...period, income: { local: 1 } })).toThrow(/income/);
    expect(() => bad({ ...period, netIncome: '1' })).toThrow(/netIncome/);
    expect(() => bad(period, 'ftp://x')).toThrow(/source_url/);
  });
});

describe('parseDpwh', () => {
  it('accepts the empty dpwh-projects.json', () => {
    expect(dpwhProjects).toEqual([]);
  });

  it('accepts a valid project and rejects malformed ones', () => {
    expect(parseDpwh({ projects: [project] })).toHaveLength(1);
    expect(() => parseDpwh({ projects: [{ ...project, status: 120 }] })).toThrow(/status/);
    expect(() => parseDpwh({ projects: [{ ...project, cost: -1 }] })).toThrow(/cost/);
    expect(() => parseDpwh({ projects: [{ ...project, completionDate: '2025' }] })).toThrow(
      /completionDate/
    );
    expect(() => parseDpwh({ projects: [{ ...project, name: '' }] })).toThrow(/name/);
  });

  it('maps categories like dpwh-projects.js', () => {
    expect(dpwhCategory('Flood Control Structures')).toBe('flood');
    expect(dpwhCategory('Roads and Bridges')).toBe('roads');
    expect(dpwhCategory('Water Supply')).toBe('water');
    expect(dpwhCategory('School Building')).toBe('buildings');
  });
});
