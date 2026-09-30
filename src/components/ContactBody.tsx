import { useEffect, useRef, useState, type ReactNode } from 'react'
import { person } from '../content/profile'
import { ContactForm } from './ContactForm'
import { ExternalLink } from './ExternalLink'

const COPIED_MS = 2200

/** Email with a copy button, the three links, and the letter form: the centre, in the scroll and on /contact. */
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

      <div className="centre__letter" data-dense="narrow">
        <ContactForm />
      </div>
    </>
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

export const lookingForLede = `I’m looking for ${person.lookingFor.charAt(0).toLowerCase()}${person.lookingFor.slice(1)} Email is the quickest way to reach me.`
