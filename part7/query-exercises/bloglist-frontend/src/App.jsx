import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useReducer, useContext } from 'react'
import NotificationContext from './NotificationContext'
import { getBlogs, createBlog, getUsers } from './requests'
import UserContext from './UserContext'
import LoginForm from './components/LoginForm'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from 'react-router-dom'


const App = () => {
  const blogFormRef = useRef()
  const [notification, notificationDispatch] = useContext(NotificationContext)

  const [user, userDispatch] = useContext(UserContext)

  const { isLoading, data: blogs } = useQuery({
    queryKey: ['blogs'],
    queryFn: getBlogs,
    refetchOnWindowFocus: false
  });

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      userDispatch({ type: 'LOGIN', payload: user })
      blogService.setToken(user.token)
    }
  }, [userDispatch])

  if (isLoading) {
    return <div>loading data...</div>;
  }


  // const LoginForm = () => {
  //   const [username, setUsername] = useState('')
  //   const [password, setPassword] = useState('')

  //   const handleLogin = async (event) => {
  //     event.preventDefault()
  //     console.log('logging in with ', username, password)

  //     try {
  //       const user = await loginService.login({
  //         username, password,
  //       })
  //       window.localStorage.setItem(
  //         'loggedBlogappUser', JSON.stringify(user)
  //       )

  //       blogService.setToken(user.token)
  //       console.log('THIS IS USER TOKEN', user.token)
  //       userDispatch({ type: 'LOGIN', payload: user })
  //       setUsername('')
  //       setPassword('')
  //       notificationDispatch({ type: 'LOGIN', payload: { user } })
  //       setTimeout(() => {
  //         notificationDispatch({ type: 'BLANK' })
  //       }, 2000)
  //     } catch (exception) {
  //       notificationDispatch({ type: 'INCORRECTLOGIN' })
  //       setTimeout(() => {
  //         notificationDispatch({ type: 'BLANK' })
  //       }, 2000)
  //     }
  //   }

  //   const handleChangeUsername = (event) => {
  //     setUsername(event.target.value);
  //   };

  //   const handleChangePassword = (event) => {
  //     setPassword(event.target.value);
  //   }

  //   return (
  //     <div>
  //       <h2>Log in to application</h2>
  //       <form onSubmit={handleLogin}>
  //         <div>
  //           username
  //           <input
  //             type="text"
  //             value={username}
  //             name="Username"
  //             data-testid='username'
  //             onChange={handleChangeUsername}
  //             autoComplete="username"
  //           />
  //         </div>
  //         <div>
  //           password
  //           <input
  //             type="password"
  //             value={password}
  //             name="Password"
  //             data-testid='password'
  //             onChange={handleChangePassword}
  //             autoComplete="current-password"
  //           />
  //         </div>
  //         <button type="submit">login</button>
  //       </form>
  //     </div>
  //   )
  // }

  const blogForm = () => (
    <Togglable buttonLabel="New Blog" ref={blogFormRef} hideButton="cancel" buttonTop="false">
      <BlogForm userToken={user.token}/>
    </Togglable>
  )

  const blogList = () => {
    const compareLikes = (b, a) => {
      return a.likes - b.likes
    }
    return (
      <div data-testid='parent'>
        <h2>blogs</h2>
        <p>
          {user.name} logged in <button onClick={logOut} type="submit">logout</button>
        </p>
        {blogForm()}
        {blogs
          .filter(blog => blog.user.username === user.username)
          .sort(compareLikes)
          .map(blog =>
            <Blog key={blog.id} blog={blog} />
          )}
      </div>
    )
  }

  const logOut = () => {
    userDispatch({ type: 'LOGOUT', payload: null })
    window.localStorage.clear()
  }

  const Home = () => {
    return (
      <div>
        <Notification message={notification.message} alert={notification.alert}/>
        {user ? blogList() : <LoginForm /> }
      </div>
    )
  }

  const Users = () => {
    const { data: users } = useQuery({
      queryKey: ['users'],
      queryFn: getUsers,
      refetchOnWindowFocus: false
    });

    console.log(users)

    return (
      <div>
        <h2>blogs</h2>
        <div>
          {user
            ? (
              <span>
                {user.name} logged in <br/>
                <p><button onClick={logOut}>logout</button></p>
              </span>
            )
            : 'No user'}
        </div>
        <h2>Users</h2>
        <div>
          <span style={{ marginLeft: '120px', fontWeight: 'bold' }}>Blogs created:</span>
          {users
            ? users
              .map((user) => (
                <li key={user.id}>{user.username}
                  <span
                    style={{
                      position: 'absolute',
                      left: '130px', // Adjust this value to position the blog count 100 pixels from the left
                      textAlign: 'center'
                    }}>
                    {user.blogs.length}
                  </span>
                </li>
              ))
            : 'Loading data...'
          }
        </div>
      </div>
    )
  }


  return (
    <Router>
      <Routes>
        <Route path="/users" element={<Users />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  )
}

export default App