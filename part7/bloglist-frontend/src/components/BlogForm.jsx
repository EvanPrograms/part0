import { createBlog } from "../reducers/blogReducer";
import { useDispatch, useSelector } from "react-redux";
import blogService from "../services/blogs";
import React from 'react'

const BlogForm = ({ createNewBlog }, ref) => {
  const dispatch = useDispatch()
  const user = useSelector(state => state.user.user)

  const addBlog = async (event) => {
    event.preventDefault();
    const title = event.target.Title.value
    const author = event.target.Author.value
    const url = event.target.URL.value
    event.target.Title.value = ''
    event.target.Author.value = ''
    event.target.URL.value = ''
    const blogObject = {
      url: url,
      title: title,
      author: author,
      user: {
        username: user.username,
        name: user.name
      },
      likes: 0
    }

    const returnedBlog = await blogService.create(blogObject)
    const newBlog = {
      ...blogObject,
      id: returnedBlog.id
    }

    createNewBlog(newBlog);
    dispatch(createBlog(newBlog))

    dispatch({ type: 'ADDBLOG', payload: { blog: returnedBlog } })
      setTimeout(() => {
        dispatch({ type: 'BLANK', payload: { clear: true } })
      }, 2000);
  };

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <div>
          title:
          <input
            type="text"
            name="Title"
            id="title-input"
            data-testid="title"
          />
        </div>
        <div>
          author:
          <input
            type="text"
            name="Author"
            id="author-input"
            data-testid="author"
          />
        </div>
        <div>
          url:
          <input
            type="text"
            name="URL"
            id="url-input"
            data-testid="url"
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default React.forwardRef(BlogForm);
