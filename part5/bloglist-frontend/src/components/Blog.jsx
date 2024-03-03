import Togglable from '../components/Togglable'

const Blog = ({ blog }) => {
  const blogStyle = { 
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const BlogReveal = () => (
    <Togglable buttonLabel="View" hideButton="hide" buttonTop="true" >
      <div>{blog.url}</div>
      <div>likes {blog.likes} <button type="submit">like</button> </div>
      <div>{blog.user.name}</div>   
    </Togglable>
  )

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author} <BlogReveal />
    </div>  
)}

export default Blog