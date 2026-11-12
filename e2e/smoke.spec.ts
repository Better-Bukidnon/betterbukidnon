import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

/** One page per template: home, index, category, office (MDX), data pages, legal, framework. */
const PAGES = [
  '/',
  '/services',
  '/services/health',
  '/service-details/birth-certificate',
  '/service-details/pdrrmd',
  '/government',
  '/government/officials',
  '/statistics',
  '/legislative',
  '/legislative/ordinance-framework',
  '/budget',
  '/news',
  '/projects',
  '/contact',
  '/faq',
];

// Third parties (Google Maps, Facebook, Open-Meteo) are blocked so the suite is deterministic
// and offline-safe; the site must still lay out and pass axe without them.
test.beforeEach(async ({ page }) => {
  await page.route(/^https?:\/\/(?!localhost[:/])/, (route) => route.abort());
});

const isDesktop = (name: string) => name === 'desktop';

test.describe('every key page', () => {
  for (const url of PAGES) {
    test(`${url}: no sideways scroll at 375px`, async ({ page }, info) => {
      test.skip(!isDesktop(info.project.name), 'viewport is set explicitly; run once');
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto(url);
      const overflow = await page.evaluate(() => {
        const width = document.documentElement.clientWidth;
        const wide = [...document.querySelectorAll<HTMLElement>('body *')]
          .filter((el) => el.getBoundingClientRect().right > width + 1)
          // Elements inside a scroll container (tables, marquee) are fine.
          .filter((el) => {
            for (let p = el.parentElement; p; p = p.parentElement) {
              const { overflowX } = getComputedStyle(p);
              if (overflowX === 'auto' || overflowX === 'scroll' || overflowX === 'hidden')
                return false;
            }
            return true;
          })
          .slice(0, 5)
          .map((el) => `${el.tagName.toLowerCase()}.${el.className}`.slice(0, 120));
        return { scrollWidth: document.documentElement.scrollWidth, width, wide };
      });
      expect(overflow.wide, `elements wider than the viewport on ${url}`).toEqual([]);
      expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.width);
    });

    test(`${url}: axe finds no serious or critical WCAG A/AA violations`, async ({ page }) => {
      await page.goto(url);
      const { violations } = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .exclude('iframe')
        .analyze();
      const serious = violations
        .filter((v) => v.impact === 'serious' || v.impact === 'critical')
        .map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`);
      expect(serious).toEqual([]);
    });
  }
});

test.describe('header', () => {
  const nav = (page: Page) => page.getByRole('navigation', { name: 'Main navigation' });

  test('lists the eight top-level sections and marks the current one', async ({ page }, info) => {
    test.skip(!isDesktop(info.project.name), 'desktop nav');
    await page.goto('/services/health');
    const top = nav(page).locator(':scope > ul > li > div > a');
    await expect(top).toHaveCount(8);
    await expect(nav(page).locator('a[aria-current="page"]').first()).toHaveText('Services');
  });

  test('Our Projects submenu opens from its chevron and closes on Escape', async ({
    page,
  }, info) => {
    test.skip(!isDesktop(info.project.name), 'desktop nav');
    await page.goto('/');
    const chevron = nav(page).getByRole('button', { name: /Our Projects/ });
    await chevron.click();
    await expect(chevron).toHaveAttribute('aria-expanded', 'true');
    const submenu = page.locator(`#${await chevron.getAttribute('aria-controls')}`);
    await expect(submenu.getByRole('link', { name: /Budget Tracker/ })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(chevron).toHaveAttribute('aria-expanded', 'false');
  });

  test('mobile menu toggles, opens a submenu and closes on Escape', async ({ page }, info) => {
    test.skip(isDesktop(info.project.name), 'mobile nav');
    await page.goto('/');
    const toggle = page.getByRole('button', { name: 'Toggle navigation' });
    await expect(nav(page)).toBeHidden();
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(nav(page)).toBeVisible();

    const chevron = nav(page).getByRole('button', { name: /Services/ });
    await chevron.click();
    await expect(chevron).toHaveAttribute('aria-expanded', 'true');

    await page.keyboard.press('Escape');
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(nav(page)).toBeHidden();
  });
});

test.describe('projects dialog', () => {
  const opener = (page: Page, name: string) =>
    page.getByRole('button', { name: new RegExp(`View Details.*${name}`) });

  test('opens with the project details and closes with Escape, button and backdrop', async ({
    page,
  }) => {
    await page.goto('/projects');
    const dialog = page.getByRole('dialog');

    await opener(page, 'Budget Tracker').click();
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAccessibleName('Budget Tracker');
    await expect(
      dialog.locator('a[href="https://budget.betterbukidnon.org"]').first()
    ).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(opener(page, 'Budget Tracker')).toBeFocused();

    await opener(page, 'SALN Tracker').click();
    await dialog.getByRole('button', { name: 'Close' }).click();
    await expect(dialog).toBeHidden();

    await opener(page, 'SALN Tracker').click();
    await expect(dialog).toBeVisible();
    await page.mouse.click(5, 5); // the backdrop, outside the dialog box
    await expect(dialog).toBeHidden();
  });
});

test('unknown URLs get the 404 page with a 404 status', async ({ page }) => {
  const res = await page.goto('/no-such-page');
  expect(res?.status()).toBe(404);
  await expect(page.getByRole('link', { name: /home/i }).first()).toBeVisible();
});

test('public data URLs from the old site still work', async ({ request }) => {
  for (const file of ['news', 'projects', 'services', 'officials']) {
    const res = await request.get(`/data/${file}.json`);
    expect(res.status(), file).toBe(200);
    expect(await res.json()).toBeTruthy(); // valid JSON
  }
});
