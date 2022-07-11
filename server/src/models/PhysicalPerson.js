const { model, Schema } = require('mongoose')
const { schemaOptions } = require('./schemaOptions')

const physicalPersonSchema = new Schema({
   fullName: {
      type: String,
      required: true
   },
   phoneNumber: {
      type: String,
      required: true,
      unique: true
   },
   passportSerialAndNumber: {
      type: String,
      unique: true,
      required: true
   },
   passportJSHSHIR: {
      type: String,
      unique: true,
      required: true
   },
   address: {
      type: String,
      required: true
   },
   password: {
      type: String,
      required: true
   },
   image: {
      type: String,
      default: '/images/user.png'
   },
   appeals: [{
      type: Schema.Types.ObjectId,
      ref: 'Appeal'
   }],
   payments: [{
      type: Schema.Types.ObjectId,
      ref: 'Payment'
   }],
   notification: [{
      type: Schema.Types.ObjectId,
      ref: 'Notification'
   }]
}, schemaOptions)

module.exports = model('PhysicalPerson', physicalPersonSchema)