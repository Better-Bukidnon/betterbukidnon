import { createFileRoute } from '@tanstack/react-router'
import { NewsPage } from '@/features/news/news-page'
import { seo } from '@/lib/seo'
import { m } from '@/paraglide/messages'

export const Route = createFileRoute('/news')({
  head: () =>
    seo({ title: m.seo_news_title(), description: m.seo_news_description(), path: '/news' }),

  component: NewsPage,
})
