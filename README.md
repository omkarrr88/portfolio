# Omkar Kadam — portfolio (Chakravyuh)

Seven rotating rings, after the Mahabharata's spiral formation. Scrolling moves
one ring inward per chapter; at the centre the camera rises and shows the whole
formation from above, and that's where the contact details are.

| Ring | Chapter | What's there |
| --- | --- | --- |
| 07 | Intro | Name, one-line intro, the three 2026 hackathon results |
| 06 | Now | Experience, education, toolkit |
| 05 | Chakravyuh | Project sheet |
| 04 | VayuNetra | Project sheet |
| 03 | Fitmon | Project sheet |
| 02 | More work | PyTorch Training Run Debugger, Smart PUC, V2V |
| 01 | Beyond code | Hackathon record, publication, leadership |
| Centre | Contact | Email, links, contact form |

## Commands

```bash
npm install
npm run dev        # http://localhost:5173 (also on your LAN, for phone testing)
npm run build      # typecheck + production build to dist/
npm run preview    # serve dist/ on the LAN
npm test           # unit tests (Vitest)
npm run test:e2e   # Playwright on laptop + phone viewports (uses system Chrome)
npm run lint       # oxlint
```

Pushing to `main` deploys on Vercel. The contact form needs `SENDGRID_API_KEY`
set in the Vercel project; if it's missing or SendGrid fails, the form says so
and shows the email address instead.

## How it fits together

- `src/content/`: every fact on the page. `profile.ts` follows `public/resume.tex`;
  `projects.ts` takes its numbers from each project's repo. Edit these, not the components.
- `src/scene/formation.ts`: ring layout, camera path (including the finale at the
  centre) and projection maths. Pure and unit-tested.
- `src/scene/shaders.ts` + `RingScene.ts`: one full-screen WebGL2 shader draws the
  rings as distance fields, so lines stay crisp at any zoom. Loaded after first paint.
- `src/scroll/`: scroll position → stage (one per section), and how far the reader
  is inside dense text (`data-dense`), which makes the formation step back.
- `src/motion/reveals.ts`: GSAP entrances, loaded lazily and skipped for reduced motion.
- `api/contact.js`: Vercel function for the contact form (validation, honeypot,
  plain-text email through SendGrid).
- `scripts/subset-devanagari.mjs`: rebuilds the font subset for चक्रव्यूह and
  वायुनेत्र. Re-run it if you add Devanagari text.

Reduced motion gets a still formation and no entrance animations. If WebGL is
unavailable or the shader fails, a CSS fallback is shown.
