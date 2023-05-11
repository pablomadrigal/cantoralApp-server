const AuthorType = require('../models/AuthorTypeModel')
const { body, validationResult } = require('express-validator')
const { sanitizeBody } = require('express-validator')
const apiResponse = require('../helpers/apiResponse')
const auth = require('../middlewares/jwt')
const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false)

// AuthorType Schema
function AuthorTypeData(data) {
  this.id = data._id
  this.type = data.Type
}

/**
 * Author type List.
 *
 * @return {Object}
 */
exports.authorTypeList = [
  auth,
  function (req, res) {
    try {
      AuthorType.find().then((authorTypes) => {
        if (authorTypes.length > 0) {
          const authorTypesData = authorTypes.map((authorType) => {
            return new AuthorTypeData(authorType)
          })
          return apiResponse.successResponseWithData(res, 'Operation success', authorTypesData)
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
 * @param {string}      type
 *
 * @return {Object}
 */
exports.authorTypeCreate = [
  auth,
  body('type', 'Type must not be empty.').isLength({ min: 1 }).trim(),
  sanitizeBody('*').escape(),
  (req, res) => {
    try {
      const errors = validationResult(req)
      const authorType = new AuthorType({
        Type: req.body.type
      })

      if (!errors.isEmpty()) {
        return apiResponse.validationErrorWithData(res, 'Validation Error.', errors.array())
      } else {
        AuthorType.findOne({
          Type: req.body.type
        }).then((oldAuthor) => {
          if (oldAuthor) {
            return apiResponse.errorResponse(res, 'Author type already exists')
          }
        })
        // Save Author.
        authorType.save(function (err) {
          if (err) {
            return apiResponse.errorResponse(res, err)
          }
          const authorTypeData = new AuthorTypeData(authorType)
          return apiResponse.successResponseWithData(
            res,
            'Author type add Success.',
            authorTypeData
          )
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
exports.authorTypeDelete = [
  auth,
  function (req, res) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return apiResponse.validationErrorWithData(res, 'Invalid Error.', 'Invalid ID')
    }
    try {
      AuthorType.findById(req.params.id, function (err, foundAuthor) {
        if (foundAuthor === null) {
          return apiResponse.notFoundResponse(res, 'Author Type not exists with this id')
        } else {
          // delete AuthorType.
          AuthorType.findByIdAndRemove(req.params.id, function (err) {
            if (err) {
              return apiResponse.errorResponse(res, err)
            } else {
              return apiResponse.successResponse(res, 'Author Type delete Success.')
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
