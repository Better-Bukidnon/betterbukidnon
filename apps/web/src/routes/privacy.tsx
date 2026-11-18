import { createFileRoute } from '@tanstack/react-router'
import { LegalPage } from '@/features/engagement/legal-page'
import { seo } from '@/lib/seo'
import { m } from '@/paraglide/messages'

export const Route = createFileRoute('/privacy')({
  head: () =>
    seo({
      title: m.seo_privacy_title(),
      description: m.seo_privacy_description(),
      path: '/privacy',
    }),

  component: () => (
    <LegalPage
      badge="Privacy"
      title="Privacy Policy"
      description="How we collect, use, and protect your information"
      icon="shield-lock"
      sections={[
        {
          id: 'introduction',
          title: 'Introduction',
          body: [
            'BetterBukidnon.org is a civic website about the Province of Bukidnon, run by volunteers as part of the BetterGov.ph ecosystem. It is not operated by the Provincial Government of Bukidnon.',
            'In short: no accounts, no forms, no analytics and no ads. Your language choice is saved on your own device, and we only see your personal information if you email us.',
          ],
        },
        {
          id: 'information-collected',
          title: 'Information We Collect',
          body: [
            'We collect only the information needed to run this website. If you email us, that can include your email address, name if provided, and message content.',
            'We do not run analytics or tracking scripts. Our hosting provider receives technical data needed to deliver and secure the website.',
          ],
        },
        {
          id: 'cookies',
          title: 'Cookies and Local Storage',
          body: [
            'The site does not use advertising or analytics cookies. It stores your language choice and limited interface preferences in your browser.',
          ],
        },
        {
          id: 'third-party-services',
          title: 'Hosting and Third-Party Services',
          body: [
            'Links, maps, social-media embeds, and official documents are governed by the privacy practices of the services that provide them.',
          ],
        },
        {
          id: 'data-security',
          title: 'Data Security',
          body: [
            'We use reasonable measures to protect information, but no internet service can be perfectly secure.',
          ],
        },
        {
          id: 'your-rights',
          title: 'Your Rights',
          body: [
            'You may ask questions about personal information you provided by contacting the volunteers.',
          ],
        },
        {
          id: 'contact',
          title: 'Contact Us',
          body: ['For privacy questions, email volunteer@betterbukidnon.org.'],
        },
      ]}
    />
  ),
})
