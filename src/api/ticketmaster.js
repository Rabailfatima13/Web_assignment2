const BASE_URL = 'https://app.ticketmaster.com/discovery/v2'
const API_KEY = import.meta.env.VITE_TM_API_KEY

// Ticketmaster only lets you page through the first 1000 results.
export const MAX_RESULTS = 1000

// Send a GET request to Ticketmaster and return the JSON response.
async function request(path, params = {}) {
  if (!API_KEY) {
    throw new Error('Ticketmaster API key is missing. Add VITE_TM_API_KEY to your .env file.')
  }

  const query = new URLSearchParams({ apikey: API_KEY })

  // Only send filters that actually have a value.
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.append(key, value)
    }
  })

  const response = await fetch(`${BASE_URL}${path}?${query.toString()}`)

  if (response.status === 429) {
    throw new Error('Too many requests. Please wait a moment and try again.')
  }
  if (response.status === 404) {
    throw new Error('Event not found.')
  }
  if (!response.ok) {
    throw new Error(`Ticketmaster request failed (status ${response.status}).`)
  }

  return response.json()
}

// Ticketmaster wants dates like 2026-10-18T09:30:00Z (no milliseconds).
export function toApiDate(date) {
  return date.toISOString().split('.')[0] + 'Z'
}

// Pick a 16:9 image. "minWidth" lets us choose a small image for cards
// and a big one for the details page.
function pickImage(images = [], minWidth) {
  const wide = images.filter((img) => img.ratio === '16_9')
  const list = wide.length > 0 ? wide : images
  const sorted = [...list].sort((a, b) => a.width - b.width)
  const bigEnough = sorted.find((img) => img.width >= minWidth)
  return (bigEnough || sorted[sorted.length - 1])?.url || ''
}

// Ticketmaster sometimes sends the word "Undefined" instead of leaving a name out.
function cleanName(name) {
  return name && name !== 'Undefined' ? name : ''
}

// The raw Ticketmaster event is very large and deeply nested.
// This keeps only the fields the app uses, in a flat and simple shape.
export function simplifyEvent(event) {
  const venue = event._embedded?.venues?.[0]
  const classification = event.classifications?.[0]
  const start = event.dates?.start || {}
  const price = event.priceRanges?.[0]

  return {
    id: event.id,
    name: event.name,
    url: event.url || '',
    image: pickImage(event.images, 640),
    imageLarge: pickImage(event.images, 1024),
    localDate: start.localDate || '',
    localTime: start.localTime || '',
    dateTime: start.dateTime || start.localDate || '',
    status: event.dates?.status?.code || '',
    timezone: event.dates?.timezone || '',
    category: cleanName(classification?.segment?.name) || 'Other',
    genre: cleanName(classification?.genre?.name),
    venueName: venue?.name || 'Venue to be announced',
    address: venue?.address?.line1 || '',
    city: venue?.city?.name || '',
    state: venue?.state?.name || '',
    country: venue?.country?.name || '',
    priceMin: price?.min ?? null,
    priceMax: price?.max ?? null,
    currency: price?.currency || '',
    info: event.info || event.description || '',
    pleaseNote: event.pleaseNote || '',
    seatmap: event.seatmap?.staticUrl || '',
  }
}

// Search for events. Every option is optional.
export async function searchEvents({ keyword, category, city, startDate, page = 0, size = 12 } = {}) {
  const data = await request('/events.json', {
    keyword,
    classificationName: category,
    city,
    startDateTime: startDate || toApiDate(new Date()),
    sort: 'date,asc',
    page,
    size,
  })

  const events = (data._embedded?.events || []).map(simplifyEvent)
  return {
    events,
    page: data.page || { number: 0, totalPages: 0, totalElements: 0, size },
  }
}

// Get one event by its Ticketmaster id.
export async function getEventById(id) {
  const data = await request(`/events/${id}.json`)
  return simplifyEvent(data)
}
