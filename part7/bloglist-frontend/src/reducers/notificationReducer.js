const notificationReducer = (state = { message: null, alert: false }, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        message: `Logged in as ${action.payload.user.username}`,
        alert: false,
      }
    case 'FAILEDLOGIN':
      return {
        message: "WRONG USERNAME OR PASSWORD",
        alert: true,
      }  
    case 'ADDBLOG':
      return {
        message: `Added the blog: ${action.payload.blog.title}`,
        alert: false,
      }
    case 'BLANK':
      if (!action.payload || action.payload.clear) {
        return {
          message: null,
          alert: false,
        }
      }
    default:
      return state
  }
}


export default notificationReducer