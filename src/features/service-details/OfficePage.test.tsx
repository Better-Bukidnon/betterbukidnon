/// <reference types="vite/client" />
import { render, screen } from '@testing-library/react';
import { LanguageProvider } from '@/features/i18n/LanguageProvider';
import { validateFrontmatter, validateTranslation } from '@/features/service-details/frontmatter';
import ceb from '@/features/service-details/i18n/ceb.json';
import { LocalizedOffice } from '@/features/service-details/LocalizedOffice';
import type { OfficeModule } from '@/features/service-details/officeModule';
import { OfficePage } from '@/features/service-details/OfficePage';

const files = import.meta.glob<OfficeModule>('/src/content/service-details/*/*.mdx', {
  eager: true,
});
const slugOf = (file: string) => file.split('/').at(-2) ?? '';
const english = Object.entries(files).filter(([file]) => file.endsWith('/en.mdx'));

/** Spec §3.3: every office URL must exist. */
const OFFICES = [
  'business-permits-licensing',
  'birth-certificate',
  'civil-registrar',
  'death-certificate',
  'human-resource-management',
  'marriage-certificate',
  'pdrrmd',
  'property-declaration',
  'provincial-accounting',
  'provincial-agriculture',
  'provincial-assessor',
  'provincial-budget',
  'provincial-engineering',
  'provincial-general-services',
  'provincial-health-office',
  'provincial-planning',
  'provincial-treasurer',
  'pswdo',
];

afterEach(() => {
  delete document.documentElement.dataset.locale;
});

describe('office MDX', () => {
  it('has an English file for every office in the spec', () => {
    expect(english.map(([f]) => slugOf(f)).sort()).toEqual([...OFFICES].sort());
  });

  it.each(english)('%s renders through the office template', (file, mod) => {
    const fm = validateFrontmatter(mod.frontmatter, file);
    expect(fm.slug).toBe(slugOf(file));
    render(
      <LanguageProvider>
        <OfficePage fm={fm} Content={mod.default} translated={[]} />
      </LanguageProvider>
    );
    screen.getByRole('heading', { level: 1, name: fm.title });
    expect(screen.getByRole('complementary', { name: 'Office Information' }).textContent).toContain(
      fm.office.name
    );
    expect(screen.getAllByRole('heading', { level: 2 }).length).toBeGreaterThan(1);
  });

  it('gives every translation a valid hero', () => {
    for (const [file, mod] of Object.entries(files))
      if (!file.endsWith('/en.mdx'))
        expect(validateTranslation(mod.frontmatter, file).title).not.toBe('');
  });

  it('keeps the city/municipal callout on civil-registry and business-permit pages', () => {
    for (const slug of [
      'birth-certificate',
      'death-certificate',
      'marriage-certificate',
      'business-permits-licensing',
    ]) {
      const mod = files[`/src/content/service-details/${slug}/en.mdx`];
      render(<mod.default />);
      expect(screen.getAllByRole('note')[0].textContent).toMatch(/city or municipalit/i);
    }
  });
});

describe('LocalizedOffice', () => {
  const pswdo = files['/src/content/service-details/pswdo/en.mdx'];
  const fm = validateFrontmatter(pswdo.frontmatter, 'pswdo/en.mdx');
  const office = (translated: ('fil' | 'ceb')[]) => (
    <LanguageProvider>
      <LocalizedOffice
        slug="pswdo"
        translated={translated}
        head={fm}
        parent={{ href: '/services/social-services', label: { services: 'social-bc' } }}
      >
        <pswdo.default />
      </LocalizedOffice>
    </LanguageProvider>
  );

  it('falls back to English with a note when the locale has no file', async () => {
    document.documentElement.dataset.locale = 'ceb';
    render(office([]));
    await screen.findByText(ceb['sd-not-translated']);
    screen.getByRole('heading', { level: 1, name: fm.title });
    screen.getByText('About the Office');
  });

  it('loads the translated MDX when it exists', async () => {
    document.documentElement.dataset.locale = 'fil';
    const fil = validateTranslation(
      files['/src/content/service-details/pswdo/fil.mdx'].frontmatter,
      'pswdo/fil.mdx'
    );
    render(office(['fil']));
    await screen.findByRole('heading', { level: 1, name: fil.title });
    expect(screen.queryByText(/not yet translated/i)).toBeNull();
    expect(screen.queryByText('About the Office')).toBeNull();
  });
});
