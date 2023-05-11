/* eslint-disable require-jsdoc */
/* eslint-disable valid-jsdoc */
const SongBook = require('../models/SongBookModel')
const { body, validationResult } = require('express-validator')
const { sanitizeBody } = require('express-validator')
const apiResponse = require('../helpers/apiResponse')
const auth = require('../middlewares/jwt')
const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false)

function SongBookData(data) {
  this.id = data._id
  this.name = data.Name
  this.createdAt = data.createdAt
}

/**
 * songBook List.
 *
 * @return {Object}
 */
exports.songBookList = [
  auth,
  function (req, res) {
    try {
      SongBook.find().then((songBooks) => {
        if (songBooks.length > 0) {
          const songBookData = songBooks.map((songBook) => new SongBookData(songBook))
          return apiResponse.successResponseWithData(res, 'Operation success', songBookData)
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
 * SongBook Create.
 *
 * @param {string} name
 *
 * @return {Object}
 */
exports.songBookStore = [
  auth,
  body('name', 'Name must not be empty.').isLength({ min: 1 }).trim(),
  sanitizeBody('*').escape(),
  (req, res) => {
    try {
      const errors = validationResult(req)
      const songBook = new SongBook({
        Name: req.body.name
      })

      if (!errors.isEmpty()) {
        return apiResponse.validationErrorWithData(res, 'Validation Error.', errors.array())
      } else {
        SongBook.findOne({
          Name: req.body.name
        }).then((oldSongBook) => {
          if (oldSongBook) {
            return Promise.reject(new Error('SongBook already exist.'))
          }
        })
        // Save SongBook.
        songBook.save(function (err) {
          if (err) {
            return apiResponse.errorResponse(res, err)
          }
          const songBookData = new SongBookData(songBook)
          return apiResponse.successResponseWithData(res, 'Song Book Add Success.', songBookData)
        })
      }
    } catch (err) {
      // throw error in json response with status 500.
      return apiResponse.errorResponse(res, err)
    }
  }
]

/**
 * SongBook update.
 *
 * @param {string}      name
 *
 * @return {Object}
 */
exports.songBookUpdate = [
  auth,
  body('name', 'Name must not be empty.').isLength({ min: 1 }).trim(),
  sanitizeBody('*').escape(),
  (req, res) => {
    try {
      const errors = validationResult(req)
      const songBook = new SongBook({
        Name: req.body.name,
        _id: req.params.id
      })
      if (!errors.isEmpty()) {
        return apiResponse.validationErrorWithData(res, 'Validation Error.', errors.array())
      }
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return apiResponse.validationErrorWithData(res, 'Invalid Error.', 'Invalid ID')
      }
      SongBook.findById(req.params.id, function (err, foundSongBook) {
        if (foundSongBook === null) {
          return apiResponse.notFoundResponse(res, 'SongBook not exists with this id')
        }
        // update song book.
        SongBook.findByIdAndUpdate(req.params.id, songBook, {}, function (err) {
          if (err) {
            return apiResponse.errorResponse(res, err)
          } else {
            const songBookData = new SongBookData(songBook)
            return apiResponse.successResponseWithData(
              res,
              'Song Book update Success.',
              songBookData
            )
          }
        })
      })
    } catch (err) {
      // throw error in json response with status 500.
      return apiResponse.errorResponse(res, err)
    }
  }
]

/**
 * SongBook Delete.
 *
 * @param {string}      id
 *
 * @return {Object}
 */
exports.songBookDelete = [
  auth,
  function (req, res) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return apiResponse.validationErrorWithData(res, 'Invalid Error.', 'Invalid ID')
    }
    try {
      SongBook.findById(req.params.id, function (err, foundSongBook) {
        if (foundSongBook === null) {
          return apiResponse.notFoundResponse(res, 'SongBook not exists with this id')
        } else {
          // delete book.
          SongBook.findByIdAndRemove(req.params.id, function (err) {
            if (err) {
              return apiResponse.errorResponse(res, err)
            } else {
              return apiResponse.successResponse(res, 'Song Book delete Success.')
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
