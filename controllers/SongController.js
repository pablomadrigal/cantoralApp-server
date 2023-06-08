const Song = require('../models/SongModel')
const SongBook = require('../models/SongBookModel')
const Author = require('../models/AuthorModel')
const AuthorType = require('../models/AuthorTypeModel')
const { body, validationResult } = require('express-validator')
const { sanitizeBody } = require('express-validator')
const apiResponse = require('../helpers/apiResponse')
const auth = require('../middlewares/jwt')
const utility = require('../helpers/utility')
const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false)

// Song Schema
function SongData(data) {
  this.id = data?._id
  this.title = data?.Title
  this.subtitles = data?.Subtitles
  this.basedOn = data?.BasedOn
  this.songBooks =
    data.SongBooks.length > 0 ? data.SongBooks.map((item) => new SongBookData(item)) : []
  this.authors = data.Authors.length > 0 ? data.Authors.map((item) => new AuthorData(item)) : []
  this.songTheme = data?.SongTheme
  this.capo = data?.Capo
  this.baseChord = new ChordData(data.BaseChord)
  this.musicURL = data?.MusicURL
  this.verses = data.Verses.length > 0 ? data.Verses.map((item) => new VerseData(item)) : []
  this.lyricsVerseOrder =
    data.LyricsVerseOrder.length > 0
      ? data.LyricsVerseOrder.map((item) => new VerseOrderData(item))
      : []
  this.presenterVerseOrder =
    data.PresenterVerseOrder.length > 0
      ? data.PresenterVerseOrder.map((item) => new VerseOrderData(item))
      : []
  this.chordsVerseOrder =
    data.ChordsVerseOrder.length > 0
      ? data.ChordsVerseOrder.map((item) => new VerseOrderData(item))
      : []
  this.version = data?.Version
  this.approved = data?.Approved
  this.active = data?.Active
}

// Song Light Schema
function SongLightData(data) {
  this.id = data?._id
  this.title = data?.Title
  this.subtitles = data?.Subtitles
  this.basedOn = data?.BasedOn
  this.songBooks =
    data.SongBooks.length > 0 ? data.SongBooks.map((item) => new SongBookData(item)) : []
  this.songTheme = data?.SongTheme
  this.approved = data?.Approved
}

function SongBookDBData(data) {
  this.id = data?._id
  this.name = data?.Name
}

function SongBookData(data) {
  this.songBook = data?.SongBook && new SongBookDBData(data?.SongBook)
  this.songBookName = data?.SongBookName
  this.number = data?.Number
}

function AuthorDBData(data) {
  this.id = data?.Id
  this.name = data?.Name
  this.lastName = data?.LastName
}

function AuthorTypeBDData(data) {
  this.id = data?.Id
  this.type = data?.Type
}

function AuthorData(data) {
  this.author = data?.Author && new AuthorDBData(data?.Author)
  this.authorType = data?.AuthorType && new AuthorTypeBDData(data?.AuthorType)
}

function ChordData(data) {
  this.beginning = data?.Beginning
  this.end = data?.End
  this.type = data?.Type
  this.decoration = data?.Decoration
}

function VerseOrderData(data) {
  this.verseTitle = data?.VerseTitle
  this.order = data?.Order
}

function VerseLineData(data) {
  this.lineNumber = data?.LineNumber
  this.letter = data?.Letter
  this.chords = data.Chords.length > 0 ? data.Chords.map((chore) => new ChordData(chore)) : []
}

function VerseData(data) {
  this.type = data?.Type
  this.title = data?.Title
  this.lines = data.Lines.length > 0 ? data.Lines.map((line) => new VerseLineData(line)) : []
}

function ChordAPIData(data) {
  this.Beginning = data?.beginning
  this.End = data?.end
  this.Type = data?.type
  this.Decoration = data?.decoration
}

function VerseOrderApiData(data) {
  this.VerseTitle = data?.verseTitle
  this.Order = data?.order
}

const getAuthorData = (authorData) => {
  if (Array.isArray(authorData)) {
    const newAuthors = authorData.map((item) => {
      if (item.author.id && item.authorType.id) {
        return {
          Author: { Id: item.author.id, Name: item.author.name, LastName: item.author.lastName },
          AuthorType: { Id: item.authorType.id, Type: item.authorType.type }
        }
      }
    })
    return newAuthors.filter((author) => author !== undefined)
  } else {
    return []
  }
}

