import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import FormInput from '../components/FormInput.jsx'
import {
  registerUser,
  clearAuthError,
  selectCurrentUser,
  selectAuthError,
} from '../features/auth/authSlice.js'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(values) {
  const errors = {}

  if (values.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters.'
  }
  if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = 'Enter a valid email address.'
  }
  if (values.password.length < 6) {
    errors.password = 'Password must be at least 6 characters.'
  }
  if (values.confirmPassword !== values.password) {
    errors.confirmPassword = 'Passwords do not match.'
  }

  return errors
}

function Register() {
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState({})

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const currentUser = useSelector(selectCurrentUser)
  const authError = useSelector(selectAuthError)

  // Once the user is logged in (right after registering), go to the events page.
  useEffect(() => {
    if (currentUser) {
      navigate('/', { replace: true })
    }
  }, [currentUser, navigate])

  // Clear any old error message when this page opens.
  useEffect(() => {
    dispatch(clearAuthError())
  }, [dispatch])

  function handleChange(event) {
    const { name, value } = event.target
    setValues({ ...values, [name]: value })
  }

  function handleSubmit(event) {
    event.preventDefault()

    const formErrors = validate(values)
    setErrors(formErrors)

    if (Object.keys(formErrors).length === 0) {
      dispatch(
        registerUser({
          name: values.name,
          email: values.email,
          password: values.password,
        }),
      )
    }
  }

  return (
    <section className="page auth-page">
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <h1>Create an account</h1>

        {authError && <p className="form-error">{authError}</p>}

        <FormInput
          label="Name"
          name="name"
          value={values.name}
          onChange={handleChange}
          error={errors.name}
          placeholder="Your full name"
        />
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
          placeholder="At least 6 characters"
        />
        <FormInput
          label="Confirm password"
          name="confirmPassword"
          type="password"
          value={values.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
        />

        <button type="submit" className="btn btn-primary">
          Register
        </button>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </form>
    </section>
  )
}

export default Register
