import { useSelector, useDispatch } from "react-redux";
import Blog from "./Blog";
import BlogForm from "./BlogForm";
import Togglable from "./Togglable";
import { logout } from "../reducers/userReducer";
import { useRef } from "react";
import blogService from "../services/blogs";
import { createBlog, deleteBlogAction } from '../reducers/blogReducer'

const BlogList = () => {
  const blogs = useSelector(state => state.blogs)
  console.log("BlogList rendered. Blogs:", blogs)

  const user = useSelector(state => state.user.user)
  const dispatch = useDispatch()

  const blogFormRef = useRef();

  const logOut = () => {
    dispatch(logout());
    window.localStorage.clear();
  };

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

  const compareLikes = (b, a) => {
    return a.likes - b.likes;
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

  const updateBlog = async (id, updatedBlog) => {
    try {
      const res = await blogService.update(id, updatedBlog);
      setBlogs(blogs.map((blog) => (blog.id === res.id ? res : blog)));
    } catch (error) {
      console.error(error);
    }
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

  return (
    <div data-testid="parent">
      <h2>blogs</h2>
      <p>
        {user.name} logged in{" "}
        <button onClick={logOut} type="submit">
          logout
        </button>
      </p>
      {blogForm()}
      {blogs
        .filter((blog) => blog.user.username === user.username)
        .sort(compareLikes)
        .map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            updateBlog={updateBlog}
            deleteTheBlog={deleteBlog}
          />
        ))}
    </div>
  );
}

  export default BlogList