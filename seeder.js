require('dotenv').config()
const users = require('./data/users')
const songThemes = require('./data/songThemes')
const songBooks = require('./data/songBooks')
const authors = require('./data/authors')
const authorsType = require('./data/authorsType')

const User = require('./models/UserModel')
const SongTheme = require('./models/SongThemeModel')
const SongBook = require('./models/SongBookModel')
const Author = require('./models/AuthorModel')
const AuthorsType = require('./models/AuthorsTypeModel')

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
    await User.deleteMany()
    await SongTheme.deleteMany()
    await SongBook.deleteMany()
    await Author.deleteMany()
    await AuthorsType.deleteMany()
    console.log('prev data detele')

    await User.insertMany(users)
    console.log('Users imported')
    await SongTheme.insertMany(songThemes)
    console.log('songThemes imported')
    await SongBook.insertMany(songBooks)
    console.log('SongBook imported')
    await Author.insertMany(authors)
    console.log('Authors imported')
    await AuthorsType.insertMany(authorsType)
    console.log('AuthorsType imported')
    
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
    await SongTheme.deleteMany()
    console.log('users data detele')
    await SongBook.deleteMany()
    console.log('users data detele')
    await Author.deleteMany()
    console.log('users data detele')
    await AuthorsType.deleteMany()
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
