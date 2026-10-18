import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { searchEvents, getCategories, getEventById } from '../../api/ticketmaster.js'

// createAsyncThunk handles the three stages of a request for us:
// pending (started), fulfilled (worked) and rejected (failed).
export const fetchEvents = createAsyncThunk('events/fetchEvents', async (params) => {
  return searchEvents(params)
})

export const fetchCategories = createAsyncThunk('events/fetchCategories', async () => {
  return getCategories()
})

export const fetchEventById = createAsyncThunk('events/fetchEventById', async (id) => {
  return getEventById(id)
})

const emptyFilters = {
  keyword: '',
  category: '',
  city: '',
  startDate: '',
  endDate: '',
}

const initialState = {
  items: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  latestRequestId: null,
  page: {
    number: 0,
    totalPages: 0,
    totalElements: 0,
  },
  // Filters and the current page live in Redux, so they are kept
  // when the user opens an event and then comes back to the list.
  filters: emptyFilters,
  currentPage: 0,
  categories: [],
  categoriesStatus: 'idle',
  // The single event shown on the Event Details page.
  selectedEvent: null,
  selectedStatus: 'idle',
  selectedError: null,
}

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    // Change one or more filters, e.g. dispatch(setFilters({ city: 'London' })).
    // A new search always starts again from the first page.
    setFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload }
      state.currentPage = 0
    },
    clearFilters(state) {
      state.filters = emptyFilters
      state.currentPage = 0
    },
    setPage(state, action) {
      state.currentPage = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state, action) => {
        state.status = 'loading'
        state.error = null
        // Remember which request is the newest one.
        state.latestRequestId = action.meta.requestId
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        // If the user changed the search while an older request was still loading,
        // ignore the older answer so it can't replace the newer results.
        if (action.meta.requestId !== state.latestRequestId) return
        state.status = 'succeeded'
        state.items = action.payload.events
        state.page = action.payload.page
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        if (action.meta.requestId !== state.latestRequestId) return
        state.status = 'failed'
        state.error = action.error.message || 'Could not load events.'
      })
      .addCase(fetchCategories.pending, (state) => {
        state.categoriesStatus = 'loading'
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categoriesStatus = 'succeeded'
        state.categories = action.payload
      })
      .addCase(fetchCategories.rejected, (state) => {
        // The page still works without the category list, so we only note the failure.
        state.categoriesStatus = 'failed'
      })
      .addCase(fetchEventById.pending, (state) => {
        state.selectedStatus = 'loading'
        state.selectedError = null
        state.selectedEvent = null
      })
      .addCase(fetchEventById.fulfilled, (state, action) => {
        state.selectedStatus = 'succeeded'
        state.selectedEvent = action.payload
      })
      .addCase(fetchEventById.rejected, (state, action) => {
        state.selectedStatus = 'failed'
        state.selectedError = action.error.message || 'Could not load this event.'
      })
  },
})

export const { setFilters, clearFilters, setPage } = eventsSlice.actions

export const selectEvents = (state) => state.events.items
export const selectEventsStatus = (state) => state.events.status
export const selectEventsError = (state) => state.events.error
export const selectEventsPage = (state) => state.events.page
export const selectFilters = (state) => state.events.filters
export const selectCurrentPage = (state) => state.events.currentPage
export const selectCategories = (state) => state.events.categories
export const selectSelectedEvent = (state) => state.events.selectedEvent
export const selectSelectedStatus = (state) => state.events.selectedStatus
export const selectSelectedError = (state) => state.events.selectedError

export default eventsSlice.reducer
