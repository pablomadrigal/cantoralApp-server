const mongoose = require('mongoose')

const Schema = mongoose.Schema

const SongBookSchema = new Schema(
  {
    Name: { type: String, required: true }
  },
  { timestamps: true }
)

module.exports = mongoose.model('SongBook', SongBookSchema)
