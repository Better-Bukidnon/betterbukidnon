import { createFileRoute } from '@tanstack/react-router'
import { LegalPage } from '@/features/engagement/legal-page'
import { seo } from '@/lib/seo'
import { m } from '@/paraglide/messages'

export const Route = createFileRoute('/terms')({
  head: () =>
    seo({ title: m.seo_terms_title(), description: m.seo_terms_description(), path: '/terms' }),

  component: () => (
    <LegalPage
      badge="Legal"
      title="Terms of Use"
      description="Guidelines for using BetterBukidnon.org"
      icon="file-earmark-text"
      sections={[
        {
          id: 'introduction',
          title: 'Introduction',
          body: [
            'BetterBukidnon.org is an independent civic website run by volunteers as part of the BetterGov.ph ecosystem. It gathers public information about the services, programs and public funds of the Province of Bukidnon. It is not an official website of the Provincial Government of Bukidnon.',
          ],
        },
        {
          id: 'acceptance',
          title: 'Acceptance of Terms',
          body: [
            'By accessing and using this website, you acknowledge and agree to be bound by these terms and conditions.',
          ],
        },
        {
          id: 'content',
          title: 'Content and Licensing',
          body: [
            'Government information shown here comes from public sources. Unless otherwise stated, the website code is released under the MIT License and original text and data under CC BY 4.0.',
          ],
        },
        {
          id: 'disclaimer',
          title: '“As Is” Disclaimer',
          body: [
            'All information is provided “AS IS” without warranty. Treat content as informational and not as a substitute for official records or professional advice.',
          ],
        },
        {
          id: 'responsibilities',
          title: 'User Responsibilities',
          body: [
            'Confirm important information with the responsible office and do not rely on this portal for immediate emergency response.',
          ],
        },
        {
          id: 'external-links',
          title: 'External References',
          body: ['External sites and documents have their own terms and privacy practices.'],
        },
        {
          id: 'governing-law',
          title: 'Governing Law',
          body: ['These terms are governed by applicable laws of the Philippines.'],
        },
        {
          id: 'contact',
          title: 'Contact Information',
          body: ['For questions or content concerns, email volunteer@betterbukidnon.org.'],
        },
      ]}
    />
  ),
})
