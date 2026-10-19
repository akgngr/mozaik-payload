'use client'

import { useState, type FormEvent } from 'react'

const inputClass =
  'w-full rounded-xl border border-ocean-200 bg-white px-4 py-3 text-ocean-900 placeholder:text-ocean-300 transition-colors focus:border-aqua-500 focus:outline-none focus:ring-2 focus:ring-aqua-200'

export const ContactForm = ({ email }: { email: string }) => {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    const form = e.currentTarget
    const formData = new FormData(form)
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      subject: formData.get('subject') as string,
      message: formData.get('message') as string,
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await res.json()

      if (!res.ok) {
        throw new Error(result.error || 'Fehler beim Senden der Nachricht.')
      }

      setSuccess(result.message || 'Vielen Dank! Ihre Nachricht wurde erfolgreich gesendet.')
      form.reset()
    } catch (err: any) {
      console.error('Contact submission error:', err)
      setError(
        err.message ||
          'Die Nachricht konnte nicht direkt gesendet werden. Sie können uns alternativ per E-Mail kontaktieren.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {success && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
          <p className="font-medium">{success}</p>
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-800">
          <p className="text-sm font-medium">{error}</p>
          <a
            href={`mailto:${email}`}
            className="mt-2 inline-block text-xs font-semibold underline hover:text-rose-950"
          >
            Direkt per E-Mail schreiben ({email}) &rarr;
          </a>
        </div>
      )}

      <div>
        <label className="mb-2 block text-sm font-medium text-ocean-800" htmlFor="name">
          Name *
        </label>
        <input id="name" name="name" type="text" required disabled={loading} className={inputClass} />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-ocean-800" htmlFor="email">
          E-Mail *
        </label>
        <input id="email" name="email" type="email" required disabled={loading} className={inputClass} />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-ocean-800" htmlFor="subject">
          Betreff
        </label>
        <select id="subject" name="subject" disabled={loading} className={inputClass}>
          <option value="Allgemeine Anfrage">Allgemeine Anfrage</option>
          <option value="Spenden">Spenden</option>
          <option value="Ehrenamt">Ehrenamt</option>
          <option value="Presseanfrage">Presseanfrage</option>
        </select>
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-ocean-800" htmlFor="message">
          Nachricht *
        </label>
        <textarea id="message" name="message" required rows={5} disabled={loading} className={inputClass} />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="btn-glass btn-primary w-full md:w-auto disabled:opacity-50"
      >
        {loading ? 'Wird gesendet...' : 'Nachricht senden'}
      </button>
    </form>
  )
}
