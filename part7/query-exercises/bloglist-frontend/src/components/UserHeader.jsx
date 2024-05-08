import { useContext } from 'react'
import UserContext from '../UserContext'
import { useNavigate } from 'react-router-dom'

const UserHeader = () => {
  const [userState, userDispatch] = useContext(UserContext)
  const navigate = useNavigate()

  const logOut = () => {
    // const navigate = useNavigate()
    userDispatch({ type: 'LOGOUT', payload: null })
    window.localStorage.clear()
    navigate('/')
  }

  return (
    <div>
      <h2>blogs</h2>
      <div>
        {userState
          ? (
            <span>
              {userState.name} logged in <br/>
              <p><button onClick={logOut}>logout</button></p>
            </span>
          )
          : 'No user'}
      </div>
    </div>
  )
}

export default UserHeader