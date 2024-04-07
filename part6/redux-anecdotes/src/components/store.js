import anecdoteReducer from '.././reducers/anecdoteReducer'
import filterReducer from '.././reducers/filterReducer'
import notificationReducer from '../reducers/notificationReducer'
// import { createStore, combineReducers } from 'redux'
import { configureStore } from '@reduxjs/toolkit'

// const reducer = combineReducers({
//   anecdotes: anecdoteReducer,
//   filter: filterReducer
// })

const store = configureStore({
  reducer: {
    anecdotes: anecdoteReducer,
    filter: filterReducer,
    notification: notificationReducer
  }
})

export default store