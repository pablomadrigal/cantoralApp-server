const { chai, server } = require('./testConfig')
const AuthorTypeModel = require('../models/AuthorTypeModel')

/**
 * Test cases to test all the author APIs
 * Covered Routes:
 * (1) Login
 * (2) Store author
 * (3) Get all authors
 * (4) Delete author
 */

describe('AuthorType', () => {
  // Before each test we empty the database
  before((done) => {
    AuthorTypeModel.deleteMany({}, (err) => {
      done()
    })
  })

  // Prepare data for testing
  const userTestData = {
    password: 'Test@123',
    email: 'maitraysuthar@test12345.com'
  }

  // Prepare data for testing
  const testData = {
    type: 'Canta Autor'
  }

  /*
   * Test the /POST route
   */
  describe('/POST Login', () => {
    it('it should do user Login for author', (done) => {
      chai
        .request(server)
        .post('/api/v1/auth/login')
        .send({ email: userTestData.email, password: userTestData.password })
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.have.property('message').eql('Login Success.')
          userTestData.token = res.body.data.token
          done()
        })
    })
  })

  /*
   * Test the /POST route
   */
  describe('/POST Create Author', () => {
    it('It should send validation error for creating author', (done) => {
      chai
        .request(server)
        .post('/api/v1/authortype')
        .send()
        .set('Authorization', 'Bearer ' + userTestData.token)
        .end((err, res) => {
          res.should.have.status(400)
          done()
        })
    })
  })

  /*
   * Test the /POST route
   */
  describe('/POST Create Author Type', () => {
    it('It should create author type', (done) => {
      chai
        .request(server)
        .post('/api/v1/authortype')
        .send(testData)
        .set('Authorization', 'Bearer ' + userTestData.token)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.have.property('message').eql('Author type add Success.')
          done()
        })
    })
  })

  /*
   * Test the /GET route
   */
  describe('/GET All author types', () => {
    it('it should GET all the author types', (done) => {
      chai
        .request(server)
        .get('/api/v1/authortype')
        .set('Authorization', 'Bearer ' + userTestData.token)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.have.property('message').eql('Operation success')
          testData._id = res.body.data[0]._id
          done()
        })
    })
  })

  /*
   * Test the /DELETE/:id route
   */
  describe('/DELETE/:id author type', () => {
    it('it should DELETE the author type', (done) => {
      chai
        .request(server)
        .delete('/api/v1/authortype/' + testData._id)
        .set('Authorization', 'Bearer ' + userTestData.token)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.have.property('message').eql('Author Type delete Success.')
          done()
        })
    })
  })
})
