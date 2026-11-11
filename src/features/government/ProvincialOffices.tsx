'use client';

import Link from 'next/link';
import type { ComponentType, SVGProps } from 'react';
import {
  ArrowRight,
  BuildingFillGear,
  CalculatorFill,
  CashCoin,
  ClipboardDataFill,
  ExclamationTriangleFill,
  GearFill,
  HeartPulseFill,
  HouseDoorFill,
  PcDisplay,
  PeopleFill,
  PersonBadgeFill,
  PiggyBankFill,
  SignpostSplitFill,
  Telephone,
  TreeFill,
} from 'react-bootstrap-icons';
import {
  governmentDictionary,
  type GovernmentKey,
} from '@/features/government/governmentDictionary';
import { useT } from '@/features/i18n/useT';
import { SectionHeading } from '@/shared/SectionHeading';
import { card, section } from '@/shared/ui';

interface Office {
  slug?: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: GovernmentKey;
  desc: GovernmentKey;
  phones: { number: string; note?: GovernmentKey }[];
}

/** Phone numbers from the official directory, as listed on legacy/government/index.html. */
const OFFICES: Office[] = [
  {
    slug: 'provincial-health-office',
    Icon: HeartPulseFill,
    title: 'gov-provincial-health-office',
    desc: 'gov-pho-desc',
    phones: [{ number: '(088) 813-5631' }],
  },
  {
    slug: 'pswdo',
    Icon: PeopleFill,
    title: 'gov-pswdo-title',
    desc: 'gov-pswdo-desc',
    phones: [{ number: '(088) 813-5734' }],
  },
  {
    slug: 'pdrrmd',
    Icon: ExclamationTriangleFill,
    title: 'gov-pdrrmd-title',
    desc: 'gov-disaster-preparedness-emergency-response-risk',
    phones: [{ number: '(088) 813-1262' }],
  },
  {
    slug: 'provincial-treasurer',
    Icon: CashCoin,
    title: 'gov-provincial-treasurers-office',
    desc: 'gov-tax-payments-real-property-tax-revenue-collection',
    phones: [{ number: '(088) 813-2474' }],
  },
  {
    slug: 'provincial-assessor',
    Icon: HouseDoorFill,
    title: 'gov-provincial-assessors-office',
    desc: 'gov-property-assessment-tax-declarations-land-records',
    phones: [],
  },
  {
    slug: 'provincial-engineering',
    Icon: BuildingFillGear,
    title: 'gov-provincial-engineering-office',
    desc: 'gov-engineering-desc',
    phones: [
      { number: '(088) 813-3656' },
      { number: '(088) 813-3688', note: 'gov-peo-waterworks' },
    ],
  },
  {
    slug: 'provincial-agriculture',
    Icon: TreeFill,
    title: 'gov-provincial-agriculture-office',
    desc: 'gov-agriculture-desc',
    phones: [],
  },
  {
    slug: 'provincial-planning',
    Icon: ClipboardDataFill,
    title: 'gov-provincial-planning-development',
    desc: 'gov-planning-desc',
    phones: [{ number: '(088) 813-2564' }],
  },
  {
    slug: 'provincial-budget',
    Icon: PiggyBankFill,
    title: 'gov-provincial-budget-office',
    desc: 'gov-budget-preparation-appropriations-fiscal',
    phones: [],
  },
  {
    slug: 'provincial-accounting',
    Icon: CalculatorFill,
    title: 'gov-provincial-accounting-office',
    desc: 'gov-financial-records-disbursements-accounting',
    phones: [],
  },
  {
    slug: 'provincial-general-services',
    Icon: GearFill,
    title: 'gov-provincial-general-services-office',
    desc: 'gov-property-management-procurement-administration',
    phones: [],
  },
  {
    slug: 'human-resource-management',
    Icon: PersonBadgeFill,
    title: 'gov-human-resource-management',
    desc: 'gov-personnel-services-recruitment-employee-records',
    phones: [],
  },
  {
    Icon: PcDisplay,
    title: 'gov-pictd-title',
    desc: 'gov-pictd-desc',
    phones: [{ number: '(088) 813-1603' }],
  },
];

/** (088) 813-5631 → tel:+63888135631 */
const tel = (n: string) => `tel:+63${n.replace(/\D/g, '').slice(1)}`;

const linkClass = 'inline-flex min-h-11 items-center';

export function ProvincialOffices() {
  const t = useT(governmentDictionary);
  return (
    <section id="offices" className="bg-bg-alt">
      <div className={section}>
        <SectionHeading title={t('gov-departments')}>
          <p>{t('gov-dept-subtitle')}</p>
          <p className="mt-xs text-sm">{t('gov-offices-phone-note')}</p>
        </SectionHeading>
        <ul className="grid gap-md sm:grid-cols-2 lg:grid-cols-3">
          {OFFICES.map(({ slug, Icon, title, desc, phones }) => (
            <li key={title} className={`${card} flex gap-sm`}>
              <span className="flex size-12 shrink-0 items-center justify-center rounded-base bg-primary/10 text-xl text-primary">
                <Icon aria-hidden />
              </span>
              <div>
                <h3 className="mb-1 font-semibold">{t(title)}</h3>
                <p className="mb-xs text-sm text-text-light">{t(desc)}</p>
                {phones.map((p) => (
                  <a
                    key={p.number}
                    href={tel(p.number)}
                    className="flex min-h-11 items-center gap-xs text-sm"
                  >
                    <Telephone aria-hidden /> {p.number}{' '}
                    {p.note && <small className="text-text-light">{t(p.note)}</small>}
                  </a>
                ))}
                {slug && (
                  <Link
                    href={`/service-details/${slug}`}
                    className="inline-flex min-h-11 items-center gap-1 text-sm font-semibold"
                    aria-label={`${t('gov-view-services')}: ${t(title)}`}
                  >
                    <ArrowRight aria-hidden /> {t('gov-view-services')}
                  </Link>
                )}
              </div>
            </li>
          ))}
        </ul>
        <div className={`${card} mt-lg`}>
          <h3 className="mb-xs flex items-center gap-xs text-lg font-semibold">
            <SignpostSplitFill aria-hidden className="text-primary" /> {t('gov-lgu-services-title')}
          </h3>
          <p className="mb-sm text-text-light">{t('gov-lgu-services-desc')}</p>
          <ul className="flex flex-wrap gap-x-md">
            <li>
              <Link className={linkClass} href="/service-details/civil-registrar">
                {t('gov-link-civil-registration')}
              </Link>
            </li>
            <li>
              <Link className={linkClass} href="/service-details/business-permits-licensing">
                {t('gov-link-business-permits')}
              </Link>
            </li>
            <li>
              <a className={linkClass} href="#lgus">
                {t('gov-link-find-your-lgu')}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
