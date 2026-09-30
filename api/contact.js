// Vercel serverless function: the portfolio's contact form, sent through SendGrid.
// Needs SENDGRID_API_KEY in the Vercel project's environment variables.
// Limits mirror src/content/contact.ts.

const TO = 'omkarkadam181188@gmail.com'
const LIMITS = { name: 100, email: 200, message: 5000, minMessage: 10 }
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Best effort only: serverless instances don't share memory, so this slows a
// single noisy client rather than guaranteeing a global limit.
const WINDOW_MS = 10 * 60 * 1000
const MAX_PER_WINDOW = 5
const recent = new Map()

function rateLimited(ip, now) {
  const hits = (recent.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)
  recent.set(ip, [...hits, now])
  if (recent.size > 5000) recent.clear()
  return hits.length >= MAX_PER_WINDOW
}

/** Header-safe single line: no CR/LF, trimmed, capped. */
const oneLine = (value, max) => String(value).replace(/[\r\n]+/g, ' ').trim().slice(0, max)

function validate(body) {
  if (!body || typeof body !== 'object') return { error: 'Invalid request.' }
  const { name, email, message, company } = body
  if ([name, email, message].some((v) => typeof v !== 'string')) return { error: 'All fields are required.' }
  const clean = {
    name: oneLine(name, LIMITS.name + 1),
    email: oneLine(email, LIMITS.email + 1),
    message: message.trim(),
    trap: typeof company === 'string' ? company.trim() : '',
  }
  if (!clean.name || clean.name.length > LIMITS.name) return { error: 'Please give your name.' }
  if (!EMAIL.test(clean.email) || clean.email.length > LIMITS.email) return { error: 'Please give a valid email.' }
  if (clean.message.length < LIMITS.minMessage || clean.message.length > LIMITS.message) {
    return { error: 'Please write a message of 10 to 5,000 characters.' }
  }
  return { value: clean }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ success: false, error: 'Method not allowed.' })
  }

  const ip = String(req.headers['x-forwarded-for'] ?? '').split(',')[0].trim() || 'unknown'
  if (rateLimited(ip, Date.now())) {
    return res.status(429).json({ success: false, error: 'Too many messages. Please email directly.' })
  }

  const { value, error } = validate(req.body)
  if (error) return res.status(400).json({ success: false, error })

  // Bots fill the hidden field; pretend it worked so they don't retry.
  if (value.trap) return res.status(200).json({ success: true })

  const key = process.env.SENDGRID_API_KEY
  if (!key) {
    console.error('Contact: SENDGRID_API_KEY is not set.')
    return res.status(500).json({ success: false, error: 'Server configuration error.' })
  }

  // Plain text only: nothing the sender typed is ever interpreted as HTML.
  const text = [`From: ${value.name} <${value.email}>`, '', value.message, '', '— Sent from the portfolio contact form'].join(
    '\n',
  )

  try {
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: TO }], subject: `Portfolio: message from ${value.name}` }],
        from: { email: TO, name: 'Omkar Kadam Portfolio' },
        reply_to: { email: value.email, name: value.name },
        content: [{ type: 'text/plain', value: text }],
      }),
    })

    if (!response.ok) {
      console.error('Contact: SendGrid answered', response.status, await response.text())
      return res.status(502).json({ success: false, error: 'The message could not be sent.' })
    }
    return res.status(200).json({ success: true })
  } catch (err) {
    console.error('Contact: request to SendGrid failed.', err)
    return res.status(502).json({ success: false, error: 'The message could not be sent.' })
  }
}
