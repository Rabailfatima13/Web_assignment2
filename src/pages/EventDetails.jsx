import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import Loader from '../components/Loader.jsx'
import ErrorMessage from '../components/ErrorMessage.jsx'
import RegistrationButton from '../components/RegistrationButton.jsx'
import { formatEventDate } from '../utils/formatDate.js'
import {
  fetchEventById,
  selectSelectedEvent,
  selectSelectedStatus,
  selectSelectedError,
} from '../features/events/eventsSlice.js'

const STATUS_LABELS = {
  onsale: 'On sale',
  offsale: 'Off sale',
  cancelled: 'Cancelled',
  canceled: 'Cancelled',
  postponed: 'Postponed',
  rescheduled: 'Rescheduled',
}

function formatPrice(min, max, currency) {
  if (min === null) {
    return ''
  }
  const format = (value) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: currency || 'USD' }).format(value)

  return min === max || max === null ? format(min) : `${format(min)} – ${format(max)}`
}

function EventDetails() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const routerLocation = useLocation()

  const event = useSelector(selectSelectedEvent)
  const status = useSelector(selectSelectedStatus)
  const error = useSelector(selectSelectedError)

  // Load the event whenever the id in the URL changes.
  useEffect(() => {
    dispatch(fetchEventById(id))
  }, [dispatch, id])

  if (status === 'loading' || status === 'idle') {
    return <Loader message="Loading event details..." />
  }

  if (status === 'failed') {
    return (
      <section className="page">
        <ErrorMessage message={error} onRetry={() => dispatch(fetchEventById(id))} />
        <p className="back-link">
          <Link to="/">← Back to events</Link>
        </p>
      </section>
    )
  }

  if (!event) {
    return null
  }

  // If the user opened this page directly (no previous page in the app), "Back" goes home.
  function handleBack() {
    if (routerLocation.key === 'default') {
      navigate('/')
    } else {
      navigate(-1)
    }
  }

  const location = [event.address, event.city, event.state, event.country]
    .filter(Boolean)
    .join(', ')
  const price = formatPrice(event.priceMin, event.priceMax, event.currency)
  const statusLabel = STATUS_LABELS[event.status] || ''

  return (
    <section className="page event-details">
      <button type="button" className="back-button" onClick={handleBack}>
        ← Back
      </button>

      <div className="details-hero">
        {event.imageLarge ? (
          <img src={event.imageLarge} alt={event.name} />
        ) : (
          <div className="image-placeholder">No image available</div>
        )}
      </div>

      <div className="details-layout">
        <div className="details-main">
          <div className="details-tags">
            <span className="tag">{event.category}</span>
            {event.genre && <span className="tag tag-light">{event.genre}</span>}
            {statusLabel && (
              <span className={`tag tag-status tag-${event.status}`}>{statusLabel}</span>
            )}
          </div>

          <h1>{event.name}</h1>

          {event.info && (
            <div className="details-section">
              <h2>About this event</h2>
              <p>{event.info}</p>
            </div>
          )}

          {event.pleaseNote && (
            <div className="details-section">
              <h2>Please note</h2>
              <p>{event.pleaseNote}</p>
            </div>
          )}

          {event.seatmap && (
            <div className="details-section">
              <h2>Seat map</h2>
              <img className="seatmap" src={event.seatmap} alt={`Seat map for ${event.venueName}`} />
            </div>
          )}
        </div>

        <aside className="details-sidebar">
          <RegistrationButton event={event} />

          <dl className="details-facts">
            <div>
              <dt>Date &amp; time</dt>
              <dd>{formatEventDate(event.localDate, event.localTime)}</dd>
            </div>
            <div>
              <dt>Venue</dt>
              <dd>{event.venueName}</dd>
            </div>
            {location && (
              <div>
                <dt>Location</dt>
                <dd>{location}</dd>
              </div>
            )}
            {price && (
              <div>
                <dt>Price range</dt>
                <dd>{price}</dd>
              </div>
            )}
            {event.timezone && (
              <div>
                <dt>Time zone</dt>
                <dd>{event.timezone}</dd>
              </div>
            )}
          </dl>

          {event.url && (
            <a className="btn btn-outline btn-block" href={event.url} target="_blank" rel="noreferrer">
              View on Ticketmaster ↗
            </a>
          )}
        </aside>
      </div>
    </section>
  )
}

export default EventDetails
