import React, {useEffect, useState} from 'react'
import {Outlet, useNavigate} from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { Header } from "../components/Header"
import { Sidebar } from "../components/Sidebar"
import { isAuthenticated } from "../handlers/auth"

export const AppLayout = ({ t, changeLanguage }) => {
   const navigate = useNavigate()
   const [toggle, setToggle] = useState(false)

   useEffect(() => {
      const redirectAdminPanel = () => {
         const token = localStorage.getItem('token');
         const isAuth = isAuthenticated(token)
         if (!isAuth) return navigate('/')
      }
      redirectAdminPanel()
   }, [])

   const clickToggle = () => {
      setToggle(!toggle)
   }

   return (
      <>
         <Header clickToggle={clickToggle} changeLanguage={changeLanguage} t={t} />
         <Sidebar toggle={toggle} clickToggle={clickToggle} t={t} />
         <main id='main' className='main' style={{ marginLef: toggle && '0' }}>
            <Outlet/>
            <ToastContainer/> 
         </main>
      </>
   )
}