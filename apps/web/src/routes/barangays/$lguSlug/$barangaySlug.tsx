import { createFileRoute, notFound } from '@tanstack/react-router'
import { BarangayProfilePage } from '@/features/directories/barangay-profile-page'
import { directoryBarangaySlug, directoryPaths } from '@/features/directories/paths'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/barangays/$lguSlug/$barangaySlug')({
  loader: async ({ params }) => {
    const { findBarangay, findLgu } = await import('@/features/directories/data')
    const barangay = findBarangay(directoryBarangaySlug(params.lguSlug, params.barangaySlug))
    if (!barangay) throw notFound()
    const lgu = findLgu(barangay.lgu_slug)
    if (!lgu) throw notFound()
    return { barangay, lgu }
  },
  head: ({ loaderData, params }) =>
    loaderData
      ? seo({
          title: `Barangay ${loaderData.barangay.name}, ${loaderData.barangay.lgu_name}`,
          description: loaderData.barangay.introduction,
          path: directoryPaths.barangay(params.lguSlug, params.barangaySlug),
        })
      : {},
  component: () => <BarangayProfilePage {...Route.useLoaderData()} />,
})
