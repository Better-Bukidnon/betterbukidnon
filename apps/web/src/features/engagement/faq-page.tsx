import { Breadcrumbs } from '@/components/layout/breadcrumbs'
import { PageHeader } from '@/components/layout/page-header'
import { Icon, type IconName } from '@/components/ui/icon'
import { SiteLink } from '@/components/ui/site-link'

type Entry = { question: string; answer: React.ReactNode }
type Category = { icon: IconName; title: string; entries: Entry[] }

const link = (href: string, label: string) => <SiteLink href={href}>{label}</SiteLink>

const categories: Category[] = [
  {
    icon: 'info-circle-fill',
    title: 'General Questions',
    entries: [
      {
        question: 'What is BetterBukidnon.org?',
        answer: (
          <>
            BetterBukidnon.org is a free civic website built by volunteers to make public
            information about the Province of Bukidnon easier to find: provincial offices,
            officials, hotlines and step-by-step guides. It is part of the BetterGov.ph volunteer
            ecosystem. It is not an official government website. For official information, visit{' '}
            {link('https://bukidnon.gov.ph/', 'bukidnon.gov.ph')}.
          </>
        ),
      },
      {
        question: 'Who is the Governor of Bukidnon?',
        answer: (
          <>
            The Governor is Hon. Rogelio Neil P. Roque, re-elected in May 2025 for the 2025–2028
            term. The Vice Governor, who presides over the Sangguniang Panlalawigan (Provincial
            Board), is Hon. Clive D. Quiño.
            <p>{link('/government/officials', 'See all provincial officials')}</p>
          </>
        ),
      },
      {
        question: 'How do I contact the Provincial Capitol?',
        answer: (
          <>
            The Provincial Capitol is at the Provincial Capitol Compound, Barangay 9, Malaybalay
            City, Bukidnon 8700. Offices are open Monday to Friday, 8:00 AM to 5:00 PM, except on
            holidays. The main line is (088) 813-5741.
            <p>{link('/contact', 'See the phone numbers of provincial offices')}</p>
          </>
        ),
      },
      {
        question: 'Province, city or municipality: who handles what?',
        answer: (
          <>
            Bukidnon has two component cities (Malaybalay and Valencia) and 20 municipalities, each
            with its own city or municipal hall. Civil registration, business permits, barangay
            clearances, tricycle franchises and public markets are handled by your city or municipal
            hall, not by the Province. The Provincial Government runs offices such as the Provincial
            Treasurer, Assessor, Engineer, Health Office and PSWDO.
            <p>{link('/government#lgus', 'List of cities and municipalities')}</p>
          </>
        ),
      },
      {
        question: 'Can I request services online?',
        answer: (
          <>
            Not through this website: BetterBukidnon.org does not process any transactions. Most
            provincial transactions are done in person, so ask the office concerned whether it
            offers online options. Copies of PSA birth, marriage and death certificates can be
            ordered online through PSA Serbilis.
          </>
        ),
      },
    ],
  },
  {
    icon: 'file-earmark-text-fill',
    title: 'Certificates & Documents',
    entries: [
      {
        question: 'Where do I get a birth certificate?',
        answer: (
          <>
            Ask the Local Civil Registry Office (LCRO) of the city or municipality where the birth
            was registered, or get a PSA copy from a PSA outlet or online through PSA Serbilis. Many
            transactions, such as passport applications, require the PSA copy. Bring a valid
            government ID. Requirements and fees vary, so confirm with the office.
            <p>{link('/service-details/birth-certificate', 'Birth certificate guide')}</p>
          </>
        ),
      },
      {
        question: 'Can someone else request my certificate for me?',
        answer: (
          <>
            <p>Yes, but they must bring:</p>
            <ul>
              <li>An authorization letter signed by you</li>
              <li>Valid ID of both you and the representative</li>
              <li>Photocopy of your valid ID</li>
            </ul>
            <p>
              Rules on who may request a record differ between the LCRO and PSA. Confirm with the
              office before you go.
            </p>
          </>
        ),
      },
      {
        question: 'What is the difference between PSA and local civil registrar certificates?',
        answer: (
          <>
            Both are certified true copies. PSA certificates are the nationally-recognized version
            required for passport and visa applications. Local civil registrar certificates are
            accepted for most local transactions and are often processed faster.
          </>
        ),
      },
    ],
  },
  {
    icon: 'shop',
    title: 'Business & Permits',
    entries: [
      {
        question: 'Where do I get a business permit?',
        answer: (
          <>
            Business permits (Mayor’s permits) are issued by the Business Permits and Licensing
            Office (BPLO) of the city or municipality where your business is located, not by the
            Provincial Government. Permits are renewed every year, usually in January. Check the
            deadline and requirements with your city or municipal hall.
            <p>{link('/service-details/business-permits-licensing', 'Business permit guide')}</p>
          </>
        ),
      },
      {
        question: 'What do I need to start a new business in Bukidnon?',
        answer: (
          <>
            <p>Requirements vary by city or municipality, but usually include:</p>
            <ul>
              <li>
                DTI Registration (for sole proprietorship) or SEC Registration (for corporation)
              </li>
              <li>Barangay Clearance</li>
              <li>Community Tax Certificate (Cedula)</li>
              <li>Location Sketch/Map</li>
              <li>Contract of Lease (if renting)</li>
            </ul>
            <p>Apply at the BPLO of the city or municipality where the business will operate.</p>
          </>
        ),
      },
    ],
  },
  {
    icon: 'cash-coin',
    title: 'Taxes & Payments',
    entries: [
      {
        question: 'Where do I pay real property tax?',
        answer: (
          <>
            It depends on where the property is. For land and buildings in the 20 municipalities,
            real property tax is a provincial tax: pay it at the treasurer’s office of the
            municipality where the property is located, which collects it for the Province, or ask
            the Provincial Treasurer’s Office. For property in Malaybalay City or Valencia City, pay
            the city treasurer. Bring your tax declaration or your last official receipt.
            <p>
              Paying for the whole year on or before 31 March may earn a discount where the LGU
              grants one. Requirements may vary, so confirm with the office.
            </p>
            <p>{link('/service-details/provincial-treasurer', 'Provincial Treasurer’s Office')}</p>
          </>
        ),
      },
      {
        question: 'What payment methods are accepted?',
        answer: (
          <>
            Ask the office where you will pay. Cash at the treasurer’s window is generally accepted,
            and some offices also accept other payment channels. BetterBukidnon.org cannot accept
            payments of any kind.
          </>
        ),
      },
    ],
  },
  {
    icon: 'people-fill',
    title: 'Social Services',
    entries: [
      {
        question: 'How do I apply for a Senior Citizen ID?',
        answer: (
          <>
            <p>
              Apply at the Office for Senior Citizens Affairs (OSCA) of your city or municipality.
              You usually need:
            </p>
            <ul>
              <li>Birth Certificate or any valid ID showing your age (60 and above)</li>
              <li>Recent ID photo</li>
              <li>Barangay Residence Certificate</li>
            </ul>
            <p>The ID is issued for free. Requirements may vary, so confirm with your OSCA.</p>
          </>
        ),
      },
      {
        question: 'What benefits do senior citizens receive?',
        answer: (
          <>
            Under the Expanded Senior Citizens Act (Republic Act No. 9994), senior citizens get a
            20% discount and VAT exemption on many goods and services, priority lanes, and other
            benefits. Ask your OSCA or city or municipal social welfare office about local programs.
          </>
        ),
      },
      {
        question: 'Where can I ask for financial or medical assistance?',
        answer: (
          <>
            Start with the social welfare office of your city or municipality. The Provincial Social
            Welfare and Development Office (PSWDO) at the Capitol also handles requests for
            assistance; call (088) 813-5734 to ask about the requirements.
            <p>{link('/service-details/pswdo', 'About the PSWDO')}</p>
          </>
        ),
      },
    ],
  },
  {
    icon: 'laptop',
    title: 'About This Website',
    entries: [
      {
        question: 'How can I volunteer?',
        answer: (
          <>
            Email {link('mailto:volunteer@betterbukidnon.org', 'volunteer@betterbukidnon.org')} and
            tell us how you would like to help: writing, translating into Filipino or Cebuano,
            checking facts, design or coding. Developers can also contribute on GitHub.
            <p>
              {link(
                'https://github.com/Better-Bukidnon/betterbukidnon',
                'BetterBukidnon on GitHub',
              )}
            </p>
          </>
        ),
      },
      {
        question: 'What languages is this website available in?',
        answer: (
          <>
            English, Filipino and Cebuano (Binisaya). Choose a language with the globe button at the
            top of each page. Some pages are not fully translated yet; untranslated text appears in
            English.
          </>
        ),
      },
      {
        question: 'I found a broken link or error on this website. How do I report it?',
        answer: (
          <>
            Thank you for helping us improve! Email{' '}
            {link('mailto:volunteer@betterbukidnon.org', 'volunteer@betterbukidnon.org')} with
            “Website Issue” as the subject. Describe the problem and include the page address if you
            can.
          </>
        ),
      },
      {
        question: 'Is this website mobile-friendly?',
        answer: <>Yes. BetterBukidnon.org works on mobile phones, tablets and desktop computers.</>,
      },
      {
        question: 'Who built BetterBukidnon.org?',
        answer: (
          <>
            BetterBukidnon.org is built and maintained by volunteers. It is adapted from an
            open-source civic portal template created by{' '}
            {link('https://ramonloganjr.com/', 'Ramon Logan Jr.')}, shared under the MIT and CC BY
            4.0 licenses.
            <p>
              Contributions are welcome from developers, researchers, designers, writers,
              translators and any Bukidnonon who wants to help.
            </p>
          </>
        ),
      },
    ],
  },
]

