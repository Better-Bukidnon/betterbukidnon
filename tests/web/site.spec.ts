import { expect, test } from '@playwright/test'

test('the prerendered home page hydrates without a browser error', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto('/cleanup-legacy-caches.js')
  await page.evaluate(() => caches.open('betterbukidnon-static-v18'))

  await page.goto('/')
  await expect(page.locator('#main-content')).toBeVisible()
  await expect(page.locator('h1').first()).toBeVisible()
  await expect
    .poll(() => page.evaluate(() => navigator.serviceWorker?.getRegistration().then(Boolean)))
    .toBe(true)
  await expect
    .poll(() => page.evaluate(() => caches.keys()))
    .not.toContain('betterbukidnon-static-v18')
  expect(errors).toEqual([])
})

test('switching language keeps the current route', async ({ page }) => {
  await page.goto('/services')
  await page.getByRole('button', { name: /language/i }).click()
  await page.getByRole('link', { name: 'Filipino' }).click()
  await expect(page).toHaveURL(/\/fil\/services$/)
  await expect(page.locator('html')).toHaveAttribute('lang', 'fil')
})

test('the service search reads the query string', async ({ page }) => {
  await page.goto('/services?q=birth')
  await expect(page.locator('#service-search')).toHaveValue('birth')
  await expect(page.getByRole('listbox', { name: 'Search suggestions' })).toBeVisible()
})

test('the legacy barangay directory query selects its LGU filter', async ({ page }) => {
  await page.goto('/barangays?lgu=sumilao')
  await expect(page.locator('select').nth(0)).toHaveValue('sumilao')
  await expect(page.locator('#main-content .grid > article')).toHaveCount(10)
})

test('the legacy barangay profile URL redirects by PSGC code', async ({ page }) => {
  await page.goto('/barangays/profile/?code=1001312001')
  await expect(page).toHaveURL(/\/barangays\/malaybalay-city\/aglayan$/)
  await expect(page.locator('h1')).toContainText('Aglayan')
})

test('an unknown legacy barangay code shows not-found without changing the URL', async ({ page }) => {
  await page.goto('/barangays/profile?code=not-a-psgc-code')
  await expect(page).toHaveURL(/\/barangays\/profile\?code=not-a-psgc-code$/)
  await expect(page.getByRole('heading', { name: 'Page Not Found' })).toBeVisible()
})

test('the home map searches LGUs and opens the selected barangay profile', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('bb-vol-popup-v1', '1'))
  await page.goto('/')
  const search = page.getByRole('combobox', { name: 'Find City / Municipality' })
  await search.fill('Malaybalay City')
  await expect(page.getByRole('heading', { name: 'Malaybalay City' }).last()).toBeVisible()
  await page.getByLabel('Barangay (by LGU)').selectOption({ label: 'Aglayan' })
  await expect(page).toHaveURL(/\/barangays\/malaybalay-city\/aglayan$/)
})

test('a unique home-map search selects the LGU and syncs its weather', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('bb-vol-popup-v1', '1'))
  await page.route(/api\.open-meteo\.com\/v1\/forecast/, (route) =>
    route.fulfill({
      json: {
        current: {
          temperature_2m: 26,
          relative_humidity_2m: 80,
          weather_code: 1,
          wind_speed_10m: 4,
        },
        hourly: {
          time: ['2026-11-18T23:00'],
          temperature_2m: [25],
          weather_code: [1],
        },
      },
    }),
  )
  await page.goto('/')
  await page.getByRole('combobox', { name: 'Find City / Municipality' }).fill('Valencia')

  const barangays = page.getByLabel('Barangay (by LGU)')
  await expect(barangays).toBeEnabled()
  await expect(barangays.locator('option')).toHaveCount(32)
  await expect(page.getByRole('region', { name: 'Current weather in Valencia City, Bukidnon' })).toBeVisible()
  await barangays.selectOption({ index: 1 })
  await expect(page).toHaveURL(/\/barangays\/valencia-city\//)
})

