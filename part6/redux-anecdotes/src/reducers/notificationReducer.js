import { createSlice } from '@reduxjs/toolkit'

const initialState = ''

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotification(state, action) {
      console.log('set notification action reducer', action.payload)
      const { message, duration } = action.payload
      return { message, duration }
    },
    removeNotification(state, action) {
      return {
        message: '',
        duration: 0
      }
    }
  }
})

export const { setNotification, removeNotification } = notificationSlice.actions

export const setNotificationAutoRemove = (message, duration) => {
  return dispatch => {
    dispatch(setNotification( { message, duration }))
    setTimeout(() => {
      dispatch(removeNotification())
    }, duration)
  }
}

export default notificationSlice.reducer