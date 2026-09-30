# Omkar Kadam — portfolio (Chakravyuh)

Seven rotating rings, after the Mahabharata's spiral formation. The home page is
one scroll that dives inward ring by ring, a chapter at a time, each showing its
whole section on one screen. At the centre the camera rises and shows the whole
formation from above, and that's where the contact details are.

| Ring | Chapter (`/#…`) | What's there |
| --- | --- | --- |
| 07 | Intro | Name, one-line intro, the three 2026 hackathon results and their organisers' logos |
| 06 | Work (`#work`) | All six projects: three hackathon builds large, three more beneath |
| 04 | Record (`#record`) | Four results and the paper |
| 02 | About (`#about`) | The job, the degree, leadership, the toolkit |
| Centre | Contact (`#contact`) | Email, links, contact form |

Every tile opens a page of its own, one ring deeper than its chapter, with a
camera dive between them: `/work/<project>` (the full project sheet),
`/record/<result>` and `/record/paper`, `/about/riamona|terna|leadership|toolkit`.
Back and Forward return to the same place in the scroll. `/work`, `/record`,
`/about` and `/contact` redirect to their chapters.

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
- `src/router/`: a small History-API router (real URLs, Back/Forward, `/#chapter`
  links), each route's title, breadcrumbs and place in the formation (`meta.ts`).
- `src/pages/` + `src/components/sections/`: the home scroll's chapters and the item pages.
- `src/scroll/`: scroll position → camera stage (each chapter's `data-stage`), and how far
  the reader is inside dense text (`data-dense`), which makes the formation step back.
- `scripts/route-pages.ts`: at build time, writes one HTML file per page with its own
  title, description and canonical URL, plus `404.html` and `sitemap.xml`. `vercel.json`
  serves them with clean URLs.
- `src/motion/reveals.ts`: GSAP entrances, loaded lazily and skipped for reduced motion.
- `api/contact.js`: Vercel function for the contact form (validation, honeypot,
  plain-text email through SendGrid).
- `src/assets/brands/`: one-colour organiser logos (Meta and PyTorch from Simple Icons;
  The Economic Times and iQOO wordmarks from Wikimedia Commons). They are their owners'
  trademarks, shown only beside the results won at those events.

Reduced motion gets a still formation and no entrance animations. If WebGL is
unavailable or the shader fails, a CSS fallback is shown.
