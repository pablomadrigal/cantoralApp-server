const mongoose = require('mongoose')

const Schema = mongoose.Schema

const SongBookSchema = new Schema({
  SongBook: { type: String, required: true },
  Number: { type: String, required: true }
})

const AuthorSongSchema = new Schema({
  Author: { type: String, required: true },
  AuthorType: { type: String, required: true }
})

const ChorSchema = new Schema({
  Beginning: { type: Number, required: true },
  End: { type: Number, required: true },
  Type: {
    type: String,
    enum: [
      'DO',
      'DO#',
      'RE',
      'RE#',
      'MI',
      'FA',
      'FA#',
      'SOL',
      'SOL#',
      'LA',
      'LA#',
      'SI',
    ],
    required: true
  },
  Decoration: {
    type: [String],
    enum: ['m','sus', '7', '9', 'sus4', 'sus2'],
    required: true,
    default: []
  }
})

const LineSchema = new Schema({
  LineNumber: { type: Number, required: true },
  Letter: { type: String, required: true },
  Chores: { type: [ChorSchema] }
})

const VerseSchema = new Schema({
  Type: { type: String, required: true },
  Title: { type: String, required: true },
  Lines: { type: [LineSchema], required: true }
})

const VerseOrderSchema = new Schema({
  VerseTitle: { type: String, required: true },
  Order: { type: Number, required: true }
})

const SongSchema = new Schema(
  {
    Title: { type: String, require: true },
    Subtitles: { type: [String] },
    BasedOn: { type: [String] },
    SongBooks: { type: [SongBookSchema], default: [], required: false },
    Authors: { type: [AuthorSongSchema], default: [], required: false },
    SongTheme: { type: [String] },
    Capo: { type: Number, default: 0 },
    BaseChord: {type: ChorSchema, required: false},
    MusicURL: { type: String },
    Verses: { type: [VerseSchema] },
    LyricsVerseOrder: { type: [VerseOrderSchema] },
    PresenterVerseOrder: { type: [VerseOrderSchema] },
    ChoresVerseOrder: { type: [VerseOrderSchema] },
    Version: { type: Number, default: 1 },
    Active: { type: Boolean, default: true },
    Approved: { type: Boolean, default: false },
    Deleted: { type: Boolean, default: false }
  },
  { timestamps: true }
)

module.exports = mongoose.model('Song', SongSchema)
