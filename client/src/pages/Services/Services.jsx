import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { servicesApi } from '../../api/servicesApi';
import { Loader } from '../../components/Loader';
import { PageTitle } from '../../components/PageTitle';
import { toast } from 'react-toastify'

export const Services = ({ t }) => {
   const [loading, setLoading] = useState(false);
   const [data, setData] = useState([]);
   const [currentPage, setCurrentPage] = useState(1);
   const [pageCount, setPageCount] = useState(0)
   const [search, setSearch] = useState('');

   const getServices = async () => {
      try {
         const res = await servicesApi.getAll()
         setData(res.data.services);
         setPageCount(Math.ceil(res.data.pagination.total / 10));
         setLoading(true);
      } catch (err) {}
   }

   const searchServices = async (e) => {
      e.preventDefault();
      try {
         const res = await servicesApi.getSearch(search)
         setData(res.data.services);
      } catch (err) {}
   }

   useEffect(() => {
      if (search === '') {
         getServices();
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
                           <PageTitle title={'services'} t={t} />
                           <Link to='/admin/services/create' className='btn btn-primary'>
                              {t('create')}
                           </Link>
                        </div>
                     </div>
                  </div>
               </div>
               <div className="col-12">
                  <div className="card">
                     <div className="card-header">
                        <form className='input-group' onSubmit={searchServices}>
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
                              <OrganizationList 
                                 data={data} 
                                 t={t} 
                                 currentPage={currentPage}
                                 getServices={getServices} 
                              />
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

const OrganizationList = ({ data, t, currentPage, getServices }) => {
   const deleteHandler = async (e, id) => {
      try {
         let confirm = window.confirm(t('isDelete'))
         if(confirm) {
            await servicesApi.delete(id)
            getServices()
            toast.success(t('delete'))
         }
      } catch (err) {}
   } 
   return (
      <div className='table-responsive'>
         <table className='table table-hover card-title text-center'>
            <thead>
               <tr>
                  <th>#</th>
                  <th>{t('image')}</th>
                  <th>{t('uzName')}</th>
                  <th>{t('rusName')}</th>
                  <th>{t('organization')}</th>
                  <th>{t('action')}</th>
               </tr>
            </thead>
            <tbody>
               {data.map((item, index) => (
                  <tr key={item.id}>
                     <td>
                        {currentPage * 10 - 10 + index + 1}
                     </td>
                     <td>
                        <div style={{ width: '50px' }} className="bg-dark rounded-circle">
                           <img src={item.image} alt={item.name} style={{ width: '100%' }} />
                        </div>
                     </td>
                     <td>{item.name}</td>
                     <td>{item.ruName}</td>
                     <td>{item.organization.name}</td>
                     <td>
                        <div className='d-flex align-items-center justify-content-center'>
                           <Link className='btn btn-primary me-3' to={`/admin/organization/update/${item._id}`}>
                              <i className='fas fa-pen'></i>
                           </Link>
                           <button className='btn btn-danger' onClick={e => {
                              deleteHandler(e, item._id)
                           }}>
                              <i className='fas fa-trash'></i>
                           </button>
                        </div>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
   )
}