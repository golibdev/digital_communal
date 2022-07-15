import React, { useState, useEffect, useRef } from 'react'
import { organizationApi } from '../../api/organizationApi'
import { servicesApi } from '../../api/servicesApi'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import Select from 'react-select'
import { Loader } from '../../components/Loader'
import { Editor } from "@tinymce/tinymce-react";

export const CreateService = ({ t }) => {
   const lng = localStorage.getItem('i18nextLng')
   const [loading, setLoading] = useState(false)
   const [name, setName] = useState('')
   const [ruName, setRuName] = useState('')
   const [price, setPrice] = useState('')
   const description = useRef(null)
   const ruDescription = useRef(null)
   const [image, setImage] = useState('')
   const [organization, setOrganization] = useState('')
   const [organizations, setOrganizations] = useState([])

   const getOrganizations = async () => {
      try {
         const res = await organizationApi.getAllNoPage()
         setOrganizations(res.data.organizations)
         setLoading(true)
      } catch (err) {}
   }

   useEffect(() => {
      getOrganizations()
   }, [])

   const options = organizations.map(item => ({
      value: item._id,
      label: lng == 'uz' ? item.name : item.ruName
   }))

   const handleSubmit = async (e) => {
      e.preventDefault()

      const check = {
         name: name.trim().length === 0,
         ruName: ruName.trim().length === 0,
         description: description.current?.getContent() ? description.current.getContent().trim().length === 0 : true,
         ruDescription: ruDescription.current?.getContent() ? ruDescription.current.getContent().trim().length === 0 : true,
         price: price.trim().length === 0,
         organization: organization.trim().length === 0
      }

      if(check.name || check.ruName || check.description || check.ruDescription 
            || check.price || check.organization
         ) {
            toast.warning(t('all_fields_are_required'))
            return
         }

      const params = new FormData()
      params.append('name', name)
      params.append('ruName', ruName)
      params.append('description', description)
      params.append('ruDescription', ruDescription)
      params.append('price', price)
      params.append('organization', organization)
      params.append('image', image)
      try {
         const res = await servicesApi.create(params)

         if(res.status === 201) {
            toast.success(t('services_created'))
            setName('')
            setRuName('')
            setPrice('')
            setImage('')
            setOrganization('')
         }
      } catch (err) {
         console.log(err.response.data);
         toast.error(t('services_not_created'))
      }
   }

   return (
      <div className='row'>
         {loading ? (
            <>
               <div className="col-12 mb-4">
                  <Link to='/admin/services' className='btn btn-primary'>
                     {t('back')}
                  </Link>
               </div>
               <form className='col-12' onSubmit={handleSubmit}>
                  <div className="row">
                     <div className="col-lg-8 order-lg-1 order-1">
                        <div className="card">
                           <div className="card-body pt-3">
                              <label htmlFor="description" className='pt-0 card-title'>
                                 {t('description')}
                              </label>
                              <Editor
                                 onInit={(e, editor) => description.current = editor}
                                 initialValue={description.current ? description.current.getContent() : ''}
                                 init={{
                                    height: 400,
                                    menubar: true,
                                    plugins: 'link image code media',
                                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                                    paste_data_images: true,
                                    file_browser_callback_types: 'image',
                                    file_picker_callback: function (cb, value, meta) {
                                       var input = document.createElement("input");
                                       input.setAttribute("type", "file");
                                       input.setAttribute("accept", "image/*");
                                       input.onchange = function () {
                                         var file = this.files[0];
                         
                                         var reader = new FileReader();
                                         reader.onload = function () {
                                           var id = "blobid" + new Date().getTime();
                                           var blobCache = description.current.editorUpload.blobCache;
                                           var base64 = reader.result.split(",")[1];
                                           var blobInfo = blobCache.create(id, file, base64);
                                           blobCache.add(blobInfo);
                                           cb(blobInfo.blobUri(), { title: file.name });
                                         };
                                         reader.readAsDataURL(file);
                                       };
                                       input.click();
                                     },
                                 }}
                                 id="description"
                              />
                           </div>
                        </div>
                     </div>
                     <div className="col-lg-4 order-lg-2 order-3">
                        <div className="card">
                           <div className="card-body pt-3">
                              <div className='form-floating mb-3'>
                                 <input type="text" id='name' placeholder={t('uzName')} className="form-control"
                                    value={name} onChange={e => setName(e.target.value)}
                                 />
                                 <label htmlFor="name">{t('uzName')}</label>
                              </div>
                              <div className='form-floating mb-3'>
                                 <input type="text" id='ruName' placeholder={t('rusName')} className="form-control" 
                                    value={ruName} onChange={e => setRuName(e.target.value)}
                                 />
                                 <label htmlFor="ruName">{t('rusName')}</label>
                              </div>
                              <div className='form-floating mb-3'>
                                 <input type="text" id='price' placeholder={t('price')} className="form-control" 
                                    value={price} onChange={e => setPrice(e.target.value)}
                                 />
                                 <label htmlFor="price">{t('price')}</label>
                              </div>
                              <div className='mb-3'>
                                 <label className='card-title pt-0 pb-0'>
                                    {t('organization')}
                                 </label>
                                 <Select 
                                    options={options}
                                    onChange={e => setOrganization(e.value)}
                                    isOptionSelected
                                    className='card-title pt-0 pb-0'
                                 />
                              </div>
                              <div className='mb-3'>
                                 <label htmlFor="image" className='card-title pb-0 pt-0'>
                                    {t('image')}
                                 </label>
                                 <input type="file" id='image' className='form-control' 
                                    onChange={e => setImage(e.target.files[0])}
                                 />
                              </div>
                              <button className='btn btn-primary'>
                                 {t('create')}
                              </button>
                           </div>
                        </div>
                     </div>
                     <div className="col-lg-8 order-lg-3 order-2">
                        <div className="card">
                           <div className="card-body pt-3">
                              <label htmlFor="ruDescription" className='pt-0 card-title'>
                                 {t('ruDescription')}
                              </label>
                              <Editor
                                 onInit={(e, editor) => ruDescription.current = editor}
                                 initialValue={ruDescription.current ? ruDescription.current.getContent() : ''}
                                 init={{
                                    height: 400,
                                    menubar: true,
                                    plugins: 'link image code media',
                                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                                    paste_data_images: true,
                                    file_browser_callback_types: 'image',
                                    file_picker_callback: function (cb, value, meta) {
                                       var input = document.createElement("input");
                                       input.setAttribute("type", "file");
                                       input.setAttribute("accept", "image/*");
                                       input.onchange = function () {
                                         var file = this.files[0];
                         
                                         var reader = new FileReader();
                                         reader.onload = function () {
                                           var id = "blobid" + new Date().getTime();
                                           var blobCache = ruDescription.current.editorUpload.blobCache;
                                           var base64 = reader.result.split(",")[1];
                                           var blobInfo = blobCache.create(id, file, base64);
                                           blobCache.add(blobInfo);
                                           cb(blobInfo.blobUri(), { title: file.name });
                                         };
                                         reader.readAsDataURL(file);
                                       };
                                       input.click();
                                     },
                                 }}
                                 id="ruDecription"
                              />
                           </div>
                        </div>
                     </div>
                  </div>
               </form>
            </>
         ): (
            <Loader/>
         )}
      </div>
   )
}
