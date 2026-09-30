import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(ScrollTrigger, SplitText)

const EASE = 'expo.out'

/**
 * Text and sheet entrances. Headings rise line by line out of a mask; the
 * project sheet lands like a card set down on a table. Returns a cleanup.
 */
export function initReveals(root: HTMLElement): () => void {
  const ctx = gsap.context(() => {
    const hero = root.querySelector<HTMLElement>('.hero__title')
    if (hero) {
      const split = SplitText.create(hero, { type: 'lines', mask: 'lines', linesClass: 'split-line' })
      gsap.from(split.lines, { yPercent: 110, duration: 1.4, ease: EASE, stagger: 0.09, delay: 0.15 })
    }

    root.querySelectorAll<HTMLElement>('.chapter__title').forEach((el) => {
      const split = SplitText.create(el, { type: 'lines', mask: 'lines', linesClass: 'split-line' })
      gsap.from(split.lines, {
        yPercent: 110,
        duration: 1.2,
        ease: EASE,
        stagger: 0.07,
        scrollTrigger: { trigger: el, start: 'top 82%' },
      })
    })

    root.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
      gsap.from(el, {
        autoAlpha: 0,
        y: 18,
        duration: 1,
        ease: EASE,
        scrollTrigger: { trigger: el, start: 'top 88%' },
      })
    })

    root.querySelectorAll<HTMLElement>('[data-sheet]').forEach((el) => {
      gsap.from(el, {
        y: 140,
        rotate: 2.2,
        transformOrigin: '30% 100%',
        duration: 1.5,
        ease: EASE,
        scrollTrigger: { trigger: el, start: 'top 92%' },
      })
    })
  }, root)

  return () => ctx.revert()
}
