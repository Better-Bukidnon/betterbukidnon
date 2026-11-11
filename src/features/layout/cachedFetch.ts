interface Cached<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

/**
 * Fresh cache, else network, else the last known value (even if stale), else null.
 * Cache keys and shape match legacy/assets/js/info-bar.js, so both share one cache.
 */
export async function cachedFetch<T>(
  key: string,
  ttl: number,
  fetcher: () => Promise<T>
): Promise<T | null> {
  let hit: Cached<T> | null = null;
  try {
    hit = JSON.parse(localStorage.getItem(key) ?? 'null');
  } catch {}
  if (hit && Date.now() - hit.timestamp <= hit.ttl) return hit.data;
  try {
    const data = await fetcher();
    try {
      localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now(), ttl }));
    } catch {}
    return data;
  } catch {
    return hit?.data ?? null;
  }
}
