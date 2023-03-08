const mongoose = require('mongoose')

const Schema = mongoose.Schema

const AuthorSchema = new Schema(
  {
    Name: { type: String, required: true },
    LastName: { type: String, required: true }
  },
  { timestamps: true }
)

module.exports = mongoose.model('Author', AuthorSchema)
