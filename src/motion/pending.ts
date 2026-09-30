/**
 * A script in index.html marks the page "reveal pending" before anything
 * paints, so prerendered content that is about to animate in starts hidden
 * rather than showing, vanishing and then animating. Releasing the mark shows
 * everything as it is; the reveals release it just before they take over.
 */
export const REVEAL_PENDING = 'data-reveal-pending'

export const releaseReveals = (): void => document.documentElement.removeAttribute(REVEAL_PENDING)
