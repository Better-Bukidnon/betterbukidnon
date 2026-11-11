import type { ReactNode } from 'react';
import { container, sectionPad } from '@/shared/ui';

/**
 * Full-bleed band with the page-width column inside. `tint` is for grouping a run of related
 * content, not for alternating colours: do not tint just because the section above was plain.
 */
export function Section({
  tone = 'plain',
  id,
  labelledBy,
  children,
}: {
  tone?: 'plain' | 'tint';
  id?: string;
  labelledBy?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={tone === 'tint' ? 'bg-bg-alt' : undefined}
    >
      <div className={`${container} ${sectionPad}`}>{children}</div>
    </section>
  );
}
