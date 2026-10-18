import { Link } from 'react-router-dom'
import { formatEventDate } from '../utils/formatDate.js'

// "children" lets a page add extra content under the card, such as a Cancel button.
// It sits outside the link, because a button cannot go inside a link.
function EventCard({ event, children }) {
  const location = [event.city, event.country].filter(Boolean).join(', ')

  return (
    <article className="event-card">
      <Link to={`/events/${event.id}`} className="event-card-link">
        <div className="event-card-image">
          {event.image ? (
            <img src={event.image} alt={event.name} loading="lazy" />
          ) : (
            <div className="image-placeholder">No image</div>
          )}
          <span className="badge">{event.category}</span>
        </div>

        <div className="event-card-body">
          <h3>{event.name}</h3>
          <p className="event-card-date">{formatEventDate(event.localDate, event.localTime)}</p>
          <p className="event-card-venue">{event.venueName}</p>
          {location && <p className="event-card-location">{location}</p>}
        </div>
      </Link>

      {children && <div className="event-card-footer">{children}</div>}
    </article>
  )
}

export default EventCard
