import { createContext, useReducer } from "react";

const notificationReducer = (state, action) => {
  switch (action.type) {
  case 'LOGIN':
    return {
      message: `Logged in with ${action.payload.user.username}`,
      alert: false
    }
  case 'ADDBLOG':
    return {
      message: `Added blog: ${action.payload.newBlog.title}`,
      alert: false
    }
  case 'ADDLIKE':
    return {
      message: `Liked blog: ${action.payload.updatedBlog.title}`,
      alert: false
    }
  case 'DELETEBLOG':
    return {
      message: `Deleted Blog: ${action.payload.blog.title}`,
      alert: true
    }
  case 'VOTEBLOG':
    return {
      message: `Like added to ${action.payload.blog.title}`,
      alert: false
    }
  case 'INCORRECTLOGIN':
    return {
      message: 'Wrong username or password!',
      alert: true
    }
  case 'BLANK':
    if (!action.payload || action.payload.clear) {
      return {
        message: null,
        alert: false,
      }
    }
    return state
  default:
    return state
  }
}

const NotificationContext = createContext()

export const NotificationContextProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(notificationReducer, { message: null, alert: false })
  return (
    <NotificationContext.Provider value={[notification, notificationDispatch] }>
      {props.children}
    </NotificationContext.Provider>
  )
}

export default NotificationContext