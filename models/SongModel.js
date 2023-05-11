const mongoose = require('mongoose')

const Schema = mongoose.Schema

const SongBookSchema = new Schema({
  SongBook: { type: Schema.Types.ObjectId, ref: 'SongBookSchema', required: true },
  Number: { type: String, required: true }
})

const AuthorSongSchema = new Schema({
  Author: { type: Schema.Types.ObjectId, ref: 'AuthorSchema', required: true },
  AuthorType: { type: Schema.Types.ObjectId, ref: 'AuthorTypeSchema', required: true }
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
      'Dom',
      'Do#m',
      'Rem',
      'Re#m',
      'Mim',
      'Fam',
      'Fa#m',
      'Solm',
      'Sol#m',
      'Lam',
      'La#m',
      'Sim',
      'Dom7',
      'Do#m7',
      'Rem7',
      'Re#m7',
      'Mim7',
      'Fam7',
      'Fa#m7',
      'Solm7',
      'Sol#m7',
      'Lam7',
      'La#m7',
      'Sim7',
      'DO7',
      'DO#7',
      'RE7',
      'RE#7',
      'MI7',
      'FA7',
      'FA#7',
      'SOL7',
      'SOL#7',
      'LA7',
      'LA#7',
      'SI7'
    ],
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
    LyricsVerseOrder: { type: [VerseOrderSchema] },
    PresenterVerseOrder: { type: [VerseOrderSchema] },
    ChoresVerseOrder: { type: [VerseOrderSchema] },
    SongTheme: { type: [String] },
    ChoresIntro: { type: [ChorSchema] },
    Verses: { type: [VerseSchema] },
    Capo: { type: Number, default: 0 },
    Version: { type: Number, default: 1 },
    MusicURL: { type: String },
    Active: { type: Boolean, default: true },
    Deleted: { type: Boolean, default: false }
  },
  { timestamps: true }
)

module.exports = mongoose.model('Song', SongSchema)
