// "currentPage" starts at 0, like the Ticketmaster API.
// We show it to the user starting at 1.
function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) {
    return null
  }

  const isFirst = currentPage === 0
  const isLast = currentPage >= totalPages - 1

  return (
    <div className="pagination">
      <button
        type="button"
        className="btn btn-outline"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={isFirst}
      >
        ← Previous
      </button>

      <span>
        Page {currentPage + 1} of {totalPages}
      </span>

      <button
        type="button"
        className="btn btn-outline"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={isLast}
      >
        Next →
      </button>
    </div>
  )
}

export default Pagination
