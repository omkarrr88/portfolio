import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import handler from '../api/contact.js'

/** Just enough of Vercel's request and response for the handler. */
function call(body: unknown, ip = '203.0.113.1') {
  const res = {
    statusCode: 0,
    payload: undefined as unknown,
    headers: {} as Record<string, string>,
    status(code: number) {
      this.statusCode = code
      return this
    },
    json(value: unknown) {
      this.payload = value
      return this
    },
    setHeader(key: string, value: string) {
      this.headers[key] = value
    },
  }
  const req = { method: 'POST', headers: { 'x-forwarded-for': ip }, body }
  return (handler(req, res) as Promise<unknown>).then(() => res)
}

const MESSAGE = { name: 'Asha', email: 'asha@example.com', message: 'We need a dashboard built for our team.' }
let ipCounter = 0
/** A fresh sender each time, so the rate limit only bites where a test means it to. */
const freshIp = () => `198.51.100.${++ipCounter}`

describe('contact API', () => {
  const sent: { subject: string; text: string }[] = []

  beforeEach(() => {
    sent.length = 0
    vi.stubEnv('SENDGRID_API_KEY', 'test-key')
    vi.spyOn(console, 'error').mockImplementation(() => undefined)
    vi.stubGlobal(
      'fetch',
      vi.fn(async (_url: string, init: { body: string }) => {
        const mail = JSON.parse(init.body)
        sent.push({ subject: mail.personalizations[0].subject, text: mail.content[0].value })
        return new Response(null, { status: 202 })
      }),
    )
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('sends a message with its topic and budget', async () => {
    const res = await call({ ...MESSAGE, topic: 'freelance', budget: '₹80,000' }, freshIp())
    expect(res.statusCode).toBe(200)
    expect(sent[0]?.subject).toBe('Portfolio: a freelance project, from Asha')
    expect(sent[0]?.text).toContain('About: A freelance project')
    expect(sent[0]?.text).toContain('Budget: ₹80,000')
  })

  it('drops a budget that came with something other than project work', async () => {
    await call({ ...MESSAGE, topic: 'job', budget: 'ignore me' }, freshIp())
    expect(sent[0]?.text).not.toContain('Budget')
  })

  it('refuses a topic the form never offers', async () => {
    const res = await call({ ...MESSAGE, topic: 'constructor' }, freshIp())
    expect(res.statusCode).toBe(400)
    expect(sent).toHaveLength(0)
  })

  it('keeps line breaks out of the subject', async () => {
    await call({ ...MESSAGE, name: 'Asha\r\nBcc: x@example.com' }, freshIp())
    expect(sent[0]?.subject).not.toMatch(/[\r\n]/)
  })

  it('pretends to accept what a bot sends, and sends nothing', async () => {
    const res = await call({ ...MESSAGE, company: 'Spam Inc' }, freshIp())
    expect(res.statusCode).toBe(200)
    expect(sent).toHaveLength(0)
  })

  it('slows one sender down after five messages', async () => {
    const ip = freshIp()
    for (let i = 0; i < 5; i++) expect((await call(MESSAGE, ip)).statusCode).toBe(200)
    expect((await call(MESSAGE, ip)).statusCode).toBe(429)
  })

  it('still remembers a busy sender after thousands of others have written', async () => {
    const busy = freshIp()
    for (let i = 0; i < 5; i++) await call(MESSAGE, busy)
    for (let i = 0; i < 5100; i++) await call({}, `10.0.${Math.floor(i / 250)}.${i % 250}`)
    expect((await call(MESSAGE, busy)).statusCode).toBe(429)
  })
})
