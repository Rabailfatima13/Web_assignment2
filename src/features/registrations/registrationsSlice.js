import { createSlice } from '@reduxjs/toolkit'

const STORAGE_KEY = 'ems_registrations'

function loadRegistrations() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : {}
  } catch {
    return {}
  }
}

export function saveRegistrationsToStorage(registrationsState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(registrationsState.byUser))
  } catch {
    // Storage can be blocked. The app still works for this visit.
  }
}

// Registrations are grouped by user id, so each user only sees their own:
// byUser = { "userId1": [ ...events ], "userId2": [ ...events ] }
const initialState = {
  byUser: loadRegistrations(),
}

const registrationsSlice = createSlice({
  name: 'registrations',
  initialState,
  reducers: {
    registerForEvent(state, action) {
      const { userId, event } = action.payload
      const userEvents = state.byUser[userId] || []

      // Prevent duplicate registration.
      if (userEvents.some((item) => item.id === event.id)) {
        return
      }

      // Save a small copy of the event, so My Events works without calling the API again.
      userEvents.push({
        id: event.id,
        name: event.name,
        image: event.image,
        localDate: event.localDate,
        localTime: event.localTime,
        dateTime: event.dateTime,
        venueName: event.venueName,
        city: event.city,
        country: event.country,
        category: event.category,
        registeredAt: new Date().toISOString(),
      })
      state.byUser[userId] = userEvents
    },

    cancelRegistration(state, action) {
      const { userId, eventId } = action.payload
      const userEvents = state.byUser[userId] || []
      state.byUser[userId] = userEvents.filter((item) => item.id !== eventId)
    },
  },
})

export const { registerForEvent, cancelRegistration } = registrationsSlice.actions

// Always return the same empty array, so components don't re-render for no reason.
const NO_EVENTS = []

export const selectUserRegistrations = (state, userId) =>
  (userId && state.registrations.byUser[userId]) || NO_EVENTS

export const selectIsRegistered = (state, userId, eventId) =>
  selectUserRegistrations(state, userId).some((item) => item.id === eventId)

export default registrationsSlice.reducer
