import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import Toast from './Toast.jsx'
import CancelButton from './CancelButton.jsx'
import { selectCurrentUser } from '../features/auth/authSlice.js'
import {
  registerForEvent,
  cancelRegistration,
  selectIsRegistered,
} from '../features/registrations/registrationsSlice.js'
import { isEventPast } from '../utils/formatDate.js'

const TOAST_MS = 3000

function RegistrationButton({ event }) {
  const [toast, setToast] = useState(null)
  const timerRef = useRef(null)

  const dispatch = useDispatch()
  const location = useLocation()
  const currentUser = useSelector(selectCurrentUser)
  const isRegistered = useSelector((state) =>
    selectIsRegistered(state, currentUser?.id, event.id),
  )

  // Stop the toast timer if the user leaves the page.
  useEffect(() => {
    return () => clearTimeout(timerRef.current)
  }, [])

  function showToast(message, type) {
    setToast({ message, type })
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setToast(null), TOAST_MS)
  }

  function handleRegister() {
    if (isRegistered) {
      showToast('You are already registered for this event.', 'info')
      return
    }
    dispatch(registerForEvent({ userId: currentUser.id, event }))
    showToast(`You're registered for ${event.name}!`, 'success')
  }

  function handleCancel() {
    dispatch(cancelRegistration({ userId: currentUser.id, eventId: event.id }))
    showToast('Your registration has been cancelled.', 'info')
  }

  let content

  if (!currentUser) {
    content = (
      <Link to="/login" state={{ from: location }} className="btn btn-primary btn-block">
        Log in to register
      </Link>
    )
  } else if (isRegistered) {
    content = (
      <>
        <p className="registered-note">✓ You're registered for this event</p>
        <CancelButton onConfirm={handleCancel} />
      </>
    )
  } else if (isEventPast(event)) {
    content = (
      <button type="button" className="btn btn-primary btn-block" disabled>
        This event has ended
      </button>
    )
  } else if (event.status === 'cancelled' || event.status === 'canceled') {
    content = (
      <button type="button" className="btn btn-primary btn-block" disabled>
        Event cancelled
      </button>
    )
  } else {
    content = (
      <button type="button" className="btn btn-primary btn-block" onClick={handleRegister}>
        Register for this event
      </button>
    )
  }

  return (
    <div className="registration-box">
      {content}
      <Toast message={toast?.message} type={toast?.type} />
    </div>
  )
}

export default RegistrationButton
