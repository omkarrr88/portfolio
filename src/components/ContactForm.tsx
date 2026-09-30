import { useState, type FormEvent } from 'react'
import { LIMITS, validateContact, type ContactErrors, type ContactInput } from '../content/contact'
import { person } from '../content/profile'

type Status = 'idle' | 'sending' | 'sent' | 'failed'

const EMPTY: ContactInput = { name: '', email: '', message: '' }
const FIELD_ORDER = ['name', 'email', 'message'] as const

/** A letter on paper. If sending fails for any reason, it says so and offers the address instead. */
export function ContactForm() {
  const [values, setValues] = useState<ContactInput>(EMPTY)
  const [errors, setErrors] = useState<ContactErrors>({})
  const [status, setStatus] = useState<Status>('idle')

  const update = (field: keyof ContactInput) => (value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const found = validateContact(values)
    setErrors(found)
    const firstInvalid = FIELD_ORDER.find((field) => found[field])
    if (firstInvalid) {
      document.getElementById(`contact-${firstInvalid}`)?.focus()
      return
    }
    const honeypot = new FormData(event.currentTarget).get('company')
    setStatus('sending')
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, company: honeypot ?? '' }),
      })
      // Require the API's own success flag: a host that serves index.html for unknown paths also answers 200.
      const result: unknown = await response.json().catch(() => null)
      const confirmed = typeof result === 'object' && result !== null && 'success' in result && result.success === true
      if (!response.ok || !confirmed) throw new Error(`Contact API answered ${response.status}`)
      setStatus('sent')
      setValues(EMPTY)
    } catch (error: unknown) {
      console.error('Contact form failed to send.', error)
      setStatus('failed')
    }
  }

  if (status === 'sent') {
    return (
      <div className="letter letter--sent" role="status">
        <p className="letter__eyebrow">Sent</p>
        <p className="letter__done">Thanks. Your message is in my inbox, and I’ll reply to the address you gave.</p>
      </div>
    )
  }

  return (
    <form className="letter" onSubmit={submit} noValidate aria-labelledby="letter-title">
      <p id="letter-title" className="letter__eyebrow">
        Or write it here
      </p>
      <Field
        id="contact-name"
        label="Your name"
        autoComplete="name"
        value={values.name}
        maxLength={LIMITS.name}
        error={errors.name}
        onChange={update('name')}
      />
      <Field
        id="contact-email"
        label="Your email"
        type="email"
        autoComplete="email"
        value={values.email}
        maxLength={LIMITS.email}
        error={errors.email}
        onChange={update('email')}
      />
      <Field
        id="contact-message"
        label="Message"
        multiline
        value={values.message}
        maxLength={LIMITS.message}
        error={errors.message}
        onChange={update('message')}
      />
      {/* Hidden from people; bots that fill every field give themselves away. */}
      <div className="letter__trap" aria-hidden="true">
        <label htmlFor="contact-company">Company</label>
        <input id="contact-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="letter__foot">
        <button type="submit" className="paper-button paper-button--solid" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending…' : 'Send'}
        </button>
        <p className="letter__status" role="status" aria-live="polite">
          {status === 'failed' ? (
            <>
              That didn’t go through. Email me at <a href={`mailto:${person.email}`}>{person.email}</a> instead.
            </>
          ) : null}
        </p>
      </div>
    </form>
  )
}

interface FieldProps {
  readonly id: string
  readonly label: string
  readonly value: string
  readonly maxLength: number
  readonly onChange: (value: string) => void
  readonly error?: string
  readonly type?: string
  readonly autoComplete?: string
  readonly multiline?: boolean
}

function Field({ id, label, value, maxLength, onChange, error, type = 'text', autoComplete, multiline = false }: FieldProps) {
  const shared = {
    id,
    name: id.replace('contact-', ''),
    value,
    maxLength,
    required: true,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': error ? `${id}-error` : undefined,
  } as const
  return (
    <div className={error ? 'field has-error' : 'field'}>
      <label htmlFor={id} className="field__label">
        {label}
      </label>
      {multiline ? (
        <textarea {...shared} rows={5} data-lenis-prevent onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input {...shared} type={type} autoComplete={autoComplete} onChange={(e) => onChange(e.target.value)} />
      )}
      {error ? (
        <p id={`${id}-error`} className="field__error">
          {error}
        </p>
      ) : null}
    </div>
  )
}
