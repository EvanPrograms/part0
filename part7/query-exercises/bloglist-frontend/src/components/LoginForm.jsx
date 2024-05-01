import { useState, useContext } from 'react'
import loginService from '../services/login'
import blogService from '../services/blogs'
import UserContext from '../UserContext'
import NotificationContext from '../NotificationContext'


const LoginForm = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, userDispatch] = useContext(UserContext)
  const [notification, notificationDispatch] = useContext(NotificationContext)


  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('logging in with ', username, password)

    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      console.log('THIS IS USER TOKEN', user.token)
      userDispatch({ type: 'LOGIN', payload: user })
      setUsername('')
      setPassword('')
      notificationDispatch({ type: 'LOGIN', payload: { user } })
      setTimeout(() => {
        notificationDispatch({ type: 'BLANK' })
      }, 2000)
    } catch (exception) {
      notificationDispatch({ type: 'INCORRECTLOGIN' })
      setTimeout(() => {
        notificationDispatch({ type: 'BLANK' })
      }, 2000)
    }
  }

  const handleChangeUsername = (event) => {
    setUsername(event.target.value);
  };

  const handleChangePassword = (event) => {
    setPassword(event.target.value);
  }

  return (
    <div>
      <h2>Log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            type="text"
            value={username}
            name="Username"
            data-testid='username'
            onChange={handleChangeUsername}
            autoComplete="username"
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            name="Password"
            data-testid='password'
            onChange={handleChangePassword}
            autoComplete="current-password"
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

export default LoginForm