export function FaqPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: 'Home', link: { to: '/' } }, { label: 'FAQ' }]} />
      <PageHeader
        icon="question-circle-fill"
        badge="FAQ"
        title="Frequently Asked Questions"
        description="Common questions about government services in Bukidnon and about this website"
      />
      <section className="section-y">
        <div className="container-site">
          <div className="mx-auto max-w-[800px]">
            {categories.map((category) => (
              <section key={category.title} className="mb-8">
                <div className="mb-4 flex items-center gap-3 border-b-2 border-surface-alt pb-4">
                  <Icon name={category.icon} className="text-[1.25rem] text-primary" />
                  <h2 className="m-0 text-[1.125rem]">{category.title}</h2>
                </div>
                <div className="flex flex-col gap-2">
                  {category.entries.map((entry) => (
                    <details
                      key={entry.question}
                      className="group overflow-hidden rounded-lg border border-line bg-white"
                    >
                      <summary className="flex cursor-pointer list-none items-center justify-between p-4 font-medium hover:bg-surface-alt [&::-webkit-details-marker]:hidden">
                        <span>{entry.question}</span>
                        <Icon
                          name="chevron-down"
                          className="shrink-0 text-ink-light transition group-open:rotate-180"
                        />
                      </summary>
                      <div className="p-4 leading-[1.6] text-ink-light [&_p]:mb-3 [&_p:last-child]:mb-0 [&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-1.5">
                        {entry.answer}
                      </div>
                    </details>
                  ))}
                </div>
              </section>
            ))}
            <div className="flex items-center gap-6 rounded-xl bg-linear-135 from-primary to-secondary p-8 text-white max-sm:flex-col max-sm:items-start">
              <Icon name="chat-dots-fill" className="text-[2rem] opacity-80" />
              <div className="flex-1">
                <h2 className="mb-1 text-[1.125rem] text-white">Still have questions?</h2>
                <p className="m-0 text-[.9375rem] text-white/90">
                  For questions about provincial services, contact the Provincial Capitol. For
                  questions about this website, email the volunteers.
                </p>
              </div>
              <SiteLink
                href="/contact"
                className="rounded-site bg-white px-6 py-3 font-semibold text-primary no-underline hover:bg-surface-alt hover:text-primary"
              >
                Contact Us
              </SiteLink>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
