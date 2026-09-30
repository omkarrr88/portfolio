import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { releaseReveals } from './pending'

gsap.registerPlugin(ScrollTrigger, SplitText)

const EASE = 'expo.out'

export interface RevealOptions {
  /** Seconds to hold everything already on screen, so a new page arrives as the camera does. */
  readonly delay: number
}

const trigger = (el: Element, start = 'top 86%'): ScrollTrigger.Vars => ({ trigger: el, start, once: true })

/** On screen now: plays straight away (after the base delay). Further down: waits for the scroll. */
const onScreen = (el: Element) => el.getBoundingClientRect().top < window.innerHeight * 0.92

const timing = (el: Element, base: number, start?: string) =>
  onScreen(el) ? { delay: base } : { delay: 0, scrollTrigger: trigger(el, start) }

const HEADING = /^H[1-6]$/

/**
 * Headings rise line by line out of a mask. Re-splits on resize so lines always match the layout.
 * Whole lines read fine as they are, so only headings get SplitText's aria-label (a paragraph may not carry one).
 */
function splitLines(root: HTMLElement, base: number): void {
  root.querySelectorAll<HTMLElement>('[data-split]').forEach((el) => {
    const big = el.classList.contains('hero__title')
    const when = timing(el, base, 'top 84%')
    SplitText.create(el, {
      type: 'lines',
      mask: 'lines',
      linesClass: 'split-line',
      aria: HEADING.test(el.tagName) ? 'auto' : 'none',
      autoSplit: true,
      onSplit: (self) =>
        gsap.from(self.lines, {
          yPercent: 112,
          duration: big ? 1.4 : 1.2,
          ease: EASE,
          stagger: big ? 0.09 : 0.07,
          ...when,
          delay: when.delay + (big ? 0.15 : 0),
        }),
    })
  })
}

function fadeUp(root: HTMLElement, base: number): void {
  root.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
    const inHero = el.closest('.hero') !== null
    const when = timing(el, base)
    gsap.from(el, { opacity: 0, y: 18, duration: 1, ease: EASE, ...when, delay: when.delay + (inHero ? 0.45 : 0.12) })
  })

  // Lists, rows and tiles come in one after another rather than as a block.
  root.querySelectorAll<HTMLElement>('[data-stagger]').forEach((el) => {
    gsap.from(el.children, { opacity: 0, y: 22, duration: 1, ease: EASE, stagger: 0.07, ...timing(el, base + 0.18) })
  })
}

/** Paper sheets land like a page put down on a table, swinging in from alternate sides. */
function landSheets(root: HTMLElement, base: number): void {
  root.querySelectorAll<HTMLElement>('[data-sheet]').forEach((el) => {
    const side = el.dataset.sheet === 'left' ? -1 : 1
    gsap.from(el, {
      y: 140,
      rotate: 2.2 * side,
      transformOrigin: side > 0 ? '30% 100%' : '70% 100%',
      duration: 1.5,
      ease: EASE,
      ...timing(el, base + 0.2, 'top 94%'),
    })
  })
}

/** Figures unveil top to bottom while the image settles from a slight zoom. */
function unveilFigures(root: HTMLElement, base: number): void {
  root.querySelectorAll<HTMLElement>('[data-figure] .figure__frame').forEach((frame) => {
    const images = frame.querySelectorAll('img')
    const when = timing(frame, base + 0.35, 'top 82%')
    const tl = gsap.timeline(when.scrollTrigger ? { scrollTrigger: when.scrollTrigger } : { delay: when.delay })
    tl.fromTo(frame, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.3, ease: 'expo.inOut' })
    tl.from(images, { scale: 1.06, duration: 1.8, ease: EASE, stagger: 0.08 }, 0.1)
  })
}

/**
 * Entrances for one page: text, tiles, sheets and figures. Only opacity and
 * transforms are animated (never visibility), so content waiting to be
 * revealed stays in the accessibility tree. Everything is visible without
 * this module (reduced motion never loads it). Returns a cleanup.
 */
export function initReveals(root: HTMLElement, { delay }: RevealOptions): () => void {
  // Unhide and set every starting state in the same task, so nothing flashes in between.
  releaseReveals()
  const ctx = gsap.context(() => {
    splitLines(root, delay)
    fadeUp(root, delay)
    landSheets(root, delay)
    unveilFigures(root, delay)
  }, root)

  // Images and late layout shifts move trigger positions; recompute once things settle.
  const refresh = () => ScrollTrigger.refresh()
  window.addEventListener('load', refresh, { once: true })

  return () => {
    window.removeEventListener('load', refresh)
    ctx.revert()
  }
}
