const { chai, server } = require('./testConfig')
const SongBookModel = require('../models/SongBookModel')

/**
 * Test cases to test all the song book APIs
 * Covered Routes:
 * (1) Login
 * (2) Create Song Book
 * (3) Get all song books
 * (4) Update song book
 * (5) Delete song book
 */

describe('Song Book', () => {
  // Before each test we empty the database
  before((done) => {
    SongBookModel.deleteMany({}, (err) => {
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
    name: 'CantoralApp',
  }

  /*
   * Test the /POST route
   */
  describe('/POST Login', () => {
    it('it should do user Login for Song Book', (done) => {
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
  describe('/POST Create Song Book', () => {
    it('It should send validation error for creating song Book', (done) => {
      chai
        .request(server)
        .post('/api/v1/songbook')
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
  describe('/POST Create Song Book', () => {
    it('It should create song Book', (done) => {
      chai
        .request(server)
        .post('/api/v1/songbook')
        .send(testData)
        .set('Authorization', 'Bearer ' + userTestData.token)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.have.property('message').eql('Song Book Add Success.')
          done()
        })
    })
  })

  /*
   * Test the /GET route
   */
  describe('/GET All Song Books', () => {
    it('it should GET all the Song Books', (done) => {
      chai
        .request(server)
        .get('/api/v1/songbook')
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
   * Test the /PUT/:id route
   */
  describe('/PUT/:id Song Book', () => {
    it('it should PUT the Song Book details', (done) => {
      chai
        .request(server)
        .put('/api/v1/songbook/' + testData._id)
        .send(testData)
        .set('Authorization', 'Bearer ' + userTestData.token)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.have.property('message').eql('Song Book update Success.')
          done()
        })
    })
  })

  /*
   * Test the /DELETE/:id route
   */
  describe('/DELETE/:id Song Book', () => {
    it('it should DELETE the Song Book', (done) => {
      chai
        .request(server)
        .delete('/api/v1/songbook/' + testData._id)
        .set('Authorization', 'Bearer ' + userTestData.token)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.have.property('message').eql('Song Book delete Success.')
          done()
        })
    })
  })
})
