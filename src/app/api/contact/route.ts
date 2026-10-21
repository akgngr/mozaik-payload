import { NextResponse } from 'next/server'
import { getPayload } from '@/lib/payload'

export async function POST(req: Request) {
  let targetEmail: string | undefined
  let recipientSource: string | undefined

  try {
    const { name, email, subject, message, copyToSender } = await req.json()

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

    targetEmail = process.env.SMTP_TO_ADDRESS
    recipientSource = targetEmail ? 'SMTP_TO_ADDRESS' : undefined
    if (!targetEmail) {
      try {
        const contactInfo = await payload.findGlobal({ slug: 'contact-info' })
        targetEmail = contactInfo?.email || undefined
        recipientSource = targetEmail ? 'contact-info global' : undefined
      } catch (error) {
        payload.logger.warn({ err: error }, 'Could not load contact email from global config')
      }
    }
    if (!targetEmail) {
      targetEmail = process.env.SMTP_USER || process.env.SMTP_FROM_ADDRESS || 'info@mosaik-ruesselsheim.de'
      recipientSource = process.env.SMTP_USER
        ? 'SMTP_USER fallback'
        : process.env.SMTP_FROM_ADDRESS
          ? 'SMTP_FROM_ADDRESS fallback'
          : 'hardcoded fallback'
    }

    const emailSubject = `[Website Kontakt] ${subject || 'Neue Anfrage'}: ${name}`
    const fromAddress = process.env.SMTP_FROM_ADDRESS || 'info@mosaik-ruesselsheim.de'
    const fromName = process.env.SMTP_FROM_NAME || 'Mosaik Dialog und Kultur e.V.'
    const mailjetApiKey = process.env.MAILJET_API_KEY
    const mailjetApiSecret = process.env.MAILJET_API_SECRET
    const useMailjetApi = Boolean(mailjetApiKey && mailjetApiSecret)

    if (Boolean(mailjetApiKey) !== Boolean(mailjetApiSecret)) {
      throw new Error('Both MAILJET_API_KEY and MAILJET_API_SECRET must be configured.')
    }

    payload.logger.info(
      {
        to: targetEmail,
        recipientSource,
        provider: useMailjetApi ? 'Mailjet Email API v3.1' : 'SMTP',
        ...(!useMailjetApi && {
          smtpHost: process.env.SMTP_HOST || '(not configured)',
          smtpPort: process.env.SMTP_PORT || '587',
          smtpSecure: process.env.SMTP_SECURE === 'true' || process.env.SMTP_PORT === '465',
        }),
        from: fromAddress,
      },
      'Contact form email submission started',
    )

    const html = `
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
      `

    const sendTo = async (to: string, recipientType: string) => {
      if (useMailjetApi && mailjetApiKey && mailjetApiSecret) {
        const mailjetResult = await sendMailjetEmail({
          apiKey: mailjetApiKey,
          apiSecret: mailjetApiSecret,
          fromAddress,
          fromName,
          to,
          replyTo: email,
          replyToName: name,
          subject: emailSubject,
          html,
          text: `Neue Kontaktanfrage von ${name}\nE-Mail: ${email}\nBetreff: ${subject || 'Allgemeine Anfrage'}\n\n${message}`,
        })

        payload.logger.info(
          { to, recipientType, recipientSource, ...mailjetResult },
          'Mailjet Email API response for contact form email',
        )
      } else {
        const smtpResult: unknown = await payload.sendEmail({
          to,
          replyTo: `${name} <${email}>`,
          subject: emailSubject,
          html,
        })

        payload.logger.info(
          {
            to,
            recipientType,
            recipientSource,
            ...getSmtpResponseDetails(smtpResult),
          },
          'SMTP response for contact form email',
        )
      }
    }

    await sendTo(targetEmail, 'contact inbox')

    let copySent = false
    if (copyToSender === true) {
      try {
        await sendTo(email, 'form sender copy')
        copySent = true
      } catch (error) {
        payload.logger.error(
          { err: error, to: email, recipientType: 'form sender copy' },
          'Could not send contact form copy to sender',
        )
      }
    }

    payload.logger.info(
      {
        to: targetEmail,
        recipientSource,
        provider: useMailjetApi ? 'Mailjet Email API v3.1' : 'SMTP',
        copyRequested: copyToSender === true,
        copySent,
      },
      'Contact form email submission completed',
    )

    return NextResponse.json({
      success: true,
      message:
        copyToSender === true && !copySent
          ? 'Ihre Nachricht wurde gesendet, aber die Kopie konnte nicht zugestellt werden.'
          : 'Vielen Dank! Ihre Nachricht wurde erfolgreich gesendet.',
      copySent,
    })
  } catch (error: any) {
    console.error('Contact form send email error:', {
      error,
      to: targetEmail,
      recipientSource,
      provider: process.env.MAILJET_API_KEY || process.env.MAILJET_API_SECRET
        ? 'Mailjet Email API v3.1'
        : 'SMTP',
      ...(!(process.env.MAILJET_API_KEY || process.env.MAILJET_API_SECRET) && {
        smtpHost: process.env.SMTP_HOST || '(not configured)',
        smtpPort: process.env.SMTP_PORT || '587',
      }),
      ...getSmtpResponseDetails(error),
    })
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

async function sendMailjetEmail({
  apiKey,
  apiSecret,
  fromAddress,
  fromName,
  to,
  replyTo,
  replyToName,
  subject,
  html,
  text,
}: {
  apiKey: string
  apiSecret: string
  fromAddress: string
  fromName: string
  to: string
  replyTo: string
  replyToName: string
  subject: string
  html: string
  text: string
}): Promise<Record<string, string | number>> {
  const response = await fetch('https://api.mailjet.com/v3.1/send', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      Messages: [
        {
          From: { Email: fromAddress, Name: fromName },
          To: [{ Email: to }],
          ReplyTo: { Email: replyTo, Name: replyToName },
          Subject: subject,
          TextPart: text,
          HTMLPart: html,
        },
      ],
    }),
  })
  const result: unknown = await response.json()

  if (!response.ok) {
    throw new MailjetApiError(
      `Mailjet Email API returned HTTP ${response.status}`,
      response.status,
      JSON.stringify(result),
    )
  }

  const messages =
    typeof result === 'object' && result !== null && 'Messages' in result
      ? result.Messages
      : undefined
  const firstMessage = Array.isArray(messages) ? messages[0] : undefined

  if (typeof firstMessage !== 'object' || firstMessage === null) {
    throw new MailjetApiError('Mailjet Email API returned an unexpected response', response.status)
  }

  const status = 'Status' in firstMessage ? firstMessage.Status : undefined
  if (status !== 'success') {
    const errors = 'Errors' in firstMessage ? firstMessage.Errors : undefined
    throw new MailjetApiError(
      `Mailjet rejected the email: ${JSON.stringify(errors ?? firstMessage)}`,
      response.status,
    )
  }

  const recipients = 'To' in firstMessage ? firstMessage.To : undefined
  const recipient = Array.isArray(recipients) ? recipients[0] : undefined
  const details: Record<string, string | number> = { status: 'success' }

  if (typeof recipient === 'object' && recipient !== null) {
    if ('MessageUUID' in recipient && typeof recipient.MessageUUID === 'string') {
      details.messageUUID = recipient.MessageUUID
    }
    if ('MessageID' in recipient && typeof recipient.MessageID === 'number') {
      details.messageID = recipient.MessageID
    }
    if ('MessageHref' in recipient && typeof recipient.MessageHref === 'string') {
      details.messageHref = recipient.MessageHref
    }
  }

  return details
}

class MailjetApiError extends Error {
  constructor(message: string, responseCode: number, response?: string) {
    super(message)
    this.name = 'MailjetApiError'
    Object.assign(this, {
      code: 'MAILJET_API_ERROR',
      responseCode,
      ...(response && { response }),
    })
  }
}

function getSmtpResponseDetails(value: unknown): Record<string, string | number> {
  if (typeof value !== 'object' || value === null) {
    return {}
  }

  const details: Record<string, string | number> = {}
  const response = 'response' in value ? value.response : undefined
  const responseCode = 'responseCode' in value ? value.responseCode : undefined
  const messageId = 'messageId' in value ? value.messageId : undefined
  const code = 'code' in value ? value.code : undefined
  const command = 'command' in value ? value.command : undefined

  if (typeof response === 'string') details.response = response
  if (typeof responseCode === 'number') details.responseCode = responseCode
  if (typeof messageId === 'string') details.messageId = messageId
  if (typeof code === 'string') details.code = code
  if (typeof command === 'string') details.command = command

  return details
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
