// An event counts as completed once its start time has passed.
// If Ticketmaster only gives a date (no time), it is completed after that whole day.
export function isEventPast(event) {
  if (event.dateTime && event.dateTime.includes('T')) {
    return new Date(event.dateTime) < new Date()
  }
  if (event.localDate) {
    const [year, month, day] = event.localDate.split('-').map(Number)
    return new Date(year, month - 1, day, 23, 59, 59) < new Date()
  }
  return false
}

// Turn "2026-10-18" + "19:30:00" into something like "Sun, 18 Oct 2026 · 7:30 PM".
// The date and time are the event's local values, so we read them as-is
// instead of converting time zones.
export function formatEventDate(localDate, localTime) {
  if (!localDate) {
    return 'Date to be announced'
  }

  const [year, month, day] = localDate.split('-').map(Number)
  const date = new Date(year, month - 1, day)

  const datePart = date.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  if (!localTime) {
    return datePart
  }

  const [hours, minutes] = localTime.split(':').map(Number)
  date.setHours(hours, minutes)
  const timePart = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })

  return `${datePart} · ${timePart}`
}
