import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'
import { localizePath } from '@/lib/i18n'
import { seo } from '@/lib/seo'
import { getLocale } from '@/paraglide/runtime'

export const Route = createFileRoute('/barangays/profile/')({
  head: () =>
    seo({
      title: 'Barangay profile',
      description: 'Open a barangay profile by its PSGC code.',
      path: '/barangays/profile',
      noindex: true,
    }),
  component: LegacyBarangayProfileRedirect,
})

function LegacyBarangayProfileRedirect() {
  useEffect(() => {
    let cancelled = false
    const code = new URLSearchParams(window.location.search).get('code') ?? undefined
    if (!code) {
      window.location.replace(localizePath('/barangays', getLocale()))
      return () => {
        cancelled = true
      }
    }

    void import('@/features/directories/data').then(({ barangays }) => {
      if (cancelled) return
      const barangay = barangays.find((entry) => entry.psgc_code === code)
      const href = barangay
        ? `/barangays/${barangay.lgu_slug}/${barangay.slug.split('/').at(-1)}`
        : '/404'
      window.location.replace(localizePath(href, getLocale()))
    })

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <p role="status" className="container-site py-12">
      Opening barangay profile…
    </p>
  )
}
