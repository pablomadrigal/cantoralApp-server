const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    isConfirmed: { type: Boolean, required: true, default: 0 },
    confirmOTP: { type: String, required: false },
    otpTries: { type: Number, required: false, default: 0 },
    status: { type: Boolean, required: true, default: 1 },
    isAdmin: { type: Boolean, required: true, default: 0 },
    permitions: { type: [String], required: true, default: [] },
    databaseName: { type: String, required: true, default: 'dev' }
  },
  { timestamps: true }
)

// Virtual for user's full name
UserSchema.virtual('fullName').get(function () {
  return firstName + ' ' + lastName
})

const myAdminDB = mongoose.connection.useDb('usersAdmin')

module.exports = myAdminDB.model('User', UserSchema)
