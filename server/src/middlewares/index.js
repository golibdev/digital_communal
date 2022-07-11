const jwt = require('jsonwebtoken');
const { Admin, PhysicalPerson } = require('../models');

const tokenDecode = (req) => {
   const bearerHeader = req.headers['authorization'];
   if(bearerHeader) {
      const bearer = bearerHeader.split(' ')[1];
      try {
         const tokenDecoded = jwt.verify(
            bearer, 
         process.env.JWT_SECRET_KEY);
         return tokenDecoded;
      } catch (err) {
         return false;
      }
   } else {
      return false;
   }
}

exports.verifyAdminToken = async (req, res, next) => {
   try {
      const tokenDecoded = tokenDecode(req);
      if(tokenDecoded) {
         const admin = await Admin.findById(tokenDecoded.id);
         if(!admin) return res.status(401).json({ message: 'No allowed' });
         req.admin = admin;
         next();
      } else {
         return res.status(401).json({ message: 'Unauthorized' });
      }
   } catch (err) {
      console.log(err)
      res.status(500).json({ err: err })
   }
}

exports.verifyUserToken = async (req, res, next) => {
   try {
      const tokenDecoded = tokenDecode(req);
      if(tokenDecoded) {
         const person = await PhysicalPerson.findById(tokenDecoded.id);
         if(!person) return res.status(401).json({ message: 'No allowed' });
         req.person = person;
         next();
      } else {
         return res.status(401).json({ message: 'Unauthorized' });
      }
   } catch (err) {
      console.log(err)
      res.status(500).json({ err: err })
   }
}

exports.verify = async (req, res, next) => {
   try {
      const tokenDecoded = tokenDecode(req);
      if(tokenDecoded) {
         const exist = await Admin.findById(tokenDecoded.id)
            || await PhysicalPerson.findById(tokenDecoded.id);
         if(!exist) return res.status(401).json({ message: 'No allowed' });
         req.exist = exist;
         next();
      }
   } catch (err) {
      console.log(err)
      res.status(500).json({ err: err })
   }
}