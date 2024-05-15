import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const getBlog = async (id) => {
  const response = await axios.get(`${baseUrl}/${id}`)
  return response.data
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const createComment = async ({ blogId, newComment }) => {
  console.log('this is services blogid', blogId)
  console.log('this is services newComment', newComment)
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(`${baseUrl}/${blogId}/comments`, { comment: newComment }, config)
  return response.data
}

const update = async (id, newObject) => {
  const config = {
    headers: { Authorization: token }
  }

  try {
    const response = await axios.put(`${baseUrl}/${id}`, newObject, config)
    return response.data
  } catch (error) {
    console.log('PUT error, ', error)
  }
}

const deleteRecord = async (id) => {
  const config = {
    headers: { Authorization: token }
  }

  try {
    const response = await axios.delete(`${baseUrl}/${id}`, config)
    return response.data
  } catch (error) {
    console.log('DELETE error, ', error)
  }

}

export default { getAll, getBlog, create, createComment, setToken, update, deleteRecord }