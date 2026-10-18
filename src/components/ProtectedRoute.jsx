import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'
import { selectCurrentUser } from '../features/auth/authSlice.js'

// Wrap any page that needs a logged-in user.
// If nobody is logged in, send them to /login and remember where they wanted to go.
function ProtectedRoute({ children }) {
  const currentUser = useSelector(selectCurrentUser)
  const location = useLocation()

  if (!currentUser) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children
}

export default ProtectedRoute
