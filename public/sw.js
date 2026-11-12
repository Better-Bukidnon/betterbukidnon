/**
 * BetterBukidnon service worker. scripts/postbuild.js writes out/sw.js from this file and fills
 * in CACHE_VERSION (a hash of the precached files) and PRECACHE_URLS (core routes, /offline and
 * the /_next/static assets they load). A new version deletes every other cache, including the
 * legacy `betterbukidnon-*` ones.
 */
const CACHE_VERSION = '__CACHE_VERSION__';
const PRECACHE_URLS = [];
const STATIC_CACHE = `bb-static-${CACHE_VERSION}`;
const RUNTIME_CACHE = `bb-runtime-${CACHE_VERSION}`;
const OFFLINE_URL = '/offline';
const RUNTIME_LIMIT = 80;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((names) =>
        Promise.all(
          names
            .filter((name) => name !== STATIC_CACHE && name !== RUNTIME_CACHE)
            .map((name) => caches.delete(name))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

function putRuntime(request, response) {
  if (!response.ok) return;
  const copy = response.clone();
  caches.open(RUNTIME_CACHE).then(async (cache) => {
    await cache.put(request, copy);
    const keys = await cache.keys();
    await Promise.all(
      keys.slice(0, Math.max(0, keys.length - RUNTIME_LIMIT)).map((k) => cache.delete(k))
    );
  });
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  if (request.method !== 'GET' || !url.protocol.startsWith('http')) return;

  // Pages: network first, then the cached copy, then offline.html.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => (putRuntime(request, response), response))
        .catch(() => caches.match(request).then((cached) => cached || caches.match(OFFLINE_URL)))
    );
    return;
  }

  // Cross-origin (Open-Meteo): left to the browser. WeatherWidget already caches it in
  // localStorage, and a second copy here could serve stale data.
  if (url.origin !== self.location.origin) return;

  // Hashed build output never changes: cache first.
  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(
      caches
        .match(request)
        .then((cached) => cached || fetch(request).then((r) => (putRuntime(request, r), r)))
    );
    return;
  }

  // Other same-origin files: stale-while-revalidate.
  event.respondWith(
    caches.match(request).then((cached) => {
      const fresh = fetch(request).then(
        (response) => (putRuntime(request, response), response),
        () => cached
      );
      return cached || fresh;
    })
  );
});
