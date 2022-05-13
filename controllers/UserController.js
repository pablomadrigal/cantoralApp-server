/* eslint-disable require-jsdoc */
/* eslint-disable valid-jsdoc */
const UserModel = require('../models/UserModel');
const apiResponse = require('../helpers/apiResponse');
const auth = require('../middlewares/jwt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

/**
 * Me
 *
 * @return {Object}
 */
exports.me = [
  auth,
  function(req, res) {
    if (req.headers && req.headers.authorization) {
      const authorization = req.headers.authorization.split(' ')[1];
      let decoded;
      try {
        const secret = process.env.JWT_SECRET;
        decoded = jwt.verify(authorization, secret);
      } catch (e) {
        return apiResponse.unauthorizedResponse(
            res,
            'Account do not exist',
        );
      }
      const userId = decoded._id;
      // Fetch the user by id
      console.log(userId);
      UserModel.findOne({_id: userId}).then(function(user) {
        const userData = {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        };
        return apiResponse.successResponseWithData(
            res,
            'Login Success.',
            userData,
        );
      });
    }
  },
];
