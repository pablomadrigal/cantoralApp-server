require('dotenv').config()
const users = require('./data/users')
const songs = require('./data/datos')
const songBooks = require('./data/songBooks')
const authors = require('./data/authors')
const UserDev = require('./models/UserModel')
const Song = require('./models/SongModel')
const SongBook = require('./models/SongBookModel')
const Author = require('./models/AuthorModel')
const utility = require('./helpers/utility')

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
    await UserDev.deleteMany()
    await SongBook.deleteMany()
    await Author.deleteMany()
    await Song.deleteMany()
    const createdUsers = await UserDev.insertMany(users)
    console.log('Users imported')
    const adminUser = createdUsers[0].email
    console.log(adminUser)
    await SongBook.insertMany(songBooks)
    console.log('SongBooks imported')
    await Author.insertMany(authors)
    console.log('Authors imported')
    const songBooksInDB = await SongBook.find({})
    console.log(songBooksInDB)
    const songsUpdated = songs.map((song) => {
      const cantorales = song.Cancioneros.map((cantoral) => {
        const foundSongBook = songBooksInDB.find((sb) => sb.Name === cantoral.BookName)
        if (foundSongBook) return { SongBookId: foundSongBook._id, Number: cantoral.Number }
      })
      return { ...song, SongBooks: cantorales || [], Authors: [] }
    })
    await Song.insertMany(songsUpdated)
    console.log('Songs imported')
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
