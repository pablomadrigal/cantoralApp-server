// During the automated test the env variable, We will set it to "test"
const TEST_MONGODB_URL = process.env.TEST_MONGODB_URL

process.env.NODE_ENV = 'test'
process.env.MONGODB_URL = `${TEST_MONGODB_URL}/test?retryWrites=true&w=majority`

// Require the dev-dependencies
const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../app')
const should = chai.should()
chai.use(chaiHttp)

// Export this to use in multiple files
module.exports = {
  chai: chai,
  server: server,
  should: should
}
