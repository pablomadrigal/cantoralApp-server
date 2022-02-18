/* eslint-disable require-jsdoc */
/* eslint-disable valid-jsdoc */
const Song = require('../models/SongModel');
const {body, validationResult} = require('express-validator');
const {sanitizeBody} = require('express-validator');
const apiResponse = require('../helpers/apiResponse');
const auth = require('../middlewares/jwt');
const utility = require('../helpers/utility');
const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

// Song Schema
function SongData(data) {
  this.id = data._id;
  this.Title = data.Title;
  this.Subtitles = data.Subtitles;
  this.BasedOn = data.BasedOn;
  this.SongBooks = data.SongBooks;
  this.VerseOrder = data.VerseOrder;
  this.SongTheme = data.SongTheme;
  this.ChoresIntro = data.ChoresIntro;
  this.Verses = data.Verses;
  this.History = data.History;
}

// Song Light Schema
function SongLightData(data) {
  this.id = data._id;
  this.Title = data.Title;
  this.Subtitles = data.Subtitles;
  this.BasedOn = data.BasedOn;
  this.SongBooks = data.SongBooks;
  this.SongTheme = data.SongTheme;
}

/**
 * Song List.
 *
 * @return {Object}
 */
exports.songList = [
  auth,
  function(req, res) {
    try {
      Song.find().then((songs) => {
        if (songs.length > 0) {
          return apiResponse.successResponseWithData(
              res,
              'Operation success',
              songs,
          );
        } else {
          return apiResponse.successResponseWithData(
              res,
              'Operation success',
              [],
          );
        }
      });
    } catch (err) {
      return apiResponse.errorResponse(res, err);
    }
  },
];

/**
 * Song List Light
 *
 * @return {Object}
 */
exports.songListLightActive = [
  auth,
  function(req, res) {
    try {
      Song.find({Active: true, Deleted: false}).then((songs) => {
        if (songs.length > 0) {
          const songListLight = songs.map((song) => new SongLightData(song));
          return apiResponse.successResponseWithData(
              res,
              'Operation success',
              songListLight,
          );
        } else {
          return apiResponse.successResponseWithData(
              res,
              'Operation success',
              [],
          );
        }
      });
    } catch (err) {
      return apiResponse.errorResponse(res, err);
    }
  },
];

/**
 * Song List Light
 *
 * @return {Object}
 */
exports.songListLightNotDelete = [
  auth,
  function(req, res) {
    try {
      Song.find({Deleted: false}).then((songs) => {
        if (songs.length > 0) {
          const songListLight = songs.map((song) => new SongLightData(song));
          return apiResponse.successResponseWithData(
              res,
              'Operation success',
              songListLight,
          );
        } else {
          return apiResponse.successResponseWithData(
              res,
              'Operation success',
              [],
          );
        }
      });
    } catch (err) {
      return apiResponse.errorResponse(res, err);
    }
  },
];

/**
 * Song Detail.
 *
 * @param {string}      id
 *
 * @return {Object}
 */
exports.songDetail = [
  auth,
  function(req, res) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return apiResponse.successResponseWithData(res, 'Operation success', {});
    }
    try {
      Song.findById(req.params.id).then((song) => {
        if (song !== null) {
          const songData = new SongData(song);
          return apiResponse.successResponseWithData(
              res,
              'Operation success',
              songData,
          );
        } else {
          return apiResponse.successResponseWithData(
              res,
              'Operation success',
              {},
          );
        }
      });
    } catch (err) {
      // throw error in json response with status 500.
      return apiResponse.errorResponse(res, err);
    }
  },
];

/**
 * Book store.
 *
 * @param {string}      title required
 * @param {string}      subtitles
 * @param {string}      basedOn
 * @param {string}      songTheme
 * @param {string}      history
 *
 * @return {Object}
 */
exports.songStore = [
  auth,
  body('title', 'Title must not be empty.').isLength({min: 1}).trim(),
  sanitizeBody('*').escape(),
  (req, res) => {
    try {
      const errors = validationResult(req);
      const song = new Song({
        Title: req.body.title,
        Subtitles: req.body.subtitles,
        BasedOn: req.body.basedOn,
        SongTheme: req.body.songTheme,
        History: `${req.user.email}/${utility.getDate()}/Create/`,
      });

      if (!errors.isEmpty()) {
        return apiResponse.validationErrorWithData(
            res,
            'Validation Error.',
            errors.array(),
        );
      } else {
        // Save book.
        song.save(function(err) {
          if (err) {
            return apiResponse.errorResponse(res, err);
          }
          const songData = new SongData(song);
          return apiResponse.successResponseWithData(
              res,
              'Song creation Success.',
              songData,
          );
        });
      }
    } catch (err) {
      // throw error in json response with status 500.
      return apiResponse.errorResponse(res, err.message);
    }
  },
];

/**
 * Song update.
 *
 * @param {string}      id required
 * @param {string}      title required
 * @param {string}      subtitles
 * @param {string}      basedOn
 * @param {string}      songTheme
 * @param {string}      history
 *
 * @return {Object}
 */
exports.songUpdate = [
  auth,
  body('title', 'Title must not be empty.').isLength({min: 1}).trim(),
  sanitizeBody('*').escape(),
  (req, res) => {
    try {
      const errors = validationResult(req);
      const song = new Song({
        Title: req.body.title,
        Subtitles: req.body.subtitles,
        BasedOn: req.body.basedOn,
        SongTheme: req.body.songTheme,
      });
      if (!errors.isEmpty()) {
        return apiResponse.validationErrorWithData(
            res,
            'Validation Error.',
            errors.array(),
        );
      } else {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
          return apiResponse.validationErrorWithData(
              res,
              'Invalid Error.',
              'Invalid ID',
          );
        } else {
          Song.findById(req.params.id, function(err, foundSong) {
            if (foundSong === null) {
              return apiResponse.notFoundResponse(
                  res,
                  'Song not exists with this id',
              );
            } else {
              // update song.
              song.History = `${foundSong.History}\n${
                req.user.email
              }/${utility.getDate()}/Update/${JSON.stringify(req.body)}}`;
              Song.findByIdAndUpdate(req.params.id, song, {}, function(err) {
                if (err) {
                  return apiResponse.errorResponse(res, err);
                } else {
                  const songData = new SongData(song);
                  return apiResponse.successResponseWithData(
                      res,
                      'Song update Success.',
                      songData,
                  );
                }
              });
            }
          });
        }
      }
    } catch (err) {
      // throw error in json response with status 500.
      return apiResponse.errorResponse(res, err.message);
    }
  },
];
