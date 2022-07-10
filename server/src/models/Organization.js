const { model, Schema } = require('mongoose')
const { schemaOptions } = require('./schemaOptions')

const organizationSchema = new Schema({
   name: {
      type: String,
      required: true,
      unique: true
   },
   services: [{
      type: Schema.Types.ObjectId,
      ref: 'Service'
   }]
}, schemaOptions)

module.exports = model('Organization', organizationSchema)