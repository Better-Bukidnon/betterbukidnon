import { createFileRoute } from '@tanstack/react-router'
import { LguDirectoryPage } from '@/features/directories/lgu-directory-page'
import { seo } from '@/lib/seo'
import { m } from '@/paraglide/messages'

export const Route = createFileRoute('/lgus/')({
  loader: async () => {
    const { lgus } = await import('@/features/directories/data')
    return { lgus }
  },
  head: () =>
    seo({
      title: m.seo_lgus_title(),
      description: m.seo_lgus_description(),
      path: '/lgus',
    }),
  component: () => <LguDirectoryPage {...Route.useLoaderData()} />,
})
