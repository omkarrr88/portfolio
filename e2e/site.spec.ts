import { expect, test, type Page } from '@playwright/test'

/** The home scroll's chapters, outside in, and the HUD text for each. */
const CHAPTERS = [
  { id: 'intro', ring: 'Ring 07', label: 'Intro' },
  { id: 'work', ring: 'Ring 06', label: 'Work' },
  { id: 'record', ring: 'Ring 04', label: 'Record' },
  { id: 'about', ring: 'Ring 02', label: 'About' },
  { id: 'contact', ring: 'Centre', label: 'Contact' },
] as const

/** Every page besides home, with the heading it opens on. */
const PAGES = [
  { path: '/work/chakravyuh', h1: 'Chakravyuh' },
  { path: '/work/vayunetra', h1: 'VayuNetra' },
  { path: '/work/fitmon', h1: 'Fitmon' },
  { path: '/work/debugger', h1: 'PyTorch Training Run Debugger' },
  { path: '/work/smart-puc', h1: 'Smart PUC' },
  { path: '/work/v2v', h1: 'V2V Blind Spot Detection' },
  { path: '/record/meta-pytorch', h1: 'Meta PyTorch Hackathon' },
  { path: '/record/et-ai', h1: 'ET AI Hackathon 2.0' },
  { path: '/record/iqoo', h1: 'iQOO Hackathon 2026, Pune City Battle' },
  { path: '/record/avishkar', h1: 'Avishkar Research Project Competition 2025' },
  { path: '/record/paper', h1: /^Vehicle-to-Vehicle Communication/ },
  { path: '/about/riamona', h1: 'Full Stack Engineer at Riamona' },
  { path: '/about/terna', h1: 'BE, Information Technology' },
  { path: '/about/leadership', h1: 'Three committees at Terna, from member to lead.' },
  { path: '/about/toolkit', h1: 'What I reach for.' },
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

/** Puts a chapter's heading just under the HUD, past its transition window. */
const scrollToChapter = (page: Page, id: string) =>
  page.evaluate((target) => {
    const section = document.getElementById(target)
    if (!section) throw new Error(`No #${target}`)
    const el = section.querySelector('[data-land]') ?? section
    window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 84)
  }, id)

const noSidewaysScroll = (page: Page) =>
  page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)

test.describe('the home scroll', () => {
  test('renders the intro and the formation without errors', async ({ page }) => {
    const errors = collectErrors(page)
    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Omkar\s*Kadam/)
    await expect(page.locator('canvas.formation__canvas')).toHaveAttribute('data-ready', 'true')
    await page.waitForTimeout(500)
    expect(errors).toEqual([])
  })

  test('has every chapter in order, each showing its whole section', async ({ page }) => {
    await page.goto('/')
    const ids = await page.locator('main [data-chapter]').evaluateAll((els) => els.map((el) => el.id))
    expect(ids).toEqual(CHAPTERS.map((c) => c.id))
    await expect(page.locator('#work .tile')).toHaveCount(6)
    await expect(page.locator('#record .result-tile')).toHaveCount(4)
    await expect(page.locator('#record .paper-tile')).toHaveCount(1)
    await expect(page.locator('#about .about-tile')).toHaveCount(4)
    await expect(page.locator('#contact form.letter')).toHaveCount(1)
  })

  test('the HUD tracks the ring and chapter from the outside to the centre, never scrolling sideways', async ({ page }) => {
    await page.goto('/')
    const ring = page.locator('.hud__ring')
    for (const { id, ring: label, label: chapter } of CHAPTERS) {
      await scrollToChapter(page, id)
      await expect(ring, `#${id}`).toContainText(label)
      await expect(ring, `#${id}`).toContainText(chapter)
      expect(await noSidewaysScroll(page), `#${id}`).toBe(true)
    }
  })

  test('says up front what I’m open to, with a way to get in touch', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('.hero__status')).toHaveText('Open to full-time roles, freelance and contract work.')
    await page.locator('.hero__action', { hasText: 'Start a conversation' }).click()
    await expect(page).toHaveURL(/\/#contact$/)
    await expect(page.locator('.hud__ring')).toContainText('Centre', { timeout: 6000 })
    await expect(page.locator('#contact .service')).toHaveCount(4)
  })

  test('shows the organisers’ logos beside the hackathon results', async ({ page }) => {
    await page.goto('/')
    for (const brand of ['meta', 'pytorch', 'economic-times', 'iqoo']) {
      await expect(page.locator(`.hero__brands .brand--${brand} svg`)).toHaveCount(1)
      await expect(page.locator(`#record .brand--${brand} svg`)).toHaveCount(1)
    }
  })

  test('the top bar and old section addresses land on their chapters', async ({ page }) => {
    await page.goto('/')
    // Phones keep the four chapters in the Index rather than the top bar.
    const nav = page.locator('.hud__nav a[href="/#about"]')
    if (await nav.isVisible()) {
      await nav.click()
    } else {
      await page.getByRole('button', { name: 'Index' }).click()
      await page.getByRole('dialog', { name: 'Index' }).locator('a[href="/#about"]').click()
    }
    await expect(page).toHaveURL(/\/#about$/)
    await expect(page.locator('.hud__ring')).toContainText('Ring 02')
    await expect(page.locator('.hud__nav [aria-current]')).toHaveText('About')

    await page.goto('/record')
    await expect(page).toHaveURL(/\/#record$/)
    await expect(page.locator('.hud__ring')).toContainText('Ring 04')
  })
})

