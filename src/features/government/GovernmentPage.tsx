'use client';

import { Clock, PeopleFill, Telephone } from 'react-bootstrap-icons';
import {
  governmentDictionary,
  type GovernmentKey,
} from '@/features/government/governmentDictionary';
import { officials } from '@/features/government/governmentData';
import { LeaderCard } from '@/features/government/LeaderCard';
import { DistrictsSection, LguSection } from '@/features/government/LguSections';
import { ProvincialOffices } from '@/features/government/ProvincialOffices';
import { chromeDictionary } from '@/features/i18n/chromeDictionary';
import { useT } from '@/features/i18n/useT';
import { PageHero } from '@/shared/PageHero';
import { SectionHeading } from '@/shared/SectionHeading';
import { badge, buttonOutline, buttonPrimary, card, section } from '@/shared/ui';

export const SEAT_KEYS: Record<string, GovernmentKey> = {
  abc: 'gov-liga-ng-mga-barangay-president',
  pcl: 'gov-pcl-president',
  sk: 'gov-sk-federation-president',
  ipmr: 'gov-ipmr',
};

const JUMPS: [string, GovernmentKey][] = [
  ['leadership', 'gov-jump-leadership'],
  ['provincial-board', 'gov-jump-board'],
  ['offices', 'gov-jump-offices'],
  ['districts', 'gov-jump-districts'],
  ['lgus', 'gov-jump-lgus'],
];

const DISTRICTS = [1, 2, 3, 4] as const;
const HOURS = 'Mon-Fri: 8:00 AM - 5:00 PM';

function Leadership() {
  const t = useT(governmentDictionary);
  const leaders = [
    {
      badge: t('title-governor'),
      name: officials.governor.name,
      role: t('gov-governor-role'),
      tel: '+63888132457',
      phone: '(088) 813-2457',
      line: t('gov-pgo-line'),
    },
    {
      badge: t('title-vice-governor'),
      name: officials.vice_governor.name,
      role: t('gov-vice-governor-role'),
      tel: '+63888135741',
      phone: '(088) 813-5741',
      line: t('gov-capitol-main-line'),
    },
  ];
  return (
    <section id="leadership" className="bg-bg-alt">
      <div className={section}>
        <SectionHeading title={t('gov-executive')}>
          <p>{t('gov-executive-term')}</p>
        </SectionHeading>
        <div className="grid gap-md md:grid-cols-2">
          {leaders.map((l) => (
            <LeaderCard key={l.badge} office={l.badge} name={l.name} role={l.role}>
              <a href={`tel:${l.tel}`} className="flex min-h-11 items-center gap-xs">
                <Telephone aria-hidden /> {l.phone}{' '}
                <small className="text-text-light">{l.line}</small>
              </a>
              <span className="flex items-center gap-xs text-sm text-text-light">
                <Clock aria-hidden /> {HOURS}
              </span>
            </LeaderCard>
          ))}
        </div>
        <p className="mt-lg">
          <a href="/government/officials" className={buttonPrimary}>
            <PeopleFill aria-hidden /> {t('gov-see-all-officials')}
          </a>
        </p>
      </div>
    </section>
  );
}

function ProvincialBoard() {
  const t = useT(governmentDictionary);
  return (
    <section id="provincial-board">
      <div className={section}>
        <SectionHeading title={t('gov-sb-members')}>
          <p>{t('gov-sb-subtitle')}</p>
        </SectionHeading>
        <h3 className="mb-md text-xl font-semibold">{t('gov-board-members-by-district')}</h3>
        <div className="grid gap-md sm:grid-cols-2 lg:grid-cols-4">
          {DISTRICTS.map((d) => (
            <div key={d} className={card}>
              <span className={`${badge} mb-xs`}>{t(`gov-district-${d}`)}</span>
              <ul className="space-y-1">
                {officials.board_members
                  .filter((m) => m.district === d)
                  .map((m) => (
                    <li key={m.name} className="font-medium">
                      {m.name}
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
        <h3 className="mt-xl mb-md text-xl font-semibold">{t('gov-ex-officio-members')}</h3>
        <div className="grid gap-md sm:grid-cols-2 lg:grid-cols-4">
          {officials.ex_officio.map((m) => (
            <div key={m.id} className={card}>
              <p className="mb-xs font-medium">{m.name}</p>
              <span className="inline-block rounded-sm bg-success/10 px-sm py-1 text-sm font-semibold text-text">
                {t(SEAT_KEYS[m.id])}
              </span>
            </div>
          ))}
        </div>
        <p className="mt-md text-sm text-text-light">{t('gov-ex-officio-note')}</p>
      </div>
    </section>
  );
}

/** Section order matches fce5da9:government/index.html. */
export function GovernmentPage() {
  const nav = useT(chromeDictionary);
  const t = useT(governmentDictionary);
  return (
    <>
      <PageHero
        crumbs={[{ label: t('gov-home'), href: '/' }, { label: nav('nav-government') }]}
        title={t('gov-title')}
        description={t('gov-subtitle')}
      />
      <nav
        aria-label={t('gov-on-this-page')}
        className="mx-auto flex max-w-site flex-wrap gap-xs px-sm py-md"
      >
        {JUMPS.map(([id, key]) => (
          <a key={id} href={`#${id}`} className={buttonOutline}>
            {t(key)}
          </a>
        ))}
      </nav>
      <Leadership />
      <ProvincialBoard />
      <ProvincialOffices />
      <DistrictsSection />
      <LguSection />
    </>
  );
}
