import type { Ref } from 'react'
import { chakravyuh, now, profile } from '../content/site'

interface SectionProps {
  readonly ref?: Ref<HTMLElement>
}

export function Hero({ ref }: SectionProps) {
  return (
    <section ref={ref} id="intro" className="hero" aria-labelledby="hero-title">
      <div className="hero__body">
        <p className="eyebrow" data-reveal>
          {profile.role} · {profile.place}
        </p>
        <h1 id="hero-title" className="hero__title" data-split>
          Omkar
          <br />
          Kadam
        </h1>
        <p className="hero__intro" data-reveal>
          {profile.intro}
        </p>
      </div>
      <ul className="hero__results" aria-label="Hackathon results, 2026" data-reveal>
        {profile.results.map((r) => (
          <li key={r.event}>
            <span className="hero__rank">{r.rank}</span>
            <span className="hero__field">of {r.field}</span>
            <span className="hero__event">{r.event}</span>
          </li>
        ))}
      </ul>
      <p className="hero__cue" aria-hidden="true">
        Scroll to enter the formation
      </p>
    </section>
  )
}

export function NowChapter({ ref }: SectionProps) {
  return (
    <section ref={ref} id="now" className="chapter" aria-labelledby="now-title">
      <div className="chapter__body">
        <p className="eyebrow eyebrow--accent" data-reveal>
          Ring 06 · Now
        </p>
        <h2 id="now-title" className="chapter__title" data-split>
          {now.headline}
        </h2>
        <p className="chapter__text" data-reveal>
          {now.body}
        </p>
        <p className="chapter__meta" data-reveal>
          {now.education}
        </p>
      </div>
    </section>
  )
}

export function ProjectSheet({ ref }: SectionProps) {
  const p = chakravyuh
  return (
    <section ref={ref} id="chakravyuh" className="sheet-wrap" aria-labelledby="chakravyuh-title">
      <article className="sheet" data-sheet>
        <header className="sheet__meta">
          <span>No. {p.number}</span>
          <span>{p.category}</span>
          <span>{p.date}</span>
          <span>{p.place}</span>
        </header>
        <div className="sheet__heading">
          <h2 id="chakravyuh-title" className="sheet__title">
            {p.title}
          </h2>
          <span className="sheet__deva" lang="sa">
            {p.devanagari}
          </span>
        </div>
        <p className="sheet__subtitle">{p.subtitle}</p>
        <p className="sheet__placement">{p.placement}</p>
        <figure className="sheet__figure">
          <img src={p.figure.src} alt={p.figure.alt} width={p.figure.width} height={p.figure.height} loading="lazy" decoding="async" />
          <figcaption>{p.figure.caption}</figcaption>
        </figure>
        <div className="sheet__columns">
          <div className="sheet__body">
            {p.body.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
            <a className="sheet__link" href={p.link} target="_blank" rel="noopener">
              Source on GitHub <span aria-hidden="true">↗</span>
            </a>
          </div>
          <dl className="sheet__facts">
            {p.facts.map((f) => (
              <div key={f.term}>
                <dt>{f.term}</dt>
                <dd>{f.detail}</dd>
              </div>
            ))}
          </dl>
        </div>
      </article>
    </section>
  )
}

export function PrototypeEnd() {
  return (
    <section className="proto-end" aria-label="End of prototype">
      <p className="eyebrow">Prototype ends here</p>
      <p className="proto-end__text">
        The full build continues inward: 04 VayuNetra, 03 Fitmon, 02 more work, 01 beyond code, and the centre, where you
        can reach me.
      </p>
    </section>
  )
}
