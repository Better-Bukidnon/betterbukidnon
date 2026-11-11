'use client';

import { useRef, useState, type KeyboardEvent } from 'react';
import { Search } from 'react-bootstrap-icons';
import { ProjectCard, hostOf, useProjectText } from '@/features/projects/ProjectCard';
import { ProjectDialog } from '@/features/projects/ProjectDialog';
import { projects, type Project } from '@/features/projects/projectsData';
import { PageHero } from '@/shared/PageHero';
import { section } from '@/shared/ui';

const STATUSES = ['active', 'development', 'archived'] as const;
type Status = (typeof STATUSES)[number];

const unique = (list: string[]) => [...new Set(list.filter(Boolean))];
const field =
  'min-h-11 w-full rounded-base border border-black/15 bg-bg px-sm text-text focus:border-primary';

/**
 * Status tabs, search and repo/category filters (port of legacy projects.js). Search and both
 * filters combine with the selected tab, and the tab counts reflect the search and filters.
 */
export function ProjectsPage({ items = projects }: { items?: Project[] }) {
  const text = useProjectText();
  const { t } = text;
  const [status, setStatus] = useState<Status>('active');
  const [query, setQuery] = useState('');
  const [repo, setRepo] = useState('');
  const [category, setCategory] = useState('');
  const [open, setOpen] = useState<Project | null>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const q = query.trim().toLowerCase();
  const filtered = items.filter((p) => {
    const repos = p.repos.map((r) => r.name);
    if (repo && !repos.includes(repo)) return false;
    if (category && p.category !== category) return false;
    const haystack = [
      text.name(p),
      text.desc(p),
      ...repos,
      text.category(p.category),
      hostOf(p.url),
    ];
    return !q || haystack.join(' ').toLowerCase().includes(q);
  });
  const visible = filtered.filter((p) => p.status === status);

  const onTabKey = (e: KeyboardEvent, index: number) => {
    const last = STATUSES.length - 1;
    const next = {
      ArrowRight: index === last ? 0 : index + 1,
      ArrowLeft: index ? index - 1 : last,
      Home: 0,
      End: last,
    }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    setStatus(STATUSES[next]);
    tabs.current[next]?.focus();
  };

  return (
    <>
      <PageHero
        crumbs={[{ label: t('proj-home'), href: '/' }, { label: t('proj-title') }]}
        title={t('proj-title')}
        description={t('proj-subtitle')}
      />
      <section className={section}>
        <div
          role="tablist"
          aria-labelledby="projects-tabs-label"
          className="mb-md flex flex-wrap gap-xs"
        >
          <span id="projects-tabs-label" className="sr-only">
            {t('proj-tabs-label')}
          </span>
          {STATUSES.map((s, i) => {
            const on = s === status;
            return (
              <button
                key={s}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`tab-${s}`}
                aria-selected={on}
                aria-controls="projects-panel"
                tabIndex={on ? 0 : -1}
                onClick={() => setStatus(s)}
                onKeyDown={(e) => onTabKey(e, i)}
                className={`inline-flex min-h-11 items-center gap-xs rounded-full px-md font-semibold ${on ? 'bg-primary text-white' : 'bg-bg-alt text-text hover:bg-primary/10'}`}
              >
                {t(`proj-tab-${s}`)}
                <span className={`rounded-full px-2 text-xs ${on ? 'bg-white/20' : 'bg-bg'}`}>
                  {filtered.filter((p) => p.status === s).length}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mb-sm grid gap-sm md:grid-cols-[2fr_1fr_1fr]">
          <div>
            <label htmlFor="projects-search" className="mb-1 block text-sm font-semibold">
              {t('proj-search-label')}
            </label>
            <div className="relative">
              <Search
                aria-hidden
                className="absolute top-1/2 left-sm -translate-y-1/2 text-text-light"
              />
              <input
                type="search"
                id="projects-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('proj-search-placeholder')}
                autoComplete="off"
                className={`${field} pl-xl`}
              />
            </div>
          </div>
          <div>
            <label htmlFor="projects-repo" className="mb-1 block text-sm font-semibold">
              {t('proj-filter-repo-label')}
            </label>
            <select
              id="projects-repo"
              value={repo}
              onChange={(e) => setRepo(e.target.value)}
              className={field}
            >
              <option value="">{t('proj-all-repos')}</option>
              {unique(items.flatMap((p) => p.repos.map((r) => r.name))).map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="projects-category" className="mb-1 block text-sm font-semibold">
              {t('proj-filter-category-label')}
            </label>
            <select
              id="projects-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={field}
            >
              <option value="">{t('proj-all-categories')}</option>
              {unique(items.map((p) => p.category)).map((c) => (
                <option key={c} value={c}>
                  {text.category(c)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <p aria-live="polite" className="mb-sm text-sm text-text-light">
          {t('proj-showing', { count: visible.length })}
        </p>
        <div id="projects-panel" role="tabpanel" aria-labelledby={`tab-${status}`} tabIndex={0}>
          {visible.length ? (
            <ul className="grid gap-md sm:grid-cols-2 lg:grid-cols-3">
              {visible.map((p) => (
                <ProjectCard key={p.id} project={p} text={text} onDetails={() => setOpen(p)} />
              ))}
            </ul>
          ) : (
            <p className="rounded-base bg-bg-alt p-md text-center text-text-light">
              {t('proj-empty')}
            </p>
          )}
        </div>
      </section>
      <ProjectDialog project={open} text={text} onClose={() => setOpen(null)} />
    </>
  );
}
