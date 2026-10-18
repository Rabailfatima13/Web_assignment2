import { Link } from 'react-router-dom'
import { formatEventDate } from '../utils/formatDate.js'

function EventCard({ event }) {
  const location = [event.city, event.country].filter(Boolean).join(', ')

  return (
    <Link to={`/events/${event.id}`} className="event-card">
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
  )
}

export default EventCard
