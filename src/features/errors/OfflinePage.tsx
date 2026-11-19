import en from '@/features/errors/i18n/en.json';

const HOTLINES = [
  ['offline-national-emergency', 'tel:911', '911'],
  ['offline-pdrrmd', 'tel:+63888131262', '(088) 813-1262'],
  ['offline-police-pnp', 'tel:+63888134263', '(088) 813-4263'],
  ['offline-fire-bfp', 'tel:+63888135449', '(088) 813-5449'],
  ['offline-pho', 'tel:+63888135631', '(088) 813-5631'],
  ['offline-pswdo', 'tel:+63888135734', '(088) 813-5734'],
  ['offline-provincial-hall', 'tel:+63888135741', '(088) 813-5741'],
] as const;

/**
 * The service worker's fallback for a failed navigation. A server component in English only:
 * scripts/postbuild.js strips every <script> from offline.html, so it never hydrates under
 * the URL it is served for and needs no JS chunk. "Try Again" is a GET form with no action,
 * which reloads that URL without JS.
 */
export function OfflinePage() {
  return (
    <section className="mx-auto max-w-2xl px-sm py-xl text-center">
      <h1 className="mb-sm text-3xl font-bold">{en['offline-you-are-currently-offline']}</h1>
      <p className="mb-md text-text-light">
        {en['offline-some-pages-may-not-be-available-right-now']}
      </p>
      <div className="mb-md rounded-base border border-black/5 bg-bg-alt p-md text-left">
        <h2 className="mb-sm text-xl font-semibold">{en['offline-emergency-hotlines-bukidnon']}</h2>
        <ul aria-label="Emergency contact numbers" className="divide-y divide-black/5">
          {HOTLINES.map(([label, href, number]) => (
            <li key={href} className="flex min-h-11 items-center justify-between gap-sm">
              <span>{en[label]}</span>
              <a href={href} className="font-semibold">
                {number}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <form>
        <button
          type="submit"
          className="inline-flex min-h-11 items-center rounded-base bg-primary px-md font-semibold text-white hover:bg-primary-dark"
        >
          Try Again
        </button>
      </form>
    </section>
  );
}
