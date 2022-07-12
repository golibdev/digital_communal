const { PhysicalPerson } = require('../models')
const jwt = require('jsonwebtoken')
const CryptoJS = require("crypto-js");
const path = require('path')
const fs = require('fs')

exports.login = async (req, res) => {
   try {
      const {
         phoneNumber,
         password
      } = req.body

      const person = await PhysicalPerson.findOne({ phoneNumber })

      if (!person) {
         return res.status(400).json({
            ruMessage: 'Пользователь с таким номером телефона не существует',
            uzMessage: 'Bunday telefon raqami mavjud emas'
         })
      }

      const decryptedPass = CryptoJS.AES.decrypt(person.password, process.env.PASSWORD_SECRET_KEY).toString(CryptoJS.enc.Utf8);

      if (decryptedPass !== password) {
         return res.status(400).json({
            ruMessage: 'Неверный пароль',
            uzMessage: 'Noto`g`ri parol'
         })
      }

      const token = jwt.sign({ id: person._id }, process.env.JWT_SECRET_KEY);

      person.password = undefined;

      return res.status(200).json({
         ruMessage: 'Вход выполнен успешно',
         uzMessage: 'Kirish muvaffaqiyatli amalga oshdi',
         token,
         person
      })
   } catch (err) {
      res.status(500).json({ message: err.message })
   }
}

exports.register = async (req, res) => {
   try {
      const {
         fullName,
         phoneNumber,
         passportSerialAndNumber,
         passportJSHSHIR,
         address,
         password
      } = req.body

      const person = await PhysicalPerson.findOne({ phoneNumber, passportSerialAndNumber, passportJSHSHIR })

      if (person) {
         return res.status(400).json({
            ruMessage: 'Пользователь с таким номером телефона или паспортными данными уже существует',
            uzMessage: 'Bunday telefon raqami yoki pasport raqamlari mavjud'
         })
      }

      const encryptedPass = CryptoJS.AES.encrypt(password, process.env.PASSWORD_SECRET_KEY).toString();

      const newPerson = new PhysicalPerson({
         fullName,
         phoneNumber,
         passportSerialAndNumber,
         passportJSHSHIR,
         address,
         password: encryptedPass
      })

      await newPerson.save()

      return res.status(200).json({
         ruMessage: 'Регистрация выполнена успешно',
         uzMessage: 'Ro`yhatdan o`tish muvaffaqiyatli amalga oshdi',
         person: newPerson
      })
   } catch (err) {
      res.status(500).json({ message: err.message })
   }
}

exports.getAll = async (req, res) => {
   try {
      const page = req.query.page || 1
      const limit = 10
      const skipIndex = (page - 1) * limit

      const people = await PhysicalPerson
         .find()
         .skip(skipIndex)
         .limit(limit)
         .populate('appeals')
         .populate('payments')
         .sort({ createdAt: -1 })

      if(!people) {
         return res.status(404).json({
            ruMessage: 'Нет пользователей',
            uzMessage: 'Ma`lumotlar topilmadi'
         })
      }

      const total = await PhysicalPerson.countDocuments()

      const peopleDetails = []

      for (let i = 0; i < people.length; i++) {
         const person = people[i]

         const personDetails = {
            _id: person._id,
            fullName: person.fullName,
            phoneNumber: person.phoneNumber,
            passportSerialAndNumber: person.passportSerialAndNumber,
            passportJSHSHIR: person.passportJSHSHIR,
            address: person.address,
            payments: person.payments,
            appeals: person.appeals,
            image: person.image,
         }

         peopleDetails.push(personDetails)
      }

      return res.status(200).json({
         people: peopleDetails,
         pagination: {
            total,
            page,
            limit,
            next: `/api/v1/person?page=${page + 1}`
         }
      })
   } catch (err) {
      res.status(500).json({ message: err.message })
   }
}

exports.getById = async (req, res) => {
   try {
      const { id } = req.params

      const person = await PhysicalPerson
         .findById(id)
         .populate('appeals')
         .populate('payments')
         .populate('notification')

      if (!person) {
         return res.status(404).json({
            ruMessage: 'Пользователь не найден',
            uzMessage: 'Ma`lumot topilmadi'
         })
      }

      res.status(200).json({ person })
   } catch (err) {
      res.status(500).json({ message: err.message })
   }
}

