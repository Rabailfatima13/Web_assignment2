import { useDispatch, useSelector } from 'react-redux'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { logout, selectCurrentUser } from '../features/auth/authSlice.js'
import { selectUserRegistrations } from '../features/registrations/registrationsSlice.js'

function Navbar() {
  const currentUser = useSelector(selectCurrentUser)
  const registrations = useSelector((state) => selectUserRegistrations(state, currentUser?.id))
  const dispatch = useDispatch()
  const navigate = useNavigate()

  function handleLogout() {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <header className="navbar">
      <Link to="/" className="navbar-brand">
        EventHub
      </Link>

      <nav className="navbar-links">
        <NavLink to="/" end>
          Events
        </NavLink>

        {currentUser ? (
          <>
            <NavLink to="/my-events">
              My Events
              {registrations.length > 0 && (
                <span className="nav-count">{registrations.length}</span>
              )}
            </NavLink>
            <span className="navbar-user">Hi, {currentUser.name}</span>
            <button type="button" className="btn btn-outline" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/register">Register</NavLink>
          </>
        )}
      </nav>
    </header>
  )
}

export default Navbar
