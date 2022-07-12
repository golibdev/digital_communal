import axios from 'axios';
import baseUrl from '../constants/baseUrl'
const token = localStorage.getItem('token');

const headers = {
   headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
   }
}

export const adminApi = {
   login: (params) => axios.post(
      `${baseUrl}/admin/login`,
      params
   )
}