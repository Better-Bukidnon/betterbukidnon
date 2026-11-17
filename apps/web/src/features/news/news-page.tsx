import { Breadcrumbs } from '@/components/layout/breadcrumbs'
import { PatternHero } from '@/components/layout/pattern-hero'
import { Icon } from '@/components/ui/icon'
import { SiteLink } from '@/components/ui/site-link'
import { formatDate } from '@/features/news/data'
import { m } from '@/paraglide/messages'
import { news } from './data'

export function NewsPage() {
  return (
    <>
      <Breadcrumbs
        items={[{ label: m.news_home(), link: { to: '/' } }, { label: m.news_news() }]}
      />
      <PatternHero
        icon="newspaper"
        badge={m.news_news()}
        title={m.news_news_updates()}
        subtitle={m.news_stay_informed_about_the_latest_happenings_in()}
      />
      <section className="section-y">
        <div className="container-site">
          <div
            className="grid grid-cols-[repeat(3,1fr)] gap-6 max-[1200px]:grid-cols-[repeat(2,1fr)] max-sm:grid-cols-1"
            role="feed"
            aria-label="News articles"
          >
            {news.news.length ? (
              news.news.map((item) => <NewsCard key={item.id} item={item} />)
            ) : (
              <EmptyNews />
            )}
          </div>
        </div>
      </section>
      <FacebookFeed />
    </>
  )
}

function NewsCard({ item }: { item: (typeof news.news)[number] }) {
  const external = Boolean(item.url)
  return (
    <article className="flex flex-col overflow-hidden rounded-lg border border-surface-alt bg-white transition hover:-translate-y-[3px] hover:shadow-md focus-within:outline-2 focus-within:outline-primary focus-within:outline-offset-2">
      <div className="flex items-center justify-between px-4 pt-3">
        <span
          className={
            'rounded px-2 py-1 text-[.75rem] font-semibold ' +
            (item.badge === 'success'
              ? 'bg-success/10 text-success'
              : item.badge === 'warning'
                ? 'bg-warning/10 text-warning'
                : 'bg-primary-tint text-primary')
          }
        >
          {item.category}
        </span>
        <time className="text-[.75rem] text-ink-light" dateTime={item.date}>
          {formatDate(item.date)}
        </time>
      </div>
      <div className="flex flex-1 flex-col px-4 pb-4 pt-2">
        <h2 className="mb-2 text-[1rem] leading-[1.35] font-semibold">
          {external ? <SiteLink href={item.url!}>{item.title}</SiteLink> : item.title}
        </h2>
        <p className="m-0 line-clamp-3 text-[.8125rem] leading-[1.55] text-ink-light">
          {item.excerpt}
        </p>
      </div>
      {external && (
        <div className="px-4 pb-3">
          <SiteLink
            href={item.url!}
            className="inline-flex items-center gap-1 rounded py-1 text-[.8125rem] font-medium text-primary"
          >
            <span>{item.source || m.news_read_more()}</span>
            <Icon name="arrow-right" className="text-[.7rem]" />
          </SiteLink>
        </div>
      )}
    </article>
  )
}
function EmptyNews() {
  return (
    <article className="flex flex-col overflow-hidden rounded-lg border border-surface-alt bg-white">
      <div className="flex-1 px-4 pb-4 pt-3">
        <h2 className="mb-2 text-[1rem] leading-[1.35] font-semibold">{m.news_empty_title()}</h2>
        <p className="m-0 text-[.8125rem] leading-[1.55] text-ink-light">{m.news_empty_desc()}</p>
      </div>
      <div className="px-4 pb-3">
        <SiteLink
          href="https://www.facebook.com/lgubukidnon"
          className="inline-flex items-center gap-1 rounded py-1 text-[.8125rem] font-medium text-primary"
        >
          <span>Provincial Government of Bukidnon on Facebook</span>
          <Icon name="box-arrow-up-right" className="text-[.7rem]" />
        </SiteLink>
      </div>
    </article>
  )
}
function FacebookFeed() {
  return (
    <section className="section-y bg-surface-alt">
      <div className="container-site">
        <div className="mb-6 text-center">
          <h2 className="mb-1 text-[1.5rem]">{m.news_facebook_title()}</h2>
          <p className="m-0 text-ink-light">{m.news_facebook_desc()}</p>
        </div>
        <div className="flex justify-center">
          <iframe
            title="Latest posts from the Provincial Government of Bukidnon Facebook Page"
            src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Flgubukidnon&tabs=timeline&width=500&height=720&small_header=false&adapt_container_width=true&hide_cover=false&show_facecount=true"
            className="w-full max-w-[500px] rounded-xl border-0 bg-white shadow-sm"
            height="720"
            scrolling="no"
            allow="encrypted-media; clipboard-write; web-share"
            loading="lazy"
          />
        </div>
        <p className="mt-4 text-center text-[.875rem] text-ink-light">
          {m.news_facebook_fallback()}{' '}
          <SiteLink
            href="https://www.facebook.com/lgubukidnon"
            className="font-medium text-primary"
          >
            {m.news_facebook_visit()} <Icon name="box-arrow-up-right" />
          </SiteLink>
        </p>
      </div>
    </section>
  )
}
