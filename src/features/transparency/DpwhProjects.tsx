'use client';

import { useState } from 'react';
import { GeoAlt, InfoCircle } from 'react-bootstrap-icons';
import { useT } from '@/features/i18n/useT';
import {
  dpwhCategory,
  dpwhProjects,
  type DpwhCategory,
  type DpwhProject,
} from '@/features/transparency/transparencyData';
import {
  transparencyDictionary,
  type TransparencyKey,
} from '@/features/transparency/transparencyDictionary';
import { EmptyState } from '@/shared/EmptyState';
import { badge, card, table, tableWrap, td, th } from '@/shared/ui';

const DPWH = 'https://www.dpwh.gov.ph/';
const FILTERS: ['all' | DpwhCategory, TransparencyKey][] = [
  ['all', 'budget-dpwh-all'],
  ['buildings', 'budget-dpwh-buildings'],
  ['roads', 'budget-dpwh-roads'],
  ['flood', 'budget-dpwh-flood'],
  ['water', 'budget-dpwh-water'],
];
const peso = (v: number) =>
  `₱${v.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const date = (d: string | null) =>
  d
    ? new Date(`${d}T00:00:00`).toLocaleDateString('en-PH', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : '—';

/** dpwh-projects.js: summary computed from the records, category filter, table (all rows; no lazy "load more"). */
function ProjectTable({ projects }: { projects: DpwhProject[] }) {
  const t = useT(transparencyDictionary);
  const [filter, setFilter] = useState<'all' | DpwhCategory>('all');
  const count = (f: 'all' | DpwhCategory) =>
    f === 'all' ? projects.length : projects.filter((p) => dpwhCategory(p.category) === f).length;
  const shown = projects.filter((p) => filter === 'all' || dpwhCategory(p.category) === filter);
  const done = projects.filter((p) => p.status >= 100).length;
  const summary: [TransparencyKey, string | number][] = [
    ['budget-dpwh-projects', projects.length],
    [
      'budget-dpwh-total-investment',
      `₱${(projects.reduce((s, p) => s + p.cost, 0) / 1e6).toFixed(1)}M`,
    ],
    ['budget-dpwh-completed', done],
    ['budget-dpwh-ongoing', projects.length - done],
  ];
  const label = (c: DpwhCategory) =>
    t(FILTERS.find(([f]) => f === c)?.[1] ?? 'budget-dpwh-buildings');
  return (
    <>
      <ul className="mb-md grid gap-sm sm:grid-cols-2 lg:grid-cols-4">
        {summary.map(([key, value]) => (
          <li key={key} className={`${card} text-center`}>
            <span className="block text-2xl font-bold text-primary">{value}</span>
            <span className="text-sm text-text-light">{t(key)}</span>
          </li>
        ))}
      </ul>
      <div
        role="group"
        aria-label={t('budget-dpwh-filter')}
        className="mb-sm flex flex-wrap gap-xs"
      >
        {FILTERS.filter(([f]) => f !== 'water' || count('water') > 0).map(([f, key]) => (
          <button
            key={f}
            type="button"
            aria-pressed={filter === f}
            onClick={() => setFilter(f)}
            className={`min-h-11 rounded-base border-2 border-primary px-sm font-semibold ${filter === f ? 'bg-primary text-white' : 'text-primary hover:bg-primary/5'}`}
          >
            {t(key)} <span className="font-normal">({count(f)})</span>
          </button>
        ))}
      </div>
      <div className={tableWrap}>
        <table className={table}>
          <caption className="sr-only">{t('budget-dpwh-caption')}</caption>
          <thead>
            <tr>
              <th scope="col" className={th}>
                {t('budget-dpwh-th-desc')}
              </th>
              <th scope="col" className={th}>
                {t('budget-dpwh-th-contractor')}
              </th>
              <th scope="col" className={`${th} text-right`}>
                {t('budget-dpwh-th-cost')}
              </th>
              <th scope="col" className={th}>
                {t('budget-dpwh-th-status')}
              </th>
              <th scope="col" className={th}>
                {t('budget-dpwh-th-date')}
              </th>
            </tr>
          </thead>
          <tbody>
            {shown.map((p) => (
              <tr key={p.id}>
                <td className={`${td} min-w-64`}>
                  <span className="text-xs text-text-light">{p.id}</span>{' '}
                  <span className={badge}>{label(dpwhCategory(p.category))}</span>
                  <span className="block font-medium">{p.name}</span>
                  <span className="flex items-center gap-1 text-xs text-text-light">
                    <GeoAlt aria-hidden /> {p.location}
                  </span>
                </td>
                <td className={td}>
                  {p.contractor}
                  {p.contractorId && (
                    <span className="block text-xs text-text-light">#{p.contractorId}</span>
                  )}
                </td>
                <td className={`${td} text-right whitespace-nowrap tabular-nums`}>
                  {peso(p.cost)}
                </td>
                <td className={td}>
                  {p.status >= 100 ? t('budget-dpwh-completed') : `${p.status.toFixed(0)}%`}
                </td>
                <td className={`${td} whitespace-nowrap`}>{date(p.completionDate)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-md flex items-center gap-xs text-sm text-text-light">
        <InfoCircle aria-hidden /> {t('budget-source-label')}{' '}
        <a href={DPWH} target="_blank" rel="noopener noreferrer">
          {t('budget-dpwh-name')}
        </a>
      </p>
    </>
  );
}

export function DpwhProjects() {
  const t = useT(transparencyDictionary);
  if (dpwhProjects.length) return <ProjectTable projects={dpwhProjects} />;
  return (
    <EmptyState
      title={t('budget-empty-title')}
      sourceHref={DPWH}
      sourceLabel={t('budget-dpwh-name')}
    >
      {t('budget-dpwh-empty-desc')}
    </EmptyState>
  );
}
