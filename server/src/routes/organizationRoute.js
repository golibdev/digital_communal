const router = require('express').Router();
const { organizationController } = require('../controllers')
const { verifyAdminToken } = require('../middlewares')

router.get('/', organizationController.getAll)
router.get('/:id', organizationController.getOne)
router.post('/', verifyAdminToken, organizationController.create)
router.put('/:id', verifyAdminToken, organizationController.update)
router.delete('/:id', verifyAdminToken, organizationController.delete)

module.exports = router