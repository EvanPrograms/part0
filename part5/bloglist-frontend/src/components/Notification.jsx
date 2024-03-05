const Notification = ({ message, alert }) => {
  if (message === null) {
    return null
  }

  return (
    <div className='notification' style={{ color:alert ? 'red' : 'green' }}>
      {message}
    </div>
  )
}

export default Notification