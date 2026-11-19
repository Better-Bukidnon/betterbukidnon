import ordinancesRaw from '@/content/data/ordinances.json';
import resolutionsRaw from '@/content/data/resolutions.json';
import { check, isIsoDate, isText, list } from '@/shared/validate';

export interface LegislativeRecord {
  number: string;
  title: string;
  sessionDate: string;
}

/**
 * Validates ordinances.json / resolutions.json records and sorts them newest first
 * (session date, then natural-order number), as ordinances.js and resolutions.js did.
 */
export function parseRecords(
  data: unknown,
  file: string,
  key: string,
  numberField: string
): LegislativeRecord[] {
  return list(data, file, key)
    .map((r, i) => {
      const where = `${file}: ${key}[${i}]`;
      const number = r[numberField];
      check(isText(number), `${where}.${numberField} must be a non-empty string`);
      check(isText(r.title), `${where}.title must be a non-empty string`);
      check(isIsoDate(r.sessionDate), `${where}.sessionDate must be a YYYY-MM-DD date`);
      return { number, title: r.title, sessionDate: r.sessionDate };
    })
    .sort(
      (a, b) =>
        b.sessionDate.localeCompare(a.sessionDate) ||
        b.number.localeCompare(a.number, undefined, { numeric: true })
    );
}

export const ordinances = parseRecords(
  ordinancesRaw,
  'ordinances.json',
  'ordinances',
  'ordinanceNo'
);
export const resolutions = parseRecords(
  resolutionsRaw,
  'resolutions.json',
  'resolutions',
  'resolutionNo'
);

export const formatSessionDate = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
