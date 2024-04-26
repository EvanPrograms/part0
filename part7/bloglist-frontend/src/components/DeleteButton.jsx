import { useDispatch } from 'react-redux';
import { deleteBlogAction } from '../reducers/blogReducer';
import blogService from '../services/blogs'

const DeleteButton = ({ blog }) => {
  const dispatch = useDispatch();

  const handleDeleteBlog = () => {
    const confirmed = window.confirm(`Remove blog ${blog.title} by ${blog.author}?`);
    if (confirmed) {
      console.log('Deleting blog:', blog.id);
      
      blogService.deleteRecord(blog.id)
      .then(() => {
        console.log('Blog deleted successfully:', blog.id);
        dispatch(deleteBlogAction(blog.id));
      })
      .catch((error) => {
        console.error('Error deleting blog:', error);
      });
    }
  };

  return (
    <div>
      <button onClick={handleDeleteBlog}>remove</button>
    </div>
  );
};

export default DeleteButton;