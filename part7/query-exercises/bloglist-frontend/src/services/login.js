import axios from 'axios'
// const baseUrl = '/api/login'
const baseUrl = '/api'


const login = async credentials => {
  const response = await axios.post(`${baseUrl}/login`, credentials)
  return response.data
}

const getAll = async () => {
  const response = await axios.get(`${baseUrl}/users`)
  return response
}

export default { getAll, login }