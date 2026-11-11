'use client';

import type { ReactNode } from 'react';
import { ArrowRight, BuildingsFill, GeoAltFill, PeopleFill, Rulers } from 'react-bootstrap-icons';
import { chromeDictionary } from '@/features/i18n/chromeDictionary';
import { useT } from '@/features/i18n/useT';
import { AnimatedCount } from '@/features/statistics/AnimatedCount';
import { demographics } from '@/features/statistics/statisticsData';
import {
  statisticsDictionary,
  type StatisticsKey,
} from '@/features/statistics/statisticsDictionary';
import {
  BarChartSection,
  CmciSection,
  DistributionSection,
  LguTableSection,
  PsaSource,
} from '@/features/statistics/StatisticsSections';
import { PageHero } from '@/shared/PageHero';
import { SectionHeading } from '@/shared/SectionHeading';
import { card, section } from '@/shared/ui';

const n = (v: number, d = 0) =>
  v.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
const { population: pop24, population_2020: pop20, counts } = demographics;

const LANGUAGES = ['Higaonon', 'Hiligaynon', 'Binukid', 'Talaandig', 'Ilocano', 'Matigsalug'];
const PEOPLES = [
  'Bukidnon',
  'Higaonon',
  'Talaandig',
  'Manobo',
  'Matigsalug',
  'Tigwahanon',
  'Umayamnon',
];
const PENDING: [StatisticsKey, string, StatisticsKey][] = [
  [
    'stats-pending-finance',
    'https://blgf.gov.ph/',
    'stats-bureau-of-local-government-finance-blgf',
  ],
  ['stats-pending-poverty', 'https://psa.gov.ph/', 'stats-philippine-statistics-authority-psa'],
  ['stats-pending-province', 'https://bukidnon.gov.ph/', 'stats-official-lgu-bukidnon-portal'],
];

function Metrics() {
  const t = useT(statisticsDictionary);
  const metrics: {
    Icon: typeof PeopleFill;
    value: ReactNode;
    label: StatisticsKey;
    source: StatisticsKey;
  }[] = [
    {
      Icon: PeopleFill,
      value: <AnimatedCount value={pop24.total} />,
      label: 'stats-population',
      source: 'stats-metric-population-source',
    },
    {
      Icon: Rulers,
      value: n(demographics.land_area_km2, 2),
      label: 'stats-metric-land-area',
      source: 'stats-metric-land-area-source',
    },
    {
      Icon: BuildingsFill,
      value: counts.cities + counts.municipalities,
      label: 'stats-metric-lgus',
      source: 'stats-metric-lgus-source',
    },
    {
      Icon: GeoAltFill,
      value: <AnimatedCount value={counts.barangays} />,
      label: 'stats-metric-barangays',
      source: 'stats-metric-barangays-source',
    },
  ];
  return (
    <ul className={`${section} grid gap-sm sm:grid-cols-2 lg:grid-cols-4`}>
      {metrics.map(({ Icon, value, label, source }) => (
        <li key={label} className={`${card} text-center`}>
          <Icon aria-hidden className="mx-auto mb-xs text-2xl text-primary" />
          <div className="text-3xl font-bold text-primary">{value}</div>
          <div className="font-semibold">{t(label)}</div>
          <div className="text-sm text-text-light">{t(source)}</div>
        </li>
      ))}
    </ul>
  );
}

function Trends() {
  const t = useT(statisticsDictionary);
  const growth = ((pop24.total - pop20.total) / pop20.total) * 100;
  return (
    <section className="bg-bg-alt">
      <div className={section}>
        <SectionHeading title={t('stats-population-trends')}>
          <p>{t('stats-population-trends-desc')}</p>
        </SectionHeading>
        <div className="flex flex-wrap items-center justify-center gap-md text-center">
          <div className={card}>
            <div className="text-sm text-text-light">{pop20.year}</div>
            <div className="text-2xl font-bold">{n(pop20.total)}</div>
          </div>
          <ArrowRight aria-hidden className="text-2xl text-primary" />
          <div className={card}>
            <div className="text-sm text-text-light">{pop24.year}</div>
            <div className="text-2xl font-bold text-primary">{n(pop24.total)}</div>
          </div>
          <div className={card}>
            <div className="text-sm text-text-light">{t('stats-growth')}</div>
            <div className="text-2xl font-bold text-text">
              {growth >= 0 ? '+' : ''}
              {growth.toFixed(1)}%
            </div>
          </div>
        </div>
        <p className="mx-auto mt-md max-w-3xl text-center">{t('stats-density-note')}</p>
        <PsaSource />
      </div>
    </section>
  );
}

function People() {
  const t = useT(statisticsDictionary);
  return (
    <section className={section}>
      <SectionHeading title={t('stats-people-title')}>
        <p>{t('stats-people-desc')}</p>
      </SectionHeading>
      <div className="grid gap-md md:grid-cols-2">
        <div className={card}>
          <h3 className="mb-xs text-lg font-semibold">{t('stats-languages-title')}</h3>
          <ul className="mb-xs list-disc pl-md">
            <li>Cebuano / Binisaya {t('stats-most-widely-spoken')}</li>
            {LANGUAGES.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
          <p className="text-sm text-text-light">{t('stats-languages-note')}</p>
        </div>
        <div className={card}>
          <h3 className="mb-xs text-lg font-semibold">{t('stats-peoples-title')}</h3>
          <ul className="list-disc pl-md">
            {PEOPLES.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Pending() {
  const t = useT(statisticsDictionary);
  return (
    <section className="bg-bg-alt">
      <div className={section}>
        <SectionHeading title={t('stats-pending-title')}>
          <p>{t('stats-pending-desc')}</p>
        </SectionHeading>
        <ul className="grid gap-md md:grid-cols-3">
          {PENDING.map(([title, href, link]) => (
            <li key={title} className={card}>
              <h3 className="mb-xs font-semibold">{t(title)}</h3>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center"
              >
                {t(link)}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** Section order matches legacy/statistics/index.html. */
export function StatisticsPage() {
  const nav = useT(chromeDictionary);
  const t = useT(statisticsDictionary);
  return (
    <>
      <PageHero
        crumbs={[{ label: t('stats-home'), href: '/' }, { label: nav('nav-statistics') }]}
        title={t('stats-title')}
        description={t('stats-subtitle')}
      />
      <Metrics />
      <Trends />
      <DistributionSection />
      <LguTableSection />
      <BarChartSection />
      <CmciSection />
      <People />
      <Pending />
    </>
  );
}
