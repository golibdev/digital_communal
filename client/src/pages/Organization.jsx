import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { organizationApi } from '../api/organizationApi';
import { Loader } from '../components/Loader';
import { PageTitle } from '../components/PageTitle';

export const Organization = ({ t }) => {
   const [loading, setLoading] = useState(false);
   const [data, setData] = useState([]);
   const [currentPage, setCurrentPage] = useState(1);
   const [pageCount, setPageCount] = useState(0)
   const [search, setSearch] = useState('');

   const getOrganization = async () => {
      try {
         const res = await organizationApi.getAll()
         setData(res.data.organizations);
         setPageCount(Math.ceil(res.data.pagination.total / 10));
         setLoading(true);
      } catch (err) {}
   }

   const searchOrganization = async (e) => {
      e.preventDefault();
      try {
         const res = await organizationApi.getSearch(search)
         setData(res.data.organizations);
      } catch (err) {}
   }

   useEffect(() => {
      if (search === '') {
         getOrganization();
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
                           <PageTitle title={'organization'} t={t} />
                           <Link to='/admin/organization/create' className='btn btn-primary'>
                              {t('create')}
                           </Link>
                        </div>
                     </div>
                  </div>
               </div>
               <div className="col-12">
                  <div className="card">
                     <div className="card-header">
                        <form className='input-group' onSubmit={searchOrganization}>
                           <input 
                              type="text" 
                              className='form-control'
                              placeholder={t('searchName')} 
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
                              <OrganizationList data={data} t={t} currentPage={currentPage} />
                           </div>
                        </>
                     ) : (
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

const OrganizationList = ({ data, t, currentPage }) => {
   return (
      <div className='table-responsive'>
         <table className='table table-hover card-title text-center'>
            <thead>
               <tr>
                  <th>#</th>
                  <th>{t('image')}</th>
                  <th>{t('uzName')}</th>
                  <th>{t('rusName')}</th>
                  <th>{t('countService')}</th>
                  <th>{t('action')}</th>
               </tr>
            </thead>
            <tbody>
               {data.map((item, index) => (
                  <tr key={item.id}>
                     <td>
                        {currentPage * 10 - 10 + index + 1}
                     </td>
                     <td className='d-flex align-items-center justify-content-center'>
                        <div style={{ width: '50px' }} className="bg-dark rounded-circle">
                           <img src={item.image} alt={item.name} style={{ width: '100%' }} />
                        </div>
                     </td>
                     <td>{item.name}</td>
                     <td>{item.ruName}</td>
                     <td>{item.services.length}</td>
                     <td className='d-flex align-items-center justify-content-center'>
                        <button className='btn btn-primary me-3'>
                           <i className='fas fa-pen'></i>
                        </button>
                        <button className='btn btn-danger'>
                           <i className='fas fa-trash'></i>
                        </button>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
   )
}