const getSongBookData = (songBookData) => {
  if (Array.isArray(songBookData)) {
    return songBookData.map((songBook) => {
      if (songBook.songBook.id) {
        const songBookData = { Id: songBook.songBook.id, Name: songBook.songBook.name }
        return {
          SongBook: songBookData,
          SongBookName: songBook.songBook.name,
          Number: songBook.number
        }
      }
    })
  } else {
    return []
  }
}

const getChordData = (chordData) => {
  if (Array.isArray(chordData)) {
    return chordData.map((chord) => {
      return new ChordAPIData(chord)
    })
  } else {
    return null
  }
}

const getVerseLineData = (verseLineData) => {
  return {
    LineNumber: verseLineData.lineNumber,
    Letter: verseLineData.letter,
    Chords: verseLineData.chords.map((lineItem) => new ChordAPIData(lineItem))
  }
}

const getVerseData = (verseData) => {
  if (Array.isArray(verseData)) {
    return verseData.map((verse) => {
      return {
        Title: verse.title,
        Type: verse.type,
        Lines: verse.lines.map((verseItem) => getVerseLineData(verseItem))
      }
    })
  } else {
    return []
  }
}

const getVerseOrderData = (verseOrderData) => {
  if (!Array.isArray(verseOrderData)) return []
  return verseOrderData.map((item) => {
    const verse = new VerseOrderApiData(item)
    return verse
  })
}

/**
 * Song List.
 *
 * @return {Object}
 */
exports.songList = [
  function (req, res) {
    try {
      Song.find({ Deleted: false }).then((songs) => {
        if (songs.length > 0) {
          const songList = songs.map((song) => new SongData(song))
          return apiResponse.successResponseWithData(res, 'Operation success', songList)
        } else {
          return apiResponse.successResponseWithData(res, 'Operation success', [])
        }
      })
    } catch (err) {
      return apiResponse.errorResponse(res, err)
    }
  }
]

/**
 * Song List Light
 *
 * @return {Object}
 */
exports.songListLightActive = [
  function (req, res) {
    try {
      Song.find({ Active: true, Deleted: false }).then((songs) => {
        if (songs.length > 0) {
          const songListLight = songs.map((song) => new SongLightData(song))
          return apiResponse.successResponseWithData(res, 'Operation success', songListLight)
        } else {
          return apiResponse.successResponseWithData(res, 'Operation success', [])
        }
      })
    } catch (err) {
      return apiResponse.errorResponse(res, err)
    }
  }
]

/**
 * Song List Light
 *
 * @return {Object}
 */
exports.songListLightNotDelete = [
  auth,
  function (req, res) {
    try {
      Song.find({ Deleted: false }).then((songs) => {
        if (songs.length > 0) {
          const songListLight = songs.map((song) => new SongLightData(song))
          return apiResponse.successResponseWithData(res, 'Operation success', songListLight)
        } else {
          return apiResponse.successResponseWithData(res, 'Operation success', [])
        }
      })
    } catch (err) {
      return apiResponse.errorResponse(res, err)
    }
  }
]

/**
 * Song Detail.
 *
 * @param {string}      id
 *
 * @return {Object}
 */
exports.songDetail = [
  auth,
  function (req, res) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return apiResponse.successResponseWithData(res, 'Operation success', {})
    }
    try {
      Song.findById(req.params.id).then((song) => {
        if (song !== null) {
          const songData = new SongData(song)
          return apiResponse.successResponseWithData(res, 'Operation success', songData)
        } else {
          return apiResponse.successResponseWithData(res, 'Operation success', {})
        }
      })
    } catch (err) {
      // throw error in json response with status 500.
      return apiResponse.errorResponse(res, err)
    }
  }
]

/**
 * Song Create
 *
 * @param {string}    title required
 * @param {json}      subtitles
 * @param {json}      basedOn
 * @param {json}      songBooks
 * @param {json}      authors
 * @param {json}      songTheme
 * @param {number}    capo
 * @param {json}      baseChord
 * @param {string}    musicUrl
 * @param {json}      verses
 * @param {json}      lyricsVerseOrder
 * @param {json}      presenterVerseOrder
 * @param {json}      chordsVerseOrder
 *
 * @return {Object}
 */