test.describe('pages', () => {
  test('every page loads on its own URL with its own title and heading', async ({ page }) => {
    test.setTimeout(120_000)
    const errors = collectErrors(page)
    for (const { path, h1 } of PAGES) {
      await page.goto(path)
      await expect(page.getByRole('heading', { level: 1 }), path).toHaveText(h1)
      await expect(page, path).not.toHaveTitle('Omkar Kadam · Full-stack & ML engineer')
      expect(await noSidewaysScroll(page), path).toBe(true)
    }
    expect(errors).toEqual([])
  })

  test('next and previous step through a section, wrapping round', async ({ page }) => {
    await page.goto('/work/v2v')
    await page.getByRole('link', { name: /Next/ }).click()
    await expect(page).toHaveURL(/\/work\/chakravyuh$/)
    await page.getByRole('link', { name: /Previous/ }).click()
    await expect(page).toHaveURL(/\/work\/v2v$/)
  })

  test('the committees link to their own pages', async ({ page }) => {
    await page.goto('/about/leadership')
    for (const handle of ['csi_terna', 'tnp_terna', 'reviveterna']) {
      await expect(page.locator(`a[href="https://www.instagram.com/${handle}"]`)).toHaveCount(1)
    }
  })

  test('an unknown address says so and offers the way in', async ({ page }) => {
    await page.goto('/nothing-here')
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('There’s nothing on this ring.')
    await page.locator('.missing-links a[href="/#work"]').click()
    await expect(page).toHaveURL(/\/#work$/)
  })
})

test.describe('between the scroll and the pages', () => {
  test('a tile dives into its page, and Back returns to the same place in the scroll', async ({ page }) => {
    await page.goto('/')
    await scrollToChapter(page, 'work')
    await expect(page.locator('.hud__ring')).toContainText('Ring 06')
    // Bring the tile into view first, so the click itself doesn't move the page.
    const tile = page.locator('#work a[href="/work/chakravyuh"]')
    await tile.scrollIntoViewIfNeeded()
    await page.waitForTimeout(300)
    const before = await page.evaluate(() => window.scrollY)

    await tile.click()
    await expect(page).toHaveURL(/\/work\/chakravyuh$/)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Chakravyuh')
    await expect(page.getByRole('heading', { level: 1 })).toBeFocused()
    await expect(page.locator('.hud__ring')).toContainText('Work / Chakravyuh')

    await page.goBack()
    await expect(page.locator('#work .tile')).toHaveCount(6)
    await expect(page.locator('.hud__ring')).toContainText('Ring 06')
    const after = await page.evaluate(() => window.scrollY)
    expect(Math.abs(after - before)).toBeLessThan(120)
  })

  test('a page’s breadcrumb and footer lead back to its chapter', async ({ page }) => {
    await page.goto('/record/et-ai')
    await page.locator('.marker a[href="/#record"]').click()
    await expect(page).toHaveURL(/\/#record$/)
    await expect(page.locator('.hud__ring')).toContainText('Ring 04')

    await page.goto('/about/toolkit')
    await page.locator('.page-foot__back').click()
    await expect(page).toHaveURL(/\/#about$/)
  })

  test('the Index lists every chapter and page, and jumps into the scroll', async ({ page }) => {
    await page.goto('/about/terna')
    await page.getByRole('button', { name: 'Index' }).click()
    const dialog = page.getByRole('dialog', { name: 'Index' })
    await expect(dialog).toBeVisible()
    await expect(dialog.locator('[aria-current="page"]')).toHaveText('Terna')
    // Home, 4 chapters, 6 projects, 5 record items, 4 About parts, then 4 contact links.
    await expect(dialog.getByRole('link')).toHaveCount(1 + 4 + 6 + 5 + 4 + 4)
    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()

    await page.getByRole('button', { name: 'Index' }).click()
    await dialog.locator('a[href="/#record"]').click()
    await expect(dialog).toBeHidden()
    await expect(page).toHaveURL(/\/#record$/)
    await expect(page.locator('.hud__ring')).toContainText('Ring 04', { timeout: 6000 })
  })
})

test('every figure on a project page loads and is described', async ({ page }) => {
  for (const path of ['/work/chakravyuh', '/work/fitmon', '/work/v2v']) {
    await page.goto(path)
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
    expect(images.length, path).toBeGreaterThanOrEqual(1)
    for (const img of images) {
      expect(img.loaded, img.src).toBe(true)
      expect(img.alt.length, img.src).toBeGreaterThan(20)
    }
  }
})

test('resume, icons, manifest, social images and sitemap are served', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('link', { name: /Resume/ }).first()).toHaveAttribute('href', '/resume.pdf')
  const files = ['/resume.pdf', '/favicon.svg', '/favicon.ico', '/icon-192.png', '/icon-512.png', '/apple-touch-icon.png']
  for (const path of [...files, '/site.webmanifest', '/og/home.png', '/og/work-chakravyuh.png', '/sitemap.xml']) {
    expect((await page.request.get(path)).status(), path).toBe(200)
  }
})

test.describe('what search engines and link previews see', () => {
  /** The page as a crawler without JavaScript gets it. */
  const rawHtml = async (page: Page, path: string) => (await page.request.get(path)).text()

  test('every page arrives with its content, its own title and its structured data', async ({ page }) => {
    for (const { path, h1 } of [{ path: '/', h1: 'Omkar Kadam' }, ...PAGES]) {
      const html = await rawHtml(page, path)
      const heading = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1]?.replace(/<[^>]+>/g, '').trim() ?? ''
      if (typeof h1 === 'string') expect(heading, path).toBe(h1)
      else expect(heading, path).toMatch(h1)
      const ld = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1] ?? '{}'
      const graph: { '@type': string }[] = JSON.parse(ld)['@graph'] ?? []
      expect(graph.map((n) => n['@type']), path).toContain(path === '/' ? 'ProfilePage' : 'BreadcrumbList')
      expect(graph.map((n) => n['@type']), path).toContain('Person')
      expect(html, path).toContain(`<link rel="canonical" href="https://omkar-kadam.vercel.app${path}" />`)
    }
  })

  test('each page has its own share image, and it exists', async ({ page }) => {
    for (const path of ['/', '/work/fitmon', '/record/iqoo', '/about/toolkit']) {
      const html = await rawHtml(page, path)
      const image = html.match(/<meta property="og:image" content="([^"]+)"/)?.[1] ?? ''
      const slug = path === '/' ? 'home' : path.slice(1).replace(/\//g, '-')
      expect(image, path).toBe(`https://omkar-kadam.vercel.app/og/${slug}.png`)
      const response = await page.request.get(new URL(image).pathname)
      expect(response.headers()['content-type'], path).toContain('image/png')
    }
  })

  test('the name is two words, not "OmkarKadam"', async ({ page }) => {
    await page.goto('/')
    expect(await page.locator('h1').evaluate((el) => el.textContent?.replace(/\s+/g, ' ').trim())).toBe('Omkar Kadam')
  })
})

