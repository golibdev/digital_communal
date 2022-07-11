const router = require('express').Router();
const { personController } = require('../controllers');
const { verifyUserToken, verifyAdminToken, verify } = require('../middlewares');

router.post('/login', personController.login);
router.post('/register', personController.register);
router.get('/', verifyAdminToken, personController.getAll);
router.get('/:id', verify, personController.getById);
router.put('/:id', verifyUserToken, personController.update);

module.exports = router;