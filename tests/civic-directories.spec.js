// @ts-check
const { test, expect } = require('@playwright/test');

const KEY_ROUTES = [
  '/',
  '/contact/',
  '/government/',
  '/lgus/',
  '/lgus/malaybalay-city/',
  '/lgus/valencia-city/',
  '/barangays/',
  '/barangays/profile/?code=1001312001',
  '/statistics/',
];

test.describe('Civic Directories & Route Smoke Tests', () => {
  for (const route of KEY_ROUTES) {
    test(`Route loads cleanly without console errors: ${route}`, async ({ page }) => {
      const errors = [];
      page.on('pageerror', (err) => errors.push(err.message));

      const response = await page.goto(route, { waitUntil: 'domcontentloaded' });
      expect(response && response.status()).toBeLessThan(400);
      await expect(page.locator('#main-content')).toBeVisible();
      expect(errors).toEqual([]);
    });
  }

  test('Contact directory renders cards, filters, and supports copy', async ({ page }) => {
    await page.goto('/contact/', { waitUntil: 'domcontentloaded' });
    const cards = page.locator('#contacts-directory-grid .bb-card');
    await expect(cards.first()).toBeVisible();

    await page.fill('#contacts-search', 'Manolo Fortich');
    await expect(page.locator('#contacts-results-count')).toContainText('of');
    const visibleText = await page.locator('#contacts-directory-grid').innerText();
    expect(visibleText).toContain('Manolo Fortich');
  });

  test('LGU directory renders all 22 LGUs and filters by classification and district', async ({
    page,
  }) => {
    await page.goto('/lgus/', { waitUntil: 'domcontentloaded' });
    const cards = page.locator('#lgu-directory-grid .bb-card');
    await expect(cards).toHaveCount(22);

    await page.selectOption('#lgu-type-filter', 'Component City');
    await expect(cards).toHaveCount(2);

    await page.selectOption('#lgu-type-filter', 'all');
    await page.selectOption('#lgu-district-filter', '4');
    await expect(cards).toHaveCount(3);
  });

  test('LGU profile renders all 7 required sections and barangays', async ({ page }) => {
    await page.goto('/lgus/malaybalay-city/', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('h1')).toContainText('Malaybalay City');
    await expect(page.locator('#overview')).toBeVisible();
    await expect(page.locator('#leadership')).toBeVisible();
    await expect(page.locator('#offices')).toBeVisible();
    await expect(page.locator('#barangays')).toBeVisible();
    await expect(page.locator('#services')).toBeVisible();
    await expect(page.locator('#infrastructure')).toBeVisible();
    await expect(page.locator('#references')).toBeVisible();
    await expect(page.locator('#lgu-brgy-grid .bb-card')).toHaveCount(46);
  });

  test('Barangay directory loads 464 barangays and filters by LGU', async ({ page }) => {
    await page.goto('/barangays/', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('#brgy-results-count')).toContainText('464');
    await page.selectOption('#brgy-lgu-filter', 'sumilao');
    await expect(page.locator('#brgy-directory-grid .bb-card')).toHaveCount(10);
  });

  test('Responsive layouts have no horizontal overflow on desktop, tablet, and mobile', async ({
    page,
  }) => {
    for (const vp of [
      { width: 1280, height: 800 },
      { width: 768, height: 1024 },
      { width: 390, height: 844 },
    ]) {
      await page.setViewportSize(vp);
      for (const route of ['/lgus/', '/barangays/', '/contact/']) {
        await page.goto(route, { waitUntil: 'domcontentloaded' });
        await expect(page.locator('#main-content')).toBeVisible();
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth > document.documentElement.clientWidth
        );
        expect(overflow, `Overflow on ${route} at ${vp.width}x${vp.height}`).toBe(false);
      }
    }
  });
});
