import Togglable from "../components/Togglable";
import blogService from "../services/blogs";
import { useState, useEffect } from "react";

const Blog = ({ blog, updateBlog, deleteTheBlog }) => {

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };


  const DeleteButton = () => {
    const deleteBlog = (event) => {
      event.preventDefault();
      if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`))
        console.log("delete blog!", blog.id);
      deleteTheBlog(blog.id);
    };
    return (
      <div>
        <button onClick={deleteBlog}>remove</button>
      </div>
    );
  };

  const handleLikeClick = () => {
    const updatedBlog = {
      user: blog.user.id,
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
    };
    updateBlog(blog.id, updatedBlog);
  };

  const BlogDetails = () => (
    <div className="blogDetails" data-testid="blog">
      <div>{blog.url}</div>
      <p>
        likes: {blog.likes} <button onClick={handleLikeClick}>like</button>
      </p>
      <div>{blog.user.name}</div>
      <DeleteButton blog />
    </div>
  );

  return (
    <div style={blogStyle} className="blog" title="blog">
      <span className="blogTitle">{blog.title}</span>{" "}
      <span className="blogAuthor">{blog.author}</span>
      <Togglable buttonLabel="View" hideButton="hide" buttonTop="true">
        <BlogDetails />
      </Togglable>
    </div>
  );
};

export default Blog;
