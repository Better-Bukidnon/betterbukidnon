import type { MDXContent } from 'mdx/types';
import type { Locale } from '@/features/i18n/locales';
import { ContactCard } from '@/features/service-details/ContactCard';
import type { OfficeFrontmatter } from '@/features/service-details/frontmatter';
import { LocalizedOffice } from '@/features/service-details/LocalizedOffice';
import { categoryCrumb } from '@/features/services/categories';

/** The one template behind all /service-details/<slug> pages. */
export function OfficePage({
  fm,
  Content,
  translated,
}: {
  fm: OfficeFrontmatter;
  Content: MDXContent;
  translated: Locale[];
}) {
  const parent =
    fm.category === 'government'
      ? { href: '/government', label: { chrome: 'nav-government' as const } }
      : { href: `/services/${fm.category}`, label: { services: categoryCrumb(fm.category) } };

  return (
    <>
      <LocalizedOffice
        slug={fm.slug}
        translated={translated}
        head={{ title: fm.title, summary: fm.summary, badge: fm.badge }}
        parent={parent}
      >
        <Content />
      </LocalizedOffice>
      <div className="mx-auto max-w-site px-sm pb-xl">
        <ContactCard fm={fm} />
      </div>
    </>
  );
}
