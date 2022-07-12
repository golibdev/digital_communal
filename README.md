DIGITAL COMMUNAL API


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
