import { NextResponse } from 'next/server'
import { getPayload } from '@/lib/payload'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.' },
        { status: 400 },
      )
    }

    const payload = await getPayload()

    // E-posta zaten kayıtlı mı kontrol et
    const existing = await payload.find({
      collection: 'subscribers',
      where: {
        email: {
          equals: email.trim().toLowerCase(),
        },
      },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      // Zaten abone
      return NextResponse.json({
        message: 'Sie sind bereits für unseren Newsletter angemeldet!',
        alreadySubscribed: true,
      })
    }

    // Yeni abone kaydı oluştur
    await payload.create({
      collection: 'subscribers',
      data: {
        email: email.trim().toLowerCase(),
        status: 'active',
        source: 'Homepage Newsletter Section',
      },
    })

    return NextResponse.json({
      message: 'Vielen Dank für Ihre Anmeldung zum Newsletter!',
      success: true,
    })
  } catch (error) {
    console.error('Newsletter subscribe error:', error)
    return NextResponse.json(
      { error: 'Etwas ist schiefgelaufen. Bitte versuchen Sie es später erneut.' },
      { status: 500 },
    )
  }
}
