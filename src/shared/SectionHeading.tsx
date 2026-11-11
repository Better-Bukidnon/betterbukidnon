import type { ReactNode } from 'react';
import { ArrowRight } from 'react-bootstrap-icons';

/**
 * The one section heading: an h2 on the left, an optional "view all" link on the right and an
 * optional intro below. No eyebrow pill, because the h2 already names the section.
 */
export function SectionHeading({
  title,
  id,
  href,
  linkText,
  children,
}: {
  title: string;
  id?: string;
  href?: string;
  linkText?: string;
  children?: ReactNode;
}) {
  return (
    <div className="mb-md">
      <div className="flex flex-wrap items-end justify-between gap-x-sm gap-y-xs">
        <h2 id={id} className="text-heading font-bold">
          {title}
        </h2>
        {href && linkText && (
          <a href={href} className="inline-flex min-h-11 items-center gap-1 font-semibold">
            {linkText} <ArrowRight aria-hidden />
          </a>
        )}
      </div>
      {children && <div className="mt-xs max-w-3xl text-text-light">{children}</div>}
    </div>
  );
}
