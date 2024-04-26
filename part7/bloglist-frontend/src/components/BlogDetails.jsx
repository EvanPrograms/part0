import DeleteButton from './DeleteButton';
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { likeBlogAction } from "../reducers/blogReducer";
import blogService from "../services/blogs";

const BlogDetails = ({ blog }) => {
  const dispatch = useDispatch();
  console.log('BlogDetails received blog:', blog);
  const user = useSelector(state => state.user)

  const handleLikeClick = async () => {
    if (!blog || !blog.id) {
      console.error('Blog or blog.id is undefined or null:', blog);
      return;
    }
    console.log('handleLikes', blog, blog.id)
    const updatedBlog = { ...blog, likes: blog.likes + 1, user: user._id };
    try {
      const response = await blogService.update(blog.id, updatedBlog);
      console.log('Update response:', response);
      dispatch(likeBlogAction(response));
    } catch (error) {
      console.error("Failed to update blog likes!!!:", error);
    }
  };

  return (
    <div className="blogDetails" data-testid="blog">
    <div>{blog.url}</div>
    <p>
      likes: {blog.likes} <button onClick={handleLikeClick}>like</button>
    </p>
    <div>{blog.user.name}</div>
    <DeleteButton blog={blog} /> 
  </div>
  );
};

export default BlogDetails;
