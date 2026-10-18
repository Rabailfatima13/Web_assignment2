import { useState } from 'react'

// Asks "Are you sure?" before cancelling, so a registration is not removed by accident.
function CancelButton({ onConfirm, label = 'Cancel registration' }) {
  const [confirming, setConfirming] = useState(false)

  if (!confirming) {
    return (
      <button type="button" className="btn btn-danger-outline" onClick={() => setConfirming(true)}>
        {label}
      </button>
    )
  }

  return (
    <div className="confirm-box">
      <span>Cancel this registration?</span>
      <div className="confirm-actions">
        <button type="button" className="btn btn-danger" onClick={onConfirm}>
          Yes, cancel
        </button>
        <button type="button" className="btn btn-outline" onClick={() => setConfirming(false)}>
          Keep it
        </button>
      </div>
    </div>
  )
}

export default CancelButton
