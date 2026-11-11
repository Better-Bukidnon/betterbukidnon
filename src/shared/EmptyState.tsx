import type { ReactNode } from 'react';
import { BoxArrowUpRight, Inbox } from 'react-bootstrap-icons';

/** Shown when a data file is empty; always links to the official source. */
export function EmptyState({
  title,
  children,
  sourceHref,
  sourceLabel,
}: {
  title: string;
  children?: ReactNode;
  sourceHref: string;
  sourceLabel: string;
}) {
  return (
    <div className="rounded-base border border-dashed border-black/15 bg-bg-alt p-lg text-center">
      <Inbox aria-hidden className="mx-auto mb-sm text-3xl text-text-light" />
      <h3 className="mb-xs text-lg font-semibold">{title}</h3>
      {children && <p className="mx-auto mb-sm max-w-[36rem] text-text-light">{children}</p>}
      <a
        href={sourceHref}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-11 items-center gap-xs font-semibold"
      >
        {sourceLabel} <BoxArrowUpRight aria-hidden />
      </a>
    </div>
  );
}
