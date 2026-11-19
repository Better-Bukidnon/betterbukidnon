import fs from 'node:fs';
import path from 'node:path';
import { LOCALES, type Locale } from '@/features/i18n/locales';
import { validateFrontmatter, validateTranslation } from '@/features/service-details/frontmatter';
import { loadOfficeModule } from '@/features/service-details/officeModule';

/** Build-time only (uses fs). */
const DIR = path.join(process.cwd(), 'src', 'content', 'service-details');

export function officeSlugs(): string[] {
  return fs.readdirSync(DIR).filter((d) => fs.existsSync(path.join(DIR, d, 'en.mdx')));
}

export function translatedLocales(slug: string): Locale[] {
  return LOCALES.map((l) => l.code).filter(
    (code): code is Exclude<Locale, 'en'> =>
      code !== 'en' && fs.existsSync(path.join(DIR, slug, `${code}.mdx`))
  );
}

/** Loads and validates every locale of an office; any bad frontmatter throws and fails the build. */
export async function loadOffice(slug: string) {
  const mod = await loadOfficeModule(slug, 'en');
  const fm = validateFrontmatter(mod.frontmatter, `${slug}/en.mdx`);
  if (fm.slug !== slug) throw new Error(`${slug}/en.mdx: slug "${fm.slug}" must match its folder`);
  const translated = translatedLocales(slug);
  for (const locale of translated)
    validateTranslation(
      (await loadOfficeModule(slug, locale)).frontmatter,
      `${slug}/${locale}.mdx`
    );
  return { fm, Content: mod.default, translated };
}
