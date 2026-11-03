// "Add to calendar" for what a visitor just booked: a Google Calendar link
// and an .ics file (Apple Calendar, Outlook). Times are the visitor's local
// time; without a time the event takes whole days.

export interface CalendarEntry {
  title: string
  /** YYYY-MM-DD */
  date: string
  /** HH:MM; none makes an all-day entry */
  time?: string
  /** HH:MM; an hour after the start when missing */
  endTime?: string
  /** YYYY-MM-DD, the day after the last whole day (a stay's check-out) */
  endDate?: string
  location?: string
  details?: string
}

const compact = (value: string) => value.replace(/[-:]/g, '')

const toMinutes = (value: string) => {
  const [h, m] = value.split(':').map(Number)
  return (h ?? 0) * 60 + (m ?? 0)
}
const clock = (minutes: number) => `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`

export function nextDay(date: string) {
  const [y, m, d] = date.split('-').map(Number)
  const next = new Date(y!, m! - 1, d! + 1)
  return `${next.getFullYear()}${String(next.getMonth() + 1).padStart(2, '0')}${String(next.getDate()).padStart(2, '0')}`
}

function span(entry: CalendarEntry) {
  if (!entry.time) {
    return { start: compact(entry.date), end: entry.endDate ? compact(entry.endDate) : nextDay(entry.date), allDay: true }
  }
  const [h, m] = entry.time.split(':').map(Number)
  // An hour when no end is given; an end at or before the start is the next day
  const startMinutes = (h ?? 0) * 60 + (m ?? 0)
  const endMinutes = entry.endTime ? toMinutes(entry.endTime) : startMinutes + 60
  const overnight = endMinutes <= startMinutes || endMinutes >= 24 * 60
  const end = entry.endTime || clock(endMinutes % (24 * 60))
  return { start: `${compact(entry.date)}T${compact(entry.time)}00`, end: `${overnight ? nextDay(entry.date) : compact(entry.date)}T${compact(end)}00`, allDay: false }
}

export function googleCalendarUrl(entry: CalendarEntry) {
  const { start, end } = span(entry)
  const params = new URLSearchParams({ action: 'TEMPLATE', text: entry.title, dates: `${start}/${end}` })
  if (entry.location) params.set('location', entry.location)
  if (entry.details) params.set('details', entry.details)
  return `https://calendar.google.com/calendar/render?${params}`
}

export function downloadIcs(entry: CalendarEntry, filename = 'booking.ics') {
  const { start, end, allDay } = span(entry)
  const escape = (value: string) => value.replace(/[\\;,]/g, m => `\\${m}`).replace(/\n/g, '\\n')
  const ics = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Perlink//Booking//EN', 'BEGIN:VEVENT',
    `UID:${Date.now()}@perlink.to`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').slice(0, 15)}Z`,
    ...(allDay ? [`DTSTART;VALUE=DATE:${start}`, `DTEND;VALUE=DATE:${end}`] : [`DTSTART:${start}`, `DTEND:${end}`]),
    `SUMMARY:${escape(entry.title)}`,
    ...(entry.location ? [`LOCATION:${escape(entry.location)}`] : []),
    ...(entry.details ? [`DESCRIPTION:${escape(entry.details)}`] : []),
    `URL:${location.href}`,
    'END:VEVENT', 'END:VCALENDAR',
  ].join('\r\n')
  const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }))
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

/** Whole nights between two YYYY-MM-DD dates (0 when out of order) */
export function nightsBetween(from: string, to: string) {
  const [a, b] = [from, to].map((d) => {
    const [y, m, day] = d.split('-').map(Number)
    return Date.UTC(y!, m! - 1, day!)
  })
  return Math.max(0, Math.round((b! - a!) / 86_400_000))
}
