const { model, Schema } = require('mongoose')
const { schemaOptions } = require('./schemaOptions')

const serviceSchema = new Schema({
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
   ruSlug: {
      type: String,
      required: true,
      unique: true
   },
   uzSlug: {
      type: String,
      required: true,
      unique: true
   },
   price: {
      type: Number,
      required: true,
      default: 0
   },
   description: {
      type: String,
      required: true
   },
   ruDescription: {
      type: String,
      required: true
   },
   image: {
      type: String,
      required: true
   },
   organization: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: true
   }
}, schemaOptions)

module.exports = model('Service', serviceSchema)