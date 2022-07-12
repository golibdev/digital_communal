const { Service, Organization } = require('../models')
const path = require('path')
const fs = require('fs')
const slugify = require('slugify')

exports.getAll = async (req, res) => {
   try {

      if(req.query.no_page) {
         const services = await Service
            .find({})
            .populate('organization')
            .sort({ createdAt: -1 })
         
         return res.status(200).json({services})
      }

      const page = parseInt(req.query.page) || 1
      const limit = 10
      const skipIndex = (page - 1) * limit

      const services = await Service.find()
         .skip(skipIndex)
         .limit(limit)
         .populate('organization')
         .sort({ createdAt: -1 })

      if(!services) {
         return res.status(404).json({
            ruMessage: 'Нет услуг',
            uzMessage: 'Xizmat topilmadi'
         })
      }

      const total = await Service.countDocuments()

      res.status(200).json({
         services,
         pagination: {
            total,
            page,
            limit,
            next: `/api/v1/service?page=${page + 1}`
         }
      })

   } catch (err) {
      res.status(500).json({ message: err.message })
   }
}

exports.getOne = async (req, res) => {
   try {
      const id = req.params.id

      const service = await Service.findById(id)
         .populate('organization')

      if(!service) {
         return res.status(404).json({
            ruMessage: 'Услуга не найдена',
            uzMessage: 'Xizmat topilmadi'
         })
      }

      res.status(200).json({ service })
   } catch (err) {
      res.status(500).json({ message: err.message })
   }
}

exports.getOneBySlug = async (req, res) => {
   try {
      const slug = req.params.slug

      const service = await Service.findOne({ ruSlug: slug }) || await Service.findOne({ uzSlug: slug })

      if(!service) {
         return res.status(404).json({
            ruMessage: 'Услуга не найдена',
            uzMessage: 'Xizmat topilmadi'
         })
      }

      res.status(200).json({ service })
   } catch (err) {
      res.status(500).json({ message: err.message })
   }
}

