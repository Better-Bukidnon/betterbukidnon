import raw from '@/content/data/services.json';

export interface Service {
  id: string;
  title: string;
  category: string;
  categoryId: string;
  description: string;
  keywords: string[];
  fee?: string;
  processingTime?: string;
  office?: string;
  /** Clean site URL, e.g. /service-details/pswdo */
  url: string;
}

const isText = (v: unknown): v is string => typeof v === 'string' && v.trim() !== '';

/** "../service-details/pswdo.html" or "../government/" -> "/service-details/pswdo", "/government". */
const cleanUrl = (url: string) => '/' + url.replace(/^\.\.\//, '').replace(/(\.html|\/)$/, '');

/** Throws at build time, so a malformed services.json never ships a broken search. */
export function parseServices(data: unknown): Service[] {
  const list = (data as { services?: unknown })?.services;
  if (!Array.isArray(list)) throw new Error('services.json: "services" must be an array');
  return list.map((s, i) => {
    const where = `services.json: services[${i}]`;
    for (const field of ['id', 'title', 'category', 'categoryId', 'description', 'url']) {
      if (!isText(s?.[field])) throw new Error(`${where}.${field} must be a non-empty string`);
    }
    if (!Array.isArray(s.keywords) || !s.keywords.every(isText)) {
      throw new Error(`${where}.keywords must be a list of strings`);
    }
    const url = cleanUrl(s.url);
    if (!/^\/[a-z0-9/-]*$/.test(url)) throw new Error(`${where}.url "${s.url}" is not a site path`);
    return { ...s, url } as Service;
  });
}

export const services = parseServices(raw);

// Matching and scoring below are ported as-is from legacy/assets/js/search.js.

export function tokenize(text: string | undefined): string[] {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 2);
}

function levenshtein(a: string, b: string): number {
  let prev = Array.from({ length: a.length + 1 }, (_, j) => j);
  for (let i = 1; i <= b.length; i++) {
    const row = [i];
    for (let j = 1; j <= a.length; j++) {
      row[j] = b[i - 1] === a[j - 1] ? prev[j - 1] : Math.min(prev[j - 1], row[j - 1], prev[j]) + 1;
    }
    prev = row;
  }
  return prev[a.length];
}

export function isFuzzyMatch(term: string, target: string, threshold = 0.3): boolean {
  if (target.includes(term) || term.includes(target)) return true;
  const similarity = 1 - levenshtein(term, target) / Math.max(term.length, target.length);
  return similarity >= 1 - threshold;
}

/** A service is a candidate when a term fuzzy-matches a title, category or office word or a keyword. */
function isCandidate(service: Service, terms: string[]): boolean {
  const words = [
    ...tokenize(service.title),
    ...service.keywords.map((k) => k.toLowerCase()),
    ...tokenize(service.category),
    ...tokenize(service.office),
  ];
  return terms.some((term) => words.some((word) => isFuzzyMatch(term, word)));
}

function score(service: Service, terms: string[], query: string): number {
  let total = 0;
  const title = service.title.toLowerCase();
  const category = service.category.toLowerCase();
  const description = service.description.toLowerCase();
  const office = (service.office ?? '').toLowerCase();
  const time = (service.processingTime ?? '').toLowerCase();
  const q = query.toLowerCase();

  if (title === q) total += 200;
  else if (title.includes(q)) total += 100;

  for (const term of terms) {
    if (title === term) total += 80;
    else if (title.startsWith(term)) total += 60;
    else if (title.includes(term)) total += 40;
    else if (isFuzzyMatch(term, title, 0.25)) total += 20;

    for (const keyword of service.keywords) {
      const kw = keyword.toLowerCase();
      if (kw === term) total += 35;
      else if (kw.includes(term)) total += 20;
      else if (isFuzzyMatch(term, kw)) total += 10;
    }

    if (category.includes(term)) total += 15;
    else if (isFuzzyMatch(term, category)) total += 8;

    if (description.includes(term)) total += 10;

    if (office.includes(term)) total += 12;
    else if (isFuzzyMatch(term, office)) total += 6;

    if (time.includes(term)) total += 8;
  }

  if (service.fee) total += 2;
  if (service.processingTime) total += 2;
  if (service.description) total += 1;
  return total;
}

export function searchServices(query: string, list: Service[] = services, limit = 10): Service[] {
  const q = query.trim();
  if (q.length < 2) return [];
  const terms = tokenize(q);
  if (!terms.length) return [];
  return list
    .filter((s) => isCandidate(s, terms))
    .map((s) => ({ s, score: score(s, terms, q) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ s }) => s);
}
