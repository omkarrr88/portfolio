export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
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
            from: { email: 'omkarkadam181188@gmail.com', name: 'Omkar Kadam Portfolio' },
            reply_to: { email, name },
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
                    <small style="color: #666;"><em>This email was sent automatically from your portfolio website contact form. Reply in your mail client to email ${name} directly.</em></small>
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
            return res.status(200).json({ success: true, message: 'Message sent successfully!' });
        } else {
            const errorText = await sgRes.text();
            console.error('SendGrid Error:', errorText);
            return res.status(sgRes.status).json({ error: 'Failed to send message via SendGrid.' });
        }
    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json({ error: 'Internal server error.' });
    }
}
