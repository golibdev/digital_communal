const router = require('express').Router();
const { adminController } = require('../controllers');

/**
 * @swagger
 * components:
 *    schemas:
 *       Admin:
 *          type: object
 *          properties:
 *             _id:
 *                type: string
 *                description: Admin's object id
 *             username:
 *                type: string
 *                description: Admin's username
 *             password:
 *                type: string
 *                description: Admin's password
 *             fullName:
 *                type: string
 *                description: Admin's full name
 *          example:
 *             _id: 5e9f8f8f8f8f8f8f8f8f8f8f
 *             username: admin
 *             password: admin
 *             fullName: Admin Admin Admin
 *          
 */

/**
 * @swagger
 * /api/v1/admin/login:
 *    post:
 *       summary: Login admin
 *       tags: [Admin]
 *       requestBody:
 *          required: 
 *             - username
 *             - password
 *          content:
 *             application/json:
 *                schema:
 *                   $ref: '#/components/schemas/Admin'
 *       responses:
 *          200:
 *             description: Login success
 *             content:
 *                application/json:
 *                   schema:
 *                      ref: '#/components/schemas/Admin'
 *          400:
 *             description: Invalid username or password
 *             content:
 *                application/json:
 *                   schema:
 *                      $ref: '#/components/schemas/Admin'
 *          500:
 *             description: Internal server error
 *             content:
 *                application/json:
 *                   schema:
 *                      $ref: '#/components/schemas/Admin'
 *
 */
router.post('/login', adminController.login);

/**
 * @swagger
 * /api/v1/admin/register:
 *    post:
 *       summary: Register admin
 *       tags: [Admin]
 *       requestBody:
 *          required: 
 *             - fullName
 *             - username
 *             - password
 *          content:
 *             application/json:
 *                schema:
 *                   $ref: '#/components/schemas/Admin'
 *       responses:
 *          201:
 *             description: Admin created
 *             content:
 *                application/json:
 *                   schema:
 *                      ref: '#/components/schemas/Admin'
 *          400:
 *             description: Admin already exists
 *             content:
 *                application/json:
 *                   schema:
 *                      $ref: '#/components/schemas/Admin'
 *          500:
 *             description: Internal server error
 *             content:
 *                application/json:
 *                   schema:
 *                      $ref: '#/components/schemas/Admin'
 *
 */
router.post('/register', adminController.register);

module.exports = router;