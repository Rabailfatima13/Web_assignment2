import { useParams } from 'react-router-dom'

function EventDetails() {
  const { id } = useParams()

  return (
    <section className="page">
      <h1>Event Details</h1>
      <p>Showing details for event: {id}</p>
    </section>
  )
}

export default EventDetails
