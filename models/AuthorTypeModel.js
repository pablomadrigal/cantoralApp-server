const mongoose = require('mongoose')

const Schema = mongoose.Schema

const AuthorTypeSchema = new Schema(
  {
    Type: { type: String, required: true }
  },
  { timestamps: true }
)

module.exports = mongoose.model('AuthorType', AuthorTypeSchema)
