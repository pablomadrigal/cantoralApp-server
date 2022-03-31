const express = require('express');
const authRouter = require('./auth');
const bookRouter = require('./book');
const mailRouter = require('./mail');
const songRouter = require('./song');

const app = express();

app.use('/v1/auth/', authRouter);
app.use('/v1/book/', bookRouter);
app.use('/v1/mail/', mailRouter);
app.use('/v1/song/', songRouter);

module.exports = app;
