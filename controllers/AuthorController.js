const Author = require('../models/AuthorModel')
const { body, validationResult } = require('express-validator')
const { sanitizeBody } = require('express-validator')
const apiResponse = require('../helpers/apiResponse')
const auth = require('../middlewares/jwt')
const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false)

// Author Schema
function AuthorData(data) {
  this.id = data._id
  this.name = data.Name
  this.lastName = data.LastName
  this.createdAt = data.createdAt
}

/**
 * Author List.
 *
 * @return {Object}
 */
exports.authorList = [
  auth,
  function (req, res) {
    try {
      Author.find().then((authors) => {
        if (authors.length > 0) {
          const authorData = authors.map((author) => {
            return new AuthorData(author)
          })
          return apiResponse.successResponseWithData(res, 'Operation success', authorData)
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
 * Author Detail.
 *
 * @param {string}      name
 *
 * @return {Object}
 */
exports.authorDetail = [
  auth,
  function (req, res) {
    try {
      Author.findById(req.params.id).then((author) => {
        if (author !== null) {
          console.log('success')
          const authorData = new AuthorData(author)
          return apiResponse.successResponseWithData(res, 'Operation success', authorData)
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
 * Author Create.
 *
 * @param {string}      name
 * @param {string}      lastName
 *
 * @return {Object}
 */
exports.authorStore = [
  auth,
  body('name', 'Name must not be empty.').isLength({ min: 1 }).trim(),
  body('lastName', 'Last name can be empty.').optional(),
  sanitizeBody('*').escape(),
  (req, res) => {
    try {
      const errors = validationResult(req)
      const author = new Author({
        Name: req.body.name,
        LastName: req.body.lastName
      })

      if (!errors.isEmpty()) {
        return apiResponse.validationErrorWithData(res, 'Validation Error.', errors.array())
      } else {
        Author.findOne({
          Name: req.body.name,
          LastName: req.body.lastName
        }).then((oldAuthor) => {
          if (oldAuthor) {
            return Promise.reject(new Error('Author already exist.'))
          }
        })
        // Save Author.
        author.save(function (err) {
          if (err) {
            return apiResponse.errorResponse(res, err)
          }
          const authorData = new AuthorData(author)
          return apiResponse.successResponseWithData(res, 'Author add Success.', authorData)
        })
      }
    } catch (err) {
      // throw error in json response with status 500.
      return apiResponse.errorResponse(res, err)
    }
  }
]

/**
 * Author update.
 *
 * @param {string}      name
 * @param {string}      lastName
 *
 * @return {Object}
 */
exports.authorUpdate = [
  auth,
  body('name', 'Name must not be empty.').isLength({ min: 1 }).trim(),
  body('lastName', 'Last name can be empty.').optional(),
  sanitizeBody('*').escape(),
  (req, res) => {
    try {
      const errors = validationResult(req)
      const author = new Author({
        Name: req.body.name,
        LastName: req.body.lastName,
        _id: req.params.id
      })
      if (!errors.isEmpty()) {
        return apiResponse.validationErrorWithData(res, 'Validation Error.', errors.array())
      }
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return apiResponse.validationErrorWithData(res, 'Invalid Error.', 'Invalid ID')
      }
      Author.findById(req.params.id, function (err, foundAuthor) {
        if (foundAuthor === null) {
          return apiResponse.notFoundResponse(res, 'Author not exists with this id')
        }
        // update author.
        Author.findByIdAndUpdate(req.params.id, author, {}, function (err) {
          if (err) {
            return apiResponse.errorResponse(res, err)
          } else {
            const authorData = new AuthorData(author)
            return apiResponse.successResponseWithData(res, 'Author update Success.', authorData)
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
 * Author Delete.
 *
 * @param {string}      id
 *
 * @return {Object}
 */
exports.authorDelete = [
  auth,
  function (req, res) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return apiResponse.validationErrorWithData(res, 'Invalid Error.', 'Invalid ID')
    }
    try {
      Author.findById(req.params.id, function (err, foundAuthor) {
        if (foundAuthor === null) {
          return apiResponse.notFoundResponse(res, 'Author not exists with this id')
        } else {
          // delete book.
          Author.findByIdAndRemove(req.params.id, function (err) {
            if (err) {
              return apiResponse.errorResponse(res, err)
            } else {
              return apiResponse.successResponse(res, 'Author delete Success.')
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
