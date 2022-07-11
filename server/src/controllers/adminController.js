const { Admin } = require('../models')
const CryptoJS = require("crypto-js");
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
   try {
      const {
         username,
         password
      } = req.body

      const admin = await Admin.findOne({ username });

      if (!admin) {
         return res.status(400).json({
            uzMessage: 'Foydalanuvchi nomi yoki parol noto`g`ri',
            ruMessage: 'Неверный логин или пароль'
         })
      }

      const decryptedPass = CryptoJS.AES.decrypt(admin.password, process.env.PASSWORD_SECRET_KEY).toString(CryptoJS.enc.Utf8);

      if (decryptedPass !== password) {
         return res.status(400).json({
            uzMessage: 'Foydalanuvchi nomi yoki parol noto`g`ri',
            ruMessage: 'Неверный логин или пароль'
         })
      }

      const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET_KEY);

      admin.password = undefined;

      return res.status(200).json({
         ruMessage: 'Вход выполнен успешно',
         uzMessage: 'Kirish muvaffaqiyatli amalga oshdi',
         token,
         admin
      })
   } catch (err) {
      res.status(500).json({ message: err.message })
   }
}

exports.register = async (req, res) => {
   try {
      const {
         fullName,
         username,
         password
      } = req.body

      const admin = await Admin.findOne({ username });

      if (admin) {
         return res.status(400).json({
            ruMessage: 'Пользователь с таким логином уже существует',
            uzMessage: 'Bunday foydalanuvchi mavjud'
         })
      }

      const encryptedPass = CryptoJS.AES.encrypt(password, process.env.PASSWORD_SECRET_KEY).toString();

      const newAdmin = await Admin.create({ fullName, username, password: encryptedPass });

      await newAdmin.save();

      res.status(201).json({
         ruMessage: 'Пользователь успешно зарегистрирован',
         uzMessage: 'Foydalanuvchi muvaffaqiyatli qo`shildi',
         admin: newAdmin 
      })
   } catch (err) {
      res.status(500).json({ message: err.message })
   }
}

exports.update = async (req, res) => {
   try {
      const { id } = req.params;

      const admin = await Admin.findById(id);

      if (!admin) {
         return res.status(404).json({
            ruMessage: 'Пользователь не найден',
            uzMessage: 'Foydalanuvchi topilmadi'
         })
      }

      if(req.body.password) {
         const encryptedPass = CryptoJS.AES.encrypt(req.body.password, process.env.PASSWORD_SECRET_KEY).toString();

         await Admin.findByIdAndUpdate(id, { password: encryptedPass ? encryptedPass : admin.password });
      }

      const updateAdmin = await Admin.findByIdAndUpdate(id, {
         fullName: req.body.fullName ? req.body.fullName : admin.fullName,
         username: req.body.username ? req.body.username : admin.username
      }, { new: true });

      res.status(200).json({
         ruMessage: 'Пользователь успешно обновлен',
         uzMessage: 'Foydalanuvchi muvaffaqiyatli yangilandi',
         admin: updateAdmin
      })
   } catch (err) {
      res.status(500).json({ message: err.message })
   }
}