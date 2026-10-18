import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { searchEvents } from '../../api/ticketmaster.js'

// createAsyncThunk handles the three stages of a request for us:
// pending (started), fulfilled (worked) and rejected (failed).
export const fetchEvents = createAsyncThunk('events/fetchEvents', async (params) => {
  return searchEvents(params)
})

const initialState = {
  items: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  page: {
    number: 0,
    totalPages: 0,
    totalElements: 0,
  },
}

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload.events
        state.page = action.payload.page
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || 'Could not load events.'
      })
  },
})

export const selectEvents = (state) => state.events.items
export const selectEventsStatus = (state) => state.events.status
export const selectEventsError = (state) => state.events.error
export const selectEventsPage = (state) => state.events.page

export default eventsSlice.reducer
