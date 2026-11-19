'use client';

import { useRef, useState, type ReactNode } from 'react';
import { NewsCard } from '@/features/news/NewsCard';
import { BADGES, news, parseNews, type Badge, type NewsItem } from '@/features/news/newsData';
import {
  LIMITS,
  PRESET_BADGE,
  emptyDraft,
  slugify,
  toDraft,
  toJson,
  uniqueId,
  validate,
  type Draft,
  type Errors,
  type Field,
} from '@/features/news/newsDraft';
import { buttonPrimary, card } from '@/shared/ui';

const today = () => new Date().toISOString().slice(0, 10);
const input = 'min-h-11 w-full rounded-base border bg-bg px-sm text-text';
const button =
  'min-h-11 rounded-base border border-black/15 bg-bg px-sm font-medium hover:border-primary';

/**
 * Dev-only news curation tool (port of fce5da9:admin/news-editor.html). Exists only under
 * `next dev` (app/admin/news-editor/page.dev.tsx); the preview is the NewsCard the site ships.
 */
export function NewsEditor() {
  const [entries, setEntries] = useState<NewsItem[]>(news);
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft>(() => emptyDraft(today()));
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<{ text: string; ok: boolean }>();
  const fileInput = useRef<HTMLInputElement>(null);

  const otherIds = entries.filter((e) => e.id !== editing).map((e) => e.id);
  const say = (text: string, ok = true) => setStatus({ text, ok });
  const reset = () => {
    setEditing(null);
    setDraft(emptyDraft(today()));
    setErrors({});
  };
  const load = (items: NewsItem[], message: string) => {
    setEntries(items);
    reset();
    say(message);
  };

  const set = (field: Field, value: string) =>
    setDraft((d) => {
      const next = { ...d, [field]: value };
      if (field === 'title' && editing === null) next.id = uniqueId(slugify(value), otherIds);
      if (field === 'category' && PRESET_BADGE[value.trim().toLowerCase()]) {
        next.badge = PRESET_BADGE[value.trim().toLowerCase()];
      }
      return next;
    });

  const save = () => {
    const { item, errors } = validate(draft, otherIds);
    setErrors(errors);
    if (!item) return say('Please fix the highlighted fields.', false);
    setEntries((list) =>
      editing === null ? [...list, item] : list.map((e) => (e.id === editing ? item : e))
    );
    say(
      `${editing === null ? 'Added' : 'Updated'} “${item.title}”. Remember to Download news.json.`
    );
    reset();
  };

  const remove = (item: NewsItem) => {
    if (!confirm(`Delete “${item.title}”?`)) return;
    setEntries((list) => list.filter((e) => e !== item));
    if (editing === item.id) reset();
    say('Deleted. Remember to Download news.json.');
  };

  const download = () => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([toJson(entries)], { type: 'application/json' }));
    a.download = 'news.json';
    a.click();
    URL.revokeObjectURL(a.href);
    say('Downloaded news.json: replace src/content/data/news.json and rebuild.');
  };

  const importFile = async (file: File | undefined) => {
    if (!file) return;
    try {
      const items = parseNews(JSON.parse(await file.text()));
      load(items, `Imported ${items.length} entries from file.`);
    } catch (e) {
      say(`Invalid news file: ${e instanceof Error ? e.message : String(e)}`, false);
    }
  };

  const preview: NewsItem = {
    id: 'preview',
    title: draft.title || 'Title preview',
    date: /^\d{4}-\d{2}-\d{2}$/.test(draft.date) ? draft.date : today(),
    category: draft.category || 'Category',
    badge: BADGES.find((b) => b === draft.badge) ?? ('info' satisfies Badge),
    summary: draft.summary || 'Summary preview…',
    ...(/^https?:\/\//i.test(draft.url)
      ? { url: draft.url, source: draft.source || undefined }
      : {}),
  };

  const text = (
    field: Field,
    label: ReactNode,
    props: { max?: number; type?: string; hint?: string; list?: string } = {}
  ) => {
    const id = `f-${field}`;
    const Tag = field === 'summary' ? 'textarea' : 'input';
    return (
      <div className="mb-sm">
        <label htmlFor={id} className="mb-1 block text-sm font-semibold">
          {label}
        </label>
        <Tag
          id={id}
          type={Tag === 'input' ? (props.type ?? 'text') : undefined}
          list={props.list}
          value={draft[field]}
          maxLength={props.max}
          onChange={(e) => set(field, e.target.value)}
          aria-invalid={!!errors[field]}
          aria-describedby={`${id}-hint`}
          className={`${input} ${Tag === 'textarea' ? 'min-h-24 py-xs' : ''} ${errors[field] ? 'border-danger' : 'border-black/15'}`}
        />
        <p id={`${id}-hint`} className="mt-1 text-xs text-text-light">
          {props.max && `${draft[field].length}/${props.max}. `}
          {props.hint}
          {errors[field] && (
            <span className="block font-semibold text-danger">{errors[field]}</span>
          )}
        </p>
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-site px-sm py-lg">
      <div className="mb-md flex flex-wrap items-center gap-xs">
        <h1 className="mr-auto text-2xl font-bold">
          News Curation{' '}
          <span className="text-sm font-normal text-text-light">dev only · not deployed</span>
        </h1>
        <button
          type="button"
          className={button}
          onClick={() => load(news, `Loaded ${news.length} entries from news.json.`)}
        >
          Reload from news.json
        </button>
        <button type="button" className={button} onClick={() => fileInput.current?.click()}>
          Import file…
        </button>
        <input
          ref={fileInput}
          type="file"
          accept="application/json,.json"
          aria-label="Import news.json file"
          hidden
          onChange={(e) => {
            importFile(e.target.files?.[0]);
            e.target.value = '';
          }}
        />
        <button
          type="button"
          className={button}
          onClick={() =>
            navigator.clipboard.writeText(toJson(entries)).then(
              () => say('JSON copied to clipboard.'),
              () => say('Copy failed: use Download instead.', false)
            )
          }
        >
          Copy JSON
        </button>
        <button type="button" className={buttonPrimary} onClick={download}>
          Download news.json
        </button>
      </div>
      <p
        role="status"
        className={`mb-sm text-sm ${status?.ok === false ? 'text-danger' : 'text-success'}`}
      >
        {status?.text}
      </p>

      <div className="grid items-start gap-md md:grid-cols-[minmax(280px,360px)_1fr]">
        <section aria-labelledby="entries-title" className={card}>
          <h2 id="entries-title" className="mb-sm font-semibold">
            Entries ({entries.length})
          </h2>
          <button type="button" className={`${button} mb-sm w-full`} onClick={reset}>
            + Add new update
          </button>
          {!entries.length && (
            <p className="text-sm text-text-light">No updates yet. Click “Add new update”.</p>
          )}
          <ul className="space-y-xs">
            {[...entries]
              .sort((a, b) => b.date.localeCompare(a.date))
              .map((e) => (
                <li
                  key={e.id}
                  className={`rounded-base border p-xs ${e.id === editing ? 'border-primary' : 'border-black/10'}`}
                >
                  <strong className="block text-sm">{e.title}</strong>
                  <span className="text-xs text-text-light">
                    {e.category} · {e.badge} · {e.date}
                    {e.url ? ' · link' : ''}
                  </span>
                  <div className="mt-1 flex gap-xs">
                    <button
                      type="button"
                      className={button}
                      onClick={() => (setEditing(e.id), setDraft(toDraft(e)), setErrors({}))}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className={`${button} text-danger`}
                      onClick={() => remove(e)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
          </ul>
        </section>

        <section aria-labelledby="form-title" className={card}>
          <h2 id="form-title" className="mb-sm font-semibold">
            {editing === null ? 'Add update' : 'Edit update'}
          </h2>
          <form
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              save();
            }}
          >
            {text('title', 'Title', { max: LIMITS.title })}
            <div className="grid gap-sm sm:grid-cols-2">
              {text('date', 'Date', { type: 'date' })}
              <div className="mb-sm">
                <label htmlFor="f-badge" className="mb-1 block text-sm font-semibold">
                  Badge color
                </label>
                <select
                  id="f-badge"
                  value={draft.badge}
                  onChange={(e) => set('badge', e.target.value)}
                  className={`${input} border-black/15`}
                >
                  <option value="info">info (blue)</option>
                  <option value="success">success (green)</option>
                  <option value="warning">warning (amber)</option>
                </select>
              </div>
            </div>
            {text('category', 'Category label', {
              max: LIMITS.category,
              list: 'category-presets',
              hint: 'Presets auto-pick a badge color; you can override it above.',
            })}
            <datalist id="category-presets">
              {Object.keys(PRESET_BADGE).map((p) => (
                <option key={p} value={p[0].toUpperCase() + p.slice(1)} />
              ))}
            </datalist>
            {text('summary', 'Summary', { max: LIMITS.summary })}
            {text('url', 'Link URL (optional, e.g. the Facebook post)', { type: 'url' })}
            {text('source', 'Link label (optional)', {
              max: LIMITS.source,
              hint: 'Shown on the link. Defaults to “Read more” when a URL is set.',
            })}
            {text('id', 'ID (auto from title; must be unique)', { max: LIMITS.id })}
            <div className="flex gap-xs">
              <button type="submit" className={buttonPrimary}>
                Save update
              </button>
              <button type="button" className={button} onClick={reset}>
                Cancel
              </button>
            </div>
          </form>
          <h2 className="mt-md mb-sm border-t border-dashed border-black/15 pt-sm font-semibold">
            Live preview (News page card)
          </h2>
          <div className="max-w-[24rem]">
            <NewsCard item={preview} />
          </div>
        </section>
      </div>
    </div>
  );
}
