import { useEffect, useRef, useState, type ReactNode } from 'react'
import { person, services } from '../content/profile'
import { projectById } from '../content/projects'
import { Link } from '../router/Router'
import { ContactForm } from './ContactForm'
import { ExternalLink } from './ExternalLink'

const COPIED_MS = 2200

/** Email with a copy button, the three links, what I take on as freelance work, and the letter form: the centre. */
export function ContactBody() {
  const [copied, setCopied] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(person.email)
      setCopied(true)
      window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => setCopied(false), COPIED_MS)
    } catch (error: unknown) {
      // Clipboard can be blocked (permissions, insecure context); the address is still on screen to select.
      console.error('Could not copy the email address.', error)
    }
  }

  return (
    <>
      <div className="centre__body" data-dense="narrow">
        <div className="centre__contact" data-reveal>
          <a className="centre__email" href={`mailto:${person.email}`}>
            {person.email}
          </a>
          <button type="button" className="centre__copy" onClick={copy}>
            <span aria-live="polite">{copied ? 'Copied' : 'Copy address'}</span>
          </button>
        </div>

        <ul className="centre__links" data-stagger>
          <li>
            <ExternalLink href={person.linkedin} className="centre__link">
              <span className="centre__link-label">LinkedIn</span>
              <span className="centre__link-handle">in/omkarrrr</span>
            </ExternalLink>
          </li>
          <li>
            <ExternalLink href={person.github} className="centre__link">
              <span className="centre__link-label">GitHub</span>
              <span className="centre__link-handle">omkarrr88</span>
            </ExternalLink>
          </li>
          <li>
            <ExternalLink href={person.resume} className="centre__link">
              <span className="centre__link-label">Resume</span>
              <span className="centre__link-handle">PDF, 2 pages</span>
            </ExternalLink>
          </li>
        </ul>
      </div>

      <Services />

      <div className="centre__letter" data-dense="narrow">
        <ContactForm />
      </div>
    </>
  )
}

/** Freelance and contract work: what I take on, each with the projects that show it. */
function Services() {
  return (
    <section className="services" aria-labelledby="services-title" data-dense="narrow">
      <div className="services__head" data-reveal>
        <h3 id="services-title" className="services__title">
          Work with me
        </h3>
        <p className="services__lede">Freelance or contract, quoted per project. Tell me what you’re building.</p>
      </div>
      <ul className="services__list" data-stagger>
        {services.map((service) => (
          <li key={service.title} className="service">
            <h4 className="service__title">{service.title}</h4>
            <p className="service__detail">{service.detail}</p>
            {service.proof.length > 0 ? (
              <p className="service__proof">
                <span className="service__proof-label">Seen in</span>
                {service.proof.map((id) => {
                  const p = projectById(id)
                  return p ? (
                    <Link key={id} to={`/work/${id}`} className="service__proof-link">
                      {p.short ?? p.title}
                    </Link>
                  ) : null
                })}
              </p>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  )
}

/** The last lines of the site, and a way back out to the outer ring. */
export function Colophon({ back }: { readonly back: ReactNode }) {
  return (
    <footer className="colophon">
      <p>
        {person.name} · {person.place} · 2026
      </p>
      <p className="colophon__note">
        Laid out as a chakravyuh, the seven-ring formation from the Mahabharata. Set in Familjen Grotesk and IBM Plex
        Mono; the rings are one WebGL shader.
      </p>
      {back}
    </footer>
  )
}
