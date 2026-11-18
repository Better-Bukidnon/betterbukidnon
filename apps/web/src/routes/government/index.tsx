import { createFileRoute } from '@tanstack/react-router'
import { GovernmentPage } from '@/features/government/government-page'
import { seo } from '@/lib/seo'
import { m } from '@/paraglide/messages'

export const Route = createFileRoute('/government/')({
  head: () =>
    seo({
      title: m.seo_government_title(),
      description: m.seo_government_description(),
      path: '/government',
    }),
  component: GovernmentPage,
})
