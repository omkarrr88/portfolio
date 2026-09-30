import { readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { Resvg } from '@resvg/resvg-js'
import satori from 'satori'
import type { Card } from '../src/seo/cards.ts'

/**
 * Share images (1200×630) drawn at build time in the site's own style: the
 * rings on the right, the page's name large on the left, the result in
 * vermilion. Satori lays the text out as SVG and resvg turns it into a PNG.
 */

export const CARD_WIDTH = 1200
export const CARD_HEIGHT = 630

const INK = '#ece7de'
const INK_2 = '#a8a297'
const INK_3 = '#85807a'
const BG = '#0b0a09'
const ACCENT = '#ec4f2d'
/** The text column stops short of the rings. */
const TEXT_WIDTH = 700

type Font = { name: string; data: Buffer; weight: 400 | 500 | 600; style: 'normal' }

const require = createRequire(import.meta.url)
const fontFile = (pkg: string, file: string) => require.resolve(`@fontsource/${pkg}/files/${file}`)

/** Satori reads WOFF (not WOFF2); @fontsource ships both. */
export async function loadFonts(): Promise<Font[]> {
  const load = async (name: string, pkg: string, weight: Font['weight']) => ({
    name,
    weight,
    style: 'normal' as const,
    data: await readFile(fontFile(pkg, `${pkg}-latin-${weight}-normal.woff`)),
  })
  return Promise.all([
    load('Familjen Grotesk', 'familjen-grotesk', 400),
    load('Familjen Grotesk', 'familjen-grotesk', 600),
    load('IBM Plex Mono', 'ibm-plex-mono', 500),
  ])
}

/** Seven thin rings, the outer one vermilion, a glow at the centre: the formation seen from above. */
function ringsSvg(): string {
  const radii = [292, 246, 202, 160, 120, 82, 46]
  const rings = radii
    .map((r, i) => {
      const circumference = 2 * Math.PI * r
      const gap = circumference * (0.08 + (i % 3) * 0.06)
      const stroke = i === 0 ? ACCENT : 'rgba(236,231,222,0.22)'
      const width = i === 0 ? 2 : 1.4
      const turn = (i * 67) % 360
      return `<circle cx="310" cy="310" r="${r}" fill="none" stroke="${stroke}" stroke-width="${width}" stroke-dasharray="${(circumference - gap).toFixed(1)} ${gap.toFixed(1)}" transform="rotate(${turn} 310 310)"/>`
    })
    .join('')
  const glow = `<radialGradient id="g"><stop offset="0" stop-color="${ACCENT}" stop-opacity="0.35"/><stop offset="1" stop-color="${ACCENT}" stop-opacity="0"/></radialGradient>`
  return `<svg xmlns="http://www.w3.org/2000/svg" width="620" height="620" viewBox="0 0 620 620"><defs>${glow}</defs><circle cx="310" cy="310" r="110" fill="url(#g)"/>${rings}<circle cx="310" cy="310" r="5" fill="${ACCENT}"/></svg>`
}

const RINGS = `data:image/svg+xml;base64,${Buffer.from(ringsSvg()).toString('base64')}`

/** Long names get smaller type so every card keeps the same shape. */
export function titleSize(title: string): number {
  if (title.length <= 12) return 124
  if (title.length <= 22) return 92
  if (title.length <= 40) return 68
  return 46
}

type El = { type: string; props: Record<string, unknown> }
const el = (type: string, style: Record<string, unknown>, children?: unknown, extra: Record<string, unknown> = {}): El => ({
  type,
  props: { style, children, ...extra },
})

const mono = (size: number, color: string) => ({
  fontFamily: 'IBM Plex Mono',
  fontWeight: 500,
  fontSize: size,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color,
})

function layout(card: Card, site: string): El {
  const size = titleSize(card.title)
  return el(
    'div',
    { width: CARD_WIDTH, height: CARD_HEIGHT, display: 'flex', position: 'relative', background: BG, fontFamily: 'Familjen Grotesk' },
    [
      // Cropped by the right edge, clear of the text: the formation as the site shows it at the centre.
      el('img', { position: 'absolute', right: -250, top: 5, width: 620, height: 620 }, undefined, { src: RINGS }),
      el('div', { position: 'absolute', left: 72, top: 0, width: 56, height: 5, background: ACCENT }),
      el(
        'div',
        { display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '64px 72px 56px', width: '100%' },
        [
          el('div', { display: 'flex', flexDirection: 'column', maxWidth: TEXT_WIDTH }, [
            el('div', { ...mono(19, INK_2), marginBottom: 30 }, card.eyebrow),
            el(
              'div',
              { fontWeight: 600, fontSize: size, lineHeight: 0.94, letterSpacing: '-0.045em', color: INK, marginLeft: -4 },
              card.title,
            ),
            el('div', { fontWeight: 400, fontSize: 30, lineHeight: 1.3, color: INK_2, marginTop: 28, maxWidth: TEXT_WIDTH - 60 }, card.subtitle),
          ]),
          el('div', { display: 'flex', flexDirection: 'column', gap: 26 }, [
            el(
              'div',
              { display: 'flex', flexDirection: 'column', gap: 8, ...mono(19, ACCENT), maxWidth: TEXT_WIDTH, lineHeight: 1.35 },
              card.accent.split('\n').map((line) => el('div', {}, line)),
            ),
            el('div', { display: 'flex', ...mono(17, INK_3), letterSpacing: '0.14em' }, [
              el('span', { color: INK }, 'Omkar Kadam'),
              el('span', { marginLeft: 18 }, site),
            ]),
          ]),
        ],
      ),
    ],
  )
}

/** One card as PNG bytes. */
export async function renderCard(card: Card, fonts: Font[], site: string): Promise<Buffer> {
  // Satori takes React-element-shaped objects; plain ones keep this file free of JSX.
  const svg = await satori(layout(card, site) as unknown as Parameters<typeof satori>[0], {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    fonts,
  })
  return new Resvg(svg, { fitTo: { mode: 'width', value: CARD_WIDTH } }).render().asPng()
}
