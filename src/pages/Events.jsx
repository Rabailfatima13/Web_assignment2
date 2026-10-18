import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import EventCard from '../components/EventCard.jsx'
import Loader from '../components/Loader.jsx'
import ErrorMessage from '../components/ErrorMessage.jsx'
import Pagination from '../components/Pagination.jsx'
import SearchBar from '../components/SearchBar.jsx'
import Filters from '../components/Filters.jsx'
import CategoryChips from '../components/CategoryChips.jsx'
import { MAX_RESULTS } from '../api/ticketmaster.js'
import {
  fetchEvents,
  fetchCategories,
  setFilters,
  clearFilters,
  setPage,
  selectEvents,
  selectEventsStatus,
  selectEventsError,
  selectEventsPage,
  selectFilters,
  selectCurrentPage,
  selectCategories,
} from '../features/events/eventsSlice.js'

const PAGE_SIZE = 12

function Events() {
  // Changing this number re-creates the search and filter inputs,
  // which empties them after "Clear all".
  const [resetKey, setResetKey] = useState(0)

  const dispatch = useDispatch()
  const events = useSelector(selectEvents)
  const status = useSelector(selectEventsStatus)
  const error = useSelector(selectEventsError)
  const page = useSelector(selectEventsPage)
  const filters = useSelector(selectFilters)
  const currentPage = useSelector(selectCurrentPage)
  const categories = useSelector(selectCategories)

  // Load the category list once.
  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories())
    }
  }, [dispatch, categories.length])

  // Fetch events whenever the filters or the page number change.
  useEffect(() => {
    dispatch(fetchEvents({ ...filters, page: currentPage, size: PAGE_SIZE }))
  }, [dispatch, filters, currentPage])

  // Ticketmaster cannot return results past the first 1000.
  const totalPages = Math.min(page.totalPages, Math.floor(MAX_RESULTS / PAGE_SIZE))

  const hasFilters = Object.values(filters).some((value) => value !== '')

  function handlePageChange(newPage) {
    dispatch(setPage(newPage))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleClear() {
    dispatch(clearFilters())
    setResetKey(resetKey + 1)
  }

  function handleRetry() {
    dispatch(fetchEvents({ ...filters, page: currentPage, size: PAGE_SIZE }))
  }

  return (
    <section className="page">
      <div className="page-header">
        <h1>Upcoming Events</h1>
        <p>Find concerts, sports, theatre and more.</p>
      </div>

      <div className="search-panel">
        <SearchBar
          key={`search-${resetKey}`}
          initialValue={filters.keyword}
          onSearch={(keyword) => dispatch(setFilters({ keyword }))}
        />

        <CategoryChips
          categories={categories}
          selected={filters.category}
          onSelect={(category) => dispatch(setFilters({ category }))}
        />

        <Filters
          key={`filters-${resetKey}`}
          initialValues={filters}
          onApply={(values) => dispatch(setFilters(values))}
          onClear={handleClear}
        />
      </div>

      {status === 'succeeded' && (
        <p className="results-count">
          {page.totalElements.toLocaleString()} events found
          {filters.keyword && ` for "${filters.keyword}"`}
          {filters.category && ` in ${filters.category}`}
          {filters.city && ` in ${filters.city}`}
        </p>
      )}

      {status === 'loading' && <Loader message="Loading events..." />}

      {status === 'failed' && <ErrorMessage message={error} onRetry={handleRetry} />}

      {status === 'succeeded' && events.length === 0 && (
        <div className="empty-state">
          <p>No events match your search.</p>
          {hasFilters && (
            <button type="button" className="btn btn-outline" onClick={handleClear}>
              Clear filters
            </button>
          )}
        </div>
      )}

      {status === 'succeeded' && events.length > 0 && (
        <>
          <div className="event-grid">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </section>
  )
}

export default Events
