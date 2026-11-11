'use client';

import { homeDictionary } from '@/features/home/homeDictionary';
import { useT } from '@/features/i18n/useT';

// Google Maps embed by coordinates: no API key, no script, no client JS. The www.google.com
// frame is already allowed by frame-src in public/_headers.
const CAPITOL = '8.1575,125.1278';
const EMBED_SRC = `https://www.google.com/maps?q=${CAPITOL}&z=14&output=embed`;
const MAPS_LINK = `https://www.google.com/maps?q=${CAPITOL}`;

export function MapCard() {
  const t = useT(homeDictionary);
  return (
    <div
      role="region"
      aria-label={t('home-map-region')}
      className="relative z-0 h-[17rem] overflow-hidden rounded-base border border-black/10 md:h-80"
    >
      <iframe
        title={t('home-map-iframe-title')}
        src={EMBED_SRC}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
        className="size-full border-0"
      />
      <a
        href={MAPS_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute right-xs bottom-xs inline-flex min-h-11 items-center rounded-base bg-white px-xs text-xs font-medium shadow-sm"
      >
        {t('home-map-open')}
      </a>
    </div>
  );
}
