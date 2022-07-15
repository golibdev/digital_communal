const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const swaggerJsDoc = require('swagger-jsdoc')
const expressFileUpload = require('express-fileupload')
const swaggerUi = require('swagger-ui-express')
const indexRouter = require('./src/routes/index');
const cors = require('cors');
const app = express();

const options = {
   definition: {
      openapi: '3.0.0',
      info: {
         title: 'Digital communal API',
         version: '1.0.0',
         description: 'Digital communal API'
      },
      servers: [
         {
            url: 'http://localhost:4000',
            description: 'Local server',
         }
      ],
   },
   apis: ['./src/routes/*.js'],
}
const specs = swaggerJsDoc(options)

app.use(cors())
app.use(expressFileUpload())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs))
app.use('/api/v1', indexRouter);

module.exports = app;
