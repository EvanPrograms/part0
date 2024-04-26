import { useEffect } from "react";
import Notification from "./components/Notification";
import blogService from "./services/blogs";
import { useDispatch, useSelector } from 'react-redux'
import { createBlog } from './reducers/blogReducer'
import { login } from './reducers/userReducer'
import BlogList from "./components/BlogList"
import LoginForm from "./components/LoginForm";

const App = () => {
  const dispatch = useDispatch()
  const notification = useSelector(state => state.notifications)
  const user = useSelector(state => state.user.user)

  useEffect(() => {
    blogService.getAll()
    .then((blogs) => {
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

  return (
    <div>
      <Notification message={notification.message} alert={notification.alert} />
      {user === null ? <LoginForm /> : <BlogList />}
    </div>
  );
};

export default App;