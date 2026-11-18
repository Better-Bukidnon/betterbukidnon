import { createFileRoute } from '@tanstack/react-router'
import { FaqPage } from '@/features/engagement/faq-page'
import { seo } from '@/lib/seo'
import { m } from '@/paraglide/messages'

export const Route = createFileRoute('/faq')({
  head: () => seo({ title: m.seo_faq_title(), description: m.seo_faq_description(), path: '/faq' }),

  component: FaqPage,
})
