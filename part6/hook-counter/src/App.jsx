import { useReducer, useContext } from 'react'
import CounterContext from './CounterContext'
import { CounterContextProvider } from './CounterContext'
import Button from './components/Button'


const Display = () => {
  const [counter] = useContext(CounterContext)
  return <div>{counter}</div>
}

const App = () => {

  return (
    <div>
      <Display />
      <div>
        <Button type='INC' label='+' />
        <Button type='DEC' label='-' />
        <Button type='ZERO' label='0' />
      </div>
    </div>
  )
}

export default App