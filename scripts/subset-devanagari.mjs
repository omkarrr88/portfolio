// Builds a tiny Devanagari font containing only the glyphs the site uses.
// Re-run after adding Devanagari text: `node scripts/subset-devanagari.mjs`.
import { readFile, writeFile } from 'node:fs/promises'
import subsetFont from 'subset-font'

const SOURCE = 'node_modules/@fontsource/tiro-devanagari-sanskrit/files/tiro-devanagari-sanskrit-devanagari-400-normal.woff2'
const TARGET = 'src/assets/fonts/tiro-devanagari-subset.woff2'
const TEXT = 'चक्रव्यूह'

const source = await readFile(SOURCE)
const subset = await subsetFont(source, TEXT, { targetFormat: 'woff2' })
await writeFile(TARGET, subset)
console.log(`${TARGET}: ${source.length} → ${subset.length} bytes`)
