'use client';

import type { ComponentType, SVGProps } from 'react';
import {
  ArrowDownCircle,
  ArrowLeftRight,
  ArrowUpCircle,
  ArrowUpRight,
  Bank,
  CashStack,
  ClipboardData,
  ConeStriped,
  FileEarmarkBarGraph,
  Folder2Open,
  GraphUp,
  JournalCheck,
  ListCheck,
  PieChart,
  Wallet2,
} from 'react-bootstrap-icons';
import { chromeDictionary } from '@/features/i18n/chromeDictionary';
import { useT } from '@/features/i18n/useT';
import { DpwhProjects } from '@/features/transparency/DpwhProjects';
import { FiscalReport, MoreLinks } from '@/features/transparency/FiscalReport';
import {
  transparencyDictionary,
  type TransparencyKey,
} from '@/features/transparency/transparencyDictionary';
import { EmptyState } from '@/shared/EmptyState';
import { PageHero } from '@/shared/PageHero';
import { SectionHeading } from '@/shared/SectionHeading';
import { card, section } from '@/shared/ui';

type Icon = ComponentType<SVGProps<SVGSVGElement>>;
type Explain = [Icon, TransparencyKey, TransparencyKey];

const SRE_EXPLAIN: Explain[] = [
  [FileEarmarkBarGraph, 'budget-explain-sre-title', 'budget-explain-sre-desc'],
  [ArrowDownCircle, 'budget-explain-income-title', 'budget-explain-income-desc'],
  [ArrowUpCircle, 'budget-explain-expense-title', 'budget-explain-expense-desc'],
  [Wallet2, 'budget-explain-balance-title', 'budget-explain-balance-desc'],
];
const HOWTO: Explain[] = [
  [JournalCheck, 'budget-howto-ordinance-title', 'budget-howto-ordinance-desc'],
  [ArrowLeftRight, 'budget-howto-compare-title', 'budget-howto-compare-desc'],
  [PieChart, 'budget-howto-sources-title', 'budget-howto-sources-desc'],
  [ListCheck, 'budget-howto-required-title', 'budget-howto-required-desc'],
];
const SOURCES: [string, Icon, TransparencyKey, TransparencyKey][] = [
  [
    'https://bukidnon.gov.ph/',
    Bank,
    'budget-provincial-government-of-bukidnon',
    'budget-source-pgb-desc',
  ],
  [
    'https://fdpp.dilg.gov.ph/',
    Folder2Open,
    'budget-full-disclosure-policy-portal',
    'budget-source-fdpp-desc',
  ],
  [
    'https://blgf.gov.ph/',
    GraphUp,
    'budget-bureau-of-local-government-finance-blgf',
    'budget-source-blgf-desc',
  ],
  ['https://www.dbm.gov.ph/', CashStack, 'budget-dbm-name', 'budget-source-dbm-desc'],
  ['https://www.dpwh.gov.ph/', ConeStriped, 'budget-dpwh-name', 'budget-source-dpwh-desc'],
  ['https://www.coa.gov.ph/', ClipboardData, 'budget-coa-name', 'budget-source-coa-desc'],
];

function ExplainGrid({ items }: { items: Explain[] }) {
  const t = useT(transparencyDictionary);
  return (
    <ul className="mt-lg grid gap-md sm:grid-cols-2">
      {items.map(([Icon, title, desc]) => (
        <li key={title} className={card}>
          <h3 className="mb-xs flex items-center gap-xs font-semibold">
            <Icon aria-hidden className="text-primary" /> {t(title)}
          </h3>
          <p className="text-sm text-text-light">{t(desc)}</p>
        </li>
      ))}
    </ul>
  );
}

/** Section order matches legacy/budget/index.html. */
export function BudgetPage() {
  const nav = useT(chromeDictionary);
  const t = useT(transparencyDictionary);
  return (
    <>
      <PageHero
        crumbs={[{ label: t('budget-home'), href: '/' }, { label: nav('nav-transparency') }]}
        title={t('budget-title')}
        description={t('budget-subtitle')}
      />
      <section className={section}>
        <SectionHeading title={t('budget-statement-of-receipts-expenditures')}>
          <p>{t('budget-sre-subtitle')}</p>
        </SectionHeading>
        <FiscalReport />
        <ExplainGrid items={SRE_EXPLAIN} />
      </section>
      <section className="bg-bg-alt">
        <div className={section}>
          <SectionHeading title={t('budget-howto-title')}>
            <p>{t('budget-howto-subtitle')}</p>
          </SectionHeading>
          <ExplainGrid items={HOWTO} />
        </div>
      </section>
      <section className={section}>
        <SectionHeading title={t('budget-infrastructure-investments')}>
          <p>{t('budget-major-development-projects-serving-the-community')}</p>
        </SectionHeading>
        <EmptyState
          title={t('budget-empty-title')}
          sourceHref="https://bukidnon.gov.ph/"
          sourceLabel={t('budget-provincial-government-of-bukidnon')}
        >
          {t('budget-infra-empty-desc')}
        </EmptyState>
        <MoreLinks
          links={[
            ['/service-details/provincial-engineering', t('budget-provincial-engineers-office')],
            ['https://sumbongsapangulo.ph/flood-control-map/', t('budget-flood-control-map')],
          ]}
        />
      </section>
      <section className="bg-bg-alt">
        <div className={section}>
          <SectionHeading title={t('budget-dpwh-infrastructure-projects-in-bukidnon')}>
            <p>{t('budget-dpwh-desc')}</p>
          </SectionHeading>
          <DpwhProjects />
        </div>
      </section>
      <section aria-labelledby="budget-sources-title" className={section}>
        <SectionHeading id="budget-sources-title" title={t('budget-sources-title')}>
          <p>{t('budget-sources-desc')}</p>
        </SectionHeading>
        <ul className="grid gap-md sm:grid-cols-2 lg:grid-cols-3">
          {SOURCES.map(([href, Icon, title, desc]) => (
            <li key={href}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={`${card} flex h-full items-center gap-sm text-text no-underline transition-colors duration-150 hover:border-primary`}
              >
                <Icon aria-hidden className="shrink-0 text-2xl text-primary" />
                <span className="flex-1">
                  <span className="block font-semibold">{t(title)}</span>
                  <span className="block text-sm text-text-light">{t(desc)}</span>
                </span>
                <ArrowUpRight aria-hidden className="text-primary" />
              </a>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
