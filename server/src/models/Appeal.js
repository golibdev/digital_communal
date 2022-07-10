const { model, Schema } = require('mongoose')
const { schemaOptions } = require('./schemaOptions')

const appealSchema = new Schema({
   title: {
      type: String,
      required: true
   },
   file: {
      type: String,
      required: true
   },
   description: {
      type: String,
      required: true
   },
   physicalPerson: {
      type: Schema.Types.ObjectId,
      ref: 'PhysicalPerson',
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
   status: {
      type: Number,
      required: true,
      enum: [0, 1, 2, 3],
      default: 0
   }
}, schemaOptions)

module.exports = model('Appeal', appealSchema)