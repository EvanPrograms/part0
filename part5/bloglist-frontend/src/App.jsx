import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const blogFormRef = useRef()
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState({
    message: null,
    alert: false
  })

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
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage({
        message: 'Wrong username or password',
        alert: true
      })
      setTimeout(() => {
        setErrorMessage({
          message: null,
          alert: false
        })
      }, 5000)
    }
  }

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()

    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        console.log(returnedBlog)
        console.log(blogs)
        setErrorMessage({
          message: `a blog ${blogObject.title} by ${blogObject.author} added`,
          alert: false
        })
        setTimeout(() => {
          setErrorMessage({
            message: null,
            alert: false
          })
        }, 5000)
      })
  }

  const deleteBlog = (blogObject) => {
    blogService
      .deleteRecord(blogObject)
      .then(returnedBlog => {
        const blogsAfterDelete = blogs.filter(blog => blog.id !== blogObject)
        setBlogs(blogsAfterDelete)
      })
  }

  const updateBlog = async (blogId, updatedBlog) => {
    blogService
      .update(blogId, updatedBlog)
  }

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [blogs.length])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)

    }
  }, [])

  const loginForm = () => (
    <div>
      <h2>Log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )

  const blogForm = () => (
    <Togglable buttonLabel="New Blog" ref={blogFormRef} hideButton="cancel" buttonTop="false">
      <BlogForm createNewBlog={addBlog}/>
    </Togglable>
  )

  const blogList = () => {
    const compareLikes = (b, a) => {
      return a.likes - b.likes
    }

    return (
      <div>
        <h2>blogs</h2>
        <p>
          {user.name} logged in <button onClick={logOut} type="submit">logout</button>
        </p>
        {blogForm()}
        {blogs
          .filter(blog => blog.user.username === user.username)
          .sort(compareLikes)
          .map(blog =>
            <Blog key={blog.id} blog={blog} updateBlog={updateBlog} deleteTheBlog={deleteBlog}/>
          )}
      </div>
    )
  }

  const logOut = () => {
    setUser(null)
    window.localStorage.clear()
  }


  return (
    <div>
      <Notification message={errorMessage.message} alert={errorMessage.alert}/>
      {user === null ? loginForm() : blogList()}
    </div>
  )
}

export default App