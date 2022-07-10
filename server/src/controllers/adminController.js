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
         return res.status(400).json({ message: 'Admin not found' })
      }

      const decryptedPass = CryptoJS.AES.decrypt(admin.password, process.env.PASSWORD_SECRET_KEY).toString(CryptoJS.enc.Utf8);

      if (decryptedPass !== password) {
         return res.status(400).json({ message: 'Invalid password' })
      }

      const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET_KEY);

      admin.password = undefined;

      return res.status(200).json({
         message: 'Login success',
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
         return res.status(400).json({ message: 'Admin already exists' })
      }

      const encryptedPass = CryptoJS.AES.encrypt(password, process.env.PASSWORD_SECRET_KEY).toString();

      const newAdmin = await Admin.create({ fullName, username, password: encryptedPass });

      await newAdmin.save();

      res.status(201).json({ message: 'Admin created', admin: newAdmin })
   } catch (err) {
      res.status(500).json({ message: err.message })
   }
}