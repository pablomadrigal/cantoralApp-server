/* eslint-disable require-jsdoc */
/* eslint-disable valid-jsdoc */
const Song = require('../models/SongModel')
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
  this.id = data._id
  this.title = data.Title
  this.subtitles = data.Subtitles
  this.basedOn = data.BasedOn
  this.songBooks = data.SongBooks
  this.authors = data.Authors
  this.songTheme = data.SongTheme
  this.capo = data.Capo
  this.baseChord = data.BaseChord
  this.musicURL = data.MusicURL
  this.verses = data.Verses
  this.lyricsVerseOrder = data.LyricsVerseOrder
  this.presenterVerseOrder = data.PresenterVerseOrder
  this.choresVerseOrder = data.ChoresVerseOrder
  this.version = data.Version
  this.approved = data.Approved
  this.active = data.Active
}

// Song Light Schema
function SongLightData(data) {
  this.id = data._id
  this.Title = data.Title
  this.Subtitles = data.Subtitles
  this.BasedOn = data.BasedOn
  this.SongBooks = data.SongBooks
  this.SongTheme = data.SongTheme
  this.approved = data.Approved
}

function SongBookData(data) {
  this.bookName = data.BookName
  this.number = data.Number
}

function AuthorData(data) {
  this.author = data.Author
  this.authorType = data.AuthorType
}

function ChordData(data) {
  this.beginning = data.Beginning
  this.end = data.End
  this.type = data.Type
  this.decoration = data.Decoration
}

function ChordAPIData(data) {
  this.Beginning = data.beginning
  this.End = data.end
  this.Type = data.type
  this.Decoration = data.decoration
}

function VerseOrderApiData(data) {
  this.VerseTitle = data.verseTitle
  this.Order = data.order
}

getAuthorData = function (authorData) {
  try {
    const authorsJSON = JSON.parse(authorData)
    if (Array.isArray(authorsJSON)) {
      return authorsJSON.map((author) => {
        return {
          Author: author.author,
          AuthorType: author.authorType
        }
      })
    } else {
      return []
    }
  } catch (e) {
    return []
  }
}

getSongBookData = function (songBookData) {
  try {
    const songBookJSON = JSON.parse(songBookData)
    if (Array.isArray(songBookJSON)) {
      return songBookJSON.map((songBook) => {
        return {
          BookName: songBook.bookName,
          Number: songBook.number
        }
      })
    } else {
      return []
    }
  } catch (e) {
    return []
  }
}

getChordData = function (chordData) {
  try {
    const chordJSON = JSON.parse(chordData)
    if (Array.isArray(chordJSON)) {
      return chordJSON.map((chord) => {
        return new ChordAPIData(chord)
      })
    } else {
      return null
    }
  } catch (e) {
    return null
  }
}

getVerseLineData = function (verseLineData) {
  return {
    LineNumber: verseLineData.lineNumber,
    Letter: verseLineData.letter,
    Chores: verseLineData.chores.map((lineItem) => new ChordAPIData(lineItem))
  }
}

getVerseData = function (verseData) {
  try {
    const verseJSON = JSON.parse(verseData)
    if (Array.isArray(verseJSON)) {
      return verseJSON.map((verse) => {
        return {
          Title: verse.title,
          Type: verse.type,
          Lines: verse.map((verseItem) => getVerseLineData(verseItem))
        }
      })
    } else {
      return []
    }
  } catch (e) {
    return []
  }
}

getVerseOrderData = function (verseOrderData) {
  try {
    const array = JSON.parse(verseOrderData)
    if (!Array.isArray(array)) return []
    return array.map((item) => new VerseOrderApiData(item))
  } catch (error) {
    return []
  }
}

/**
 * Song List.
 *
 * @return {Object}
 */
exports.songList = [
  function (req, res) {
    try {
      Song.find({ Active: true, Deleted: false }).then((songs) => {
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
 * @param {json}      choresVerseOrder
 *
 * @return {Object}
 */
exports.songStore = [
  auth,
  body('title', 'Title must not be empty.').isLength({ min: 1 }).trim(),
  body('subtitles').optional().isJSON({ allow_primitives: true }),
  body('basedOn').optional().isJSON({ allow_primitives: true }),
  body('songBooks').optional().isJSON({ allow_primitives: true }),
  body('authors').optional().isJSON({ allow_primitives: true }),
  body('songTheme').optional().isJSON({ allow_primitives: true }),
  body('capo').optional().isNumeric(),
  body('baseChord').optional().isJSON({ allow_primitives: true }),
  body('musicUrl').optional(),
  body('verses').optional().isJSON({ allow_primitives: true }),
  body('lyricsVerseOrder').optional().isJSON({ allow_primitives: true }),
  body('presenterVerseOrder').optional().isJSON({ allow_primitives: true }),
  body('choresVerseOrder').optional().isJSON({ allow_primitives: true }),
  sanitizeBody('*').escape(),
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
        Capo: req.body.capo | 0,
        BaseChord: req.body.baseChord ? getChordData(req.body.baseChord) : null,
        MusicURL: req.body.musicUrl | '',
        Verses: req.body.verses ? getVerseData(req.body.verses) : [],
        LyricsVerseOrder: req.body.lyricsVerseOrder
          ? getVerseOrderData(req.body.lyricsVerseOrder)
          : [],
        PresenterVerseOrder: req.body.presenterVerseOrder
          ? getVerseOrderData(req.body.presenterVerseOrder)
          : [],
        ChoresVerseOrder: req.body.choresVerseOrder
          ? getVerseOrderData(req.body.choresVerseOrder)
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
        // Save book.
        song.save(function (err) {
          if (err) {
            return apiResponse.errorResponse(res, err)
          }
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
  body('subtitles').optional().isJSON({ allow_primitives: true }),
  body('basedOn').optional().isJSON({ allow_primitives: true }),
  body('songTheme').optional().isJSON({ allow_primitives: true }),
  body('songBooks').optional().isJSON({ allow_primitives: true }),
  body('musicUrl').optional(),
  body('capo').optional().isNumeric(),
  sanitizeBody('*').escape(),
  (req, res) => {
    try {
      let subtitles = []
      if (req.body.subtitles) {
        subtitles = JSON.parse(req.body.subtitles)
      }

      let basedOn = []
      if (req.body.basedOn) {
        basedOn = JSON.parse(req.body.basedOn)
      }

      let songThemes = []
      if (req.body.songTheme) {
        songThemes = JSON.parse(req.body.songTheme)
      }

      let songBooksJSON = null
      let songBooks = []
      if (req.body.songBooks) {
        songBooksJSON = JSON.parse(req.body.songBooks)
        songBooks = songBooksJSON.map((songBook) => {
          return new SongBookData(songBook)
        })
      }

      const errors = validationResult(req)
      const song = new Song({
        Title: req.body.title,
        Subtitles: subtitles,
        BasedOn: basedOn,
        SongTheme: songThemes,
        SongBooks: songBooks,
        MusicURL: req.body.musicUrl | '',
        Capo: req.body.capo | 0,
        _id: req.params.id
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
