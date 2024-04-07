import { useDispatch, useSelector } from "react-redux"
import { voteAdder } from "../reducers/anecdoteReducer"
import { setNotification, removeNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
  const dispatch = useDispatch()
  const anecdotes = useSelector(state => {
    if ( state.filter === 'ALL') {
      return state.anecdotes
    } else {
      return state.anecdotes.filter(anecdote => anecdote.content.includes(state.filter))
    }
    
  })

  const vote = (id, content) => {
    console.log('vote', id)
    dispatch(voteAdder(id))
    dispatch(setNotification(`You voted for "${content}"`))

    setTimeout(() => {
      dispatch(removeNotification(''));
    }, 5000);
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
            <button onClick={() => vote(anecdote.id, anecdote.content)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnecdoteList