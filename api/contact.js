export default async function handler(req, res) {
    // Enforce POST requests only
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { name, email, subject, message } = req.body;

    try {
        // Dispatch to SendGrid (Key securely hidden in backend)
        const sendgridKey = process.env.SENDGRID_API_KEY;

        if (!sendgridKey) {
            console.error('SendGrid API key is missing from environment variables.');
            return res.status(500).json({ error: 'Server configuration error.' });
        }

        const emailData = {
            personalizations: [{
                to: [{ email: 'omkarkadam181188@gmail.com' }],
                subject: `[Portfolio Inbox] ${subject}`,
            }],
            // Required by SendGrid: 'From' email MUST exactly match the sender identity verified inside your SendGrid dashboard
            from: { email: 'omkarkadam181188@gmail.com', name: 'Omkar Kadam Portfolio' },
            reply_to: { email, name }, // This allows you to hot-reply back to the user normally!
            content: [{
                type: 'text/html',
                value: `
                  <div style="font-family: sans-serif; padding: 20px; color: #333;">
                    <h2 style="color: #0d9488;">New Message from your Portfolio</h2>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                    <p style="white-space: pre-wrap;">${message}</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                    <small style="color: #666;"><em>This email was sent automatically from your portfolio website contact form. Do not reply to this email, simply press reply in your mail client to email ${name} directly.</em></small>
                  </div>
                `,
            }],
        };

        const sgRes = await fetch('https://api.sendgrid.com/v3/mail/send', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${sendgridKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(emailData),
        });

        if (sgRes.ok || sgRes.status === 202) {
            return res.status(200).json({ success: true, message: 'Message sent successfully via SendGrid!' });
        } else {
            const errorText = await sgRes.text();
            console.error('SendGrid Error:', errorText);
            return res.status(sgRes.status).json({ error: 'Failed to send via SendGrid. Make sure your Single Sender identity is verified on their dashboard.' });
        }
    } catch (error) {
        console.error('Vercel API Backend Error:', error);
        return res.status(500).json({ error: 'Internal server error while sending message.' });
    }
}
