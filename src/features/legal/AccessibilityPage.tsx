'use client';

import {
  CheckCircleFill,
  EnvelopeFill,
  ExclamationCircle,
  Eye,
  HeartFill,
  Keyboard,
  Palette,
  Phone,
  TelephoneFill,
  Translate,
  Type,
} from 'react-bootstrap-icons';
import { useT } from '@/features/i18n/useT';
import { legalDictionary } from '@/features/legal/legalDictionary';
import { prose } from '@/features/legal/prose';
import { PageHero } from '@/shared/PageHero';
import { card, section } from '@/shared/ui';

export function AccessibilityPage() {
  const t = useT(legalDictionary);
  return (
    <>
      <PageHero
        crumbs={[{ label: t('a11y-home'), href: '/' }, { label: 'Accessibility' }]}
        title={t('access-title')}
        description={t('access-subtitle')}
      />
      <div className={prose}>
        <section className={section}>
          <div>
            <div>
              <div className="mb-md flex gap-sm rounded-base border-l-4 border-primary bg-bg-alt p-md">
                <CheckCircleFill aria-hidden className="shrink-0 text-primary" />
                <div>
                  <span className="block">{t('a11y-wcag-21-level-aa')}</span>
                  {t('a11y-target')}
                </div>
              </div>
            </div>
            <div className="mb-lg">
              <h2>{t('access-commitment')}</h2>
              <p>{t('a11y-better-bukidnon-is-committed-to-ensuring-digital')}</p>
            </div>
            <div className="mb-lg">
              <h2>{t('access-features')}</h2>
              <div className="grid gap-md sm:grid-cols-2 lg:grid-cols-3">
                <div className={card}>
                  <Keyboard aria-hidden className="shrink-0 text-primary" />
                  <h3>{t('a11y-keyboard-navigation')}</h3>
                  <p>{t('a11y-all-functionality-available-using-only-a-keyboard')}</p>
                </div>
                <div className={card}>
                  <Eye aria-hidden className="shrink-0 text-primary" />
                  <h3>{t('a11y-screen-reader-support')}</h3>
                  <p>{t('a11y-compatible-with-jaws-nvda-and-voiceover')}</p>
                </div>
                <div className={card}>
                  <Type aria-hidden className="shrink-0 text-primary" />
                  <h3>{t('a11y-text-alternatives')}</h3>
                  <p>{t('a11y-all-images-have-descriptive-alt-text')}</p>
                </div>
                <div className={card}>
                  <Palette aria-hidden className="shrink-0 text-primary" />
                  <h3>{t('a11y-color-contrast')}</h3>
                  <p>{t('a11y-meets-wcag-aa-contrast-requirements')}</p>
                </div>
                <div className={card}>
                  <Phone aria-hidden className="shrink-0 text-primary" />
                  <h3>{t('a11y-responsive-design')}</h3>
                  <p>{t('a11y-works-on-all-devices-and-screen-sizes')}</p>
                </div>
                <div className={card}>
                  <Translate aria-hidden className="shrink-0 text-primary" />
                  <h3>{t('a11y-three-languages')}</h3>
                  <p>{t('a11y-three-languages-desc')}</p>
                </div>
              </div>
            </div>
            <div className="mb-lg">
              <h2>{t('access-limitations')}</h2>
              <ul>
                <li>
                  <ExclamationCircle aria-hidden className="shrink-0 text-primary" />{' '}
                  {t('a11y-some-pdf-documents-may-not-be-fully-accessible-to')}
                </li>
                <li>
                  <ExclamationCircle aria-hidden className="shrink-0 text-primary" />{' '}
                  {t('a11y-some-thirdparty-embedded-content-may-have')}
                </li>
                <li>
                  <ExclamationCircle aria-hidden className="shrink-0 text-primary" />{' '}
                  {t('a11y-limit-maps')}
                </li>
                <li>
                  <ExclamationCircle aria-hidden className="shrink-0 text-primary" />{' '}
                  {t('a11y-limit-translations')}
                </li>
              </ul>
            </div>
            <div className="mb-lg">
              <h2>{t('access-alternative')}</h2>
              <p>{t('a11y-if-you-encounter-difficulty-accessing-any')}</p>
              <div className="grid gap-sm sm:grid-cols-2">
                <a
                  href="mailto:volunteer@betterbukidnon.org"
                  className={`${card} flex items-start gap-sm`}
                >
                  <EnvelopeFill aria-hidden className="shrink-0 text-primary" />{' '}
                  {t('a11y-volunteerbetterbukidnonorg')}
                </a>
                <a href="tel:+63888135741" className={`${card} flex items-start gap-sm`}>
                  <TelephoneFill aria-hidden className="shrink-0 text-primary" />{' '}
                  {t('a11y-capitol-phone')}
                </a>
              </div>
              <p>{t('a11y-alt-capitol')}</p>
            </div>
            <div className="mb-lg">
              <h2>{t('access-technical')}</h2>
              <div className="flex flex-wrap gap-xs">
                <span className="rounded-sm bg-bg-alt px-3 py-1 text-sm">{t('a11y-html5')}</span>
                <span className="rounded-sm bg-bg-alt px-3 py-1 text-sm">{t('a11y-css3')}</span>
                <span className="rounded-sm bg-bg-alt px-3 py-1 text-sm">
                  {t('a11y-javascript')}
                </span>
                <span className="rounded-sm bg-bg-alt px-3 py-1 text-sm">ARIA</span>
              </div>
            </div>
            <div className="mb-md flex gap-sm rounded-base border-l-4 border-primary bg-bg-alt p-md">
              <HeartFill aria-hidden className="shrink-0 text-primary" />
              <div>
                <h3>{t('access-promise')}</h3>
                <p>{t('a11y-better-bukidnon-is-committed-to-ensuring-that-our')}</p>
              </div>
            </div>
            <p className="text-sm text-text-light">{t('a11y-last-updated')}</p>
          </div>
        </section>
      </div>
    </>
  );
}
