import { expect, test, type Page } from '@playwright/test'

const CHAPTERS = [
  { id: 'intro', ring: 'Ring 07' },
  { id: 'now', ring: 'Ring 06' },
  { id: 'chakravyuh', ring: 'Ring 05' },
  { id: 'vayunetra', ring: 'Ring 04' },
  { id: 'fitmon', ring: 'Ring 03' },
  { id: 'more-work', ring: 'Ring 02' },
  { id: 'beyond', ring: 'Ring 01' },
  { id: 'centre', ring: 'Centre' },
] as const

const collectErrors = (page: Page) => {
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('console', (m) => {
    // The contact API only exists on Vercel; its 404 in local preview is expected.
    if (m.type() === 'error' && !m.text().includes('/api/contact') && !m.text().includes('Contact')) errors.push(m.text())
  })
  return errors
}

/** Puts a section's top at 20% of the viewport, past its transition window. */
const scrollToChapter = (page: Page, id: string) =>
  page.evaluate((target) => {
    const el = document.getElementById(target)!
    window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.2)
  }, id)

test('renders the hero and the formation without errors', async ({ page }) => {
  const errors = collectErrors(page)
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Omkar\s*Kadam/)
  await expect(page.locator('canvas.formation__canvas')).toHaveAttribute('data-ready', 'true')
  await page.waitForTimeout(500)
  expect(errors).toEqual([])
})

test('has every chapter, in order, with its content', async ({ page }) => {
  await page.goto('/')
  const ids = await page.locator('main > section').evaluateAll((els) => els.map((el) => el.id))
  expect(ids).toEqual(CHAPTERS.map((c) => c.id))

  for (const label of ['Experience', 'Education', 'Toolkit', 'Record', 'Publication', 'Leadership']) {
    await expect(page.getByRole('heading', { level: 3, name: label })).toHaveCount(1)
  }
  for (const title of ['Chakravyuh', 'VayuNetra', 'Fitmon']) {
    await expect(page.getByRole('heading', { level: 2, name: title })).toBeVisible()
  }
  for (const title of ['PyTorch Training Run Debugger', 'Smart PUC', 'V2V Blind Spot Detection']) {
    await expect(page.getByRole('heading', { level: 3, name: title })).toHaveCount(1)
  }
  await expect(page.getByRole('link', { name: 'omkarkadam181188@gmail.com' }).first()).toHaveAttribute(
    'href',
    'mailto:omkarkadam181188@gmail.com',
  )
})

test('never scrolls sideways in any chapter', async ({ page }) => {
  await page.goto('/')
  for (const { id } of CHAPTERS) {
    await scrollToChapter(page, id)
    await page.waitForTimeout(250)
    const [scrollWidth, innerWidth] = await page.evaluate(() => [document.documentElement.scrollWidth, window.innerWidth])
    expect(scrollWidth, `#${id}`).toBeLessThanOrEqual(innerWidth)
  }
})

test('HUD tracks the ring from the outside to the centre', async ({ page }) => {
  await page.goto('/')
  const ring = page.locator('.hud__ring')
  for (const { id, ring: label } of CHAPTERS) {
    await scrollToChapter(page, id)
    await expect(ring, `#${id}`).toContainText(label)
  }
})

test('Index opens as a dialog, marks where you are, closes on Escape, and navigates', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Index' }).click()
  const dialog = page.getByRole('dialog', { name: 'Index' })
  await expect(dialog).toBeVisible()
  await expect(dialog.getByRole('button')).toHaveCount(CHAPTERS.length + 1)
  await expect(dialog.locator('[aria-current="location"]')).toContainText('Intro')
  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()

  await page.getByRole('button', { name: 'Index' }).click()
  await dialog.getByRole('button', { name: /VayuNetra/ }).click()
  await expect(dialog).toBeHidden()
  await expect(page.locator('.hud__ring')).toContainText('Ring 04', { timeout: 6000 })
})

test('every figure loads and is described', async ({ page }) => {
  await page.goto('/')
  const images = await page.locator('main img').evaluateAll(async (els) => {
    const imgs = els as HTMLImageElement[]
    await Promise.all(
      imgs.map((img) => {
        img.loading = 'eager'
        return img.decode().catch(() => undefined)
      }),
    )
    return imgs.map((img) => ({ src: img.src, loaded: img.complete && img.naturalWidth > 0, alt: img.alt }))
  })
  expect(images.length).toBeGreaterThanOrEqual(6)
  for (const img of images) {
    expect(img.loaded, img.src).toBe(true)
    expect(img.alt.length, img.src).toBeGreaterThan(20)
  }
})

test('Resume, favicon and social image are served', async ({ page }) => {
  await page.goto('/')
  const resume = page.getByRole('link', { name: /Resume/ }).first()
  await expect(resume).toHaveAttribute('href', '/resume.pdf')
  for (const path of ['/resume.pdf', '/favicon.svg', '/apple-touch-icon.png', '/og-image.jpg']) {
    expect((await page.request.get(path)).status(), path).toBe(200)
  }
})

test('external links open safely in a new tab', async ({ page }) => {
  await page.goto('/')
  const links = page.locator('a[target="_blank"]')
  expect(await links.count()).toBeGreaterThan(10)
  const unsafe = await links.evaluateAll((els) =>
    els.filter((el) => !(el.getAttribute('rel') ?? '').includes('noopener')).map((el) => el.getAttribute('href')),
  )
  expect(unsafe).toEqual([])
})

test('contact form explains mistakes and falls back to email if sending fails', async ({ page }) => {
  await page.goto('/')
  await scrollToChapter(page, 'centre')
  const form = page.locator('form.letter')
  await form.getByRole('button', { name: 'Send' }).click()
  await expect(form.getByText('Tell me who you are.')).toBeVisible()
  await expect(page.locator('#contact-name')).toBeFocused()

  await page.locator('#contact-name').fill('Recruiter')
  await page.locator('#contact-email').fill('recruiter@example.com')
  await page.locator('#contact-message').fill('We would like to talk about a role.')
  // Local preview has no serverless API, so this exercises the failure path.
  await form.getByRole('button', { name: 'Send' }).click()
  await expect(form.getByRole('link', { name: 'omkarkadam181188@gmail.com' })).toBeVisible()
})

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' })

  test('keeps every piece of content visible without animation', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    for (const selector of ['.sheet', '.ledger', '.record__row', '.spec__row', '.figure__frame']) {
      const opacities = await page.locator(selector).evaluateAll((els) => els.map((el) => getComputedStyle(el).opacity))
      expect(opacities.every((o) => o === '1'), selector).toBe(true)
    }
    await scrollToChapter(page, 'fitmon')
    await expect(page.getByRole('heading', { name: 'Fitmon' })).toBeVisible()
  })
})
