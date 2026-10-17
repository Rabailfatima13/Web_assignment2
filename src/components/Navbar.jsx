import { Link, NavLink } from 'react-router-dom'

function Navbar() {
  return (
    <header className="navbar">
      <Link to="/" className="navbar-brand">
        EventHub
      </Link>

      <nav className="navbar-links">
        <NavLink to="/" end>
          Events
        </NavLink>
        <NavLink to="/my-events">My Events</NavLink>
        <NavLink to="/login">Login</NavLink>
        <NavLink to="/register">Register</NavLink>
      </nav>
    </header>
  )
}

export default Navbar
