'use client';

import {
  governmentDictionary,
  type GovernmentKey,
} from '@/features/government/governmentDictionary';
import { officials } from '@/features/government/governmentData';
import { useT } from '@/features/i18n/useT';
import { demographics, groupByDistrict, type Lgu } from '@/features/statistics/statisticsData';
import { SectionHeading } from '@/shared/SectionHeading';
import { card, section, stickyTh, table, tableWrap, td, th } from '@/shared/ui';

const n = (v: number) => v.toLocaleString('en-US');
const typeKey = (l: Lgu): GovernmentKey =>
  l.type === 'municipality'
    ? 'gov-type-municipality'
    : l.capital
      ? 'gov-type-capital-city'
      : 'gov-type-component-city';

export function DistrictsSection() {
  const t = useT(governmentDictionary);
  return (
    <section id="districts">
      <div className={section}>
        <SectionHeading title={t('gov-districts-title')}>
          <p>{t('gov-districts-subtitle')}</p>
        </SectionHeading>
        <div className="grid gap-md md:grid-cols-2">
          {groupByDistrict(demographics.lgus).map((d) => (
            <div key={d.district} className={card}>
              <h3 className="mb-xs text-xl font-semibold">{t(`gov-district-${d.district}`)}</h3>
              <p>
                <strong>{t('gov-representative')}:</strong>{' '}
                {officials.representatives.find((r) => r.district === d.district)?.name ?? '–'}
              </p>
              <p>
                <strong>{t('gov-member-lgus')}:</strong> {d.lgus.join(', ')}
              </p>
              <p>
                <strong>{t('gov-population-2020')}:</strong> {n(d.population)}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-md text-center text-sm text-text-light">
          {t('gov-districts-source')}{' '}
          <a
            href="https://en.wikipedia.org/wiki/Legislative_districts_of_Bukidnon"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('gov-districts-source-link')}
          </a>
        </p>
      </div>
    </section>
  );
}

/** Cities first, then municipalities A–Z, as on the legacy page. */
const ordered = [...demographics.lgus].sort(
  (a, b) =>
    Number(a.type === 'municipality') - Number(b.type === 'municipality') ||
    a.name.localeCompare(b.name)
);

export function LguSection() {
  const t = useT(governmentDictionary);
  const total = (k: 'population_2020' | 'barangays') =>
    n(demographics.lgus.reduce((s, l) => s + l[k], 0));
  return (
    <section id="lgus" className="bg-bg-alt">
      <div className={section}>
        <SectionHeading title={t('gov-lgus-title')}>
          <p>{t('gov-lgus-subtitle')}</p>
        </SectionHeading>
        <div className={tableWrap}>
          <table className={table}>
            <caption className="sr-only">{t('gov-lgus-caption')}</caption>
            <thead>
              <tr>
                <th scope="col" className={`${th} sticky left-0`}>
                  {t('gov-th-lgu')}
                </th>
                <th scope="col" className={th}>
                  {t('gov-th-type')}
                </th>
                <th scope="col" className={th}>
                  {t('gov-th-district')}
                </th>
                <th scope="col" className={`${th} text-right`}>
                  {t('gov-th-population-2020')}
                </th>
                <th scope="col" className={`${th} text-right`}>
                  {t('gov-th-barangays')}
                </th>
              </tr>
            </thead>
            <tbody>
              {ordered.map((l) => (
                <tr key={l.name}>
                  <th scope="row" className={stickyTh}>
                    {l.name}
                  </th>
                  <td className={td}>{t(typeKey(l))}</td>
                  <td className={`${td} whitespace-nowrap`}>{t(`gov-district-${l.district}`)}</td>
                  <td className={`${td} text-right tabular-nums`}>{n(l.population_2020)}</td>
                  <td className={`${td} text-right tabular-nums`}>{n(l.barangays)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="font-semibold">
              <tr>
                <th scope="row" colSpan={3} className={stickyTh}>
                  {t('gov-total-province')}
                </th>
                <td className={`${td} text-right tabular-nums`}>{total('population_2020')}</td>
                <td className={`${td} text-right tabular-nums`}>{total('barangays')}</td>
              </tr>
            </tfoot>
          </table>
        </div>
        <p className="mt-md text-center text-sm text-text-light">
          {t('gov-lgus-source')} <a href="/statistics">{t('gov-lgus-more-stats')}</a>
        </p>
      </div>
    </section>
  );
}
