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

  test('Home page interactive map displays OpenStreetMap attribution without waiting for weather', async ({
    page,
  }) => {
    await page.route('**/api.open-meteo.com/**', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 11_000));
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({
          current: {
            temperature_2m: 29,
            relative_humidity_2m: 65,
            weather_code: 1,
            wind_speed_10m: 12,
          },
          hourly: {
            time: ['2026-11-17T00:00'],
            temperature_2m: [29],
            weather_code: [1],
          },
        }),
      });
    });

    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const attribution = page.locator('#map-container .leaflet-control-attribution');
    await expect(attribution).toBeVisible({ timeout: 5_000 });
    await expect(attribution).toContainText('OpenStreetMap');
  });

  test('Weather widget shows live weather unavailable state for non-default LGU when API fails', async ({
    page,
  }) => {
    await page.route('**/api.open-meteo.com/**', (route) => route.abort('failed'));
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => {
      if (typeof window.updateBukidnonWeather === 'function') {
        window.updateBukidnonWeather(7.9042, 125.0928, 'Valencia City, Bukidnon');
      }
    });
    const widget = page.locator('#weather-container .weather-widget--unavailable');
    await expect(widget).toBeVisible();
    await expect(widget).toContainText('Live weather unavailable');
    await expect(widget).toContainText('Valencia City, Bukidnon');
  });

  test('Map search selects a unique LGU and enables its barangay selector', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const barangaySelect = page.locator('#map-brgy-select');
    await expect(barangaySelect).toBeDisabled();

    await page.fill('#map-lgu-search', 'Valencia');
    await expect(barangaySelect).toBeEnabled();
    await expect(barangaySelect.locator('option').first()).toHaveText('Select barangay (31)');
    await expect(barangaySelect.locator('option')).toHaveCount(32);

    await barangaySelect.selectOption('1001321001');
    await expect(page).toHaveURL(/\/barangays\/profile\/\?code=1001321001$/);
  });

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

  test('LGU profile sticky navigation clears the site header and anchor target', async ({
    page,
  }) => {
    for (const viewport of [
      { width: 1440, height: 900 },
      { width: 768, height: 1024 },
      { width: 390, height: 844 },
    ]) {
      await page.setViewportSize(viewport);
      await page.goto('/lgus/cabanglasan/', { waitUntil: 'domcontentloaded' });
      await expect(page.locator('.bb-profile-nav-bar')).toBeVisible();

      await page.locator('.bb-profile-nav-link[href="#leadership"]').click();
      await expect(page.locator('#leadership')).toBeInViewport();

      const layout = await page.evaluate(() => {
        const header = document.querySelector('.site-header');
        const nav = document.querySelector('.bb-profile-nav-bar');
        const leadership = document.querySelector('#leadership');
        if (!header || !nav || !leadership) return null;
        return {
          headerBottom: header.getBoundingClientRect().bottom,
          navTop: nav.getBoundingClientRect().top,
          navBottom: nav.getBoundingClientRect().bottom,
          leadershipTop: leadership.getBoundingClientRect().top,
        };
      });

      expect(layout).not.toBeNull();
      expect(layout.navTop).toBeGreaterThanOrEqual(layout.headerBottom - 1);
      expect(layout.leadershipTop).toBeGreaterThanOrEqual(layout.navBottom - 1);
    }
  });

  test('Barangay directory loads 464 barangays, filters by LGU, falls back to all on unknown ?lgu=, and preserves focus when paging', async ({
    page,
  }) => {
    await page.goto('/barangays/?lgu=nonexistent-lgu', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('#brgy-results-count')).toContainText('464');
    await expect(page.locator('#brgy-lgu-filter')).toHaveValue('all');

    const nextBtn = page.locator('#brgy-next');
    await nextBtn.focus();
    await nextBtn.click();
    await expect(page.locator('#brgy-page-label')).toContainText('Page 2 of');
    const activeId = await page.evaluate(() => document.activeElement && document.activeElement.id);
    expect(activeId).toBe('brgy-next');

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
