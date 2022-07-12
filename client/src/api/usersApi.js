import axios from "axios";
import baseUrl from "../constants/baseUrl";
const token = localStorage.getItem("token");

const headers = {
   headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
   }
}

export const userApi = {
   getAll: () => axios.get(
      `${baseUrl}/person`,
      headers
   ),
   getSearch: (search) => axios.get(
      `${baseUrl}/person/search?search=${search}`,
      headers
   ),
   getAllPagination: (page) => axios.get(
      `${baseUrl}/person?page=${page}`,
      headers
   ),
   getById: (id) => axios.get(
      `${baseUrl}/person/${id}`,
      headers
   ),
   update: (id, data) => axios.put(
      `${baseUrl}/person/${id}`,
      data,
      headers
   ),
   login: (data) => axios.post(
      `${baseUrl}/person/login`,
      data
   ),
   register: (data) => axios.post(
      `${baseUrl}/person/register`,
      data
   )
}