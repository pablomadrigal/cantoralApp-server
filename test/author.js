const { chai, server } = require('./testConfig')
const BookModel = require('../models/BookModel')
const AuthorModel = require('../models/AuthorModel')

/**
 * Test cases to test all the author APIs
 * Covered Routes:
 * (1) Login
 * (2) Store author
 * (3) Get all books
 * (4) Get single author
 * (5) Update author
 * (6) Delete author
 */

describe('Author', () => {
  // Before each test we empty the database
  before((done) => {
    AuthorModel.deleteMany({}, (err) => {
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
    name: 'Pablo',
    lastName: 'Madrigal'
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
        .post('/api/v1/author')
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
  describe('/POST Create Author', () => {
    it('It should create author', (done) => {
      chai
        .request(server)
        .post('/api/v1/author')
        .send(testData)
        .set('Authorization', 'Bearer ' + userTestData.token)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.have.property('message').eql('Author add Success.')
          done()
        })
    })
  })

  /*
   * Test the /GET route
   */
  describe('/GET All author', () => {
    it('it should GET all the authors', (done) => {
      chai
        .request(server)
        .get('/api/v1/author')
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
   * Test the /GET/:id route
   */
  describe('/GET/:id author', () => {
    it('it should GET the author details', (done) => {
      chai
        .request(server)
        .get('/api/v1/author/' + testData._id)
        .set('Authorization', 'Bearer ' + userTestData.token)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.have.property('message').eql('Operation success')
          done()
        })
    })
  })

  /*
   * Test the /PUT/:id route
   */
  describe('/PUT/:id author', () => {
    it('it should PUT the author details', (done) => {
      chai
        .request(server)
        .put('/api/v1/author/' + testData._id)
        .send(testData)
        .set('Authorization', 'Bearer ' + userTestData.token)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.have.property('message').eql('Author update Success.')
          done()
        })
    })
  })

  /*
   * Test the /DELETE/:id route
   */
  describe('/DELETE/:id author', () => {
    it('it should DELETE the author', (done) => {
      chai
        .request(server)
        .delete('/api/v1/author/' + testData._id)
        .set('Authorization', 'Bearer ' + userTestData.token)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.have.property('message').eql('Author delete Success.')
          done()
        })
    })
  })
})
