import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useMediaQuery } from 'react-responsive'
import navLinkInfos from '../constants/navLinks'
import { logout } from '../handlers/auth'

export const Sidebar = ({ toggle, clickToggle, t }) => {
   const isMobile = useMediaQuery({ maxWidth: 1199 })
   const location = useLocation().pathname.split('/')[2]
   const navigate = useNavigate()

   return (
      <div className={toggle ? 'toggle-sidebar' : ''}>
         <aside id="sidebar" className="sidebar">

            <ul className="sidebar-nav" id="sidebar-nav">
               {navLinkInfos.map(item => (
                  <li className="nav-item" key={item.link}>
                     <Link className={
                        location === item.link.split('/')[2] ?
                           'nav-link bg-primary' : 'nav-link'
                     } to={item.link} onClick={isMobile && clickToggle}>
                        <i className={`${item.icon} me-2 ${location === item.link.split('/')[2] ? 'text-white' : ''}`}></i>
                        <span className={`card-title ${location === item.link.split('/')[2] ? 'text-white' : ''} pb-0 pt-0 mb-0`}>
                           {t(item.title)}
                        </span>
                     </Link>
                  </li>
               ))}
               <li className='nav-item'>
                  <a className='nav-link' onClick={() => {
                     logout(navigate)
                  }}
                     style={{ cursor: 'pointer' }}
                  >
                     <i className="fas fa-sign-out-alt me-2"></i>
                     <span className='card-title pb-0 pt-0 mb-0'>
                        {t('exit')}
                     </span>
                  </a>
               </li>
            </ul>

         </aside>
      </div>
   )
}