test('keyboard users can skip the top bar', async ({ page }) => {
  await page.goto('/work/chakravyuh')
  await page.keyboard.press('Tab')
  const skip = page.getByRole('link', { name: 'Skip to content' })
  await expect(skip).toBeFocused()
  await expect(skip).toBeInViewport()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused()
})

test('external links open safely in a new tab', async ({ page }) => {
  for (const path of ['/', '/work/chakravyuh', '/about/leadership']) {
    await page.goto(path)
    const unsafe = await page
      .locator('a[target="_blank"]')
      .evaluateAll((els) =>
        els.filter((el) => !(el.getAttribute('rel') ?? '').includes('noopener')).map((el) => el.getAttribute('href')),
      )
    expect(unsafe, path).toEqual([])
  }
})

test('contact form explains mistakes and falls back to email if sending fails', async ({ page }) => {
  await page.goto('/#contact')
  const form = page.locator('form.letter')
  await form.getByRole('button', { name: 'Send' }).click()
  await expect(form.getByText('Tell me who you are.')).toBeVisible()
  await expect(page.locator('#contact-name')).toBeFocused()

  // A budget is asked only about project work.
  await expect(page.locator('#contact-budget')).toHaveCount(0)
  await form.getByRole('radio', { name: 'A freelance project' }).check()
  await expect(page.locator('#contact-budget')).toBeVisible()
  await form.getByRole('radio', { name: 'A full-time role' }).check()
  await expect(page.locator('#contact-budget')).toHaveCount(0)

  await page.locator('#contact-name').fill('Recruiter')
  await page.locator('#contact-email').fill('recruiter@example.com')
  await page.locator('#contact-message').fill('We would like to talk about a role.')
  // Local preview has no serverless API, so this exercises the failure path.
  await form.getByRole('button', { name: 'Send' }).click()
  await expect(form.getByRole('link', { name: 'omkarkadam181188@gmail.com' })).toBeVisible()
})

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' })

  test('keeps every piece of content visible and navigates without animation', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    for (const selector of ['.tile', '.result-tile', '.paper-tile', '.about-tile', '.centre__contact']) {
      const opacities = await page.locator(selector).evaluateAll((els) => els.map((el) => getComputedStyle(el).opacity))
      expect(opacities.length, selector).toBeGreaterThan(0)
      expect(opacities.every((o) => o === '1'), selector).toBe(true)
    }
    await page.locator('#work a[href="/work/fitmon"]').click()
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Fitmon')
    for (const selector of ['.sheet', '.figure__frame', '.numbers__item']) {
      const opacities = await page.locator(selector).evaluateAll((els) => els.map((el) => getComputedStyle(el).opacity))
      expect(opacities.every((o) => o === '1'), selector).toBe(true)
    }
  })
})
