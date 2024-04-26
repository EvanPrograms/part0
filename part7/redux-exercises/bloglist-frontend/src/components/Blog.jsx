import React from "react";
import Togglable from "./Togglable";
import BlogDetails from "./BlogDetails";

const Blog = ({ blog }) => {

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  return (
    <div style={blogStyle}>
      <div>
        <span className="blogTitle">{blog.title}</span>{" "}
        <span className="blogAuthor">{blog.author}</span>
      </div>
      <Togglable buttonLabel="View" hideButton="Hide">
        <BlogDetails blog={blog} />
      </Togglable>
    </div>
  );
};

export default Blog;
