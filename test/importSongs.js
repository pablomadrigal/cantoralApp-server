/* eslint-disable require-jsdoc */
const Song = require('../models/SongModel');
const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

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

mongoose.connect('mongodb://localhost/test');

const Schema = mongoose.Schema;
const clubSchema = new Schema({
  name: String,
});

const Club = mongoose.model('Club', clubSchema);

// Now, the interesting part:
data = [
  {'name': 'Barcelona'},
  {'name': 'Real Madrid'},
  {'name': 'Valencia'},
];
Club.collection.insertMany(data, function(err, r) {
  assert.equal(null, err);
  assert.equal(3, r.insertedCount);

  db.close();
});
