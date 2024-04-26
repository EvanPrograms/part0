const userReducer = (state = { user: null }, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {...state, user: action.payload.user}
    case 'LOGOUT':
      return {...state, user: null}
    default:
      return state
  }
}

export const login = (user) => {
  return {
    type: 'LOGIN',
    payload: {
      user
    }
  }
}

export const logout = () => {
  return { type: 'LOGOUT' }
}

export default userReducer