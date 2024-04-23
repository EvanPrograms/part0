import { createBlog } from "../reducers/blogReducer";
import { useDispatch, useSelector } from "react-redux";

const BlogForm = ({ createNewBlog }) => {

  const dispatch = useDispatch()
  const user = useSelector(state => state.user.user)

  const addBlog = (event) => {
    event.preventDefault();
    console.log('add blog event', event.target.title)
    console.log('add blog', user)
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
    dispatch(createBlog(newBlog))

    createNewBlog({
      title: title,
      author: author,
      url: url,
    });
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
