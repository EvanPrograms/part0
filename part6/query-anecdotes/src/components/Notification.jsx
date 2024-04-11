import { useContext } from 'react'
import CounterContext from '../CounterContext'



const Notification = () => {
  const [message, messageDispatch] = useContext(CounterContext)
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 5
  }
  
  if (!message) return null

  return (
    <div style={style}>
      {message}
    </div>
  )
}

export default Notification
