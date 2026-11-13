import dpwhRaw from '@/content/data/dpwh-projects.json';
import fiscalRaw from '@/content/data/fiscal_transparency.json';
import {
  check,
  isHttpUrl,
  isIsoDate,
  isNum,
  isObj,
  isText,
  list,
  type Obj,
} from '@/shared/validate';

/** Amounts are in millions of pesos. */
export interface FiscalPeriod {
  id: string;
  label: string;
  range?: string;
  income: { local: number; external: number; total: number };
  expenditures: { gps: number; social: number; economic: number; debt: number; total: number };
  netIncome: number;
  fundBalance: number;
}

export interface FiscalYear {
  year: number;
  source_url: string;
  periods: FiscalPeriod[];
}

const F = 'fiscal_transparency.json';
const amounts = (v: unknown, keys: string[]) => isObj(v) && keys.every((k) => isNum(v[k]));

function parsePeriod(p: Obj, where: string): FiscalPeriod {
  check(isText(p.id) && isText(p.label), `${where} needs an id and a label`);
  check(
    amounts(p.income, ['local', 'external', 'total']),
    `${where}.income needs numeric local, external and total`
  );
  check(
    amounts(p.expenditures, ['gps', 'social', 'economic', 'debt', 'total']),
    `${where}.expenditures needs numeric gps, social, economic, debt and total`
  );
  check(
    isNum(p.netIncome) && isNum(p.fundBalance),
    `${where} needs numeric netIncome and fundBalance`
  );
  return p as unknown as FiscalPeriod;
}

/** Validates every year; returns them newest first. The page shows the first one. */
export function parseFiscal(data: unknown): FiscalYear[] {
  return list(data, F, 'fiscal_years')
    .map((y, i) => {
      const where = `${F}: fiscal_years[${i}]`;
      check(isNum(y.year), `${where}.year must be a number`);
      check(isHttpUrl(y.source_url), `${where}.source_url must be an http(s) URL`);
      const periods = list(y, where, 'periods').map((p, j) =>
        parsePeriod(p, `${where}.periods[${j}]`)
      );
      check(periods.length > 0, `${where}.periods must not be empty`);
      return { year: y.year, source_url: y.source_url, periods };
    })
    .sort((a, b) => b.year - a.year);
}

export const fiscalYears = parseFiscal(fiscalRaw);

export interface DpwhProject {
  id: string;
  name: string;
  location: string;
  category: string;
  contractor: string;
  contractorId?: string;
  cost: number;
  /** Percent complete, 0–100. */
  status: number;
  completionDate: string | null;
}

const D = 'dpwh-projects.json';

export function parseDpwh(data: unknown): DpwhProject[] {
  return list(data, D, 'projects').map((p, i) => {
    const where = `${D}: projects[${i}]`;
    for (const k of ['id', 'name', 'location', 'category', 'contractor'])
      check(isText(p[k]), `${where}.${k} must be a non-empty string`);
    check(isNum(p.cost) && p.cost >= 0, `${where}.cost must be a non-negative number`);
    check(isNum(p.status) && p.status >= 0 && p.status <= 100, `${where}.status must be 0 to 100`);
    check(
      p.completionDate === null || isIsoDate(p.completionDate),
      `${where}.completionDate must be YYYY-MM-DD or null`
    );
    return p as unknown as DpwhProject;
  });
}

export const dpwhProjects = parseDpwh(dpwhRaw);

export type DpwhCategory = 'buildings' | 'roads' | 'flood' | 'water';
/** Same keyword mapping as dpwh-projects.js. */
export const dpwhCategory = (c: string): DpwhCategory =>
  c.includes('Flood')
    ? 'flood'
    : c.includes('Road')
      ? 'roads'
      : c.includes('Water')
        ? 'water'
        : 'buildings';
