import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { NotFound } from '@/components/layout/not-found'
import { localizePath } from '@/lib/i18n'
import { seo } from '@/lib/seo'
import { m } from '@/paraglide/messages'
import { getLocale } from '@/paraglide/runtime'

export const Route = createFileRoute('/barangays/profile/')({
  head: () =>
    seo({
      title: m.seo_barangays_title(),
      description: m.seo_barangays_description(),
      path: '/barangays/profile',
      noindex: true,
    }),
  component: LegacyBarangayProfileRedirect,
})

function LegacyBarangayProfileRedirect() {
  const [notFound, setNotFound] = useState(false)

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
      if (!barangay) {
        setNotFound(true)
        return
      }
      const href = `/barangays/${barangay.lgu_slug}/${barangay.slug.split('/').at(-1)}`
      window.location.replace(localizePath(href, getLocale()))
    })

    return () => {
      cancelled = true
    }
  }, [])

  if (notFound) return <NotFound />
  return (
    <p role="status" className="container-site py-12">
      {m.stats_loading()}
    </p>
  )
}
