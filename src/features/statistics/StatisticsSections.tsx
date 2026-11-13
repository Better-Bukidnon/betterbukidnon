'use client';

import dynamic from 'next/dynamic';
import { InfoCircle } from 'react-bootstrap-icons';
import { useT } from '@/features/i18n/useT';
import {
  cmci,
  demographics,
  DISTRICT_COLORS,
  groupByDistrict,
  hasCmci,
} from '@/features/statistics/statisticsData';
import { statisticsDictionary } from '@/features/statistics/statisticsDictionary';
import { EmptyState } from '@/shared/EmptyState';
import { SectionHeading } from '@/shared/SectionHeading';
import { section, stickyTh, table, tableWrap, td, th } from '@/shared/ui';

const charts = () => import('@/features/statistics/StatisticsCharts');
const placeholder = () => (
  <div aria-hidden className="size-full animate-pulse rounded-base bg-bg-alt" />
);
const DistrictChart = dynamic(() => charts().then((m) => m.DistrictChart), {
  ssr: false,
  loading: placeholder,
});
const PopulationBarChart = dynamic(() => charts().then((m) => m.PopulationBarChart), {
  ssr: false,
  loading: placeholder,
});

const n = (v: number, d = 0) =>
  v.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
const BAR_BG = ['bg-primary', 'bg-accent', 'bg-success', 'bg-info'];
const districts = groupByDistrict(demographics.lgus);
const sum = (k: 'population_2020' | 'area_km2' | 'barangays') =>
  demographics.lgus.reduce((s, l) => s + l[k], 0);

export function PsaSource() {
  const t = useT(statisticsDictionary);
  return (
    <p className="mt-md flex items-center gap-xs text-sm text-text-light">
      <InfoCircle aria-hidden /> {t('stats-source-label')}{' '}
      <a href="https://psa.gov.ph/" target="_blank" rel="noopener noreferrer">
        {t('stats-philippine-statistics-authority-psa')}
      </a>
    </p>
  );
}

