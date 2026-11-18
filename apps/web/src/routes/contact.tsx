import { createFileRoute } from '@tanstack/react-router'
import { ContactPage } from '@/features/engagement/contact-page'
import { seo } from '@/lib/seo'
import { m } from '@/paraglide/messages'

export const Route = createFileRoute('/contact')({
  head: () =>
    seo({
      title: m.seo_contact_title(),
      description: m.seo_contact_description(),
      path: '/contact',
    }),
  component: ContactPage,
})
