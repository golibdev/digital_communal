const { model, Schema } = require('mongoose')
const { schemaOptions } = require('./schemaOptions')

const notificationSchema = new Schema({
   title: {
      type: String,
      required: true
   },
   message: {
      type: String,
      required: true
   },
   person: {
      type: Schema.Types.ObjectId,
      ref: 'PhysicalPerson',
      required: true
   }
}, schemaOptions)

module.exports = model('Notification', notificationSchema)