import { describe, expect, it } from 'vitest'
import { LIMITS, asksForBudget, validateContact, type ContactInput } from './contact'

const OK: ContactInput = { name: 'Asha', email: 'asha@example.com', message: 'We need a dashboard built.', topic: '', budget: '' }

describe('validateContact', () => {
  it('accepts a complete message, with or without a topic', () => {
    expect(validateContact(OK)).toEqual({})
    expect(validateContact({ ...OK, topic: 'freelance', budget: '₹80,000' })).toEqual({})
  })

  it('names each field that needs fixing', () => {
    const errors = validateContact({ ...OK, name: ' ', email: 'nope', message: 'hi' })
    expect(Object.keys(errors).sort()).toEqual(['email', 'message', 'name'])
  })

  it('rejects a topic the form never offers and an over-long budget', () => {
    const errors = validateContact({ ...OK, topic: 'spam' as ContactInput['topic'], budget: 'x'.repeat(LIMITS.budget + 1) })
    expect(Object.keys(errors).sort()).toEqual(['budget', 'topic'])
  })
})

describe('asksForBudget', () => {
  it('asks only about project work', () => {
    expect(asksForBudget('freelance')).toBe(true)
    expect(asksForBudget('contract')).toBe(true)
    expect(asksForBudget('job')).toBe(false)
    expect(asksForBudget('')).toBe(false)
  })
})