exports.songStore = [
  auth,
  body('title', 'Title must not be empty.').isLength({ min: 1 }).trim(),
  body('subtitles').optional().isArray({ allow_primitives: true }),
  body('basedOn').optional().isArray({ allow_primitives: true }),
  body('songBooks').optional().isArray({ allow_primitives: true }),
  body('authors').optional().isArray({ allow_primitives: true }),
  body('songTheme').optional().isArray({ allow_primitives: true }),
  body('capo').optional().isNumeric(),
  body('baseChord').optional().isObject({ allow_primitives: true }),
  body('musicUrl').optional(),
  body('verses').optional().isArray({ allow_primitives: true }),
  body('lyricsVerseOrder').optional().isArray({ allow_primitives: true }),
  body('presenterVerseOrder').optional().isArray({ allow_primitives: true }),
  body('chordsVerseOrder').optional().isArray({ allow_primitives: true }),
  (req, res) => {
    try {
      const errors = validationResult(req)

      const song = new Song({
        Title: req.body.title,
        Subtitles: req.body.subtitles ? utility.getStringArray(req.body.subtitles) : [],
        BasedOn: req.body.basedOn ? utility.getStringArray(req.body.basedOn) : [],
        SongBooks: req.body.songBooks ? getSongBookData(req.body.songBooks) : [],
        Authors: req.body.authors ? getAuthorData(req.body.authors) : [],
        SongTheme: req.body.songTheme ? utility.getStringArray(req.body.songTheme) : [],
        Capo: req.body.capo || 0,
        BaseChord: req.body.baseChord ? new ChordAPIData(req.body.baseChord) : null,
        MusicURL: req.body.musicURL || '',
        Verses: req.body.verses ? getVerseData(req.body.verses) : [],
        LyricsVerseOrder: req.body.lyricsVerseOrder
          ? getVerseOrderData(req.body.lyricsVerseOrder)
          : [],
        PresenterVerseOrder: req.body.presenterVerseOrder
          ? getVerseOrderData(req.body.presenterVerseOrder)
          : [],
        ChordsVerseOrder: req.body.chordsVerseOrder
          ? getVerseOrderData(req.body.chordsVerseOrder)
          : [],
        Version: 1,
        Active: false,
        Approved: false,
        Deleted: false
      })

      if (!errors.isEmpty()) {
        return apiResponse.validationErrorWithData(
          res,
          `Validation Error. ${req.body.title}`,
          errors.array()
        )
      } else {
        // Save Song.
        song.save(function (err) {
          if (err) return apiResponse.errorResponse(res, err)
          const songData = new SongData(song)
          return apiResponse.successResponseWithData(res, 'Song creation Success.', songData)
        })
      }
    } catch (err) {
      // throw error in json response with status 500.
      return apiResponse.errorResponse(res, err.message)
    }
  }
]

/**
 * Song update.
 *
 * @param {string}      id required
 * @param {string}      title required
 * @param {json}      subtitles
 * @param {json}      basedOn
 * @param {json}      songTheme
 * @param {json}      songBooks
 * @param {string}    musicUrl
 * @param {number}    capo
 *
 * @return {Object}
 */
exports.songUpdate = [
  auth,
  body('title', 'Title must not be empty.').isLength({ min: 1 }).trim(),
  body('subtitles').optional().isArray({ allow_primitives: true }),
  body('basedOn').optional().isArray({ allow_primitives: true }),
  body('songBooks').optional().isArray({ allow_primitives: true }),
  body('authors').optional().isArray({ allow_primitives: true }),
  body('songTheme').optional().isArray({ allow_primitives: true }),
  body('capo').optional().isNumeric(),
  body('baseChord').optional().isObject({ allow_primitives: true }),
  body('musicUrl').optional(),
  body('verses').optional().isArray({ allow_primitives: true }),
  body('lyricsVerseOrder').optional().isArray({ allow_primitives: true }),
  body('presenterVerseOrder').optional().isArray({ allow_primitives: true }),
  body('chordsVerseOrder').optional().isArray({ allow_primitives: true }),
  (req, res) => {
    try {
      const errors = validationResult(req)

      const song = new Song({
        _id: req.params.id,
        Title: req.body.title,
        Subtitles: req.body.subtitles ? utility.getStringArray(req.body.subtitles) : [],
        BasedOn: req.body.basedOn ? utility.getStringArray(req.body.basedOn) : [],
        SongBooks: req.body.songBooks ? getSongBookData(req.body.songBooks) : [],
        Authors: req.body.authors ? getAuthorData(req.body.authors) : [],
        SongTheme: req.body.songTheme ? utility.getStringArray(req.body.songTheme) : [],
        Capo: req.body.capo || 0,
        BaseChord: req.body.baseChord ? new ChordAPIData(req.body.baseChord) : null,
        MusicURL: req.body.musicURL || '',
        Verses: req.body.verses ? getVerseData(req.body.verses) : [],
        LyricsVerseOrder: req.body.lyricsVerseOrder
          ? getVerseOrderData(req.body.lyricsVerseOrder)
          : [],
        PresenterVerseOrder: req.body.presenterVerseOrder
          ? getVerseOrderData(req.body.presenterVerseOrder)
          : [],
        ChordsVerseOrder: req.body.chordsVerseOrder
          ? getVerseOrderData(req.body.chordsVerseOrder)
          : [],
        Version: 1,
        Active: false,
        Approved: false,
        Deleted: false
      })
      if (!errors.isEmpty()) {
        return apiResponse.validationErrorWithData(res, 'Validation Error.', errors.array())
      }
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return apiResponse.validationErrorWithData(res, 'Invalid Error.', 'Invalid ID')
      }
      Song.findById(req.params.id, function (err, foundSong) {
        if (foundSong === null) {
          return apiResponse.notFoundResponse(res, 'Song not exists with this id')
        }
        // update song.
        song.Version = foundSong.Version + 1
        Song.findByIdAndUpdate(req.params.id, song, {}, function (err) {
          if (err) {
            return apiResponse.errorResponse(res, err)
          } else {
            const songData = new SongData(song)
            return apiResponse.successResponseWithData(res, 'Song update Success.', songData)
          }
        })
      })
    } catch (err) {
      // throw error in json response with status 500.
      return apiResponse.errorResponse(res, err.message)
    }
  }
]

