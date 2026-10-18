import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import EventCard from '../components/EventCard.jsx'
import Loader from '../components/Loader.jsx'
import ErrorMessage from '../components/ErrorMessage.jsx'
import Pagination from '../components/Pagination.jsx'
import { MAX_RESULTS } from '../api/ticketmaster.js'
import {
  fetchEvents,
  selectEvents,
  selectEventsStatus,
  selectEventsError,
  selectEventsPage,
} from '../features/events/eventsSlice.js'

const PAGE_SIZE = 12

function Events() {
  const [currentPage, setCurrentPage] = useState(0)

  const dispatch = useDispatch()
  const events = useSelector(selectEvents)
  const status = useSelector(selectEventsStatus)
  const error = useSelector(selectEventsError)
  const page = useSelector(selectEventsPage)

  // Fetch events whenever the page number changes.
  useEffect(() => {
    dispatch(fetchEvents({ page: currentPage, size: PAGE_SIZE }))
  }, [dispatch, currentPage])

  // Ticketmaster cannot return results past the first 1000.
  const totalPages = Math.min(page.totalPages, Math.floor(MAX_RESULTS / PAGE_SIZE))

  function handlePageChange(newPage) {
    setCurrentPage(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleRetry() {
    dispatch(fetchEvents({ page: currentPage, size: PAGE_SIZE }))
  }

  return (
    <section className="page">
      <div className="page-header">
        <h1>Upcoming Events</h1>
        {status === 'succeeded' && (
          <p>{page.totalElements.toLocaleString()} events found</p>
        )}
      </div>

      {status === 'loading' && <Loader message="Loading events..." />}

      {status === 'failed' && <ErrorMessage message={error} onRetry={handleRetry} />}

      {status === 'succeeded' && events.length === 0 && (
        <p className="empty-state">No events found.</p>
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
