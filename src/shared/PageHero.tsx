import Link from 'next/link';
import type { ReactNode } from 'react';

export interface Crumb {
  label: string;
  /** Omitted for the current page. */
  href?: string;
}

/**
 * Breadcrumb, title and intro at the top of every inner page. Deliberately light: the solid
 * brand band belongs to the home page, so inner pages give the content room on small screens.
 */
export function PageHero({
  crumbs,
  title,
  description,
}: {
  crumbs: Crumb[];
  title: string;
  description?: ReactNode;
}) {
  return (
    <header className="border-b border-black/10 bg-bg-alt">
      <div className="mx-auto max-w-site px-sm pt-sm pb-lg md:pb-xl">
        <nav aria-label="Breadcrumb" className="mb-sm text-sm">
          <ol className="flex flex-wrap gap-xs text-text-light">
            {crumbs.map((c) => (
              <li key={c.label} aria-current={c.href ? undefined : 'page'}>
                {c.href ? (
                  <>
                    <Link href={c.href}>{c.label}</Link> <span aria-hidden>/</span>
                  </>
                ) : (
                  c.label
                )}
              </li>
            ))}
          </ol>
        </nav>
        <h1 className="mb-xs text-title font-bold">{title}</h1>
        {description && <p className="max-w-3xl text-lg text-text-light">{description}</p>}
      </div>
    </header>
  );
}
