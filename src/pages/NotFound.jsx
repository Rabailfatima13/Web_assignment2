import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <section className="page">
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link to="/">Go back to Events</Link>
    </section>
  )
}

export default NotFound
