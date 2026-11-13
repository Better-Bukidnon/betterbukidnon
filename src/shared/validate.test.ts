import { isSafeHref } from '@/shared/validate';

describe('isSafeHref', () => {
  it.each([
    '/',
    '/services',
    '#fees',
    'https://x.org',
    'HTTPS://x.org',
    'mailto:a@b.ph',
    'tel:+63',
  ])('allows %s', (href) => expect(isSafeHref(href)).toBe(true));

  it.each([
    '//evil.example',
    '/\\evil.example',
    // Browsers drop tabs and newlines, which would turn these into //evil.example.
    '/\t/evil.example',
    '/\n/evil.example',
    '\t//evil.example',
    'javascript:alert(1)',
    'data:text/html,x',
    'www.x.org',
    'http:x.org',
    '',
    undefined,
  ])('rejects %s', (href) => expect(isSafeHref(href)).toBe(false));
});
