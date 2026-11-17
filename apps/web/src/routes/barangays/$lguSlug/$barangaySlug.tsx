import { createFileRoute, notFound } from '@tanstack/react-router'
import { findBarangay } from '@/features/directories/data'
import { BarangayProfilePage } from '@/features/directories/barangay-profile-page'
import { directoryBarangaySlug, directoryPaths } from '@/features/directories/paths'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/barangays/$lguSlug/$barangaySlug')({
  loader: ({ params }) => {
    const barangay = findBarangay(directoryBarangaySlug(params.lguSlug, params.barangaySlug))
    if (!barangay) throw notFound()
    return { barangay }
  },
  head: ({ loaderData, params }) =>
    loaderData
      ? seo({
          title: `Barangay ${loaderData.barangay.name}, ${loaderData.barangay.lgu_name}`,
          description: loaderData.barangay.introduction,
          path: directoryPaths.barangay(params.lguSlug, params.barangaySlug),
        })
      : {},
  component: () => <BarangayProfilePage barangay={Route.useLoaderData().barangay} />,
})
