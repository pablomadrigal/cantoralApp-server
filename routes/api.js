var express = require("express");
var authRouter = require("./auth");
var bookRouter = require("./book");
var mailRouter = require("./mail");
var songRouter = require("./song");

var app = express();

app.use("/auth/", authRouter);
app.use("/book/", bookRouter);
app.use("/mail/", mailRouter);
app.use("/song/", songRouter);

module.exports = app;
