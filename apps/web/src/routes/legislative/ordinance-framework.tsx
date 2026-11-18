import { createFileRoute } from '@tanstack/react-router'
import { OrdinanceFrameworkPage } from '@/features/legislative/framework-page'
import { seo } from '@/lib/seo'
import { m } from '@/paraglide/messages'

export const Route = createFileRoute('/legislative/ordinance-framework')({
  head: () =>
    seo({
      title: m.seo_ordinances_title(),
      description: m.seo_ordinances_description(),
      path: '/legislative/ordinance-framework',
    }),
  component: OrdinanceFrameworkPage,
})
