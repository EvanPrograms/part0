import { useSelector, useDispatch } from "react-redux";
import Blog from "./Blog";
import BlogForm from "./BlogForm";
import Togglable from "./Togglable";
import { logout } from "../reducers/userReducer";
import { useRef } from "react";

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

  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility();
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
          />
        ))}
    </div>
  );
}

  export default BlogList