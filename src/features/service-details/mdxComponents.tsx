import type { MDXComponents } from 'mdx/types';
import type { ComponentProps, ReactNode } from 'react';
import { InfoCircleFill } from 'react-bootstrap-icons';
import { card, tableWrap } from '@/shared/ui';
import { isSafeHref } from '@/shared/validate';

type Titled = { title?: string; children?: ReactNode };

/** Renders only allowlisted schemes; anything else (javascript:, data: …) becomes plain text. */
function Link({ href = '', children, ...rest }: ComponentProps<'a'>) {
  if (!isSafeHref(href)) return <span>{children}</span>;
  const external = /^https?:/.test(href);
  return (
    <a href={href} {...(external && { target: '_blank', rel: 'noopener noreferrer' })} {...rest}>
      {children}
    </a>
  );
}

/** Responsive card grid. */
function ServiceList({ children }: { children?: ReactNode }) {
  return <div className="mb-md grid gap-md md:grid-cols-2 lg:grid-cols-3">{children}</div>;
}

function Service({ title, children }: Titled) {
  return (
    <div className={`${card} [&>p:last-child]:mb-0 [&>ul:last-child]:mb-0`}>
      {title && <h3 className="mb-xs text-lg font-semibold">{title}</h3>}
      {children}
    </div>
  );
}

/** Checklist card for documents to bring. */
function Requirements({ title, children }: Titled) {
  return (
    <div
      className={`${card} mb-md border-l-4 border-l-success [&_ul]:list-none [&_ul]:pl-0 [&_ul>li]:before:mr-xs [&_ul>li]:before:font-bold [&_ul>li]:before:text-success [&_ul>li]:before:content-['✓']`}
    >
      {title && <h3 className="mb-xs text-lg font-semibold">{title}</h3>}
      {children}
    </div>
  );
}

/** Numbered process; the MDX body is an ordered list. */
function Steps({ children }: { children?: ReactNode }) {
  return (
    <div className="mb-md [&_ol]:space-y-sm [&_ol>li]:rounded-base [&_ol>li]:bg-bg-alt [&_ol>li]:p-sm">
      {children}
    </div>
  );
}

const cellLink = /^\[(.+)\]\((.+)\)$/;
function Cell({ value }: { value: string }) {
  const m = cellLink.exec(value);
  return m ? <Link href={m[2]}>{m[1]}</Link> : value;
}

/** Fee or process table; scrolls sideways on small screens. */
function Fees({ head, rows }: { head?: string[]; rows: string[][] }) {
  return (
    <div className={`${tableWrap} mb-md`}>
      <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
        {head && (
          <thead className="bg-primary text-white">
            <tr>
              {head.map((h) => (
                <th key={h} scope="col" className="p-sm font-semibold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-t border-black/5 even:bg-bg-alt">
              {row.map((c, j) => (
                <td key={j} className="p-sm align-top">
                  <Cell value={c} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Callout({ title, children }: Titled) {
  return (
    <div
      role="note"
      className="mb-md flex gap-xs rounded-base border-l-4 border-info bg-bg-alt p-md [&_p:last-child]:mb-0"
    >
      <InfoCircleFill aria-hidden className="mt-1 shrink-0 text-info" />
      <div>
        {title && <p className="mb-xs font-semibold">{title}</p>}
        {children}
      </div>
    </div>
  );
}

/** Native disclosure: keyboard and screen-reader friendly without JS. */
function Faq({ q, children }: { q: string; children?: ReactNode }) {
  return (
    <details className={`${card} mb-sm py-0`}>
      <summary className="flex min-h-11 cursor-pointer items-center font-semibold">{q}</summary>
      <div className="pb-sm [&_p:last-child]:mb-0">{children}</div>
    </details>
  );
}

/** Everything an office MDX body may use; wired in through src/mdx-components.tsx. */
export const officeMdxComponents = {
  h2: ({ children }) => (
    <h2 className="mb-sm mt-xl text-2xl font-semibold first:mt-0">{children}</h2>
  ),
  h3: ({ children }) => <h3 className="mb-xs mt-md text-lg font-semibold">{children}</h3>,
  p: (props) => <p className="mb-sm" {...props} />,
  ul: (props) => <ul className="mb-sm list-disc space-y-1 pl-md" {...props} />,
  ol: (props) => <ol className="mb-sm list-decimal space-y-1 pl-md" {...props} />,
  a: Link,
  ServiceList,
  Service,
  Requirements,
  Steps,
  Fees,
  Callout,
  Faq,
} satisfies MDXComponents;
