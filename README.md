# Omkar Kadam — portfolio (Chakravyuh)

Seven rotating rings, after the Mahabharata's spiral formation. Scrolling moves
one ring inward per chapter; the centre is contact. This repo is the hero
prototype: intro (ring 7), Now (ring 6) and the Chakravyuh project sheet (ring 5).

## Commands

```bash
npm install
npm run dev        # http://localhost:5173 (also on your LAN, for phone testing)
npm run build      # typecheck + production build to dist/
npm run preview    # serve dist/ on the LAN
npm test           # unit tests (Vitest)
npm run test:e2e   # Playwright on laptop + phone viewports (uses system Chrome)
```

## How it fits together

- `src/scene/formation.ts`: ring layout, camera and projection maths (pure, unit-tested).
- `src/scene/shaders.ts` + `RingScene.ts`: one full-screen shader draws the rings as
  distance fields, so lines stay crisp at any zoom. Loaded after first paint.
- `src/scroll/stage.ts`: scroll position → continuous stage (one stage per section).
- `src/content/site.ts`: every fact on the page, taken from the resume.
- `scripts/subset-devanagari.mjs`: rebuilds the 9.5 KB font subset for चक्रव्यूह.
  Re-run it if you add Devanagari text.

Reduced motion gets a static formation and no entrance animations. If WebGL is
unavailable or the shader fails, a CSS fallback is shown.
