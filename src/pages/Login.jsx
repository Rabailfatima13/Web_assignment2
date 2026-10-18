import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import FormInput from '../components/FormInput.jsx'
import {
  loginUser,
  clearAuthError,
  selectCurrentUser,
  selectAuthError,
} from '../features/auth/authSlice.js'

function Login() {
  const [values, setValues] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const currentUser = useSelector(selectCurrentUser)
  const authError = useSelector(selectAuthError)

  // If the user was sent here from a protected page, go back there after logging in.
  const redirectTo = location.state?.from?.pathname || '/'

  useEffect(() => {
    if (currentUser) {
      navigate(redirectTo, { replace: true })
    }
  }, [currentUser, navigate, redirectTo])

  useEffect(() => {
    dispatch(clearAuthError())
  }, [dispatch])

  function handleChange(event) {
    const { name, value } = event.target
    setValues({ ...values, [name]: value })
  }

  function handleSubmit(event) {
    event.preventDefault()

    const formErrors = {}
    if (!values.email.trim()) {
      formErrors.email = 'Email is required.'
    }
    if (!values.password) {
      formErrors.password = 'Password is required.'
    }
    setErrors(formErrors)

    if (Object.keys(formErrors).length === 0) {
      dispatch(loginUser(values))
    }
  }

  return (
    <section className="page auth-page">
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <h1>Log in</h1>

        {location.state?.from && !authError && (
          <p className="form-info">Please log in to continue.</p>
        )}
        {authError && <p className="form-error">{authError}</p>}

        <FormInput
          label="Email"
          name="email"
          type="email"
          value={values.email}
          onChange={handleChange}
          error={errors.email}
          placeholder="you@example.com"
        />
        <FormInput
          label="Password"
          name="password"
          type="password"
          value={values.password}
          onChange={handleChange}
          error={errors.password}
        />

        <button type="submit" className="btn btn-primary">
          Log in
        </button>

        <p className="auth-switch">
          New here? <Link to="/register">Create an account</Link>
        </p>
      </form>
    </section>
  )
}

export default Login
