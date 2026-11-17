import { Breadcrumbs } from '@/components/layout/breadcrumbs'
import { PageHeader } from '@/components/layout/page-header'
import { Icon, type IconName } from '@/components/ui/icon'

export type LegalSection = { id: string; title: string; body: string[]; items?: string[] }

export function LegalPage({
  badge,
  title,
  description,
  icon,
  sections,
}: {
  badge: string
  title: string
  description: string
  icon: IconName
  sections: LegalSection[]
}) {
  return (
    <>
      <Breadcrumbs items={[{ label: 'Home', link: { to: '/' } }, { label: title }]} />
      <PageHeader badge={badge} title={title} description={description} icon={icon} />
      <section className="section-y">
        <div className="container-site">
          <div className="mx-auto grid max-w-[1100px] gap-8 lg:grid-cols-[240px_1fr]">
            <aside className="h-fit rounded-xl border border-line bg-surface-alt p-5 lg:sticky lg:top-6">
              <h2 className="mb-3 flex items-center gap-2 text-[1rem]">
                <Icon name="list-ul" />
                Contents
              </h2>
              <nav className="flex flex-col gap-2 text-[.875rem]">
                {sections.map((section) => (
                  <a key={section.id} href={`#${section.id}`}>
                    {section.title}
                  </a>
                ))}
              </nav>
            </aside>
            <article>
              {sections.map((section) => (
                <section id={section.id} key={section.id} className="mb-8 scroll-mt-6">
                  <h2 className="mb-3 text-[1.5rem]">{section.title}</h2>
                  {section.body.map((paragraph) => (
                    <p key={paragraph} className="mb-3 leading-[1.65] text-ink-light">
                      {paragraph}
                    </p>
                  ))}
                  {section.items && (
                    <ul className="list-disc space-y-2 pl-6 leading-[1.6] text-ink-light">
                      {section.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
            </article>
          </div>
        </div>
      </section>
    </>
  )
}
