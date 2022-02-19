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

function SongBookData(data) {
  this.BookName = data.BookName;
  this.Number = data.Number;
};

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
 * @param {json}      subtitles
 * @param {json}      basedOn
 * @param {json}      songTheme
 * @param {json}      songBooks
 *
 * @return {Object}
 */
exports.songStore = [
  auth,
  body('title', 'Title must not be empty.').isLength({min: 1}).trim(),
  body('subtitles')
      .optional()
      .isJSON({allow_primitives: true}),
  body('basedOn')
      .optional()
      .isJSON({allow_primitives: true}),
  body('songTheme')
      .optional()
      .isJSON({allow_primitives: true}),
  body('songBooks')
      .optional()
      .isJSON({allow_primitives: true}),
  sanitizeBody('*').escape(),
  (req, res) => {
    try {
      let subtitles = [];
      if (req.body.subtitles) {
        subtitles = JSON.parse(req.body.subtitles);
      }

      let basedOn = [];
      if (req.body.basedOn) {
        basedOn = JSON.parse(req.body.basedOn);
      }

      let songThemes = [];
      if (req.body.songTheme) {
        songThemes = JSON.parse(req.body.songTheme);
      }

      let songBooksJSON = null;
      let songBooks = [];
      if (req.body.songBooks) {
        songBooksJSON = JSON.parse(req.body.songBooks);
        songBooks=songBooksJSON.map((songBook) =>{
          return new SongBookData(songBook);
        });
      }

      const errors = validationResult(req);
      const song = new Song({
        Title: req.body.title,
        Subtitles: subtitles,
        BasedOn: basedOn,
        SongTheme: songThemes,
        SongBooks: songBooks,
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
 * @param {json}      subtitles
 * @param {json}      basedOn
 * @param {json}      songTheme
 * @param {json}      songBooks
 *
 * @return {Object}
 */
exports.songUpdate = [
  auth,
  body('title', 'Title must not be empty.').isLength({min: 1}).trim(),
  body('subtitles')
      .optional()
      .isJSON({allow_primitives: true}),
  body('basedOn')
      .optional()
      .isJSON({allow_primitives: true}),
  body('songTheme')
      .optional()
      .isJSON({allow_primitives: true}),
  body('songBooks')
      .optional()
      .isJSON({allow_primitives: true}),
  sanitizeBody('*').escape(),
  (req, res) => {
    try {
      let subtitles = [];
      if (req.body.subtitles) {
        subtitles = JSON.parse(req.body.subtitles);
      }

      let basedOn = [];
      if (req.body.basedOn) {
        basedOn = JSON.parse(req.body.basedOn);
      }

      let songThemes = [];
      if (req.body.songTheme) {
        songThemes = JSON.parse(req.body.songTheme);
      }

      let songBooksJSON = null;
      let songBooks = [];
      if (req.body.songBooks) {
        songBooksJSON = JSON.parse(req.body.songBooks);
        songBooks=songBooksJSON.map((songBook) =>{
          return new SongBookData(songBook);
        });
      }

      const errors = validationResult(req);
      const song = new Song({
        Title: req.body.title,
        Subtitles: subtitles,
        BasedOn: basedOn,
        SongTheme: songThemes,
        SongBooks: songBooks,
        _id: req.params.id,
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
              song.History = `${foundSong.History}\n${
                req.user.email
              }/${utility.getDate()}/Update/${JSON.stringify(req.body)}}`;

              // update song.
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
