const mongoose = require('mongoose');

//clé étrangère de la collection searches champs score
const scoreSchema = mongoose.Schema({
  average_ca: Number,
  average_lifetime: Number,
  density_of_companies: Number,
  turnover: Number,
});

const Score = mongoose.model('scores', scoreSchema);

module.exports = Score;