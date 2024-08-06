const mongoose = require('mongoose');

//clé étrangère de la collection searches champs score
const scoreSchema = mongoose.Schema({
  average_ca: Number,
  average_life_time: Number,
  density_of_compagnies: Number,
  number_of_openings: Number,
  number_of_closure: Number,
});

const Score = mongoose.model('score', scoreSchema);

module.exports = Score;