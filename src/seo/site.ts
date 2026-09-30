/** Where the site lives; every canonical URL, sitemap entry and share image is built from it. */
export const ORIGIN = 'https://omkar-kadam.vercel.app'

/** "/" is "home", "/work/chakravyuh" is "work-chakravyuh": file names for per-page assets. */
export const pathSlug = (path: string): string => (path === '/' ? 'home' : path.replace(/^\/+|\/+$/g, '').replace(/\//g, '-'))

/** The share image made for a page at build time (scripts/og-cards.ts). */
export const shareImagePath = (path: string): string => `/og/${pathSlug(path)}.png`
