import { useEffect, useRef } from "react";
import Blog from "./components/Blog";
import BlogForm from "./components/BlogForm";
import Togglable from "./components/Togglable";
import Notification from "./components/Notification";
import blogService from "./services/blogs";
import loginService from "./services/login";
import { useDispatch, useSelector } from 'react-redux'
import { createBlog, deleteBlogAction } from './reducers/blogReducer'
import { login, logout } from './reducers/userReducer'
import BlogList from "./components/BlogList"

const App = () => {
  const dispatch = useDispatch()
  const notification = useSelector(state => state.notifications)
  const blogs = useSelector(state => state.blogs)

  const blogFormRef = useRef();

  const user = useSelector(state => state.user.user)

  const handleLogin = async (event) => {
    event.preventDefault();
    const username = event.target.Username.value
    const password = event.target.Password.value
    console.log("logging in with ", username, password);

    try {
      const user = await loginService.login({
        username,
        password,
      });
      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));

      blogService.setToken(user.token);
      console.log('handlelogin user object user.username', user.username)
      console.log("THIS IS USER TOKEN", user.token);
      dispatch(login(user))
      dispatch({ type: 'LOGIN', payload: { user: user } })
      setTimeout(() => {
        dispatch({ type: 'BLANK' })
      }, 2000);
    } catch (exception) {
      dispatch({ type: 'FAILEDLOGIN' })
      setTimeout(() => {
        dispatch({ type: 'BLANK', payload: { clear: true } })
      }, 2000);
    }
  };

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility();

    blogService.create(blogObject).then((returnedBlog) => {
      dispatch(createBlog(returnedBlog));
      dispatch({ type: 'ADDBLOG', payload: { blog: returnedBlog } })
      setTimeout(() => {
        dispatch({ type: 'BLANK', payload: { clear: true } })
      }, 2000);
    });
  };

  const deleteBlog = (blogObject) => {
    blogService.deleteRecord(blogObject)
      .then((returnedBlog) => {
        console.log('Response from delete operation:', returnedBlog);
        if (returnedBlog) {
          dispatch(deleteBlogAction(returnedBlog));
        } else {
          console.error('Unexpected response from delete operation:', returnedBlog);
        }
      })
      .catch((error) => {
        console.error('Error while deleting blog:', error);
      });
  };

  const updateBlog = async (id, updatedBlog) => {
    try {
      const res = await blogService.update(id, updatedBlog);
      setBlogs(blogs.map((blog) => (blog.id === res.id ? res : blog)));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    blogService.getAll().then((blogs) => {
      blogs.forEach(blog => dispatch(createBlog(blog)))
    });
  }, [dispatch]);

  useEffect(() => {
    console.log('ACTION DISPATCHED USEEFFECT')
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      dispatch(login(user))
      blogService.setToken(user.token);
      dispatch({ type: 'BLANK', payload: { clear: true } })
    }
  }, [dispatch]);

  const loginForm = () => (
    <div>
      <h2>Log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            type="text"
            name="Username"
            data-testid="username"
          />
        </div>
        <div>
          password
          <input
            type="password"
            name="Password"
            data-testid="password"
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  );

  const blogForm = () => (
    <Togglable
      buttonLabel="New Blog"
      ref={blogFormRef}
      hideButton="cancel"
      buttonTop="false"
    >
      <BlogForm createNewBlog={addBlog} />
    </Togglable>
  );

  const logOut = () => {
    dispatch(logout());
    window.localStorage.clear();
  };

  // const blogList = () => {
  //   const compareLikes = (b, a) => {
  //     return a.likes - b.likes;
  //   };
  //   console.log("this is blogs", blogs);
  //   return (
  //     <div data-testid="parent">
  //       <h2>blogs</h2>
  //       <p>
  //         {user.name} logged in{" "}
  //         <button onClick={logOut} type="submit">
  //           logout
  //         </button>
  //       </p>
  //       {blogForm()}
  //       {blogs
  //         .filter((blog) => blog.user.username === user.username)
  //         .sort(compareLikes)
  //         .map((blog) => (
  //           <Blog
  //             key={blog.id}
  //             blog={blog}
  //             updateBlog={updateBlog}
  //             deleteTheBlog={deleteBlog}
  //           />
  //         ))}
  //     </div>
  //   );
  // };

  

  return (
    <div>
      <Notification message={notification.message} alert={notification.alert} />
      {user === null ? loginForm() : <BlogList />}
    </div>
  );
};

export default App;