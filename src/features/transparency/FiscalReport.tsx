'use client';

import { useState } from 'react';
import { InfoCircle } from 'react-bootstrap-icons';
import { useT } from '@/features/i18n/useT';
import { fiscalYears, type FiscalYear } from '@/features/transparency/transparencyData';
import {
  transparencyDictionary,
  type TransparencyKey,
} from '@/features/transparency/transparencyDictionary';
import { EmptyState } from '@/shared/EmptyState';
import { card } from '@/shared/ui';

const peso = (v: number) => `₱${v.toFixed(2)} M`;
const pct = (v: number, total: number) => (total ? `${((v / total) * 100).toFixed(1)}%` : '—');

export function MoreLinks({ links }: { links: [string, string][] }) {
  return (
    <ul className="mt-sm flex flex-wrap justify-center gap-x-md">
      {links.map(([href, label]) => (
        <li key={href}>
          <a
            href={href}
            className="inline-flex min-h-11 items-center"
            {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          >
            {label}
          </a>
        </li>
      ))}
    </ul>
  );
}

function Breakdown({
  title,
  rows,
  total,
}: {
  title: string;
  rows: [TransparencyKey, TransparencyKey, number][];
  total: number;
}) {
  const t = useT(transparencyDictionary);
  return (
    <div className={card}>
      <h3 className="mb-sm font-semibold">{title}</h3>
      <ul className="space-y-xs">
        {rows.map(([name, detail, value]) => (
          <li key={name} className="flex justify-between gap-sm">
            <span>
              <span className="block font-medium">{t(name)}</span>
              <span className="block text-sm text-text-light">{t(detail)}</span>
            </span>
            <span className="text-right tabular-nums">
              <span className="block font-semibold">{peso(value)}</span>
              <span className="block text-sm text-text-light">{pct(value, total)}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Latest fiscal year from fiscal_transparency.json, as transparency-v2.js (doughnut charts not ported). */
function FiscalData({ year }: { year: FiscalYear }) {
  const t = useT(transparencyDictionary);
  const [id, setId] = useState(year.periods[0]?.id);
  const p = year.periods.find((x) => x.id === id) ?? year.periods[0];
  if (!p) return null;
  const metrics: [TransparencyKey, number][] = [
    ['budget-total-income', p.income.total],
    ['budget-total-expenditures', p.expenditures.total],
    ['budget-net-operating-income', p.netIncome],
    ['budget-fund-balance-end', p.fundBalance],
  ];
  return (
    <>
      <p className="mb-sm text-center font-semibold">{t('budget-fy', { year: year.year })}</p>
      {year.periods.length > 1 && (
        <div
          role="group"
          aria-label={t('budget-period-toggle')}
          className="mb-md flex flex-wrap justify-center gap-xs"
        >
          {year.periods.map((x) => (
            <button
              key={x.id}
              type="button"
              aria-pressed={x.id === p.id}
              onClick={() => setId(x.id)}
              className={`min-h-11 rounded-base border-2 border-primary px-sm font-semibold ${x.id === p.id ? 'bg-primary text-white' : 'text-primary hover:bg-primary/5'}`}
            >
              {x.label} {x.range && <small className="font-normal">{x.range}</small>}
            </button>
          ))}
        </div>
      )}
      <ul className="mb-md grid gap-sm sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map(([label, value]) => (
          <li key={label} className={`${card} text-center`}>
            <span className="block text-2xl font-bold text-primary tabular-nums">
              {peso(value)}
            </span>
            <span className="text-sm text-text-light">{t(label)}</span>
          </li>
        ))}
      </ul>
      <div className="grid gap-md md:grid-cols-2">
        <Breakdown
          title={t('budget-income-sources')}
          total={p.income.total}
          rows={[
            ['budget-local-sources', 'budget-tax-nontax-revenue', p.income.local],
            ['budget-external-sources', 'budget-national-tax-allotment', p.income.external],
          ]}
        />
        <Breakdown
          title={t('budget-expenditure-allocation')}
          total={p.expenditures.total}
          rows={[
            [
              'budget-general-public-services',
              'budget-administration-operations',
              p.expenditures.gps,
            ],
            ['budget-social-services', 'budget-health-education-welfare', p.expenditures.social],
            [
              'budget-economic-services',
              'budget-infrastructure-development',
              p.expenditures.economic,
            ],
            ['budget-debt-service', 'budget-interest-charges', p.expenditures.debt],
          ]}
        />
      </div>
      <p className="mt-md flex items-center gap-xs text-sm text-text-light">
        <InfoCircle aria-hidden /> {t('budget-source-label')}{' '}
        <a href={year.source_url} target="_blank" rel="noopener noreferrer">
          {t('budget-bureau-of-local-government-finance-blgf')}
        </a>
      </p>
    </>
  );
}

export function FiscalReport() {
  const t = useT(transparencyDictionary);
  const latest = fiscalYears[0];
  if (latest) return <FiscalData year={latest} />;
  return (
    <>
      <EmptyState
        title={t('budget-empty-title')}
        sourceHref="https://blgf.gov.ph/"
        sourceLabel={t('budget-bureau-of-local-government-finance-blgf')}
      >
        {t('budget-sre-empty-desc')}
      </EmptyState>
      <MoreLinks
        links={[
          ['https://bukidnon.gov.ph/', t('budget-provincial-government-of-bukidnon')],
          ['https://fdpp.dilg.gov.ph/', t('budget-full-disclosure-policy-portal')],
        ]}
      />
    </>
  );
}
