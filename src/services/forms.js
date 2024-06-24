import axios from 'axios'

const create = (url, newDocument) => {
    const request = axios.post(url, newDocument)
    return request.then(response => response.data)
  }
  const getAll = (url) => {
    const request = axios.get(url)
    return request.then(response => response.data)
  }
  
  const update = async (url, id, newObject) => {
    const request = axios.put(`${url}/${id}`, newObject)
    const response = await request
    return response.data
  }
  
  const remove = (url, id) => {
    const request = axios.delete(`${url}/${id}`);
    return request.then(response => response.data);
  }


  export default {create, getAll, update, remove}
