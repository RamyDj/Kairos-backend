const mongoose = require('mongoose');

//sous document champs current_compagnies
const current_compagniesSchema = mongoose.Schema({
    status: String,
    creation_date: Date,
    employees: Number,
    coordinates: {Lon: String, Lat: String},
})

//sous document champs compagnies_per_year
const compagniesSchema = mongoose.Schema({
    year: Date,
    compagnies: Number,
})

//sous document detail_top_statusSchema,
const detail_top_statusSchema = mongoose.Schema({
    status_number: String,
    percentage: Number,
    quaterly_one: Number,
    quaterly_two: Number,
    quaterly_three: Number,
})

////clé étrangère de la collection users champs searches
const searchSchema = mongoose.Schema({
  activity: String,
  area: String,
  email: String,
  date: Date,
  current_compagnies: current_compagniesSchema,
  compagnies_per_year: compagniesSchema,
  top_status: [detail_top_statusSchema],
  score: {type: mongoose.Schema.Types.ObjectId, ref: 'score'},
  status_general: [{type: mongoose.Schema.Types.ObjectId, ref: 'status_infos'}],
});

const Search = mongoose.model('searches', searchSchema);

module.exports = Search;