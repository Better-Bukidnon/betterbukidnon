import fs from 'node:fs';
import path from 'node:path';

// Translation coverage (spec §9): a report, never a failure. A key used in code but missing from
// en is already a type error (useT keys come from en.json); missing fil/ceb keys fall back to en.
const FEATURES = path.resolve('src/features');
const read = (file: string): Record<string, unknown> =>
  fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : {};

it('reports FIL and CEB coverage per feature', () => {
  const rows = fs
    .readdirSync(FEATURES)
    .filter((feature) => fs.existsSync(path.join(FEATURES, feature, 'i18n', 'en.json')))
    .map((feature) => {
      const dict = (locale: string) => read(path.join(FEATURES, feature, 'i18n', `${locale}.json`));
      const keys = Object.keys(dict('en'));
      const pct = (locale: string) => {
        const d = dict(locale);
        return `${Math.round((100 * keys.filter((k) => d[k]).length) / (keys.length || 1))}%`;
      };
      return { feature, keys: keys.length, fil: pct('fil'), ceb: pct('ceb') };
    });
  console.table(rows);
  expect(rows.length).toBeGreaterThan(0);
});
