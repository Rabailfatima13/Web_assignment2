import { configureStore } from '@reduxjs/toolkit'
import authReducer, { saveAuthToStorage } from '../features/auth/authSlice.js'

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
})

// Every time the Redux state changes, save the auth part to localStorage
// so the user stays logged in after a page refresh.
store.subscribe(() => {
  saveAuthToStorage(store.getState().auth)
})
