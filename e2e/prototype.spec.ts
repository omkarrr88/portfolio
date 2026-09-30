import { expect, test, type Page } from '@playwright/test'

const collectErrors = (page: Page) => {
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text())
  })
  return errors
}

test('renders the hero, the formation and no errors', async ({ page }) => {
  const errors = collectErrors(page)
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Omkar\s*Kadam/)
  await expect(page.locator('canvas.formation__canvas')).toHaveAttribute('data-ready', 'true')
  await page.waitForTimeout(500)
  expect(errors).toEqual([])
})

test('never scrolls sideways, even while the sheet animates in', async ({ page }) => {
  await page.goto('/')
  for (const id of ['now', 'chakravyuh']) {
    await page.locator(`#${id}`).scrollIntoViewIfNeeded()
    await page.waitForTimeout(300)
    const [scrollWidth, innerWidth] = await page.evaluate(() => [document.documentElement.scrollWidth, window.innerWidth])
    expect(scrollWidth).toBeLessThanOrEqual(innerWidth)
  }
})

test('HUD tracks the ring as you scroll inward', async ({ page }) => {
  await page.goto('/')
  const ring = page.locator('.hud__ring')
  await expect(ring).toContainText('Ring 07')
  await page.evaluate(() => window.scrollTo(0, document.getElementById('now')!.offsetTop))
  await expect(ring).toContainText('Ring 06')
  await page.evaluate(() => window.scrollTo(0, document.getElementById('chakravyuh')!.offsetTop))
  await expect(ring).toContainText('Ring 05')
})

test('Index opens as a dialog, closes on Escape, and navigates', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Index' }).click()
  const dialog = page.getByRole('dialog', { name: 'Index' })
  await expect(dialog).toBeVisible()
  await expect(dialog.getByText('full build')).toHaveCount(5)
  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()

  await page.getByRole('button', { name: 'Index' }).click()
  await dialog.getByRole('button', { name: /Chakravyuh/ }).click()
  await expect(dialog).toBeHidden()
  await expect(page.locator('.hud__ring')).toContainText('Ring 05', { timeout: 5000 })
})

test('Resume is always one tap away', async ({ page }) => {
  await page.goto('/')
  const resume = page.getByRole('link', { name: /Resume/ }).first()
  await expect(resume).toHaveAttribute('href', '/resume.pdf')
  const response = await page.request.get('/resume.pdf')
  expect(response.status()).toBe(200)
})

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' })

  test('keeps every piece of content visible without animation', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await page.locator('#chakravyuh').scrollIntoViewIfNeeded()
    await expect(page.getByRole('heading', { name: 'Chakravyuh' })).toBeVisible()
    const opacity = await page.locator('.sheet').evaluate((el) => getComputedStyle(el).opacity)
    expect(opacity).toBe('1')
  })
})
