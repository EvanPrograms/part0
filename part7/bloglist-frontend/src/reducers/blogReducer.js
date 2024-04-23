const blogReducer = (state = [], action) => {
  switch (action.type) {
    case 'NEW_BLOG':
      return [...state, action.payload]
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

export default blogReducer