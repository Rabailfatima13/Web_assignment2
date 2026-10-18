import { configureStore } from '@reduxjs/toolkit'
import authReducer, { saveAuthToStorage } from '../features/auth/authSlice.js'
import eventsReducer from '../features/events/eventsSlice.js'
import registrationsReducer, {
  saveRegistrationsToStorage,
} from '../features/registrations/registrationsSlice.js'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    events: eventsReducer,
    registrations: registrationsReducer,
  },
})

// Every time the Redux state changes, save the parts we want to keep to localStorage,
// so the user stays logged in and keeps their registrations after a page refresh.
store.subscribe(() => {
  const state = store.getState()
  saveAuthToStorage(state.auth)
  saveRegistrationsToStorage(state.registrations)
})
