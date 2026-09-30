# Omkar Kadam — portfolio (Chakravyuh)

Seven rotating rings, after the Mahabharata's spiral formation. The home page is
one scroll that dives inward ring by ring, a chapter at a time, each showing its
whole section on one screen. At the centre the camera rises and shows the whole
formation from above, and that's where the contact details are.

| Ring | Chapter (`/#…`) | What's there |
| --- | --- | --- |
| 07 | Intro | Name, one-line intro, availability, the latest hackathon results and their organisers' logos |
| 06 | Work (`#work`) | Every project: the featured builds large, the rest beneath |
| 04 | Record (`#record`) | Every result and the paper |
| 02 | About (`#about`) | The job, the degree, leadership, the toolkit |
| Centre | Contact (`#contact`) | Email, links, what I take on as freelance work, contact form |

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
  `copy.ts` works out the headlines that count or date things ("Six builds, three hackathon
  results") from the data, so they stay true as things are added.
- `src/scene/formation.ts`: ring layout, camera path (including the finale at the
  centre) and projection maths. Pure and unit-tested.
- `src/scene/shaders.ts` + `RingScene.ts`: one full-screen WebGL2 shader draws the
  rings as distance fields, so lines stay crisp at any zoom. Loaded after first paint.
- `src/router/`: a small History-API router (real URLs, Back/Forward, `/#chapter`
  links), each route's title, breadcrumbs and place in the formation (`meta.ts`).
- `src/pages/` + `src/components/sections/`: the home scroll's chapters and the item pages.
- `src/scroll/`: scroll position → camera stage (each chapter's `data-stage`), and how far
  the reader is inside dense text (`data-dense`), which makes the formation step back.
- `scripts/route-pages.ts`: at build time, writes one HTML file per page with the page
  itself prerendered (`src/entry-server.tsx`; the browser hydrates it), its own title,
  description, canonical URL, schema.org data (`src/seo/structuredData.ts`) and share image,
  plus `404.html` and `sitemap.xml`. `vercel.json` serves them with clean URLs and caches
  the hashed assets for a year.
- `scripts/og-cards.ts` + `src/seo/cards.ts`: the 1200×630 share image for every page, drawn
  at build time in the site's style (satori + resvg) into `dist/og/`.
- `src/motion/reveals.ts`: GSAP entrances, loaded lazily and skipped for reduced motion.
- `api/contact.js`: Vercel function for the contact form (validation, honeypot,
  plain-text email through SendGrid).
- `src/assets/brands/`: one-colour organiser logos (Meta and PyTorch from Simple Icons;
  The Economic Times and iQOO wordmarks from Wikimedia Commons). They are their owners'
  trademarks, shown only beside the results won at those events.

Reduced motion gets a still formation and no entrance animations. If WebGL is
unavailable or the shader fails, a CSS fallback is shown.

## Adding things

Everything below is data; pages, the Index, Next/Previous, the sitemap, share images,
structured data and the counted headlines all follow on their own.

- **A project**: add it to `src/content/projects.ts` and to the `ALL` list in the order it
  should appear (figures go in `public/images` as `.webp`, with their real width and height).
  `featured: true` shows it large in Work; three featured is the design, four also fits.
- **A hackathon result**: add it to `achievements` in `src/content/profile.ts` with
  `kind: 'hackathon'`, the field size (`'of 5,000+ teams'`), `eventShort` if the name is long,
  and the projects it was won with. The hero shows the first three hackathons in the list, so
  keep the strongest first. A logo goes in `src/assets/brands/` and `src/content/brands.ts`.
- **Another competition**: `kind: 'competition'` and an `aside` for the Record chapter's
  lede ("a finalist place in …").
- **The paper's status**: `stage` and `status` in `publication`.
- **Availability, reply time, services**: `person.availability`, `person.replyWithin` and
  `services` in `src/content/profile.ts`.
- **A new job**: `experience` in `src/content/profile.ts`; its page lives at
  `/about/riamona` (the id in `src/router/routes.ts`), so a new employer needs that id renamed.

Keep `public/resume.tex` in step (two pages), then run `npm test`, `npm run build` and
`npm run test:e2e`.

## Search

The site does the on-page part (prerendered pages, per-page titles, descriptions, canonical
URLs, schema.org `ProfilePage`/`Person`, breadcrumbs, share images, sitemap). The rest needs
the owner's accounts:

1. Add the site in [Google Search Console](https://search.google.com/search-console) (URL
   prefix `https://omkar-kadam.vercel.app/`, verify with the HTML-tag method: paste the
   `google-site-verification` meta tag into `index.html`), then submit `/sitemap.xml`.
2. Do the same in Bing Webmaster Tools (it can import from Search Console).
3. Link the site from the LinkedIn profile (Contact info → Website, and the Featured
   section), the GitHub profile (website field and profile README) and any Devpost or
   hackathon pages, all under the same name, "Omkar Kadam".