test.describe('home-map barangay request recovery', () => {
  test.use({ serviceWorkers: 'block' })

  test('retries a failed request when the same LGU is selected again', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('bb-vol-popup-v1', '1'))
    let requests = 0
    await page.route('**/data/barangays.json', async (route) => {
      requests += 1
      if (requests === 1) await route.abort('failed')
      else await route.continue()
    })
    await page.goto('/')
    await page.getByRole('combobox', { name: 'Find City / Municipality' }).fill('Valencia')

    const barangays = page.getByLabel('Barangay (by LGU)')
    await expect(barangays).toBeDisabled()
    await expect(barangays.locator('option').first()).toHaveText('Unavailable')
    await page.getByRole('button', { name: 'Valencia City' }).click()
    await expect(barangays).toBeEnabled()
    await expect(barangays.locator('option').first()).toHaveText('Select barangay (31)')
    expect(requests).toBe(2)
  })
})

test('LGU profile anchors clear the measured sticky header at responsive widths', async ({ page }) => {
  for (const viewport of [
    { width: 1440, height: 900 },
    { width: 1100, height: 900 },
    { width: 768, height: 1024 },
    { width: 390, height: 844 },
  ]) {
    await page.setViewportSize(viewport)
    await page.goto('/lgus/cabanglasan')
    await page.locator('a[href="#leadership"]').click()
    const getLayout = () => page.evaluate(() => {
      const header = document.querySelector('.site-header')
      const nav = document.querySelector('[aria-label="Profile sections"]')
      const heading = document.querySelector('#leadership')
      if (!header || !nav || !heading) return null
      return {
        headerBottom: header.getBoundingClientRect().bottom,
        navTop: nav.getBoundingClientRect().top,
        navBottom: nav.getBoundingClientRect().bottom,
        headingTop: heading.getBoundingClientRect().top,
      }
    })
    await expect
      .poll(async () => {
        const layout = await getLayout()
        return layout && Math.abs(layout.navTop - layout.headerBottom)
      })
      .toBeLessThanOrEqual(1)
    const layout = await getLayout()
    expect(layout).not.toBeNull()
    expect(layout.headingTop).toBeGreaterThanOrEqual(layout.navBottom - 1)
  }
})

test('legacy public data URLs remain available after cutover', async ({ request }) => {
  for (const pathname of ['/data/lgus.json', '/data/barangays.json', '/data/contacts.json']) {
    const response = await request.get(pathname)
    expect(response.status(), pathname).toBe(200)
    expect(response.headers()['content-type'], pathname).toContain('application/json')
  }
})

test('unknown paths show the prerendered 404 without a hydration error', async ({ page }) => {
  for (const pathname of [
    '/services/nonexistent',
    '/fil/services/nonexistent',
    '/ceb/services/nonexistent',
  ]) {
    const errors: string[] = []
    page.on('pageerror', (error) => errors.push(error.message))

    const response = await page.goto(pathname)
    expect(response?.status(), pathname).toBe(404)
    await expect(page.getByText('404', { exact: true })).toBeVisible()
    await expect(page.locator('header button[aria-label="Toggle Navigation"]')).toBeHidden()
    await expect(page.locator('header nav#main-nav')).toBeVisible()
    await expect(page.locator('html')).toHaveAttribute(
      'lang',
      pathname.startsWith('/fil/') ? 'fil' : pathname.startsWith('/ceb/') ? 'ceb' : 'en',
    )
    expect(errors, pathname).toEqual([])
    page.removeAllListeners('pageerror')
  }
})

test('the offline fallback has one main landmark and a working retry link', async ({ page }) => {
  await page.goto('/offline')
  await expect(page.locator('main')).toHaveCount(1)
  await expect(page.getByRole('link', { name: 'Try Again' })).toHaveAttribute('href', '')
})

test('the volunteer dialog traps focus and can be dismissed', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.addInitScript(() => localStorage.removeItem('bb-vol-popup-v1'))
  await page.goto('/')

  const dialog = page.getByRole('dialog', { name: 'Be Part of Something Greater' })
  await expect(dialog).toBeVisible()
  const close = page.getByRole('button', { name: 'Close volunteer popup' })
  await expect(close).toBeFocused()
  await page.keyboard.press('Shift+Tab')
  await expect(dialog.locator(':focus')).toBeVisible()
  await close.click()
  await expect(dialog).toHaveCount(0)
})
