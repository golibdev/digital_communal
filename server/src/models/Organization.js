const { model, Schema } = require('mongoose')
const { schemaOptions } = require('./schemaOptions')

const organizationSchema = new Schema({
   name: {
      type: String,
      required: true,
      unique: true
   },
   ruName: {
      type: String,
      required: true,
      unique: true
   },
   image: {
      type: String,
      required: true
   },
   services: [{
      type: Schema.Types.ObjectId,
      ref: 'Service'
   }]
}, schemaOptions)

module.exports = model('Organization', organizationSchema)