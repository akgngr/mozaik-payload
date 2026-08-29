export interface CalendarEventData {
  title: string
  description?: string
  location?: string
  startDate: string | Date
  endDate?: string | Date
}

/**
 * Format Date to UTC iCalendar format: YYYYMMDDTHHmmssZ
 */
function toICalDate(d: Date): string {
  return d
    .toISOString()
    .replace(/-|:|\.\d+/g, '')
    .slice(0, 15) + 'Z'
}

/**
 * Generates a Google Calendar direct Add-Event URL
 */
export function getGoogleCalendarUrl(event: CalendarEventData): string {
  const start = new Date(event.startDate)
  const end = event.endDate ? new Date(event.endDate) : new Date(start.getTime() + 2 * 60 * 60 * 1000)

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${toICalDate(start)}/${toICalDate(end)}`,
    details: event.description || '',
    location: event.location || '',
  })

  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

/**
 * Generates an Outlook / Office 365 Web Calendar direct URL
 */
export function getOutlookCalendarUrl(event: CalendarEventData): string {
  const start = new Date(event.startDate)
  const end = event.endDate ? new Date(event.endDate) : new Date(start.getTime() + 2 * 60 * 60 * 1000)

  const params = new URLSearchParams({
    path: '/calendar/action/compose',
    rru: 'addevent',
    subject: event.title,
    startdt: start.toISOString(),
    enddt: end.toISOString(),
    body: event.description || '',
    location: event.location || '',
  })

  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`
}

/**
 * Generates standard .ics file contents for Apple Calendar, iCal, Outlook Desktop
 */
export function generateIcsContent(event: CalendarEventData): string {
  const start = new Date(event.startDate)
  const end = event.endDate ? new Date(event.endDate) : new Date(start.getTime() + 2 * 60 * 60 * 1000)
  const now = new Date()

  const uid = `${now.getTime()}-${Math.random().toString(36).substring(2, 9)}@mosaik-ruesselsheim.de`

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Mosaik Dialog und Kultur e.V.//Veranstaltungskalender//DE',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${toICalDate(now)}`,
    `DTSTART:${toICalDate(start)}`,
    `DTEND:${toICalDate(end)}`,
    `SUMMARY:${event.title.replace(/,/g, '\\,')}`,
    `DESCRIPTION:${(event.description || '').replace(/\n/g, '\\n')}`,
    `LOCATION:${(event.location || '').replace(/,/g, '\\,')}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
}

/**
 * Triggers a download of .ics file directly in the browser
 */
export function downloadIcsFile(event: CalendarEventData) {
  const icsContent = generateIcsContent(event)
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', `${event.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.ics`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}
