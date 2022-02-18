const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const AutorSchema = new Schema(
    {
      Nombre: {type: String, required: true},
      Apellido: {type: String, required: true},
    },
    {timestamps: true},
);

module.exports = mongoose.model('Autor', AutorSchema);
