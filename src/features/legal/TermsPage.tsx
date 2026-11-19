'use client';

import {
  Envelope,
  EnvelopeFill,
  HeartFill,
  InfoCircle,
  Lightbulb,
  ListUl,
} from 'react-bootstrap-icons';
import { useT } from '@/features/i18n/useT';
import { legalDictionary } from '@/features/legal/legalDictionary';
import { prose } from '@/features/legal/prose';
import { PageHero } from '@/shared/PageHero';
import { card, section } from '@/shared/ui';

export function TermsPage() {
  const t = useT(legalDictionary);
  return (
    <>
      <PageHero
        crumbs={[{ label: t('terms-home'), href: '/' }, { label: 'Terms of Use' }]}
        title={t('terms-terms-of-use')}
        description={t('terms-guidelines-for-using-betterbukidnonorg')}
      />
      <div className={prose}>
        <section className={section}>
          <div className="grid gap-lg lg:grid-cols-[16rem_1fr]">
            <aside className={`${card} self-start lg:sticky lg:top-md`}>
              <h4>
                <ListUl aria-hidden className="shrink-0 text-primary" /> {t('terms-contents')}
              </h4>
              <nav>
                <a href="#introduction">{t('terms-introduction')}</a>
                <a href="#acceptance">{t('terms-acceptance-of-terms')}</a>
                <a href="#public-domain">{t('terms-public-domain-content')}</a>
                <a href="#disclaimer">{t('terms-as-is-disclaimer')}</a>
                <a href="#limitation">{t('terms-limitation-of-liability')}</a>
                <a href="#responsibilities">{t('terms-user-responsibilities')}</a>
                <a href="#no-advice">{t('terms-no-professional-advice')}</a>
                <a href="#external-links">{t('terms-external-references')}</a>
                <a href="#availability">{t('terms-website-availability')}</a>
                <a href="#indemnification">{t('terms-indemnification')}</a>
                <a href="#modifications">{t('terms-modifications')}</a>
                <a href="#governing-law">{t('terms-governing-law')}</a>
                <a href="#severability">{t('terms-severability')}</a>
                <a href="#takedown">{t('terms-content-concerns')}</a>
                <a href="#contact">{t('terms-contact-information')}</a>
              </nav>
            </aside>
            <article>
              <section id="introduction" className="mb-lg scroll-mt-md">
                <h2>{t('terms-introduction')}</h2>
                <p>{t('terms-betterbukidnonorg-is-a-civic-platform-dedicated-to')}</p>
                <p>{t('terms-while-volunteers-make-every-effort-to-secure')}</p>
                <div className="mb-md flex gap-sm rounded-base border-l-4 border-primary bg-bg-alt p-md">
                  <HeartFill aria-hidden className="shrink-0 text-primary" />
                  This platform is provided <strong>{t('terms-free-of-charge')}</strong> as a public
                  service.
                </div>
              </section>
              <section id="acceptance" className="mb-lg scroll-mt-md">
                <h2>{t('terms-acceptance-of-terms')}</h2>
                <p>{t('terms-by-accessing-and-using-this-website-you')}</p>
              </section>
              <section id="public-domain" className="mb-lg scroll-mt-md">
                <h2>{t('terms-public-domain-content-and-volunteer-operation')}</h2>
                <p>{t('terms-this-website-and-its-content-are-provided-as-a')}</p>
                <p>{t('terms-public-domain-content-may-be-freely-used-copied')}</p>
                <div className="mb-md flex gap-sm rounded-base border-l-4 border-primary bg-bg-alt p-md">
                  <InfoCircle aria-hidden className="shrink-0 text-primary" />
                  <p>{t('terms-as-a-volunteerrun-initiative-this-website-does')}</p>
                </div>
              </section>
              <section id="disclaimer" className="mb-lg scroll-mt-md">
                <h2>{t('terms-as-is-disclaimer')}</h2>
                <p>{t('terms-all-information-on-this-website-is-provided-as-is')}</p>
                <ul>
                  <li>{t('terms-warranties-of-merchantability')}</li>
                  <li>{t('terms-fitness-for-a-particular-purpose')}</li>
                  <li>{t('terms-noninfringement-of-intellectual-property-rights')}</li>
                  <li>{t('terms-accuracy-completeness-or-reliability-of')}</li>
                  <li>{t('terms-freedom-from-errors-viruses-or-other-harmful')}</li>
                </ul>
                <p>{t('terms-users-should-treat-all-content-as-informational')}</p>
              </section>
              <section id="limitation" className="mb-lg scroll-mt-md">
                <h2>{t('terms-limitation-of-liability')}</h2>
                <p>{t('terms-to-the-fullest-extent-permitted-by-law-the')}</p>
                <ul>
                  <li>{t('terms-your-use-of-or-reliance-on-this-website-or-its')}</li>
                  <li>{t('terms-any-errors-omissions-or-outdated-information')}</li>
                  <li>{t('terms-any-interruption-suspension-or-cessation-of')}</li>
                  <li>{t('terms-any-bugs-viruses-or-other-harmful-components')}</li>
                  <li>{t('terms-any-loss-corruption-or-disclosure-of-data-or')}</li>
                </ul>
                <p>{t('terms-this-limitation-applies-regardless-of-the-form-of')}</p>
              </section>
              <section id="responsibilities" className="mb-lg scroll-mt-md">
                <h2>{t('terms-user-responsibilities-and-research-guidelines')}</h2>
                <p>{t('terms-users-share-responsibility-for-promoting-informed')}</p>
                <ul>
                  <li>{t('terms-independently-verifying-all-information-obtained')}</li>
                  <li>{t('terms-reviewing-and-visiting-original-source-links-and')}</li>
                  <li>{t('terms-crosschecking-information-with-multiple-reliable')}</li>
                  <li>{t('terms-determining-whether-the-information-is-suitable')}</li>
                  <li>{t('terms-complying-with-all-applicable-laws-regulations')}</li>
                  <li>{t('terms-accepting-any-consequences-that-may-arise-from')}</li>
                </ul>
                <div className="mb-md flex gap-sm rounded-base border-l-4 border-primary bg-bg-alt p-md">
                  <h4>
                    <Lightbulb aria-hidden className="shrink-0 text-primary" />{' '}
                    {t('terms-you-are-strongly-encouraged-to')}
                  </h4>
                  <ul>
                    <li>{t('terms-use-the-source-links-and-references-on-each-page')}</li>
                    <li>{t('terms-conduct-additional-research-beyond-what-is')}</li>
                    <li>{t('terms-consult-official-government-websites-offices-and')}</li>
                    <li>{t('terms-verify-dates-figures-and-other-details-through')}</li>
                  </ul>
                </div>
              </section>
              <section id="no-advice" className="mb-lg scroll-mt-md">
                <h2>{t('terms-no-professional-advice')}</h2>
                <p>{t('terms-the-information-on-this-website-is-provided-for')}</p>
                <p>{t('terms-users-should-consult-qualified-professionals-or')}</p>
              </section>
              <section id="external-links" className="mb-lg scroll-mt-md">
                <h2>{t('terms-source-links-and-external-references')}</h2>
                <p>{t('terms-this-website-may-provide-links-to-official')}</p>
                <ul>
                  <li>{t('terms-click-through-and-review-all-source-links-provided')}</li>
                  <li>{t('terms-access-primary-documents-and-official')}</li>
                  <li>{t('terms-verify-information-directly-from-original-and')}</li>
                  <li>{t('terms-check-for-updates-amendments-or-corrections-to')}</li>
                </ul>
                <p>{t('terms-the-continued-availability-accuracy-and')}</p>
              </section>
              <section id="availability" className="mb-lg scroll-mt-md">
                <h2>{t('terms-website-availability')}</h2>
                <p>{t('terms-although-volunteers-aim-to-keep-the-website')}</p>
                <ul>
                  <li>{t('terms-available-or-accessible-at-all-times')}</li>
                  <li>{t('terms-errorfree-or-uninterrupted')}</li>
                  <li>{t('terms-free-from-technical-problems-vulnerabilities-or')}</li>
                  <li>{t('terms-fully-compatible-with-all-devices-browsers-or')}</li>
                </ul>
                <p>{t('terms-users-are-encouraged-to-report-technical-issues')}</p>
              </section>
              <section id="indemnification" className="mb-lg scroll-mt-md">
                <h2>{t('terms-indemnification')}</h2>
                <p>{t('terms-by-using-this-website-you-agree-to-indemnify-and')}</p>
              </section>
              <section id="modifications" className="mb-lg scroll-mt-md">
                <h2>{t('terms-modifications')}</h2>
                <p>{t('terms-these-terms-may-be-updated-or-modified-from-time')}</p>
              </section>
              <section id="governing-law" className="mb-lg scroll-mt-md">
                <h2>{t('terms-governing-law')}</h2>
                <p>{t('terms-these-terms-are-governed-by-and-construed-in')}</p>
              </section>
              <section id="severability" className="mb-lg scroll-mt-md">
                <h2>{t('terms-severability')}</h2>
                <p>{t('terms-if-any-provision-of-these-terms-is-found-to-be')}</p>
              </section>
              <section id="takedown" className="mb-lg scroll-mt-md">
                <h2>{t('terms-content-concerns-and-takedown-requests')}</h2>
                <p>{t('terms-betterbukidnonorg-values-accuracy-public-safety-and')}</p>
                <p>{t('terms-if-you-believe-that-any-content-on-this-website-is')}</p>
                <ul>
                  <li>{t('terms-factually-incorrect-or-misleading')}</li>
                  <li>{t('terms-potentially-harmful-or-dangerous')}</li>
                  <li>{t('terms-in-violation-of-applicable-laws-or-regulations')}</li>
                  <li>{t('terms-containing-personal-information-that-should-not')}</li>
                  <li>{t('terms-infringing-upon-legitimate-rights-or-interests')}</li>
                </ul>
                <p>
                  Please contact us at:{' '}
                  <a href="mailto:volunteer@betterbukidnon.org">
                    {t('terms-volunteerbetterbukidnonorg')}
                  </a>
                </p>
                <div className="mb-md flex gap-sm rounded-base border-l-4 border-primary bg-bg-alt p-md">
                  <h4>
                    <Envelope aria-hidden className="shrink-0 text-primary" />{' '}
                    {t('terms-when-reaching-out-kindly-include')}
                  </h4>
                  <ul>
                    <li>{t('terms-the-specific-url-or-page-location')}</li>
                    <li>{t('terms-a-clear-description-of-your-concern')}</li>
                    <li>{t('terms-supporting-documentation-or-evidence-where')}</li>
                    <li>{t('terms-your-contact-information-for-followup')}</li>
                  </ul>
                </div>
                <h3>{t('terms-our-response-process')}</h3>
                <ul>
                  <li>{t('terms-legitimate-concerns-will-be-reviewed-in-good')}</li>
                  <li>{t('terms-response-times-may-vary-due-to-the-volunteer')}</li>
                  <li>{t('terms-content-may-be-removed-corrected-updated-or')}</li>
                  <li>{t('terms-editorial-decisions-about-content-rest-with-the')}</li>
                  <li>{t('terms-knowingly-false-malicious-or-frivolous-complaints')}</li>
                </ul>
              </section>
              <section id="contact" className="mb-lg scroll-mt-md">
                <h2>{t('terms-contact-information')}</h2>
                <p>{t('terms-for-questions-about-these-terms-feedback-on-civic')}</p>
                <div className={`${card} flex items-start gap-sm`}>
                  <a href="mailto:volunteer@betterbukidnon.org">
                    <EnvelopeFill aria-hidden className="shrink-0 text-primary" />{' '}
                    {t('terms-volunteerbetterbukidnonorg')}
                  </a>
                </div>
                <p>{t('terms-betterbukidnonorg-provides-public-domain')}</p>
              </section>
            </article>
          </div>
        </section>
      </div>
    </>
  );
}
