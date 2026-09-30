import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(ScrollTrigger, SplitText)

const EASE = 'expo.out'
/** The hero is on screen at load; its parts arrive in order after the title starts. */
const HERO_DELAY = 0.45

const trigger = (el: Element, start = 'top 86%'): ScrollTrigger.Vars => ({ trigger: el, start, once: true })

/** Headings rise line by line out of a mask. Re-splits on resize so lines always match the layout. */
function splitLines(root: HTMLElement): void {
  root.querySelectorAll<HTMLElement>('[data-split]').forEach((el) => {
    const isHero = el.classList.contains('hero__title')
    SplitText.create(el, {
      type: 'lines',
      mask: 'lines',
      linesClass: 'split-line',
      autoSplit: true,
      onSplit: (self) =>
        gsap.from(self.lines, {
          yPercent: 112,
          duration: isHero ? 1.4 : 1.2,
          ease: EASE,
          stagger: isHero ? 0.09 : 0.07,
          delay: isHero ? 0.15 : 0,
          scrollTrigger: isHero ? undefined : trigger(el, 'top 84%'),
        }),
    })
  })
}

function fadeUp(root: HTMLElement): void {
  root.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
    const inHero = el.closest('.hero') !== null
    gsap.from(el, {
      opacity: 0,
      y: 18,
      duration: 1,
      ease: EASE,
      delay: inHero ? HERO_DELAY : 0,
      scrollTrigger: inHero ? undefined : trigger(el),
    })
  })

  // Lists and rows come in one after another rather than as a block.
  root.querySelectorAll<HTMLElement>('[data-stagger]').forEach((el) => {
    gsap.from(el.children, {
      opacity: 0,
      y: 16,
      duration: 0.9,
      ease: EASE,
      stagger: 0.06,
      scrollTrigger: trigger(el),
    })
  })
}

/** Paper sheets land like a page put down on a table, swinging in from alternate sides. */
function landSheets(root: HTMLElement): void {
  root.querySelectorAll<HTMLElement>('[data-sheet]').forEach((el) => {
    const side = el.dataset.sheet === 'left' ? -1 : 1
    gsap.from(el, {
      y: 140,
      rotate: 2.2 * side,
      transformOrigin: side > 0 ? '30% 100%' : '70% 100%',
      duration: 1.5,
      ease: EASE,
      scrollTrigger: trigger(el, 'top 94%'),
    })
  })
}

/** Figures unveil top to bottom while the image settles from a slight zoom. */
function unveilFigures(root: HTMLElement): void {
  root.querySelectorAll<HTMLElement>('[data-figure] .figure__frame').forEach((frame) => {
    const images = frame.querySelectorAll('img')
    const tl = gsap.timeline({ scrollTrigger: trigger(frame, 'top 82%') })
    tl.fromTo(frame, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.3, ease: 'expo.inOut' })
    tl.from(images, { scale: 1.06, duration: 1.8, ease: EASE, stagger: 0.08 }, 0.1)
  })
}

/**
 * Entrances for text, sheets and figures. Only opacity and transforms are
 * animated (never visibility), so content waiting to be revealed stays in
 * the accessibility tree. Everything is visible without this module
 * (reduced motion never loads it). Returns a cleanup.
 */
export function initReveals(root: HTMLElement): () => void {
  const ctx = gsap.context(() => {
    splitLines(root)
    fadeUp(root)
    landSheets(root)
    unveilFigures(root)
  }, root)

  // Images and late layout shifts move trigger positions; recompute once things settle.
  const refresh = () => ScrollTrigger.refresh()
  window.addEventListener('load', refresh, { once: true })

  return () => {
    window.removeEventListener('load', refresh)
    ctx.revert()
  }
}
