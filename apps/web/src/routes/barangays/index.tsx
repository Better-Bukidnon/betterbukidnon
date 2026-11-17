import { createFileRoute } from '@tanstack/react-router'
import { BarangayDirectoryPage } from '@/features/directories/barangay-directory-page'
import { seo } from '@/lib/seo'
import { m } from '@/paraglide/messages'

export const Route = createFileRoute('/barangays/')({
  head: () =>
    seo({
      title: m.seo_barangays_title(),
      description: m.seo_barangays_description(),
      path: '/barangays',
    }),
  component: BarangayDirectoryPage,
})
