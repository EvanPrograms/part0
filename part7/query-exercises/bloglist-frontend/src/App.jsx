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
import { getBlogs, createBlog, getUsers, getUser } from './requests'
import UserContext from './UserContext'
import LoginForm from './components/LoginForm'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useParams,
  useNavigate,
  Navigate
} from 'react-router-dom'
import BlogDetails from './components/Blog'
import { updateBlog, deleteBlog } from './requests'
import BlogDetailed from './components/BlogDetailed'
import UserHeader from './components/UserHeader'


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
    return <div>loading data!...</div>;
  }

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
        {/* <h2>blogs</h2>
        <p>
          {user.name} logged in <button onClick={logOut} type="submit">logout</button>
        </p> */}
        <UserHeader />
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
    // const navigate = useNavigate()
    userDispatch({ type: 'LOGOUT', payload: null })
    window.localStorage.clear()
    // navigate('/')
  }

  const Home = () => {
    return (
      <div>
        <Notification message={notification.message} alert={notification.alert}/>
        {user ? blogList() : <LoginForm /> }
      </div>
    )
  }

  // const UserHeader = () => {
  //   return (
  //     <div>
  //       <h2>blogs</h2>
  //       <div>
  //         {user
  //           ? (
  //             <span>
  //               {user.name} logged in <br/>
  //               <p><button onClick={logOut}>logout</button></p>
  //             </span>
  //           )
  //           : 'No user'}
  //       </div>
  //     </div>
  //   )
  // }

  const Users = () => {
    const { data: users } = useQuery({
      queryKey: ['users'],
      queryFn: getUsers,
      refetchOnWindowFocus: false
    });

    console.log('This is users', users)

    return (
      <div>
        <UserHeader user={user}/>
        <h2>Users</h2>
        <div>
          <span style={{ marginLeft: '120px', fontWeight: 'bold' }}>Blogs created:</span>
          {users
            ? users
              .map((user) => (
                <li key={user.id}><Link to={`/users/${user.id}`}>{user.username}</Link>
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

  const User = ({ blogs }) => {
    const id = useParams().id
    const { data: blogUser, isLoading } = useQuery({
      queryKey: ['blogUser', id],
      queryFn: () => getUser(id),
      refetchOnWindowFocus: false
    });

    if (isLoading) {
      return <div>Loading user...</div>
    }

    const userBlogs = blogs.filter(blog => blog.user.id === id)

    return (
      <div>
        <UserHeader user={user}/>
        <h2>{blogUser.username}</h2>
        <h3>added blogs</h3>
        <div>
          {userBlogs
            .map(blog => (
              <li key={blog.id}>
                {blog.title}
              </li>
            ))
          }
        </div>
      </div>
    )
  }

  // const BlogDetailed = ({ blog }) => {
  //   // const { data: blogs } = useQuery({
  //   //   queryKey: ['blogs'],
  //   //   queryFn: getBlogs,
  //   //   refetchOnWindowFocus: false
  //   // });

  //   // console.log('This is blogs', blogs)
  //   // console.log('BLOG DETAILS', blogs)
  //   const id = useParams().id
  //   // const blogDetail = blogs.filter(blog => blog.id === id)[0]
  //   const blogDetail = blogs.find(blog => blog.id === id)
  //   console.log(blogDetail)
  //   if (!blogDetail) {
  //     return <div>blog not found in blog details!</div>
  //   }

  //   const updateBlogMutation = useMutation({
  //     mutationFn: updateBlog,
  //     onSuccess: (updatedBlog) => {
  //       queryClient.setQueryData(['blogs'], (blogs) => {
  //         return blogs.map((blog) =>
  //           blog.id === updatedBlog.id ? updatedBlog : blog
  //         )
  //       })
  //       notificationDispatch({ type: 'ADDLIKE', payload: { updatedBlog } })
  //       setTimeout(() => {
  //         notificationDispatch({ type: 'BLANK' })
  //       }, 2000)
  //     }
  //   })

  //   const handleLikeClick = async () => {
  //     const updatedBlog = {
  //       ...blog,
  //       user: blog.user.id,
  //       likes: blog.likes + 1
  //     }
  //     updateBlogMutation.mutate(updatedBlog)
  //   }

  //   return (
  //     <div>
  //       <UserHeader />
  //       <h2>{blogDetail.title} by {blogDetail.author}</h2>
  //       <div>
  //         <a href={blogDetail.url}>{blogDetail.url}</a> <br />
  //         {blogDetail.likes} <button onClick={handleLikeClick}>like</button><br />
  //         added by {user.name}
  //       </div>
  //       {/* <BlogDetails /> */}
  //     </div>
  //   )
  // }

  return (
    <Router>
      <Routes>
        <Route path="/users" element={<Users />} />
        <Route path="/" element={<Home />} />
        <Route path="/users/:id" element={<User blogs={blogs} />} />
        <Route path="/blogs/:id" element={<BlogDetailed blogs={blogs} user={user}/>}/>
      </Routes>
    </Router>
  )
}

export default App