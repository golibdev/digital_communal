import React, { useEffect, useState } from 'react'
import { organizationApi } from '../../api/organizationApi'
import { toast } from 'react-toastify'
import { Link, useParams, useNavigate } from 'react-router-dom'

export const OrganizationUpdate = ({ t }) => {
   const [organization, setOrganization] = useState({})
   const [name, setName] = useState('')
   const [ruName, setRuName] = useState('')
   const [image, setImage] = useState('')
   const id = useParams().id
   const navigate = useNavigate()

   const getOne = async () => {
      try {
         const res = await organizationApi.getById(id)
         setOrganization(res.data.organization)
         setName(res.data.organization.name)
         setRuName(res.data.organization.ruName)
      } catch (err) {}
   }

   const handlerUpdate = async (e) => {
      e.preventDefault()
      const params = {
         name: name ? name : organization.name,
         ruName: ruName ? ruName : organization.ruName,
         image: image ? image : organization.image
      }
      try {
         const res = await organizationApi.update(id, params)
         toast.success(t('update'))

         navigate('/admin/organization')
      } catch (err) {
         console.log(err);
      }
   }

   useEffect(() => {
      getOne()
   }, [id])

   return (
      <div className='row'>
         <div className="col-12 mb-4">
            <Link to='/admin/organization' className='btn btn-primary'>
               {t('back')}
            </Link>
         </div>
         <div className="col-12">
            <form className='card pt-3' onSubmit={handlerUpdate}>
               <div className="card-body">
                  <label htmlFor="uzName" className='mb-3'>
                     {t('uzName')}
                  </label>
                  <div className='form-floating mb-3'>
                     <input type="text" className='form-control' id="uzName" placeholder={t('uzb')} 
                        value={name} onChange={(e) => setName(e.target.value)}
                     />
                     <label htmlFor='uzName'>{t('uzb')}</label>
                  </div>
                  <label htmlFor="ruName" className='mb-3'>
                     {t('rusName')}
                  </label>
                  <div className='form-floating mb-3'>
                     <input type="text" className='form-control' id="ruName" placeholder={t('rus')} 
                        value={ruName} onChange={(e) => setRuName(e.target.value)}
                     />
                     <label htmlFor='ruName'>{t('rus')}</label>
                  </div>
                  <div className='mb-3'>
                     <label htmlFor="image" className='mb-3'>
                        {t('image')}
                     </label>
                     <input type="file" className='form-control' 
                        onChange={(e) => setImage(e.target.files[0])}
                     />
                  </div>
               </div>
               <div className="card-footer">
                  <button className="btn btn-success">
                     {t('save')}
                  </button>
               </div>
            </form>
         </div>
      </div>
   )
}
