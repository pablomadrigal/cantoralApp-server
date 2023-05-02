const mongoose = require('mongoose')

const Schema = mongoose.Schema

const AuthorSchema = new Schema(
  {
    name: { type: String, required: true },
    lastName: { type: String, required: false }
  },
  { timestamps: true }
)

module.exports = mongoose.model('Author', AuthorSchema)
