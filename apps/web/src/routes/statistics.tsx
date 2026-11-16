import { createFileRoute } from '@tanstack/react-router'
import { StatisticsPage } from '@/features/statistics/statistics-page'
import { seo } from '@/lib/seo'
import { m } from '@/paraglide/messages'

export const Route = createFileRoute('/statistics')({
  head: () =>
    seo({
      title: m.seo_statistics_title(),
      description: m.seo_statistics_description(),
      path: '/statistics',
    }),
  component: StatisticsPage,
})
