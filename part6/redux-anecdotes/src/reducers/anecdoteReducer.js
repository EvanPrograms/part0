import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    voteAdder(state, action) {
      const id = action.payload
      const anecdoteToVote = state.find(n => n.id === id)
      const changedAnecdote = {
        ...anecdoteToVote,
        votes: anecdoteToVote.votes += 1
      }
      state.map(anecdote =>
        anecdote.id !== id ? anecdote : changedAnecdote
      )
    },
    appendAnecote(state, action) {
      state.push(action.payload)
    },
    setAnecdotes(state, action) {
      return action.payload
    }
  } 
})

export const { 
  voteAdder, 
  appendAnecote,
  setAnecdotes }
  = anecdoteSlice.actions

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const createAnecdote = content => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(appendAnecote(newAnecdote))
  }
}

export default anecdoteSlice.reducer