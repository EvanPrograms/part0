import anecdoteReducer from '.././reducers/anecdoteReducer'
import filterReducer from '.././reducers/filterReducer'
// import { createStore, combineReducers } from 'redux'
import { configureStore } from '@reduxjs/toolkit'

// const reducer = combineReducers({
//   anecdotes: anecdoteReducer,
//   filter: filterReducer
// })

const store = configureStore({
  reducer: {
    anecdotes: anecdoteReducer,
    filter: filterReducer
  }
})

export default store