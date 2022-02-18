const express = require('express');
const authRouter = require('./auth');
const bookRouter = require('./book');
const mailRouter = require('./mail');
const songRouter = require('./song');

const app = express();

app.use('/auth/', authRouter);
app.use('/book/', bookRouter);
app.use('/mail/', mailRouter);
app.use('/song/', songRouter);

module.exports = app;
