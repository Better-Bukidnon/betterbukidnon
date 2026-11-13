'use client';

import Link from 'next/link';
import type { ComponentType, SVGProps } from 'react';
import {
  Building,
  CashCoin,
  FileEarmarkTextFill,
  Flower1,
  GeoAltFill,
  HeartPulseFill,
  PeopleFill,
  Search,
} from 'react-bootstrap-icons';
import { homeDictionary, type HomeKey } from '@/features/home/homeDictionary';
import {
  HistorySection,
  LeadershipContactSection,
  UpdatesSection,
  WeatherMapSection,
} from '@/features/home/HomeSections';
import { useT } from '@/features/i18n/useT';
import { ServiceSearch } from '@/features/search/ServiceSearch';
import { demographics } from '@/features/statistics/statisticsData';
import { Section } from '@/shared/Section';
import { SectionHeading } from '@/shared/SectionHeading';
import {
  buttonOnDark,
  buttonOutline,
  buttonOutlineOnDark,
  buttonPrimary,
  cardLink,
  chip,
  container,
  sectionPad,
} from '@/shared/ui';

type Icon = ComponentType<SVGProps<SVGSVGElement>>;

const SERVICES: { href: string; Icon: Icon; title: HomeKey; desc: HomeKey }[] = [
  {
    href: '/services/tax-payments',
    Icon: CashCoin,
    title: 'service-tax',
    desc: 'service-tax-desc',
  },
  {
    href: '/services/social-services',
    Icon: PeopleFill,
    title: 'service-social',
    desc: 'service-social-desc',
  },
  {
    href: '/services/health',
    Icon: HeartPulseFill,
    title: 'service-health',
    desc: 'service-health-desc',
  },
  {
    href: '/services/agriculture',
    Icon: Flower1,
    title: 'home-agriculture',
    desc: 'home-agriculture-desc',
  },
  {
    href: '/services/certificates',
    Icon: FileEarmarkTextFill,
    title: 'service-certificates',
    desc: 'service-certificates-desc',
  },
];

const POPULAR: { href: string; key: HomeKey }[] = [
  { href: '/service-details/provincial-treasurer', key: 'home-real-property-tax' },
  { href: '/service-details/birth-certificate', key: 'home-birth-certificate' },
  { href: '/service-details/pswdo', key: 'home-social-assistance' },
];

const number = (n: number) => n.toLocaleString('en-US');

/** The one solid brand band on the site. The task here is to find a service, so search leads. */
function Hero() {
  const t = useT(homeDictionary);
  return (
    <section data-surface="dark" className="bg-primary text-white">
      <div
        className={`${container} ${sectionPad} grid grid-cols-1 items-center gap-lg lg:grid-cols-2`}
      >
        <div>
          <h1 className="mb-sm text-display font-bold [overflow-wrap:anywhere]">
            {t('hero-welcome')}
          </h1>
          <p className="mb-md max-w-[36rem] text-lg text-white/90">{t('hero-subtitle')}</p>
          <div className="flex flex-wrap gap-sm">
            <Link href="/services" className={buttonOnDark}>
              {t('home-browse-services')}
            </Link>
            <a href="/contact" className={buttonOutlineOnDark}>
              {t('home-contact-us')}
            </a>
          </div>
        </div>
        <div data-surface="light" className="rounded-base bg-bg p-md text-text">
          <h2 className="mb-sm flex items-center gap-xs text-xl font-semibold">
            <Search aria-hidden className="text-primary" /> {t('home-find-a-service')}
          </h2>
          <ServiceSearch
            label={t('home-search-label')}
            placeholder={t('home-search-placeholder')}
          />
          <p className="mt-sm flex flex-wrap items-center gap-xs text-sm">
            <span className="text-text-light">{t('home-popular')}</span>
            {POPULAR.map((p) => (
              <a key={p.key} href={p.href} className={chip}>
                {t(p.key)}
              </a>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}

/** Service categories as a plain list, next to the answer to "which office handles this?". */
function ServicesSection() {
  const t = useT(homeDictionary);
  return (
    <Section labelledBy="services-heading">
      <SectionHeading
        id="services-heading"
        title={t('section-popular')}
        href="/services"
        linkText={t('btn-view-all-services')}
      >
        <p>{t('home-quick-access-to-frequently-requested-provincial')}</p>
      </SectionHeading>
      <div className="grid items-start gap-lg lg:grid-cols-[3fr_2fr]">
        <ul className="divide-y divide-black/10 border-y border-black/10">
          {SERVICES.map(({ href, Icon, title, desc }) => (
            <li key={href}>
              <a
                href={href}
                className="group flex min-h-11 items-center gap-sm py-sm text-text no-underline"
              >
                <Icon aria-hidden className="shrink-0 text-2xl text-primary" />
                <span>
                  <span className="block font-semibold group-hover:text-primary group-hover:underline">
                    {t(title)}
                  </span>
                  <span className="block text-sm text-text-light">{t(desc)}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
        <aside
          aria-labelledby="lgu-cta-heading"
          className="rounded-base border border-black/10 bg-bg-alt p-md"
        >
          <h3 id="lgu-cta-heading" className="mb-xs text-xl font-bold">
            {t('home-lgu-cta-heading')}
          </h3>
          <p className="mb-md text-text-light">{t('home-lgu-cta-subtitle')}</p>
          <div className="flex flex-wrap gap-sm">
            <a href="/government#lgus" className={buttonPrimary}>
              <GeoAltFill aria-hidden /> {t('home-lgu-cta-find')}
            </a>
            <a href="/government" className={buttonOutline}>
              <Building aria-hidden /> {t('home-lgu-cta-offices')}
            </a>
          </div>
        </aside>
      </div>
    </Section>
  );
}

/** Population leads; the other figures are supporting facts, so they are smaller. */
function Stats() {
  const t = useT(homeDictionary);
  const stats: { href: string; value: string; label: string; source: string }[] = [
    {
      href: '/statistics',
      value: number(demographics.population.total),
      label: t('home-population'),
      source: t('home-2024-census'),
    },
    {
      href: '/government#lgus',
      value: number(demographics.counts.barangays),
      label: t('home-barangays'),
      source: t('home-lgu-count'),
    },
    {
      href: '/budget',
      value: t('home-1st-class'),
      label: t('home-province'),
      source: t('home-income-classification'),
    },
    {
      href: '/statistics',
      value: t('home-land-area-value'),
      label: t('home-land-area'),
      source: t('home-land-area-rank'),
    },
  ];
  return (
    <Section tone="tint">
      <SectionHeading
        title={t('home-bukidnon-at-a-glance')}
        href="/statistics"
        linkText={t('home-view-statistics')}
      />
      <ul className="grid gap-sm sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]">
        {stats.map(({ href, value, label, source }, i) => (
          <li key={label}>
            <a href={href} className={`${cardLink} h-full`}>
              <span
                className={`block font-bold text-primary tabular-nums ${i === 0 ? 'text-title' : 'text-2xl'}`}
              >
                {value}
              </span>
              <span className="block font-semibold">{label}</span>
              <span className="block text-sm text-text-light">{source}</span>
            </a>
          </li>
        ))}
      </ul>
    </Section>
  );
}

/**
 * Three zones: do something (search, services), what is new (Facebook, news), and about
 * Bukidnon (facts, weather, history, leadership). Project and volunteer info lives in the footer.
 */
export function HomePage() {
  return (
    <>
      <Hero />
      <ServicesSection />
      <UpdatesSection />
      <Stats />
      <WeatherMapSection />
      <HistorySection />
      <LeadershipContactSection />
    </>
  );
}
