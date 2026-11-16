import { createFileRoute } from '@tanstack/react-router'
import { LegislativePage } from '@/features/legislative/legislative-page'
import { seo } from '@/lib/seo'
import { m } from '@/paraglide/messages'

export const Route = createFileRoute('/legislative/')({
  head: () =>
    seo({
      title: m.seo_legislative_title(),
      description: m.seo_legislative_description(),
      path: '/legislative',
    }),
  component: LegislativePage,
})
