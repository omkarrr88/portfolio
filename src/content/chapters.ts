import type { Chapter } from './types'

/** One chapter per ring, outside in. The centre (ring 0) is contact. */
export const chapters: readonly Chapter[] = [
  { ring: 7, label: 'Intro', anchor: 'intro' },
  { ring: 6, label: 'Now', anchor: 'now' },
  { ring: 5, label: 'Chakravyuh', anchor: 'chakravyuh' },
  { ring: 4, label: 'VayuNetra', anchor: 'vayunetra' },
  { ring: 3, label: 'Fitmon', anchor: 'fitmon' },
  { ring: 2, label: 'More work', anchor: 'more-work' },
  { ring: 1, label: 'Beyond code', anchor: 'beyond' },
  { ring: 0, label: 'Centre', anchor: 'centre' },
]

export const chapterForRing = (ring: number): Chapter => chapters.find((c) => c.ring === ring) ?? chapters[0]

export const pad = (n: number): string => String(n).padStart(2, '0')

/** "Ring 05" for the rings, "Centre" for the middle. */
export const ringName = (ring: number): string => (ring === 0 ? 'Centre' : `Ring ${pad(ring)}`)