export function DistributionSection() {
  const t = useT(statisticsDictionary);
  const total = districts.reduce((s, d) => s + d.population, 0);
  const max = Math.max(...districts.map((d) => d.population));
  return (
    <section className={section}>
      <SectionHeading title={t('stats-population-by-district')}>
        <p>{t('stats-2020-census')}</p>
      </SectionHeading>
      {districts.length === 0 ? (
        <p className="text-center text-text-light">{t('stats-no-data')}</p>
      ) : (
        <div className="grid items-center gap-lg md:grid-cols-2">
          <div className="h-80">
            <DistrictChart
              ariaLabel={t('stats-district-chart-aria')}
              labels={districts.map((d) => t(`stats-district-${d.district}`))}
              values={districts.map((d) => d.population)}
              colors={districts.map((d) => DISTRICT_COLORS[d.district - 1])}
            />
          </div>
          <ul className="space-y-sm">
            {districts.map((d) => (
              <li key={d.district}>
                <div className="flex justify-between font-semibold">
                  <span>{t(`stats-district-${d.district}`)}</span>
                  <span className="tabular-nums">
                    {n(d.population)}{' '}
                    <small className="text-text-light">
                      ({((d.population / total) * 100).toFixed(1)}%)
                    </small>
                  </span>
                </div>
                <div className="my-1 h-2 rounded-full bg-bg-alt">
                  <div
                    className={`h-2 rounded-full ${BAR_BG[d.district - 1]}`}
                    style={{ width: `${Math.round((d.population / max) * 100)}%` }}
                  />
                </div>
                <p className="text-sm text-text-light">{d.lgus.join(', ')}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
      <p className="mt-md text-sm">
        <a href="/government#districts">{t('stats-see-district-members')}</a>
      </p>
    </section>
  );
}

export function LguTableSection() {
  const t = useT(statisticsDictionary);
  const rows = [...demographics.lgus].sort((a, b) => a.name.localeCompare(b.name));
  return (
    <section id="lgu-statistics" className="bg-bg-alt">
      <div className={section}>
        <SectionHeading title={t('stats-lgus-title')}>
          <p>{t('stats-lgus-desc')}</p>
        </SectionHeading>
        {/* Focusable so keyboard users can scroll the table sideways on small screens. */}
        <div className={tableWrap} role="region" aria-label={t('stats-lgus-caption')} tabIndex={0}>
          <table className={table}>
            <caption className="sr-only">{t('stats-lgus-caption')}</caption>
            <thead>
              <tr>
                <th scope="col" className={`${th} sticky left-0`}>
                  {t('stats-th-lgu')}
                </th>
                <th scope="col" className={th}>
                  {t('stats-th-district')}
                </th>
                <th scope="col" className={`${th} text-right`}>
                  {t('stats-th-population-2020')}
                </th>
                <th scope="col" className={`${th} text-right`}>
                  {t('stats-th-area')}
                </th>
                <th scope="col" className={`${th} text-right`}>
                  {t('stats-th-barangays')}
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td colSpan={5} className={`${td} text-center text-text-light`}>
                    {t('stats-no-data')}
                  </td>
                </tr>
              )}
              {rows.map((l) => (
                <tr key={l.name}>
                  <th scope="row" className={`${stickyTh} whitespace-nowrap`}>
                    {l.name}{' '}
                    {l.capital && (
                      <small className="font-normal text-text-light">{t('stats-capital')}</small>
                    )}
                  </th>
                  <td className={`${td} whitespace-nowrap`}>{t(`stats-district-${l.district}`)}</td>
                  <td className={`${td} text-right tabular-nums`}>{n(l.population_2020)}</td>
                  <td className={`${td} text-right tabular-nums`}>{n(l.area_km2, 2)}</td>
                  <td className={`${td} text-right tabular-nums`}>{n(l.barangays)}</td>
                </tr>
              ))}
            </tbody>
            {rows.length > 0 && (
              <tfoot className="font-semibold">
                <tr>
                  <th scope="row" colSpan={2} className={stickyTh}>
                    {t('stats-total-province')}
                  </th>
                  <td className={`${td} text-right tabular-nums`}>{n(sum('population_2020'))}</td>
                  <td className={`${td} text-right tabular-nums`}>
                    {n(Math.round(sum('area_km2') * 100) / 100, 2)}
                  </td>
                  <td className={`${td} text-right tabular-nums`}>{n(sum('barangays'))}</td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
        <PsaSource />
      </div>
    </section>
  );
}

export function BarChartSection() {
  const t = useT(statisticsDictionary);
  const sorted = [...demographics.lgus].sort((a, b) => b.population_2020 - a.population_2020);
  return (
    <section className={section}>
      <SectionHeading title={t('stats-population-bar-chart')}>
        <p>{t('stats-population-bar-chart-desc')}</p>
      </SectionHeading>
      {/* 22 bars: the reserved height matches the chart, so loading causes no layout shift. */}
      <div className="h-[640px]">
        <PopulationBarChart
          ariaLabel={t('stats-bar-chart-aria')}
          labels={sorted.map((l) => l.name)}
          values={sorted.map((l) => l.population_2020)}
          colors={sorted.map((l) => DISTRICT_COLORS[l.district - 1])}
        />
      </div>
      <PsaSource />
    </section>
  );
}

export function CmciSection() {
  const t = useT(statisticsDictionary);
  const score = (v: number | null | undefined) => (typeof v === 'number' ? n(v, 2) : '–');
  const rows = [
    ...(cmci.overall.length ? [{ name: t('stats-cmci-overall'), scores: cmci.overall }] : []),
    ...cmci.pillars,
  ];
  return (
    <section id="competitive-index" className="bg-bg-alt">
      <div className={section}>
        <SectionHeading title={t('stats-bukidnon-competitive-index')}>
          <p>{t('stats-cities-and-municipalities-competitiveness-index')}</p>
        </SectionHeading>
        {hasCmci(cmci) ? (
          <div
            className={tableWrap}
            role="region"
            aria-label={t('stats-bukidnon-competitive-index')}
            tabIndex={0}
          >
            <table className={table}>
              <thead>
                <tr>
                  <th scope="col" className={`${th} sticky left-0`}>
                    {t('stats-cmci-pillar')}
                  </th>
                  {cmci.years.map((y) => (
                    <th key={y} scope="col" className={`${th} text-right`}>
                      {y}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.name}>
                    <th scope="row" className={stickyTh}>
                      {r.name}
                    </th>
                    {cmci.years.map((y, i) => (
                      <td key={y} className={`${td} text-right tabular-nums`}>
                        {score(r.scores[i])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            title={t('stats-no-data')}
            sourceHref={cmci.source_url}
            sourceLabel={t('stats-cmci-link')}
          >
            {t('stats-cmci-empty')}
          </EmptyState>
        )}
        <p className="mt-md flex items-center gap-xs text-sm text-text-light">
          <InfoCircle aria-hidden /> {t('stats-source-label')}{' '}
          <a href={cmci.source_url} target="_blank" rel="noopener noreferrer">
            {t('stats-dti-cities-and-municipalities-competitiveness')}
          </a>
        </p>
      </div>
    </section>
  );
}
