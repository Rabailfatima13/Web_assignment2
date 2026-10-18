import { createSlice } from '@reduxjs/toolkit'

const USERS_KEY = 'ems_users'
const CURRENT_USER_KEY = 'ems_current_user'

// Read a saved value from localStorage. If it is missing or broken, use the fallback.
function loadFromStorage(key, fallback) {
  try {
    const saved = localStorage.getItem(key)
    return saved ? JSON.parse(saved) : fallback
  } catch {
    return fallback
  }
}

export function saveAuthToStorage(authState) {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(authState.users))
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(authState.currentUser))
  } catch {
    // Storage can be blocked (for example in private mode). The app still works without it.
  }
}

const initialState = {
  users: loadFromStorage(USERS_KEY, []),
  currentUser: loadFromStorage(CURRENT_USER_KEY, null),
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    registerUser(state, action) {
      const { name, email, password } = action.payload
      const normalizedEmail = email.trim().toLowerCase()

      const alreadyExists = state.users.some((user) => user.email === normalizedEmail)
      if (alreadyExists) {
        state.error = 'An account with this email already exists.'
        return
      }

      const newUser = {
        id: Date.now().toString(),
        name: name.trim(),
        email: normalizedEmail,
        password,
      }
      state.users.push(newUser)

      // Log the new user in straight away. The password is not kept in currentUser.
      state.currentUser = { id: newUser.id, name: newUser.name, email: newUser.email }
      state.error = null
    },

    loginUser(state, action) {
      const email = action.payload.email.trim().toLowerCase()
      const { password } = action.payload

      const user = state.users.find((u) => u.email === email && u.password === password)
      if (!user) {
        state.error = 'Incorrect email or password.'
        return
      }

      state.currentUser = { id: user.id, name: user.name, email: user.email }
      state.error = null
    },

    logout(state) {
      state.currentUser = null
      state.error = null
    },

    clearAuthError(state) {
      state.error = null
    },
  },
})

export const { registerUser, loginUser, logout, clearAuthError } = authSlice.actions

export const selectCurrentUser = (state) => state.auth.currentUser
export const selectAuthError = (state) => state.auth.error

export default authSlice.reducer
