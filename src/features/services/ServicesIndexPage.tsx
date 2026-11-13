'use client';

import type { Icon } from 'react-bootstrap-icons';
import {
  ArrowRight,
  BuildingFillGear,
  CashCoin,
  EmojiSmile,
  FileEarmarkTextFill,
  GlobeAmericas,
  Hammer,
  Heart,
  HeartPulseFill,
  MortarboardFill,
  PeopleFill,
  PersonBadge,
  QuestionCircle,
  ShieldFillCheck,
  Shop,
  TreeFill,
  UniversalAccess,
  Wallet2,
} from 'react-bootstrap-icons';
import { chromeDictionary } from '@/features/i18n/chromeDictionary';
import { useT } from '@/features/i18n/useT';
import { ServiceSearch } from '@/features/search/ServiceSearch';
import type { CategorySlug } from '@/features/services/categories';
import { servicesDictionary } from '@/features/services/servicesDictionary';
import type { ServicesKey } from '@/features/services/types';
import { PageHero } from '@/shared/PageHero';
import { card, section } from '@/shared/ui';

/** Same order as the legacy directory. */
const CATEGORIES: [CategorySlug, Icon, ServicesKey, ServicesKey][] = [
  ['certificates', FileEarmarkTextFill, 'cat-certificates', 'cat-certificates-desc'],
  ['business', Shop, 'cat-business', 'cat-business-desc'],
  ['social-services', PeopleFill, 'cat-social', 'cat-social-desc'],
  ['health', HeartPulseFill, 'cat-health', 'cat-health-desc'],
  ['tax-payments', CashCoin, 'cat-tax', 'cat-tax-desc'],
  ['agriculture', TreeFill, 'cat-agriculture', 'cat-agriculture-desc'],
  ['infrastructure', BuildingFillGear, 'cat-infrastructure', 'cat-infrastructure-desc'],
  ['education', MortarboardFill, 'cat-education', 'cat-education-desc'],
  ['public-safety', ShieldFillCheck, 'cat-safety', 'cat-safety-desc'],
  ['environment', GlobeAmericas, 'cat-environment', 'cat-environment-desc'],
];

const LIFE_EVENTS: [CategorySlug, Icon, ServicesKey][] = [
  ['business', Shop, 'svc-starting-a-business'],
  ['certificates', Heart, 'svc-getting-married'],
  ['certificates', EmojiSmile, 'svc-having-a-baby'],
  ['social-services', Wallet2, 'svc-need-financial-help'],
  ['social-services', PersonBadge, 'svc-senior-citizen-services'],
  ['social-services', UniversalAccess, 'svc-person-with-disability'],
  ['infrastructure', Hammer, 'svc-buildinghome-improvement'],
  ['public-safety', QuestionCircle, 'svc-got-in-trouble'],
];

export function ServicesIndexPage() {
  const nav = useT(chromeDictionary);
  const t = useT(servicesDictionary);

  return (
    <>
      <PageHero
        crumbs={[{ label: nav('nav-home'), href: '/' }, { label: nav('nav-services') }]}
        title={t('services-title')}
        description={t('services-subtitle')}
      />

      <div className="mx-auto max-w-site px-sm pt-lg">
        <ServiceSearch label={t('svc-search-label')} placeholder={t('svc-search-placeholder')} />
      </div>

      <section className={section} aria-labelledby="service-categories">
        <h2 id="service-categories" className="sr-only">
          {t('svc-services')}
        </h2>
        <ul className="grid gap-md sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map(([slug, CatIcon, title, desc]) => (
            <li key={slug}>
              <a
                href={`/services/${slug}`}
                className={`${card} flex h-full gap-sm text-text no-underline hover:border-primary`}
              >
                <CatIcon aria-hidden className="shrink-0 text-3xl text-primary" />
                <span className="flex flex-col">
                  <h3 className="mb-xs text-lg font-semibold">{t(title)}</h3>
                  <span className="mb-sm text-text-light">{t(desc)}</span>
                  <span className="mt-auto inline-flex items-center gap-xs font-semibold text-primary">
                    <ArrowRight aria-hidden /> {t('svc-view-services')}
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-bg-alt">
        <div className={section}>
          <div className="mb-lg text-center">
            <h2 className="mb-xs text-2xl font-semibold">{t('life-events-title')}</h2>
            <p className="text-text-light">{t('life-events-subtitle')}</p>
          </div>
          <ul className="grid grid-cols-2 gap-sm md:grid-cols-4">
            {LIFE_EVENTS.map(([slug, EventIcon, label]) => (
              <li key={label}>
                <a
                  href={`/services/${slug}`}
                  className={`${card} flex min-h-11 h-full flex-col items-center gap-xs text-center font-medium text-text no-underline hover:border-primary`}
                >
                  <EventIcon aria-hidden className="text-2xl text-primary" />
                  {t(label)}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
