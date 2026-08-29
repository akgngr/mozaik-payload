'use client'

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { Card } from './Card'
import { Animated } from './Animated'
import { PinIcon, ClockIcon } from './icons'
import {
  getGoogleCalendarUrl,
  getOutlookCalendarUrl,
  downloadIcsFile,
  type CalendarEventData,
} from '@/lib/calendar'
import type { Event as EventType, Media } from '@/payload-types'

const categoryConfig: Record<
  string,
  { label: string; badge: string; border: string; bg: string; text: string }
> = {
  education: {
    label: 'Sprache & Bildung',
    badge: 'bg-brand-100 text-brand-700',
    border: 'border-brand-300',
    bg: 'bg-brand-500',
    text: 'text-brand-600',
  },
  culture: {
    label: 'Kultur & Fest',
    badge: 'bg-salmon-100 text-salmon-700',
    border: 'border-salmon-300',
    bg: 'bg-salmon-400',
    text: 'text-salmon-600',
  },
  youth: {
    label: 'Jugend & Familie',
    badge: 'bg-lav-100 text-lav-700',
    border: 'border-lav-300',
    bg: 'bg-lav-500',
    text: 'text-lav-600',
  },
  dialog: {
    label: 'Dialog & Treffpunkt',
    badge: 'bg-aqua-100 text-aqua-700',
    border: 'border-aqua-300',
    bg: 'bg-aqua-500',
    text: 'text-aqua-600',
  },
  workshop: {
    label: 'Workshop & Kurs',
    badge: 'bg-citrus-100 text-citrus-800',
    border: 'border-citrus-300',
    bg: 'bg-citrus-500',
    text: 'text-citrus-700',
  },
}

interface ModalProps {
  event: CalendarEventData | null
  onClose: () => void
}

/**
 * Modern Takvime Ekleme Modalı
 */
