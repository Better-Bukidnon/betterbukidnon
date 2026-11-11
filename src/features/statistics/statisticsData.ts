import cmciRaw from '@/content/data/competitive-index.json';
import raw from '@/content/data/demographics.json';
import { check, isNum, isObj, isText, list, parseSources, type Source } from '@/shared/validate';

export type District = 1 | 2 | 3 | 4;
/** One per district, 1st to 4th. Palette hexes (canvas cannot read Tailwind classes): primary, accent, success, info. */
export const DISTRICT_COLORS = ['#0032a0', '#f77f00', '#06a77d', '#0077be'];
export const isDistrict = (v: unknown): v is District => v === 1 || v === 2 || v === 3 || v === 4;

export interface Lgu {
  name: string;
  type: 'city' | 'municipality';
  capital?: boolean;
  district: District;
  population_2020: number;
  area_km2: number;
  barangays: number;
}

export interface Demographics {
  population: { total: number; year: number; source: string };
  population_2020: { total: number; year: number; source: string };
  land_area_km2: number;
  counts: { cities: number; municipalities: number; barangays: number };
  lgus: Lgu[];
  sources: Source[];
}

const F = 'demographics.json';

export function parseDemographics(data: unknown): Demographics {
  check(isObj(data), `${F}: must be an object`);
  for (const key of ['population', 'population_2020']) {
    const p = data[key];
    check(
      isObj(p) && isNum(p.total) && isNum(p.year) && isText(p.source),
      `${F}: "${key}" needs total, year and source`
    );
  }
  check(isNum(data.land_area_km2), `${F}: "land_area_km2" must be a number`);
  const c = data.counts;
  check(
    isObj(c) && isNum(c.cities) && isNum(c.municipalities) && isNum(c.barangays),
    `${F}: "counts" needs cities, municipalities and barangays`
  );
  list(data, F, 'lgus').forEach((l, i) => {
    const where = `${F}: lgus[${i}]`;
    check(isText(l.name), `${where}.name must be a non-empty string`);
    check(
      l.type === 'city' || l.type === 'municipality',
      `${where}.type must be "city" or "municipality"`
    );
    check(isDistrict(l.district), `${where}.district must be 1, 2, 3 or 4`);
    for (const k of ['population_2020', 'area_km2', 'barangays'])
      check(isNum(l[k]) && (l[k] as number) >= 0, `${where}.${k} must be a non-negative number`);
  });
  parseSources(data, F);
  return data as unknown as Demographics;
}

export const demographics = parseDemographics(raw);

export interface DistrictTotals {
  district: District;
  population: number;
  barangays: number;
  lgus: string[];
}

/** One entry per legislative district, 1st to 4th, summed from the LGU rows. */
export function groupByDistrict(lgus: Lgu[]): DistrictTotals[] {
  const map = new Map<District, DistrictTotals>();
  for (const l of [...lgus].sort((a, b) => a.name.localeCompare(b.name))) {
    const d = map.get(l.district) ?? {
      district: l.district,
      population: 0,
      barangays: 0,
      lgus: [],
    };
    d.population += l.population_2020;
    d.barangays += l.barangays;
    d.lgus.push(l.name);
    map.set(l.district, d);
  }
  return [...map.values()].sort((a, b) => a.district - b.district);
}

export interface Cmci {
  source_url: string;
  years: number[];
  overall: (number | null)[];
  pillars: { id: string; name: string; scores: (number | null)[] }[];
}

const C = 'competitive-index.json';
const isScores = (v: unknown, n: number) =>
  Array.isArray(v) && v.length === n && v.every((s) => s === null || isNum(s));

export function parseCmci(data: unknown): Cmci {
  check(isObj(data), `${C}: must be an object`);
  check(
    isText(data.source_url) && /^https:\/\//.test(data.source_url),
    `${C}: "source_url" must be an https URL`
  );
  const years = data.years;
  check(Array.isArray(years) && years.every(isNum), `${C}: "years" must be an array of numbers`);
  check(
    Array.isArray(data.overall) &&
      (data.overall.length === 0 || isScores(data.overall, years.length)),
    `${C}: "overall" must be empty or have one score (or null) per year`
  );
  list(data, C, 'pillars').forEach((p, i) => {
    check(isText(p.id) && isText(p.name), `${C}: pillars[${i}] needs an id and a name`);
    check(
      isScores(p.scores, years.length),
      `${C}: pillars[${i}].scores must have one score (or null) per year`
    );
  });
  return data as unknown as Cmci;
}

export const cmci = parseCmci(cmciRaw);
/** The CMCI block shows scores only once the file has years and at least one row. */
export const hasCmci = (c: Cmci) =>
  c.years.length > 0 && (c.overall.length > 0 || c.pillars.length > 0);
