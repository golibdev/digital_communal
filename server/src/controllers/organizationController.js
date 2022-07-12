const { Organization, Service } = require('../models')
const path = require('path')
const fs = require('fs')

exports.getAll = async (req, res) => {
   try {

      if(req.query.no_page) {
         const organizations = await Organization
            .find({})
            .populate('services')
            .sort('name')
         
         return res.status(200).json({organizations})
      }

      const page = parseInt(req.query.page) || 1
      const limit = 10
      const skipIndex = (page - 1) * limit

      const organizations = await Organization.find()
         .skip(skipIndex)
         .limit(limit)
         .populate('services')
         .sort({ createdAt: -1 })

      if(!organizations) {
         return res.status(404).json({
            ruMessage: 'Нет организаций',
            uzMessage: 'Tashkilot topilmadi'
         })
      }

      const total = await Organization.countDocuments()

      res.status(200).json({
         organizations,
         pagination: {
            total,
            page,
            limit,
            next: `/api/v1/organization?page=${page + 1}`
         }
      })
   } catch (err) {
      res.status(500).json({ message: err.message })
   }
}

exports.search = async (req, res) => {
   try {
      const { search } = req.query

      const organizations = await Organization.find({
         $or: [
            { name: { $regex: search, $options: 'i' } },
            { ruName: { $regex: search, $options: 'i' } }
         ]
      })

      if(!organizations) {
         return res.status(404).json({
            ruMessage: 'Нет организаций',
            uzMessage: 'Tashkilot topilmadi'
         })
      }

      res.status(200).json({organizations})
   } catch (err) {
      res.status(500).json({ message: err.message })
   }
}

exports.getOne = async (req, res) => {
   try {
      const { id } = req.params

      const organization = await Organization.findById(id).populate('services')

      if(!organization) {
         return res.status(404).json({
            ruMessage: 'Организация не найдена',
            uzMessage: 'Organizatsiya topilmadi'
         })
      }

      res.status(200).json({organization})
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
            ruMessage: 'Неверный формат файла',
            uzMessage: 'Faqat rasm yuklash kerak'
         })
      }

      if(image.size > process.env.MAX_FILE_SIZE) {
         return res.status(400).json({
            ruMessage: 'Файл слишком большой',
            uzMessage: 'Fayl juda ham katta'
         })
      }

      const {
         name,
         ruName
      } = req.body

      const existingOrganization = await Organization.findOne({ name, ruName })

      if(existingOrganization) {
         return res.status(400).json({
            ruMessage: 'Организация с таким названием уже существует',
            uzMessage: 'Bunday nomli tashkilot mavjud'
         })
      }

      image.name = `image_${Date.now()}${path.parse(image.name).ext}`

      image.mv(`public/uploads/organization/${image.name}`, async (err) => {
         if(err) {
            return res.status(500).json({ message: err.message })
         }
      })

      const host = req.get('host')

      const organization = new Organization({
         name,
         ruName,
         image: `${req.protocol}://${host}/uploads/organization/${image.name}`
      })

      await organization.save()

      res.status(201).json({
         ruMessage: 'Организация успешно создана',
         uzMessage: 'Tashkilot muvaffaqiyatli yaratildi',
         organization
      })
   } catch (err) {
      res.status(500).json({ message: err.message })
   }
}

exports.update = async (req, res) => {
   try {
      const id = req.params.id

      const organization = await Organization.findById(id)

      if(!organization) {
         return res.status(404).json({
            ruMessage: 'Организация не найдена',
            uzMessage: 'Organizatsiya topilmadi'
         })
      }

      if(req.files) {
         const image = req.files.image

         const oldImage = organization.image
         const olImagePath = oldImage.split('/uploads/organization/')[1]

         fs.unlinkSync(`public/uploads/organization/${olImagePath}`)

         if(!image.mimetype.startsWith('image')) {
            return res.status(400).json({
               ruMessage: 'Неверный формат файла',
               uzMessage: 'Faqat rasm yuklash kerak'
            })
         }

         if(image.size > process.env.MAX_FILE_SIZE) {
            return res.status(400).json({
               ruMessage: 'Файл слишком большой',
               uzMessage: 'Fayl juda ham katta'
            })
         }

         image.name = `image_${Date.now()}${path.parse(image.name).ext}`

         image.mv(`public/uploads/organization/${image.name}`, async (err) => {
            if(err) {
               return res.status(500).json({ message: err.message })
            }
         })

         await Organization.findByIdAndUpdate(id, {
            image: `${req.protocol}://${req.get('host')}/uploads/organization/${image.name}`
         })
      }

      if(req.body.name || req.body.ruName) {
         const exist = await Organization.findOne({
            name: req.body.name,
            ruName: req.body.ruName
         })

         if(exist) {
            return res.status(400).json({
               ruMessage: 'Организация с таким названием уже существует',
               uzMessage: 'Bunday nomli tashkilot mavjud'
            })
         }

         await Organization.findByIdAndUpdate(id, {
            name: req.body.name ? req.body.name : organization.name,
            ruName: req.body.ruName ? req.body.ruName : organization.ruName
         })
      }

      res.status(200).json({
         ruMessage: 'Организация успешно обновлена',
         uzMessage: 'Tashkilot muvaffaqiyatli yangilandi'
      })
   } catch (err) {
      res.status(500).json({ message: err.message })
   }
}

exports.delete = async (req, res) => {
   try {
      const id = req.params.id

      const organization = await Organization.findById(id)

      if(!organization) {
         return res.status(404).json({
            ruMessage: 'Организация не найдена',
            uzMessage: 'Tashkilot topilmadi'
         })
      }

      const oldImage = organization.image
      const olImagePath = oldImage.split('/uploads/organization/')[1]

      fs.unlinkSync(`public/uploads/organization/${olImagePath}`)

      // delete services
      for(let i = 0; i < organization.services.length; i++) {
         const service = organization.services[i]
         await Service.findByIdAndDelete(service._id)
      }

      await Organization.findByIdAndDelete(id)

      res.status(200).json({
         ruMessage: 'Организация успешно удалена',
         uzMessage: 'Tashkilot muvaffaqiyatli o\'chirildi'
      })
   } catch (err) {
      res.status(500).json({ message: err.message })
   }
}