const mongoose = require('mongoose')

const Schema = mongoose.Schema

const SongBookSchema = new Schema({
  BookName: { type: String, required: true },
  Number: { type: String, required: true }
})

const AuthorSchema = new Schema({
  Author: { type: String, required: true },
  Type: {
    type: String,
    required: true
  }
})

const ChorSchema = new Schema({
  Beginning: { type: Number, required: true },
  End: { type: Number, required: true },
  Type: {
    type: String,
    enum: ['DO', 'RE', 'MI', 'FA', 'SOL', 'LA', 'SI'],
    required: true
  }
})

const LineSchema = new Schema({
  LineNumber: { type: Number, required: true },
  Letter: { type: String, required: true },
  Chores: { type: [ChorSchema] }
})

const VerseSchema = new Schema({
  Type: { type: String, required: true },
  Lines: { type: [LineSchema], required: true }
})

const SongSchema = new Schema(
  {
    Title: { type: String, require: true },
    Subtitles: { type: [String] },
    BasedOn: { type: [String] },
    SongBooks: { type: [SongBookSchema] },
    Authors: { type: [AuthorSchema] },
    VerseOrder: { type: [String] },
    SongTheme: { type: [String] },
    ChoresIntro: { type: [ChorSchema] },
    Verses: { type: [VerseSchema] },
    History: { type: String },
    MusicURL: { type: String },
    Active: { type: Boolean, default: true },
    Deleted: { type: Boolean, default: false }
  },
  { timestamps: true }
)

module.exports = mongoose.model('Song', SongSchema)
