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
import { updateBlog, deleteBlog } from '../requests'
import UserHeader from './UserHeader'
import { useReducer, useContext } from 'react'
import NotificationContext from '../NotificationContext'

const BlogDetailed = ({ blogs, user }) => {
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

  const handleLikeClick = async () => {
    const updatedBlog = {
      ...blogDetail,
      user: blogDetail.user.id,
      likes: blogDetail.likes + 1
    }
    updateBlogMutation.mutate(updatedBlog)
  }

  return (
    <div>
      <UserHeader user={user}/>
      <h2>{blogDetail.title} by {blogDetail.author}</h2>
      <div>
        <a href={blogDetail.url}>{blogDetail.url}</a> <br />
        {blogDetail.likes} <button onClick={handleLikeClick}>like</button><br />
        added by {user.name}
      </div>
      {/* <BlogDetails /> */}
    </div>
  )
}

export default BlogDetailed