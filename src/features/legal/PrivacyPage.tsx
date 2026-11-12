'use client';

import {
  Building,
  EnvelopeFill,
  Gear,
  InfoCircle,
  ListUl,
  PersonCheck,
  ShieldCheck,
} from 'react-bootstrap-icons';
import { useT } from '@/features/i18n/useT';
import { legalDictionary } from '@/features/legal/legalDictionary';
import { prose } from '@/features/legal/prose';
import { PageHero } from '@/shared/PageHero';
import { card, section } from '@/shared/ui';

export function PrivacyPage() {
  const t = useT(legalDictionary);
  return (
    <>
      <PageHero
        crumbs={[{ label: t('privacy-home'), href: '/' }, { label: t('privacy-privacy-policy') }]}
        title={t('privacy-privacy-policy')}
        description={t('privacy-how-we-collect-use-and-protect-your-information')}
      />
      <div className={prose}>
        <section className={section}>
          <div className="grid gap-lg lg:grid-cols-[16rem_1fr]">
            <aside className={`${card} self-start lg:sticky lg:top-md`}>
              <h4>
                <ListUl aria-hidden className="shrink-0 text-primary" /> {t('privacy-contents')}
              </h4>
              <nav aria-label="Privacy policy sections">
                <a href="#introduction">{t('privacy-introduction')}</a>
                <a href="#legal-basis">{t('privacy-legal-basis')}</a>
                <a href="#information-collected">{t('privacy-information-we-collect')}</a>
                <a href="#how-we-use">{t('privacy-how-we-use-information')}</a>
                <a href="#cookies">{t('privacy-cookies-analytics')}</a>
                <a href="#third-party-services">{t('privacy-toc-third-party-services')}</a>
                <a href="#data-sharing">{t('privacy-data-sharing')}</a>
                <a href="#data-security">{t('privacy-data-security')}</a>
                <a href="#data-retention">{t('privacy-data-retention')}</a>
                <a href="#your-rights">{t('privacy-your-rights')}</a>
                <a href="#childrens-privacy">{t('privacy-childrens-privacy')}</a>
                <a href="#third-party">{t('privacy-thirdparty-links')}</a>
                <a href="#changes">{t('privacy-policy-changes')}</a>
                <a href="#contact">{t('privacy-contact-us')}</a>
              </nav>
            </aside>
            <article>
              <section id="introduction" className="mb-lg scroll-mt-md">
                <h2>{t('privacy-introduction')}</h2>
                <p>{t('privacy-betterbukidnonorg-we-us-or-our-is-committed-to')}</p>
                <p>
                  {t('privacy-policy-designed-to-comply')}{' '}
                  <strong>{t('privacy-data-privacy-act-of-2012-republic-act-no-10173')}</strong>{' '}
                  {t('privacy-of-the-philippines-and-its-irr')}
                </p>
                <div className="mb-md flex gap-sm rounded-base border-l-4 border-primary bg-bg-alt p-md">
                  <ShieldCheck aria-hidden className="shrink-0 text-primary" />
                  {t('privacy-summary')}
                </div>
              </section>
              <section id="legal-basis" className="mb-lg scroll-mt-md">
                <h2>{t('privacy-legal-basis-for-processing')}</h2>
                <p>{t('privacy-under-the-data-privacy-act-of-2012-we-process')}</p>
                <ul>
                  <li>
                    <strong>{t('privacy-consent')}</strong> {t('privacy-basis-consent')}
                  </li>
                  <li>
                    <strong>{t('privacy-legitimate-interest')}</strong>{' '}
                    {t('privacy-basis-legitimate-interest')}
                  </li>
                  <li>
                    <strong>{t('privacy-legal-obligation')}</strong>{' '}
                    {t('privacy-basis-legal-obligation')}
                  </li>
                  <li>
                    <strong>{t('privacy-public-interest')}</strong>{' '}
                    {t('privacy-basis-public-interest')}
                  </li>
                </ul>
              </section>
              <section id="information-collected" className="mb-lg scroll-mt-md">
                <h2>{t('privacy-information-we-collect')}</h2>
                <p>{t('privacy-we-collect-minimal-information-necessary-to')}</p>
                <h3>{t('privacy-information-you-provide-voluntarily')}</h3>
                <ul>
                  <li>{t('privacy-email-address-when-you-contact-us-or-submit')}</li>
                  <li>{t('privacy-name-if-provided-in-correspondence')}</li>
                  <li>{t('privacy-message-content-and-inquiries')}</li>
                </ul>
                <h3>{t('privacy-information-collected-automatically')}</h3>
                <p>{t('privacy-auto-collected-text')}</p>
                <div className="mb-md flex gap-sm rounded-base border-l-4 border-primary bg-bg-alt p-md">
                  <InfoCircle aria-hidden className="shrink-0 text-primary" />
                  <p>{t('privacy-no-sensitive-info')}</p>
                </div>
              </section>
              <section id="how-we-use" className="mb-lg scroll-mt-md">
                <h2>{t('privacy-how-we-use-your-information')}</h2>
                <p>{t('privacy-we-use-the-information-we-collect-for-the')}</p>
                <ul>
                  <li>{t('privacy-to-respond-to-your-inquiries-and-feedback')}</li>
                  <li>{t('privacy-to-improve-website-functionality-and-user')}</li>
                  <li>{t('privacy-to-ensure-website-security-and-prevent-abuse')}</li>
                  <li>{t('privacy-to-comply-with-legal-obligations')}</li>
                  <li>{t('privacy-to-maintain-and-improve-civic-services-information')}</li>
                </ul>
              </section>
              <section id="cookies" className="mb-lg scroll-mt-md">
                <h2>{t('privacy-cookies-and-analytics')}</h2>
                <p>{t('privacy-we-use-cookies-and-similar-technologies-to')}</p>
                <h3>{t('privacy-types-of-cookies-we-use')}</h3>
                <ul>
                  <li>{t('privacy-storage-language')}</li>
                  <li>{t('privacy-storage-cache')}</li>
                  <li>{t('privacy-storage-session')}</li>
                  <li>{t('privacy-storage-offline')}</li>
                </ul>
                <p>{t('privacy-storage-not-sent')}</p>
                <div className="mb-md flex gap-sm rounded-base border-l-4 border-primary bg-bg-alt p-md">
                  <h4>
                    <Gear aria-hidden className="shrink-0 text-primary" />{' '}
                    {t('privacy-managing-cookies')}
                  </h4>
                  <ul>
                    <li>{t('privacy-you-can-disable-cookies-through-your-browser')}</li>
                    <li>{t('privacy-disabling-cookies-may-affect-some-website')}</li>
                  </ul>
                </div>
              </section>
              <section id="third-party-services" className="mb-lg scroll-mt-md">
                <h2>{t('privacy-third-party-services')}</h2>
                <p>{t('privacy-hosting-text')}</p>
                <p>{t('privacy-third-party-intro')}</p>
                <ul>
                  <li>{t('privacy-tp-maps')}</li>
                  <li>{t('privacy-tp-weather')}</li>
                  <li>{t('privacy-tp-facebook')}</li>
                </ul>
                <p>{t('privacy-tp-policies')}</p>
              </section>
              <section id="data-sharing" className="mb-lg scroll-mt-md">
                <h2>{t('privacy-data-sharing-and-disclosure')}</h2>
                <p>{t('privacy-we-do-not-sell-trade-or-rent-your-personal')}</p>
                <ul>
                  <li>
                    <strong>{t('privacy-service-providers')}</strong>{' '}
                    {t('privacy-sharing-service-providers')}
                  </li>
                  <li>
                    <strong>{t('privacy-legal-requirements')}</strong> {t('privacy-sharing-legal')}
                  </li>
                  <li>
                    <strong>{t('privacy-protection-of-rights')}</strong>{' '}
                    {t('privacy-sharing-protection')}
                  </li>
                  <li>
                    <strong>{t('privacy-consent')}</strong> {t('privacy-sharing-consent')}
                  </li>
                </ul>
              </section>
              <section id="data-security" className="mb-lg scroll-mt-md">
                <h2>{t('privacy-data-security')}</h2>
                <p>{t('privacy-we-implement-appropriate-technical-and')}</p>
                <ul>
                  <li>{t('privacy-ssltls-encryption-for-data-transmission')}</li>
                  <li>{t('privacy-secure-hosting-infrastructure')}</li>
                  <li>{t('privacy-access-controls-and-authentication')}</li>
                  <li>{t('privacy-regular-software-updates-and-patches')}</li>
                </ul>
                <p>{t('privacy-while-we-strive-to-protect-your-information-no')}</p>
              </section>
              <section id="data-retention" className="mb-lg scroll-mt-md">
                <h2>{t('privacy-data-retention')}</h2>
                <p>{t('privacy-we-retain-personal-information-only-for-as-long')}</p>
                <ul>
                  <li>
                    <strong>{t('privacy-contact-information')}</strong>{' '}
                    {t('privacy-retention-contact')}
                  </li>
                  <li>
                    <strong>{t('privacy-server-logs')}</strong> {t('privacy-retention-logs')}
                  </li>
                  <li>
                    <strong>{t('privacy-device-data')}</strong> {t('privacy-retention-device')}
                  </li>
                </ul>
              </section>
              <section id="your-rights" className="mb-lg scroll-mt-md">
                <h2>{t('privacy-your-rights-under-the-data-privacy-act')}</h2>
                <p>{t('privacy-under-the-data-privacy-act-of-2012-you-have-the')}</p>
                <ul>
                  <li>
                    <strong>{t('privacy-right-to-be-informed')}</strong> To be informed of the
                    collection and processing of your personal data
                  </li>
                  <li>
                    <strong>{t('privacy-right-to-access')}</strong> To request access to your
                    personal data held by us
                  </li>
                  <li>
                    <strong>{t('privacy-right-to-object')}</strong> To object to the processing of
                    your personal data
                  </li>
                  <li>
                    <strong>{t('privacy-right-to-erasure-or-blocking')}</strong> To request deletion
                    or blocking of your personal data
                  </li>
                  <li>
                    <strong>{t('privacy-right-to-rectification')}</strong> To request correction of
                    inaccurate or incomplete personal data
                  </li>
                  <li>
                    <strong>{t('privacy-right-to-data-portability')}</strong> To obtain your
                    personal data in a structured, commonly used format
                  </li>
                  <li>
                    <strong>{t('privacy-right-to-file-a-complaint')}</strong> To file a complaint
                    with the National Privacy Commission (NPC)
                  </li>
                  <li>
                    <strong>{t('privacy-right-to-damages')}</strong> To be indemnified for damages
                    sustained due to inaccurate, incomplete, outdated, false, unlawfully obtained,
                    or unauthorized use of personal data
                  </li>
                </ul>
                <div className="mb-md flex gap-sm rounded-base border-l-4 border-primary bg-bg-alt p-md">
                  <h4>
                    <PersonCheck aria-hidden className="shrink-0 text-primary" />{' '}
                    {t('privacy-exercising-your-rights')}
                  </h4>
                  <p>
                    {t('privacy-exercise-rights-1')}{' '}
                    <a href="mailto:volunteer@betterbukidnon.org">
                      {t('privacy-volunteerbetterbukidnonorg')}
                    </a>
                    . {t('privacy-exercise-rights-2')}
                  </p>
                </div>
              </section>
              <section id="childrens-privacy" className="mb-lg scroll-mt-md">
                <h2>{t('privacy-childrens-privacy')}</h2>
                <p>{t('privacy-betterbukidnonorg-is-a-general-audience-website')}</p>
                <p>
                  {t('privacy-children-contact-1')}{' '}
                  <a href="mailto:volunteer@betterbukidnon.org">
                    {t('privacy-volunteerbetterbukidnonorg')}
                  </a>
                  {t('privacy-children-contact-2')}
                </p>
              </section>
              <section id="third-party" className="mb-lg scroll-mt-md">
                <h2>{t('privacy-thirdparty-links')}</h2>
                <p>{t('privacy-our-website-may-contain-links-to-external')}</p>
                <p>{t('privacy-we-encourage-you-to-review-the-privacy-policies')}</p>
              </section>
              <section id="changes" className="mb-lg scroll-mt-md">
                <h2>{t('privacy-changes-to-this-privacy-policy')}</h2>
                <p>{t('privacy-we-may-update-this-privacy-policy-from-time-to')}</p>
                <ul>
                  <li>{t('privacy-the-last-updated-date-at-the-bottom-of-this-page')}</li>
                  <li>{t('privacy-material-changes-may-be-announced-on-our-website')}</li>
                  <li>{t('privacy-your-continued-use-of-the-website-after-changes')}</li>
                </ul>
              </section>
              <section id="contact" className="mb-lg scroll-mt-md">
                <h2>{t('privacy-contact-us')}</h2>
                <p>{t('privacy-if-you-have-questions-about-this-privacy-policy')}</p>
                <div className={`${card} flex items-start gap-sm`}>
                  <a href="mailto:volunteer@betterbukidnon.org">
                    <EnvelopeFill aria-hidden className="shrink-0 text-primary" />{' '}
                    {t('privacy-volunteerbetterbukidnonorg')}
                  </a>
                </div>
                <h3>{t('privacy-national-privacy-commission')}</h3>
                <p>{t('privacy-you-may-also-file-a-complaint-with-the-national')}</p>
                <div className="mb-md flex gap-sm rounded-base border-l-4 border-primary bg-bg-alt p-md">
                  <Building aria-hidden className="shrink-0 text-primary" />
                  <p>
                    <strong>{t('privacy-national-privacy-commission')}</strong>
                    <br />{' '}
                    <a href="https://www.privacy.gov.ph" target="_blank" rel="noopener noreferrer">
                      www.privacy.gov.ph
                    </a>
                  </p>
                </div>
                <p>{t('privacy-last-updated')}</p>
              </section>
            </article>
          </div>
        </section>
      </div>
    </>
  );
}
