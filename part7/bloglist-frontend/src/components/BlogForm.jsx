import { createBlog } from "../reducers/blogReducer";
import { useDispatch, useSelector } from "react-redux";
import blogService from "../services/blogs";
import { useRef } from 'react'





const BlogForm = ({ createNewBlog }) => {


  const dispatch = useDispatch()
  const user = useSelector(state => state.user.user)

  // const addBlog = (blogObject) => {
  //   blogFormRef.current.toggleVisibility();

    // blogService.create(blogObject).then((returnedBlog) => {
    //   dispatch(createBlog(returnedBlog));
    //   dispatch({ type: 'ADDBLOG', payload: { blog: returnedBlog } })
    //   setTimeout(() => {
    //     dispatch({ type: 'BLANK', payload: { clear: true } })
    //   }, 2000);
    // });
  // };

  const addBlog = (event) => {
    event.preventDefault();
    const title = event.target.Title.value
    const author = event.target.Author.value
    const url = event.target.URL.value
    event.target.Title.value = ''
    event.target.Author.value = ''
    event.target.URL.value = ''
    const newBlog = {
      title: title,
      author: author,
      url: url,
      user: {
        username: user.username
      }
    }
    
    //HERE I HAVE WEIRD BEHIAVIOR< EITHER NEED BOTH OF THESE DISPATCHES
    // BUT THEN I GET WEIRD ACTIONS TO STATE. IF I REMOVE the DISPATCH,
    // THEN THE REDUX DOESNT UPDATE UNTIL I REFRESH
    createNewBlog(newBlog);
    dispatch(createBlog(newBlog))

    // createNewBlog({
    //   title: title,
    //   author: author,
    //   url: url,
    // });
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

export default BlogForm;
