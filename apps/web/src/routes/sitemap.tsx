import { createFileRoute } from '@tanstack/react-router'
import { PageHeader } from '@/components/layout/page-header'
import { SiteLink } from '@/components/ui/site-link'
import { seo } from '@/lib/seo'
import { m } from '@/paraglide/messages'

export const Route = createFileRoute('/sitemap')({
  head: () =>
    seo({
      title: m.seo_sitemap_title(),
      description: m.seo_sitemap_description(),
      path: '/sitemap',
    }),
  component: SitemapPage,
})

const groups = [
  {
    icon: 'house-door',
    title: 'Main Navigation',
    links: [
      ['Home', '/'],
      ['Services', '/services'],
      ['Government', '/government'],
      ['Statistics', '/statistics'],
      ['Legislative', '/legislative'],
      ['Transparency', '/budget'],
      ['Our Projects', '/projects'],
      ['Contact', '/contact'],
      ['News', '/news'],
      ['FAQ', '/faq'],
      ['Accessibility', '/accessibility'],
    ],
  },
  {
    icon: 'grid-3x3-gap',
    title: 'Service Categories',
    links: [
      ['Certificates & Vital Records', '/services/certificates'],
      ['Business Services', '/services/business'],
      ['Social Services', '/services/social-services'],
      ['Health & Wellness', '/services/health'],
      ['Tax & Payments', '/services/tax-payments'],
      ['Agriculture', '/services/agriculture'],
      ['Infrastructure', '/services/infrastructure'],
      ['Education', '/services/education'],
      ['Environment', '/services/environment'],
      ['Public Safety', '/services/public-safety'],
    ],
  },
  {
    icon: 'building',
    title: 'Provincial Offices',
    links: [
      ['Civil Registration', '/service-details/civil-registrar'],
      ["Provincial Treasurer's Office", '/service-details/provincial-treasurer'],
      ["Provincial Assessor's Office", '/service-details/provincial-assessor'],
      ['Property Declaration', '/service-details/property-declaration'],
      ['Provincial Budget Office', '/service-details/provincial-budget'],
      ['Provincial Accounting Office', '/service-details/provincial-accounting'],
      ["Provincial Engineer's Office", '/service-details/provincial-engineering'],
      ['Provincial Planning Office', '/service-details/provincial-planning'],
      ['Provincial Agriculturist', '/service-details/provincial-agriculture'],
      ['PSWDO', '/service-details/pswdo'],
      ['Provincial Health Office', '/service-details/provincial-health-office'],
      ['PDRRMD', '/service-details/pdrrmd'],
      ['Business Permits', '/service-details/business-permits-licensing'],
      ['General Services', '/service-details/provincial-general-services'],
      ['HR Management', '/service-details/human-resource-management'],
    ],
  },
  {
    icon: 'bank',
    title: 'Government & Legislative',
    links: [
      ['Government Structure', '/government'],
      ['Elected Officials', '/government/officials'],
      ['Cities and Municipalities', '/government#lgus'],
      ['Legislative Documents', '/legislative'],
      ['Ordinance Framework', '/legislative/ordinance-framework'],
      ['Resolution Framework', '/legislative/resolution-framework'],
    ],
  },
  {
    icon: 'link-45deg',
    title: 'External Resources',
    links: [
      ['Official Bukidnon Website', 'https://bukidnon.gov.ph/'],
      ['Facebook Page', 'https://www.facebook.com/lgubukidnon'],
      ['Terms of Use', '/terms'],
      ['Privacy Policy', '/privacy'],
    ],
  },
] as const

function SitemapPage() {
  return (
    <>
      <PageHeader
        badge="Navigation"
        icon="diagram-3-fill"
        title="Sitemap"
        description="Navigate all pages and services of Better Bukidnon"
      />
      <section className="section-y">
        <div className="container-site">
          {groups.map((group) => (
            <section key={group.title} className="mb-8">
              <div className="mb-5 flex items-center gap-3">
                <span className="flex size-11 items-center justify-center rounded-xl bg-primary-tint text-[1.25rem] text-primary">
                  <i className={`bi bi-${group.icon}`} aria-hidden="true" />
                </span>
                <h2 className="m-0 text-[1.25rem]">{group.title}</h2>
              </div>
              <div className="grid grid-cols-4 gap-3 max-lg:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1">
                {group.links.map(([label, href]) => (
                  <SiteLink
                    key={href}
                    href={href}
                    className="flex items-center gap-2 rounded-lg border border-line bg-white px-4 py-3 text-[.9rem] text-ink no-underline transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-sm hover:text-primary hover:no-underline"
                  >
                    <i
                      className={
                        'bi ' +
                        (href.startsWith('http') ? 'bi-box-arrow-up-right' : 'bi-arrow-right')
                      }
                      aria-hidden="true"
                    />
                    <span>{label}</span>
                  </SiteLink>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>
    </>
  )
}
