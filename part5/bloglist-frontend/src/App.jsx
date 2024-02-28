import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

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
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }
  
  const createNewBlog = (event) => {
    event.preventDefault()
    console.log('CREATING A NEW BLOG', title, author, url, user.token)
    const blogObject = {
      title: title,
      author: author,
      url: url
    }

    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setAuthor('')
        setUrl('')
        setTitle('')
        blogService.getAll().then(blogs => setBlogs(blogs))
      })
  }

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

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
  
  const newBlog = () => {
    return (
      <div>
        <h2>create new</h2>
        <form onSubmit={createNewBlog}>
          <div>
            title:
              <input
                type="text"
                value={title}
                name="Title"
                onChange={({ target }) => setTitle(target.value)}
            />
          </div>
          <div>
            author:
              <input
                type="text"
                value={author}
                name="Author"
                onChange={({ target }) => setAuthor(target.value)}
            />
          </div>
                 <div>
            url:
              <input
                type="text"
                value={url}
                name="URL"
                onChange={({ target }) => setUrl(target.value)}
            />
          </div>
          <button type="submit">create</button>
        </form>

      </div>
    )
  }

  const blogList = () => {
    return (
    <div>
    <h2>blogs</h2>
    <p>
      {user.name} logged in <button onClick={logOut} type="submit">logout</button>
    </p>
    <div>{newBlog()}</div>
    {blogs
      .filter(blog => blog.user.username === user.username)
      .map(blog =>
      <Blog key={blog.id} blog={blog} />
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
      {user === null ? loginForm() : blogList()}
    </div>
  )
}

export default App