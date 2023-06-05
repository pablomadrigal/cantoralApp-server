const SongTheme = require('../models/SongThemeModel')
const { body, validationResult } = require('express-validator')
const { sanitizeBody } = require('express-validator')
const apiResponse = require('../helpers/apiResponse')
const auth = require('../middlewares/jwt')
const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false)

// Song Theme Schema
function SongThemeData(data) {
  this.id = data._id
  this.name = data.Name
}

/**
 * Author type List.
 *
 * @return {Object}
 */
exports.songThemeList = [
  auth,
  function (req, res) {
    try {
      SongTheme.find().then((songThemes) => {
        if (songThemes.length > 0) {
          const songThemeData = songThemes.map((songTheme) => new SongThemeData(songTheme))
          return apiResponse.successResponseWithData(res, 'Operation success', songThemeData)
        } else {
          return apiResponse.successResponseWithData(res, 'Operation success', [])
        }
      })
    } catch (err) {
      // throw error in json response with status 500.
      return apiResponse.errorResponse(res, err)
    }
  }
]

/**
 * Author Create.
 *
 * @param {string}      name
 *
 * @return {Object}
 */
exports.songThemeCreate = [
  auth,
  body('name', 'Name must not be empty.').isLength({ min: 1 }).trim(),
  sanitizeBody('*').escape(),
  (req, res) => {
    try {
      const errors = validationResult(req)
      const songTheme = new SongTheme({
        Name: req.body.name
      })

      if (!errors.isEmpty()) {
        return apiResponse.validationErrorWithData(res, 'Validation Error.', errors.array())
      } else {
        SongTheme.findOne({
          Name: req.body.name
        }).then((oldTheme) => {
          if (oldTheme) {
            return apiResponse.errorResponse(res, 'Song Theme type already exists')
          }
        })
        // Save Author.
        songTheme.save(function (err) {
          if (err) {
            return apiResponse.errorResponse(res, err)
          }
          const songThemeData = new SongThemeData(songTheme)
          return apiResponse.successResponseWithData(res, 'Song theme add Success.', songThemeData)
        })
      }
    } catch (err) {
      // throw error in json response with status 500.
      return apiResponse.errorResponse(res, err)
    }
  }
]

/**
 * Author Delete.
 *
 * @param {string}      id
 *
 * @return {Object}
 */
exports.songThemeDelete = [
  auth,
  function (req, res) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return apiResponse.validationErrorWithData(res, 'Invalid Error.', 'Invalid ID')
    }
    try {
      SongTheme.findById(req.params.id, function (err, foundSongTheme) {
        if (foundSongTheme === null) {
          return apiResponse.notFoundResponse(res, 'Song Theme not exists with this id')
        } else {
          // delete book.
          SongTheme.findByIdAndRemove(req.params.id, function (err) {
            if (err) {
              return apiResponse.errorResponse(res, err)
            } else {
              return apiResponse.successResponse(res, 'Song Theme delete Success.')
            }
          })
        }
      })
    } catch (err) {
      // throw error in json response with status 500.
      return apiResponse.errorResponse(res, err)
    }
  }
]
