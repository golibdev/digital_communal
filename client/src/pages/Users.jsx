import { useEffect, useState } from 'react';
import { userApi } from '../api/usersApi';
import { Loader } from '../components/Loader';
import { PageTitle } from '../components/PageTitle';
import { UserPagination } from '../components/Paginations/UserPagination';

export const Users = ({ t }) => {
   const [loading, setLoading] = useState(false);
   const [data, setData] = useState([]);
   const [currentPage, setCurrentPage] = useState(1);
   const [pageCount, setPageCount] = useState(0)
   const [search, setSearch] = useState('');

   const getUsers = async () => {
      try {
         const res = await userApi.getAll()
         setData(res.data.people);
         setPageCount(Math.ceil(res.data.pagination.total / 10));
         setLoading(true);
      } catch (err) {}
   }

   const searchHandler = async (e) => {
      e.preventDefault();
      try {
         const res = await userApi.getSearch(search)
         setData(res.data.people);
      } catch (err) {}
   }

   useEffect(() => {
      if (search === '') {
         getUsers();
      }
   }, [search])
   return (
      <div>
         {loading ? (
            <div className='row'>
               <div className="col-12">
                  <div className='card'>
                     <div className="card-header pb-2">
                        <div className='d-flex align-items-center justify-content-between'>
                           <PageTitle title={'users'} t={t} />
                        </div>
                     </div>
                  </div>
               </div>
               <div className="col-12">
                  <div className="card">
                     <div className='card-header'>
                        <form onSubmit={searchHandler} className='input-group'>
                           <input 
                              type="text" 
                              className='form-control' 
                              placeholder={t('searchPlaceholder')}   
                              value={search}
                              onChange={(e) => setSearch(e.target.value)}
                           />
                           <button className='btn btn-primary'>
                              {t('search')}
                           </button>
                        </form>
                     </div>
                     {data.length > 0 ? (
                        <>
                           <div className="card-body">
                              <UsersList data={data} t={t} currentPage={currentPage} />
                              {pageCount > 1 && (
                                 <UserPagination pageCount={pageCount} setCurrentPage={setCurrentPage} setData={setData} currentPage={currentPage} />
                              )}
                           </div>
                        </>
                     ): (
                        <div className="card-body">
                           <h3 className='text-center mb-0 card-title pb-0'>
                              <i className="fa fa-info-circle me-3"></i>
                              {t('noData')}
                           </h3>
                        </div>
                     )}
                  </div>
               </div>
            </div>
         ): (
            <Loader/>
         )}
      </div>
   )
}

const UsersList = ({ data, t, currentPage }) => {
   return (
      <div className='table-responsive'>
         <table className='table table-hover text-center card-title fs-6'>
            <thead>
               <tr>
                  <th>#</th>
                  <th>{t('image')}</th>
                  <th>{t('fullName')}</th>
                  <th>{t('phone')}</th>
                  <th>{t('passportSerialAndNumber')}</th>
                  <th>{t('passportJSHSHIR')}</th>
                  <th>{t('address')}</th>
               </tr>
            </thead>
            <tbody>
               {data.map((user, index) => (
                  <tr key={index}>
                     <th>
                        {currentPage * 10 - 10 + index + 1}
                     </th>
                     <td>
                        <img src={`http://localhost:4000${user.image}`} className={'rounded-circle'} style={{ width: '40px' }} alt={user.fullName} />
                     </td>
                     <td>
                        {user.fullName}
                     </td>
                     <td>
                        {user.phoneNumber}
                     </td>
                     <td>
                        {user.passportSerialAndNumber}
                     </td>
                     <td>
                        {user.passportJSHSHIR}
                     </td>
                     <td>
                        {user.address}
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
   )
}