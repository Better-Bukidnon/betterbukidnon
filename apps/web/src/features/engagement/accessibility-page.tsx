import { Breadcrumbs } from '@/components/layout/breadcrumbs'
import { PageHeader } from '@/components/layout/page-header'
import { Icon, type IconName } from '@/components/ui/icon'

const features: { icon: IconName; title: string; text: string }[] = [
  {
    icon: 'keyboard',
    title: 'Keyboard Navigation',
    text: 'Menus, links and buttons can be used with a keyboard alone.',
  },
  {
    icon: 'eye',
    title: 'Screen Reader Support',
    text: 'Semantic HTML and ARIA labels help screen readers such as NVDA and VoiceOver.',
  },
  { icon: 'type', title: 'Text Alternatives', text: 'Images have text alternatives.' },
  {
    icon: 'palette',
    title: 'Color Contrast',
    text: 'Colors are chosen to meet WCAG AA contrast requirements.',
  },
  { icon: 'phone', title: 'Responsive Design', text: 'Works on all devices and screen sizes.' },
  {
    icon: 'translate',
    title: 'Three Languages',
    text: 'Available in English, Filipino and Cebuano (Binisaya), with no time limits on reading.',
  },
]
export function AccessibilityPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: 'Home', link: { to: '/' } }, { label: 'Accessibility' }]} />
      <PageHeader
        badge="Accessibility"
        title="Accessibility Statement"
        description="Our commitment to digital accessibility for all citizens"
        icon="universal-access"
      />
      <section className="section-y">
        <div className="container-site">
          <div className="mx-auto max-w-[800px]">
            <div className="mb-8 inline-flex items-center gap-3 rounded-xl border border-success/30 bg-success/10 px-5 py-4 text-success">
              <Icon name="check-circle-fill" className="text-[1.5rem]" />
              <div>
                <strong className="block">WCAG 2.1 Level AA</strong>
                <span className="text-[.875rem]">Our target standard</span>
              </div>
            </div>
            <Section title="Our Commitment">
              BetterBukidnon.org aims to meet WCAG 2.1 Level AA so that everyone, including people
              with disabilities, can use it. The site has not had a formal accessibility audit since
              it was adapted for Bukidnon, so some pages may fall short. Volunteers fix problems as
              they are reported.
            </Section>
            <Section title="Accessibility Features">
              <div className="grid gap-4 sm:grid-cols-2">
                {features.map((feature) => (
                  <div key={feature.title} className="rounded-xl border border-line p-5">
                    <Icon name={feature.icon} className="text-[1.25rem] text-primary" />
                    <h3 className="mt-3 text-[1rem]">{feature.title}</h3>
                    <p className="m-0 text-[.875rem] leading-[1.6] text-ink-light">
                      {feature.text}
                    </p>
                  </div>
                ))}
              </div>
            </Section>
            <Section title="Known Limitations">
              <ul className="list-disc space-y-2 pl-6 text-ink-light">
                <li>Some PDF documents may not be fully accessible to screen readers.</li>
                <li>Some third-party embedded content may have accessibility issues.</li>
                <li>
                  Maps and weather services may not work well with every assistive technology.
                </li>
                <li>Some pages are not fully translated into Filipino or Cebuano yet.</li>
              </ul>
            </Section>
            <Section title="Alternative Access">
              <p>
                If you encounter difficulty accessing any information, contact us at{' '}
                <a href="mailto:volunteer@betterbukidnon.org">volunteer@betterbukidnon.org</a> or
                call the Capitol at <a href="tel:+63888135741">(088) 813-5741</a>.
              </p>
            </Section>
            <Section title="Technical Specifications">
              <div className="flex flex-wrap gap-2">
                {['HTML5', 'CSS3', 'JavaScript', 'ARIA'].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-primary-tint px-3 py-1 text-[.8125rem] font-medium text-primary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Section>
            <div className="rounded-xl bg-linear-135 from-primary to-secondary p-6 text-white">
              <Icon name="heart-fill" className="text-[1.5rem]" />
              <h2 className="mt-2 text-[1.125rem] text-white">Our Promise</h2>
              <p className="mb-0 text-white/90">
                We want every Bukidnonon to be able to use this website, regardless of ability. If
                something does not work for you, tell us and we will try to fix it.
              </p>
            </div>
            <p className="mt-5 text-center text-[.8125rem] text-ink-light">
              Last updated: November 1, 2026
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="mb-3 text-[1.5rem]">{title}</h2>
      <div className="leading-[1.65] text-ink-light">{children}</div>
    </section>
  )
}
