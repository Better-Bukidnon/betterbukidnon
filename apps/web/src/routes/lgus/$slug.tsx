import { createFileRoute, notFound } from '@tanstack/react-router'
import { LguProfilePage } from '@/features/directories/lgu-profile-page'
import { directoryPaths } from '@/features/directories/paths'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/lgus/$slug')({
  loader: async ({ params }) => {
    const { findLgu, findBarangaysForLgu } = await import('@/features/directories/data')
    const lgu = findLgu(params.slug)
    if (!lgu) throw notFound()
    return { lgu, barangays: findBarangaysForLgu(lgu.slug) }
  },
  head: ({ loaderData, params }) =>
    loaderData
      ? seo({
          title: `${loaderData.lgu.name}, Bukidnon`,
          description: loaderData.lgu.introduction,
          path: directoryPaths.lgu(params.slug),
        })
      : {},
  component: () => <LguProfilePage {...Route.useLoaderData()} />,
})
