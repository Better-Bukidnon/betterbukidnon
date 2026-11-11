'use client';

import { Bank, GeoAlt, GeoAltFill, Globe2, Telephone, TelephoneFill } from 'react-bootstrap-icons';
import { FacebookFeed } from '@/features/facebook-feed/FacebookFeed';
import { officials } from '@/features/government/governmentData';
import { LeaderCard } from '@/features/government/LeaderCard';
import { homeDictionary, type HomeKey } from '@/features/home/homeDictionary';
import { useT } from '@/features/i18n/useT';
import { NewsCard } from '@/features/news/NewsCard';
import { news } from '@/features/news/newsData';
import { MapCard } from '@/features/weather-map/MapCard';
import { WeatherWidget } from '@/features/weather-map/WeatherWidget';
import { Section } from '@/shared/Section';
import { SectionHeading } from '@/shared/SectionHeading';
import { card } from '@/shared/ui';

export function WeatherMapSection() {
  const t = useT(homeDictionary);
  return (
    <Section>
      <SectionHeading title={t('home-weather-and-map-of-bukidnon')} />
      <div className="grid gap-md md:grid-cols-[2fr_3fr]">
        <WeatherWidget />
        <div>
          <MapCard />
          <p className="mt-xs flex items-center gap-1 text-sm text-text-light">
            <GeoAlt aria-hidden /> {t('home-capitol-address')}
          </p>
          <p className="sr-only">{t('home-map-description')}</p>
        </div>
      </div>
    </Section>
  );
}

const TIMELINE: { year: string | HomeKey; text: HomeKey }[] = [
  { year: 'home-history-precolonial-label', text: 'home-history-precolonial' },
  { year: '1850s', text: 'home-history-1850s' },
  { year: '1907', text: 'home-history-1907' },
  { year: '1917', text: 'home-history-1917' },
  { year: '1977', text: 'home-history-1977' },
  { year: '1998–2001', text: 'home-history-cityhood' },
  { year: '2012', text: 'home-history-2012' },
];

/** The timeline is a dated list, so it is typeset as one (year, then text), not as cards. */
export function HistorySection() {
  const t = useT(homeDictionary);
  const facts = [
    { title: t('home-history-card-tribes-title'), text: t('home-history-card-tribes') },
    { title: t('home-history-card-highlands-title'), text: t('home-history-card-highlands') },
  ];
  return (
    <Section tone="tint">
      <SectionHeading title={t('home-brief-history-of-bukidnon')} />
      <div className="grid items-start gap-lg lg:grid-cols-[1fr_340px]">
        <ol className="divide-y divide-black/10 border-y border-black/10">
          {TIMELINE.map(({ year, text }) => (
            <li key={text} className="grid gap-x-sm gap-y-1 py-sm sm:grid-cols-[8rem_1fr]">
              <span className="font-bold text-primary tabular-nums">
                {year.startsWith('home-') ? t(year as HomeKey) : year}
              </span>
              <p className="text-sm leading-relaxed">{t(text)}</p>
            </li>
          ))}
        </ol>
        <div className="grid gap-sm sm:grid-cols-2 lg:sticky lg:top-24 lg:grid-cols-1">
          {facts.map(({ title, text }) => (
            <div key={title} className={card}>
              <h3 className="mb-1 font-semibold">{title}</h3>
              <p className="text-sm text-text-light">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

/** Facebook page plus the newest curated news. News stays hidden while news.json is empty. */
export function UpdatesSection() {
  const t = useT(homeDictionary);
  return (
    <Section>
      <SectionHeading title={t('section-updates')} href="/news" linkText={t('home-view-all')} />
      <FacebookFeed />
      {news.length > 0 && (
        <div className="mt-lg">
          <h3 className="mb-sm text-xl font-semibold">{t('home-latest-news')}</h3>
          <div className="grid gap-sm md:grid-cols-3">
            {news.slice(0, 3).map((item) => (
              <NewsCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}
    </Section>
  );
}

const rowLink = 'inline-flex min-h-11 items-center gap-xs';

/** Who runs the province and how to reach it, side by side: both are short lists. */
export function LeadershipContactSection() {
  const t = useT(homeDictionary);
  const leaders = [
    {
      office: t('title-governor'),
      name: officials.governor.name,
      role: t('home-pgo'),
      link: (
        <a href="tel:+63888132457" className={rowLink}>
          <Telephone aria-hidden /> (088) 813-2457
        </a>
      ),
    },
    {
      office: t('title-vice-governor'),
      name: officials.vice_governor.name,
      role: t('home-sp-presiding-officer'),
      link: (
        <a href="/legislative" className={rowLink}>
          <Bank aria-hidden /> {t('home-view-legislative')}
        </a>
      ),
    },
  ];
  const contacts = [
    {
      Icon: TelephoneFill,
      title: t('contact-phone'),
      value: '(088) 813-5741',
      note: t('contact-hours'),
      href: 'tel:+63888135741',
    },
    {
      Icon: Globe2,
      title: t('home-official-website'),
      value: 'bukidnon.gov.ph',
      note: t('home-official-website-note'),
      href: 'https://bukidnon.gov.ph/',
    },
    {
      Icon: GeoAltFill,
      title: t('contact-address'),
      value: t('home-capitol-compound'),
      note: t('home-capitol-city'),
    },
  ];
  return (
    <Section>
      <div className="grid gap-lg md:grid-cols-2">
        <div>
          <SectionHeading
            title={t('section-leadership')}
            href="/government/officials"
            linkText={t('home-view-all-officials')}
          />
          <div className="grid gap-sm">
            {leaders.map((l) => (
              <LeaderCard key={l.office} office={l.office} name={l.name} role={l.role}>
                {l.link}
              </LeaderCard>
            ))}
          </div>
          <p className="mt-sm text-sm text-text-light">{t('home-leadership-term')}</p>
        </div>
        <div>
          <SectionHeading
            title={t('section-contact')}
            href="/contact"
            linkText={t('home-view-all')}
          />
          <ul className="divide-y divide-black/10 border-y border-black/10">
            {contacts.map(({ Icon, title, value, note, href }) => {
              const body = (
                <>
                  <Icon aria-hidden className="mt-1 shrink-0 text-xl text-primary" />
                  <span>
                    <span className="block text-sm text-text-light">{title}</span>
                    <span className="block font-semibold text-text">{value}</span>
                    <span className="block text-sm text-text-light">{note}</span>
                  </span>
                </>
              );
              const cls = 'flex min-h-11 items-start gap-sm py-sm no-underline';
              return (
                <li key={title}>
                  {href ? (
                    <a
                      href={href}
                      className={`${cls} transition-colors duration-150 ease-out hover:bg-bg-alt`}
                      {...(href.startsWith('http')
                        ? { target: '_blank', rel: 'noopener noreferrer' }
                        : {})}
                    >
                      {body}
                    </a>
                  ) : (
                    <div className={cls}>{body}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </Section>
  );
}
