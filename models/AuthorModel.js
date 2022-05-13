const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const AutorSchema = new Schema(
    {
      Name: {type: String, required: true},
      LastName: {type: String, required: true},
      History: {type: String},
    },
    {timestamps: true},
);

module.exports = mongoose.model('Autor', AutorSchema);
