import { useEffect, useRef, useState } from 'react'

const DEBOUNCE_MS = 500

// Waits until the user stops typing for half a second before searching.
// This keeps us under Ticketmaster's limit of 2 requests per second.
function SearchBar({ initialValue = '', onSearch }) {
  const [text, setText] = useState(initialValue)
  const timerRef = useRef(null)

  // Cancel a waiting search if the component is removed from the page.
  useEffect(() => {
    return () => clearTimeout(timerRef.current)
  }, [])

  function handleChange(event) {
    const value = event.target.value
    setText(value)

    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      onSearch(value.trim())
    }, DEBOUNCE_MS)
  }

  // Pressing Enter searches straight away.
  function handleSubmit(event) {
    event.preventDefault()
    clearTimeout(timerRef.current)
    onSearch(text.trim())
  }

  return (
    <form className="search-bar" onSubmit={handleSubmit} role="search">
      <input
        type="search"
        value={text}
        onChange={handleChange}
        placeholder="Search events, artists, teams..."
        aria-label="Search events"
      />
      <button type="submit" className="btn btn-primary">
        Search
      </button>
    </form>
  )
}

export default SearchBar
