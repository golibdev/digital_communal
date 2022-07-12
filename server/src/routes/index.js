const express = require('express');
const router = express.Router();

router.use('/admin', require('./adminRoute'));
router.use('/person', require('./personRoute'));
router.use('/organization', require('./organizationRoute'));
router.use('/service', require('./serviceRoute'));

module.exports = router;
