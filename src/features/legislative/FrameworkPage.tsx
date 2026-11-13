'use client';

import type { ComponentType, SVGProps } from 'react';
import {
  ArrowRight,
  Award,
  CashCoin,
  ClipboardCheck,
  Diagram2,
  EnvelopePaper,
  ExclamationCircle,
  Flower1,
  HandThumbsUp,
  HeartPulse,
  InfoCircle,
  Search,
  Signpost2,
  Tree,
  Wallet2,
} from 'react-bootstrap-icons';
import { chromeDictionary } from '@/features/i18n/chromeDictionary';
import { useT } from '@/features/i18n/useT';
import {
  formatSessionDate,
  ordinances,
  resolutions,
  type LegislativeRecord,
} from '@/features/legislative/legislativeData';
import {
  legislativeDictionary,
  type LegislativeKey,
} from '@/features/legislative/legislativeDictionary';
import { EmptyState } from '@/shared/EmptyState';
import { PageHero } from '@/shared/PageHero';
import { buttonPrimary, card, section, stickyTh, table, tableWrap, td, th } from '@/shared/ui';

type Icon = ComponentType<SVGProps<SVGSVGElement>>;
type Kind = 'ord' | 'reso';
const OFFICIAL = 'https://bukidnon.gov.ph/';

const CONFIG: Record<
  Kind,
  {
    nav: 'nav-ordinance-framework' | 'nav-resolution-framework';
    tags: [Icon, LegislativeKey][];
    steps: number;
    records: LegislativeRecord[];
  }
> = {
  ord: {
    nav: 'nav-ordinance-framework',
    tags: [
      [CashCoin, 'ord-cat-revenue'],
      [Wallet2, 'ord-cat-appropriations'],
      [Flower1, 'ord-cat-agriculture'],
      [HeartPulse, 'ord-cat-health-social'],
      [Tree, 'ord-cat-environment'],
      [Signpost2, 'ord-cat-infrastructure'],
    ],
    steps: 6,
    records: ordinances,
  },
  reso: {
    nav: 'nav-resolution-framework',
    tags: [
      [Award, 'reso-type-commendation'],
      [EnvelopePaper, 'reso-type-request'],
      [HandThumbsUp, 'reso-type-support'],
      [ExclamationCircle, 'reso-type-condolence'],
      [ClipboardCheck, 'reso-type-authorization'],
      [Search, 'reso-type-review'],
    ],
    steps: 5,
    records: resolutions,
  },
};

/** One template for fce5da9:legislative/{ordinance,resolution}-framework.html; content verbatim. */
export function FrameworkPage({ kind: k }: { kind: Kind }) {
  const nav = useT(chromeDictionary);
  const t = useT(legislativeDictionary);
  const { tags, steps, records, ...c } = CONFIG[k];
  const step = (i: number, part: 'title' | 'desc') => t(`${k}-step-${i}-${part}` as LegislativeKey);
  return (
    <>
      <PageHero
        crumbs={[
          { label: t(`${k}-home`), href: '/' },
          { label: t(`${k}-legislative`), href: '/legislative' },
          { label: nav(c.nav) },
        ]}
        title={t(`${k}-page-title`)}
        description={t(`${k}-page-desc`)}
      />
      <section className={section}>
        <div className={`${card} flex gap-sm`}>
          <InfoCircle aria-hidden className="mt-1 shrink-0 text-2xl text-primary" />
          <div>
            <h2 className="mb-xs text-xl font-semibold">{t(`${k}-what-is`)}</h2>
            <p className="mb-xs">{t(`${k}-what-is-p1`)}</p>
            <p>{t(`${k}-what-is-p2`)}</p>
          </div>
        </div>
      </section>
      <section className={section}>
        <h2 className="mb-md text-center text-2xl font-bold">
          {t(k === 'ord' ? 'ord-categories-title' : 'reso-types-title')}
        </h2>
        <ul className="grid gap-sm sm:grid-cols-2 lg:grid-cols-3">
          {tags.map(([Icon, key]) => (
            <li key={key} className={`${card} flex items-center gap-xs font-medium`}>
              <Icon aria-hidden className="text-xl text-primary" /> {t(key)}
            </li>
          ))}
        </ul>
      </section>
      <section className="bg-bg-alt">
        <div className={section}>
          <h2 className="mb-xs text-center text-2xl font-bold">{t(`${k}-process-title`)}</h2>
          <p className="mb-md text-center text-text-light">{t(`${k}-process-subtitle`)}</p>
          <ol className="mx-auto max-w-3xl space-y-sm">
            {Array.from({ length: steps }, (_, i) => i + 1).map((i) => (
              <li key={i} className={`${card} flex gap-sm`}>
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary font-bold text-white">
                  {i}
                </span>
                <div>
                  <h3 className="mb-1 font-semibold">{step(i, 'title')}</h3>
                  <p className="text-sm text-text-light">{step(i, 'desc')}</p>
                </div>
              </li>
            ))}
          </ol>
          {k === 'ord' ? (
            <div className={`${card} mx-auto mt-lg flex max-w-3xl gap-sm`}>
              <Diagram2 aria-hidden className="mt-1 shrink-0 text-2xl text-primary" />
              <div>
                <h3 className="mb-xs font-semibold">{t('ord-lgu-title')}</h3>
                <p className="mb-xs text-sm">{t('ord-lgu-desc')}</p>
                <p>
                  <a href="/government#lgus">{t('ord-see-lgu-list')}</a> ·{' '}
                  <a href="/legislative">{t('ord-see-flowchart')}</a>
                </p>
              </div>
            </div>
          ) : (
            <p className="mt-md text-center">
              <a href="/legislative" className="inline-flex min-h-11 items-center gap-1">
                <ArrowRight aria-hidden /> {t('reso-see-flowchart')}
              </a>
            </p>
          )}
        </div>
      </section>
      <section className={section}>
        <h2 className="mb-xs text-center text-2xl font-bold">{t(`${k}-records-title`)}</h2>
        <p className="mb-md text-center text-text-light">{t(`${k}-records-subtitle`)}</p>
        {records.length === 0 ? (
          <EmptyState title={t(`${k}-empty-title`)} sourceHref={OFFICIAL} sourceLabel={OFFICIAL}>
            {t(`${k}-empty-desc`)}
          </EmptyState>
        ) : (
          <div className={tableWrap}>
            <table className={table}>
              <caption className="sr-only">{t(`${k}-table-caption`)}</caption>
              <thead>
                <tr>
                  <th scope="col" className={`${th} sticky left-0`}>
                    {t(`${k}-table-number`)}
                  </th>
                  <th scope="col" className={th}>
                    {t(`${k}-table-title`)}
                  </th>
                  <th scope="col" className={th}>
                    {t(`${k}-table-date`)}
                  </th>
                </tr>
              </thead>
              <tbody>
                {records.map((r) => (
                  <tr key={r.number}>
                    <th scope="row" className={`${stickyTh} whitespace-nowrap`}>
                      {r.number}
                    </th>
                    <td className={td}>{r.title}</td>
                    <td className={`${td} whitespace-nowrap`}>
                      {formatSessionDate(r.sessionDate)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="mt-md text-center">
          <a href={OFFICIAL} target="_blank" rel="noopener noreferrer" className={buttonPrimary}>
            {t(`${k}-view-records-official`)}
          </a>
        </p>
      </section>
    </>
  );
}
