import { createFileRoute } from '@tanstack/react-router'
import { contactDirectory } from '@/config/contact'
import { seo } from '@/lib/seo'
import { m } from '@/paraglide/messages'

export const Route = createFileRoute('/offline')({
  head: () =>
    seo({
      title: m.seo_offline_title(),
      description: m.seo_home_description(),
      path: '/offline',
      noindex: true,
    }),

  component: () => (
    <main
      id="main-content"
      className="mx-auto flex min-h-screen w-full max-w-[600px] flex-col items-center px-4 py-8 text-center"
    >
      <a href="#main-content" className="sr-only focus:not-sr-only">
        Skip to main content
      </a>
      <div className="mb-6 flex h-[60px] w-[200px] items-center justify-center rounded-lg bg-primary text-[1.125rem] font-bold text-white">
        BetterBukidnon
      </div>
      <h1 className="mb-2 text-[1.5rem] text-primary">You are currently offline</h1>
      <p className="mb-8 leading-6 text-ink-light">
        Some pages may not be available right now. Emergency hotlines are listed below for your
        convenience.
      </p>
      <section className="mb-8 w-full rounded-lg border border-line bg-white p-6 text-left">
        <h2 className="mb-4 text-center text-[1.1rem] text-primary">
          Emergency Hotlines for Bukidnon
        </h2>
        <ul className="divide-y divide-surface-alt">
          {[
            ...contactDirectory.hotlines,
            { label: 'Provincial Capitol', display: '(088) 813-5741', href: 'tel:+63888135741' },
          ].map((item) => (
            <li
              key={item.label}
              className="flex items-center justify-between py-3 max-[480px]:flex-col max-[480px]:items-start"
            >
              <span className="font-semibold">{item.label}</span>
              <a href={item.href} className="font-semibold text-primary">
                {item.display}
              </a>
            </li>
          ))}
        </ul>
      </section>
      <button
        type="button"
        onClick={() => window.location.reload()}
        className="rounded-md bg-primary px-8 py-3 text-base font-semibold text-white hover:bg-primary-dark"
      >
        Try Again
      </button>
    </main>
  ),
})
