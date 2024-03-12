import Togglable from '../components/Togglable'
import blogService from '../services/blogs'
import { useState, useEffect } from 'react'

const Blog = ({ blog, updateBlog, deleteTheBlog }) => {
  const [likes, setLikes] = useState(blog.likes)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const LikeButton = () => {
    const addLike = (event) => {
      const blogLikesPlus = likes + 1
      setLikes(blogLikesPlus)
      console.log('like added!', blog.id, blog.user.id, blog.likes + 1, blog.author, blog.title, blog.url)
      const addedLikeObject = {
        user: blog.user.id,
        likes: blogLikesPlus,
        author: blog.author,
        title: blog.title,
        url: blog.url
      }
      updateBlog(blog.id, addedLikeObject)
    }
    return (
      <span>
        <button onClick={addLike}>like</button>
      </span>
    )
  }

  const DeleteButton = () => {
    const deleteBlog = (event) => {
      event.preventDefault()
      if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`))
        console.log('delete blog!', blog.id)
      deleteTheBlog(blog.id)
    }
    return (
      <div><button onClick={deleteBlog}>remove</button></div>
    )
  }

  const BlogDetails = () => (
    <div className='blogDetails'>
      <div>{blog.url}</div>
      <div>likes {likes} <LikeButton /></div>
      <div>{blog.user.name}</div>
      <DeleteButton blog/>
    </div>
  )

  return (
    <div style={blogStyle} className='blog'>
      <span className='blogTitle'>{blog.title}</span> <span className='blogAuthor'>{blog.author}</span>
      <Togglable buttonLabel="View" hideButton="hide" buttonTop="true">
        <BlogDetails />
      </Togglable>
    </div>
  )}

export default Blog