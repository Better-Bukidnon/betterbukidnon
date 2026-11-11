'use client';

import { FacebookFeed } from '@/features/facebook-feed/FacebookFeed';
import { useT } from '@/features/i18n/useT';
import { NewsCard } from '@/features/news/NewsCard';
import { FB_PAGE_URL, news, type NewsItem } from '@/features/news/newsData';
import { newsDictionary } from '@/features/news/newsDictionary';
import { EmptyState } from '@/shared/EmptyState';
import { PageHero } from '@/shared/PageHero';
import { section } from '@/shared/ui';

/** All curated news, newest first (newsData sorts), then the Facebook page feed. */
export function NewsPage({ items = news }: { items?: NewsItem[] }) {
  const t = useT(newsDictionary);
  return (
    <>
      <PageHero
        crumbs={[{ label: t('news-home'), href: '/' }, { label: t('news-news') }]}
        title={t('news-news-updates')}
        description={t('news-stay-informed-about-the-latest-happenings-in')}
      />
      <section className={section} aria-label="News articles">
        {items.length ? (
          <div className="grid gap-sm md:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <NewsCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <EmptyState
            title={t('news-empty-title')}
            sourceHref={FB_PAGE_URL}
            sourceLabel={t('news-empty-link')}
          >
            {t('news-empty-desc')}
          </EmptyState>
        )}
      </section>
      <section className={`${section} border-t border-black/5`} aria-label="Facebook updates">
        <FacebookFeed />
      </section>
    </>
  );
}
