const blogReducer = (state = [], action) => {
  switch (action.type) {
    case 'NEW_BLOG':
      return [...state, action.payload]
    case 'DELETE_BLOG':
      return state.filter(blog => blog.id !== action.payload.id)
    default:
      return state
  }
}

export const createBlog = (blog) => {
  return {
    type: 'NEW_BLOG',
    payload: blog
  }
}

export const deleteBlogAction = (blog) => {
  return {
    type: 'DELETE_BLOG',
    payload: blog
  }
}

export default blogReducer