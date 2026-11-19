import { ArrowRight } from 'react-bootstrap-icons';
import { formatNewsDate, type Badge, type NewsItem } from '@/features/news/newsData';
import { card } from '@/shared/ui';

// Dark text on a tint keeps every badge AA, including the accent one.
const BADGE_CLASS: Record<Badge, string> = {
  info: 'bg-info/15',
  success: 'bg-success/15',
  warning: 'bg-accent/20',
};

const external = { target: '_blank', rel: 'noopener noreferrer' } as const;

export function NewsCard({ item }: { item: NewsItem }) {
  return (
    <article className={`${card} flex flex-col`}>
      <div className="mb-xs flex flex-wrap items-center gap-xs text-xs">
        <span
          className={`rounded-sm px-2.5 py-0.5 font-semibold text-text ${BADGE_CLASS[item.badge]}`}
        >
          {item.category}
        </span>
        <time dateTime={item.date} className="text-text-light">
          {formatNewsDate(item.date)}
        </time>
      </div>
      <h3 className="mb-xs text-lg font-semibold">
        {item.url ? (
          <a href={item.url} {...external} className="text-text hover:text-primary">
            {item.title}
          </a>
        ) : (
          item.title
        )}
      </h3>
      <p className="mb-sm text-sm text-text-light">{item.summary}</p>
      {item.url && (
        <a
          href={item.url}
          {...external}
          className="mt-auto inline-flex min-h-11 items-center gap-1 text-sm font-semibold"
        >
          {item.source ?? 'Read more'} <ArrowRight aria-hidden />
        </a>
      )}
    </article>
  );
}
