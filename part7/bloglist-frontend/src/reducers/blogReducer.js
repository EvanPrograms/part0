const blogReducer = (state = [], action) => {
  switch (action.type) {
    case 'NEW_BLOG':
      return [...state, action.payload]
    case 'DELETE_BLOG':
      return state.filter(blog => blog.id !== action.payload)
    case 'LIKE_BLOG':
      return state.map(blog => 
        blog.id === action.payload.id ? {...blog, likes: action.payload.likes } : blog
      )
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

export const likeBlogAction = (blog) => {
  return {
    type: 'LIKE_BLOG',
    payload: blog
  }
}

export default blogReducer