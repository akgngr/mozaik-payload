'use client'

import { useState, type FormEvent } from 'react'

const inputClass =
  'w-full rounded-xl border border-ocean-200 bg-white px-4 py-3 text-ocean-900 placeholder:text-ocean-300 transition-colors focus:border-aqua-500 focus:outline-none focus:ring-2 focus:ring-aqua-200'

export const ContactForm = ({ email }: { email: string }) => {
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const name = formData.get('name')
    const senderEmail = formData.get('email')
    const subject = formData.get('subject')
    const message = formData.get('message')

    const body = `Name: ${name}\nE-Mail: ${senderEmail}\n\n${message}`
    const mailto = `mailto:${email}?subject=${encodeURIComponent(String(subject))}&body=${encodeURIComponent(body)}`
    window.location.href = mailto
    setSent(true)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="mb-2 block text-sm font-medium text-ocean-800" htmlFor="name">
          Name *
        </label>
        <input id="name" name="name" type="text" required className={inputClass} />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-ocean-800" htmlFor="email">
          E-Mail *
        </label>
        <input id="email" name="email" type="email" required className={inputClass} />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-ocean-800" htmlFor="subject">
          Betreff
        </label>
        <select id="subject" name="subject" className={inputClass}>
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
        <textarea id="message" name="message" required rows={5} className={inputClass} />
      </div>
      <button type="submit" className="btn-glass btn-primary w-full md:w-auto">
        Nachricht senden
      </button>
      {sent && <p className="text-sm text-aqua-600">Ihr E-Mail-Programm wurde geöffnet.</p>}
    </form>
  )
}
