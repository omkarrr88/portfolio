import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { cardFor } from '../src/seo/cards'
import { allPaths, parseRoute } from '../src/router/routes'
import { pathSlug } from '../src/seo/site'
import { CARD_HEIGHT, CARD_WIDTH, loadFonts, renderCard, titleSize } from './og-cards'

const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47]

/** Width and height from a PNG's IHDR chunk. */
const pngSize = (png: Buffer) => ({ width: png.readUInt32BE(16), height: png.readUInt32BE(20) })

describe('share cards', () => {
  it('has a card for every page but the 404', () => {
    for (const path of allPaths()) expect(cardFor(parseRoute(path)), path).not.toBeNull()
    expect(cardFor({ kind: 'notFound' })).toBeNull()
  })

  it('sets long titles smaller', () => {
    expect(titleSize('Fitmon')).toBeGreaterThan(titleSize('PyTorch Training Run Debugger'))
    expect(titleSize('x'.repeat(120))).toBeLessThan(60)
  })

  it('draws a 1200×630 PNG', async () => {
    const fonts = await loadFonts()
    const card = cardFor(parseRoute('/work/chakravyuh'))
    if (!card) throw new Error('no card')
    const png = await renderCard(card, fonts, 'omkar-kadam.vercel.app')
    expect([...png.subarray(0, 4)]).toEqual(PNG_SIGNATURE)
    expect(pngSize(png)).toEqual({ width: CARD_WIDTH, height: CARD_HEIGHT })
  }, 20_000)

  // OG_PREVIEW_DIR=/some/dir npx vitest run scripts/og-cards.test.ts writes every card there to look at.
  it.runIf(Boolean(process.env.OG_PREVIEW_DIR))('writes previews', async () => {
    const dir = process.env.OG_PREVIEW_DIR ?? ''
    await mkdir(dir, { recursive: true })
    const fonts = await loadFonts()
    for (const path of allPaths()) {
      const card = cardFor(parseRoute(path))
      if (card) await writeFile(join(dir, `${pathSlug(path)}.png`), await renderCard(card, fonts, 'omkar-kadam.vercel.app'))
    }
  }, 60_000)
})
