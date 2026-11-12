'use client';

import type { ComponentType, SVGProps } from 'react';
import {
  ArrowRight,
  Bank,
  Check2Circle,
  FileEarmarkRuledFill,
  FileEarmarkText,
  GeoAlt,
  HouseDoor,
  JournalBookmark,
  JournalBookmarkFill,
  People,
  PersonBadge,
  PersonLinesFill,
  Search,
  ShieldCheck,
} from 'react-bootstrap-icons';
import { officials } from '@/features/government/governmentData';
import { chromeDictionary } from '@/features/i18n/chromeDictionary';
import { useT } from '@/features/i18n/useT';
import {
  legislativeDictionary,
  type LegislativeKey,
} from '@/features/legislative/legislativeDictionary';
import { LegislativeProcess } from '@/features/legislative/LegislativeProcess';
import { demographics, groupByDistrict } from '@/features/statistics/statisticsData';
import { PageHero } from '@/shared/PageHero';
import { SectionHeading } from '@/shared/SectionHeading';
import { card, section } from '@/shared/ui';

type Icon = ComponentType<SVGProps<SVGSVGElement>>;
type InfoCard = [Icon, LegislativeKey, LegislativeKey];

const ROLE_KEYS: Record<string, LegislativeKey> = {
  abc: 'leg-role-abc-president',
  pcl: 'leg-role-pcl-president',
  sk: 'leg-role-sk-president',
  ipmr: 'leg-role-ipmr',
};

const RELATION: InfoCard[] = [
  [Bank, 'leg-relation-who-title', 'leg-relation-who-desc'],
  [Search, 'leg-relation-review-title', 'leg-relation-review-desc'],
  [Check2Circle, 'leg-relation-outcome-title', 'leg-relation-outcome-desc'],
  [HouseDoor, 'leg-relation-barangay-title', 'leg-relation-barangay-desc'],
];

const ABOUT: InfoCard[] = [
  [JournalBookmark, 'leg-ordinances', 'leg-local-laws-with-permanent-and-general-application'],
  [FileEarmarkText, 'leg-resolutions', 'leg-expressions-of-the-legislative-bodys-will-or'],
  [People, 'leg-public-participation', 'leg-public-participation-desc'],
  [ShieldCheck, 'leg-transparency', 'leg-transparency-desc'],
];

function InfoCards({ items }: { items: InfoCard[] }) {
  const t = useT(legislativeDictionary);
  return (
    <ul className="grid gap-md sm:grid-cols-2">
      {items.map(([Icon, title, desc]) => (
        <li key={title} className={card}>
          <Icon aria-hidden className="mb-xs text-2xl text-primary" />
          <h3 className="mb-1 font-semibold">{t(title)}</h3>
          <p className="text-sm text-text-light">{t(desc)}</p>
        </li>
      ))}
    </ul>
  );
}

function Group({
  Icon,
  title,
  desc,
  members,
}: {
  Icon: Icon;
  title: string;
  desc: string;
  members: [string, string?][];
}) {
  return (
    <div className={card}>
      <h3 className="mb-1 flex items-center gap-xs font-semibold">
        <Icon aria-hidden className="text-primary" /> {title}
      </h3>
      <p className="mb-xs text-sm text-text-light">{desc}</p>
      <ul className="space-y-1">
        {members.map(([name, role]) => (
          <li key={name}>
            {name} {role && <span className="block text-sm text-text-light">{role}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Members() {
  const t = useT(legislativeDictionary);
  return (
    <section aria-labelledby="leg-members-title" className={section}>
      <SectionHeading id="leg-members-title" title={t('leg-members-title')}>
        <p>{t('leg-members-desc')}</p>
      </SectionHeading>
      <div className="grid gap-md sm:grid-cols-2 lg:grid-cols-3">
        <Group
          Icon={PersonBadge}
          title={t('leg-presiding-officer')}
          desc={t('leg-presiding-officer-desc')}
          members={[[officials.vice_governor.name, t('leg-role-vice-governor')]]}
        />
        {groupByDistrict(demographics.lgus).map((d) => (
          <Group
            key={d.district}
            Icon={GeoAlt}
            title={t(`leg-district-${d.district}`)}
            desc={d.lgus.join(', ')}
            members={officials.board_members
              .filter((m) => m.district === d.district)
              .map((m) => [m.name])}
          />
        ))}
        <Group
          Icon={PersonLinesFill}
          title={t('leg-ex-officio-members')}
          desc={t('leg-ex-officio-desc')}
          members={officials.ex_officio.map((m) => [m.name, t(ROLE_KEYS[m.id])])}
        />
      </div>
      <p className="mt-md text-center text-sm text-text-light">
        {t('leg-members-note')}{' '}
        <a href="https://bukidnon.gov.ph/" target="_blank" rel="noopener noreferrer">
          bukidnon.gov.ph
        </a>
      </p>
    </section>
  );
}

/** Section order matches fce5da9:legislative/index.html. */
export function LegislativePage() {
  const nav = useT(chromeDictionary);
  const t = useT(legislativeDictionary);
  const categories = [
    {
      href: '/legislative/ordinance-framework',
      Icon: JournalBookmarkFill,
      title: t('leg-ordinance-framework'),
      desc: t('leg-provincial-ordinances-enacted-by-the-sangguniang'),
      link: t('leg-browse-ordinances'),
    },
    {
      href: '/legislative/resolution-framework',
      Icon: FileEarmarkRuledFill,
      title: t('leg-resolution-framework'),
      desc: t('leg-resolutions-passed-by-the-sp'),
      link: t('leg-browse-resolutions'),
    },
  ];
  return (
    <>
      <PageHero
        crumbs={[{ label: t('leg-home'), href: '/' }, { label: nav('nav-legislative') }]}
        title={t('leg-legislative-documents')}
        description={t('leg-ordinances-and-resolutions-of-the-sangguniang')}
      />
      <section className={`${section} grid gap-md md:grid-cols-2`}>
        {categories.map(({ href, Icon, title, desc, link }) => (
          <a
            key={href}
            href={href}
            className={`${card} group flex gap-sm text-text no-underline transition-colors duration-150 hover:border-primary`}
          >
            <Icon aria-hidden className="mt-1 shrink-0 text-3xl text-primary" />
            <div>
              <h2 className="mb-1 text-xl font-bold">{title}</h2>
              <span className="mb-xs block text-text-light">{desc}</span>
              <span className="inline-flex min-h-11 items-center gap-1 font-semibold text-primary">
                <ArrowRight
                  aria-hidden
                  className="transition-transform duration-150 ease-out group-hover:translate-x-1"
                />{' '}
                {link}
              </span>
            </div>
          </a>
        ))}
      </section>
      <Members />
      <LegislativeProcess />
      <section aria-labelledby="leg-relation-title" className={section}>
        <SectionHeading id="leg-relation-title" title={t('leg-relation-title')}>
          <p>{t('leg-relation-desc')}</p>
        </SectionHeading>
        <InfoCards items={RELATION} />
        <p className="mt-md text-center">
          <a href="/government#lgus" className="inline-flex min-h-11 items-center gap-1">
            <ArrowRight aria-hidden /> {t('leg-see-lgu-list')}
          </a>
        </p>
      </section>
      <section className="bg-bg-alt">
        <div className={section}>
          <SectionHeading title={t('leg-understanding-local-legislation')}>
            <p>{t('leg-learn-about-the-legislative-process-of-the')}</p>
          </SectionHeading>
          <InfoCards items={ABOUT} />
        </div>
      </section>
    </>
  );
}
