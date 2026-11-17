import { createFileRoute, notFound } from '@tanstack/react-router'
import { findLgu } from '@/features/directories/data'
import { LguProfilePage } from '@/features/directories/lgu-profile-page'
import { directoryPaths } from '@/features/directories/paths'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/lgus/$slug')({
  loader: ({ params }) => {
    const lgu = findLgu(params.slug)
    if (!lgu) throw notFound()
    return { lgu }
  },
  head: ({ loaderData, params }) =>
    loaderData
      ? seo({
          title: loaderData.lgu.name,
          description: loaderData.lgu.introduction,
          path: directoryPaths.lgu(params.slug),
        })
      : {},
  component: () => <LguProfilePage lgu={Route.useLoaderData().lgu} />,
})
