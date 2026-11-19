'use client';

import Link from 'next/link';
import {
  ArrowRight,
  Bank,
  BoxArrowUpRight,
  Building,
  Grid3x3Gap,
  HouseDoor,
  Link45deg,
} from 'react-bootstrap-icons';
import { useT } from '@/features/i18n/useT';
import { legalDictionary } from '@/features/legal/legalDictionary';
import { prose } from '@/features/legal/prose';
import { PageHero } from '@/shared/PageHero';
import { card, section } from '@/shared/ui';

export function SitemapPage() {
  const t = useT(legalDictionary);
  return (
    <>
      <PageHero
        crumbs={[{ label: t('sitemap-home'), href: '/' }, { label: 'Sitemap' }]}
        title={t('sitemap-sitemap')}
        description={t('sitemap-navigate-all-pages-and-services-of-better-bukidnon')}
      />
      <div className={prose}>
        <section className={section}>
          <div className="mb-lg">
            <div className="mb-sm flex flex-wrap items-center gap-xs">
              <HouseDoor aria-hidden className="shrink-0 text-primary" />
              <h2>{t('sitemap-main-navigation')}</h2>
            </div>
            <div className="grid gap-xs sm:grid-cols-2 lg:grid-cols-3">
              <Link
                href="/"
                className={`${card} flex items-center gap-xs font-medium no-underline`}
              >
                <ArrowRight aria-hidden className="shrink-0 text-primary" /> {t('sitemap-home')}
              </Link>
              <Link
                href="/services"
                className={`${card} flex items-center gap-xs font-medium no-underline`}
              >
                <ArrowRight aria-hidden className="shrink-0 text-primary" /> {t('sitemap-services')}
              </Link>
              <Link
                href="/government"
                className={`${card} flex items-center gap-xs font-medium no-underline`}
              >
                <ArrowRight aria-hidden className="shrink-0 text-primary" />{' '}
                {t('sitemap-government')}
              </Link>
              <Link
                href="/statistics"
                className={`${card} flex items-center gap-xs font-medium no-underline`}
              >
                <ArrowRight aria-hidden className="shrink-0 text-primary" />{' '}
                {t('sitemap-statistics')}
              </Link>
              <Link
                href="/legislative"
                className={`${card} flex items-center gap-xs font-medium no-underline`}
              >
                <ArrowRight aria-hidden className="shrink-0 text-primary" />{' '}
                {t('sitemap-legislative')}
              </Link>
              <Link
                href="/budget"
                className={`${card} flex items-center gap-xs font-medium no-underline`}
              >
                <ArrowRight aria-hidden className="shrink-0 text-primary" />{' '}
                {t('sitemap-transparency')}
              </Link>
              <Link
                href="/projects"
                className={`${card} flex items-center gap-xs font-medium no-underline`}
              >
                <ArrowRight aria-hidden className="shrink-0 text-primary" /> {t('sitemap-projects')}
              </Link>
              <Link
                href="/contact"
                className={`${card} flex items-center gap-xs font-medium no-underline`}
              >
                <ArrowRight aria-hidden className="shrink-0 text-primary" /> {t('sitemap-contact')}
              </Link>
              <Link
                href="/news"
                className={`${card} flex items-center gap-xs font-medium no-underline`}
              >
                <ArrowRight aria-hidden className="shrink-0 text-primary" /> {t('sitemap-news')}
              </Link>
              <Link
                href="/faq"
                className={`${card} flex items-center gap-xs font-medium no-underline`}
              >
                <ArrowRight aria-hidden className="shrink-0 text-primary" /> FAQ
              </Link>
              <Link
                href="/accessibility"
                className={`${card} flex items-center gap-xs font-medium no-underline`}
              >
                <ArrowRight aria-hidden className="shrink-0 text-primary" /> Accessibility
              </Link>
            </div>
          </div>
          <div className="mb-lg">
            <div className="mb-sm flex flex-wrap items-center gap-xs">
              <Grid3x3Gap aria-hidden className="shrink-0 text-primary" />
              <h2>{t('sitemap-service-categories')}</h2>
            </div>
            <div className="grid gap-xs sm:grid-cols-2 lg:grid-cols-3">
              <Link
                href="/services/certificates"
                className={`${card} flex items-center gap-xs font-medium no-underline`}
              >
                <ArrowRight aria-hidden className="shrink-0 text-primary" />{' '}
                {t('sitemap-certificates-vital-records')}
              </Link>
              <Link
                href="/services/business"
                className={`${card} flex items-center gap-xs font-medium no-underline`}
              >
                <ArrowRight aria-hidden className="shrink-0 text-primary" />{' '}
                {t('sitemap-business-services')}
              </Link>
              <Link
                href="/services/social-services"
                className={`${card} flex items-center gap-xs font-medium no-underline`}
              >
                <ArrowRight aria-hidden className="shrink-0 text-primary" />{' '}
                {t('sitemap-social-services')}
              </Link>
              <Link
                href="/services/health"
                className={`${card} flex items-center gap-xs font-medium no-underline`}
              >
                <ArrowRight aria-hidden className="shrink-0 text-primary" />{' '}
                {t('sitemap-health-wellness')}
              </Link>
              <Link
                href="/services/tax-payments"
                className={`${card} flex items-center gap-xs font-medium no-underline`}
              >
                <ArrowRight aria-hidden className="shrink-0 text-primary" />{' '}
                {t('sitemap-tax-payments')}
              </Link>
              <Link
                href="/services/agriculture"
                className={`${card} flex items-center gap-xs font-medium no-underline`}
              >
                <ArrowRight aria-hidden className="shrink-0 text-primary" />{' '}
                {t('sitemap-agriculture')}
              </Link>
              <Link
                href="/services/infrastructure"
                className={`${card} flex items-center gap-xs font-medium no-underline`}
              >
                <ArrowRight aria-hidden className="shrink-0 text-primary" />{' '}
                {t('sitemap-infrastructure')}
              </Link>
              <Link
                href="/services/education"
                className={`${card} flex items-center gap-xs font-medium no-underline`}
              >
                <ArrowRight aria-hidden className="shrink-0 text-primary" />{' '}
                {t('sitemap-education')}
              </Link>
              <Link
                href="/services/environment"
                className={`${card} flex items-center gap-xs font-medium no-underline`}
              >
                <ArrowRight aria-hidden className="shrink-0 text-primary" />{' '}
                {t('sitemap-environment')}
              </Link>
              <Link
                href="/services/public-safety"
                className={`${card} flex items-center gap-xs font-medium no-underline`}
              >
                <ArrowRight aria-hidden className="shrink-0 text-primary" />{' '}
                {t('sitemap-public-safety')}
              </Link>
            </div>
          </div>
          <div className="mb-lg">
            <div className="mb-sm flex flex-wrap items-center gap-xs">
              <Building aria-hidden className="shrink-0 text-primary" />
              <h2>{t('sitemap-provincial-offices')}</h2>
            </div>
            <div className="grid gap-xs sm:grid-cols-2 lg:grid-cols-3">
              <Link
                href="/service-details/civil-registrar"
                className={`${card} flex items-center gap-xs font-medium no-underline`}
              >
                <ArrowRight aria-hidden className="shrink-0 text-primary" />{' '}
                {t('sitemap-civil-registration')}
              </Link>
              <Link
                href="/service-details/provincial-treasurer"
                className={`${card} flex items-center gap-xs font-medium no-underline`}
              >
                <ArrowRight aria-hidden className="shrink-0 text-primary" />{' '}
                {t('sitemap-treasurers-office')}
              </Link>
              <Link
                href="/service-details/provincial-assessor"
                className={`${card} flex items-center gap-xs font-medium no-underline`}
              >
                <ArrowRight aria-hidden className="shrink-0 text-primary" />{' '}
                {t('sitemap-assessors-office')}
              </Link>
              <Link
                href="/service-details/property-declaration"
                className={`${card} flex items-center gap-xs font-medium no-underline`}
              >
                <ArrowRight aria-hidden className="shrink-0 text-primary" />{' '}
                {t('sitemap-property-declaration')}
              </Link>
              <Link
                href="/service-details/provincial-budget"
                className={`${card} flex items-center gap-xs font-medium no-underline`}
              >
                <ArrowRight aria-hidden className="shrink-0 text-primary" />{' '}
                {t('sitemap-budget-office')}
              </Link>
              <Link
                href="/service-details/provincial-accounting"
                className={`${card} flex items-center gap-xs font-medium no-underline`}
              >
                <ArrowRight aria-hidden className="shrink-0 text-primary" />{' '}
                {t('sitemap-accounting-office')}
              </Link>
              <Link
                href="/service-details/provincial-engineering"
                className={`${card} flex items-center gap-xs font-medium no-underline`}
              >
                <ArrowRight aria-hidden className="shrink-0 text-primary" />{' '}
                {t('sitemap-engineering-office')}
              </Link>
              <Link
                href="/service-details/provincial-planning"
                className={`${card} flex items-center gap-xs font-medium no-underline`}
              >
                <ArrowRight aria-hidden className="shrink-0 text-primary" />{' '}
                {t('sitemap-planning-office')}
              </Link>
              <Link
                href="/service-details/provincial-agriculture"
                className={`${card} flex items-center gap-xs font-medium no-underline`}
              >
                <ArrowRight aria-hidden className="shrink-0 text-primary" />{' '}
                {t('sitemap-agriculture-office')}
              </Link>
              <Link
                href="/service-details/pswdo"
                className={`${card} flex items-center gap-xs font-medium no-underline`}
              >
                <ArrowRight aria-hidden className="shrink-0 text-primary" /> {t('sitemap-pswdo')}
              </Link>
              <Link
                href="/service-details/provincial-health-office"
                className={`${card} flex items-center gap-xs font-medium no-underline`}
              >
                <ArrowRight aria-hidden className="shrink-0 text-primary" />{' '}
                {t('sitemap-health-office')}
              </Link>
              <Link
                href="/service-details/pdrrmd"
                className={`${card} flex items-center gap-xs font-medium no-underline`}
              >
                <ArrowRight aria-hidden className="shrink-0 text-primary" /> {t('sitemap-pdrrmd')}
              </Link>
              <Link
                href="/service-details/business-permits-licensing"
                className={`${card} flex items-center gap-xs font-medium no-underline`}
              >
                <ArrowRight aria-hidden className="shrink-0 text-primary" />{' '}
                {t('sitemap-bpls-office')}
              </Link>
              <Link
                href="/service-details/provincial-general-services"
                className={`${card} flex items-center gap-xs font-medium no-underline`}
              >
                <ArrowRight aria-hidden className="shrink-0 text-primary" />{' '}
                {t('sitemap-general-services')}
              </Link>
              <Link
                href="/service-details/human-resource-management"
                className={`${card} flex items-center gap-xs font-medium no-underline`}
              >
                <ArrowRight aria-hidden className="shrink-0 text-primary" />{' '}
                {t('sitemap-hr-management')}
              </Link>
            </div>
          </div>
          <div className="mb-lg">
            <div className="mb-sm flex flex-wrap items-center gap-xs">
              <Bank aria-hidden className="shrink-0 text-primary" />
              <h2>{t('sitemap-government-legislative')}</h2>
            </div>
            <div className="grid gap-xs sm:grid-cols-2 lg:grid-cols-3">
              <Link
                href="/government"
                className={`${card} flex items-center gap-xs font-medium no-underline`}
              >
                <ArrowRight aria-hidden className="shrink-0 text-primary" />{' '}
                {t('sitemap-government-structure')}
              </Link>
              <Link
                href="/government/officials"
                className={`${card} flex items-center gap-xs font-medium no-underline`}
              >
                <ArrowRight aria-hidden className="shrink-0 text-primary" />{' '}
                {t('sitemap-elected-officials')}
              </Link>
              <Link
                href="/government#lgus"
                className={`${card} flex items-center gap-xs font-medium no-underline`}
              >
                <ArrowRight aria-hidden className="shrink-0 text-primary" /> {t('sitemap-lgus')}
              </Link>
              <Link
                href="/legislative"
                className={`${card} flex items-center gap-xs font-medium no-underline`}
              >
                <ArrowRight aria-hidden className="shrink-0 text-primary" />{' '}
                {t('sitemap-legislative-documents')}
              </Link>
              <Link
                href="/legislative/ordinance-framework"
                className={`${card} flex items-center gap-xs font-medium no-underline`}
              >
                <ArrowRight aria-hidden className="shrink-0 text-primary" />{' '}
                {t('sitemap-ordinance-framework')}
              </Link>
              <Link
                href="/legislative/resolution-framework"
                className={`${card} flex items-center gap-xs font-medium no-underline`}
              >
                <ArrowRight aria-hidden className="shrink-0 text-primary" />{' '}
                {t('sitemap-resolution-framework')}
              </Link>
            </div>
          </div>
          <div className="mb-lg">
            <div className="mb-sm flex flex-wrap items-center gap-xs">
              <Link45deg aria-hidden className="shrink-0 text-primary" />
              <h2>{t('sitemap-external-resources')}</h2>
            </div>
            <div className="grid gap-xs sm:grid-cols-2 lg:grid-cols-3">
              <a
                href="https://bukidnon.gov.ph"
                target="_blank"
                rel="noopener noreferrer"
                className={`${card} flex items-center gap-xs font-medium no-underline`}
              >
                <BoxArrowUpRight aria-hidden className="shrink-0 text-primary" />{' '}
                {t('sitemap-official-bukidnon-website')}
              </a>
              <a
                href="https://www.facebook.com/lgubukidnon"
                target="_blank"
                rel="noopener noreferrer"
                className={`${card} flex items-center gap-xs font-medium no-underline`}
              >
                <BoxArrowUpRight aria-hidden className="shrink-0 text-primary" />{' '}
                {t('sitemap-facebook-page')}
              </a>
              <Link
                href="/terms"
                className={`${card} flex items-center gap-xs font-medium no-underline`}
              >
                <ArrowRight aria-hidden className="shrink-0 text-primary" />{' '}
                {t('sitemap-terms-of-use')}
              </Link>
              <Link
                href="/privacy"
                className={`${card} flex items-center gap-xs font-medium no-underline`}
              >
                <ArrowRight aria-hidden className="shrink-0 text-primary" />{' '}
                {t('sitemap-privacy-policy')}
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
