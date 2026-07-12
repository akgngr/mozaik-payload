'use client'

import { useState, type FormEvent } from 'react'

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
        <input
          id="name"
          name="name"
          type="text"
          required
          className="w-full rounded-xl border border-ocean-200/60 bg-white/70 px-4 py-2.5 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-300"
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-ocean-800" htmlFor="email">
          E-Mail *
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full rounded-xl border border-ocean-200/60 bg-white/70 px-4 py-2.5 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-300"
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-ocean-800" htmlFor="subject">
          Betreff
        </label>
        <select
          id="subject"
          name="subject"
          className="w-full rounded-xl border border-ocean-200/60 bg-white/70 px-4 py-2.5 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-300"
        >
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
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="w-full rounded-xl border border-ocean-200/60 bg-white/70 px-4 py-2.5 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-300"
        />
      </div>
      <button type="submit" className="btn-glass btn-primary w-full md:w-auto">
        Nachricht senden
      </button>
      {sent && <p className="text-sm text-brand-600">Ihr E-Mail-Programm wurde geöffnet.</p>}
    </form>
  )
}
