import { useState } from 'react'

// City and date filters. They are only sent when the user clicks "Apply",
// so we don't call the API on every key press.
function Filters({ initialValues, onApply, onClear }) {
  const [city, setCity] = useState(initialValues.city)
  const [startDate, setStartDate] = useState(initialValues.startDate)
  const [endDate, setEndDate] = useState(initialValues.endDate)
  const [error, setError] = useState('')

  const today = new Date().toISOString().split('T')[0]

  function handleSubmit(event) {
    event.preventDefault()

    if (startDate && endDate && endDate < startDate) {
      setError('"To" date must be on or after the "From" date.')
      return
    }

    setError('')
    onApply({ city: city.trim(), startDate, endDate })
  }

  return (
    <form className="filters" onSubmit={handleSubmit} noValidate>
      <div className="filter-field">
        <label htmlFor="city">City</label>
        <input
          id="city"
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="e.g. London"
        />
      </div>

      <div className="filter-field">
        <label htmlFor="startDate">From</label>
        <input
          id="startDate"
          type="date"
          value={startDate}
          min={today}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </div>

      <div className="filter-field">
        <label htmlFor="endDate">To</label>
        <input
          id="endDate"
          type="date"
          value={endDate}
          min={startDate || today}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>

      <div className="filter-actions">
        <button type="submit" className="btn btn-primary">
          Apply filters
        </button>
        <button type="button" className="btn btn-outline" onClick={onClear}>
          Clear all
        </button>
      </div>

      {error && <p className="field-error filter-error">{error}</p>}
    </form>
  )
}

export default Filters
