const { chai, server } = require('./testConfig')
const SongThemeModel = require('../models/SongThemeModel')

/**
 * Test cases to test all the song Theme APIs
 * Covered Routes:
 * (1) Login
 * (2) Create Song Theme
 * (3) Get all song Themes
 * (4) Delete song Theme
 */

describe('Song Theme', () => {
  // Before each test we empty the database
  before((done) => {
    SongThemeModel.deleteMany({}, (err) => {
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
    name: 'Alabanza'
  }

  /*
   * Test the /POST route
   */
  describe('/POST Login', () => {
    it('it should do user Login for Song Theme', (done) => {
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
  describe('/POST Create Song Theme', () => {
    it('It should send validation error for creating song Theme', (done) => {
      chai
        .request(server)
        .post('/api/v1/song/theme')
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
  describe('/POST Create Song Theme', () => {
    it('It should create song Theme', (done) => {
      chai
        .request(server)
        .post('/api/v1/song/theme')
        .send(testData)
        .set('Authorization', 'Bearer ' + userTestData.token)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.have.property('message').eql('Song theme add Success.')
          done()
        })
    })
  })

  /*
   * Test the /GET route
   */
  describe('/GET All Song Themes', () => {
    it('it should GET all the Song Themes', (done) => {
      chai
        .request(server)
        .get('/api/v1/song/theme')
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
  describe('/DELETE/:id Song Theme', () => {
    it('it should DELETE the Song Theme', (done) => {
      chai
        .request(server)
        .delete('/api/v1/song/theme/' + testData._id)
        .set('Authorization', 'Bearer ' + userTestData.token)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.have.property('message').eql('Song Theme delete Success.')
          done()
        })
    })
  })
})
