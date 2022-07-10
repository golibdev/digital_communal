const { model, Schema } = require('mongoose')
const { schemaOptions } = require('./schemaOptions')

const paymentSchema = new Schema({
   amount: {
      type: Number,
      required: true
   },
   organization: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: true
   },
   service: {
      type: Schema.Types.ObjectId,
      ref: 'Service',
      required: true
   },
   physicalPerson: {
      type: Schema.Types.ObjectId,
      ref: 'PhysicalPerson',
      required: true
   }
}, schemaOptions)

module.exports = model('Payment', paymentSchema)