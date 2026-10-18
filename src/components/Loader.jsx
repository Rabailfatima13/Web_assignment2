function Loader({ message = 'Loading...' }) {
  return (
    <div className="loader" role="status">
      <div className="spinner" />
      <p>{message}</p>
    </div>
  )
}

export default Loader
