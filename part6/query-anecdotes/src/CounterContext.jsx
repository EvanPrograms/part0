import { createContext, useReducer } from 'react'

const messageReducer = (state, action) => {
  switch (action.type) {
    case "VOTE":
      return `You voted for "${action.payload.content}"`
    case "CREATION":
      return `You created a new anecdote "${action.payload.content}"`
    case "RESET":
      return state = ''
    default:
      return state
  }
}

const CounterContext = createContext()

const initialMessage = ''

export const CounterContextProvider = (props) => {
  const [message, messageDispatch] = useReducer(messageReducer, initialMessage)
  
  return (
    <CounterContext.Provider value={[message, messageDispatch] }>
      {props.children}
    </CounterContext.Provider>
  )
}

export default CounterContext