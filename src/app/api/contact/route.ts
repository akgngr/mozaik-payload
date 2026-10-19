import { NextResponse } from 'next/server'
import { getPayload } from '@/lib/payload'

export async function POST(req: Request) {
  try {
    const { name, email, subject, message } = await req.json()

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Bitte füllen Sie alle Pflichtfelder aus (Name, E-Mail, Nachricht).' },
        { status: 400 },
      )
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.' },
        { status: 400 },
      )
    }

    const payload = await getPayload()

    // Hedef alıcı: ContactInfo globalinde tanımlı e-posta veya ortam değişkeni
    let targetEmail = process.env.SMTP_TO_ADDRESS || process.env.SMTP_USER || process.env.SMTP_FROM_ADDRESS || 'info@mosaik-ruesselsheim.de'
    try {
      const contactInfo = await payload.findGlobal({ slug: 'contact-info' })
      if (contactInfo?.email) {
        targetEmail = contactInfo.email
      }
    } catch {
      // Global bulunamazsa varsayılan targetEmail kullanılır
    }

    const emailSubject = `[Website Kontakt] ${subject || 'Neue Anfrage'}: ${name}`

    await payload.sendEmail({
      to: targetEmail,
      replyTo: `${name} <${email}>`,
      subject: emailSubject,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1e293b; background-color: #f8fafc; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
            .header { background: #0f172a; color: #ffffff; padding: 24px; text-align: center; }
            .header h2 { margin: 0; font-size: 20px; font-weight: 600; }
            .content { padding: 24px; }
            .field { margin-bottom: 16px; }
            .label { font-size: 12px; text-transform: uppercase; color: #64748b; font-weight: 700; margin-bottom: 4px; }
            .value { font-size: 15px; color: #0f172a; }
            .message-box { background: #f1f5f9; padding: 16px; border-radius: 8px; border-left: 4px solid #0284c7; white-space: pre-wrap; font-size: 14px; margin-top: 8px; }
            .footer { background: #f8fafc; padding: 16px 24px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; text-align: center; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>Mosaik e.V. - Neue Kontaktanfrage</h2>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">Absender Name</div>
                <div class="value">${escapeHtml(name)}</div>
              </div>
              <div class="field">
                <div class="label">E-Mail-Adresse</div>
                <div class="value"><a href="mailto:${escapeHtml(email)}" style="color: #0284c7; text-decoration: none;">${escapeHtml(email)}</a></div>
              </div>
              <div class="field">
                <div class="label">Betreff</div>
                <div class="value">${escapeHtml(subject || 'Allgemeine Anfrage')}</div>
              </div>
              <div class="field">
                <div class="label">Nachricht</div>
                <div class="message-box">${escapeHtml(message)}</div>
              </div>
            </div>
            <div class="footer">
              Diese E-Mail wurde automatisch über das Kontaktformular auf mosaik-ruesselsheim.de gesendet.
            </div>
          </div>
        </body>
        </html>
      `,
    })

    return NextResponse.json({
      success: true,
      message: 'Vielen Dank! Ihre Nachricht wurde erfolgreich gesendet.',
    })
  } catch (error: any) {
    console.error('Contact form send email error:', error)
    return NextResponse.json(
      {
        error:
          'Die Nachricht konnte nicht gesendet werden. Bitte versuchen Sie es später erneut oder schreiben Sie direkt an unsere E-Mail-Adresse.',
        details: process.env.NODE_ENV === 'development' ? error?.message : undefined,
      },
      { status: 500 },
    )
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
