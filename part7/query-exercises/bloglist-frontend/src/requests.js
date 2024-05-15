import axios from 'axios'

// const baseUrl = 'http://localhost:5173/api/blogs'
const baseUrl = 'http://localhost:5173/api'


let token = null

export const getBlogs = () => {
  return axios.get(`${baseUrl}/blogs`).then(response => response.data)
}

export const createBlog = async (newBlog, token) => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.post(`${baseUrl}/blogs`, newBlog, config)
  return response.data
}

export const updateBlog = async (updatedBlog) => {
  const response = await axios.put(`${baseUrl}/blogs/${updatedBlog.id}`, updatedBlog)
  return response.data
}

export const commentBlog = async (blogId, comment, token) => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.post(`${baseUrl}/blogs/${blogId}/comments`, { comment: comment }, config)
  return response.data
}

export const deleteBlog = async (deletedBlog, token) => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.delete(`${baseUrl}/blogs/${deletedBlog.id}`, deletedBlog, config)
  return response.data
}

export const getUsers = async () => {
  return await axios.get(`${baseUrl}/users`).then(response => response.data)
}

export const getUser = async (id) => {
  return await axios.get(`${baseUrl}/users/${id}`).then(response => response.data)

}

// const create = async newObject => {
//   const config = {
//     headers: { Authorization: token },
//   }

//   const response = await axios.post(baseUrl, newObject, config)
//   return response.data
// }