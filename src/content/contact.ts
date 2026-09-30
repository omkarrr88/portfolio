/** Contact form rules, shared by the form and mirrored in api/contact.js. */

export const LIMITS = {
  name: 100,
  email: 200,
  message: 5000,
  minMessage: 10,
} as const

export interface ContactInput {
  readonly name: string
  readonly email: string
  readonly message: string
}

export type ContactErrors = Partial<Record<keyof ContactInput, string>>

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Returns one plain-language message per field that needs fixing; empty when the input is fine. */
export function validateContact(input: ContactInput): ContactErrors {
  const name = input.name.trim()
  const email = input.email.trim()
  const message = input.message.trim()
  return {
    ...(name.length === 0 ? { name: 'Tell me who you are.' } : {}),
    ...(name.length > LIMITS.name ? { name: `Keep it under ${LIMITS.name} characters.` } : {}),
    ...(!EMAIL.test(email) || email.length > LIMITS.email ? { email: 'That email address doesn’t look right.' } : {}),
    ...(message.length < LIMITS.minMessage ? { message: 'A little more, please: at least a sentence.' } : {}),
    ...(message.length > LIMITS.message ? { message: `Keep it under ${LIMITS.message} characters.` } : {}),
  }
}
