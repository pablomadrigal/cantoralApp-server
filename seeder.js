require('dotenv').config()
const types = require('./data/authorsType')

const AuthorType = require('./models/AuthorTypeModel')

// DB connection
const MONGODB_URL = process.env.MONGODB_URL
const mongoose = require('mongoose')
mongoose
  .connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    // don't show the log when it is test
    if (process.env.NODE_ENV !== 'test') {
      console.log('Connected to %s', MONGODB_URL)
      console.log('Seeder app is running ... \n')
    }
  })
  .catch((err) => {
    console.error('App starting error:', err.message)
    process.exit(1)
  })
// eslint-disable-next-line no-unused-vars
const db = mongoose.connection

const importData = async () => {
  try {
    await AuthorType.deleteMany()
    await AuthorType.insertMany(types)
    console.log('AuthorType imported')
    console.log('Data imported')
    process.exit()
  } catch (e) {
    console.log('error', e)
    process.exit(1)
  }
}

const destroyData = async () => {
  try {
    await User.deleteMany()
    console.log('users data detele')
    process.exit()
  } catch (e) {
    console.log('error', e)
    process.exit(1)
  }
}

if (process.argv[2] === '-d') {
  destroyData()
} else {
  importData()
}
