const express = require('express')
const authRouter = require('./auth')
const bookRouter = require('./book')
const authorRouter = require('./author')
const mailRouter = require('./mail')
const songRouter = require('./song')
const userRouter = require('./user')
const songBookRouter = require('./songBook')
const authorTypeRouter = require('./authorType')
const songThemeRouter = require('./songTheme')

const app = express()

app.use('/v1/auth/', authRouter)
app.use('/v1/author/', authorRouter)
app.use('/v1/authortype/', authorTypeRouter)
app.use('/v1/book/', bookRouter)
app.use('/v1/mail/', mailRouter)
app.use('/v1/song/theme/', songThemeRouter)
app.use('/v1/song/', songRouter)
app.use('/v1/songbook/', songBookRouter)
app.use('/v1/user/', userRouter)

module.exports = app
