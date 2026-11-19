import { isCategorySlug, type CategorySlug } from '@/features/services/categories';
import { isHttpUrl } from '@/shared/validate';

/** Parent crumb of an office: a services category, or the government page. */
export type OfficeCategory = CategorySlug | 'government';

export interface OfficeInfo {
  name: string;
  /** Empty string = not published yet. Same for email, phone and mapLink. */
  head: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
  mapLink: string;
}

/** Frontmatter of `<slug>/en.mdx`. */
export interface OfficeFrontmatter {
  title: string;
  slug: string;
  badge: string;
  category: OfficeCategory;
  summary: string;
  lastVerified: string;
  office: OfficeInfo;
  sources: string[];
}

/** Frontmatter of `<slug>/fil.mdx` and `ceb.mdx`: only the translated hero text. */
export type TranslatedFrontmatter = Pick<OfficeFrontmatter, 'title' | 'summary' | 'badge'>;

type Data = Record<string, unknown>;

const isData = (v: unknown): v is Data => typeof v === 'object' && v !== null && !Array.isArray(v);

function fail(file: string, message: string): never {
  throw new Error(`Invalid frontmatter in src/content/service-details/${file}: ${message}`);
}

function text(data: Data, key: string, file: string, allowEmpty = false): string {
  const value = data[key];
  if (typeof value !== 'string' || (!allowEmpty && !value.trim()))
    fail(file, `missing required field "${key}"`);
  return value;
}

export function validateTranslation(data: unknown, file: string): TranslatedFrontmatter {
  if (!isData(data)) fail(file, 'no frontmatter block');
  return {
    title: text(data, 'title', file),
    summary: text(data, 'summary', file),
    badge: text(data, 'badge', file),
  };
}

/** Runs at build time for every office, so a missing field fails `next build`. */
export function validateFrontmatter(data: unknown, file: string): OfficeFrontmatter {
  if (!isData(data)) fail(file, 'no frontmatter block');
  const category = data.category;
  if (category !== 'government' && !isCategorySlug(category))
    fail(file, `unknown category "${String(category)}"`);
  const lastVerified = text(data, 'lastVerified', file);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(lastVerified))
    fail(file, '"lastVerified" must be a YYYY-MM-DD date');
  const office = data.office;
  if (!isData(office)) fail(file, 'missing required field "office"');
  const sources = data.sources;
  if (
    !Array.isArray(sources) ||
    !sources.length ||
    !sources.every((s) => typeof s === 'string' && /^https?:\/\//.test(s))
  )
    fail(file, '"sources" must list at least one http(s) URL');

  const at = `${file} office`;
  const mapLink = text(office, 'mapLink', at, true);
  if (mapLink && !isHttpUrl(mapLink)) fail(at, '"mapLink" must be an http(s) URL');
  return {
    ...validateTranslation(data, file),
    slug: text(data, 'slug', file),
    category,
    lastVerified,
    sources,
    office: {
      name: text(office, 'name', at),
      head: text(office, 'head', at, true),
      address: text(office, 'address', at),
      phone: text(office, 'phone', at, true),
      email: text(office, 'email', at, true),
      hours: text(office, 'hours', at),
      mapLink,
    },
  };
}
