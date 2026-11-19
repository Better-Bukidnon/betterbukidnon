'use client';

import { ArrowRight, InfoCircleFill, Telephone } from 'react-bootstrap-icons';
import { chromeDictionary } from '@/features/i18n/chromeDictionary';
import { useT } from '@/features/i18n/useT';
import { categories, type TemplateCategory } from '@/features/services/categories';
import { serviceIcons } from '@/features/services/serviceIcons';
import { servicesDictionary } from '@/features/services/servicesDictionary';
import { PageHero } from '@/shared/PageHero';
import { card, section, sectionTitle } from '@/shared/ui';

/** Template for every /services/<category> page: contacts, two card sections, then the source note. */
export function CategoryPage({ slug }: { slug: TemplateCategory }) {
  const nav = useT(chromeDictionary);
  const t = useT(servicesDictionary);
  const c = categories[slug];

  return (
    <>
      <PageHero
        crumbs={[
          { label: nav('nav-home'), href: '/' },
          { label: nav('nav-services'), href: '/services' },
          { label: t(c.crumb) },
        ]}
        title={t(c.title)}
        description={t(c.desc)}
      />

      {c.contacts.length > 0 && (
        <div className="mx-auto max-w-site px-sm pt-lg">
          <ul className="flex flex-wrap gap-sm">
            {c.contacts.map((x) => (
              <li key={x.href}>
                <a
                  href={x.href}
                  className={`${card} flex min-h-11 items-center gap-sm py-sm text-text no-underline hover:border-primary`}
                >
                  <Telephone aria-hidden className="text-xl text-primary" />
                  <span>
                    <strong className="block">{t(x.label)}</strong>
                    {t(x.value)}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {c.sections.map((s, i) => (
        <section key={s.title} className={i % 2 ? 'bg-bg-alt' : undefined}>
          <div className={section}>
            <h2 className={sectionTitle}>{t(s.title)}</h2>
            <p className="mb-md max-w-3xl text-text-light">{t(s.intro)}</p>
            <ul className="grid gap-md md:grid-cols-3">
              {s.cards.map((cardData) => {
                const Icon = serviceIcons[cardData.icon];
                return (
                  <li key={cardData.title} className={`${card} flex flex-col`}>
                    <h3 className="mb-xs flex items-center gap-xs text-lg font-semibold">
                      <Icon aria-hidden className="shrink-0 text-primary" /> {t(cardData.title)}
                    </h3>
                    <p className="mb-sm text-text-light">{t(cardData.text)}</p>
                    {cardData.link && (
                      <a
                        href={cardData.link.href}
                        className="mt-auto inline-flex min-h-11 items-center gap-xs font-semibold"
                      >
                        {t(cardData.link.label)} <ArrowRight aria-hidden />
                      </a>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      ))}

      <div className={section}>
        <p
          role="note"
          className="flex gap-xs rounded-base border-l-4 border-info bg-bg-alt p-md text-sm"
        >
          <InfoCircleFill aria-hidden className="mt-1 shrink-0 text-info" />
          <span>
            {t(c.note.text)}{' '}
            <a href={c.note.href} target="_blank" rel="noopener noreferrer">
              {t(c.note.link)}
            </a>
            .
          </span>
        </p>
      </div>
    </>
  );
}
