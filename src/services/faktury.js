import axios from 'axios'
const baseUrl = 'http://localhost:3001/faktury'

const create = newDocument => {
    const request = axios.post(baseUrl, newDocument)
    return request.then(response => response.data)
  }
  const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
  }
  export default {create, getAll}
