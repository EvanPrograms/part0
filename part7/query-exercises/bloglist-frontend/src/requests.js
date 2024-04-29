import axios from 'axios'

const baseUrl = 'http://localhost:5173/api/blogs'

let token = null

export const getBlogs = () => {
  return axios.get(baseUrl).then(response => response.data)
}

export const createBlog = async (newBlog, token) => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.post(baseUrl, newBlog, config).then(response => response.data)
  return response.data
}

// const create = async newObject => {
//   const config = {
//     headers: { Authorization: token },
//   }

//   const response = await axios.post(baseUrl, newObject, config)
//   return response.data
// }