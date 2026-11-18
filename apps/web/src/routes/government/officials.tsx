import { createFileRoute } from '@tanstack/react-router'
import { OfficialsPage } from '@/features/government/officials-page'
import { seo } from '@/lib/seo'
import { m } from '@/paraglide/messages'

export const Route = createFileRoute('/government/officials')({
  head: () =>
    seo({
      title: m.seo_officials_title(),
      description: m.seo_officials_description(),
      path: '/government/officials',
    }),
  component: OfficialsPage,
})
