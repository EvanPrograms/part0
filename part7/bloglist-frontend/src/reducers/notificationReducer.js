const notificationReducer = (state = { message: null, alert: false }, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        message: `Logged in as ${action.payload.username}`,
        alert: false,
      }
    case 'FAILEDLOGIN':
      return {
        message: "WRONG USERNAME OR PASSWORD",
        alert: true,
      }  
    case 'ADDBLOG':
      return {
        message: `Added the blog: ${action.payload.title}`,
        alert: false,
      }
    case 'BLANK':
      return {
        message: null,
        alert: false,
      }
    default:
      return state
  }
}

export default notificationReducer