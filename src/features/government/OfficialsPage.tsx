'use client';

import type { ReactNode } from 'react';
import { PersonBadge, PersonCircle } from 'react-bootstrap-icons';
import { officials } from '@/features/government/governmentData';
import { governmentDictionary } from '@/features/government/governmentDictionary';
import { SEAT_KEYS } from '@/features/government/GovernmentPage';
import { useT } from '@/features/i18n/useT';
import { PageHero } from '@/shared/PageHero';
import { SectionHeading } from '@/shared/SectionHeading';
import { badge, card, section } from '@/shared/ui';

const DISTRICTS = [1, 2, 3, 4] as const;
const grid = 'grid gap-md sm:grid-cols-2 lg:grid-cols-4';

function Member({ name, children }: { name: string; children: ReactNode }) {
  return (
    <div className={`${card} text-center`}>
      <PersonBadge aria-hidden className="mx-auto mb-xs text-4xl text-primary" />
      <p className="mb-xs font-semibold">{name}</p>
      <p className={badge}>{children}</p>
    </div>
  );
}

/** Same groups and order as fce5da9:assets/js/officials.js, rendered at build time. */
export function OfficialsPage() {
  const t = useT(governmentDictionary);
  const { governor, vice_governor: vice } = officials;
  const executives = [
    { name: governor.name, title: t('officials-provincial-governor') },
    {
      name: vice.name,
      title: t('officials-provincial-vice-governor'),
      role: vice.role && t('officials-presiding-officer-sp'),
    },
  ];
  const reps = [...officials.representatives].sort((a, b) => a.district - b.district);
  return (
    <>
      <PageHero
        crumbs={[
          { label: t('officials-home'), href: '/' },
          { label: t('officials-government'), href: '/government' },
          { label: t('officials-breadcrumb') },
        ]}
        title={t('officials-elected-officials')}
        description={
          <>
            {t('officials-meet-the-leaders-serving-the-province-of')}
            <br />
            {t('officials-term-note')}
          </>
        }
      />
      <div className={section}>
        <SectionHeading title={t('officials-executive-branch')} />
        <div className="mb-xl grid gap-md md:grid-cols-2">
          {executives.map((e) => (
            <div key={e.name} className={`${card} text-center`}>
              <PersonCircle aria-hidden className="mx-auto mb-sm size-24 text-primary" />
              <h3 className="text-xl font-bold">{e.name}</h3>
              <p className="font-semibold text-primary">{e.title}</p>
              {e.role && <p className="text-sm text-text-light">{e.role}</p>}
            </div>
          ))}
        </div>

        <SectionHeading title={t('officials-sangguniang-bayan-members')}>
          <p>{t('officials-sp-intro')}</p>
        </SectionHeading>
        {DISTRICTS.map((d) => (
          <div key={d} className="mb-lg">
            <h3 className="mb-sm text-center text-xl font-semibold">{t(`gov-district-${d}`)}</h3>
            <div className={grid}>
              {officials.board_members
                .filter((m) => m.district === d)
                .map((m) => (
                  <Member key={m.name} name={m.name}>
                    {t('officials-sb-member')}
                  </Member>
                ))}
            </div>
          </div>
        ))}
        <h3 className="mb-sm text-center text-xl font-semibold">{t('gov-ex-officio-members')}</h3>
        <div className={grid}>
          {officials.ex_officio.map((m) => (
            <Member key={m.id} name={m.name}>
              {t(SEAT_KEYS[m.id])}
            </Member>
          ))}
        </div>
        <p className="mt-md mb-xl text-center text-sm text-text-light">
          {t('officials-ex-officio-note')}
        </p>

        <SectionHeading title={t('officials-house-reps')}>
          <p>{t('officials-house-reps-intro')}</p>
        </SectionHeading>
        <div className={grid}>
          {reps.map((r) => (
            <Member key={r.name} name={r.name}>
              {t(`gov-district-${r.district}`)} · {t('gov-representative')}
            </Member>
          ))}
        </div>

        <p className="mt-xl text-center text-sm text-text-light">
          {t('officials-sources-label')}{' '}
          {officials.sources.map((s, i) => (
            <span key={s.url}>
              {i > 0 && '; '}
              <a href={s.url} target="_blank" rel="noopener noreferrer">
                {s.name}
              </a>
            </span>
          ))}
          . {t('officials-last-verified')} {officials.last_verified}
        </p>
        <p className="mt-sm text-center">
          {t('officials-contacts-note')}{' '}
          <a href="/government#offices">{t('officials-government-page-link')}</a>
        </p>
      </div>
    </>
  );
}
