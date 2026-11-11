import cmciRaw from '@/content/data/competitive-index.json';
import raw from '@/content/data/demographics.json';
import {
  cmci,
  demographics,
  groupByDistrict,
  hasCmci,
  parseCmci,
  parseDemographics,
} from '@/features/statistics/statisticsData';

describe('parseDemographics', () => {
  it('accepts demographics.json: 2 cities, 20 municipalities', () => {
    expect(demographics.lgus.filter((l) => l.type === 'city')).toHaveLength(2);
    expect(demographics.lgus.filter((l) => l.type === 'municipality')).toHaveLength(20);
  });

  it('groups LGUs into the four districts with the legacy totals', () => {
    const d = groupByDistrict(demographics.lgus);
    expect(d.map((x) => x.population)).toEqual([332575, 409880, 482016, 316837]);
    expect(d.reduce((s, x) => s + x.population, 0)).toBe(demographics.population_2020.total);
  });

  it('rejects malformed data', () => {
    const lgu = raw.lgus[0];
    expect(() => parseDemographics({ ...raw, lgus: [{ ...lgu, district: 9 }] })).toThrow(
      /lgus\[0\]\.district/
    );
    expect(() => parseDemographics({ ...raw, lgus: [{ ...lgu, population_2020: '1' }] })).toThrow(
      /population_2020/
    );
    expect(() => parseDemographics({ ...raw, lgus: [{ ...lgu, type: 'town' }] })).toThrow(/type/);
    expect(() => parseDemographics({ ...raw, population: {} })).toThrow(/population/);
  });
});

describe('parseCmci', () => {
  it('accepts the empty competitive-index.json', () => {
    expect(hasCmci(cmci)).toBe(false);
  });

  it('accepts filled scores and rejects mismatched or unsafe data', () => {
    const filled = {
      ...cmciRaw,
      years: [2023, 2024],
      overall: [40.1, null],
      pillars: [{ id: 'e', name: 'Economy', scores: [1, 2] }],
    };
    expect(hasCmci(parseCmci(filled))).toBe(true);
    expect(() => parseCmci({ ...filled, pillars: [{ id: 'e', name: 'E', scores: [1] }] })).toThrow(
      /one score/
    );
    expect(() => parseCmci({ ...filled, source_url: 'http://example.com' })).toThrow(/https/);
  });
});
