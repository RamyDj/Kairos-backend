const mongoose = require('mongoose');

//sous document champs current_compagnies
const current_compagniesSchema = mongoose.Schema({
    name: String,
    status: String,
    creation_date: Date,
    employees: String,
    coordinates: { Object },
})

//sous document detail_top_statusSchema,
const detail_top_statusSchema = mongoose.Schema({
    status_number: Number,
    status_name: String,
    percentage: Number,
    compagnies_per_year: [
        { actual_year: String, number: Number },
        { year_n_minus_1: String, number: Number },
        { year_n_minus_2: String, number: Number }
    ],
})

////clé étrangère de la collection users champs searches
const searchSchema = mongoose.Schema({
    activity: String,
    area: String,
    date: Date,
    current_compagnies: current_compagniesSchema,
    top_status: [detail_top_statusSchema],
    score: { type: mongoose.Schema.Types.ObjectId, ref: 'score' },
    status_general: [{ type: mongoose.Schema.Types.ObjectId, ref: 'status_infos' }],
});

const Search = mongoose.model('searches', searchSchema);

module.exports = Search;