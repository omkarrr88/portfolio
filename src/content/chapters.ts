import type { Chapter } from './types'

/**
 * The home scroll, outside in. Each chapter settles on a ring (stage 0 is the
 * outer ring 07, stage 7 the centre); the rings skipped between chapters are
 * where that section's own pages sit, one ring deeper.
 */
export const chapters: readonly Chapter[] = [
  { stage: 0, label: 'Intro', anchor: 'intro' },
  { stage: 1, label: 'Work', anchor: 'work' },
  { stage: 3, label: 'Record', anchor: 'record' },
  { stage: 5, label: 'About', anchor: 'about' },
  { stage: 7, label: 'Contact', anchor: 'contact' },
]

/** The chapter the reader is in at a scroll stage: the last one the camera has reached, give or take half a ring. */
export const chapterForStage = (stage: number): Chapter =>
  chapters.reduce((current, c) => (c.stage <= stage + 0.5 ? c : current), chapters[0])
