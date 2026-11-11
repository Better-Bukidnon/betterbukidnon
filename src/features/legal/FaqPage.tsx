'use client';

import Link from 'next/link';
import { ChatDotsFill } from 'react-bootstrap-icons';
import { useT } from '@/features/i18n/useT';
import { legalDictionary } from '@/features/legal/legalDictionary';
import { prose } from '@/features/legal/prose';
import { PageHero } from '@/shared/PageHero';
import { buttonPrimary, card, section } from '@/shared/ui';

export function FaqPage() {
  const t = useT(legalDictionary);
  return (
    <>
      <PageHero
        crumbs={[{ label: t('faq-home'), href: '/' }, { label: 'FAQ' }]}
        title={t('faq-title')}
        description={t('faq-subtitle')}
      />
      <div className={prose}>
        <section className={section}>
          <div>
            <div className="mb-lg">
              <h2>{t('faq-general')}</h2>
              <div className="divide-y divide-black/10 overflow-hidden rounded-base border border-black/10 bg-bg">
                <details className="group px-md py-xs">
                  <summary>{t('faq-q-what-is')}</summary>
                  <div>
                    <p>
                      {t('faq-a-what-is')}{' '}
                      <a href="https://bukidnon.gov.ph/" target="_blank" rel="noopener noreferrer">
                        bukidnon.gov.ph
                      </a>
                      .
                    </p>
                  </div>
                </details>
                <details className="group px-md py-xs">
                  <summary>{t('faq-q-governor')}</summary>
                  <div>
                    <p>{t('faq-a-governor')}</p>
                    <p>
                      <Link href="/government/officials">{t('faq-see-officials')}</Link>
                    </p>
                  </div>
                </details>
                <details className="group px-md py-xs">
                  <summary>{t('faq-q-contact-capitol')}</summary>
                  <div>
                    <p>{t('faq-a-contact-capitol')}</p>
                    <p>
                      <Link href="/contact">{t('faq-see-directory')}</Link>
                    </p>
                  </div>
                </details>
                <details className="group px-md py-xs">
                  <summary>{t('faq-q-who-handles')}</summary>
                  <div>
                    <p>{t('faq-a-who-handles')}</p>
                    <p>
                      <Link href="/government#lgus">{t('faq-see-lgus')}</Link>
                    </p>
                  </div>
                </details>
                <details className="group px-md py-xs">
                  <summary>{t('faq-can-i-request-services-online')}</summary>
                  <div>
                    <p>{t('faq-currently-most-services-require-inperson')}</p>
                  </div>
                </details>
              </div>
            </div>
            <div className="mb-lg">
              <h2>{t('faq-cat-certificates')}</h2>
              <div className="divide-y divide-black/10 overflow-hidden rounded-base border border-black/10 bg-bg">
                <details className="group px-md py-xs">
                  <summary>{t('faq-q-birth-certificate')}</summary>
                  <div>
                    <p>{t('faq-a-birth-certificate')}</p>
                    <p>
                      <Link href="/service-details/birth-certificate">
                        {t('faq-see-birth-guide')}
                      </Link>
                    </p>
                  </div>
                </details>
                <details className="group px-md py-xs">
                  <summary>{t('faq-can-someone-else-request-my-certificate-for-me')}</summary>
                  <div>
                    <p>{t('faq-yes-but-they-must-bring')}</p>
                    <ul>
                      <li>{t('faq-an-authorization-letter-signed-by-you')}</li>
                      <li>{t('faq-valid-id-of-both-you-and-the-representative')}</li>
                      <li>{t('faq-photocopy-of-your-valid-id')}</li>
                    </ul>
                    <p>{t('faq-a-representative-note')}</p>
                  </div>
                </details>
                <details className="group px-md py-xs">
                  <summary>{t('faq-what-is-the-difference-between-psa-and-local')}</summary>
                  <div>
                    <p>{t('faq-both-are-certified-true-copies-psa-certificates')}</p>
                  </div>
                </details>
              </div>
            </div>
            <div className="mb-lg">
              <h2>{t('faq-cat-business')}</h2>
              <div className="divide-y divide-black/10 overflow-hidden rounded-base border border-black/10 bg-bg">
                <details className="group px-md py-xs">
                  <summary>{t('faq-q-business-permit')}</summary>
                  <div>
                    <p>{t('faq-a-business-permit')}</p>
                    <p>
                      <Link href="/service-details/business-permits-licensing">
                        {t('faq-see-business-guide')}
                      </Link>
                    </p>
                  </div>
                </details>
                <details className="group px-md py-xs">
                  <summary>{t('faq-what-do-i-need-to-start-a-new-business-in-bukidnon')}</summary>
                  <div>
                    <p>{t('faq-to-start-a-new-business-youll-need')}</p>
                    <ul>
                      <li>{t('faq-dti-registration-for-sole-proprietorship-or-sec')}</li>
                      <li>{t('faq-barangay-clearance')}</li>
                      <li>{t('faq-community-tax-certificate-cedula')}</li>
                      <li>{t('faq-location-sketchmap')}</li>
                      <li>{t('faq-contract-of-lease')}</li>
                    </ul>
                    <p>{t('faq-a-business-confirm')}</p>
                  </div>
                </details>
              </div>
            </div>
            <div className="mb-lg">
              <h2>{t('faq-payments')}</h2>
              <div className="divide-y divide-black/10 overflow-hidden rounded-base border border-black/10 bg-bg">
                <details className="group px-md py-xs">
                  <summary>{t('faq-how-can-i-pay-my-real-property-tax')}</summary>
                  <div>
                    <p>{t('faq-a-rpt')}</p>
                    <p>{t('faq-a-rpt-discount')}</p>
                    <p>
                      <Link href="/service-details/provincial-treasurer">
                        {t('faq-see-treasurer')}
                      </Link>
                    </p>
                  </div>
                </details>
                <details className="group px-md py-xs">
                  <summary>{t('faq-what-payment-methods-are-accepted')}</summary>
                  <div>
                    <p>{t('faq-currently-we-accept-cash-payments-at-the')}</p>
                  </div>
                </details>
              </div>
            </div>
            <div className="mb-lg">
              <h2>{t('faq-social')}</h2>
              <div className="divide-y divide-black/10 overflow-hidden rounded-base border border-black/10 bg-bg">
                <details className="group px-md py-xs">
                  <summary>{t('faq-how-do-i-apply-for-a-senior-citizen-id')}</summary>
                  <div>
                    <p>{t('faq-go-to-the-provincial-social-welfare-and')}</p>
                    <ul>
                      <li>{t('faq-birth-certificate-or-any-valid-id-showing-your')}</li>
                      <li>{t('faq-id-photo')}</li>
                      <li>{t('faq-barangay-residence-certificate')}</li>
                    </ul>
                    <p>{t('faq-the-id-is-issued-for-free')}</p>
                  </div>
                </details>
                <details className="group px-md py-xs">
                  <summary>{t('faq-what-benefits-do-senior-citizens-receive')}</summary>
                  <div>
                    <p>{t('faq-senior-citizens-enjoy-20-discount-and-vat')}</p>
                  </div>
                </details>
                <details className="group px-md py-xs">
                  <summary>{t('faq-q-assistance')}</summary>
                  <div>
                    <p>{t('faq-a-assistance')}</p>
                    <p>
                      <Link href="/service-details/pswdo">{t('faq-see-pswdo')}</Link>
                    </p>
                  </div>
                </details>
              </div>
            </div>
            <div className="mb-lg">
              <h2>{t('faq-technical')}</h2>
              <div className="divide-y divide-black/10 overflow-hidden rounded-base border border-black/10 bg-bg">
                <details className="group px-md py-xs">
                  <summary>{t('faq-q-volunteer')}</summary>
                  <div>
                    <p>
                      {t('faq-a-volunteer-1')}{' '}
                      <a href="mailto:volunteer@betterbukidnon.org">
                        {t('faq-volunteerbetterbukidnonorg')}
                      </a>{' '}
                      {t('faq-a-volunteer-2')}
                    </p>
                    <p>
                      <a
                        href="https://github.com/Better-Bukidnon/betterbukidnon"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {t('faq-see-github')}
                      </a>
                    </p>
                  </div>
                </details>
                <details className="group px-md py-xs">
                  <summary>{t('faq-q-languages')}</summary>
                  <div>
                    <p>{t('faq-a-languages')}</p>
                  </div>
                </details>
                <details className="group px-md py-xs">
                  <summary>{t('faq-i-found-a-broken-link-or-error-on-this-website')}</summary>
                  <div>
                    <p>
                      {t('faq-a-report-1')}{' '}
                      <a href="mailto:volunteer@betterbukidnon.org">
                        {t('faq-volunteerbetterbukidnonorg')}
                      </a>{' '}
                      {t('faq-a-report-2')}
                    </p>
                  </div>
                </details>
                <details className="group px-md py-xs">
                  <summary>{t('faq-is-this-website-mobilefriendly')}</summary>
                  <div>
                    <p>{t('faq-yes-better-bukidnon-is-fully-responsive-and')}</p>
                  </div>
                </details>
                <details className="group px-md py-xs">
                  <summary>{t('faq-who-developed-better-bukidnon')}</summary>
                  <div>
                    <p>
                      {t('faq-a-who-built-1')}{' '}
                      <a href="https://ramonloganjr.com/" target="_blank" rel="noopener noreferrer">
                        {t('faq-ramon-logan-jr')}
                      </a>
                      {t('faq-a-who-built-2')}
                    </p>
                    <p>{t('faq-a-who-built-3')}</p>
                  </div>
                </details>
              </div>
            </div>
            <div className={`${card} flex items-start gap-sm`}>
              <ChatDotsFill aria-hidden className="shrink-0 text-primary" />
              <div>
                <h3>{t('faq-still-questions')}</h3>
                <p>{t('faq-contact-help')}</p>
              </div>
              <Link href="/contact" className={buttonPrimary}>
                {t('faq-contact-us')}
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
