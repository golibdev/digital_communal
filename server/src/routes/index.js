const express = require('express');
const router = express.Router();

router.use('/admin', require('./adminRoute'));
router.use('/person', require('./personRoute'));

module.exports = router;
