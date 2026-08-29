'use client'

import React, { useState, type FormEvent } from 'react'
import { Container } from './Container'
import { MosaicPattern } from './MosaicPattern'
import { Animated } from './Animated'
import { ArrowRightIcon, MailIcon } from './icons'

export function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error' | 'already'>('idle')
  const [feedbackMessage, setFeedbackMessage] = useState('')

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!email) return

    setLoading(true)
    setStatus('idle')
    setFeedbackMessage('')

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (!res.ok) {
        setStatus('error')
        setFeedbackMessage(data.error || 'Etwas ist schiefgelaufen.')
      } else {
        if (data.alreadySubscribed) {
          setStatus('already')
        } else {
          setStatus('success')
          setEmail('')
        }
        setFeedbackMessage(data.message)
      }
    } catch {
      setStatus('error')
      setFeedbackMessage('Verbindungsfehler. Bitte versuchen Sie es später erneut.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="relative overflow-hidden bg-cream py-20 md:py-28 border-t border-ocean-100/60">
      <MosaicPattern className="pointer-events-none absolute -bottom-10 right-0 w-60 select-none opacity-15 md:w-80" />

      {/* Decorative ambient gradients */}
      <div
        className="pointer-events-none absolute -top-24 left-1/4 h-72 w-72 rounded-full opacity-40 blur-3xl"
        style={{ background: 'radial-gradient(circle, #a8e5e2 0%, transparent 70%)' }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-24 right-1/4 h-72 w-72 rounded-full opacity-30 blur-3xl"
        style={{ background: 'radial-gradient(circle, #ded2f2 0%, transparent 70%)' }}
        aria-hidden
      />

      <Container className="relative max-w-5xl">
        <Animated variant="scale-up">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-white p-8 md:p-14 shadow-[var(--shadow-card)] border border-ocean-100/80">
            {/* Top brand accent bar */}
            <div className="mosaic-strip absolute inset-x-0 top-0 h-2" aria-hidden />

            <div className="mx-auto max-w-2xl text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 shadow-sm">
                <MailIcon className="h-8 w-8" />
              </div>

              <span className="mb-3 inline-block text-xs font-bold uppercase tracking-[0.18em] text-brand-600">
                Immer informiert bleiben
              </span>

              <h2 className="text-balance font-display text-3xl font-extrabold text-ocean-900 md:text-4xl">
                Abonnieren Sie unseren <span className="text-marker text-marker-teal">Newsletter</span>
              </h2>

              <p className="mt-4 text-base leading-relaxed text-ocean-700/90 md:text-lg">
                Erhalten Sie regelmäßige Einblicke in unsere Projekte, anstehende Kulturveranstaltungen,
                Kurse und Möglichkeiten, sich in Rüsselsheim zu engagieren.
              </p>

              <form onSubmit={handleSubmit} className="mt-8">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <div className="relative flex-1">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Ihre E-Mail-Adresse..."
                      required
                      className="w-full rounded-full border-2 border-ocean-100 bg-ocean-50/50 px-6 py-3.5 text-ocean-900 placeholder:text-ocean-400 transition-all focus:border-brand-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-100"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-glass btn-primary whitespace-nowrap px-8 py-3.5 shadow-md transition-transform disabled:opacity-70"
                  >
                    {loading ? (
                      'Wird angemeldet...'
                    ) : (
                      <>
                        Anmelden <ArrowRightIcon className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>

                {/* Feedback status messages */}
                {feedbackMessage && (
                  <div className="mt-4 animate-fade-in">
                    {status === 'success' && (
                      <p className="inline-flex items-center gap-2 rounded-full bg-leaf-50 px-4 py-1.5 text-sm font-semibold text-leaf-700 border border-leaf-200">
                        <span className="h-2 w-2 rounded-full bg-leaf-500" />
                        {feedbackMessage}
                      </p>
                    )}
                    {status === 'already' && (
                      <p className="inline-flex items-center gap-2 rounded-full bg-aqua-50 px-4 py-1.5 text-sm font-semibold text-aqua-700 border border-aqua-200">
                        <span className="h-2 w-2 rounded-full bg-aqua-500" />
                        {feedbackMessage}
                      </p>
                    )}
                    {status === 'error' && (
                      <p className="inline-flex items-center gap-2 rounded-full bg-salmon-50 px-4 py-1.5 text-sm font-semibold text-salmon-700 border border-salmon-200">
                        <span className="h-2 w-2 rounded-full bg-salmon-500" />
                        {feedbackMessage}
                      </p>
                    )}
                  </div>
                )}

                <p className="mt-4 text-xs text-ocean-500">
                  Kein Spam. Sie können sich jederzeit mit einem Klick wieder abmelden.
                </p>
              </form>
            </div>
          </div>
        </Animated>
      </Container>
    </section>
  )
}
