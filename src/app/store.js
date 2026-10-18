import { configureStore } from '@reduxjs/toolkit'
import authReducer, { saveAuthToStorage } from '../features/auth/authSlice.js'
import eventsReducer from '../features/events/eventsSlice.js'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    events: eventsReducer,
  },
})

// Every time the Redux state changes, save the auth part to localStorage
// so the user stays logged in after a page refresh.
store.subscribe(() => {
  saveAuthToStorage(store.getState().auth)
})
