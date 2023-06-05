const mongoose = require('mongoose')

const Schema = mongoose.Schema

const SongThemeSchema = new Schema(
  {
    Name: { type: String, required: true }
  },
  { timestamps: true }
)

module.exports = mongoose.model('SongTheme', SongThemeSchema)
