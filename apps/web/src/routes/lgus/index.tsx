import { createFileRoute } from '@tanstack/react-router'
import { lgus } from '@/features/directories/data'
import { LguDirectoryPage } from '@/features/directories/lgu-directory-page'
import { seo } from '@/lib/seo'
import { m } from '@/paraglide/messages'

export const Route = createFileRoute('/lgus/')({
  head: () =>
    seo({
      title: m.seo_lgus_title(),
      description: m.seo_lgus_description(),
      path: '/lgus',
    }),
  component: () => <LguDirectoryPage lgus={lgus} />,
})
