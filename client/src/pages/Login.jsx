import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { adminApi } from '../api/adminApi'
import { isAuthenticated } from '../handlers/auth'
import { toast, ToastContainer } from 'react-toastify'

export const Login = ({ t }) => {
   const navigate = useNavigate()
   const [username, setUserName] = useState('')
   const [password, setPassword] = useState('')
   const lng = localStorage.getItem('i18nextLng')

   useEffect(() => {
      const redirectAdminPanel = () => {
         const token = localStorage.getItem('token')
         const isAuth = isAuthenticated(token)

         if (isAuth) return navigate('/admin')
      }

      redirectAdminPanel()
   }, [])

   const loginHandler = async (e) => {
      e.preventDefault()

      const check = {
         username: username.trim().length === 0,
         password: password.trim().length === 0
      }

      if (check.username || check.password) {
         toast.error(t('all_fields_are_required'))
         return
      }

      const params = {
         username: username,
         password: password
      }
      try {
         const res = await adminApi.login(params)

         if(lng == 'uz') {
            toast.success(res.data.uzMessage)
         } else {
            toast.success(res.data.ruMessage)
         }

         localStorage.setItem('token', res.data.token)
         localStorage.setItem('fullName', res.data.admin.fullName)
         localStorage.setItem('id', res.data.admin._id)

         setTimeout(() => {
            window.location.reload()
         }, 2000)
      } catch (err) {
         if(lng == 'uz') {
            toast.error(err.response.data.uzMessage)
         } else {
            toast.error(err.response.data.ruMessage)
         }
      }
   }

   return (
      <div className='d-flex align-items-center justify-content-center' id='login-container'>
         <div className="container">
            <div className="row">
               <div className="col-lg-4 offset-lg-4 col-md-6 offset-md-3 col-sm-10 offset-sm-1 col-12">
                  <form onSubmit={loginHandler} className='card border-top border-5 border-primary'>
                     <div className="card-header text-center">
                        <h1 className='fw-bold text-primary'>Digital Communal</h1>
                     </div>
                     <div className="card-body mt-3">
                        <div className='form-floating mb-3'>
                           <input type="text" className='form-control' id='username' placeholder='username' value={username} onChange={e => setUserName(e.target.value)} />
                           <label htmlFor="username">Username</label>
                        </div>
                        <div className='form-floating'>
                           <input type="text" className='form-control' id='password' placeholder='Password' value={password} onChange={e => setPassword(e.target.value)} />
                           <label htmlFor="password">Password</label>
                        </div>
                     </div>
                     <div className="card-footer">
                        <button type='submit' className='btn btn-primary btn-block d-block w-100'>Login</button>
                     </div>
                  </form>
               </div>
            </div>
         </div>
         <ToastContainer />
      </div>
   )
}
