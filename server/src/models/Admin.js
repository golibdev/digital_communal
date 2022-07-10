const { model, Schema } = require('mongoose')
const { schemaOptions } = require('./schemaOptions')

const adminSchema = new Schema({
   fullName: {
      type: String,
      required: true
   },
   username: {
      type: String,
      required: true
   },
   password: {
      type: String,
      required: true
   }
}, schemaOptions)

module.exports = model('Admin', adminSchema)