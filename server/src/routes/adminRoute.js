const router = require('express').Router();
const { adminController } = require('../controllers');
const { verifyAdminToken } = require('../middlewares');

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
 *             username: admin
 *             password: admin
 *       Error:
 *          type: object
 *          properties:
 *             message:
 *                type: string
 *                description: Error message
 *          status:
 *             type: number
 *             description: Error status
 *       SuccessLogin:
 *          type: object
 *          properties:
 *             message:
 *                type: string
 *                description: Success Login message
 *       SuccessRegister:
 *          type: object
 *          properties:
 *             message:
 *                type: string
 *                description: Success Register message
 *       SuccessUpdate:
 *          type: object
 *          properties:
 *             message:
 *                type: string
 *                description: Success Update message
 *    securitySchemes:
 *       bearerAuth:
 *          type: http
 *          scheme: bearer
 *          in: header
 *          bearerFormat: JWT
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
 *                      ref: '#/components/schemas/SuccessLogin'
 *          400:
 *             description: Invalid username or password
 *             content:
 *                application/json:
 *                   schema:
 *                      $ref: '#/components/schemas/Error'
 *          500:
 *             description: Internal server error
 *             content:
 *                application/json:
 *                   schema:
 *                      $ref: '#/components/schemas/Error'
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
 *                      ref: '#/components/schemas/SuccessRegister'
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
 */
router.post('/register', adminController.register);

/**
 * @swagger
 * paths:
 *    /api/v1/admin/update/{id}:
 *       put:
 *          summary: Update admin
 *          tags: [Admin]
 *          security:
 *             - bearerAuth: []               
 *          consumes:
 *             - application/json
 *          produces:
 *             - application/json
 *          parameters:
 *             - in: path
 *               name: id
 *               required: true
 *               schema:
 *                   type: string
 *               description: Admin's object id
 *          requestBody:
 *             required: true
 *             description: Admins data to update
 *             content:
 *                application/json:
 *                   schema:
 *                      $ref: '#/components/schemas/Admin'
 *          responses:
 *             200:
 *                description: Admin updated
 *                content:
 *                   application/json:
 *                      schema:
 *                         $ref: '#/components/schemas/SuccessUpdate'
 *             404:
 *                description: Invalid admin data
 *                content:
 *                   application/json:
 *                      schema:
 *                         $ref: '#/components/schemas/Error'
 *             401:
 *                description: Unauthorized
 *                content:
 *                   application/json:
 *                      schema:
 *                         $ref: '#/components/schemas/Error'
 *             500:
 *                description: Internal server error
 *                content:
 *                   application/json:
 *                      schema:
 *                         $ref: '#/components/schemas/Error'   
 */
router.put('/update/:id', verifyAdminToken, adminController.update);

module.exports = router;