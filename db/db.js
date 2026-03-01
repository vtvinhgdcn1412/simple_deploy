const mongoose = require('mongoose');
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.set('strictQuery', false);
mongoose
  .connect(MONGODB_URI, { family: 4 })
  .then((result) => {
    console.log('connected to mongodb');
  })
  .catch((error) => console.log('failed to connect to mongodb', error.message));

const db = mongoose;

module.exports = db;