exports.create = async (req, res) => {
   try {
      if(!req.files) {
         return res.status(400).json({
            ruMessage: 'Нет файла',
            uzMessage: 'Fayl topilmadi'
         })
      }

      const image = req.files.image

      if(!image.mimetype.startsWith('image')) {
         return res.status(400).json({
            ruMessage: 'Неправильный формат файла',
            uzMessage: 'Faqat rasm bo`lishi kerak'
         }) 
      }

      if(image.size > process.env.MAX_FILE_SIZE) {
         return res.status(400).json({
            ruMessage: 'Файл слишком большой',
            uzMessage: 'Fayl xajmi judayam katta'
         })
      }

      const {
         name,
         ruName,
         price,
         description,
         ruDescription,
         organization
      } = req.body

      const existingService = await Service.findOne({ 
         name,
         ruName
      })

      if(existingService) {
         return res.status(400).json({
            ruMessage: 'Услуга уже существует',
            uzMessage: 'Xizmat mavjud'
         })
      }

      const existingOrganization = await Organization.findById(organization)

      if(!existingOrganization) {
         return res.status(400).json({
            ruMessage: 'Организация не найдена',
            uzMessage: 'Organizatsiya topilmadi'
         })
      }

      const ruSlug = slugify(title, {
         replacement: '-',
         remove: /[$*_+~.()'"!\-:@]/g,
         lower: true
      })

      const uzSlug = slugify(title, {
         replacement: '-',
         remove: /[$*_+~.()'"!\-:@]/g,
         lower: true
      })

      image.name = `image_${Date.now()}${path.parse(image.name).ext}`

      image.mv(`public/uploads/service/${image.name}`, async (err) => {
         if(err) {
            return res.status(500).json({ message: err.message })
         }
      })

      const host = req.get('host')

      const service = await Service.create({
         name,
         ruName,
         price,
         description,
         ruDescription,
         image: `${req.protocol}://${host}/uploads/service/${image.name}`,
         organization,
         ruSlug,
         uzSlug
      })

      await Organization.findByIdAndUpdate(organization, {
         $push: { services: service._id }
      })

      res.status(201).json({
         ruMessage: 'Услуга создана',
         uzMessage: 'Xizmat yaratildi',
         service
      })
   } catch (err) {
      res.status(500).json({ message: err.message })
   }
}

exports.update = async (req, res) => {
   try {
      const id = req.params.id

      const service = await Service.findById(id)

      if(!service) {
         return res.status(404).json({
            ruMessage: 'Услуга не найдена',
            uzMessage: 'Xizmat topilmadi'
         })
      }

      if(req.files) {
         const image = req.files.image

         const oldImagePath = service.image.split('/uploads/service/')[1]
         fs.unlinkSync(`public/uploads/service/${oldImagePath}`)

         if(!image.mimetype.startsWith('image')) {
            return res.status(400).json({
               ruMessage: 'Неправильный формат файла',
               uzMessage: 'Faqat rasm bo`lishi kerak'
            }) 
         }

         if(image.size > process.env.MAX_FILE_SIZE) {
            return res.status(400).json({
               ruMessage: 'Файл слишком большой',
               uzMessage: 'Fayl xajmi judayam katta'
            })
         }

         image.name = `image_${Date.now()}${path.parse(image.name).ext}`

         image.mv(`public/uploads/service/${image.name}`, async (err) => {
            if(err) {
               return res.status(500).json({ message: err.message })
            }
         })

         const host = req.get('host')

         await Service.findByIdAndUpdate(id, {
            image: `${req.protocol}://${host}/uploads/service/${image.name}`
         })
      }

      if(req.body.organization) {
         const organization = await Organization.findById(req.body.organization)

         if(!organization) {
            return res.status(400).json({
               ruMessage: 'Организация не найдена',
               uzMessage: 'Organizatsiya topilmadi'
            })
         }

         await Organization.findByIdAndUpdate(service.organization, {
            $pull: { services: service._id }
         })

         await Organization.findByIdAndUpdate(req.body.organization, {
            $push: { services: service._id }
         })

         await Service.findByIdAndUpdate(id, {
            organization: req.body.organization
         })
      }

      if(req.body.name || req.body.ruName || req.body.price || req.body.description) {
         const existingService = await Service.findOne({
            name: req.body.name,
            ruName: req.body.ruName
         })

         if(existingService) {
            return res.status(400).json({
               ruMessage: 'Услуга уже существует',
               uzMessage: 'Xizmat mavjud'
            })
         }

         const ruSlug = slugify(req.body.ruName, {
            replacement: '-',
            remove: /[$*_+~.()'"!\-:@]/g,
            lower: true
         })

         const uzSlug = slugify(req.body.uzName, {
            replacement: '-',
            remove: /[$*_+~.()'"!\-:@]/g,
            lower: true
         })

         await Service.findByIdAndUpdate(id, {
            name: req.body.name,
            ruName: req.body.ruName,
            ruSlug,
            uzSlug
         })
      }

      await Service.findByIdAndUpdate(id, {
         price: req.body.price ? req.body.price : service.price,
         description: req.body.description ? req.body.description : service.description,
         ruDescription: req.body.ruDescription ? req.body.ruDescription : service.ruDescription
      })

      res.status(200).json({
         ruMessage: 'Услуга обновлена',
         uzMessage: 'Xizmat yangilandi',
         service
      })
   } catch (err) {
      res.status(500).json({ message: err.message })
   }
}

exports.delete = async (req, res) => {
   try {
      const id = req.params.id

      const service = await Service.findById(id)

      if(!service) {
         return res.status(404).json({
            ruMessage: 'Услуга не найдена',
            uzMessage: 'Xizmat topilmadi'
         })
      }

      const oldImagePath = service.image.split('/uploads/service/')[1]
      fs.unlinkSync(`public/uploads/service/${oldImagePath}`)

      await Organization.findByIdAndUpdate(service.organization, {
         $pull: { services: service._id }
      })

      await Service.findByIdAndDelete(id)

      res.status(200).json({
         ruMessage: 'Услуга удалена',
         uzMessage: 'Xizmat o`chirildi'
      })
   } catch (err) {
      res.status(500).json({ message: err.message })
   }
}