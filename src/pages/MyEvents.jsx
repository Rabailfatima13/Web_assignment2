import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import EventCard from '../components/EventCard.jsx'
import CancelButton from '../components/CancelButton.jsx'
import Toast from '../components/Toast.jsx'
import { selectCurrentUser } from '../features/auth/authSlice.js'
import {
  cancelRegistration,
  selectUserRegistrations,
} from '../features/registrations/registrationsSlice.js'
import { isEventPast } from '../utils/formatDate.js'

// Sort helper: compare two events by their start time.
function byDate(a, b) {
  return (a.dateTime || a.localDate).localeCompare(b.dateTime || b.localDate)
}

function MyEvents() {
  const [tab, setTab] = useState('upcoming')
  const [message, setMessage] = useState('')

  const dispatch = useDispatch()
  const currentUser = useSelector(selectCurrentUser)
  const registrations = useSelector((state) => selectUserRegistrations(state, currentUser.id))

  // Upcoming: soonest first. Completed: most recent first.
  const upcoming = registrations.filter((event) => !isEventPast(event)).sort(byDate)
  const completed = registrations.filter((event) => isEventPast(event)).sort(byDate).reverse()
  const shownEvents = tab === 'upcoming' ? upcoming : completed

  function handleCancel(event) {
    dispatch(cancelRegistration({ userId: currentUser.id, eventId: event.id }))
    setMessage(`Registration for "${event.name}" cancelled.`)
    setTimeout(() => setMessage(''), 3000)
  }

  return (
    <section className="page">
      <div className="page-header">
        <h1>My Events</h1>
        <p>
          {currentUser.name}, you have {registrations.length} registered{' '}
          {registrations.length === 1 ? 'event' : 'events'}.
        </p>
      </div>

      <div className="tabs" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'upcoming'}
          className={tab === 'upcoming' ? 'tab tab-active' : 'tab'}
          onClick={() => setTab('upcoming')}
        >
          Upcoming ({upcoming.length})
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'completed'}
          className={tab === 'completed' ? 'tab tab-active' : 'tab'}
          onClick={() => setTab('completed')}
        >
          Completed ({completed.length})
        </button>
      </div>

      {shownEvents.length === 0 ? (
        <div className="empty-state">
          <p>
            {tab === 'upcoming'
              ? "You haven't registered for any upcoming events yet."
              : 'No completed events yet.'}
          </p>
          {tab === 'upcoming' && (
            <Link to="/" className="btn btn-primary">
              Browse events
            </Link>
          )}
        </div>
      ) : (
        <div className="event-grid">
          {shownEvents.map((event) => (
            <EventCard key={event.id} event={event}>
              {tab === 'upcoming' ? (
                <CancelButton onConfirm={() => handleCancel(event)} />
              ) : (
                <span className="completed-label">✓ Completed</span>
              )}
            </EventCard>
          ))}
        </div>
      )}

      <Toast message={message} type="info" />
    </section>
  )
}

export default MyEvents
