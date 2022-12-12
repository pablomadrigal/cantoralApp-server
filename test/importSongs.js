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
  {
    'Title': 'LA ESPADA DEL ESPÍRITU',
    'BasedOn': null,
    'SongBooks': [
      {'CADV2011': 1},
      {'CADV2019': 1},
      {'Jesed2016': '1'},
    ],
    'VerseOrder': ['V1', 'V2', 'V3', 'V4', 'V5', 'V1', 'F1'],
    'SongTheme': [],
    'ChoresIntro': [],
    'Verses': [
      {
        'VerseName': 'V1',
        'Lines': [
          {
            'LineNumber': 0,
            'Chores': [],
            'Letter': 'Dios se_ha forjado con nosotros una_espada',
          },
          {
            'LineNumber': 1,
            'Chores': [],
            'Letter': 'y nos toma_en su derecha poderosa.',
          },
          {
            'LineNumber': 2,
            'Chores': [],
            'Letter': 'Se levanta / el Señor a_hacer la guerra;',
          },
          {
            'LineNumber': 3,
            'Chores': [],
            'Letter': 'con justicia_al enemigo vencerá.',
          },
        ],
      },
      {
        'VerseName': 'V2',
        'Lines': [
          {
            'LineNumber': 0,
            'Chores': [],
            'Letter': 'Y con su fuego_enardeciendo nuestro pecho',
          },
          {
            'LineNumber': 1,
            'Chores': [],
            'Letter': 'sus guerreros avanzamos jubilosos,',
          },
          {
            'LineNumber': 2,
            'Chores': [],
            'Letter': 'a_abatir con mano fuerte_y tenso brazo',
          },
          {
            'LineNumber': 3,
            'Chores': [],
            'Letter': 'a las huestes del mal del enemigo.',
          },
        ],
      },
      {
        'VerseName': 'V3',
        'Lines': [
          {
            'LineNumber': 0,
            'Chores': [],
            'Letter': 'Marchando_al frente de nosotros está_un bravo,',
          },
          {
            'LineNumber': 1,
            'Chores': [],
            'Letter': 'Capitán de gran poder y de gran fuerza:',
          },
          {
            'LineNumber': 2,
            'Chores': [],
            'Letter': 'Jesucristo,_Hijo de Dios, León de Judá↘;',
          },
          {
            'LineNumber': 3,
            'Chores': [],
            'Letter': 'a_él seguimos y_en su Nombre combatimos.',
          },
        ],
      },
      {
        'VerseName': 'V4',
        'Lines': [
          {
            'LineNumber': 0,
            'Chores': [],
            'Letter': 'Y revestidos hemos sido de_armas nobles,',
          },
          {
            'LineNumber': 1,
            'Chores': [],
            'Letter': 'de las armas de la luz del Señor mismo:',
          },
          {
            'LineNumber': 2,
            'Chores': [],
            'Letter': 'armadura / invencible,_escudo fuerte,',
          },
          {
            'LineNumber': 3,
            'Chores': [],
            'Letter': 'y la_espada siempre fiel de su Palabra.',
          },
        ],
      },
      {
        'VerseName': 'V5',
        'Lines': [
          {
            'LineNumber': 0,
            'Chores': [],
            'Letter': 'No nos domina nunca_el miedo_a la derrota,',
          },
          {
            'LineNumber': 1,
            'Chores': [],
            'Letter': 'la victoria_está ganada_en Jesucristo;',
          },
          {
            'LineNumber': 2,
            'Chores': [],
            'Letter': 'abatidos ya la muerte / y el pecado,',
          },
          {
            'LineNumber': 3,
            'Chores': [

            ],
            'Letter': 'el Señor es vencedor, a / él la gloria.',
          },
        ],
      },
      {
        'VerseName': 'F1',
        'Lines': [
          {
            'LineNumber': 0,
            'Chores': [],
            'Letter': '{ ¡Digno_el Señor de los Ejérci↘tos!',
          },
          {
            'LineNumber': 1,
            'Chores': [],
            'Letter': '¡Fuerte_el Señor Omnipote↘nte!',
          },
          {
            'LineNumber': 2,
            'Chores': [],
            'Letter': '¡Gloria_al Señor Podero↘so!',
          },
          {
            'LineNumber': 3,
            'Chores': [],
            'Letter': '¡Honor al Señor nuestro Dios! } (2)',
          },
          {
            'LineNumber': 4,
            'Chores': [],
            'Letter': '¡Honor al Señor nuestro Dios!',
          },
        ],
      },
    ],
  },
  {'name': 'Barcelona'},
  {'name': 'Real Madrid'},
  {'name': 'Valencia'},
];
Club.collection.insertMany(data, function(err, r) {
  assert.equal(null, err);
  assert.equal(3, r.insertedCount);

  db.close();
});
