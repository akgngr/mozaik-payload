'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Card } from './Card'
import { Animated } from './Animated'
import { ArrowRightIcon, PinIcon, ClockIcon } from './icons'
import {
  getGoogleCalendarUrl,
  getOutlookCalendarUrl,
  downloadIcsFile,
  type CalendarEventData,
} from '@/lib/calendar'
import type { Event as EventType } from '@/payload-types'

const categoryConfig: Record<
  string,
  { label: string; badge: string; bg: string }
> = {
  education: {
    label: 'Sprache & Bildung',
    badge: 'bg-brand-100 text-brand-700',
    bg: 'bg-brand-500',
  },
  culture: {
    label: 'Kultur & Fest',
    badge: 'bg-salmon-100 text-salmon-700',
    bg: 'bg-salmon-400',
  },
  youth: {
    label: 'Jugend & Familie',
    badge: 'bg-lav-100 text-lav-700',
    bg: 'bg-lav-500',
  },
  dialog: {
    label: 'Dialog & Treffpunkt',
    badge: 'bg-aqua-100 text-aqua-700',
    bg: 'bg-aqua-500',
  },
  workshop: {
    label: 'Workshop & Kurs',
    badge: 'bg-citrus-100 text-citrus-800',
    bg: 'bg-citrus-500',
  },
}

export function HomeEventsSection({ events }: { events: EventType[] }) {
  const [activeModalEvent, setActiveModalEvent] = useState<CalendarEventData | null>(null)

  if (!events || events.length === 0) return null

  return (
    <>
      <section className="section relative overflow-hidden bg-white/70 border-y border-ocean-100/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <Animated variant="fade-up">
            <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
              <div>
                <span className="mb-3 inline-block text-xs font-bold uppercase tracking-[0.18em] text-brand-600">
                  Termine & Treffpunkte
                </span>
                <h2 className="text-balance font-display text-4xl text-ocean-900 md:text-5xl">
                  Anstehende <span className="text-marker text-marker-teal">Aktivitäten</span>
                </h2>
              </div>
              <Link
                href="/aktivitaet"
                className="inline-flex items-center gap-2 rounded-full border-2 border-brand-200 bg-white px-5 py-2.5 text-xs font-extrabold text-brand-600 shadow-sm transition-all hover:bg-brand-500 hover:border-brand-500 hover:text-white"
              >
                Alle Aktivitäten anzeigen <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
          </Animated>

          {/* 3 Event Cards */}
          <div className="grid gap-6 md:grid-cols-3">
            {events.slice(0, 3).map((ev, i) => {
              const dateObj = new Date(ev.eventDate)
              const day = dateObj.getDate()
              const month = dateObj.toLocaleDateString('de-DE', { month: 'short' })
              const time = dateObj.toLocaleTimeString('de-DE', {
                hour: '2-digit',
                minute: '2-digit',
              })
              const weekday = dateObj.toLocaleDateString('de-DE', { weekday: 'short' })

              const catInfo =
                categoryConfig[ev.category || 'workshop'] || categoryConfig.workshop

              const calData: CalendarEventData = {
                title: ev.title,
                description: ev.excerpt || undefined,
                location: ev.location || undefined,
                startDate: ev.eventDate,
                endDate: ev.endDate || undefined,
              }

              return (
                <Animated key={ev.id} variant="fade-up" delay={i * 90} className="min-w-0">
                  <Card className="group relative flex h-full w-full flex-col justify-between overflow-hidden p-7 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[var(--shadow-card-hover)]">
                    {/* Top bar */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between gap-3">
                        <div
                          className={`flex h-14 w-14 flex-col items-center justify-center rounded-2xl ${catInfo.bg} text-white shadow-sm`}
                        >
                          <span className="text-[10px] font-bold uppercase tracking-wider opacity-90">
                            {month}
                          </span>
                          <span className="font-display text-2xl font-extrabold leading-none">
                            {day}
                          </span>
                        </div>

                        <span
                          className={`rounded-full px-3 py-1 text-[11px] font-extrabold ${catInfo.badge}`}
                        >
                          {catInfo.label}
                        </span>
                      </div>

                      <div>
                        <h3 className="font-display text-xl font-bold text-ocean-900 group-hover:text-brand-600 transition-colors line-clamp-2">
                          {ev.title}
                        </h3>

                        {ev.excerpt && (
                          <p className="mt-2 text-xs leading-relaxed text-ocean-700/80 line-clamp-2">
                            {ev.excerpt}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Meta & Calendar button */}
                    <div className="mt-6 border-t border-ocean-100/70 pt-4">
                      <div className="flex flex-col gap-1.5 text-xs font-semibold text-ocean-600">
                        <div className="flex items-center gap-1.5">
                          <ClockIcon className="h-3.5 w-3.5 text-brand-500" />
                          <span>
                            {weekday}., {time} Uhr
                          </span>
                        </div>
                        {ev.location && (
                          <div className="flex items-center gap-1.5 truncate">
                            <PinIcon className="h-3.5 w-3.5 text-salmon-500 shrink-0" />
                            <span className="truncate">{ev.location}</span>
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => setActiveModalEvent(calData)}
                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-ocean-50/80 py-2.5 text-xs font-bold text-ocean-800 transition-colors hover:bg-brand-500 hover:text-white"
                      >
                        <svg
                          className="h-3.5 w-3.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span>Erinnerung</span>
                      </button>
                    </div>
                  </Card>
                </Animated>
              )
            })}
          </div>
        </div>
      </section>

      {/* Modal Dialog */}
      {activeModalEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div
            className="fixed inset-0 bg-ocean-950/60 backdrop-blur-sm animate-fade-in"
            onClick={() => setActiveModalEvent(null)}
          />
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white p-6 sm:p-8 shadow-2xl z-10 animate-scale-up">
            <div className="mosaic-strip absolute inset-x-0 top-0 h-2" />
            <button
              onClick={() => setActiveModalEvent(null)}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-ocean-50 text-ocean-500 hover:bg-ocean-100"
            >
              ✕
            </button>

            <div className="text-center pt-2">
              <h3 className="font-display text-xl font-bold text-ocean-900">
                {activeModalEvent.title}
              </h3>
              <p className="mt-1 text-xs font-semibold text-ocean-500">
                {new Date(activeModalEvent.startDate).toLocaleDateString('de-DE', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                })}
              </p>
            </div>

            <div className="mt-6 space-y-3">
              <a
                href={getGoogleCalendarUrl(activeModalEvent)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setActiveModalEvent(null)}
                className="flex items-center justify-between rounded-2xl border border-ocean-100 bg-ocean-50/50 p-4 transition-all hover:bg-brand-50/60"
              >
                <span className="text-sm font-bold text-ocean-900">Google Calendar</span>
                <span className="text-ocean-400">→</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  downloadIcsFile(activeModalEvent)
                  setActiveModalEvent(null)
                }}
                className="flex w-full items-center justify-between rounded-2xl border border-ocean-100 bg-ocean-50/50 p-4 transition-all hover:bg-brand-50/60 text-left"
              >
                <span className="text-sm font-bold text-ocean-900">Apple Kalender (.ics)</span>
                <span className="text-ocean-400">↓</span>
              </button>

              <a
                href={getOutlookCalendarUrl(activeModalEvent)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setActiveModalEvent(null)}
                className="flex items-center justify-between rounded-2xl border border-ocean-100 bg-ocean-50/50 p-4 transition-all hover:bg-brand-50/60"
              >
                <span className="text-sm font-bold text-ocean-900">Outlook / Office 365</span>
                <span className="text-ocean-400">→</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
