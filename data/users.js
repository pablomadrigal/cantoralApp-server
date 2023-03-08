const bcrypt = require('bcrypt');

module.exports = [
  {
    firstName: 'Pablo',
    lastName: 'Madrigal',
    email: 'me@pablomadrigal.com',
    password: bcrypt.hashSync('Test@123', 10),
    isConfirmed: 1,
    confirmOTP: '652',
    otpTries: 0,
    status: 1,
    isAdmin: 1,
  },
  {
    firstName: 'Pablo',
    lastName: 'Test',
    email: 'test@pablomadrigal.com',
    password: bcrypt.hashSync('Test@123', 10),
    isConfirmed: 1,
    confirmOTP: '652',
    otpTries: 0,
    status: 1,
    isAdmin: 0,
  },
];

