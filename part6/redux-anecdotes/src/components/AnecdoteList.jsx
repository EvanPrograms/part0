import { useDispatch, useSelector } from "react-redux"
import { voteAdding } from "../reducers/anecdoteReducer"
import { setNotificationAutoRemove } from '../reducers/notificationReducer'

const AnecdoteList = () => {
  const dispatch = useDispatch()
  const anecdotes = useSelector(state => {
    if ( state.filter === 'ALL') {
      return state.anecdotes
    } else {
      return state.anecdotes.filter(anecdote => anecdote.content.includes(state.filter))
    }
    
  })

  const vote = (anecdote) => {
    console.log('vote', anecdote.id)
    dispatch(voteAdding(anecdote.id, anecdote.votes + 1))
    dispatch(setNotificationAutoRemove(
      `You voted for "${anecdote.content}"`,
      3000
    ))
  }

  return (
    <div>
      <h2>Anecdotes</h2>
      {[...anecdotes]
        .sort((b, a) => a.votes - b.votes)
        .map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnecdoteList