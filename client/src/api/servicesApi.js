import axios from "axios"
import baseUrl from '../constants/baseUrl'
const token = localStorage.getItem('token')
const headers = {
   headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
   }
}

export const servicesApi = {
   getAll: () => axios.get(
      `${baseUrl}/service`
   ),
   getAllPagination: (page) => axios.get(
      `${baseUrl}/service?page=${page}`
   ),
   getAllNoPage: () => axios.get(
      `${baseUrl}/service?no_page=true`
   ),
   getSearch: (search) => axios.get(
      `${baseUrl}/service/search?search=${search}`
   ),
   getById: (id) => axios.get(
      `${baseUrl}/service/${id}`
   ),
   create: (params) => axios.post(
      `${baseUrl}/service`,
      params,
      headers
   ),
   update: (id, params) => axios.put(
      `${baseUrl}/organization/${id}`,
      params,
      headers
   ),
   delete: (id) => axios.delete(
      `${baseUrl}/organization/${id}`,
      headers
   )
}