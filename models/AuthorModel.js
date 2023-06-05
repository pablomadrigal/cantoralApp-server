const mongoose = require('mongoose')

const Schema = mongoose.Schema

const AuthorSchema = new Schema(
  {
    Name: { type: String, required: true },
    LastName: { type: String, required: false }
  },
  { timestamps: true }
)

module.exports = mongoose.model('Author', AuthorSchema)
