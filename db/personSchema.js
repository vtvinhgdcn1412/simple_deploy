const mongoose = require('mongoose');

const personSchema = new mongoose.Schema({
  name: { type: String, required: true },
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator: (v) => {
        return /^[0-9]+(-[0-9]+)*$/.test(v);
      },
    },
  },
});

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject._id;
  },
});

const Person = mongoose.model('Person', personSchema);

module.exports = Person;
