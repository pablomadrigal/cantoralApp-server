const { chai, server } = require('./testConfig')
const SongModel = require('../models/SongModel')
const testData = require('../data/songSampleData')

/**
 * Test cases to test all the song APIs
 * Covered Routes:
 * (1) Login
 * (2) Store Song
 * (3) Get all Songs
 * (4) Get all light Songs
 * (5) Get all light active Songs
 * (6) Get single Song
 * (7) Update Song
 * (8) Delete Song
 */

describe('Song', () => {
  // Before each test we empty the database
  before((done) => {
    SongModel.deleteMany({}, (err) => {
      done()
    })
  })

  // Prepare data for testing
  const userTestData = {
    password: 'Test@123',
    email: 'maitraysuthar@test12345.com'
  }

  /*
   * Test the /POST route
   */
  describe('/POST Login', () => {
    it('it should do user Login for song', (done) => {
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
  describe('/POST Song Store', () => {
    it('It should send validation error for store Song', (done) => {
      chai
        .request(server)
        .post('/api/v1/song')
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
  describe('/POST Song Store', () => {
    it('It should store Song', (done) => {
      chai
        .request(server)
        .post('/api/v1/song')
        .send(testData)
        .set('Authorization', 'Bearer ' + userTestData.token)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.have.property('message').eql('Song add Success.')
          done()
        })
    })
  })

  /*
   * Test the /GET route
   */
  describe('/GET All songs', () => {
    it('it should GET all the songs', (done) => {
      chai
        .request(server)
        .get('/api/v1/song')
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
   * Test the /GET route
   */
  describe('/GET All songs light', () => {
    it('it should GET all the songs', (done) => {
      chai
        .request(server)
        .get('/api/v1/song/light')
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
   * Test the /GET route
   */
  describe('/GET All active songs light', () => {
    it('it should GET all the songs', (done) => {
      chai
        .request(server)
        .get('/api/v1/song/light/active')
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
  describe('/GET/:id song', () => {
    it('it should GET the song', (done) => {
      chai
        .request(server)
        .get('/api/v1/song/' + testData._id)
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
  describe('/PUT/:id song', () => {
    it('it should PUT the song', (done) => {
      chai
        .request(server)
        .put('/api/v1/song/' + testData._id)
        .send(testData)
        .set('Authorization', 'Bearer ' + userTestData.token)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.have.property('message').eql('song update Success.')
          done()
        })
    })
  })

  /*
   * Test the /DELETE/:id route
   */
  describe('/DELETE/:id song', () => {
    it('it should DELETE the songs', (done) => {
      chai
        .request(server)
        .delete('/api/v1/song/' + testData._id)
        .set('Authorization', 'Bearer ' + userTestData.token)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.have.property('message').eql('Song delete Success.')
          done()
        })
    })
  })
})
