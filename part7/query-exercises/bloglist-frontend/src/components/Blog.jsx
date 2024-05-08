import Togglable from '../components/Togglable'
import blogService from '../services/blogs'
import { useState, useEffect } from 'react'
import { updateBlog, deleteBlog } from '../requests'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useReducer, useContext } from 'react'
import NotificationContext from '../NotificationContext'
import { Link } from 'react-router-dom'

const Blog = ({ blog }) => {
  const [notification, notificationDispatch] = useContext(NotificationContext)

  const queryClient = useQueryClient()

  // if (!blog) {
  //   return <div>Blog not found! WERIRD</div>
  // }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const deleteBlogMutation = useMutation({
    mutationFn: blogService.deleteRecord,
    onSuccess: (deletedBlog) => {
      queryClient.setQueryData(['blogs'], (blogs) => {
        return blogs.filter((blog) => {
          blog.id !== deletedBlog.id
        })
      })
      queryClient.invalidateQueries('blogs')
    }
  })


  const DeleteButton = () => {
    const deleteBlog = (event) => {
      const deletedBlog = {
        ...blog,
        user: blog.user.id
      }
      event.preventDefault()
      if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
        console.log('delete blog!', blog.id)
        deleteBlogMutation.mutate(deletedBlog.id)
        notificationDispatch({ type: 'DELETEBLOG', payload: { blog } })
        setTimeout(() => {
          notificationDispatch({ type: 'BLANK' })
        }, 2000)
      }
    }
    return (
      <div><button onClick={deleteBlog}>remove</button></div>
    )
  }

  const updateBlogMutation = useMutation({
    mutationFn: updateBlog,
    onSuccess: (updatedBlog) => {
      queryClient.setQueryData(['blogs'], (blogs) => {
        return blogs.map((blog) =>
          blog.id === updatedBlog.id ? updatedBlog : blog
        )
      })
      notificationDispatch({ type: 'ADDLIKE', payload: { updatedBlog } })
      setTimeout(() => {
        notificationDispatch({ type: 'BLANK' })
      }, 2000)
    }
  })

  const handleLikeClick = async () => {
    const updatedBlog = {
      ...blog,
      user: blog.user.id,
      likes: blog.likes + 1
    }
    updateBlogMutation.mutate(updatedBlog)
  }


  const BlogDetails = () => (
    <div className='blogDetails' data-testid='blog'>
      <div>{blog.url}</div>
      <p>
        likes: {blog.likes} <button onClick={handleLikeClick}>like</button>
      </p>
      <div>{blog.user.name}</div>
      <DeleteButton blog />
    </div>
  )
  console.log('Blog', blog.id)
  return (
    <div style={blogStyle} className='blog' title='blog'>
      <Link to={`blogs/${blog.id}`}>
        <span className='blogTitle'>{blog.title}</span> <span className='blogAuthor'>{blog.author}</span>
      </Link>
      {/* <Togglable buttonLabel="View" hideButton="hide" buttonTop="true">
        <BlogDetails />
      </Togglable> */}
    </div>
  )}

export default Blog