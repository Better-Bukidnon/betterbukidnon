import { createFileRoute } from '@tanstack/react-router'
import { barangays, lgus, lguBySlug } from '@/features/directories/data'
import { BarangayDirectoryPage } from '@/features/directories/barangay-directory-page'
import { seo } from '@/lib/seo'
import { m } from '@/paraglide/messages'

export const Route = createFileRoute('/barangays/')({
  validateSearch: (search: Record<string, unknown>) => ({
    lgu: typeof search.lgu === 'string' ? search.lgu : undefined,
  }),
  head: () =>
    seo({
      title: m.seo_barangays_title(),
      description: m.seo_barangays_description(),
      path: '/barangays',
    }),
  component: () => (
    <BarangayDirectoryPage
      barangays={barangays}
      lgus={lgus}
      lguBySlug={lguBySlug}
      initialLgu={Route.useSearch().lgu}
    />
  ),
})