exports.update = async (req, res) => {
   try {
      const { id } = req.params

      const person = await PhysicalPerson.findById(id)

      if (!person) {
         return res.status(404).json({
            ruMessage: 'Пользователь не найден',
            uzMessage: 'Ma`lumot topilmadi'
         })
      }

      if(req.files) {
         const image = req.files.image

         if(!image.mimetype.startsWith('image')) {
            return res.status(400).json({
               ruMessage: 'Неверный формат изображения',
               uzMessage: 'Noto`g`ri format kiritildi'
            })
         }

         if(image.size > process.env.MAX_FILE_SIZE) {
            return res.status(400).json({
               ruMessage: 'Размер изображения превышает максимально допустимый',
               uzMessage: 'Tasvirning hajmi katta'
            })
         }

         image.name = `image_${Date.now()}${path.parse(image.name).ext}`

         image.mv(`public/uploads/users/${image.name}`, async err => {
            if(err) {
               return res.status(500).json({ message: err.message })
            }
         })

         const host = req.get('host')

         await PhysicalPerson.findByIdAndUpdate(id, {
            image: `${req.protocol}://${host}/uploads/users/${image.name}` ? 
            `${req.protocol}://${host}/uploads/users/${image.name}` : person.image
         }, { new: true })
      } 
      
      if(req.body.password) {
         const encryptedPass = CryptoJS.AES.encrypt(req.body.password, process.env.PASSWORD_SECRET_KEY).toString();

         await PhysicalPerson.findByIdAndUpdate(id, {
            password: encryptedPass
         }, { new: true })
      } 
      
      if(req.body.passportJSHSHIR) {
         const exist = await PhysicalPerson.findOne({ passportJSHSHIR: req.body.passportJSHSHIR })

         if(exist) {
            return res.status(400).json({
               ruMessage: 'Пользователь с таким паспортным данным уже существует',
               uzMessage: 'Bunday pasport raqami yoki telefon raqami mavjud'
            })
         }

         await PhysicalPerson.findByIdAndUpdate(id, { passportJSHSHIR: req.body.passportJSHSHIR ? req.body.passportJSHSHIR : person.passportJSHSHIR }, { new: true })
      } 
      
      if (req.body.phoneNumber) {
         const exist = await PhysicalPerson.findOne({ phoneNumber: req.body.phoneNumber })

         if(exist) {
            return res.status(400).json({
               ruMessage: 'Пользователь с таким номером телефона уже существует',
               uzMessage: 'Bunday telefon raqami yoki pasport raqamlari mavjud'
            })
         }

         await PhysicalPerson.findByIdAndUpdate(id, { phoneNumber: req.body.phoneNumber ? req.body.phoneNumber : person.phoneNumber }, { new: true })
      } 
      
      if (req.body.passportSerialAndNumber) {
         const exist = await PhysicalPerson.findOne({ passportSerialAndNumber: req.body.passportSerialAndNumber ? req.body.passportSerialAndNumber : person.passportSerialAndNumber })

         if(exist) {
            return res.status(400).json({
               ruMessage: 'Пользователь с таким номером паспорта уже существует',
               uzMessage: 'Bunday pasport raqami yoki telefon raqami mavjud'
            })
         }

         await PhysicalPerson.findByIdAndUpdate(id, { passportSerialAndNumber: req.body.passportSerialAndNumber }, { new: true })
      }

      await PhysicalPerson.findByIdAndUpdate(id, {
         fullName: req.body.fullName ? req.body.fullName : person.fullName,
         address: req.body.address ? req.body.address : person.address
      }, { new: true })
   } catch (err) {
      res.status(500).json({ message: err.message })
   }
}

exports.search = async (req, res) => {
   try {
      const { search } = req.query

      const people = await PhysicalPerson.find({
         $or: [
            { fullName: { $regex: search, $options: 'i' } },
            { passportSerialAndNumber: { $regex: search, $options: 'i' } },
            { passportJSHSHIR: { $regex: search, $options: 'i' } },
            { phoneNumber: { $regex: search, $options: 'i' } }
         ]
      }).sort({ createdAt: -1 })

      if(!people) {
         return res.status(404).json({
            ruMessage: 'Пользователь не найден',
            uzMessage: 'Ma`lumot topilmadi'
         })
      }

      res.status(200).json({ people })
   } catch (err) {
      res.status(500).json({ message: err.message })
   }
}