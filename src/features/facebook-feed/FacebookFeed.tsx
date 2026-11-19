'use client';

import { CalendarEvent, Facebook, Megaphone } from 'react-bootstrap-icons';
import { homeDictionary } from '@/features/home/homeDictionary';
import { useT } from '@/features/i18n/useT';
import { FB_PAGE_URL } from '@/features/news/newsData';
import { buttonPrimary } from '@/shared/ui';

const PLUGIN =
  'https://www.facebook.com/plugins/page.php?href=' +
  encodeURIComponent(`${FB_PAGE_URL}/`) +
  '&tabs=timeline&width=500&height=700&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true';

const external = { target: '_blank', rel: 'noopener noreferrer' } as const;

/**
 * The Facebook page plugin as a lazy iframe in a fixed-size box: no SDK script, no layout
 * shift, and the fallback link covers browsers that block third-party cookies.
 */
export function FacebookFeed() {
  const t = useT(homeDictionary);
  return (
    <div className="grid items-start gap-lg lg:grid-cols-[1fr_500px]">
      <div>
        <p className="mb-xs inline-flex items-center gap-xs text-sm font-semibold text-primary">
          <Facebook aria-hidden /> {t('home-fb-eyebrow')}
        </p>
        <h3 className="mb-xs text-xl font-semibold">{t('home-fb-heading')}</h3>
        <p className="mb-sm text-text-light">{t('home-fb-desc')}</p>
        <ul className="mb-md space-y-xs text-sm">
          <li className="flex items-center gap-xs">
            <Megaphone aria-hidden className="text-primary" /> {t('home-fb-announcements')}
          </li>
          <li className="flex items-center gap-xs">
            <CalendarEvent aria-hidden className="text-primary" /> {t('home-fb-events')}
          </li>
        </ul>
        <a href={FB_PAGE_URL} {...external} className={buttonPrimary}>
          <Facebook aria-hidden /> {t('home-fb-visit')}
        </a>
      </div>
      <div>
        <div className="mx-auto h-[700px] w-full max-w-[500px] overflow-hidden rounded-base border border-black/10 bg-bg-alt">
          <iframe
            src={PLUGIN}
            title={t('home-fb-iframe-title')}
            loading="lazy"
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            className="size-full border-0"
          />
        </div>
        <p className="mt-xs text-center text-sm text-text-light">
          {t('home-fb-cant-see')}{' '}
          <a href={FB_PAGE_URL} {...external}>
            {t('home-fb-open')}
          </a>
        </p>
      </div>
    </div>
  );
}
