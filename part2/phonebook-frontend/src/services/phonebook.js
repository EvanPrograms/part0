import axios from 'axios'

const baseUrl = "/api/persons"

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const create = (nameObject) => {
    const request = axios.post(baseUrl, nameObject)
    return request.then(response => response.data)
}

const deleteRecord = (id) => {
    const request = axios.delete(`http://localhost:3001/api/persons/${id}`)
    return request.then(response => response.data)
}

const update = (id, nameObject) => {
    const request = axios.put(`http://localhost:3001/api/persons/${id}`, nameObject)
    return request.then(response => response.data)
}

export default { getAll, create, deleteRecord, update }
