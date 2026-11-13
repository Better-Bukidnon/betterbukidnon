'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { Building, Clock, ExclamationTriangle, GeoAlt, Telephone } from 'react-bootstrap-icons';
import { chromeDictionary } from '@/features/i18n/chromeDictionary';
import { useT } from '@/features/i18n/useT';
import { servicesDictionary } from '@/features/services/servicesDictionary';
import { PageHero } from '@/shared/PageHero';
import { buttonPrimary, card, section, sectionTitle } from '@/shared/ui';

function Fact({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <li className="flex items-start gap-xs">
      <span className="mt-1 text-primary">{icon}</span>
      <span>{children}</span>
    </li>
  );
}

export function HealthPage() {
  const nav = useT(chromeDictionary);
  const t = useT(servicesDictionary);

  return (
    <>
      <PageHero
        crumbs={[
          { label: nav('nav-home'), href: '/' },
          { label: nav('nav-services'), href: '/services' },
          { label: t('health-page-title') },
        ]}
        title={t('health-page-title')}
        description={t('health-page-desc')}
      />

      <section className="bg-bg-alt">
        <div className={section}>
          <h2 className={sectionTitle}>
            <Building aria-hidden className="text-primary" />
            {t('health-section-pho')}
          </h2>
          <div className={card}>
            <h3 className="mb-xs text-xl font-semibold">{t('health-pho-title')}</h3>
            <p className="mb-sm text-text-light">{t('health-pho-desc')}</p>
            <ul className="mb-sm space-y-xs">
              <Fact icon={<Telephone aria-hidden />}>
                {t('health-label-phone')}: <a href="tel:+63888135631">(088) 813-5631</a>
              </Fact>
              <Fact icon={<GeoAlt aria-hidden />}>
                {t('health-label-address')}: {t('health-address-value')}
              </Fact>
              <Fact icon={<Clock aria-hidden />}>
                {t('health-label-hours')}: {t('health-hours-value')}
              </Fact>
              <Fact icon={<ExclamationTriangle aria-hidden />}>
                {t('health-emergency-title')}: {t('health-emergency-desc')}{' '}
                <a href="tel:911">911</a>
              </Fact>
            </ul>
            <p className="mb-md text-text-light">{t('health-gathering')}</p>
            <Link href="/service-details/provincial-health-office" className={buttonPrimary}>
              {t('health-details-link')}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
