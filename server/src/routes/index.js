const express = require('express');
const router = express.Router();

router.use('/admin', require('./adminRoute'));

module.exports = router;
