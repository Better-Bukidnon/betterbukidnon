import { createFileRoute } from '@tanstack/react-router'
import { BarangayDirectoryPage } from '@/features/directories/barangay-directory-page'
import { seo } from '@/lib/seo'
import { m } from '@/paraglide/messages'

export const Route = createFileRoute('/barangays/')({
  validateSearch: (search: Record<string, unknown>) => ({
    lgu: typeof search.lgu === 'string' ? search.lgu : undefined,
  }),
  loader: async () => {
    const { barangays, lgus, lguBySlug } = await import('@/features/directories/data')
    return { barangays, lgus, lguBySlug }
  },
  head: () =>
    seo({
      title: m.seo_barangays_title(),
      description: m.seo_barangays_description(),
      path: '/barangays',
    }),
  component: () => (
    <BarangayDirectoryPage {...Route.useLoaderData()} initialLgu={Route.useSearch().lgu} />
  ),
})
