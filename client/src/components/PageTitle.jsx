import React from 'react'
import { Link } from 'react-router-dom'

export const PageTitle = ({ title, t }) => {
   return (
      <div className="pagetitle mb-0 mt-3">
         <h1 className='mb-0 pb-0'>{t(title)}</h1>
         <nav className='mb-0 pb-0'>
            <ol className="breadcrumb">
               <li className="breadcrumb-item">
                  <Link to="/admin">{t('dashboard')}</Link>
               </li>
               <li className="breadcrumb-item active">{t(title)}</li>
            </ol>
         </nav>
      </div>
   )
}