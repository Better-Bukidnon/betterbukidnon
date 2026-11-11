'use client';

import Link from 'next/link';
import {
  BuildingFill,
  CheckCircleFill,
  ClockFill,
  EnvelopeFill,
  ExclamationCircle,
  ExclamationTriangleFill,
  Fire,
  GeoAltFill,
  Github,
  Globe2,
  HeartFill,
  HeartPulseFill,
  InfoCircle,
  InfoCircleFill,
  MapFill,
  PeopleFill,
  ShieldFill,
  TelephoneFill,
  XCircleFill,
} from 'react-bootstrap-icons';
import { useT } from '@/features/i18n/useT';
import { legalDictionary } from '@/features/legal/legalDictionary';
import { prose } from '@/features/legal/prose';
import { PageHero } from '@/shared/PageHero';
import { card, section, tableWrap } from '@/shared/ui';

export function ContactPage() {
  const t = useT(legalDictionary);
  return (
    <>
      <PageHero
        crumbs={[{ label: t('contact-home'), href: '/' }, { label: t('contact-contact') }]}
        title={t('contact-title')}
        description={t('contact-subtitle')}
      />
      <div className={prose}>
        <section className={section}>
          <div className={`${card} flex items-start gap-sm`}>
            <div>
              <InfoCircleFill aria-hidden className="shrink-0 text-primary" />
            </div>
            <div>
              <h2>{t('contact-notice-title')}</h2>
              <p>{t('contact-notice-text')}</p>
            </div>
          </div>
        </section>
        <section className={section}>
          <div className="grid gap-md md:grid-cols-3">
            <div className={`${card} flex items-start gap-sm`}>
              <div>
                <GeoAltFill aria-hidden className="shrink-0 text-primary" />
              </div>
              <div>
                <h3>{t('contact-address')}</h3>
                <p>Provincial Capitol Compound, Barangay 9, Malaybalay City, Bukidnon 8700</p>
                <span className="block text-sm text-text-light">
                  {t('contact-provincial-government')}
                </span>
              </div>
            </div>
            <a href="tel:+63888135741" className={`${card} flex items-start gap-sm`}>
              <div>
                <TelephoneFill aria-hidden className="shrink-0 text-primary" />
              </div>{' '}
              <div>
                <h3>{t('contact-main-line')}</h3>
                <p>(088) 813-5741</p>
                <span className="block text-sm text-text-light">{t('contact-hours')}</span>
              </div>
            </a>
            <a
              href="https://bukidnon.gov.ph/"
              target="_blank"
              rel="noopener noreferrer"
              className={`${card} flex items-start gap-sm`}
            >
              <div>
                <Globe2 aria-hidden className="shrink-0 text-primary" />
              </div>{' '}
              <div>
                <h3>{t('contact-official-website')}</h3>
                <p>bukidnon.gov.ph</p>
                <span className="block text-sm text-text-light">
                  {t('contact-provincial-government')}
                </span>
              </div>
            </a>
          </div>
        </section>
        <section className={section}>
          <div>
            <div className="mb-sm flex flex-wrap items-center gap-xs [&_h2]:mb-0!">
              <ClockFill aria-hidden className="size-5 shrink-0 text-primary" />
              <h2>{t('contact-office-hours')}</h2>
            </div>
            <div className="grid gap-sm sm:grid-cols-2">
              <div className={card}>
                <span className="block font-semibold">{t('contact-monday-friday')}</span>
                <span className="block text-text-light">8:00 AM - 5:00 PM</span>
                <span className="block">
                  <CheckCircleFill
                    aria-hidden
                    className="inline shrink-0 align-[-0.125em] text-success"
                  />{' '}
                  {t('contact-open')}
                </span>
              </div>
              <div className={card}>
                <span className="block font-semibold">{t('contact-saturday-sunday')}</span>

                <span className="block">
                  <XCircleFill
                    aria-hidden
                    className="inline shrink-0 align-[-0.125em] text-danger"
                  />{' '}
                  {t('contact-closed')}
                </span>
              </div>
              <div className={card}>
                <span className="block font-semibold">{t('contact-national-local-holidays')}</span>

                <span className="block">
                  <XCircleFill
                    aria-hidden
                    className="inline shrink-0 align-[-0.125em] text-danger"
                  />{' '}
                  {t('contact-closed')}
                </span>
              </div>
              <div className={card}>
                <span className="block font-semibold">{t('contact-emergencies')}</span>
                <span className="block text-text-light">{t('contact-call-911')}</span>
                <span className="block">
                  <TelephoneFill
                    aria-hidden
                    className="inline shrink-0 align-[-0.125em] text-primary"
                  />{' '}
                  24/7
                </span>
              </div>
            </div>
          </div>
        </section>
        <section id="hotlines" className={section}>
          <div className="mb-sm">
            <div className="mb-sm flex flex-wrap items-center gap-xs [&_h2]:mb-0!">
              <span className="inline-flex items-center gap-1 rounded-sm bg-danger/10 px-2.5 py-1 text-xs font-semibold text-danger">
                <ExclamationTriangleFill aria-hidden className="shrink-0" />
                {t('contact-emergency')}
              </span>
              <h2>{t('contact-hotlines')}</h2>
            </div>
            <p>{t('contact-hotlines-desc')}</p>
          </div>
          <div className="grid gap-sm sm:grid-cols-2 lg:grid-cols-3">
            <a href="tel:911" className={`${card} flex flex-col gap-1 no-underline`}>
              <TelephoneFill aria-hidden className="shrink-0 text-primary" />{' '}
              <span className="block">{t('contact-hl-911')}</span>{' '}
              <span className="block text-lg font-bold text-primary">911</span>
            </a>
            <a href="tel:+63888131262" className={`${card} flex flex-col gap-1 no-underline`}>
              <ExclamationTriangleFill aria-hidden className="shrink-0 text-primary" />{' '}
              <span className="block">{t('contact-hl-pdrrmd')}</span>{' '}
              <span className="block text-lg font-bold text-primary">(088) 813-1262</span>
            </a>
            <a href="tel:+63888134263" className={`${card} flex flex-col gap-1 no-underline`}>
              <ShieldFill aria-hidden className="shrink-0 text-primary" />{' '}
              <span className="block">{t('contact-hl-police')}</span>{' '}
              <span className="block text-lg font-bold text-primary">(088) 813-4263</span>
            </a>
            <a href="tel:+63888135449" className={`${card} flex flex-col gap-1 no-underline`}>
              <Fire aria-hidden className="shrink-0 text-primary" />{' '}
              <span className="block">{t('contact-hl-fire')}</span>{' '}
              <span className="block text-lg font-bold text-primary">(088) 813-5449</span>
            </a>
            <a href="tel:+63888135631" className={`${card} flex flex-col gap-1 no-underline`}>
              <HeartPulseFill aria-hidden className="shrink-0 text-primary" />{' '}
              <span className="block">{t('contact-hl-pho')}</span>{' '}
              <span className="block text-lg font-bold text-primary">(088) 813-5631</span>
            </a>
            <a href="tel:+63888135734" className={`${card} flex flex-col gap-1 no-underline`}>
              <HeartFill aria-hidden className="shrink-0 text-primary" />{' '}
              <span className="block">{t('contact-hl-pswdo')}</span>{' '}
              <span className="block text-lg font-bold text-primary">(088) 813-5734</span>
            </a>
          </div>
          <p className="text-sm text-text-light">
            <InfoCircle aria-hidden className="inline shrink-0 align-[-0.125em] text-primary" />{' '}
            {t('contact-hotlines-note')}
          </p>
        </section>
        <section className={section}>
          <div className="mb-sm">
            <div className="mb-sm flex flex-wrap items-center gap-xs [&_h2]:mb-0!">
              <span className="inline-flex items-center gap-1 rounded-sm bg-danger/10 px-2.5 py-1 text-xs font-semibold text-danger">
                <BuildingFill aria-hidden className="shrink-0" />
                {t('contact-directory-badge')}
              </span>
              <h2>{t('contact-directory-title')}</h2>
            </div>
            <p>{t('contact-directory-desc')}</p>
          </div>
          <div>
            <div className={tableWrap}>
              <table className="w-full text-left text-sm">
                <caption className="sr-only">{t('contact-directory-title')}</caption>
                <thead>
                  <tr>
                    <th scope="col">{t('contact-dir-office')}</th>
                    <th scope="col">{t('contact-dir-abbr')}</th>
                    <th scope="col">{t('contact-dir-telephone')}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{t('contact-dir-main-line')}</td>
                    <td>–</td>
                    <td>
                      <a href="tel:+63888135741">(088) 813-5741</a>
                    </td>
                  </tr>
                  <tr>
                    <td>{t('contact-dir-pgo')}</td>
                    <td>PGO</td>
                    <td>
                      <a href="tel:+63888132457">(088) 813-2457</a>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <Link href="/service-details/provincial-health-office">
                        {t('contact-dir-pho')}
                      </Link>
                    </td>
                    <td>PHO</td>
                    <td>
                      <a href="tel:+63888135631">(088) 813-5631</a>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <Link href="/service-details/provincial-engineering">
                        {t('contact-dir-peo')}
                      </Link>
                    </td>
                    <td>PEO</td>
                    <td>
                      <a href="tel:+63888133656">(088) 813-3656</a>
                    </td>
                  </tr>
                  <tr>
                    <td>{t('contact-dir-peo-waterworks')}</td>
                    <td>–</td>
                    <td>
                      <a href="tel:+63888133688">(088) 813-3688</a>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <Link href="/service-details/pswdo">{t('contact-dir-pswdo')}</Link>
                    </td>
                    <td>PSWDO</td>
                    <td>
                      <a href="tel:+63888135734">(088) 813-5734</a>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <Link href="/service-details/provincial-treasurer">
                        {t('contact-dir-pto')}
                      </Link>
                    </td>
                    <td>PTO</td>
                    <td>
                      <a href="tel:+63888132474">(088) 813-2474</a>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <Link href="/service-details/provincial-planning">
                        {t('contact-dir-ppdo')}
                      </Link>
                    </td>
                    <td>PPDO</td>
                    <td>
                      <a href="tel:+63888132564">(088) 813-2564</a>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <Link href="/service-details/pdrrmd">{t('contact-dir-pdrrmd')}</Link>
                    </td>
                    <td>PDRRMD</td>
                    <td>
                      <a href="tel:+63888131262">(088) 813-1262</a>
                    </td>
                  </tr>
                  <tr>
                    <td>{t('contact-dir-pictd')}</td>
                    <td>PICTD</td>
                    <td>
                      <a href="tel:+63888131603">(088) 813-1603</a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <p className="text-sm text-text-light">
            <ExclamationCircle
              aria-hidden
              className="inline shrink-0 align-[-0.125em] text-primary"
            />{' '}
            {t('contact-directory-verify')}
          </p>
        </section>
        <section className={section}>
          <div className="mb-sm">
            <div className="mb-sm flex flex-wrap items-center gap-xs [&_h2]:mb-0!">
              <span className="inline-flex items-center gap-1 rounded-sm bg-danger/10 px-2.5 py-1 text-xs font-semibold text-danger">
                <MapFill aria-hidden className="shrink-0" /> {t('contact-map-badge')}
              </span>
              <h2>{t('contact-map-title')}</h2>
            </div>
            <p>{t('contact-map-desc')}</p>
          </div>
          <div className={card}>
            <iframe
              src="https://www.google.com/maps?q=8.1575,125.1278&z=15&output=embed"
              title={t('contact-map-iframe-title')}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-80 w-full rounded-base border-0"
            />
            <p className="text-sm text-text-light">
              <GeoAltFill aria-hidden className="inline shrink-0 align-[-0.125em] text-primary" />{' '}
              {t('contact-map-caption')}{' '}
              <a
                href="https://www.google.com/maps?q=8.1575,125.1278"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t('contact-map-larger')}
              </a>
            </p>
          </div>
        </section>
        <section className={section}>
          <div className="mb-sm">
            <div className="mb-sm flex flex-wrap items-center gap-xs [&_h2]:mb-0!">
              <span className="inline-flex items-center gap-1 rounded-sm bg-danger/10 px-2.5 py-1 text-xs font-semibold text-danger">
                <PeopleFill aria-hidden className="shrink-0" />
                {t('contact-volunteers-badge')}
              </span>
              <h2>{t('contact-site-title')}</h2>
            </div>
            <p>{t('contact-site-desc')}</p>
          </div>
          <div className="grid gap-md md:grid-cols-2">
            <a
              href="mailto:volunteer@betterbukidnon.org"
              className={`${card} flex items-start gap-sm`}
            >
              <div>
                <EnvelopeFill aria-hidden className="shrink-0 text-primary" />
              </div>{' '}
              <div>
                <h3>{t('contact-volunteer-team')}</h3>
                <p>volunteer@betterbukidnon.org</p>
                <span className="block text-sm text-text-light">
                  {t('contact-volunteer-reply')}
                </span>
              </div>
            </a>
            <a
              href="https://github.com/Better-Bukidnon/betterbukidnon"
              target="_blank"
              rel="noopener noreferrer"
              className={`${card} flex items-start gap-sm`}
            >
              <div>
                <Github aria-hidden className="shrink-0 text-primary" />
              </div>{' '}
              <div>
                <h3>{t('contact-source-code')}</h3>
                <p>github.com/Better-Bukidnon/betterbukidnon</p>
                <span className="block text-sm text-text-light">{t('contact-github-note')}</span>
              </div>
            </a>
          </div>
        </section>
      </div>
    </>
  );
}
