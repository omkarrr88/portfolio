import { useState, type FormEvent } from 'react'
import {
  LIMITS,
  TOPICS,
  asksForBudget,
  validateContact,
  type ContactErrors,
  type ContactInput,
  type Topic,
} from '../content/contact'
import { person } from '../content/profile'

type Status = 'idle' | 'sending' | 'sent' | 'failed'

const EMPTY: ContactInput = { name: '', email: '', message: '', topic: '', budget: '' }
const FIELD_ORDER = ['name', 'email', 'budget', 'message'] as const

/** A letter on paper. If sending fails for any reason, it says so and offers the address instead. */
export function ContactForm() {
  const [values, setValues] = useState<ContactInput>(EMPTY)
  const [errors, setErrors] = useState<ContactErrors>({})
  const [status, setStatus] = useState<Status>('idle')

  const update = (field: Exclude<keyof ContactInput, 'topic'>) => (value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }
  const choose = (topic: Topic) => setValues((prev) => ({ ...prev, topic }))
  const withBudget = asksForBudget(values.topic)

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
        // A budget only goes with project work; switching topic away from it drops what was typed.
        body: JSON.stringify({ ...values, budget: withBudget ? values.budget : '', company: honeypot ?? '' }),
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
        <p className="letter__done">
          Thanks. It’s in my inbox, and I’ll reply within {person.replyWithin} to the address you gave.
        </p>
      </div>
    )
  }

  return (
    <form className="letter" onSubmit={submit} noValidate aria-labelledby="letter-title">
      <p id="letter-title" className="letter__eyebrow">
        Or write it here
      </p>
      <fieldset className="topics">
        <legend className="field__label">What’s it about? (optional)</legend>
        <div className="topics__options">
          {TOPICS.map((t) => (
            <label key={t.value} className="topic">
              <input
                type="radio"
                name="topic"
                value={t.value}
                checked={values.topic === t.value}
                onChange={() => choose(t.value)}
              />
              <span className="topic__label">{t.label}</span>
            </label>
          ))}
        </div>
      </fieldset>
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
      {withBudget ? (
        <Field
          id="contact-budget"
          label="Rough budget (optional)"
          value={values.budget}
          maxLength={LIMITS.budget}
          error={errors.budget}
          required={false}
          onChange={update('budget')}
        />
      ) : null}
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
  readonly required?: boolean
}

function Field(props: FieldProps) {
  const { id, label, value, maxLength, onChange, error, type = 'text', autoComplete, multiline = false, required = true } = props
  const shared = {
    id,
    name: id.replace('contact-', ''),
    value,
    maxLength,
    required,
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
