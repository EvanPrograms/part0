import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useParams,
  useNavigate,
  Navigate
} from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { updateBlog, deleteBlog, commentBlog } from '../requests'
import UserHeader from './UserHeader'
import { useReducer, useContext } from 'react'
import NotificationContext from '../NotificationContext'
import { useState } from 'react'
import UserContext from '../UserContext'
import blogService from '../services/blogs'
import { useEffect } from 'react'


const BlogDetailed = ({ blogs, user }) => {
  const navigate = useNavigate()
  // const [user, userDispatch] = useContext(UserContext)
  const queryClient = useQueryClient()
  const [notification, notificationDispatch] = useContext(NotificationContext)

  // const { data: blogs } = useQuery({
  //   queryKey: ['blogs'],
  //   queryFn: getBlogs,
  //   refetchOnWindowFocus: false
  // });

  // console.log('This is blogs', blogs)
  // console.log('BLOG DETAILS', blogs)
  const id = useParams().id
  // const blogDetail = blogs.filter(blog => blog.id === id)[0]
  const blogDetail = blogs.find(blog => blog.id === id)
  console.log(blogDetail)

  // if (!blogDetail) {
  //   return <div>blog not found in blog details!</div>
  // }

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

  const commentBlogMutation = useMutation({
    mutationFn: blogService.createComment,
    onSuccess: async (data) => {
      await queryClient.invalidateQueries(['blogs']);
    }
  })

  const handleLikeClick = async () => {
    const updatedBlog = {
      ...blogDetail,
      user: blogDetail.user.id,
      likes: blogDetail.likes + 1
    }
    updateBlogMutation.mutate(updatedBlog)
  }

  const Comments = ({ blog }) => {
    const [comment, setComment] = useState('')

    const addComment = async (event) => {
      event.preventDefault()
      const token = user.token
      const blogId = blog.id
      const newComment = comment

      console.log('addComment: token', token)
      console.log('addComment: blogId', blogId)
      console.log('addComment: newComment', newComment)
      commentBlogMutation.mutate({ blogId, newComment })
      setComment('')
    }
    return (
      <div>
        <h3>comments</h3>
        <form onSubmit={addComment}>
          <input
            type="text"
            value={comment}
            name="Title"
            onChange={({ target }) => setComment(target.value)}
            id='comment-input'
            data-testid='comment'
          />
          <button type="submit">add comment</button>
        </form>
        <ul>
          {blog.comments.map((comment, index) => (
            <li key={index}>{comment}</li>
          ))}
        </ul>
      </div>
    )
  }

  // useEffect(() => {
  //   // Redirect to home after logout
  //   if (!user) {
  //     navigate('/')
  //   }
  // }, [user, navigate])

  return (
    <div>
      <UserHeader user={user}/>
      <h2>{blogDetail.title} by {blogDetail.author}</h2>
      <div>
        <a href={blogDetail.url}>{blogDetail.url}</a> <br />
        {blogDetail.likes} <button onClick={handleLikeClick}>like</button><br />
        {user && <p>added by {user.name}</p>}
      </div>
      <Comments blog={blogDetail}/>
    </div>
  )
}

export default BlogDetailed