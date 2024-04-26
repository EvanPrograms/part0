import { useDispatch, useSelector } from "react-redux";
import loginService from "../services/login";
import { login } from "../reducers/userReducer";
import { useEffect } from "react";
import blogService from "../services/blogs";
import { createBlog, deleteBlogAction } from '../reducers/blogReducer'

const LoginForm = () => {
  const dispatch = useDispatch()

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

  return (
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
}

export default LoginForm