function CalendarModal({ event, onClose }: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (event) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.body.style.overflow = 'unset'
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [event, onClose])

  if (!event) return null

  const googleUrl = getGoogleCalendarUrl(event)
  const outlookUrl = getOutlookCalendarUrl(event)

  const dateObj = new Date(event.startDate)
  const formattedDate = dateObj.toLocaleDateString('de-DE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  const formattedTime = dateObj.toLocaleTimeString('de-DE', {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ocean-950/60 backdrop-blur-sm transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white p-6 sm:p-8 shadow-2xl ring-1 ring-black/10 z-10 animate-scale-up">
        {/* Top decorative strip */}
        <div className="mosaic-strip absolute inset-x-0 top-0 h-2" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-ocean-50 text-ocean-500 hover:bg-ocean-100 hover:text-ocean-900 transition-colors"
        >
          ✕
        </button>

        {/* Header */}
        <div className="text-center pt-2">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 shadow-sm">
            <svg
              className="h-7 w-7"
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
          </div>
          <h3 className="font-display text-xl font-bold text-ocean-900 line-clamp-2">
            {event.title}
          </h3>
          <p className="mt-1 text-xs font-semibold text-ocean-500">
            {formattedDate} • {formattedTime} Uhr
          </p>
        </div>

        {/* Calendar Options List */}
        <div className="mt-6 space-y-3">
          {/* Google Calendar */}
          <a
            href={googleUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="group flex items-center justify-between rounded-2xl border border-ocean-100 bg-ocean-50/50 p-4 transition-all hover:border-brand-300 hover:bg-brand-50/60 hover:shadow-sm"
          >
            <div className="flex items-center gap-3.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm font-bold text-base text-red-500">
                G
              </span>
              <div className="text-left">
                <p className="text-sm font-bold text-ocean-900 group-hover:text-brand-700">
                  Google Calendar
                </p>
                <p className="text-xs text-ocean-500">Im Browser öffnen</p>
              </div>
            </div>
            <span className="text-ocean-400 group-hover:text-brand-600">→</span>
          </a>

          {/* Apple Calendar / .ics */}
          <button
            type="button"
            onClick={() => {
              downloadIcsFile(event)
              onClose()
            }}
            className="group flex w-full items-center justify-between rounded-2xl border border-ocean-100 bg-ocean-50/50 p-4 transition-all hover:border-brand-300 hover:bg-brand-50/60 hover:shadow-sm"
          >
            <div className="flex items-center gap-3.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm font-bold text-base text-ocean-900">
                
              </span>
              <div className="text-left">
                <p className="text-sm font-bold text-ocean-900 group-hover:text-brand-700">
                  Apple Kalender / iCal
                </p>
                <p className="text-xs text-ocean-500">.ics Datei herunterladen</p>
              </div>
            </div>
            <span className="text-ocean-400 group-hover:text-brand-600">↓</span>
          </button>

          {/* Outlook */}
          <a
            href={outlookUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="group flex items-center justify-between rounded-2xl border border-ocean-100 bg-ocean-50/50 p-4 transition-all hover:border-brand-300 hover:bg-brand-50/60 hover:shadow-sm"
          >
            <div className="flex items-center gap-3.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm font-bold text-base text-blue-600">
                O
              </span>
              <div className="text-left">
                <p className="text-sm font-bold text-ocean-900 group-hover:text-brand-700">
                  Outlook / Office 365
                </p>
                <p className="text-xs text-ocean-500">Outlook Web öffnen</p>
              </div>
            </div>
            <span className="text-ocean-400 group-hover:text-brand-600">→</span>
          </a>
        </div>

        {/* Footer info */}
        <p className="mt-5 text-center text-[11px] text-ocean-400">
          Wählen Sie Ihren bevorzugten Kalenderdienst, um die Veranstaltung hinzuzufügen.
        </p>
      </div>
    </div>
  )
}

interface Props {
  initialEvents: EventType[]
  initialHasNextPage: boolean
}

export function EventCalendarView({ initialEvents, initialHasNextPage }: Props) {
  const [events, setEvents] = useState<EventType[]>(initialEvents)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [activeModalEvent, setActiveModalEvent] = useState<CalendarEventData | null>(null)

  const [page, setPage] = useState(1)
  const [hasNextPage, setHasNextPage] = useState(initialHasNextPage)
  const [loading, setLoading] = useState(false)
  const observerRef = useRef<HTMLDivElement>(null)

  // Infinite Scroll fetcher
  const loadMore = useCallback(async () => {
    if (loading || !hasNextPage) return

    setLoading(true)
    const nextPage = page + 1

    try {
      const params = new URLSearchParams({
        page: String(nextPage),
        limit: '9',
      })
      if (selectedCategory !== 'all') params.append('category', selectedCategory)
      if (searchQuery) params.append('search', searchQuery)

      const res = await fetch(`/api/events?${params.toString()}`)
      const data = await res.json()

      if (data.docs && Array.isArray(data.docs)) {
        setEvents((prev) => [...prev, ...data.docs])
        setPage(nextPage)
        setHasNextPage(Boolean(data.hasNextPage))
      }
    } catch (err) {
      console.error('Error loading more events:', err)
    } finally {
      setLoading(false)
    }
  }, [page, hasNextPage, loading, selectedCategory, searchQuery])

  // Reset pagination on category or search change
  const handleCategoryChange = async (cat: string) => {
    setSelectedCategory(cat)
    setPage(1)
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: '1', limit: '9' })
      if (cat !== 'all') params.append('category', cat)
      if (searchQuery) params.append('search', searchQuery)

      const res = await fetch(`/api/events?${params.toString()}`)
      const data = await res.json()
      if (data.docs) {
        setEvents(data.docs)
        setHasNextPage(Boolean(data.hasNextPage))
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearchChange = async (query: string) => {
    setSearchQuery(query)
    setPage(1)
    try {
      const params = new URLSearchParams({ page: '1', limit: '9' })
      if (selectedCategory !== 'all') params.append('category', selectedCategory)
      if (query) params.append('search', query)

      const res = await fetch(`/api/events?${params.toString()}`)
      const data = await res.json()
      if (data.docs) {
        setEvents(data.docs)
        setHasNextPage(Boolean(data.hasNextPage))
      }
    } catch (err) {
      console.error(err)
    }
  }

  // IntersectionObserver trigger
  useEffect(() => {
    const el = observerRef.current
    if (!el || !hasNextPage) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !loading && hasNextPage) {
          loadMore()
        }
      },
      { rootMargin: '200px' },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [loadMore, loading, hasNextPage])

  return (
    <div className="space-y-12">
      {/* Category filter pills & Search bar */}
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleCategoryChange('all')}
            className={`rounded-full px-4 py-2 text-xs font-extrabold transition-all ${
              selectedCategory === 'all'
                ? 'bg-ocean-900 text-white shadow'
                : 'bg-white text-ocean-700 hover:bg-ocean-100/70 border border-ocean-200'
            }`}
          >
            Alle Aktivitäten
          </button>
          {Object.entries(categoryConfig).map(([key, cfg]) => {
            return (
              <button
                key={key}
                onClick={() => handleCategoryChange(key)}
                className={`rounded-full px-4 py-2 text-xs font-extrabold transition-all ${
                  selectedCategory === key
                    ? `${cfg.badge} ring-2 ring-offset-1 ring-current shadow-sm`
                    : 'bg-white text-ocean-700 hover:bg-ocean-100/70 border border-ocean-200'
                }`}
              >
                {cfg.label}
              </button>
            )
          })}
        </div>

        <div className="relative w-full md:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Veranstaltung suchen..."
            className="w-full rounded-full border border-ocean-200 bg-white px-5 py-2.5 text-xs text-ocean-900 placeholder:text-ocean-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100 shadow-sm"
          />
        </div>
      </div>

      {/* Events timeline / list */}
      <div className="space-y-6">
        {events.map((ev, i) => {
          const dateObj = new Date(ev.eventDate)
          const day = dateObj.getDate()
          const month = dateObj.toLocaleDateString('de-DE', { month: 'short' })
          const time = dateObj.toLocaleTimeString('de-DE', {
            hour: '2-digit',
            minute: '2-digit',
          })
          const weekday = dateObj.toLocaleDateString('de-DE', {
            weekday: 'long',
          })

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
            <Animated key={`${ev.id}-${i}`} variant="fade-up" delay={(i % 9) * 40}>
              <Card className="overflow-hidden p-6 md:p-8 transition-all hover:shadow-[var(--shadow-card-hover)]">
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                  {/* Left: Date badge + Content */}
                  <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                    {/* Date Block */}
                    <div
                      className={`flex h-20 w-20 flex-shrink-0 flex-col items-center justify-center rounded-2xl ${catInfo.bg} text-white shadow-md`}
                    >
                      <span className="text-xs font-bold uppercase tracking-wider opacity-90">
                        {month}
                      </span>
                      <span className="font-display text-3xl font-extrabold leading-none">
                        {day}
                      </span>
                    </div>

                    {/* Event details */}
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-extrabold ${catInfo.badge}`}
                        >
                          {catInfo.label}
                        </span>
                        {ev.isHighlight && (
                          <span className="rounded-full bg-citrus-300 px-2.5 py-0.5 text-[11px] font-extrabold text-ocean-900">
                            ★ Highlight
                          </span>
                        )}
                      </div>

                      <h3 className="font-display text-2xl font-bold text-ocean-900">
                        {ev.title}
                      </h3>

                      {ev.excerpt && (
                        <p className="max-w-2xl text-sm leading-relaxed text-ocean-700/85">
                          {ev.excerpt}
                        </p>
                      )}

                      {/* Metadata: Time & Location */}
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 text-xs font-semibold text-ocean-600">
                        <div className="flex items-center gap-1.5">
                          <ClockIcon className="h-4 w-4 text-brand-500" />
                          <span>
                            {weekday}, {time} Uhr
                          </span>
                        </div>
                        {ev.location && (
                          <div className="flex items-center gap-1.5">
                            <PinIcon className="h-4 w-4 text-salmon-500" />
                            <span>{ev.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions (Add to calendar modal trigger) */}
                  <div className="flex flex-shrink-0 items-center justify-start md:justify-end">
                    <button
                      type="button"
                      onClick={() => setActiveModalEvent(calData)}
                      className="inline-flex items-center gap-2 rounded-full border border-ocean-200 bg-white px-5 py-2.5 text-xs font-bold text-ocean-800 shadow-sm transition-all hover:border-brand-400 hover:text-brand-600 hover:shadow"
                    >
                      <svg
                        className="h-4 w-4 text-brand-500"
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
                      <span>+ Zum Kalender hinzufügen</span>
                    </button>
                  </div>
                </div>
              </Card>
            </Animated>
          )
        })}

        {events.length === 0 && !loading && (
          <div className="rounded-3xl border border-ocean-100 bg-white py-16 text-center">
            <p className="font-display text-xl font-bold text-ocean-800">
              Keine passenden Aktivitäten gefunden
            </p>
            <p className="mt-2 text-sm text-ocean-500">
              Versuchen Sie, den Filter oder Suchbegriff zurückzusetzen.
            </p>
          </div>
        )}
      </div>

      {/* Infinite scroll trigger / loading state */}
      <div ref={observerRef} className="mt-12 flex justify-center py-6">
        {loading && (
          <div className="flex items-center gap-3 text-brand-600 font-semibold text-sm">
            <svg
              className="h-6 w-6 animate-spin text-brand-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Weitere Aktivitäten werden geladen...</span>
          </div>
        )}
        {!hasNextPage && events.length > 9 && (
          <p className="text-sm font-medium text-ocean-400">
            Sie haben alle anstehenden Aktivitäten gesehen.
          </p>
        )}
      </div>

      {/* Modern Pop-up Modal */}
      <CalendarModal
        event={activeModalEvent}
        onClose={() => setActiveModalEvent(null)}
      />
    </div>
  )
}