/**
 * Song update.
 *
 * @param {string}      idSong required
 * @param {string}      idAuthor required
 * @param {string}      idAuthorType required
 *
 * @return {Object}
 */
exports.songAddAuthor = [
  auth,
  (req, res) => {
    try {
      if (
        !mongoose.Types.ObjectId.isValid(req.params.idSong) ||
        !mongoose.Types.ObjectId.isValid(req.params.idAuthor) ||
        !mongoose.Types.ObjectId.isValid(req.params.idAuthorType)
      ) {
        return apiResponse.validationErrorWithData(res, 'Invalid Error.', 'Invalid ID')
      }
      Song.findById(req.params.idSong, function (err, foundSong) {
        if (foundSong === null) {
          return apiResponse.notFoundResponse(res, 'Song not exists with this id')
        }
        // update song.
        const song = {
          ...foundSong,
          Authors: [
            ...foundSong.Authors,
            { AuthorId: req.params.idAuthor, Type: req.params.idAuthorType }
          ]
        }
        Song.findByIdAndUpdate(req.params.idSong, song, {}, function (err) {
          if (err) {
            return apiResponse.errorResponse(res, err)
          } else {
            const songData = new SongData(song)
            return apiResponse.successResponseWithData(res, 'Song update Success.', songData)
          }
        })
      })
    } catch (err) {
      // throw error in json response with status 500.
      return apiResponse.errorResponse(res, err.message)
    }
  }
]

/**
 * Song update.
 *
 * @param {string}      idSong required
 * @param {string}      idAuthor required
 * @param {string}      idAuthorType required
 *
 * @return {Object}
 */
exports.songRemoveAuthor = [
  auth,
  (req, res) => {
    try {
      if (
        !mongoose.Types.ObjectId.isValid(req.params.idSong) ||
        !mongoose.Types.ObjectId.isValid(req.params.idAuthor) ||
        !mongoose.Types.ObjectId.isValid(req.params.idAuthorType)
      ) {
        return apiResponse.validationErrorWithData(res, 'Invalid Error.', 'Invalid ID')
      }
      Song.findById(req.params.idSong, function (err, foundSong) {
        if (foundSong === null) {
          return apiResponse.notFoundResponse(res, 'Song not exists with this id')
        }
        // update song.
        const song = {
          ...foundSong,
          Authors: foundSong.Authors.filter((author) => {
            return (
              author.AuthorId !== req.params.idAuthor && author.Type !== req.params.idAuthorType
            )
          })
        }
        Song.findByIdAndUpdate(req.params.idSong, song, {}, function (err) {
          if (err) {
            return apiResponse.errorResponse(res, err)
          } else {
            const songData = new SongData(song)
            return apiResponse.successResponseWithData(res, 'Song update Success.', songData)
          }
        })
      })
    } catch (err) {
      // throw error in json response with status 500.
      return apiResponse.errorResponse(res, err.message)
    }
  }
]
