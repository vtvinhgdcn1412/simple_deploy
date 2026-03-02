const mongoose = require('mongoose')

const personSchema = new mongoose.Schema({
  name: { type: String, required: true },
  number: {
    type: String,
    validate: {
      validator: (v) => {
        return /^(?=.{8})[0-9]+(-[0-9]+)*$/.test(v)
      },
      message: 'Number must have at least 8 chars and in this format X-XX',
    },
  },
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject.__v
    delete returnedObject._id
  },
})

const Person = mongoose.model('Person', personSchema)

module.exports = Person
