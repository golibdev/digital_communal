import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Flag from 'react-world-flags'

export const Header = ({clickToggle, changeLanguage, t}) => {
   return (
      <header id="header" className="header fixed-top d-flex align-items-center bg-primary">

         <div className="d-flex align-items-center justify-content-between">
            <Link to="/admin" className="logo d-flex align-items-center">
               <span className="text-white">
                  Digital Communal
               </span>
            </Link>
         </div>

         <nav className="header-nav ms-auto">
            <ul className="d-flex align-items-center">
               <li className="nav-item dropdown">
                  
                  <a className="nav-link nav-profile d-flex align-items-center" href="#" data-bs-toggle="dropdown">
                     <i className="fas fa-language text-white fs-2"></i>
                  </a>

                  <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile bg-primary">
                     <li>
                        <a className="nav-link nav-profile d-flex align-items-center pe-0" style={{ cursor: 'pointer' }} onClick={() => {
                           changeLanguage('uz')
                        }} data-bs-toggle="dropdown">
                           <Flag code={'uz'} style={{ width: '40px' }} />
                           <span className="ps-2 text-white">
                              uzbek
                           </span>
                        </a>
                     </li>
                     <li className="pb-2">
                        <a className="nav-link nav-profile d-flex align-items-center pe-0" style={{ cursor: 'pointer' }} onClick={() => {
                           changeLanguage('ru')
                        }} data-bs-toggle="dropdown">
                           <Flag code={'ru'} style={{ width: '40px' }} />
                           <span className="ps-2 text-white">
                              russian
                           </span>
                        </a>
                     </li>
                  </ul>
               </li>
               <li className='nav-item'>
                  <a href="#"className='nav-link' onClick={clickToggle}>
                     <i className="fas fa-bars toggle-sidebar-btn text-primary text-white d-lg-none" style={{ fontSize: '25px' }} ></i>
                  </a>
               </li>
            </ul>
         </nav>

      </header>
   )
}