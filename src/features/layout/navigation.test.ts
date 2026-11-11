import { NAV, isActive } from '@/features/layout/navigation';

const activeLabel = (pathname: string) =>
  NAV.filter((item) => isActive(item, pathname)).map((item) => item.label);

describe('active nav item', () => {
  it.each([
    ['/', ['nav-home']],
    ['/services/health', ['nav-services']],
    ['/service-details/pswdo', ['nav-services']],
    ['/budget/', ['nav-transparency']],
    ['/legislative/ordinance-framework', ['nav-legislative']],
    ['/government/officials', ['nav-government']],
    ['/faq', []],
  ])('%s highlights %j', (pathname, expected) => {
    expect(activeLabel(pathname)).toEqual(expected);
  });

  it('builds the Our Projects dropdown from projects.json', () => {
    const projects = NAV.find((item) => item.href === '/projects')!;
    expect(projects.children?.filter((c) => c.external).map((c) => c.href)).toEqual([
      'https://budget.betterbukidnon.org',
      'https://saln.betterbukidnon.org',
      'https://infra.betterbukidnon.org',
    ]);
  });
});
