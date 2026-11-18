import { createFileRoute } from '@tanstack/react-router'
import { ResolutionFrameworkPage } from '@/features/legislative/framework-page'
import { seo } from '@/lib/seo'
import { m } from '@/paraglide/messages'

export const Route = createFileRoute('/legislative/resolution-framework')({
  head: () =>
    seo({
      title: m.seo_resolutions_title(),
      description: m.seo_resolutions_description(),
      path: '/legislative/resolution-framework',
    }),
  component: ResolutionFrameworkPage,
})
