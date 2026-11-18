import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import { generateSW } from 'workbox-build'

const clientDirectory = fileURLToPath(new URL('../apps/web/dist/client/', import.meta.url))

// Error documents can be served at a URL that does not match the prerendered route. Keep them
// styled and linkable, but omit app scripts so React does not hydrate against a different path.
function writeStaticDocument(source: string, destination: string) {
  fs.writeFileSync(
    destination,
    fs
      .readFileSync(source, 'utf8')
      .replace(/<script\b[\s\S]*?<\/script>/g, '')
      .replace(/<link rel="modulepreload"[^>]*>/g, '')
      .replace(
        '</head>',
        '<style>@media(max-width:1024px){header #main-nav{visibility:visible!important;position:static!important;inset:auto!important;order:4!important;flex:0 0 100%!important;height:auto!important;transform:none!important;overflow:visible!important;border:0!important;opacity:1!important}header #main-nav>ul{gap:0!important}header #main-nav>ul>li{width:100%}header #main-nav a{display:flex!important;width:100%;padding:10px 16px!important}}header #main-nav ul ul{visibility:visible!important;position:static!important;min-width:0!important;max-height:none!important;transform:none!important;overflow:visible!important;padding:0 0 0 16px!important;opacity:1!important;box-shadow:none!important}header #main-nav ul ul a{display:flex!important;padding:8px 12px!important}header #main-nav li>button{display:none!important}header button[aria-label="Toggle Navigation"],header button[aria-controls]:not([aria-label]){display:none!important}</style></head>',
      ),
  )
}

writeStaticDocument(`${clientDirectory}offline/index.html`, `${clientDirectory}offline.html`)
writeStaticDocument(`${clientDirectory}404.html`, `${clientDirectory}404.html`)
for (const locale of ['fil', 'ceb']) {
  const localized404 = `${clientDirectory}${locale}/404.html`
  if (fs.existsSync(localized404)) writeStaticDocument(localized404, localized404)
}

const result = await generateSW({
  importScripts: ['/cleanup-legacy-caches.js'],
  globDirectory: clientDirectory,
  globPatterns: ['**/*.{css,html,ico,js,json,png,svg,webmanifest}'],
  // Lottie animations are large and only decorative, so they are fetched on demand.
  // Filipino and Cebuano pages are cached as they are visited (below) instead of on install,
  // so a first visit does not download every page three times.
  globIgnores: [
    'sw.js',
    'workbox-*.js',
    'animations/**',
    'data/**',
    'images/seals/**',
    'lgus/*/index.html',
    'barangays/*/*/index.html',
    'fil/**',
    'ceb/**',
  ],
  swDest: `${clientDirectory}sw.js`,
  // Pages are served without a trailing slash and may carry a query (/services?q=birth), so
  // precache each page under its URL (/services, not /services/index.html) and match it
  // without the query. Otherwise such navigations got the home page's HTML.
  manifestTransforms: [
    async (entries) => ({
      manifest: entries.map((entry) => ({
        ...entry,
        url: entry.url.endsWith('/index.html')
          ? entry.url.slice(0, -'/index.html'.length)
          : entry.url,
      })),
      warnings: [],
    }),
  ],
  ignoreURLParametersMatching: [/./],
  runtimeCaching: [
    {
      // Individual directory profiles stay available offline after they have been visited.
      urlPattern: ({ request, url }) =>
        request.mode === 'navigate' &&
        /^\/(?:lgus\/[^/]+|barangays\/[^/]+\/[^/]+)\/?$/.test(url.pathname),
      handler: 'NetworkFirst',
      options: {
        cacheName: 'directory-pages',
        expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 },
        precacheFallback: { fallbackURL: '/offline.html' },
      },
    },
    {
      // Directory seals are useful once visited but too large for every first offline install.
      urlPattern: ({ url }) => url.pathname.startsWith('/images/seals/'),
      handler: 'CacheFirst',
      options: {
        cacheName: 'directory-seals',
        expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 30 },
      },
    },
    {
      urlPattern: ({ request, url }) =>
        request.mode === 'navigate' && /^\/(fil|ceb)(\/|$)/.test(url.pathname),
      handler: 'NetworkFirst',
      options: {
        cacheName: 'localized-pages',
        expiration: { maxEntries: 60 },
        precacheFallback: { fallbackURL: '/offline.html' },
      },
    },
    {
      // Any other navigation is not a prerendered page: ask the network (which answers with
      // the 404 page) and show the offline page when there is no connection.
      urlPattern: ({ request }) => request.mode === 'navigate',
      handler: 'NetworkOnly',
      options: { precacheFallback: { fallbackURL: '/offline.html' } },
    },
  ],
  cleanupOutdatedCaches: true,
  clientsClaim: true,
  skipWaiting: false,
})

console.log(`Generated service worker for ${result.count} files (${result.size} bytes).`)
