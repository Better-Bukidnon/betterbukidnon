import { createFileRoute } from '@tanstack/react-router'
import { AccessibilityPage } from '@/features/engagement/accessibility-page'
import { seo } from '@/lib/seo'
import { m } from '@/paraglide/messages'

export const Route = createFileRoute('/accessibility')({
  head: () =>
    seo({
      title: m.seo_accessibility_title(),
      description: m.seo_accessibility_description(),
      path: '/accessibility',
    }),

  component: AccessibilityPage,
})
