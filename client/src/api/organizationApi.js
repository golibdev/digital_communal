import axios from "axios"
import baseUrl from '../constants/baseUrl'
const token = localStorage.getItem('token')
const headers = {
   headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
   }
}

export const organizationApi = {
   getAll: () => axios.get(
      `${baseUrl}/organization`
   ),
   getAllNoPage: () => axios.get(
      `${baseUrl}/organization?no_page=true`
   ),
   getSearch: (search) => axios.get(
      `${baseUrl}/organization/search?search=${search}`
   ),
   getById: (id) => axios.get(
      `${baseUrl}/organization/${id}`
   ),
   create: (params) => axios.post(
      `${baseUrl}/organization`,
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