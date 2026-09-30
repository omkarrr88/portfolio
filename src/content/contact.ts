/** Contact form rules, shared by the form and mirrored in api/contact.js. */

export const LIMITS = {
  name: 100,
  email: 200,
  message: 5000,
  minMessage: 10,
  budget: 100,
} as const

/** What a message is about, so it's easy to answer in the right way. Optional. */
export const TOPICS = [
  { value: 'job', label: 'A full-time role' },
  { value: 'freelance', label: 'A freelance project' },
  { value: 'contract', label: 'Contract work' },
  { value: 'other', label: 'Something else' },
] as const

export type Topic = (typeof TOPICS)[number]['value']

/** Project work comes with a budget question; a job offer doesn't. */
export const asksForBudget = (topic: Topic | ''): boolean => topic === 'freelance' || topic === 'contract'

export interface ContactInput {
  readonly name: string
  readonly email: string
  readonly message: string
  readonly topic: Topic | ''
  readonly budget: string
}

export type ContactErrors = Partial<Record<keyof ContactInput, string>>

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const TOPIC_VALUES: readonly string[] = TOPICS.map((t) => t.value)

/** Returns one plain-language message per field that needs fixing; empty when the input is fine. */
export function validateContact(input: ContactInput): ContactErrors {
  const name = input.name.trim()
  const email = input.email.trim()
  const message = input.message.trim()
  const budget = input.budget.trim()
  return {
    ...(name.length === 0 ? { name: 'Tell me who you are.' } : {}),
    ...(name.length > LIMITS.name ? { name: `Keep it under ${LIMITS.name} characters.` } : {}),
    ...(!EMAIL.test(email) || email.length > LIMITS.email ? { email: 'That email address doesn’t look right.' } : {}),
    ...(message.length < LIMITS.minMessage ? { message: 'A little more, please: at least a sentence.' } : {}),
    ...(message.length > LIMITS.message ? { message: `Keep it under ${LIMITS.message} characters.` } : {}),
    ...(input.topic !== '' && !TOPIC_VALUES.includes(input.topic) ? { topic: 'Pick one of these, or leave it.' } : {}),
    ...(budget.length > LIMITS.budget ? { budget: `Keep it under ${LIMITS.budget} characters.` } : {}),
  }
}
