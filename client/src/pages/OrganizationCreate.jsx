import React, { useState } from 'react'
import { organizationApi } from '../api/organizationApi'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'

export const OrganizationCreate = ({ t }) => {
   const [name, setName] = useState('')
   const [ruName, setRuName] = useState('')
   const [image, setImage] = useState('')

   const handleSubmit = async (e) => {
      e.preventDefault()
      const check = {
         name: name.trim().length === 0,
         ruName: ruName.trim().length === 0
      }

      if (check.name || check.ruName) {
         toast.error(t('all_fields_are_required'))
         return
      }

      const params = new FormData()
      params.append('name', name)
      params.append('ruName', ruName)
      params.append('image', image)
      try {
         const res = await organizationApi.create(params)
         if (res.status === 201) {
            toast.success(t('organization_created'))
            setName('')
            setRuName('')
            setImage('')
         }
      } catch (err) {
         console.log(err.response.data);
         toast.error(t('organization_not_created'))
      }
   }
   return (
      <div className='row'>
         <div className="col-12 mb-4">
            <Link to='/admin/organization' className='btn btn-primary'>
               {t('back')}
            </Link>
         </div>
         <div className="col-12">
            <form className='card pt-3' onSubmit={handleSubmit}>
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
                  <button className="btn btn-primary">
                     {t('create')}
                  </button>
               </div>
            </form>
         </div>
      </div>
   )
}
