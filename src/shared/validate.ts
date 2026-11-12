/** Tiny build-time guards for src/content/data/*.json. A failed check throws, failing `next build`. */
export type Obj = Record<string, unknown>;

export const isObj = (v: unknown): v is Obj =>
  typeof v === 'object' && v !== null && !Array.isArray(v);
export const isText = (v: unknown): v is string => typeof v === 'string' && v.trim() !== '';
export const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);
/** External links must be http(s) (no javascript:, data: …). */
export const isHttpUrl = (v: unknown): v is string => isText(v) && /^https?:\/\//i.test(v);
/** Hrefs content may use: site paths, fragments, http(s), mailto: and tel:. */
export const isSafeHref = (v: unknown): v is string =>
  isText(v) && /^(\/|#|https?:\/\/|mailto:|tel:)/i.test(v.trim());
export const isIsoDate = (v: unknown): v is string =>
  isText(v) && /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v));

export function check(ok: unknown, message: string): asserts ok {
  if (!ok) throw new Error(message);
}

/** `data[key]` as an array of objects, or a clear error naming the file. */
export function list(data: unknown, file: string, key: string): Obj[] {
  const value = isObj(data) ? data[key] : undefined;
  check(
    Array.isArray(value) && value.every(isObj),
    `${file}: "${key}" must be an array of objects`
  );
  return value;
}

export interface Source {
  name: string;
  url: string;
}

export function parseSources(data: unknown, file: string): Source[] {
  return list(data, file, 'sources').map((s, i) => {
    check(
      isText(s.name) && isHttpUrl(s.url),
      `${file}: sources[${i}] needs a name and an http(s) url`
    );
    return { name: s.name, url: s.url };
  });
}
